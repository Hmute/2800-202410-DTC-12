function navigateTo(route) {
    window.location.href = route;
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/dashboard/dashboard-data');
        const data = await response.json();

        // Update Weight Box
        if (document.getElementById('weightCurrent')) {
            document.getElementById('weightCurrent').innerText = `Current: ${data.weight.currentWeight} kg`;
        }
        if (document.getElementById('weightGoal')) {
            document.getElementById('weightGoal').innerText = `Starting: ${data.weight.startingWeight} kg`;
        }
        if (document.getElementById('weightProgress')) {
            document.getElementById('weightProgress').innerText = data.weight.progressMessage;
        }

        // Update Meals Box
        if (document.getElementById('recentMeal')) {
            document.getElementById('recentMeal').innerText = `Recent Meal: ${data.meal.recentMeal}`;
        }
        if (document.getElementById('caloriesConsumed')) {
            document.getElementById('caloriesConsumed').innerText = `Calories: ${data.meal.caloriesConsumed}`;
        }

        // Update Calories Box
        if (document.getElementById('caloriesConsumedValue')) {
            document.getElementById('caloriesConsumedValue').innerText = `Consumed: ${data.calories.consumed}`;
        }
        if (document.getElementById('caloriesGoal')) {
            document.getElementById('caloriesGoal').innerText = `Goal: ${data.calories.goal}`;
        }
        if (document.getElementById('caloriesRemaining')) {
            document.getElementById('caloriesRemaining').innerText = `Remaining: ${data.calories.remaining}`;
        }
        if (document.getElementById('caloriesMessage')) {
            document.getElementById('caloriesMessage').innerText = data.calories.message;
        }

        // Update color if consumed calories exceed goal by more than 20%
        if (parseFloat(data.calories.consumed) > parseFloat(data.calories.goal) * 1.2) {
            document.getElementById('caloriesConsumedValue').style.color = 'red';
        } else {
            document.getElementById('caloriesConsumedValue').style.color = '';
        }

        // Update Exercise Box
        if (document.getElementById('totalExercises')) {
            document.getElementById('totalExercises').innerText = `Total: ${data.exercises.total}`;
        }
        if (document.getElementById('completedExercises')) {
            document.getElementById('completedExercises').innerText = `Completed: ${data.exercises.completed}`;
        }
        if (document.getElementById('exerciseMessage')) {
            if (data.exercises.total > 0) {
                document.getElementById('exerciseMessage').innerText = data.exercises.message;
                document.getElementById('exerciseMessage').style.color = data.exercises.completed === data.exercises.total ? 'green' : 'red';
            } else {
                document.getElementById('exerciseMessage').innerText = '';
            }
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
});
