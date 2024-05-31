// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Select the add and remove tag icons and the tag container element by their IDs and class
  const addTagIcon = document.getElementById("addTagIcon");
  const removeTagIcon = document.getElementById("removeTagIcon");
  const tagContainer = document.querySelector(".tag-container");
  let tagCount = 1;

  // Add an event listener for clicks on the add tag icon
  addTagIcon.addEventListener("click", function () {
    // Allow adding up to one additional tag
    if (tagCount < 2) {
      // Clone the existing tag select element and update its ID and name
      const newTag = tagContainer.querySelector("select").cloneNode(true);
      newTag.id = "tag2";
      newTag.name = "tags";
      // Insert the new tag select element before the add tag icon
      tagContainer.insertBefore(newTag, addTagIcon);
      tagCount++;
    }
    // Hide the add tag icon and show the remove tag icon when two tags are present
    if (tagCount === 2) {
      addTagIcon.style.display = "none";
      removeTagIcon.style.display = "inline";
    }
  });

  // Add an event listener for clicks on the remove tag icon
  removeTagIcon.addEventListener("click", function () {
    // Allow removing the second tag
    if (tagCount === 2) {
      // Remove the second tag select element
      const newTag = document.getElementById("tag2");
      tagContainer.removeChild(newTag);
      tagCount--;

      // Show the add tag icon and hide the remove tag icon when only one tag is present
      if (tagCount === 1) {
        addTagIcon.style.display = "inline";
        removeTagIcon.style.display = "none";
      }
    }
  });

  // Call the submitForm function to handle form submission
  submitForm();
});

// Function to handle form submission
const submitForm = () => {
  // Add an event listener for form submission
  document
    .getElementById("blogForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Disable the submit button to prevent multiple submissions
      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = true;

      // Get the form and form data
      const form = event.target;
      const formData = new FormData(form);

      // Collect selected tags and filter out the "None" option
      const tags = Array.from(document.querySelectorAll("select[name='tags']"))
        .map((select) => select.value)
        .filter((value) => value !== "None");

      // Delete the original tags entry from the form data
      formData.delete("tags");

      // Append each selected tag to the form data
      tags.forEach((tag) => formData.append("tags", tag));

      // Send the form data to the server using Fetch API
      fetch("/blog/save", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            // Redirect to the postSave page if the blog post is saved successfully
            return response.text().then((blogId) => {
              window.location.href = `/blog/postSave?blogId=${blogId}`;
            });
          } else {
            throw new Error("Failed to save blog post.");
          }
        })
        .catch((error) => {
          // Display an error message and re-enable the submit button if there is an error
          console.error("Error:", error);
          alert(`Error saving blog post: ${error.message}`);
          submitButton.disabled = false;
        });
    });
};

// Add an event listener for clicks on the back button to navigate back to the blog page
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/blog";
});

// Add an event listener for form validation before submission
document
  .getElementById("blogForm")
  .addEventListener("submit", function (event) {
    let hasError = false;
    let errorMessage = "";

    // Validate file input
    const fileInput = document.getElementById("fileInput3");
    if (!fileInput.files.length) {
      errorMessage += "Please upload an image.\n";
      hasError = true;
    }

    // Validate title input
    const title = document.getElementById("title").value.trim();
    if (title === "") {
      errorMessage += "Please enter a title.\n";
      hasError = true;
    }

    // Validate content input
    const content = document.getElementById("contentTextArea").value.trim();
    if (content === "") {
      errorMessage += "Please fill in the content.\n";
      hasError = true;
    }

    // Validate tags input
    const tags = document.getElementById("tags").value;
    if (tags === "None") {
      errorMessage += "Please select at least one tag.\n";
      hasError = true;
    }

    // If there are validation errors, prevent form submission and show an alert
    if (hasError) {
      event.preventDefault();
      alert(errorMessage);
    }
  });
