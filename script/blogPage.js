// For create button
document.addEventListener("DOMContentLoaded", function () {
  const createPostButton = document.getElementById("createPostButton");
  const cards = document.querySelectorAll(".card");

  createPostButton.addEventListener("click", function () {
    window.location.href = "/blog/create";
  });

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const blogId = this.getAttribute("data-id");
      window.location.href = `/blog/view?id=${blogId}`;
    });
  });
});
