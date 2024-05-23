const mongoose = require('mongoose');

const pastRoutineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercises: [{
        name: String,
        repetitions: Number,
        sets: Number,
        date: {
            type: Date,
            default: Date.now
        },
        completed: { type: Boolean, default: false }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PastRoutine', pastRoutineSchema);