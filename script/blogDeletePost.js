// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Add click event listeners to all elements with the class "card"
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      // Redirect to the blog view page with the blog ID when a card is clicked
      const blogId = this.getAttribute("data-id");
      window.location.href = `/blog/view?id=${blogId}`;
    });
  });

  // Add click event listeners to all elements with the ID "delete"
  document.querySelectorAll("#delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", function (event) {
      // Prevent the click event from propagating to the card
      event.stopPropagation();
      // Get the blog ID from the closest card element
      const blogId = this.closest(".card").getAttribute("data-id");

      // Send a POST request to delete the blog post
      fetch("/blog/posts/delete?", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      })
        .then((response) => {
          if (response.ok) {
            // Redirect to the blog posts page if the deletion is successful
            window.location.href = "/blog/posts";
          } else {
            alert("Error deleting post");
          }
        })
        .catch((error) => {
          // Log and alert if there is an error during the deletion process
          console.error("Error:", error);
        });
    });
  });

  // Add click event listener to the back button to navigate back to the blog page
  const backButton = document.querySelector("#backBtn");
  backButton.addEventListener("click", () => {
    window.location.href = "/blog";
  });
});
