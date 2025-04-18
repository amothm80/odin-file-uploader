import {
  getFolderByName,
  getFolderForPath,
  createFolder as createFolderDB,
} from "../model/folder.js";
import { getFilesForFolder } from "../model/file.js";
export async function serveFiles(req, res, next) {
  console.log(req.params);
  console.log(req.user.id);
  const userId = req.user.id;
  let folderPath = "";
  if (req.params.folderPath) {
    folderPath = req.params.folderPath.join("/");
  }
  console.log(`folder path = ${folderPath}`);
  folderPath = folderPath.slice(-1) == '/' ? folderPath.slice(0,-1):folderPath;
  const folderDetails = await getFolderByName(req.user.id, folderPath);
  //   console.log(folderDetails);
  let pathFolders = await getFolderForPath(req.user.id, folderPath);
//   console.log(" get files for folder: "+req.user.id+' ' +folderDetails)
  const files = await getFilesForFolder(req.user.id, folderDetails.id);
  //   console.log(files);
//   console.log(pathFolders);

  res.locals.user = req.user;
  res.locals.folderDetails = folderDetails;
  res.locals.pathFolders = pathFolders;
  res.locals.files = files;
  res.render("files");
}

export async function createFolder(req, res, next) {
  try {
    if (req.body.folderName) {
        console.log(req.url)
    //   await createFolderDB(req.user.id, req.body.folderName);
      res.redirect(String(req.get("Referrer")).replace("createFolder", ""));
    } else {
      throw new Error("Folder name is missing");
    }
  } catch (err) {
    console.log(err);
    res.render("500");
  }
}
