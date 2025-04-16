import { prisma } from "../config/database.js";

export async function getFiles(userId){
    return await prisma.file.findMany({
        where:{
            userId:userId
        }
    })
}

export async function getFilesForFolder(userId, folderId){
    return await prisma.file.findMany({
        where:{
            userId: userId,
            folderId: folderId
        }
    })
}

export async function createFile(name,folderId,userId,fileData){
    return await prisma.file.create({
        data:{
            name:name,
            folderId:folderId,
            userId:userId,
            location:'', //TODO
            size: 0 //TODO
        }
    })
}

export async function renameFile(id,name){
    return await prisma.file.update({
        where:{
            id:id
        },
        data:{
            name:name
        }
    })
}

export async function deleteFile(id){
    return await prisma.file.delete({
        where:{
            id:id
        }
    })
}