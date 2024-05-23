// document.addEventListener("DOMContentLoaded", function () {
//     const container = document.querySelector('.exercise-container');
//     const addButton = document.getElementById('addButton');

//     function createNewExerciseCard() {
//         const card = document.createElement('div');
//         card.classList.add('exercise-card');

//         card.innerHTML = `
//             <form>
//                 <div class="form-group">
//                     <label for="exercise">Exercise:</label>
//                     <input type="text" name="exercise" value="">
//                 </div>
//                 <div class="form-group">
//                     <label for="sets">Sets:</label>
//                     <input type="number" name="sets" value="">
//                 </div>
//                 <div class="form-group">
//                     <label for="reps">Reps:</label>
//                     <input type="number" name="reps" value="">
//                 </div>
//                 <div class="form-group">
//                     <label for="weight">Weight (kg):</label>
//                     <input type="number" name="weight" value="">
//                 </div>
//                 <div class="form-group">
//                     <label for="complete">Complete:</label>
//                     <select name="complete">
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                     </select>
//                 </div>
//                 <button type="button" class="save-button">Save Entry</button>
//                 <button type="button" class="delete-button">Delete Entry</button>
//             </form>
//         `;

//         container.insertBefore(card, addButton.parentNode); // Insert the new card before the add button
//     }

//     async function saveExerciseCard(event) {
//         if (event.target.classList.contains('save-button')) {
//             const card = event.target.closest('.exercise-card');
//             const id = card.getAttribute('data-id');
//             const exercise = card.querySelector('input[name="exercise"]').value;
//             const sets = card.querySelector('input[name="sets"]').value;
//             const reps = card.querySelector('input[name="reps"]').value;
//             const weight = card.querySelector('input[name="weight"]').value;
//             const complete = card.querySelector('select[name="complete"]').value;

//             const payload = { exercise, sets, reps, weight, complete };

//             try {
//                 const response = id
//                     ? await fetch(`/logExercise/${id}`, {
//                           method: 'PUT',
//                           headers: {
//                               'Content-Type': 'application/json',
//                           },
//                           body: JSON.stringify(payload),
//                       })
//                     : await fetch('/logExercise', {
//                           method: 'POST',
//                           headers: {
//                               'Content-Type': 'application/json',
//                           },
//                           body: JSON.stringify(payload),
//                       });

//                 if (response.ok) {
//                     const savedExercise = await response.json();
//                     if (!id) {
//                         card.setAttribute('data-id', savedExercise._id);
//                     }
//                     alert('Exercise saved successfully!');
//                 } else {
//                     alert('Error saving exercise');
//                 }
//             } catch (error) {
//                 console.error('Error saving exercise:', error);
//                 alert('Error saving exercise');
//             }
//         }
//     }

//     container.addEventListener('click', saveExerciseCard);
//     addButton.addEventListener('click', createNewExerciseCard);
// });

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.exercise-container');
    const addButton = document.getElementById('addButton');

    function createNewExerciseCard() {
        const card = document.createElement('div');
        card.classList.add('exercise-card');

        card.innerHTML = `
            <form>
                <div class="form-group">
                    <label for="exercise">Exercise:</label>
                    <input type="text" name="exercise" value="">
                </div>
                <div class="form-group">
                    <label for="sets">Sets:</label>
                    <input type="number" name="sets" value="">
                </div>
                <div class="form-group">
                    <label for="reps">Reps:</label>
                    <input type="number" name="reps" value="">
                </div>
                <div class="form-group">
                    <label for="weight">Weight (kg):</label>
                    <input type="number" name="weight" value="">
                </div>
                <div class="form-group">
                    <label for="complete">Complete:</label>
                    <select name="complete">
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
            const exercise = card.querySelector('input[name="exercise"]').value;
            const sets = card.querySelector('input[name="sets"]').value;
            const reps = card.querySelector('input[name="reps"]').value;
            const weight = card.querySelector('input[name="weight"]').value;
            const complete = card.querySelector('select[name="complete"]').value;

            const payload = { exercise, sets, reps, weight, complete };

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

                if (response.ok) {
                    const savedExercise = await response.json();
                    if (!id) {
                        card.setAttribute('data-id', savedExercise._id);
                    }
                    alert('Exercise saved successfully!');
                } else {
                    alert('Error saving exercise');
                }
            } catch (error) {
                console.error('Error saving exercise:', error);
                alert('Error saving exercise');
            }
        }
    }

    container.addEventListener('click', saveExerciseCard);
    addButton.addEventListener('click', createNewExerciseCard);
});
