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

export async function updateEmail(id,email){
  return await prisma.user.update({
    where:{
      id:id
    },
    data:{
      email:email
    }
  })
}

export async function updatePasswordById(id,hash,salt){
  return await prisma.user.update({
    where:{
      id:id
    },
    data:{
      hash:hash,
      salt:salt
    }
  })
}

export async function updatePasswordByEmail(email,hash,salt){
  return await prisma.user.update({
    where:{
      email:email
    },
    data:{
      hash:hash,
      salt:salt
    }
  })
}

export async function deleteAccountById(id){
  return await prisma.user.delete({
    where:{
      id:id
    }
  })
}

export async function deleteAccountByEmail(email){
  return await prisma.user.delete({
    where:{
      email:email
    }
  })
}

// await prisma.user.create({
//   data: {},
// });
