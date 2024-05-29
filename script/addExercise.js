document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.exercise-container');
    const addButton = document.getElementById('addButton');

    function showNotification(message) {
        const notificationMessage = document.getElementById('notificationMessage');
        notificationMessage.textContent = message;
        $('#notificationModal').modal('show');
    }

    function createNewExerciseCard() {
        const card = document.createElement('div');
        card.classList.add('exercise-card');

        card.innerHTML = `
            <form>
                <div class="form-group">
                    <label for="name">Exercise:</label>
                    <input type="text" name="name" value="">
                </div>
                <div class="form-group">
                    <label for="repetitions">Reps:</label>
                    <input type="number" name="repetitions" value="">
                </div>
                <div class="form-group">
                    <label for="sets">Sets:</label>
                    <input type="number" name="sets" value="">
                </div>
                <div class="form-group">
                    <label for="weight">Weight (kg):</label>
                    <input type="number" name="weight" value="">
                </div>
                <div class="form-group">
                    <label for="time">Time (minute):</label>
                    <input type="number" name="time" value="">
                </div>
                <div class="form-group">
                    <label for="completion">Complete:</label>
                    <select name="completion">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <button type="button" class="save-button">Save Entry</button>
                <button type="button" class="delete-button">Delete Entry</button>
            </form>
        `;

        container.insertBefore(card, addButton.parentNode); // Insert the new card before the add button
    }

    async function saveExerciseCard(event) {
        if (event.target.classList.contains('save-button')) {
            const card = event.target.closest('.exercise-card');
            const id = card.getAttribute('data-id');
            const routineId = card.getAttribute('data-routine-id');
            const name = card.querySelector('input[name="name"]').value;
            const repetitions = card.querySelector('input[name="repetitions"]').value;
            const sets = card.querySelector('input[name="sets"]').value;
            const weight = card.querySelector('input[name="weight"]').value;
            const time = card.querySelector('input[name="time"]').value;
            const completion = card.querySelector('select[name="completion"]').value;

            const payload = { name, repetitions, sets, weight, time, completion };

            try {
                const response = id
                    ? await fetch(`/logExercise/${id}`, {
                          method: 'PUT',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(payload),
                      })
                    : await fetch('/logExercise', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(payload),
                      });

                const result = await response.json();

                if (response.ok) {
                    if (!id) {
                        card.setAttribute('data-id', result._id);
                        card.setAttribute('data-routine-id', routineId);
                    }
                    showNotification('Exercise saved successfully');
                } else {
                    showNotification(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error saving exercise:', error);
                showNotification('An error occurred while saving the exercise');
            }
        }
    }

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

    addButton.addEventListener('click', createNewExerciseCard);
    container.addEventListener('click', saveExerciseCard);
    container.addEventListener('click', deleteExerciseCard);
});
