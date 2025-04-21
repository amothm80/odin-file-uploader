const directoryTable = document.getElementById("directoryTable")

const folderModal = document.getElementById("folderDialog");
const createFolderButton = document.getElementById("createFolderPop");

const folderCloseBtn = document.getElementById("cancelFolderDialog");
const folderForm = document.getElementById("folderForm")
const folderErrorMessage = document.getElementById("folderError")

const uploadFileModal = document.getElementById("fileDialog");
const uploadFileButton = document.getElementById("uploadFilePop");
const uploadFileCloseBtn = document.getElementById("cancelFileDialog");

directoryTable.addEventListener("click", (e)=>{
  console.log(e.target.className)
  switch (e.target.className){
    case "renameFolderPop":
      folderForm.action = 'renameFolder?folderId='
      folderForm.dataset.folderid = e.target.dataset.folderid
      folderModal.style.display = "block";
      break;
  }
})

folderForm.addEventListener('submit',async (e)=>{
  e.preventDefault()
  const target = e.target;
  const folderName = document.getElementById("folderName").value
  const url = target.action + target.dataset.folderid
  try{
    const response = await fetch(url,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderName })
    })
    console.log(response)
    const result = await response.json()
    console.log(result)
    if (result.success){
      folderModal.style.display = "none";
      location.reload()
    }else{
      folderErrorMessage.textContent = result.message;
      folderErrorMessage.style.display = "block";
    }
  }catch(err){
    folderErrorMessage.textContent = "An unexpected error occurred.";
    folderErrorMessage.style.display = "block";
  }
})

/** -----------------------------DIALOG CONTROLS--------------------------- */
createFolderButton.onclick = (e) => {
  folderForm.action = 'createFolder?folderId='
  folderForm.dataset.folderid = e.target.dataset.folderid
  folderModal.style.display = "block";
}

// renameFolderButton.onclick = (e) => {
//   folderForm.action = 'renameFolder?folderId='
//   folderForm.dataset.folderid = e.target.dataset.folderid
//   folderModal.style.display = "block";
// }

uploadFileButton.onclick = () => {
  uploadFileModal.style.display = "block";
}
folderCloseBtn.onclick = () => {
  folderForm.action = ''
  folderForm.dataset.folderid = ''
  folderModal.style.display = "none";
}

uploadFileCloseBtn.onclick = () => {
  uploadFileModal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target === folderModal) {
    folderModal.style.display = "none";
  }
  if (event.target === uploadFileModal) {
    uploadFileModal.style.display = "none";
  }
}
/** ------------------END DIALOG CONTROLS---------------------------- */