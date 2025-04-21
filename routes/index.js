import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { validatePassword, genPassword } from "../lib/passwordUtils.js";
// import { createUser } from "../model/user.js";
import { authenticateRouter } from "./authenticate.js";
import { registerRouter } from "./register.js";
import { directoryRouter } from "./directory.js";
export const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("root route")
  res.redirect('/login')
});

/**
 * LOGIN ROUTE & LOGOUT ROUTE
 *
 */

router.use(authenticateRouter)


/**
 * REGISTRATION ROUTES
 */

router.use(registerRouter)


router.use((req,res,next)=>{
  console.log("login redirect when unauthenticated")
  console.log("Authenticated:", req.isAuthenticated());

  if (!req.isAuthenticated()){
    res.redirect('/login')
  }else{
    next()
  }

})

router.use(directoryRouter)
