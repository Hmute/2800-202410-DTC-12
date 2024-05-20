document.addEventListener("DOMContentLoaded", function () {
  const addTagIcon = document.getElementById("addTagIcon");
  const removeTagIcon = document.getElementById("removeTagIcon");
  const tagContainer = document.querySelector(".tag-container");
  let tagCount = 1;

  addTagIcon.addEventListener("click", function () {
    if (tagCount < 2) {
      const newTag = tagContainer.querySelector("select").cloneNode(true);
      newTag.id = "tag2";
      newTag.name = "tags";
      tagContainer.insertBefore(newTag, addTagIcon);
      tagCount++;
    }
    if (tagCount === 2) {
      addTagIcon.style.display = "none";
      removeTagIcon.style.display = "inline";
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

  submitForm();
});

const submitForm = () => {
  document
    .getElementById("blogForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);

      const tags = Array.from(document.querySelectorAll("select[name='tags']"))
        .map((select) => select.value)
        .filter((value) => value !== "None");

      formData.delete("tags");

      tags.forEach((tag) => formData.append("tags", tag));

      fetch("/blog/save", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.text().then((blogId) => {
              window.location.href = `/blog/postSave?blogId=${blogId}`;
            });
          } else {
            alert("Error saving blog post");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(`Error saving blog post: ${error.message}`);
        });
    });
};

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/blog";
});
