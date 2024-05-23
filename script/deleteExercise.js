    document.addEventListener("DOMContentLoaded", function () {
        const container = document.querySelector('.exercise-container');

        async function deleteExerciseCard(event) {
            if (event.target.classList.contains('delete-button')) {
                const card = event.target.closest('.exercise-card');
                const id = card.getAttribute('data-id');

                if (!id) {
                    card.remove();
                    return;
                }

                try {
                    const response = await fetch(`/logExercise/${id}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        card.remove();
                        alert('Exercise deleted successfully');
                    } else {
                        alert('Error deleting exercise');
                    }
                } catch (error) {
                    console.error('Error deleting exercise:', error);
                    alert('An error occurred while deleting the exercise');
                }
            }
        }
        container.addEventListener('click', deleteExerciseCard);
    });
