import {
  getFolderById_userId,
  getFolderById,
  getFoldersForParent,
  createChildFolder,
  getFolderByName_parentFolderId,
  renameFolder as renameFolderDb,
  deleteFolder as deleteFolderDb,
} from "../model/folder.js";
import { body, matchedData, validationResult } from "express-validator";
import {
  createFile,
  getFileById,
  getFilesForFolder,
  getFileByName_userId_folderId,
  deleteFile as deleteFileDb,
} from "../model/file.js";
import { getFileLocation } from "../lib/utils.js";
import { consoleLogReq } from "../lib/utils.js";
import fs from "fs";

export const folderNameValidation = () => {
  // return
  return [
    body("folderName")
      .trim()
      .notEmpty()
      .withMessage("Folder name cannot be empty")
      .custom(async (value, { req }) => {
        let parentFolderId;
        if (!req.query.parentFolderId) {
          const folder = await getFolderById(req.query.folderId);
          parentFolderId = folder.parentFolderId;
        } else {
          parentFolderId = req.query.parentFolderId;
        }
        const folder = await getFolderByName_parentFolderId(
          value,
          parentFolderId
        );
        if (folder) {
          throw new Error("Folder already exists in this directory");
          // return Promise.reject("Folder already exists in this directory")
        }
      }),
  ];
};

export async function verifyFolderOwnership(req, res, next) {
  let folderId = null;
  if (req.query && req.query.folderId) {
    folderId = req.query.folderId;
  }
  if (req.body && req.body.folderId) {
    folderId = req.body.folderId;
  }
  if (req.params && req.params.folderId) {
    folderId = req.params.folderId;
  }

  if (folderId) {
    // console.log(folderId);
    const folderDetails = await getFolderById(folderId);
    // console.log(folderDetails)
    // console.log(req.user.id)
    if (folderDetails && folderDetails.userId == req.user.id) {
      // console.log(`folder.user: ${folderDetails.userId} == actual user: ${req.user.id}`)
      next();
    } else {
      throw new Error("Folder not found or folder does not belong to user");
    }
  } else {
    next();
  }
}

export async function verifyFileOwnership(req, res, next) {
  next();
}

async function getFolderPath(userId, id) {
  let path = "";
  while (1) {
    let folderDetails = await getFolderById_userId(userId, id);
    path = folderDetails.name + "/" + path;
    if (folderDetails.parentFolderId == null) {
      break;
    }
    id = folderDetails.parentFolderId;
  }
  return path;
}

export async function serveDirectory(req, res, next) {
  let folderId = "";
  const userId = req.user.id;
  let folderDetails = "";
  if (req.query.folderId) {
    folderId = req.query.folderId;
    folderDetails = await getFolderById_userId(userId, folderId);
  } else {
    folderDetails = await getFoldersForParent(userId);
    folderDetails = folderDetails[0];
    folderId = folderDetails.id;
  }
  if (!folderId) {
    throw new Error("Folder Id not found");
  } else {
    const childFolders = await getFoldersForParent(userId, folderId);
    const files = await getFilesForFolder(userId, folderId);
    const path = await getFolderPath(userId, folderId);
    res.locals.user = req.user;
    res.locals.path = path ? path : "/";
    console.log(folderDetails);
    res.locals.folderDetails = folderDetails;
    res.locals.childFolders = childFolders;
    res.locals.files = files;
    res.render("directory");
  }
}

export async function createFolder(req, res, next) {
  try {
    const result = validationResult(req);
    console.log(result);

    if (req.user.id && result.isEmpty()) {
      const data = matchedData(req);
      console.log("data:")
      console.log(data)
      console.log(await createChildFolder(req.user.id, data.folderName, req.query.parentFolderId));
      res.json({ success: true, message: "folder creation success" });
    } else {
      res.json({ success: false, message: result.errors[0].msg });
    }
  } catch (err) {
    throw err;
    // console.log("Folder Creation Error:")
    // // console.log(typeof err)
    // console.error(err);
    // res.render("500");
  }
}

export async function renameFolder(req, res, next) {
  try {
    const result = validationResult(req);
    console.log(result);
    if (result.isEmpty()) {
      const data = matchedData(req);
      await renameFolderDb(req.query.folderId, data.folderName);
      res.json({ success: true, message: "Folder Renamed" });
    } else {
      res.json({ success: false, message: result.errors[0].msg });
    }
  } catch (err) {
    console.log("Folder Rename Error:");
    console.error(err);
    // res.render("500");
    throw err;
  }
}

export async function fileFilter(req, file, cb) {
  /**
   * 
   * user:
{
  id: '01JS407V805P2RRHW6D8GJQ211',
  email: 'charlie@example.com',
  creationDate: 2025-04-18T08:28:59.008Z
}
params:
[Object: null prototype] {}
query:
[Object: null prototype] { folderId: '01JS407V8HM69GZMPVRYG0FV90' }
body:
[Object: null prototype] {}
file:
undefined
url:
/directory/uploadFile?folderId=01JS407V8HM69GZMPVRYG0FV90
{
  fieldname: 'fileUpload',
  originalname: 'impracticalpythonprojects.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf'
}
   * 
   */
  const fileDb = await getFileByName_userId_folderId(
    file.originalname,
    req.user.id,
    req.query.folderId
  );

  // console.log(fileDb)
  if (fileDb) {
    // cb(new Error("file exists"))
    cb(null, false);
  } else {
    cb(null, true);
  }
}

export async function uploadFile(req, res, next) {
  try {
    if (req.file) {
      createFile(
        req.file.originalname,
        req.query.folderId,
        req.user.id,
        req.file.mimetype,
        req.file.filename,
        req.file.size
      );
      res.redirect(String(req.get("Referrer")).replace("uploadFile", ""));
    } else {
      res.json({
        success: false,
        message: "File already exists in this folder",
      });
    }
  } catch (err) {
    throw err;
  }
}

export async function downloadFile(req, res, next) {
  console.log("DOWNLOAD FILE");
  const file = await getFileById(req.query.fileId);
  console.log("file ID: ");
  console.log(file);
  const fileLocation = getFileLocation(file.localfilename);
  res.set("Content-Disposition", `attachment; filename=${file.name}`);
  res.sendFile(fileLocation);
  // res.attachment("uploads/db7e753ba0a83eb2f6232d7fe2df17d0")
  // rs.pipe(res)
  // res.render('login-success')
  // res.redirect(String(req.get("Referrer")).replace("downloadFile", ""));
  // res.set("Content-Disposition", 'attachment; filename="doc.pdf"');
  // res.sendFile(
  //   "/home/ahmed/workspace/odinproject/odin-file-uploader/uploads/db7e753ba0a83eb2f6232d7fe2df17d0"
  // );
}

async function deleteUnlinkFile(fileId) {
  const file = await getFileById(fileId);
  const fileLocation = getFileLocation(file.localfilename);
  fs.unlink(fileLocation, async (err) => {
    if (err) console.log(err);
    else {
      await deleteFileDb(file.id);
    }
  });
}

export async function deleteFile(req, res, next) {
  try {
    console.log("to be deleted file id: ");
    console.log(req.query.fileId);
    deleteUnlinkFile(req.query.fileId);
    res.json({ success: true, message: "File Deleted" });
  } catch (err) {
    console.log("File Delete Error:");
    console.error(err);
    // res.render("500");
    throw err;
  }
}

async function getChildFolderFiles(userId, folderId){
  let folders = [];
  let files = []
  let exit = 1;
  folders = await getFoldersForParent(userId, folderId);
  files = await getFilesForFolder(userId,folderId);
  // result = result.concat(folders);
  // result = result.concat(files);
  return folders, files;
}

export async function deleteFolder(req, res, next) {
  try {
    console.log("DELETE FOLDER METHOD");
    const folderId = req.query.folderId;
    console.log("FOLDER ID :" + folderId);
    console.log(await getChildFolderFiles(req.user.id, folderId))
    // const result = await deleteFolderDb(folderId);

    // const folders = await getFoldersForParent(req.user.id, folderId)
    // const files = await getFilesForFolder(req.user.id,folderId)
    // console.log(files)
    // console.log(folders)
    // for (const file in files){
    //   console.log(file)
    // }
    res.json({ success: true, message: "Folder Deleted" });
  } catch (err) {
    throw err;
  }
}
