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
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
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
    const startingWeight = user.startWeight ? parseFloat(user.startWeight) : null;

    const weightDataKg = await Weight.find({ userId }).sort({ date: 1 }).exec();

    const currentWeight = weightDataKg.length > 0 ? weightDataKg[weightDataKg.length - 1].weightKg : startingWeight;
    const progress = startingWeight && currentWeight ? currentWeight - startingWeight : 0;

    res.json({
      startingWeight: startingWeight ? startingWeight.toFixed(2) : 'N/A',
      currentWeight: currentWeight ? currentWeight.toFixed(2) : 'N/A',
      progress: progress ? progress.toFixed(2) : 'N/A',
      weights: weightDataKg.map((entry, index, array) => ({
        ...entry.toObject(),
        weightKg: entry.weightKg.toFixed(2),
        change: index === 0 ? 0 : calculateChange(array[index - 1].weightKg, entry.weightKg)
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

    const user = await User.findById(userId);
    let startWeight = user.startWeight;

    if (!startWeight) {
      startWeight = weightInKg;
      await User.findByIdAndUpdate(userId, { weight: weightInKg, startWeight: weightInKg });
    } else if (!user.weight) {
      await User.findByIdAndUpdate(userId, { weight: weightInKg });
    } else {
      await User.findByIdAndUpdate(userId, { weight: weightInKg });
    }

    const updatedWeightEntry = await Weight.findOneAndUpdate(
      { userId, date: normalizedDate },
      { $set: { weightKg: weightInKg } },
      { new: true, upsert: true }
    );

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

module.exports = router;
