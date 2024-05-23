// document.addEventListener("DOMContentLoaded", function () {
//     const exerciseCardsContainer = document.querySelector('.exercise-container');

//     exerciseCardsContainer.addEventListener('click', (event) => {
//         if (event.target.classList.contains('delete-button')) {
//             const card = event.target.closest('.exercise-card');
//             if (card) {
//                 card.remove();
//                 // Optionally, you can add logic to delete the entry from the database as well
//             }
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const exerciseCardsContainer = document.querySelector('.exercise-container');

    exerciseCardsContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const card = event.target.closest('.exercise-card');
            const id = card.getAttribute('data-id');

            if (id) {
                try {
                    const response = await fetch(`/logExercise/${id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        card.remove();
                        alert('Exercise deleted successfully!');
                    } else {
                        alert('Error deleting exercise');
                    }
                } catch (error) {
                    console.error('Error deleting exercise:', error);
                    alert('Error deleting exercise');
                }
            } else {
                card.remove();
            }
        }
    });
});

  