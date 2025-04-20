import {
  getFolderById,
  getFoldersForParent,
  createChildFolder,
  getFolderByName_parentFolderId
} from "../model/folder.js";
import { body, matchedData, validationResult } from "express-validator";
import { getFilesForFolder } from "../model/file.js";

export const createFolderValidation = () =>{
  return [
    body("folderName")
    .trim().isEmpty().withMessage("shoud be empty")
    // .notEmpty().withMessage("Folder name cannot be empty")
    // .custom(async (value , {req}) =>{
    //   const folder = await getFolderByName_parentFolderId(value,req.query.folderId)
    //   if (folder){
    //     return Promise.reject("Folder name already taken in this directory")
    //   }
    // })
  ]
}

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
  let folderId = "";
  const userId = req.user.id;
  let folderDetails = "";
  if (req.query.folderId) {
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
 
  console.log("create folder function:")
  try {
    const result = validationResult(req);
    console.log("result:")
    console.log(result)
    if (req.user.id && result.isEmpty()) {
      const data = matchedData(req);
      console.log("data:") 
      console.log( data)
      // let result = await createChildFolder(
      //   req.user.id,
      //   data.folderName,
      //   req.query.folderId
      // );
      // console.log("result:");
      // console.log(result)

      // res.redirect(String(req.get("Referrer")).replace("createFolder", ""));
      res.json({success:true,message:"folder creation success"})

    } else {
      throw new Error("Folder details are missing");
    }
  } catch (err) {
    console.log("error type:")
    // console.log(typeof err)
    console.log(err);
    res.json({success:false,message:err.msg})

    // res.render("500");
  }
}

export async function uploadFile(req,res,next){
    console.log("body:");
    console.log(req.body);
    console.log("params:");
  
    console.log(req.params);
    console.log("query:");
  
    console.log(req.query);
    console.log("url:");

    console.log(req.url);

    console.log('file:')
    console.log(req.file)
    res.redirect(String(req.get("Referrer")).replace("uploadFile", ""));
}

export async function downloadFile(req,res,next){
    // res.attachment("uploads/db7e753ba0a83eb2f6232d7fe2df17d0")
    // rs.pipe(res)
    // res.render('login-success')
    // res.redirect(String(req.get("Referrer")).replace("downloadFile", ""));
    res.set("Content-Disposition", 'attachment; filename="doc.pdf"');
    res.sendFile("/home/ahmed/workspace/odinproject/odin-file-uploader/uploads/db7e753ba0a83eb2f6232d7fe2df17d0");
}