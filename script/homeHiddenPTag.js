// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the class 'card-text'
  var elements = document.querySelectorAll(".card-text");

  // Iterate over each element
  elements.forEach(function (element) {
    // Check if the element's text content is empty or whitespace
    if (!element.textContent.trim()) {
      // Add the 'hidden' class to elements with no content
      element.classList.add("hidden");
    }
  });
});
