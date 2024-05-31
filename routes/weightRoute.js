const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./User'); 

// Define the weight schema and model
const weightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weightKg: { type: Number, required: true }
});

weightSchema.index({ userId: 1, date: 1 }, { unique: true });

const Weight = mongoose.model('Weight', weightSchema);

// Authentication middleware
function authMiddleware(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  next();
}

// Route to render the weight tracking page
router.get('/', authMiddleware, (req, res) => {
  res.render('weight', { page: 'Weight' });
});

// Route to fetch weight data for a user
router.get('/weight-data', authMiddleware, async (req, res) => {
  const userId = req.session.userId;
  try {
    const user = await User.findById(userId);
    let startingWeight = parseFloat(user.startWeight) || null;

    const weightDataKg = await Weight.find({ userId }).sort({ date: 1 }).exec();

    // If there are no weight logs and user weight exists, set startingWeight to user's weight
    if (!weightDataKg.length && user.weight) {
      startingWeight = parseFloat(user.weight);

      // Add the startWeight to the user collection
      await User.findByIdAndUpdate(userId, { startWeight: startingWeight });
    } else if (!startingWeight && weightDataKg.length > 0) {
      startingWeight = weightDataKg[0].weightKg;
    }

    const currentWeight = weightDataKg.length > 0 ? weightDataKg[weightDataKg.length - 1].weightKg : startingWeight;
    const progress = startingWeight && currentWeight ? currentWeight - startingWeight : 0;

    console.log('Starting Weight:', startingWeight);
    console.log('Current Weight:', currentWeight);
    console.log('Progress:', progress);

    res.json({
      startingWeight: startingWeight ? startingWeight.toFixed(2) : 'N/A',
      currentWeight: currentWeight ? currentWeight.toFixed(2) : 'N/A',
      progress: progress ? progress.toFixed(2) : 'N/A',
      weights: weightDataKg.map((entry, index) => ({
        ...entry.toObject(),
        weightKg: entry.weightKg.toFixed(2),
        change: index === 0 && startingWeight ? calculateChange(startingWeight, entry.weightKg) : index === 0 ? 0 : calculateChange(weightDataKg[index - 1].weightKg, entry.weightKg)
      }))
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to add or update a weight entry
router.post('/weight-data', authMiddleware, async (req, res) => {
  const { date, weightKg } = req.body;
  const userId = req.session.userId;
  const weightInKg = parseFloat(weightKg).toFixed(2);

  try {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const updatedWeightEntry = await Weight.findOneAndUpdate(
      { userId, date: normalizedDate },
      { $set: { weightKg: weightInKg } },
      { new: true, upsert: true }
    );

    const user = await User.findById(userId);

    // Set startWeight only if it doesn't exist
    if (!user.startWeight) {
      console.log('Setting start weight:', weightInKg);
      await User.findByIdAndUpdate(userId, { startWeight: weightInKg });
    } else {
      console.log('Start weight already set:', user.startWeight);
    }

    // Update current weight
    await User.findByIdAndUpdate(userId, { weight: weightInKg });

    res.status(201).send(updatedWeightEntry);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Helper function to calculate change percentage
function calculateChange(prevWeight, currentWeight) {
  const change = ((currentWeight - prevWeight) / prevWeight) * 100;
  return change.toFixed(2);
}

module.exports = {
  router, // Exporting the router
  Weight // Exporting the Weight model
};
