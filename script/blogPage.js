// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Select the create post button, view post button, and all card elements by their IDs and class
  const createPostButton = document.getElementById("createPostButton");
  const viewPostButton = document.querySelector("#viewPostButton");
  const cards = document.querySelectorAll(".card");

  // Add a click event listener to the create post button to navigate to the create blog page
  createPostButton.addEventListener("click", function () {
    window.location.href = "/blog/create";
  });

  // Add a click event listener to the view post button to navigate to the blog posts page
  viewPostButton.addEventListener("click", function () {
    window.location.href = "/blog/posts";
  });

  // Add click event listeners to all card elements
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      // Redirect to the blog view page with the blog ID when a card is clicked
      const blogId = this.getAttribute("data-id");
      window.location.href = `/blog/view?id=${blogId}`;
    });
  });
});
