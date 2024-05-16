const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { error: null });
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        req.session.user = user; // Set the session
        res.redirect('/home'); // Redirect on successful login
    } catch (err) {
        console.error('Error logging in:', err);
        res.render('login', { error: 'An error occurred during login' });
    }
});

module.exports = router;
