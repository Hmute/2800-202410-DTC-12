// For create button
document.addEventListener("DOMContentLoaded", function () {
  const createPostButton = document.getElementById("createPostButton");

  createPostButton.addEventListener("click", function () {
    window.location.href = "/blog/create";
  });
});

