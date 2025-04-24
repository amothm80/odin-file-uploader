import {
  getFolderById_userId,
  getFolderById,
  getFoldersForParent,
  createChildFolder,
  getFolderByName_parentFolderId,
  renameFolder as renameFolderDb,
} from "../model/folder.js";
import { createFile } from "../model/file.js";
import { body, matchedData, validationResult } from "express-validator";
import {
  getFilesForFolder,
  getFileByName_userId_folderId,
} from "../model/file.js";
import { consoleLogReq } from "../lib/utils.js";

export const folderNameValidation = () => {
  // return
  return [
    body("folderName")
      .trim()
      .notEmpty()
      .withMessage("Folder name cannot be empty")
      .custom(async (value, { req }) => {
        const folder = await getFolderByName_parentFolderId(
          value,
          req.query.folderId
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
    if (req.user.id && result.isEmpty()) {
      const data = matchedData(req);
      await createChildFolder(req.user.id, data.folderName, req.query.folderId);
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
    if (result.isEmpty()) {
      const data = matchedData(req);
      await renameFolderDb(req.query.folderId, data.folderName);
      res.json({ success: true, message: "Folder Renamed" });
    } else {
      res.json({ success: false, message: result.errors[0].msg });
    }
  } catch (err) {
    throw err;
    // console.log("Folder Rename Error:");
    // console.error(err);
    // res.render("500");
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
  // res.attachment("uploads/db7e753ba0a83eb2f6232d7fe2df17d0")
  // rs.pipe(res)
  // res.render('login-success')
  // res.redirect(String(req.get("Referrer")).replace("downloadFile", ""));
  res.set("Content-Disposition", 'attachment; filename="doc.pdf"');
  res.sendFile(
    "/home/ahmed/workspace/odinproject/odin-file-uploader/uploads/db7e753ba0a83eb2f6232d7fe2df17d0"
  );
}
