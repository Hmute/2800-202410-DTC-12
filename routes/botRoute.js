const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const router = express.Router();
const Workout = require('../routes/Workout');

const WGER_API_KEY = process.env.WGER_API_KEY; // Ensure this is set in your .env file

// Render the initial form page
router.get('/', (req, res) => {
  res.render('botInitial', { page: 'Workout Settings' });
});

// Handle form submission and generate workout recommendations
router.post('/generate', async (req, res) => {
  const userInput = req.body;
  const generatedAt = new Date(); // Save the current date and time

  try {
    const recommendations = await getWorkoutRecommendations(userInput);
    res.render('botResults', { page: 'Recommendations', data: userInput, recommendations, generatedAt });
  } catch (error) {
    console.error('Error generating workout recommendations:', error);
    res.status(500).send('Error generating workout recommendations');
  }
});

async function getWorkoutRecommendations(data) {
  const { goal, method, type, level, days, time } = data;

  // Count the number of selected days
  const daysArray = Array.isArray(days) ? days : [days];
  const daysCount = daysArray.length;

  // Log input data for debugging
  console.log('User input data:', data);
  console.log('Days count:', daysCount);

  try {
    // Fetch exercises based on the user settings
    const response = await axios.get('https://wger.de/api/v2/exerciseinfo/', {
      headers: {
        'Authorization': `Token ${WGER_API_KEY}`
      },
      params: {
        category: getCategoryBasedOnGoal(goal),
        equipment: getEquipmentBasedOnType(type),
        limit: 200 // Fetch more exercises for better randomness
      }
    });

    console.log('WGER API response:', response.data);

    if (response.data && response.data.results) {
      // Filter exercises to include only those in English
      const englishExercises = response.data.results.filter(exercise =>
        exercise.language && exercise.language.id === 2
      );

      // Use the Fisher-Yates shuffle algorithm to randomize the array
      for (let i = englishExercises.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [englishExercises[i], englishExercises[j]] = [englishExercises[j], englishExercises[i]];
      }

      // Limit to 10 exercises
      const selectedExercises = englishExercises.slice(0, 10);

      // Calculate repetitions based on level, days, and time
      const repetitions = calculateRepetitions(level, daysCount, time);

      // Include exercise names and repetitions
      return selectedExercises.map(exercise => ({
        name: exercise.name,
        repetitions: repetitions
      }));
    } else {
      throw new Error('Invalid response structure from WGER API');
    }
  } catch (apiError) {
    console.error('Error calling WGER API:', apiError);
    throw new Error('Failed to fetch workout recommendations from WGER API');
  }
}

function getCategoryBasedOnGoal(goal) {
  // Map the user's goal to a WGER exercise category ID
  const goalCategoryMap = {
    'Lose fat': 10, // Example category ID for fat loss exercises
    'Build muscle': 8, // Example category ID for muscle building exercises
    'Maintain': 14 // Example category ID for maintenance exercises
  };
  return goalCategoryMap[goal] || 8; // Default to muscle building if goal is not found
}

function getEquipmentBasedOnType(type) {
  // Map the user's workout type to a WGER equipment ID
  const typeEquipmentMap = {
    'No equipment': 7, // Example equipment ID for no equipment exercises
    'Weighted': 3, // Example equipment ID for weighted exercises
    'Body Weighted': 8 // Example equipment ID for body weighted exercises
  };
  return typeEquipmentMap[type] || 7; // Default to no equipment if type is not found
}

function calculateRepetitions(level, days, time) {
  // Convert time to a number and log it for debugging
  const timeNumber = parseInt(time, 10);
  console.log('Days (number):', days);
  console.log('Time (number):', timeNumber);

  if (isNaN(days) || isNaN(timeNumber)) {
    time = 30; // Default to 30 minutes if time is not a number
    days = 1; // Default to 1 day if days is not a number
    console.error('Invalid days or time value');
    return 'Invalid input';
  }

  let baseReps;
  switch (level) {
    case 'Beginner':
      baseReps = 10;
      break;
    case 'Intermediate':
      baseReps = 15;
      break;
    case 'Advanced':
      baseReps = 20;
      break;
    default:
      baseReps = 10;
  }

  const dayFactor = days / 7; // Normalizing days to a factor of 1
  const timeFactor = timeNumber / 30; // Assuming time is in minutes, normalized to 30 minutes

  // Calculate repetitions based on level, days, and time
  
  const repetitions = Math.round(baseReps * dayFactor * timeFactor);
  return repetitions;
}

// Handle form submission for saving selected exercises
router.post('/save', async (req, res) => {
  const { selectedExercises } = req.body;
  const userId = req.session.userId; // Assuming you have user sessions

  try {
    const exercises = JSON.parse(selectedExercises);

    for (const exercise of exercises) {
      await Workout.create({
        name: exercise.name,
        repetitions: exercise.repetitions,
        user: userId
      });
    }

    res.send('Workout saved successfully!');
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).send('Error saving workout');
  }
});

module.exports = router;
