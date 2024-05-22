function saveSelectedExercises() {
    const selectedExercises = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        selectedExercises.push(JSON.parse(checkbox.value));
    });
    document.getElementById('selectedExercises').value = JSON.stringify(selectedExercises);
    document.querySelector('form').submit();
}

function regenerateWorkout() {
    const form = document.querySelector('form');
    form.action = '/bot/generate';
    form.method = 'POST';

    const generatedAtInput = document.createElement('input');
    generatedAtInput.type = 'hidden';
    generatedAtInput.name = 'generatedAt';
    generatedAtInput.value = new Date().toISOString();
    form.appendChild(generatedAtInput);

    form.submit();
}
