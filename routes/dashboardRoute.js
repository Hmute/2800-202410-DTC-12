const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./User');
const DailyMacro = require('./healthRoutes').DailyMacro;
const Weight = require('./weightRoute').Weight;
const Routine = require('./Routine'); 

// Authentication middleware
function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }
  next();
}

// Route to fetch data for the dashboard
router.get('/dashboard-data', authMiddleware, async (req, res) => {
  const userId = req.session.userId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const user = await User.findById(userId);
    let startingWeight = parseFloat(user.startWeight) || null;
    const weightDataKg = await Weight.find({ userId }).sort({ date: 1 }).exec();

    if (!weightDataKg.length && user.weight) {
      startingWeight = parseFloat(user.weight);
      await User.findByIdAndUpdate(userId, { startWeight: startingWeight });
    } else if (!startingWeight && weightDataKg.length > 0) {
      startingWeight = weightDataKg[0].weightKg;
    }

    const currentWeight = weightDataKg.length > 0 ? weightDataKg[weightDataKg.length - 1].weightKg : startingWeight;
    const progress = startingWeight && currentWeight ? currentWeight - startingWeight : 0;

    const dailyMacro = await DailyMacro.findOne({ userId, date: today });
    const recentMeal = dailyMacro && dailyMacro.meals.length > 0 ? dailyMacro.meals[dailyMacro.meals.length - 1] : null;

    let caloriesConsumed = 0;
    if (dailyMacro) {
      caloriesConsumed = dailyMacro.calories;
    }
    const calorieGoal = user.calorieGoal || 2500;
    const caloriesRemaining = Math.max(calorieGoal - caloriesConsumed, 0);

    const routines = await Routine.find({ user: userId, createdAt: { $gte: today } });
    const totalExercises = routines.reduce((acc, routine) => acc + routine.exercises.length, 0);
    const completedExercises = routines.reduce((acc, routine) => acc + routine.exercises.filter(ex => ex.completion === 'Yes').length, 0);

    res.json({
      userName: user.name,
      weight: {
        startingWeight: startingWeight ? startingWeight.toFixed(2) : 'N/A',
        currentWeight: currentWeight ? currentWeight.toFixed(2) : 'N/A',
        progress: progress ? progress.toFixed(2) : 'N/A',
        progressMessage: startingWeight && currentWeight ? (progress < 0 ? `You have lost ${Math.abs(progress).toFixed(2)} kg so far! 😊` : `You have gained ${progress.toFixed(2)} kg so far! 😊`) : ''
      },
      meal: {
        recentMeal: recentMeal ? recentMeal.foodName : 'No meals logged',
        caloriesConsumed: recentMeal ? recentMeal.calories.toFixed(0) : 0
      },
      calories: {
        consumed: dailyMacro ? caloriesConsumed.toFixed(0) : '--',
        goal: dailyMacro ? calorieGoal.toFixed(0) : '--',
        remaining: dailyMacro ? caloriesRemaining.toFixed(0) : '--',
        message: dailyMacro ? (caloriesConsumed > calorieGoal * 1.2 ? 'You have exceeded your caloric intake!' : 'You have reached your caloric goal!') : ''
      },
      exercises: {
        total: totalExercises,
        completed: completedExercises,
        message: totalExercises > 0 ? (completedExercises === totalExercises ? 'Complete' : 'In Progress') : ''
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
