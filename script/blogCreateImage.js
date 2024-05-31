// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Select the file input and icon container elements by their IDs and class
  const fileInput = document.getElementById("fileInput3");
  const iconContainer = document.querySelector(".icon-container");

  // Add an event listener for changes to the file input
  fileInput.addEventListener("change", function () {
    // Get the selected file from the file input
    const file = fileInput.files[0];
    if (file) {
      // Create a new FileReader to read the file
      const reader = new FileReader();
      // Define the onload event for the FileReader
      reader.onload = function (e) {
        // Set the background image of the icon container to the selected file
        iconContainer.style.backgroundImage = `url(${e.target.result})`;
        iconContainer.style.backgroundSize = "cover";
        iconContainer.style.backgroundPosition = "center";
      };
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  });
});
