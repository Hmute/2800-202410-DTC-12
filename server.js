require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Nodemailer Transporter (Fill in your email configuration)
const transporter = nodemailer.createTransport({
  // Your email service configuration (e.g., Gmail, SendGrid, etc.)
});

// Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'wellbot/html/templates'));

// Session Configuration
let sessionSecret;
if (process.env.SESSION_SECRET) {
  sessionSecret = process.env.SESSION_SECRET;
  console.log("Using session secret from .env:", sessionSecret);
} else {
  sessionSecret = crypto.randomBytes(64).toString('hex');
  console.log("Generated new session secret (add this to your .env file):", sessionSecret);
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

// Routes
const forgotPasswordRoute = require('./wellbot/routes/forgotPasswordRoute');
const launchRoute = require('./wellbot/routes/launchRoute');
const loginRoute = require('./wellbot/routes/loginRoute');
const resetPasswordRoute = require('./wellbot/routes/resetPasswordRoute');
const signupRoute = require('./wellbot/routes/signupRoute');

app.use('/forgot-password', forgotPasswordRoute);
app.use('/', launchRoute);
app.use('/login', loginRoute);
app.use('/reset-password', resetPasswordRoute);
app.use('/signup', signupRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
