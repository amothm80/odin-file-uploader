const createFolderModal = document.getElementById("createFolderDialog");
const createFolderButton = document.getElementById("createFolderPop");
const createFolderCloseBtn = document.getElementById("cancelCreateFolder");
const createFolderForm = document.getElementById("createFolderForm")
const createFolderErrorMessage = document.getElementById("createFolderError")

const uploadFileModal = document.getElementById("uploadFileDialog");
const uploadFileButton = document.getElementById("uploadFilePop");
const uploadFileCloseBtn = document.getElementById("cancelFileUpload");


createFolderForm.addEventListener('submit',async (e)=>{
  e.preventDefault()
  const target = e.target;
  const folderName = document.getElementById("folderName").value
  const folderId = target.dataset.folderid;
  console.log(folderId)
  console.log(folderName)
  try{
    const response = await fetch(target.action,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folderName })
    })
    const result = await response.json()
    if (result.success){
      createFolderModal.style.display = "none";
      location.reload()
    }else{
      createFolderErrorMessage.textContent = result.message;
      createFolderErrorMessage.style.display = "block";
    }
  }catch(err){
    createFolderErrorMessage.textContent = "An unexpected error occurred.";
    createFolderErrorMessage.style.display = "block";
  }
})

/** -----------------------------DIALOG CONTROLS--------------------------- */
createFolderButton.onclick = () => {
  createFolderModal.style.display = "block";
}

uploadFileButton.onclick = () => {
  uploadFileModal.style.display = "block";
}
createFolderCloseBtn.onclick = () => {
  createFolderModal.style.display = "none";
}

uploadFileCloseBtn.onclick = () => {
  uploadFileModal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target === createFolderModal) {
    createFolderModal.style.display = "none";
  }
  if (event.target === uploadFileModal) {
    uploadFileModal.style.display = "none";
  }
}
/** ------------------END DIALOG CONTROLS---------------------------- */