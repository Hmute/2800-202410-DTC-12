document.addEventListener("DOMContentLoaded", () => {
  const logoWrap = document.getElementById("logoWrap");
  const music = document.getElementById("explosionMusic");
  const discoBall = document.getElementById("discoBall");
  let longPressTimer;

  logoWrap.addEventListener("mousedown", () => {
    longPressTimer = setTimeout(triggerEasterEgg, 1000); // 1 second to trigger event
  });

  logoWrap.addEventListener("mouseup", () => {
    clearTimeout(longPressTimer);
  });

  logoWrap.addEventListener("mouseleave", () => {
    clearTimeout(longPressTimer);
  });

  function triggerEasterEgg() {
    hideLogo(() => {
      const images = [
        "images/Easter_Egg/dumbbell_press.png",
        "images/Easter_Egg/dumbbell.png",
        "images/Easter_Egg/exercise.png",
        "images/Easter_Egg/fitness.png",
        "images/Easter_Egg/mobile-phone.png",
        "images/Easter_Egg/muscle.png",
        "images/Easter_Egg/schedule.png",
        "images/Easter_Egg/weights1.png",
        "images/Easter_Egg/Wellbot.png",
        "images/Easter_Egg/yoga-pose.png",
      ];

      const logoRect = logoWrap.getBoundingClientRect();
      const logoCenterX = logoRect.left + logoRect.width / 2;
      const logoCenterY = logoRect.top + logoRect.height / 2;

      for (let i = 0; i < 30; i++) {
        const img = document.createElement("img");
        img.src = images[Math.floor(Math.random() * images.length)];
        img.classList.add("easter-egg");
        img.style.left = `${logoCenterX - 35}px`;
        img.style.top = `-100px`;
        img.dataset.finalX = Math.random() * window.innerWidth - logoCenterX;
        img.dataset.finalY = Math.random() * window.innerHeight - logoCenterY;
        document.body.appendChild(img);

        setTimeout(() => {
          img.style.transition = "top 1s ease-out";
          img.style.top = `${logoCenterY - 35}px`;
        }, 100);
      }

      setTimeout(() => {
        showRobot();
        explodeEasterEggs();
        playMusic();
        showDiscoBall();
      }, 1000); // Explode after 1 second

      setTimeout(() => {
        clearEasterEggs();
        hideRobot();
        stopMusic();
        hideDiscoBall();
      }, 15000); // Clear after 15 seconds
    });
  }

  function hideLogo(callback) {
    const logo = logoWrap.querySelector("img");
    logo.style.display = "none";
    callback();
  }

  function showRobot() {
    const robot = document.createElement("img");
    robot.src = "images/robot.gif";
    robot.classList.add("robot");
    document.body.appendChild(robot);
    robot.style.display = "block";
    window.robot = robot;
  }

  function hideRobot() {
    const robot = window.robot;
    if (robot) {
      robot.remove();
    }
  }

  function explodeEasterEggs() {
    const eggs = document.querySelectorAll(".easter-egg");
    eggs.forEach((egg) => {
      const finalX = parseFloat(egg.dataset.finalX);
      const finalY = parseFloat(egg.dataset.finalY);

      const windowWidth = window.innerWidth - 100;
      const windowHeight = window.innerHeight - 100;

      let targetX = finalX + window.innerWidth / 2;
      let targetY = finalY + window.innerHeight / 2;

      if (targetX < 0) targetX = 0;
      if (targetX > windowWidth) targetX = windowWidth;
      if (targetY < 0) targetY = 0;
      if (targetY > windowHeight) targetY = windowHeight;

      egg.style.transition = "left 1s ease-out, top 1s ease-out";
      egg.style.left = `${targetX}px`;
      egg.style.top = `${targetY}px`;
    });

    setTimeout(startBouncing, 1000);
  }

  function startBouncing() {
    const eggs = document.querySelectorAll(".easter-egg");
    eggs.forEach((egg) => {
      egg.style.transition = "";
      let x = parseFloat(egg.style.left);
      let y = parseFloat(egg.style.top);
      let dx = Math.random() * 4 - 2;
      let dy = Math.random() * 4 - 2;
      egg.dataset.dx = dx;
      egg.dataset.dy = dy;
    });

    function bounce() {
      const windowWidth = window.innerWidth - 90;
      const windowHeight = window.innerHeight - 90;

      eggs.forEach((egg) => {
        let x = parseFloat(egg.style.left);
        let y = parseFloat(egg.style.top);
        let dx = parseFloat(egg.dataset.dx);
        let dy = parseFloat(egg.dataset.dy);

        x += dx;
        y += dy;

        if (x <= 0) {
          x = 0;
          dx = -dx;
        } else if (x >= windowWidth) {
          x = windowWidth;
          dx = -dx;
        }

        if (y <= 0) {
          y = 0;
          dy = -dy;
        } else if (y >= windowHeight) {
          y = windowHeight;
          dy = -dy;
        }

        egg.style.left = `${x}px`;
        egg.style.top = `${y}px`;
        egg.dataset.dx = dx;
        egg.dataset.dy = dy;
      });

      requestAnimationFrame(bounce);
    }

    requestAnimationFrame(bounce);
  }

  function clearEasterEggs() {
    const eggs = document.querySelectorAll(".easter-egg");
    eggs.forEach((egg) => egg.remove());

    showLogo();
  }

  function showLogo() {
    const logo = logoWrap.querySelector("img");
    logo.style.display = "block";
  }

  function playMusic() {
    music.play();
  }

  function stopMusic() {
    music.pause();
    music.currentTime = 0;
  }

  function showDiscoBall() {
    discoBall.style.display = "block";
  }

  function hideDiscoBall() {
    discoBall.style.display = "none";
  }
});
