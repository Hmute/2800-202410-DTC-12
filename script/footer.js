document.addEventListener("DOMContentLoaded", function () {
  const homeLink = document.getElementById("homepage");
  const generateLink = document.getElementById("botpage");
  const messagesLink = document.getElementById("blogpage");
  const profileLink = document.getElementById("profilepage");
  const links = document.querySelectorAll(".bottom-nav .nav-link");

  function handleLinkClick(event) {
    links.forEach((link) => link.classList.remove("active-nav"));

    event.currentTarget.classList.add("active-nav");
  }

  links.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });

  const currentPath = window.location.pathname;
  links.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active-nav");
    }
  });

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

function handleHomeClick() {
  console.log("Home link clicked");
  window.location.href = "/home";
}

function handleGenerateClick() {
  console.log("Generate link clicked");
  window.location.href = "/bot";
}

function handleMessagesClick() {
  console.log("Messages link clicked");
  window.location.href = "/blog";
}

function handleProfileClick() {
  console.log("Profile link clicked");
  window.location.href = "/user/profile";
}
