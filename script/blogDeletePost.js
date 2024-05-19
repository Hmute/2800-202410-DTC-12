document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      const blogId = this.getAttribute("data-id");
      window.location.href = `/blog/view?id=${blogId}`;
    });
  });

  document.querySelectorAll("#delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent card click event
      const blogId = this.closest(".card").getAttribute("data-id");

      fetch("/blog/posts/delete?", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/blog/posts";
          } else {
            alert("Error deleting post");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });

  const backButton = document.querySelector("#backBtn");
  backButton.addEventListener("click", () => {
    window.location.href = "/blog";
  });
});
