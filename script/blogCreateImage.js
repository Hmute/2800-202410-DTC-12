document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput3");
  const iconContainer = document.querySelector(".icon-container");

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        iconContainer.style.backgroundImage = `url(${e.target.result})`;
        iconContainer.style.backgroundSize = "cover";
        iconContainer.style.backgroundPosition = "center";
      };
      reader.readAsDataURL(file);
    }
  });
});
