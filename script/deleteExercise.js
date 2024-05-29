document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.exercise-container');

    function showNotification(message) {
        const notificationMessage = document.getElementById('notificationMessage');
        notificationMessage.textContent = message;
        $('#notificationModal').modal('show');
    }

    async function deleteExerciseCard(event) {
        if (event.target.classList.contains('delete-button')) {
            event.preventDefault(); 
            event.stopPropagation(); 
            const card = event.target.closest('.exercise-card');
            const id = card.getAttribute('data-id');

            if (!id) {
                console.log('No ID found, removing card locally');
                card.remove();
                showNotification('Exercise removed locally');
                return;
            }

            try {
                console.log(`Attempting to delete exercise with ID: ${id}`);
                const response = await fetch(`/logExercise/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    card.remove();
                    showNotification('Exercise deleted successfully');
                } else {
                    showNotification('Error deleting exercise');
                }
            } catch (error) {
                console.error('Error deleting exercise:', error);
                showNotification('An error occurred while deleting the exercise');
            }
        }
    }

    container.addEventListener('click', deleteExerciseCard);
});
