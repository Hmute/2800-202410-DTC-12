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
    doneBtn.style.top = "10px"; // Position it slightly below the top edge of the viewport
    doneBtn.style.right = "10px"; // Position it slightly from the right edge of the viewport
    doneBtn.style.zIndex = "1000"; // Make sure it's on top

    doneBtn.style.padding = "10px 15px";
    doneBtn.style.color = "blue";
    doneBtn.style.border = "none";
    doneBtn.style.borderRadius = "5px";
    doneBtn.style.cursor = "pointer";

    doneBtn.onclick = function () {
      textArea.blur(); // Optionally perform other actions like saving the textarea content
    };

    document.body.appendChild(doneBtn); // Append to body to ensure it's not clipped by any parent with overflow hidden
  }
};

function removeDoneButton() {
  const doneBtn = document.getElementById("doneBtn");
  if (doneBtn) {
    doneBtn.parentNode.removeChild(doneBtn);
  }
}
