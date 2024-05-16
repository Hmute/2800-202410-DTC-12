document.addEventListener("DOMContentLoaded", function () {
  const addTagIcon = document.getElementById("addTagIcon");
  const removeTagIcon = document.getElementById("removeTagIcon");
  const tagContainer = document.querySelector(".tag-container");
  let tagCount = 1;

  addTagIcon.addEventListener("click", function () {
    if (tagCount < 2) {
      const newTag = tagContainer.querySelector("select").cloneNode(true);
      newTag.id = "tag2";
      newTag.name = "tags"; // Ensure new tag has the correct name attribute
      tagContainer.insertBefore(newTag, addTagIcon);
      tagCount++;

      if (tagCount === 2) {
        addTagIcon.style.display = "none";
        removeTagIcon.style.display = "inline";
      }
    }
  });

  removeTagIcon.addEventListener("click", function () {
    if (tagCount === 2) {
      const newTag = document.getElementById("tag2");
      tagContainer.removeChild(newTag);
      tagCount--;

      if (tagCount === 1) {
        addTagIcon.style.display = "inline";
        removeTagIcon.style.display = "none";
      }
    }
  });

  document
    .getElementById("blogForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const title = document.getElementById("title").value;
      const content = document.getElementById("contentTextArea").value;
      const tags = Array.from(document.querySelectorAll("select[name='tags']"))
        .map((select) => select.value)
        .filter((value) => value !== "None");

      fetch("/blog/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, tags }),
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/blog";
          } else {
            alert("Error saving blog post");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
