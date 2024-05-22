const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const isAuthenticated = require('../middlewares/blogMiddlewares'); 

// Assuming your Mongoose model is defined like this (adjust the schema as needed):
const Workout = mongoose.model('Workout', {
    exercise: String,
    sets: Number,
    reps: Number,
    weight: Number,
    complete: String // You can use Boolean too
});

// GET route to render logExercise.ejs (unchanged)
router.get('/', isAuthenticated, (req, res) => {
    res.render('logExercise', { user: req.session.user, page: 'Log Exercise' });
});

// POST route to handle form submission and save data to MongoDB
router.post('/', isAuthenticated, async (req, res) => {
    try {
        // 1. Get database and Model
        const myDatabase = mongoose.connection.useDb('test');
        const ExerciseLogs = myDatabase.model('ExerciseLogs', Workout.schema);

        // 2. Get the form data (adjusting keys as needed to match your form fields)
        const { exercise, sets, reps, weight, complete } = req.body;

        // 3. Optional: Validate the data
        // (e.g., check if all fields are present and have valid types)
        if (!exercise || !sets || !reps || !weight || !complete) {
            return res.status(400).send('All fields are required');
        }

        // 4. Create a new workout document
        const newExerciseLog = new ExerciseLogs({
            exercise,
            sets,
            reps,
            weight,
            complete
        });

        // 5. Save the workout to the database
        await newExerciseLog.save();

        // 6. Send a response
        res.redirect('/logExercise'); 
    } catch (err) {
        console.error('Error saving exercise log:', err);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;

