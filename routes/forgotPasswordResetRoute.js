const express = require('express');
const router = express.Router();
const User = require('./User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Rate Limiting (adjust as needed)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 40, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
router.use(limiter);

// GET: Display forgot password form
router.get('/', (req, res) => {
    res.render('forgotPasswordReset', { user: req.session.user, page: 'Forgot Password', error: null, message: null, showResetForm: false });
});

// POST: Handle email submission for password reset
router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log(`No account with email: ${req.body.email}`);
            return res.render('forgotPasswordReset', { error: 'No account with that email address exists.', user: req.session.user, page: 'Forgot Password', message: null, showResetForm: false });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

        await user.save(); // Save user with reset token

        console.log(`Generated token: ${token} for user: ${user.email}`);

        const resetLink = `http://${req.headers.host}/forgotPasswordReset/${token}`;
        console.log(`Reset link: ${resetLink}`);

        const msg = {
            to: user.email,
            from: 'wellbotbcit@outlook.com', // Replace with your verified email address
            subject: 'WellBot Password Reset',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        };

        await sgMail.send(msg);
        res.render('forgotPasswordReset', { message: 'A password reset email has been sent to your email address.', user: req.session.user, page: 'Forgot Password', error: null, showResetForm: false });
    } catch (err) {
        console.error('Error sending password reset email:', err);
        res.render('forgotPasswordReset', { error: 'An error occurred while sending the reset email. Please try again later.', user: req.session.user, page: 'Forgot Password', message: null, showResetForm: false });
    }
});

// GET: Display reset password form (if token is valid)
router.get('/:token', async (req, res) => {
    try {
        console.log(`Received token: ${req.params.token}`);
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            console.log('Token is invalid or expired');
            return res.render('forgotPasswordReset', { error: 'Invalid or expired token.', user: req.session.user, page: 'Forgot Password', message: null, showResetForm: false });
        }

        res.render('forgotPasswordReset', { token: req.params.token, showResetForm: true, user: req.session.user, page: 'Reset Password', error: null, message: null });
    } catch (err) {
        console.error('Error finding user for password reset:', err);
        res.status(500).send('An error occurred.');
    }
});

// POST: Handle new password submission
router.post('/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('Token is invalid or expired');
            return res.render('forgotPasswordReset', { error: 'Invalid or expired token.', user: req.session.user, page: 'Forgot Password', message: null, showResetForm: false });
        }

        const { password, confirmPassword } = req.body;

        if (password.length < 8) {
            return res.render('forgotPasswordReset', { token: req.params.token, showResetForm: true, user: req.session.user, page: 'Reset Password', error: 'Password must be at least 8 characters long.', message: null });
        }

        if (password !== confirmPassword) {
            return res.render('forgotPasswordReset', { token: req.params.token, showResetForm: true, user: req.session.user, page: 'Reset Password', error: 'Passwords do not match.', message: null });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined; // Clear token and expiration after reset
        user.resetPasswordExpires = undefined;

        await user.save(); // Save user with updated password

        res.redirect('/login');
    } catch (err) {
        console.error('Error resetting password:', err);
        res.render('forgotPasswordReset', { token: req.params.token, showResetForm: true, user: req.session.user, page: 'Reset Password', error: 'An error occurred while resetting the password. Please try again.', message: null });
    }
});

module.exports = router;
