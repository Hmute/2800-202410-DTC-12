// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Check if the saved modal element exists
  const savedModal = document.getElementById("savedModal");
  if (savedModal) {
    // Show the modal using Bootstrap's jQuery method
    $("#savedModal").modal("show");
  }
});
