function saveSelectedExercises() {
    const selectedExercises = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        selectedExercises.push(JSON.parse(checkbox.value));
    });

    const saveButton = document.getElementById('save-button');
    const warningMessage = document.getElementById('warning-message');

    if (selectedExercises.length === 0) {
        warningMessage.style.display = 'block'; // Show the warning message
        saveButton.disabled = true; // Disable the save button
        return; // Prevent form submission if no exercises are selected
    } else {
        warningMessage.style.display = 'none'; // Hide the warning message
        saveButton.disabled = false; // Enable the save button
    }

    document.getElementById('selectedExercises').value = JSON.stringify(selectedExercises);
    document.querySelector('form').action = '/bot/save'; // Ensure the form action is set correctly
    document.querySelector('form').submit();
}

function regenerateWorkout() {
    const form = document.querySelector('form');
    form.action = '/bot/generate';
    form.method = 'POST';

    const originalInputs = ['goal', 'method', 'type', 'level', 'days', 'time'];
    originalInputs.forEach(inputName => {
        const input = document.querySelector(`input[name="${inputName}"]`);
        if (input) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = inputName;
            hiddenInput.value = input.value;
            form.appendChild(hiddenInput);
        }
    });

    const generatedAtInput = document.createElement('input');
    generatedAtInput.type = 'hidden';
    generatedAtInput.name = 'generatedAt';
    generatedAtInput.value = new Date().toISOString();
    form.appendChild(generatedAtInput);

    form.submit();
}

// Add event listener to checkboxes to enable the save button when an exercise is selected
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const selectedExercises = document.querySelectorAll('input[type="checkbox"]:checked').length;
        const saveButton = document.getElementById('save-button');
        const warningMessage = document.getElementById('warning-message');

        if (selectedExercises > 0) {
            warningMessage.style.display = 'none';
            saveButton.disabled = false;
        } else {
            warningMessage.style.display = 'block';
            saveButton.disabled = true;
        }
    });
});