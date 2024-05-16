// Event listener to handle the tags
// Will copy the element with tag id when + is clicked and remove the cloned element if - is clicked
document.addEventListener("DOMContentLoaded", function () {
  const addTagIcon = document.getElementById("addTagIcon");
  const removeTagIcon = document.getElementById("removeTagIcon");
  const tagContainer = document.querySelector(".tag-container");
  let tagCount = 1;

  addTagIcon.addEventListener("click", function () {
    if (tagCount < 2) {
      const newTag = tagContainer.querySelector("select").cloneNode(true);
      newTag.id = "tag2";
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
});

// For back button
document.getElementById("backBtn").addEventListener("click", function () {
  window.location.href = "/blog";
});
