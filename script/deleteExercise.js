document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.exercise-container');

    async function deleteExerciseCard(event) {
        if (event.target.classList.contains('delete-button')) {
            event.preventDefault(); 
            event.stopPropagation(); 
            const card = event.target.closest('.exercise-card');
            const id = card.getAttribute('data-id');

            if (!id) {
                console.log('No ID found, removing card locally');
                card.remove();
                return;
            }

            try {
                console.log(`Attempting to delete exercise with ID: ${id}`);
                const response = await fetch(`/logExercise/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Exercise deleted successfully');
                    card.remove();
                } else {
                    alert('Error deleting exercise');
                }
            } catch (error) {
                console.error('Error deleting exercise:', error);
                alert('An error occurred while deleting the exercise');
            }
        }
    }

    container.removeEventListener('click', deleteExerciseCard);
});
