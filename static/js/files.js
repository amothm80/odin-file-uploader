const modal = document.getElementById("createFolderDialog");
const btn = document.getElementById("createFolderPop");
const closeBtn = document.getElementById("cancel");

btn.onclick = () => {
  modal.style.display = "block";
}

closeBtn.onclick = () => {
  modal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}
console.log("hi")