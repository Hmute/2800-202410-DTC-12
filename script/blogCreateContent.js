const textArea = document.getElementById("contentTextArea");

textArea.addEventListener("focus", function () {
  this.classList.add("fullscreen-textarea");
  createDoneButton();
});

textArea.addEventListener("blur", function () {
  this.classList.remove("fullscreen-textarea");
  removeDoneButton();
});

const createDoneButton = () => {
  // Check if the 'doneBtn' does NOT exist before creating it
  if (!document.getElementById("doneBtn")) {
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.id = "doneBtn";
    doneBtn.style.position = "absolute";
    doneBtn.style.top = "10px";
    doneBtn.style.right = "10px";
    doneBtn.style.zIndex = "1000";
    doneBtn.style.padding = "10px 15px";
    doneBtn.style.color = "blue";
    doneBtn.style.border = "none";
    doneBtn.style.borderRadius = "5px";
    doneBtn.style.cursor = "pointer";
    
    doneBtn.onclick = function () {
      textArea.blur();
    };

    document.body.appendChild(doneBtn);
  }
};

function removeDoneButton() {
  const doneBtn = document.getElementById("doneBtn");
  if (doneBtn) {
    doneBtn.parentNode.removeChild(doneBtn);
  }
}
