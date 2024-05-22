const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  repetitions: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User model
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;