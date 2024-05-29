const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const isAuthenticated = require('../middlewares/blogMiddlewares');

// Define the schema
const RoutineSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    exercises: [
        {
            name: { type: String, required: true },
            repetitions: { type: Number, default: 0 },
            sets: { type: Number, default: 0 },
            weight: { type: Number, default: 0 },
            time: { type: Number, default: 0 },
            completion: { type: String, enum: ['Yes', 'No'], default: 'No' },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

let Routine;
try {
    Routine = mongoose.model('Routine');
} catch (error) {
    Routine = mongoose.model('Routine', RoutineSchema);
}

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const Routines = myDatabase.model('Routine', RoutineSchema);

        // Fetch all routines for the user
        const routines = await Routines.find({ user: req.session.user._id });

        // Flatten the exercises into a single array
        const exercises = routines.flatMap(routine => routine.exercises.map(exercise => ({
            ...exercise.toObject(),
            routineId: routine._id
        })));

        res.render('logExercise', { user: req.session.user, page: 'Log Exercise', exercises });
    } catch (err) {
        console.error('Error fetching routines:', err);
        res.status(500).send('An error occurred');
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const Routines = myDatabase.model('Routine', RoutineSchema);

        const { name, repetitions, sets, weight, time, completion } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const newExercise = { name, repetitions, sets, weight, time, completion };

        // Find the most recent routine for the user
        const routine = await Routines.findOne({ user: req.session.user._id }).sort({ createdAt: -1 });

        if (routine) {
            routine.exercises.push(newExercise);
            await routine.save();
            res.status(201).json(routine.exercises[routine.exercises.length - 1]);
        } else {
            const newRoutine = new Routines({
                user: req.session.user._id,
                exercises: [newExercise],
            });
            await newRoutine.save();
            res.status(201).json(newRoutine.exercises[0]);
        }
    } catch (err) {
        console.error('Error saving exercise:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const Routines = myDatabase.model('Routine', RoutineSchema);

        const { id } = req.params;
        const { name, repetitions, sets, weight, time, completion } = req.body;

        // Find the routine containing the exercise
        const routine = await Routines.findOne({ user: req.session.user._id, 'exercises._id': id });

        if (!routine) {
            return res.status(404).json({ error: 'Routine not found' });
        }

        const exercise = routine.exercises.id(id);

        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        exercise.name = name || exercise.name;
        exercise.repetitions = repetitions !== undefined ? repetitions : exercise.repetitions;
        exercise.sets = sets !== undefined ? sets : exercise.sets;
        exercise.weight = weight !== undefined ? weight : exercise.weight;
        exercise.time = time !== undefined ? time : exercise.time;
        exercise.completion = completion || exercise.completion;

        await routine.save();

        res.status(200).json(exercise);
    } catch (err) {
        console.error('Error updating exercise:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const { id } = req.params;

        // Find the routine containing the exercise
        const routine = await Routine.findOne({ user: req.session.user._id, 'exercises._id': id });
        if (!routine) {
            return res.status(404).json({ error: 'Routine not found' });
        }

        // Use $pull to remove the exercise
        await Routine.updateOne(
            { _id: routine._id },
            { $pull: { exercises: { _id: id } } }
        );

        console.log('Exercise deleted successfully');
        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting exercise:', err);
        res.status(500).json({ error: 'Failed to delete exercise' });
    }
});

module.exports = router;
