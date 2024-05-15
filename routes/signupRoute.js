const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('signup', { error: null });
});

router.post('/', async (req, res) => {
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();

        // Redirect to a valid route after successful signup
        res.redirect('/home'); 
    } catch (err) {
        if (err.code === 11000) { 
            res.render('signup', { error: 'Email already exists' });
        } else {
            console.error("Signup error:", err);  // Log the error for debugging
            res.render('signup', { error: 'An error occurred during signup' }); // Generic error message for the user
        }
    }
});

module.exports = router;
