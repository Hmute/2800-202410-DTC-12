// Function to save the selected exercises
function saveSelectedExercises() {
  const selectedExercises = [];
  // Collect all checked checkboxes and add their values to the selectedExercises array
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedExercises.push(JSON.parse(checkbox.value));
    });

  const saveButton = document.getElementById("save-button");
  const warningMessage = document.getElementById("warning-message");

  // Show warning message and disable save button if no exercises are selected
  if (selectedExercises.length === 0) {
    warningMessage.style.display = "block";
    saveButton.disabled = true;
    return;
  } else {
    // Hide warning message and enable save button if exercises are selected
    warningMessage.style.display = "none";
    saveButton.disabled = false;
  }

  // Set the value of the hidden input field to the selected exercises and submit the form
  document.getElementById("selectedExercises").value =
    JSON.stringify(selectedExercises);
  document.querySelector("form").action = "/bot/save";
  document.querySelector("form").submit();
}

// Function to regenerate the workout
function regenerateWorkout() {
  const form = document.querySelector("form");
  form.action = "/bot/generate";
  form.method = "POST";

  const originalInputs = ["goal", "method", "type", "level", "days", "time"];
  // Append hidden input fields with the original values to the form
  originalInputs.forEach((inputName) => {
    const input = document.querySelector(`input[name="${inputName}"]`);
    if (input) {
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = inputName;
      hiddenInput.value = input.value;
      form.appendChild(hiddenInput);
    }
  });

  // Append a hidden input field with the current timestamp to the form
  const generatedAtInput = document.createElement("input");
  generatedAtInput.type = "hidden";
  generatedAtInput.name = "generatedAt";
  generatedAtInput.value = new Date().toISOString();
  form.appendChild(generatedAtInput);

  // Submit the form to regenerate the workout
  form.submit();
}

// Add event listeners to checkboxes to enable/disable the save button based on selection
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedExercises = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;
    const saveButton = document.getElementById("save-button");
    const warningMessage = document.getElementById("warning-message");

    // Show/hide warning message and enable/disable save button based on selection
    if (selectedExercises > 0) {
      warningMessage.style.display = "none";
      saveButton.disabled = false;
    } else {
      warningMessage.style.display = "block";
      saveButton.disabled = true;
    }
  });
});
