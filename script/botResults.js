function saveSelectedExercises() {
    const selectedExercises = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        selectedExercises.push(JSON.parse(checkbox.value));
    });
    document.getElementById('selectedExercises').value = JSON.stringify(selectedExercises);
    document.querySelector('form').submit();
}

function regenerateWorkout() {
    document.getElementById('regenerateForm').action = '/bot/generate';
    document.getElementById('regenerateForm').submit();
}
