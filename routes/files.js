import express from "express";
import { serveFiles ,createFolder} from "../controller/files.js";
export const filesRouter = express.Router();

filesRouter.get("/files/", serveFiles);
filesRouter.get("/files/*folderId", serveFiles);
filesRouter.post("/files/createFolder",createFolder)
filesRouter.post("/files/*folderId/createFolder",createFolder)
