const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('signup', { error: null });
});

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        if (err.code === 11000) { // Check for duplicate email error
            res.render('signup', { error: 'Email already exists' });
        } else {
            res.status(500).send("Error registering new user.");
        }
    }
});

module.exports = router;
