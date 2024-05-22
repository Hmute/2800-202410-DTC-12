const { date } = require('joi');
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: String,
    repetitions: Number,
    sets: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

const routineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String, // Optional: You can add a name for the routine
    exercises: [workoutSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Routine', routineSchema);