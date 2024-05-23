// const mongoose = require('mongoose');

// const workoutSchema = new mongoose.Schema({
//     name: String,
//     repetitions: Number,
// });

// const routineSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     name: String, // Optional: You can add a name for the routine
//     exercises: [workoutSchema],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Routine', routineSchema);

const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    repetitions: { type: Number, required: true },
    sets: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    time: { type: Number, default: 0 }, // in seconds
    completion: { type: String, enum: ['Yes', 'No'], default: 'No' },
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

module.exports = mongoose.models.Routine || mongoose.model('Routine', routineSchema);
