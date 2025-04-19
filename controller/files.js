import {
  getFolderById,
  getRootFolderForUser,
  getFoldersForParent,
  createChildFolder,
  //   createFolder as createFolderDB,
} from "../model/folder.js";
import { getFilesForFolder } from "../model/file.js";
async function getFolderPath(userId, id) {
  let path = "";
  while (1) {
    let folderDetails = await getFolderById(userId, id);
    path = folderDetails.name + "/" + path;
    if (folderDetails.parentFolderId == null) {
      break;
    }
    id = folderDetails.parentFolderId;
  }
  return path;
}

export async function serveFiles(req, res, next) {
  console.log(req.params);
  console.log(req.query);
  //   console.log(req.user.id);
  let folderId = "";
  const userId = req.user.id;
  let folderDetails = "";
  //   if (req.params.folderId){
  if (req.query.folderId) {
    // folderId = req.params.folderId[0]
    folderId = req.query.folderId;
    folderDetails = await getFolderById(userId, folderId);
  } else {
    folderDetails = await getFoldersForParent(userId);
    folderDetails = folderDetails[0];
    console.log(folderDetails);
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
    res.render("files");
  }
}

export async function createFolder(req, res, next) {
  console.log("body:");
  console.log(req.body);
  console.log("params:");

  console.log(req.params);
  console.log("query:");

  console.log(req.query);
  try {
    if (req.user.id,req.body.folderName,req.query.folderId) {
      console.log("url:");

      console.log(req.url);
      await createChildFolder(
        req.user.id,
        req.body.folderName,
        req.query.folderId
      );

      res.redirect(String(req.get("Referrer")).replace("createFolder", ""));
    } else {
      throw new Error("Folder details are missing");
    }
  } catch (err) {
    console.log(err);
    res.render("500");
  }
}
