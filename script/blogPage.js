// For create button
document.addEventListener("DOMContentLoaded", function () {
  const createPostButton = document.getElementById("createPostButton");
  const cards = document.querySelectorAll(".card");
  const viewPostButton = document.querySelector("#viewPostButton")

  createPostButton.addEventListener("click", function () {
    window.location.href = "/blog/create";
  });

  viewPostButton.addEventListener("click", function () {
    window.location.href = "/blog/posts";
  });

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const blogId = this.getAttribute("data-id");
      window.location.href = `/blog/view?id=${blogId}`;
    });
  });
});
