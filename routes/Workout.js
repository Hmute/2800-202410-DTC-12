const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  repetitions: { type: Number, required: true },
  sets: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  time: { type: Number, default: 0 }, // in seconds
  completion: { type: String, enum: ['Yes', 'No'], default: 'No' },
});

module.exports = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);