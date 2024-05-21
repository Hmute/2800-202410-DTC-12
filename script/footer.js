document.addEventListener("DOMContentLoaded", function () {
  const homeLink = document.getElementById("homepage");
  const generateLink = document.getElementById("botpage");
  const messagesLink = document.getElementById("blogpage");
  const profileLink = document.getElementById("profilepage");

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
