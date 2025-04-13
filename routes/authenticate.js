import express from "express";
import passport from "passport";
import {
  getLogin,
  postLogin,
  loginFailure,
  loginSuccess,
  getLogout,
} from "../controller/authenticate.js";
export const authenticateRouter = express.Router();

/**
 * LOGIN ROUTES
 *
 */

// When you visit http://localhost:3000/login, you will see "Login Page"
authenticateRouter.get("/login", getLogin);

/**
 * OPTION 1 for LOGIN
 */
// authenticateRouter.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "login-failure",
//     successRedirect: "login-success",
//   })
// );

/**
 * OPTION 2 for LOGIN
 */
authenticateRouter.post("/login", postLogin);

authenticateRouter.get("/login-failure", loginFailure);
authenticateRouter.get("/login-success", loginSuccess);

/**
 * LOGOUT ROUTES
 */

// Visiting this route logs the user out
authenticateRouter.get("/logout", getLogout);
