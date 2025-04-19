import express from "express";
import { serveFiles ,createFolder, uploadFile, downloadFile} from "../controller/files.js";
import multer from 'multer'

const upload = multer({dest: 'uploads/'})

export const filesRouter = express.Router();

filesRouter.get("/files/", serveFiles);
// filesRouter.get("/files/*folderId", serveFiles);
filesRouter.post("/files/createFolder",createFolder)
filesRouter.post("/files/uploadFile",upload.single('fileUpload'), uploadFile)
filesRouter.get("/downloadFile",downloadFile)
// filesRouter.post("/files/*folderId/createFolder",createFolder)
