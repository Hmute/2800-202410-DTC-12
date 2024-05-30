const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const User = require('./User');
const cron = require('node-cron'); 

const API_KEY = 'c67a4478403a4b289ed42b3d73447701';

// DailyMacro schema
const dailyMacroSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  meals: [{
    mealType: { type: String, required: true },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    date: { type: Date, required: true }
  }]
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

// Function to correct negative values
const correctNegativeValues = (entry) => {
  entry.calories = Math.max(entry.calories, 0);
  entry.protein = Math.max(entry.protein, 0);
  entry.carbs = Math.max(entry.carbs, 0);
  entry.fats = Math.max(entry.fats, 0);
  return entry;
};

// Function to check if the goal is reasonable
const isReasonableGoal = (weightGoal, currentWeight, goalTimeframe) => {
  const weightDifference = Math.abs(currentWeight - weightGoal);
  const weeklyWeightChange = weightDifference / goalTimeframe;
  const maxWeeklyWeightLoss = 1; // Maximum safe weight loss per week in kg

  return weeklyWeightChange <= maxWeeklyWeightLoss;
};

// Function to calculate recommended timeframe
const calculateRecommendedTimeframe = (weightGoal, currentWeight) => {
  const weightDifference = Math.abs(currentWeight - weightGoal);
  const maxWeeklyWeightLoss = 1; // Maximum safe weight loss per week in kg
  return Math.ceil(weightDifference / maxWeeklyWeightLoss);
};

// Middleware to check if the user has set a weight goal
const checkWeightGoal = async (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  const user = await User.findById(req.session.user._id);
  if (!user.weightGoal) {
    return res.redirect('/health/setWeightGoal');
  }
  next();
};

// Function to get nutritional info from Spoonacular API
const getNutritionalInfo = async (ingredients) => {
  try {
    const ingredientList = ingredients.map(ingredient => `${ingredient.name} ${ingredient.amount}${ingredient.unit}`).join('\n');
    console.log('Formatted ingredientList:', ingredientList);

    // Parse ingredients to get IDs
    const parseResponse = await axios.post(
      `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${API_KEY}`,
      { ingredientList, servings: 1 },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [(data, headers) => {
          return `ingredientList=${encodeURIComponent(data.ingredientList)}&servings=${data.servings}`;
        }]
      }
    );

    const parsedIngredients = parseResponse.data;
    console.log('Parsed Ingredients:', parsedIngredients);

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    // Fetch detailed nutritional information using ingredient IDs
    for (const ingredient of parsedIngredients) {
      const ingredientId = ingredient.id;
      const ingredientInfoResponse = await axios.get(`https://api.spoonacular.com/food/ingredients/${ingredientId}/information?apiKey=${API_KEY}&amount=${ingredient.amount}&unit=${ingredient.unit}`);
      const nutrition = ingredientInfoResponse.data.nutrition?.nutrients;

      if (nutrition) {
        const calories = nutrition.find(nutrient => nutrient.name === 'Calories')?.amount || 0;
        const protein = nutrition.find(nutrient => nutrient.name === 'Protein')?.amount || 0;
        const carbs = nutrition.find(nutrient => nutrient.name === 'Carbohydrates')?.amount || 0;
        const fats = nutrition.find(nutrient => nutrient.name === 'Fat')?.amount || 0;

        totalCalories += calories;
        totalProtein += protein;
        totalCarbs += carbs;
        totalFats += fats;

        console.log(`Ingredient: ${ingredient.name}, Calories: ${calories}, Protein: ${protein}, Carbs: ${carbs}, Fats: ${fats}`);
      } else {
        console.log(`No nutrition data found for ingredient: ${ingredient.name}`);
      }
    }

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats
    };
  } catch (error) {
    console.error('Error fetching nutritional info:', error);
    throw error;
  }
};

// Route to render the add meal page
router.get('/addMeal', checkWeightGoal, async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  const { mealType } = req.query;
  if (!mealType) {
    return res.status(400).send('Meal type is required');
  }
  res.render('addMeal', { page: 'Add Meal', mealType });
});

// Route to handle adding food and updating macros
router.post('/addMeal', async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  const { mealType, foodName, ingredients, portionSizes, portionUnits } = req.body;
  try {
    const userId = req.session.user._id;

    const ingredientList = ingredients.map((ingredient, index) => ({
      name: ingredient,
      amount: portionSizes[index],
      unit: portionUnits[index]
    }));

    console.log('Ingredient List:', ingredientList); // Log the ingredientList for debugging

    const nutritionalInfo = await getNutritionalInfo(ingredientList);
    const meal = {
      mealType,
      foodName,
      calories: nutritionalInfo.calories,
      protein: nutritionalInfo.protein,
      carbs: nutritionalInfo.carbs,
      fats: nutritionalInfo.fats,
      date: new Date().setHours(0, 0, 0, 0)
    };

    const today = new Date().setHours(0, 0, 0, 0);
    let dailyMacro = await DailyMacro.findOne({ userId, date: today });

    if (!dailyMacro) {
      dailyMacro = new DailyMacro({
        userId,
        date: today,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        meals: [meal]
      });
    } else {
      dailyMacro.calories += meal.calories;
      dailyMacro.protein += meal.protein;
      dailyMacro.carbs += meal.carbs;
      dailyMacro.fats += meal.fats;
      dailyMacro.meals.push(meal);
    }

    await dailyMacro.save();
    res.redirect('/health/meals');
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the meal page
router.get('/meals', checkWeightGoal, async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  try {
    const userId = req.session.user._id;
    const today = new Date().setHours(0, 0, 0, 0);
    const dailyMacro = await DailyMacro.findOne({ userId, date: today });

    res.render('meals', { page: 'Meals', dailyMacros: dailyMacro ? dailyMacro.meals : [] });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to macro progression page
router.get('/macroProgression', checkWeightGoal, async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    const today = new Date().setHours(0, 0, 0, 0);
    const dailyMacro = await DailyMacro.findOne({ userId, date: today });

    let consumedCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    if (dailyMacro) {
      consumedCalories = dailyMacro.calories;
      totalProtein = dailyMacro.protein;
      totalCarbs = dailyMacro.carbs;
      totalFats = dailyMacro.fats;
    }

    const goalCalories = user.calorieGoal || 2500;
    const remainingCalories = goalCalories - consumedCalories;

    const goalProtein = (goalCalories * 0.30) / 4; // 30% of calories from protein, 4 cal per gram
    const goalCarbs = (goalCalories * 0.40) / 4; // 40% of calories from carbs, 4 cal per gram
    const goalFats = (goalCalories * 0.30) / 9; // 30% of calories from fats, 9 cal per gram

    res.render('macroProgression', {
      page: 'Nutrition',
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

// Route to render the weight goal setting page
router.get('/setWeightGoal', async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  try {
    const user = await User.findById(req.session.user._id);
    const errorMessage = req.query.error;
    const recommendedTimeframe = req.query.recommendedTimeframe;
    if (!user.gender || !user.weight || !user.height || !user.age) {
      res.render('completeProfile', { user, page: 'Complete Profile' });
    } else {
      res.render('setWeightGoal', { user, page: 'Set Weight Goal', errorMessage, recommendedTimeframe });
    }
  } catch (error) {
    console.error('Error rendering setWeightGoal:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle profile completion submission
router.post('/completeProfile', async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
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
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
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

    // Validate the weight goal and timeframe
    if (!isReasonableGoal(weightGoal, weight, goalTimeframe)) {
      const recommendedTimeframe = calculateRecommendedTimeframe(weightGoal, weight);
      return res.redirect(`/health/setWeightGoal?error=Extreme weight goals are not recommended. Please set a more reasonable timeframe.&recommendedTimeframe=${recommendedTimeframe}`);
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
  
    const correctedDailyMacro = correctNegativeValues(dailyMacro);
    await correctedDailyMacro.save();
  
    console.log('Daily macro entry saved:', correctedDailyMacro);
  
    res.redirect('/health/macroProgression');
  } catch (error) {
    console.error('Error setting weight goal:', error.message); 
    res.status(500).send('Internal Server Error');
  }
});

router.get('/autocomplete', async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  const query = req.query.q;
  if (!query) {
    return res.status(400).send('Query parameter "q" is required');
  }

  try {
    const response = await axios.get(`https://api.spoonacular.com/food/ingredients/autocomplete`, {
      params: {
        apiKey: API_KEY,
        query,
        number: 10
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Clear previous day's data at midnight
cron.schedule('0 0 * * *', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  // Clear previous day's data
  try {
    await DailyMacro.deleteMany({ date: yesterday });
    console.log('Previous day\'s data cleared');
  } catch (error) {
    console.error('Error clearing previous day\'s data:', error);
  }
});

module.exports = {
  router,
  DailyMacro
};
