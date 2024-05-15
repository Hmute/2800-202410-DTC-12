const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { error: null });
});

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.render('login', { error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).send("Error logging in.");
    }
});

module.exports = router;
