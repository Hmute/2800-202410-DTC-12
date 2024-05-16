const express = require('express');
const router = express.Router();
const User = require('./User'); // Adjust path as necessary
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET route for the forgot password page
router.get('/', (req, res) => {
    res.render('forgotPasswordReset', { error: null, message: null, showResetForm: false });
});

// POST route to handle email submission and send reset link
router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.render('forgotPasswordReset', { error: 'Email not found', message: null, showResetForm: false });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:${process.env.PORT || 3000}/forgotPasswordReset/${token}`;
        const msg = {
            to: user.email,
            from: 'wellbotbcit@outlook.com', // Use your verified sender
            subject: 'WellBot Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await sgMail.send(msg);
        res.render('forgotPasswordReset', { message: 'Password reset email sent', error: null, showResetForm: false });
    } catch (err) {
        console.error("Error sending password reset email:", err);
        res.status(500).send("Error sending password reset email.");
    }
});

// GET route for the reset password page
router.get('/:token', async (req, res) => {
    try {
        const user = await User.findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.render('forgotPasswordReset', { error: 'Invalid or expired token', message: null, showResetForm: false });
        }

        res.render('forgotPasswordReset', { token: req.params.token, showResetForm: true, error: null, message: null });
    } catch (err) {
        console.error("Error finding user for password reset:", err);
        res.status(500).send("Error finding user for password reset."); 
    }
});

// POST route to handle new password submission
router.post('/:token', async (req, res) => {
    try {
        const user = await User.findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });
        if (!user) {
            return res.render('forgotPasswordReset', { error: 'Invalid or expired token', message: null, showResetForm: false });
        }

        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('forgotPasswordReset', { token: req.params.token, showResetForm: true, error: 'Passwords do not match', message: null });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.redirect('/login'); 
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).send("Error resetting password.");
    }
});

module.exports = router;
