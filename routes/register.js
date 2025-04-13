import express from "express";
import { registerUser,registrationValidation } from "../controller/register.js";


export const registerRouter = express.Router();

registerRouter.get("/register", (req, res, next) => {
  console.log("registration route")

  res.render("register");
});

registerRouter.post("/register", registrationValidation(), registerUser);
