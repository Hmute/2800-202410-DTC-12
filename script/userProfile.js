document.addEventListener("DOMContentLoaded", function () {
  const editBtn = document.querySelector(".edit-profile-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const signOutForm = document.getElementById("signout-form");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const detailsCard = document.querySelector(".details");
      const bioCard = document.querySelector(".bio");
      const editDetails = document.querySelector(
        "#edit-health-details-section"
      );
      const editBio = document.querySelector("#edit-bio-section");
      const editProfileForm = document.getElementById("edit-profile-form");
      const editLinks = document.getElementById("edit-social-icons-section");

      const isEditing = editBtn.classList.toggle("editing");

      if (isEditing) {
        detailsCard.style.display = "none";
        bioCard.style.display = "none";

        editDetails.style.display = "block";
        editBio.style.display = "block";
        editLinks.style.display = "block";

        editProfileForm.style.display = "block";

        editBtn.textContent = "Save Profile";
      } else {
        detailsCard.style.display = "block";
        bioCard.style.display = "block";

        editDetails.style.display = "none";
        editBio.style.display = "none";
        editLinks.style.display = "none";

        editProfileForm.style.display = "none";

        editBtn.textContent = "Edit Profile";

        editProfileForm.submit();
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener("click", function () {
      signOutForm.submit();
    });
  }
});
