const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    repetitions: { type: Number, required: true },
    sets: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    time: { type: Number, default: 0 }, // in seconds
    completed: { type: Boolean, default: false }
});

const pastRoutineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercises: [workoutSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PastRoutine', pastRoutineSchema);