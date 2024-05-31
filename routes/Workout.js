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

// Export the Workout model, using existing model if it exists
module.exports = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);
