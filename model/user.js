import { prisma } from "../config/database.js";

const userSelectFields = {
  id: true,
  email: true,
  creationDate: true,
  files: true,
  folders: true,
};

const userSelectFieldsForAuth = {
  id: true,
  email: true,
  hash: true,
  salt: true,
};

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: userSelectFields,
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: userSelectFields,
  });
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: userSelectFields,
  });
}

export async function getUserByEmailForAuth(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: userSelectFieldsForAuth,
  });
}

export async function createUser(email, hash, salt) {
  return await prisma.user.create({
    data: {
      email: email,
      hash: hash,
      salt: salt,
    },
  });
}

// await prisma.user.create({
//   data: {},
// });
