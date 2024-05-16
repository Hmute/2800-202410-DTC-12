const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('login', { error: null });
});

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        req.session.user = user;
        res.redirect('/home');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send("Error logging in.");
    }
});

module.exports = router;
