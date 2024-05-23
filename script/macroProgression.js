document.addEventListener('DOMContentLoaded', function () {
    // Round Progress Bar for Calories
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    const consumedCalories = parseFloat(document.getElementById('consumedCalories').innerText);
    const remainingCalories = parseFloat(document.getElementById('remainingCalories').innerText);
    const goalCalories = parseFloat(document.getElementById('goalCalories').innerText);
  
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
  
    // Function to update progress bar width
    function updateProgressBar(barId, currentValue, maxValue) {
      const progressBar = document.getElementById(barId);
      const percentage = (currentValue / maxValue) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  
    // Update Nutrients Progress Bars
    const totalProtein = parseFloat(document.getElementById('totalProtein').innerText);
    const goalProtein = parseFloat(document.getElementById('goalProtein').innerText);
    const totalCarbs = parseFloat(document.getElementById('totalCarbs').innerText);
    const goalCarbs = parseFloat(document.getElementById('goalCarbs').innerText);
    const totalFats = parseFloat(document.getElementById('totalFats').innerText);
    const goalFats = parseFloat(document.getElementById('goalFats').innerText);
  
    updateProgressBar('proteinBar', totalProtein, goalProtein);
    updateProgressBar('carbsBar', totalCarbs, goalCarbs);
    updateProgressBar('fatsBar', totalFats, goalFats);
  });
  