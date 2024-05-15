const express = require('express');
const router = express.Router();
const User = require('./User'); // Adjust path as necessary
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get('/', (req, res) => {
    console.log("Forgot password GET route hit");
    res.render('forgotPassword', { error: null, message: null });
});

router.post('/', async (req, res) => {
    console.log("Forgot password POST route hit");
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.render('forgotPassword', { error: 'Email not found', message: null });
        }
        
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:${process.env.PORT || 3000}/resetPassword/${token}`;
        const mailOptions = {
            to: user.email,
            subject: 'WellBot Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetLink}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        await transporter.sendMail(mailOptions);

        res.render('forgotPassword', { message: 'Password reset email sent', error: null });
    } catch (err) {
        res.status(500).send("Error sending password reset email.");
    }
});

module.exports = router;
