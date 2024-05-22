document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector('.exercise-container');
    const addButton = document.getElementById('addButton');

    let cardIndex = 1; // Start the index at 1 since there's already one card

    function createNewExerciseCard() {
        const card = document.createElement('div');
        card.classList.add('exercise-card');

        card.innerHTML = `
            <form method="POST" action="/logExercise">
                <div class="form-group">
                    <label for="exercise${cardIndex}">Exercise:</label>
                    <input type="text" id="exercise${cardIndex}" name="exercise" value="">
                </div>
                <div class="form-group">
                    <label for="sets${cardIndex}">Sets:</label>
                    <input type="number" id="sets${cardIndex}" name="sets" value="">
                </div>
                <div class="form-group">
                    <label for="reps${cardIndex}">Reps:</label>
                    <input type="number" id="reps${cardIndex}" name="reps" value="">
                </div>
                <div class="form-group">
                    <label for="weight${cardIndex}">Weight (kg):</label>
                    <input type="number" id="weight${cardIndex}" name="weight" value="">
                </div>
                <div class="form-group">
                    <label for="complete${cardIndex}">Complete:</label>
                    <select id="complete${cardIndex}" name="complete">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <button type="submit" class="save-button" id="saveButton">Save Entry</button>
                <button type="submit" class="delete-button">Delete Entry</button> 
            </form>
        `;

        container.insertBefore(card, addButton.parentNode); // Insert the new card before the add button

        cardIndex++; // Increment the index for the next card
    }
    

    addButton.addEventListener('click', createNewExerciseCard);
});
