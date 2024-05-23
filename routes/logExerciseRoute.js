const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const isAuthenticated = require('../middlewares/blogMiddlewares');

const Workout = mongoose.model('Workout', {
    exercise: String,
    sets: Number,
    reps: Number,
    weight: Number,
    complete: String,
});

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const ExerciseLogs = myDatabase.model('ExerciseLogs', Workout.schema);

        const exerciseLogs = await ExerciseLogs.find({});

        res.render('logExercise', { user: req.session.user, page: 'Log Exercise', exerciseLogs });
    } catch (err) {
        console.error('Error fetching exercise logs:', err);
        res.status(500).send('An error occurred');
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const ExerciseLogs = myDatabase.model('ExerciseLogs', Workout.schema);

        const { exercise, sets, reps, weight, complete } = req.body;

        if (!exercise || !sets || !reps || !weight || !complete) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newExerciseLog = new ExerciseLogs({ exercise, sets, reps, weight, complete });
        await newExerciseLog.save();

        res.status(201).json(newExerciseLog);
    } catch (err) {
        console.error('Error saving exercise log:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const ExerciseLogs = myDatabase.model('ExerciseLogs', Workout.schema);

        const { id } = req.params;
        const { exercise, sets, reps, weight, complete } = req.body;

        const updatedExerciseLog = await ExerciseLogs.findByIdAndUpdate(
            id,
            { exercise, sets, reps, weight, complete },
            { new: true }
        );

        if (!updatedExerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }

        res.status(200).json(updatedExerciseLog);
    } catch (err) {
        console.error('Error updating exercise log:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const myDatabase = mongoose.connection.useDb('test');
        const ExerciseLogs = myDatabase.model('ExerciseLogs', Workout.schema);

        const { id } = req.params;

        const deletedExerciseLog = await ExerciseLogs.findByIdAndDelete(id);

        if (!deletedExerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }

        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting exercise log:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
