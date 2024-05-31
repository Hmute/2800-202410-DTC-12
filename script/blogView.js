// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Select the close button element by its class
  const closeButton = document.querySelector(".close-btn");

  // Check if the close button exists
  if (closeButton) {
    // Add a click event listener to the close button
    closeButton.addEventListener("click", () => {
      // Get the URL of the previous page
      const referrer = document.referrer;
      console.log("Referrer:", referrer);

      // Redirect based on the referrer URL
      if (referrer.includes("/blog/posts")) {
        console.log("Redirecting to /blog/posts");
        window.location.href = "/blog/posts";
      } else {
        console.log("Redirecting to /blog");
        window.location.href = "/blog";
      }
    });
  }
});
