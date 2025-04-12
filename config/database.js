
// import "dotenv/config";
// import pg from "pg";

// const { Pool } = pg;

// export const pool = new Pool({
//   host: process.env.DBHOST,
//   user: process.env.DBUSER,
//   database: process.env.DB,
//   password: process.env.DBPASSWORD,
//   port: process.env.DBPORT,
//   // ssl:true,
// });


import { PrismaClient } from '../generated/prisma/client.js'

export const prisma = new PrismaClient()