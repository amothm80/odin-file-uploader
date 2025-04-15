import { prisma } from "../config/database.js";

export async function getFoldersForUser(userId){
    return await prisma.folder.findMany({
        where:{
            userId:userId
        }
    })
}

export async function createFolderForUser(userId,name){
    return await prisma.folder.create({
        data:{
            name:name,
            userId:userId
        }
    })
}

export async function renameFolder(id,name){
    return await prisma.folder.update({
        where:{
            id:id
        },
        data:{
            name:name
        }
    })
}

export async function deleteFolder(id){
    return await prisma.folder.delete({
        where:{
            id:id
        }
    })
}