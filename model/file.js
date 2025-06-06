import { prisma } from "../config/database.js";

export async function getFileById(fileId){
    return await prisma.file.findUnique({
        where:{
            id: fileId
        }
    })
}

export async function getFiles(userId){
    return await prisma.file.findMany({
        where:{
            userId:userId
        }
    })
}

export async function getFileByName_userId_folderId(name,userId,folderId){
    return await prisma.file.findUnique({
        where:{
            name_userId_folderId:{
                name: name,
                folderId: folderId,
                userId: userId
            }
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

export async function createFile(name,folderId,userId,mimetype,localfilename,size){
    return await prisma.file.create({
        data:{
            name:name,
            mimetype: mimetype,
            localfilename: localfilename,
            size: size ,
            folderId:folderId,
            userId:userId,
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