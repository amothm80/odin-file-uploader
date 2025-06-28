const directoryTable = document.getElementById("directoryTable");

const modal = document.getElementById("dialog");

//Folder Form
const createFolderButton = document.getElementById("createFolderPop");
const folderCloseBtn = document.getElementById("cancelFolderDialog");
const folderForm = document.getElementById("folderForm");
const folderErrorMessage = document.getElementById("folderError");

//Upload Form
const uploadFileButton = document.getElementById("uploadFilePop");
const uploadFileCloseBtn = document.getElementById("cancelFileDialog");
const uploadFileForm = document.getElementById("fileForm");

//Confirm Form
// const confirmButton = document.getElementById("deleteFilePop");
const confirmCloseBtn = document.getElementById("cancelConfirmDialog");
const confirmForm = document.getElementById("confirmForm");
const confirmMessage = document.getElementById("confirmationText");

//Messages
const messageDiv = document.getElementById("messages");
const messageText = document.getElementById("messageText");
const closeMessageBtn = document.getElementById("closeMessage");

function enableFolderForm() {
  // modal.style.display = "block";
  modal.showModal();
  folderForm.style.display = "block";
  uploadFileForm.style.display = "none";
  confirmForm.style.display = "none";
  messageDiv.style.display = "none";
  messageText.textContent = "";
  messageText.className = "";
}

function enableUploadForm() {
  // modal.style.display = "block";
  modal.showModal();
  folderForm.style.display = "none";
  uploadFileForm.style.display = "block";
  confirmForm.style.display = "none";
  messageDiv.style.display = "none";
  messageText.textContent = "";
  messageText.className = "";
}

function enableConfirmForm() {
  // modal.style.display = "block";
  modal.showModal();
  folderForm.style.display = "none";
  uploadFileForm.style.display = "none";
  confirmForm.style.display = "block";
  messageDiv.style.display = "none";

  messageText.textContent = "";
  messageText.className = "";
}

function enableMessages(type, text) {
  // modal.style.display = "block";
  // modal.showModal();
  folderForm.style.display = "none";
  uploadFileForm.style.display = "none";
  confirmForm.style.display = "none";
  messageDiv.style.display = "block";

  messageText.textContent = text;
  messageText.className = type;
}

function disableForms() {
  folderForm.style.display = "none";
  uploadFileForm.style.display = "none";
  confirmForm.style.display = "none";
  messageDiv.style.display = "none";
  folderErrorMessage.textContent = "";
  folderErrorMessage.style.display = "none";
  // modal.style.display = "none";
  modal.close("close modal");
}

//create folder routine
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
    // console.log(result);
    if (result.success) {
      disableForms();
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

//confirmation routine
//TODO add file routine
confirmForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const target = e.target;
  const action = e.target.action;
  const fileid = e.target.dataset.fileid;
  const folderid = e.target.dataset.folderid;
  const name = e.target.name;
  console.log(target);
  let url = "";
  if (name == "deleteFolderForm") {
    url = target.action + target.dataset.folderid;
  }
  if (name == "deleteFileForm") {
    url = target.action + target.dataset.fileid;
  }

  try {
    let body = "";
    if ((name == "deleteFolderForm")) {
      body = JSON.stringify({ fileId: target.dataset.folderid });
    }
    if ((name == "deleteFileForm")) {
      body = JSON.stringify({ fileId: target.dataset.fileid });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const result = await response.json();
    if (result.success) {
      disableForms();
      // location.reload();
    } else {
      // enableMessages("error", result.message);
    }
  } catch {
    enableMessages("error", "An unexpected error has occured");
  }

  // modal.style.display = "none";
});

/** -----------------------------DIALOG CONTROLS--------------------------- */
createFolderButton.onclick = (e) => {
  folderForm.action = "createFolder?parentFolderId=";
  folderForm.dataset.folderid = e.target.dataset.folderid;
  enableFolderForm();
};

// renameFolderButton.onclick = (e) => {
//   folderForm.action = 'renameFolder?folderId='
//   folderForm.dataset.folderid = e.target.dataset.folderid
//   modal.style.display = "block";
// }

uploadFileButton.onclick = () => {
  enableUploadForm();
};
folderCloseBtn.onclick = () => {
  folderForm.action = "";
  folderForm.dataset.folderid = "";
  disableForms();
};
confirmCloseBtn.onclick = () => {
  confirmForm.action = "";
  confirmForm.dataset.fileid = "";
  disableForms();
};

uploadFileCloseBtn.onclick = () => {
  disableForms();
};

closeMessageBtn.onclick = () => {
  disableForms();
};

// window.onclick = (event) => {
//   if (event.target === modal) {
//     disableForms();
//   }
// };

directoryTable.addEventListener("click", (e) => {
  // console.log(e.target.className);
  switch (e.target.className) {
    case "renameFolderPop":
      folderForm.action = "renameFolder?folderId=";
      folderForm.dataset.folderid = e.target.dataset.folderid;
      folderForm.name = "renameFolderForm";
      enableFolderForm();
      break;
    case "deleteFolderPop":
      confirmForm.action = "deleteFolder?folderId=";
      confirmForm.dataset.folderid = e.target.dataset.folderid;
      confirmForm.name = "deleteFolderForm";
      enableConfirmForm();
      confirmMessage.textContent =
        "Are you sure you want to delete the folder and all it's contents?";
      break;
    case "deleteFilePop":
      confirmForm.action = "deleteFile?fileId=";
      confirmForm.dataset.fileid = e.target.dataset.fileid;
      confirmForm.name = "deleteFileForm";
      enableConfirmForm();
      confirmMessage.textContent = "Are you sure you want to delete the file?";
      break;
  }
});
/** ------------------END DIALOG CONTROLS---------------------------- */
