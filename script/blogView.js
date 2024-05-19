document.addEventListener("DOMContentLoaded", function() {
  const closeButton = document.querySelector(".close-btn");

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      // This gives me the url of a previous link. So I go back to the proper place on where I clicked the card.
      const referrer = document.referrer;
      console.log("Referrer:", referrer);
      
      if (referrer.includes("/blog/posts")) {
        console.log("Redirecting to /blog/posts");
        window.location.href = "/blog/posts";
      } else {
        console.log("Redirecting to /blog");
        window.location.href = "/blog";
      }
    });
  }
});