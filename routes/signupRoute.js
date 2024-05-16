const express = require('express');
const router = express.Router();
const User = require('./User'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Route to display the signup form
router.get('/', (req, res) => {
    res.render('signup', { error: null }); // Render the signup form with no error message
});

// Route to handle signup form submissions
router.post('/', async (req, res) => {
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match' }); // If passwords do not match, display an error
    }

    try {
        // Create a new user with the provided information
        const user = new User({
            fullName: req.body.fullName, // Set the full name
            email: req.body.email, // Set the email
            password: req.body.password, // Password will be hashed in the pre-save hook of the User model
        });
        await user.save(); // Save the user to the database

        // Redirect to a valid route after successful signup
        res.redirect('/home'); 
    } catch (err) {
        if (err.code === 11000) { // Check if the error code indicates a duplicate key error
            res.render('signup', { error: 'Email already exists' }); // If email already exists, display an error
        } else {
            console.error("Signup error:", err); // Log the error for debugging
            res.render('signup', { error: 'An error occurred during signup' }); // Generic error message for the user
        }
    }
});

module.exports = router; // Export the router for use in other parts of the application
