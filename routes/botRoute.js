const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const router = express.Router();
const Routine = require('../routes/Routine'); // Ensure this refers to the correct model file
const PastRoutine = require('../routes/PastRoutine');
const User = require('../routes/User');

const WGER_API_KEY = process.env.WGER_API_KEY; // Ensure this is set in your .env file

// Function to fetch workout recommendations
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
  const goalCategoryMap = {
    'Lose fat': 10,
    'Build muscle': 8,
    'Maintain': 14
  };
  return goalCategoryMap[goal] || 8;
}

function getEquipmentBasedOnType(type) {
  const typeEquipmentMap = {
    'No equipment': 7,
    'Weighted': 3,
    'Body Weighted': 8
  };
  return typeEquipmentMap[type] || 7;
}

function calculateRepetitions(level, days, time) {
  const timeNumber = parseInt(time, 10) || 30;
  const daysNumber = parseInt(days, 10) || 1;

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

  const dayFactor = daysNumber / 7;
  const timeFactor = timeNumber / 30;

  return Math.round(baseReps * dayFactor * timeFactor);
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

// Render the initial form page
router.get('/', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    console.error('User ID not found in session');
    return res.status(400).send('User ID not found in session');
  }

  try {
    const user = await User.findById(userId).populate('currentRoutine'); // Fetch the user's current routine

    if (!user) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    const hasCurrentRoutine = user.currentRoutine !== null;

    res.render('botInitial', { page: 'Workout Settings', hasCurrentRoutine });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
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

// Generate daily workouts based on saved routines
router.get('/daily', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    console.error('User ID not found in session');
    return res.status(400).send('User ID not found in session');
  }

  try {
    const user = await User.findById(userId).populate('currentRoutine');

    if (!user || !user.currentRoutine) {
      console.error('User or current routine not found');
      return res.status(404).send('User or current routine not found');
    }

    const dailyWorkout = generateDailyWorkout(user.currentRoutine);
    res.json({ dailyWorkout }); // Return the daily workout as JSON
  } catch (error) {
    console.error('Error generating daily workout:', error);
    res.status(500).send('Error generating daily workout');
  }
});

function generateDailyWorkout(currentRoutine) {
  const allExercises = currentRoutine.exercises;
  const shuffledExercises = shuffleArray(allExercises);
  return shuffledExercises.slice(0, 5); // Select a subset of exercises for the daily workout
}

router.post('/save', async (req, res) => {
  const { selectedExercises } = req.body;
  const userId = req.session.userId;

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

    const newRoutine = new Routine({
      user: userId,
      exercises: exercises.map(exercise => ({
        ...exercise,
        completed: false
      }))
    });

    await newRoutine.save();

    if (user.currentRoutine) {
      const pastRoutine = new PastRoutine({
        user: userId,
        exercises: user.currentRoutine.exercises
      });
      await pastRoutine.save();

      user.pastRoutines.push(pastRoutine._id);
    }

    user.currentRoutine = newRoutine._id;
    await user.save();

    res.redirect('/home?saved=true'); // Redirect to home with query parameter
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).send('Error saving workout');
  }
});

// Accept a workout
router.post('/accept', async (req, res) => {
  const { routineId } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    console.error('User ID not found in session');
    return res.status(400).send('User ID not found in session');
  }

  try {
    const routine = await Routine.findById(routineId);
    if (!routine) {
      console.error('Routine not found');
      return res.status(404).send('Routine not found');
    }

    routine.status = 'accepted';
    await routine.save();

    res.redirect('/home');
  } catch (error) {
    console.error('Error accepting workout:', error);
    res.status(500).send('Error accepting workout');
  }
});

// Decline a workout
router.post('/decline', async (req, res) => {
  const { routineId } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    console.error('User ID not found in session');
    return res.status(400).send('User ID not found in session');
  }

  try {
    const routine = await Routine.findById(routineId);
    if (!routine) {
      console.error('Routine not found');
      return res.status(404).send('Routine not found');
    }

    routine.status = 'declined';
    await routine.save();

    res.redirect('/home');
  } catch (error) {
    console.error('Error declining workout:', error);
    res.status(500).send('Error declining workout');
  }
});

module.exports = router;
