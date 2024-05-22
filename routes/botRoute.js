const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const router = express.Router();
const Routine = require('../routes/Routine'); // Ensure this refers to the correct model file
const User = require('../routes/User');

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
    // Fetch a larger set of exercises based on the user settings
    const response = await axios.get('https://wger.de/api/v2/exerciseinfo/', {
      headers: {
        'Authorization': `Token ${WGER_API_KEY}`
      },
      params: {
        category: getCategoryBasedOnGoal(goal),
        equipment: getEquipmentBasedOnType(type),
        limit: 500 // Fetch even more exercises for better randomness
      }
    });

    console.log('WGER API response:', response.data);

    if (response.data && response.data.results) {
      // Filter exercises to include only those in English
      const englishExercises = response.data.results.filter(exercise =>
        exercise.language && exercise.language.id === 2
      );

      // Shuffle the exercises
      const shuffledExercises = shuffleArray(englishExercises);

      // Select a subset of exercises
      const selectedExercises = shuffledExercises.slice(0, 10);

      // Calculate repetitions based on level, days, and time
      const repetitions = calculateRepetitions(level, daysCount, time);
      const sets = calculateSets(level); // Calculate sets based on level

      // Include exercise names, repetitions, sets, and completed status
      return selectedExercises.map(exercise => ({
        name: exercise.name,
        repetitions: repetitions,
        sets: sets,
        date: new Date(), // Set the date to the current date
        completed: false // Set completed to false initially
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
  const timeNumber = parseInt(time, 10) || 30; // Default to 30 minutes if time is not a number
  const daysNumber = parseInt(days, 10) || 1; // Default to 1 day if days is not a number

  if (isNaN(daysNumber) || isNaN(timeNumber)) {
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

  const dayFactor = daysNumber / 7; // Normalizing days to a factor of 1
  const timeFactor = timeNumber / 30; // Assuming time is in minutes, normalized to 30 minutes

  const repetitions = Math.round(baseReps * dayFactor * timeFactor);
  return repetitions;
}

function calculateSets(level) {
  switch (level) {
    case 'Beginner':
      return 3;
    case 'Intermediate':
      return 4;
    case 'Advanced':
      return 5;
    default:
      return 3;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

router.post('/save', async (req, res) => {
  const { selectedExercises } = req.body;
  const userId = req.session.userId; // Ensure userId is set in the session

  if (!userId) {
    console.error('User ID not found in session');
    return res.status(400).send('User ID not found in session');
  }

  if (!selectedExercises || JSON.parse(selectedExercises).length === 0) {
    console.error('No exercises selected');
    return res.status(400).send('No exercises selected');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    const exercises = JSON.parse(selectedExercises);

    const routine = new Routine({
      user: userId,
      exercises: exercises.map(exercise => ({
        ...exercise,
        completed: false // Ensure completed is set to false initially
      }))
    });

    await routine.save();

    if (!user.routines) {
      user.routines = [];
    }

    user.routines.push(routine._id);
    await user.save();

    res.redirect('/home?saved=true'); // Redirect to home with query parameter
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).send('Error saving workout');
  }
});

module.exports = router;
