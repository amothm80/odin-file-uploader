const directoryTable = document.getElementById("directoryTable");

// const folderModal = document.getElementById("folderDialog");
const folderModal = document.getElementById("dialog");
const createFolderButton = document.getElementById("createFolderPop");

const folderCloseBtn = document.getElementById("cancelFolderDialog");
const folderForm = document.getElementById("folderForm");
const folderErrorMessage = document.getElementById("folderError");

// const uploadFileModal = document.getElementById("fileDialog");
const uploadFileModal = document.getElementById("dialog");
const uploadFileButton = document.getElementById("uploadFilePop");
const uploadFileCloseBtn = document.getElementById("cancelFileDialog");
const uploadFileForm = document.getElementById("fileForm")

// const confirmModal = document.getElementById("confirmDialog");
const confirmModal = document.getElementById("dialog");
const confirmButton = document.getElementById("deleteFilePop");
const confirmCloseBtn = document.getElementById("cancelConfirmDialog");
const confirmForm = document.getElementById("confirmForm");
const confirmMessage = document.getElementById("confirmationText");


function enableFolderForm(){
  folderForm.style.display = 'block'
  uploadFileForm.style.display = 'none';
  confirmForm.style.display = 'none'
}

function enableUploadForm(){
  folderForm.style.display = 'none'
  uploadFileForm.style.display = 'block';
  confirmForm.style.display = 'none'
}

function enableConfirmForm(){
  folderForm.style.display = 'none'
  uploadFileForm.style.display = 'none';
  confirmForm.style.display = 'block'
}
function disableForms(){
  folderForm.style.display = 'none'
  uploadFileForm.style.display = 'none';
  confirmForm.style.display = 'none'
}



folderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const target = e.target;
  const folderName = document.getElementById("folderName").value;
  const url = target.action + target.dataset.folderid;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName }),
    });
    const result = await response.json();
    console.log(result);
    if (result.success) {
      folderModal.style.display = "none";
      disableForms()
      location.reload();
    } else {
      folderErrorMessage.textContent = result.message;
      folderErrorMessage.style.display = "block";
    }
  } catch (err) {
    folderErrorMessage.textContent = "An unexpected error occurred.";
    folderErrorMessage.style.display = "block";
  }
});

confirmForm.addEventListener("submit", async (e) =>{
  e.preventDefault()
  const target = e.target;
  const url= target.action + target.dataset.fileid;
try{
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({fileId: target.dataset.fileid})
  })
  const result = await response.json();
  if (result.success){
    confirmModal.style.display = 'none';
    disableForms()
    location.reload();

  }
}catch{}

  confirmModal.style.display = 'none'
})

/** -----------------------------DIALOG CONTROLS--------------------------- */
createFolderButton.onclick = (e) => {
  folderForm.action = "createFolder?folderId=";
  folderForm.dataset.folderid = e.target.dataset.folderid;
  enableFolderForm();
  folderModal.style.display = "block";
  
};

// renameFolderButton.onclick = (e) => {
//   folderForm.action = 'renameFolder?folderId='
//   folderForm.dataset.folderid = e.target.dataset.folderid
//   folderModal.style.display = "block";
// }

uploadFileButton.onclick = () => {
  enableUploadForm()
  uploadFileModal.style.display = "block";
};
folderCloseBtn.onclick = () => {
  folderForm.action = "";
  folderForm.dataset.folderid = "";
  folderModal.style.display = "none";
  disableForms()
};
confirmCloseBtn.onclick= () =>{
  confirmForm.action = '';
  confirmForm.dataset.fileid = '';
  confirmModal.style.display = 'none';
  disableForms()
}

uploadFileCloseBtn.onclick = () => {
  uploadFileModal.style.display = "none";
  disableForms()
};

window.onclick = (event) => {
  if (event.target === folderModal) {
    folderModal.style.display = "none";
    disableForms()
  }
  if (event.target === uploadFileModal) {
    uploadFileModal.style.display = "none";
    disableForms()
  }
};

directoryTable.addEventListener("click", (e) => {
  console.log(e.target.className);
  switch (e.target.className) {
    case "renameFolderPop":
      folderForm.action = "renameFolder?folderId=";
      folderForm.dataset.folderid = e.target.dataset.folderid;
      enableFolderForm()
      folderModal.style.display = "block";
      break;
    case "deleteFilePop":
      confirmForm.action = "deleteFile?fileId=";
      confirmForm.dataset.fileid = e.target.dataset.fileid;
      enableConfirmForm()
      confirmModal.style.display = "block";
      confirmMessage.textContent = "Are you sure you want to delete the file?";
      break;
  }
});
/** ------------------END DIALOG CONTROLS---------------------------- */
