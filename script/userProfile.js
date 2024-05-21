document.addEventListener("DOMContentLoaded", function () {
  const editBtn = document.querySelector(".edit-profile-btn");
  const signOutBtn = document.getElementById("sign-out-btn");
  const signOutForm = document.getElementById("signout-form");
  const profilePicture = document.getElementById("profile-picture");
  const profilePictureInput = document.getElementById("profilePicture");

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
