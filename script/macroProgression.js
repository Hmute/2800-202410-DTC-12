document.addEventListener('DOMContentLoaded', function () {
  // Round Progress Bar for Calories
  const ctx = document.getElementById('caloriesChart').getContext('2d');
  const consumedCalories = parseFloat(document.getElementById('consumedCalories').innerText);
  const remainingCaloriesElement = document.getElementById('remainingCalories');
  const goalCalories = parseFloat(document.getElementById('goalCalories').innerText);

  const remainingCalories = Math.max(goalCalories - consumedCalories, 0);
  remainingCaloriesElement.innerText = remainingCalories.toFixed(0);

  const caloriesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [consumedCalories, remainingCalories],
        backgroundColor: ['#4caf50', '#e0e0e0'],
        borderWidth: 1,
      }],
    },
    options: {
      cutout: '85%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: false,
        },
      },
    },
  });

  // Display warning if caloric intake is exceeded
  const caloriesWarning = document.getElementById('caloriesWarning');
  if (consumedCalories > goalCalories) {
    caloriesWarning.textContent = `You have exceeded your caloric intake by ${(consumedCalories - goalCalories).toFixed(0)} calories.`;
    caloriesWarning.style.display = 'block';
  }

  // Function to update progress bar width
  function updateProgressBar(barId, currentValue, maxValue) {
    const progressBar = document.getElementById(barId);
    const percentage = (currentValue / maxValue) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  // Function to update the color of intake value if it exceeds the goal
  function updateIntakeColor(intakeId, currentValue, maxValue) {
    const intakeElement = document.getElementById(intakeId);
    if (currentValue > maxValue) {
      intakeElement.style.color = 'red';
    } else {
      intakeElement.style.color = '';
    }
  }

  // Update Nutrients Progress Bars
  const totalProtein = parseFloat(document.getElementById('totalProtein').innerText);
  const goalProtein = parseFloat(document.getElementById('goalProtein').innerText);
  const totalCarbs = parseFloat(document.getElementById('totalCarbs').innerText);
  const goalCarbs = parseFloat(document.getElementById('goalCarbs').innerText);
  const totalFats = parseFloat(document.getElementById('totalFats').innerText);
  const goalFats = parseFloat(document.getElementById('goalFats').innerText);
  const totalCalorie = parseFloat(document.getElementById('consumedCalories').innerText);
  const goalCalorie = parseFloat(document.getElementById('goalCalories').innerText);

  updateProgressBar('proteinBar', totalProtein, goalProtein);
  updateProgressBar('carbsBar', totalCarbs, goalCarbs);
  updateProgressBar('fatsBar', totalFats, goalFats);

  updateIntakeColor('totalProtein', totalProtein, goalProtein);
  updateIntakeColor('totalCarbs', totalCarbs, goalCarbs);
  updateIntakeColor('totalFats', totalFats, goalFats);
  updateIntakeColor('consumedCalories', totalCalorie, goalCalorie);

  // Display warnings if goals are exceeded
  const proteinWarning = document.getElementById('proteinWarning');
  const carbsWarning = document.getElementById('carbsWarning');
  const fatsWarning = document.getElementById('fatsWarning');

  if (totalProtein > goalProtein) {
    proteinWarning.textContent = `You have exceeded your protein intake by ${(totalProtein - goalProtein).toFixed(1)} grams.`;
    proteinWarning.style.display = 'block';
  }
  if (totalCarbs > goalCarbs) {
    carbsWarning.textContent = `You have exceeded your carbohydrate intake by ${(totalCarbs - goalCarbs).toFixed(1)} grams.`;
    carbsWarning.style.display = 'block';
  }
  if (totalFats > goalFats) {
    fatsWarning.textContent = `You have exceeded your fat intake by ${(totalFats - goalFats).toFixed(1)} grams.`;
    fatsWarning.style.display = 'block';
  }
});
