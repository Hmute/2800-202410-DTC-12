const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcrypt');

router.get('/:token', async (req, res) => {
    try {
        const user = await User.findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.render('forgotPassword', { error: 'Invalid or expired token' });
        }
        res.render('resetPassword', { token: req.params.token });
    } catch (err) {
        res.status(500).send("Error finding user for password reset."); 
    }
});

router.post('/:token', async (req, res) => {
    try {
        const user = await User.findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });
        if (!user) {
            return res.render('forgotPassword', { error: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.redirect('/login'); 
    } catch (err) {
        res.status(500).send("Error resetting password.");
    }
});

module.exports = router;
