const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const User = require('./User'); 

const API_KEY = 'c67a4478403a4b289ed42b3d73447701';

// DailyMacro schema
const dailyMacroSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true }
});

const DailyMacro = mongoose.model('DailyMacro', dailyMacroSchema);

// Function to calculate BMR
const calculateBMR = (gender, weight, height, age) => {
  weight = parseFloat(weight);
  height = parseFloat(height);
  age = parseInt(age, 10);

  if (isNaN(weight) || isNaN(height) || isNaN(age)) {
    console.error('Invalid input values for BMR calculation');
    return NaN;
  }

  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'female') {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    return 400 + (10 * weight) + (3 * height) - (5 * age); 
  }
};

// Function to calculate TDEE
const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
  };

  if (isNaN(bmr)) {
    console.error('Invalid BMR value for TDEE calculation');
    return NaN;
  }

  return bmr * (activityMultipliers[activityLevel] || 1.2); 
};

// Function to adjust TDEE based on weight goal
const adjustTDEEForWeightGoal = (tdee, weightGoal, currentWeight, goalTimeframe) => {
  const weightDifference = currentWeight - weightGoal;
  const weeklyWeightChange = weightDifference / goalTimeframe;
  const dailyCaloricAdjustment = (weeklyWeightChange * 7700) / 7; // 7700 calories per kg

  return tdee - dailyCaloricAdjustment;
};

// Middleware to check if the user has set a weight goal
const checkWeightGoal = async (req, res, next) => {
  const user = await User.findById(req.session.user._id);
  if (!user.weightGoal) {
    return res.redirect('/health/setWeightGoal');
  }
  next();
};

// Route to macro progression page
router.get('/macroProgression', checkWeightGoal, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    // Default values when no meals have been logged
    let consumedCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    // Calculate the goal based on the user's calorie goal
    const goalCalories = user.calorieGoal || 2500; 
    const remainingCalories = goalCalories - consumedCalories;

    const goalProtein = (goalCalories * 0.30) / 4; // 30% of calories from protein, 4 cal per gram
    const goalCarbs = (goalCalories * 0.40) / 4; // 40% of calories from carbs, 4 cal per gram
    const goalFats = (goalCalories * 0.30) / 9; // 30% of calories from fats, 9 cal per gram

    res.render('macroProgression', {
      page: 'Calories',
      macros: [], 
      goalCalories,
      consumedCalories,
      remainingCalories,
      totalProtein,
      totalCarbs,
      totalFats,
      goalProtein,
      goalCarbs,
      goalFats
    });
  } catch (error) {
    console.error('Error rendering macroProgression:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Route to fetch nutritional info and add food entry from spoonacular api
const getNutritionalInfo = async (foodItems) => {
  try {
    const response = await axios.post(`https://api.spoonacular.com/recipes/visualizeNutrition`, {
      ingredientList: foodItems,
      servings: 1
    }, {
      params: { apiKey: API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nutritional info:', error);
    throw error;
  }
};

router.post('/addFood', async (req, res) => {
  const { foodItems } = req.body;
  try {
    const nutritionalInfo = await getNutritionalInfo(foodItems);
    const dailyMacro = new DailyMacro({
      userId: req.session.user._id,
      date: new Date(),
      calories: nutritionalInfo.calories,
      protein: nutritionalInfo.protein,
      carbs: nutritionalInfo.carbs,
      fats: nutritionalInfo.fat
    });
    await dailyMacro.save();
    res.status(201).send('Food added and nutritional info saved successfully');
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the weight goal setting page
router.get('/setWeightGoal', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user.gender || !user.weight || !user.height || !user.age) {
      res.render('completeProfile', { user, page: 'Complete Profile' });
    } else {
      res.render('setWeightGoal', { user, page: 'Set Weight Goal' });
    }
  } catch (error) {
    console.error('Error rendering setWeightGoal:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle profile completion submission
router.post('/completeProfile', async (req, res) => {
  const { gender, weight, height, age } = req.body;
  try {
    const user = await User.findById(req.session.user._id);
    user.gender = gender;
    user.weight = weight;
    user.height = height;
    user.age = age;
    await user.save();
    res.redirect('/health/setWeightGoal');
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle weight goal submission
router.post('/setWeightGoal', async (req, res) => {
  const { weightGoal, goalTimeframe } = req.body;
  try {
    console.log('Form data received:', req.body);

    const user = await User.findById(req.session.user._id);
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }

    console.log('User found:', user);

    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const age = parseInt(user.age, 10);
    const gender = user.gender;
    const activityLevel = user.activityLevel || 'sedentary';

    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
      console.error('Invalid user data:', { weight, height, age });
      throw new Error('Invalid user data');
    }

    const bmr = calculateBMR(gender, weight, height, age);
    const tdee = calculateTDEE(bmr, activityLevel);

    if (isNaN(bmr) || isNaN(tdee)) {
      console.error('BMR or TDEE calculation resulted in NaN:', { bmr, tdee });
      throw new Error('Invalid BMR or TDEE calculation');
    }

    const adjustedTDEE = adjustTDEEForWeightGoal(tdee, weightGoal, weight, goalTimeframe);

    console.log('Calculated BMR:', bmr);
    console.log('Calculated TDEE:', tdee);
    console.log('Adjusted TDEE for weight goal:', adjustedTDEE);

    user.weightGoal = weightGoal;
    user.calorieGoal = adjustedTDEE; 
    user.goalTimeframe = goalTimeframe;
    await user.save();

    // Insert a daily macro entry for the new weight goal
    const dailyMacro = new DailyMacro({
      userId: user._id,
      date: new Date(),
      calories: adjustedTDEE,
      protein: (adjustedTDEE * 0.30) / 4, // 30% of calories from protein
      carbs: (adjustedTDEE * 0.40) / 4, // 40% of calories from carbs
      fats: (adjustedTDEE * 0.30) / 9 // 30% of calories from fats
    });

    await dailyMacro.save();

    console.log('Daily macro entry saved:', dailyMacro);

    res.redirect('/health/macroProgression');
  } catch (error) {
    console.error('Error setting weight goal:', error.message); 
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
