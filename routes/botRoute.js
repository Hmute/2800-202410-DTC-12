const express = require('express');
const axios = require('axios');
const router = express.Router();

const WGER_API_KEY = process.env.WGER_API_KEY; // Ensure this is set in your .env file

// Render the initial form page
router.get('/', (req, res) => {
  res.render('botInitial', { page: 'Workout Settings' });
});

// Handle form submission and generate workout recommendations
router.post('/generate', async (req, res) => {
  const userInput = req.body;

  try {
    const recommendations = await getWorkoutRecommendations(userInput);
    res.render('botResults', { page: 'Recommendations', data: userInput, recommendations });
  } catch (error) {
    console.error('Error generating workout recommendations:', error);
    res.status(500).send('Error generating workout recommendations');
  }
});

async function getWorkoutRecommendations(data) {
  const { goal, method, type, level, days, time } = data;

  try {
    // Fetch exercises based on the user settings
    const response = await axios.get('https://wger.de/api/v2/exerciseinfo/', {
      headers: {
        'Authorization': `Token ${WGER_API_KEY}`
      },
      params: {
        category: getCategoryBasedOnGoal(goal),
        equipment: getEquipmentBasedOnType(type),
        limit: 50 // Fetch more exercises for better randomness
      }
    });

    console.log('WGER API response:', response.data);

    if (response.data && response.data.results) {
      // Randomize and limit to 10 exercises
      const shuffled = response.data.results.sort(() => 0.5 - Math.random());
      const selectedExercises = shuffled.slice(0, 10);
      return selectedExercises.map(exercise => exercise.name);
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

module.exports = router;