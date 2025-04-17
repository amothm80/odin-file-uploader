import { getFolderByName, getFolderForPath } from "../model/folder.js"
import { getFilesForFolder } from "../model/file.js"
export async function serveFiles(req, res, next){
    console.log(req.params)
    console.log(req.user.id)
    const userId = req.user.id;
    let folderPath = '';
    if (req.params.folderPath){
        folderPath = req.params.folderPath.join('/')
    }
    console.log(`folder path = ${folderPath}`)
    
    const folderDetails = await getFolderByName(req.user.id, folderPath)
    console.log(folderDetails)
    const pathFolders = await getFolderForPath(req.user.id, folderPath)
    console.log(pathFolders)
    const files = await getFilesForFolder(req.user.id,folderDetails.id)
    console.log(files)
    res.locals.user = req.user
    res.locals.folderDetails = folderDetails;
    res.locals.pathFolders = pathFolders;
    res.locals.files = files;
    res.render("files")
}

export async function createFolder(req,res,next){
    console.log(req)
    res.render('files')
}