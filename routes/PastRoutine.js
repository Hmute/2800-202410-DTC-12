const mongoose = require("mongoose");

// Schema for individual workouts
const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the workout
  repetitions: { type: Number, required: true }, // Number of repetitions
  sets: { type: Number, default: 0 }, // Number of sets, default is 0
  weight: { type: Number, default: 0 }, // Weight used, default is 0
  time: { type: Number, default: 0 }, // Time in seconds, default is 0
  completed: { type: Boolean, default: false }, // Completion status, default is false
});

// Schema for past routines
const pastRoutineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the user, required
  },
  exercises: [workoutSchema], // List of exercises
  createdAt: {
    type: Date,
    default: Date.now, // Creation date, default is now
  },
});

module.exports = mongoose.model("PastRoutine", pastRoutineSchema); // Export the PastRoutine model
