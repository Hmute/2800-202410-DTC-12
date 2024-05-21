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
    const weightDataKg = await Weight.find({ userId }).sort({ date: -1 }).exec();
    res.json(weightDataKg.map(entry => ({
      ...entry.toObject(),
      weightKg: entry.weightKg.toFixed(2),
      change: calculateChange(entry, weightDataKg)
    })));
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
    // Normalize the date to the start of the day in local time
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Find the existing entry for the user and date, or create a new one
    const updatedWeightEntry = await Weight.findOneAndUpdate(
      { userId, date: normalizedDate },
      { $set: { weightKg: weightInKg } },
      { new: true, upsert: true }
    );

    // Update the user's weight in the users collection
    await User.findByIdAndUpdate(userId, { weight: weightInKg.toString() });

    res.status(201).send(updatedWeightEntry);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Helper function to calculate change percentage
function calculateChange(entry, data) {
  const prevEntry = data.find(e => e.date < entry.date);
  if (!prevEntry) return 0;
  const change = ((entry.weightKg - prevEntry.weightKg) / prevEntry.weightKg) * 100;
  return change.toFixed(2);
}

module.exports = router;
