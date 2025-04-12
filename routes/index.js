import express from "express";
import session from "express-session";
import passport from "passport";
import { validatePassword, genPassword } from "../lib/passwordUtils.js";
import { isAuthenticated, isAdmin } from "./authentication.js";
import {prisma} from '../config/database.js';

export const router = express.Router();

/**
 * -------------- POST ROUTES ----------------
 */
// both options below will work. req.session.xxx can be used to 
// send information during redirect
// OPTION 1
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login-failure",
//     successRedirect: "login-success"
//   })
// );

//OPTION 2
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    console.log(user)
    console.log(err)
    console.log(info)
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login-failure");
    }
   

    // // NEED TO CALL req.login()!!!

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/login-success");
    });
  })(req, res, next);
});

// TODO
router.post("/register", async (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  await prisma.user.create({
    data:{
      email: req.body.email,
      hash: saltHash.hash,
      salt: saltHash.salt,
    }
  })
  // await pool.query(
  //   "INSERT INTO users (username, hash, salt) VALUES ($1, $2, $3)",
  //   [req.body.username, saltHash.hash, saltHash.salt]
  // );
  res.redirect("/");
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Email:<br><input type="text" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Email:<br><input type="text" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get("/protected-route", isAuthenticated, (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant

  res.send(
    '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send(
    '<h1>You are an admin</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/protected-route");
    }
  });
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});
