import { prisma } from "../config/database.js";
import { getFoldersForParent, getFolderById} from "../model/folder.js";

async function getFolderPath(userId,id){
    let path = ''
    while(1){
        let folderDetails = await getFolderById(userId,id)
        path = folderDetails.name + '/' + path
        if (folderDetails.parentFolderId == null) {
            break;
        }
        id = folderDetails.parentFolderId
    }
    return path
}

console.log(
    await getFolderPath('01JS407V7XP15BG16B7NDF251T', '01JS407V7XP15BG16E7NDF232F')
    // await getFolderById('01JS407V7XP15BG16B7NDF251T','01JS407V89JQF7E1AK89XP4X6C')
    //await getFoldersForParent('01JS407V7XP15BG16B7NDF251T','01JS407V83YJN689XW9AB1BAJN')
    //await getFoldersForParent('01JS407V7XP15BG16B7NDF251T')

)