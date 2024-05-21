const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

// Route to display the signup form
router.get('/', (req, res) => {
    res.render('signup', { error: null });
});

// Route to handle signup form submissions
router.post('/', async (req, res) => {
    console.log('Request body:', req.body); // Add this line to debug

    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        console.log('Passwords do not match');
        return res.render('signup', { error: 'Passwords do not match' });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            console.log('Username already exists');
            return res.render('signup', { error: 'Username already exists' });
        }

        // Create a new user with the provided information
        const user = new User({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save();

        console.log('User successfully created:', user);

        // Redirect to the user's profile page after successful signup
        res.redirect(`/user/profile`);
    } catch (err) {
        if (err.code === 11000) {
            console.log('Email already exists');
            res.render('signup', { error: 'Email already exists' });
        } else {
            console.error('Signup error:', err);
            res.render('signup', { error: 'An error occurred during signup' });
        }
    }
});

module.exports = router;
