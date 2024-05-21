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
    const doneBtn = document.createElement("small");
    doneBtn.textContent = "Done";
    doneBtn.id = "doneBtn";
    doneBtn.style.position = "fixed";
    doneBtn.style.top = "10px";
    doneBtn.style.right = "10px";
    doneBtn.style.zIndex = "9999";
    doneBtn.style.padding = "10px 20px";
    doneBtn.style.cursor = "pointer";

    doneBtn.onclick = function () {
      const textArea = document.querySelector("textarea");
      if (textArea) {
        textArea.blur();
      }
      removeDoneButton();
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

