// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  const editBtn = document.querySelector(".edit-profile-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const signOutForm = document.getElementById("signout-form");
  const profilePicture = document.getElementById("profile-picture");
  const profilePictureInput = document.getElementById("profilePicture");

  // Handle edit profile button click
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

      // Toggle the editing state
      const isEditing = editBtn.classList.toggle("editing");

      if (isEditing) {
        // Show edit sections and hide view sections
        detailsCard.style.display = "none";
        bioCard.style.display = "none";
        editDetails.style.display = "block";
        editBio.style.display = "block";
        editLinks.style.display = "block";
        editProfileForm.style.display = "block";
        editBtn.textContent = "Save Profile";

        // Handle profile picture click and change
        if (profilePicture && profilePictureInput) {
          profilePicture.addEventListener("click", function () {
            profilePictureInput.click();
          });

          profilePictureInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function (e) {
                profilePicture.src = e.target.result;
              };
              reader.readAsDataURL(file);
            }
          });
        }
      } else {
        // Show view sections and hide edit sections
        detailsCard.style.display = "block";
        bioCard.style.display = "block";
        editDetails.style.display = "none";
        editBio.style.display = "none";
        editLinks.style.display = "none";
        editProfileForm.style.display = "none";
        editBtn.textContent = "Edit Profile";

        // Submit the profile edit form
        editProfileForm.submit();
      }
    });
  }

  // Handle sign-out button click
  if (signOutBtn) {
    signOutBtn.addEventListener("click", function () {
      signOutForm.submit();
    });
  }
});
