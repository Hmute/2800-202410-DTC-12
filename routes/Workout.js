const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: String,
  repetitions: Number,
});

const routineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String, // You can also add a name for the routine
  exercises: [workoutSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Routine', routineSchema);