const mongoose = require("mongoose");

// Schema for individual workouts
const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the workout
  repetitions: { type: Number, required: true }, // Number of repetitions
  sets: { type: Number, default: 0 }, // Number of sets, default is 0
  weight: { type: Number, default: 0 }, // Weight used, default is 0
  time: { type: Number, default: 0 }, // Time in seconds, default is 0
  completion: { type: String, enum: ["Yes", "No"], default: "No" }, // Completion status, 'Yes' or 'No', default is 'No'
});

// Schema for routines
const routineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the user, required
  },
  name: String, // Optional name for the routine
  exercises: [workoutSchema], // List of exercises
  createdAt: {
    type: Date,
    default: Date.now, // Creation date, default is now
  },
  status: {
    type: String,
    enum: ["accepted", "declined"], // Status of the routine, 'accepted' or 'declined'
    default: "accepted", // Default status is 'accepted'
  },
});

module.exports =
  mongoose.models.Routine || mongoose.model("Routine", routineSchema); // Export the Routine model, using existing model if it exists
