import { prisma } from "../config/database.js";

export async function getAllFolders(userId){
    return await prisma.folder.findMany({
        where:{
            userId:userId
        }
    })
}

export async function getFoldersForParent(userId, parentId = null){
    return await prisma.folder.findMany({
        where:{
            userId:userId,
            parentFolderId: parentId
        }
    })
}

export async function getFolderById(userId, id){
    return await prisma.folder.findUnique({
        where:{
            id_userId:{
                id:id,
                userId:userId
            }
        }
    })
}

// export async function getFolderForPath(userId, path){
//     return await prisma.folder.findMany({
//         where:{
//             userId: userId,
//             name: {
//                 startsWith: path
//             }
//         }
//     })
// }

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

export async function createRootFolder(userId,name){
    return await prisma.folder.create({
        data:{
            name:name,
            userId:userId,
        }
    })
}

export async function createChildFolder(userId,name,parentId){
    return await prisma.folder.create({
        data:{
            name:name,
            userId:userId,
            parentFolderId: parentId
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