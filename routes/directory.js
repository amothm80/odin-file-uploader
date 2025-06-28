import express from "express";
import {
  serveDirectory,
  createFolder,
  uploadFile,
  downloadFile,
  folderNameValidation,
  renameFolder,
  verifyFolderOwnership,
  fileFilter,
  deleteFile,
  deleteFolder
} from "../controller/directory.js";
import multer from "multer";

const upload = multer({ dest: "uploads/",fileFilter: fileFilter });

export const directoryRouter = express.Router();

directoryRouter.use(verifyFolderOwnership)
directoryRouter.get("/directory/", serveDirectory);
// directoryRouter.get("/directory/*folderId", serveDirectory);
directoryRouter.post("/directory/createFolder", folderNameValidation(), createFolder);
directoryRouter.post("/directory/renameFolder", folderNameValidation(), renameFolder);
directoryRouter.post("/directory/uploadFile", upload.single("fileUpload"), uploadFile);
directoryRouter.post("/directory/deleteFile", deleteFile)
directoryRouter.post("/directory/deleteFolder", deleteFolder)
directoryRouter.get("/directory/downloadFile", downloadFile);
// directoryRouter.post("/directory/*folderId/createFolder",createFolder)
