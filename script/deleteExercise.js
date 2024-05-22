// deleteExercise.js

document.addEventListener("DOMContentLoaded", function () {
    const exerciseCardsContainer = document.querySelector('.exercise-container');
  
    exerciseCardsContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-button')) {
        if (exerciseCardsContainer.children.length > 1) {
          const card = event.target.closest('.exercise-card');
          if (card) {
            card.remove(); 
          }
        } else {
          alert("You cannot delete the initial card."); 
        }
      }
    });
  });
  