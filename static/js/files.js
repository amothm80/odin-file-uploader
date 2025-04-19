const createFolderModal = document.getElementById("createFolderDialog");
const createFolderButton = document.getElementById("createFolderPop");
const createFolderCloseBtn = document.getElementById("cancelCreateFolder");

const uploadFileModal = document.getElementById("uploadFileDialog");
const uploadFileButton = document.getElementById("uploadFilePop");
const uploadFileCloseBtn = document.getElementById("cancelFileUpload");

createFolderButton.onclick = () => {
  createFolderModal.style.display = "block";
}

uploadFileButton.onclick = () => {
  uploadFileModal.style.display = "block";
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
