function navigateTo(route) {
    window.location.href = route;
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/dashboard/dashboard-data');
        const data = await response.json();

        // Update Weight Box
        document.getElementById('weightCurrent').innerText = `Current: ${data.weight.currentWeight} kg`;
        document.getElementById('weightGoal').innerText = `Starting: ${data.weight.startingWeight} kg`;
        document.getElementById('weightProgress').innerText = data.weight.progressMessage;

        // Update Meals Box
        document.getElementById('recentMeal').innerText = `Recent Meal: ${data.meal.recentMeal}`;
        document.getElementById('caloriesConsumed').innerText = `Calories: ${data.meal.caloriesConsumed}`;

        // Update Calories Box
        document.getElementById('caloriesConsumedValue').innerText = `Consumed: ${data.calories.consumed}`;
        document.getElementById('caloriesGoal').innerText = `Goal: ${data.calories.goal}`;
        document.getElementById('caloriesRemaining').innerText = `Remaining: ${data.calories.remaining}`;
        document.getElementById('caloriesMessage').innerText = data.calories.message;

        // Update color if consumed calories exceed goal by more than 20%
        if (parseFloat(data.calories.consumed) > parseFloat(data.calories.goal) * 1.2) {
            document.getElementById('caloriesConsumedValue').style.color = 'red';
        } else {
            document.getElementById('caloriesConsumedValue').style.color = '';
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
});


