const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the weight schema and model
const weightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weightKg: { type: Number, required: true },
  weightLbs: { type: Number, required: true }
});

weightSchema.index({ userId: 1, date: 1 }, { unique: true }); // Compound index

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
    const weightDataKg = await Weight.find({ userId }).sort({ date: 1 }).exec();
    const weightDataLbs = weightDataKg.map(entry => ({
      ...entry.toObject(),
      weightKg: undefined,
      weightLbs: (entry.weightKg * 2.20462).toFixed(2),
      change: calculateChange(entry, weightDataKg)
    }));
    res.json({
      kg: weightDataKg.map(entry => ({
        ...entry.toObject(),
        weightLbs: undefined,
        change: calculateChange(entry, weightDataKg)
      })),
      lbs: weightDataLbs
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to add a new weight entry
router.post('/weight-data', authMiddleware, async (req, res) => {
  const { date, weightKg, weightLbs } = req.body;
  const userId = req.session.userId;
  try {
    const newWeightEntry = new Weight({ userId, date, weightKg, weightLbs });
    await newWeightEntry.save();
    res.status(201).send(newWeightEntry);
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
