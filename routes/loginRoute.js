// routes/loginRoute.js

const express = require('express');
const router = express.Router();
const User = require('./User'); // Corrected path to User model
const bcrypt = require('bcrypt');

// Route to display the login form
router.get('/', (req, res) => {
    res.render('login', { error: null }); // Render the login form with no error message
});

// Route to handle login form submissions
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body; // Extract email and password from the request body

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' }); // If user is not found, display an error
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' }); // If passwords do not match, display an error
        }

        req.session.user = user; // Set the user in the session
        res.redirect('/home'); // Redirect to the home page on successful login
    } catch (err) {
        console.error('Error logging in:', err); // Log any errors that occur
        res.render('login', { error: 'An error occurred during login' }); // Display a general error message
    }
});

module.exports = router; // Export the router for use in other parts of the application
