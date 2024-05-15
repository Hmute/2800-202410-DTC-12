const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { error: null });
});

router.post('/', async (req, res) => {
    try {
        console.log('Login POST request received');
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log('User not found');
            return res.render('login', { error: 'Invalid credentials' });
        }

        console.log('User found:', user);

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            console.log('Password does not match');
            return res.render('login', { error: 'Invalid credentials' });
        }

        req.session.user = user;
        console.log('Login successful');
        res.redirect('/home'); // Redirect to home page after successful login
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send("Error logging in.");
    }
});

module.exports = router;
