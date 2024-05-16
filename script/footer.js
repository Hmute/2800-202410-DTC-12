document.addEventListener("DOMContentLoaded", function () {
  const homeLink = document.getElementById("homepage");
  const generateLink = document.getElementById("botpage");
  const messagesLink = document.getElementById("blogpage");
  const profileLink = document.getElementById("profilepage");

  homeLink.addEventListener("click", function (event) {
    event.preventDefault();
    handleHomeClick();
  });

  generateLink.addEventListener("click", function (event) {
    event.preventDefault();
    handleGenerateClick();
  });

  messagesLink.addEventListener("click", function (event) {
    event.preventDefault();
    handleMessagesClick();
  });

  profileLink.addEventListener("click", function (event) {
    event.preventDefault();
    handleProfileClick();
  });
});

function handleHomeClick() {
  console.log("Home link clicked");
  window.location.href = "/home";
}

function handleGenerateClick() {
  console.log("Generate link clicked");
  //Put the bot page here
  window.location.href = "";
}

function handleMessagesClick() {
  console.log("Messages link clicked");
  window.location.href = "/blog";
}

function handleProfileClick() {
  console.log("Profile link clicked");
  //Put the profile page here
  window.location.href = "";
}
