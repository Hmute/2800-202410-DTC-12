// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  const homeLink = document.getElementById("homepage");
  const generateLink = document.getElementById("botpage");
  const messagesLink = document.getElementById("blogpage");
  const profileLink = document.getElementById("profilepage");
  const links = document.querySelectorAll(".bottom-nav .nav-link");

  // Function to handle click events on navigation links
  function handleLinkClick(event) {
    // Remove the active class from all links
    links.forEach((link) => link.classList.remove("active-nav"));
    // Add the active class to the clicked link
    event.currentTarget.classList.add("active-nav");
  }

  // Add click event listeners to all navigation links
  links.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });

  // Set the active class based on the current page path
  const currentPath = window.location.pathname;
  links.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active-nav");
    }
  });

  // Add click event listeners to specific links with additional functionality
  homeLink.addEventListener("click", function () {
    handleHomeClick();
  });

  generateLink.addEventListener("click", function () {
    handleGenerateClick();
  });

  messagesLink.addEventListener("click", function () {
    handleMessagesClick();
  });

  profileLink.addEventListener("click", function () {
    handleProfileClick();
  });
});

// Function to handle the home link click
function handleHomeClick() {
  console.log("Home link clicked");
  window.location.href = "/home";
}

// Function to handle the generate link click
function handleGenerateClick() {
  console.log("Generate link clicked");
  window.location.href = "/bot";
}

// Function to handle the messages link click
function handleMessagesClick() {
  console.log("Messages link clicked");
  window.location.href = "/blog";
}

// Function to handle the profile link click
function handleProfileClick() {
  console.log("Profile link clicked");
  window.location.href = "/user/profile";
}
