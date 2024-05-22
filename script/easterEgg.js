document.addEventListener('DOMContentLoaded', () => {
    const logoWrap = document.getElementById('logoWrap');
    let longPressTimer;

    logoWrap.addEventListener('mousedown', () => {
       longPressTimer = setTimeout(triggerEasterEgg, 5000); // 5 seconds
    });

    logoWrap.addEventListener('mouseup', () => {
       clearTimeout(longPressTimer);
    });

    logoWrap.addEventListener('mouseleave', () => {
       clearTimeout(longPressTimer);
    });

    function triggerEasterEgg() {
       // Flip the logo image before starting the animation
       flipLogo(() => {
          const images = [
             'images/Easter_Egg/dumbbell_press.png',
             'images/Easter_Egg/dumbbell.png',
             'images/Easter_Egg/exercise.png',
             'images/Easter_Egg/fitness.png',
             'images/Easter_Egg/mobile-phone.png',
             'images/Easter_Egg/muscle.png',
             'images/Easter_Egg/schedule.png',
             'images/Easter_Egg/weights1.png',
             'images/Easter_Egg/Wellbot.png',
             'images/Easter_Egg/yoga-pose.png'
          ];
    
          const logoRect = logoWrap.getBoundingClientRect();
          const logoCenterX = logoRect.left + logoRect.width / 2;
          const logoCenterY = logoRect.top + logoRect.height / 2;
    
          for (let i = 0; i < 30; i++) { // Create more images
             const img = document.createElement('img');
             img.src = images[Math.floor(Math.random() * images.length)];
             img.classList.add('easter-egg');
             img.style.left = `${logoCenterX - 35}px`; // Centering the image
             img.style.top = `${logoCenterY - 35}px`; // Centering the image
             img.dataset.finalX = (Math.random() * window.innerWidth) - logoCenterX;
             img.dataset.finalY = (Math.random() * window.innerHeight) - logoCenterY;
             document.body.appendChild(img);
          }
    
          setTimeout(explodeEasterEggs, 100); // Start the explosion effect after 100ms
          setTimeout(clearEasterEggs, 15000); // Clear after 15 seconds
       });
    }

    function flipLogo(callback) {
        const logo = logoWrap.querySelector('img');
        let frame = 1;
        const interval = setInterval(() => {
            if (frame > 5) {
                clearInterval(interval);
                callback();
                return;
            }
            logo.src = `images/Easter_Egg_Animation/frame${frame}.png`;
            frame++;
        }, 200); // Adjust the interval as needed for animation speed
    }

    function explodeEasterEggs() {
       const eggs = document.querySelectorAll('.easter-egg');
       eggs.forEach(egg => {
          const finalX = parseFloat(egg.dataset.finalX);
          const finalY = parseFloat(egg.dataset.finalY);
          egg.style.transition = 'left 1s ease-out, top 1s ease-out';
          egg.style.left = `${finalX + window.innerWidth / 2}px`;
          egg.style.top = `${finalY + window.innerHeight / 2}px`;
       });

       setTimeout(startBouncing, 1000); // Start bouncing effect after 1 second
    }

    function startBouncing() {
       const eggs = document.querySelectorAll('.easter-egg');
       eggs.forEach(egg => {
          egg.style.transition = ''; // Remove transition for bouncing effect
          let x = parseFloat(egg.style.left);
          let y = parseFloat(egg.style.top);
          let dx = Math.random() * 4 - 2; // Random horizontal speed
          let dy = Math.random() * 4 - 2; // Random vertical speed
          egg.dataset.dx = dx;
          egg.dataset.dy = dy;
       });

       function bounce() {
          eggs.forEach(egg => {
             let x = parseFloat(egg.style.left);
             let y = parseFloat(egg.style.top);
             let dx = parseFloat(egg.dataset.dx);
             let dy = parseFloat(egg.dataset.dy);

             x += dx;
             y += dy;

             if (x <= 0) {
                x = 0;
                dx = -dx;
             } else if (x >= window.innerWidth - 70) {
                x = window.innerWidth - 70;
                dx = -dx;
             }

             if (y <= 0) {
                y = 0;
                dy = -dy;
             } else if (y >= window.innerHeight - 70) {
                y = window.innerHeight - 70;
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
       const eggs = document.querySelectorAll('.easter-egg');
       eggs.forEach(egg => egg.remove());

       // Flip the logo back to the original image
       flipLogoBack();
    }

    function flipLogoBack() {
        const logo = logoWrap.querySelector('img');
        let frame = 5;
        const interval = setInterval(() => {
            if (frame < 1) {
                clearInterval(interval);
                logo.src = 'images/Wellbot.png'; // Original image
                return;
            }
            logo.src = `images/Easter_Egg_Animation/frame${frame}.png`;
            frame--;
        }, 200); // Adjust the interval as needed for animation speed
    }
});
