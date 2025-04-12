import path from "node:path";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import helmet from 'helmet';
import { __dirname } from "./lib/dirname.js";
import { router } from "./routes/index.js";
import { PrismaSessionStore }  from '@quixo3/prisma-session-store';
import { prisma } from "./config/database.js";

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.removeHeader('Server');
    next();
});
app.use(helmet())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

/**
 * utilizes connect-pg-simple. requires postgres database
 * use the below command to create the session table
 * psql mydatabase < node_modules/connect-pg-simple/table.sql
 */

const sessionStore = new PrismaSessionStore(
  prisma,
  {
    checkPeriod: 2 * 60 * 1000,  //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }
);

app.use(
  session({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
import './config/passport.js';
app.use(passport.session());

app.use((req,res,next)=>{
  console.log(req.user)
  next()
})

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(router);

/**
 * Error
 */

app.use((err,req,res,next)=>{
  console.error(new Date().toISOString())
  console.log(err)
  res.status(500).send(`Something broke!`)
})

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000, () => console.log("app listening on port 3000"));

