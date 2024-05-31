// Select the text area element by its ID
const textArea = document.getElementById("contentTextArea");

// Add event listener for focus event on the text area
textArea.addEventListener("focus", function () {
  // Make the text area fullscreen and create the "Done" button when the text area gains focus
  this.classList.add("fullscreen-textarea");
  createDoneButton();
});

// Add event listener for blur event on the text area
textArea.addEventListener("blur", function () {
  // Remove fullscreen mode and the "Done" button when the text area loses focus
  this.classList.remove("fullscreen-textarea");
  removeDoneButton();
});

// Function to create the "Done" button
const createDoneButton = () => {
  // Check if the 'doneBtn' does NOT exist before creating it
  if (!document.getElementById("doneBtn")) {
    // Create and style the "Done" button
    const doneBtn = document.createElement("small");
    doneBtn.textContent = "Done";
    doneBtn.id = "doneBtn";
    doneBtn.style.position = "fixed";
    doneBtn.style.top = "10px";
    doneBtn.style.right = "10px";
    doneBtn.style.zIndex = "9999";
    doneBtn.style.padding = "10px 20px";
    doneBtn.style.cursor = "pointer";

    // Set the onclick event to blur the text area and remove the "Done" button
    doneBtn.onclick = function () {
      const textArea = document.querySelector("textarea");
      if (textArea) {
        textArea.blur();
      }
      removeDoneButton();
    };

    // Append the "Done" button to the document body
    document.body.appendChild(doneBtn);
  }
};

// Function to remove the "Done" button
function removeDoneButton() {
  // Select the "Done" button by its ID
  const doneBtn = document.getElementById("doneBtn");
  // Remove the "Done" button from the document if it exists
  if (doneBtn) {
    doneBtn.parentNode.removeChild(doneBtn);
  }
}
