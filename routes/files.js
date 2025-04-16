import express from "express";
import { serverFiles } from "../controller/files.js";
export const filesRouter = express.Router();

// filesRouter.get("/user/:userId/",serverFiles)
filesRouter.get("/user/:userId/*",serverFiles)