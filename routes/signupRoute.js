const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

// Route to display the signup form
router.get('/', (req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/home');
      }
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
            return res.render('signup', { error: 'Username already in use' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            console.log('Email already exists');
            return res.render('signup', { error: 'Email already exists' });
        }

        // Create a new user with the provided information
        const user = new User({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        await user.save();

        req.session.username = req.body.username;
        req.session.email = req.body.email;
        req.session.fullName = req.body.fullName;
        req.session.userId = user._id;
        
        console.log(req.session.userId);

        // Redirect to the user's profile page after successful signup
        res.redirect(`/user/profile`);
    } catch (err) {
        console.error('Signup error:', err);
        res.render('signup', { error: 'An error occurred during signup' });
    }
});

module.exports = router;
