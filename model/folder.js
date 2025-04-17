import { prisma } from "../config/database.js";

export async function getAllFolders(userId){
    return await prisma.folder.findMany({
        where:{
            userId:userId
        }
    })
}

export async function getFolderForPath(userId, path){
    return await prisma.folder.findMany({
        where:{
            userId: userId,
            name: {
                startsWith: path
            }
        }
    })
}

export async function getFolderByName(userId, name){
    return await prisma.folder.findUnique({
        where:{
            name_userId:{
                userId: userId,
                name:name
            }

        }
    })
}

export async function createFolder(userId,name){
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