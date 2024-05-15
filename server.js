require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ejs = require('ejs'); // need to import because it's 'require' (npm i ejs)
// Routes
const forgotPasswordRoute = require('./routes/forgotPasswordRoute');
const launchRoute = require('./routes/launchRoute');
const loginRoute = require('./routes/loginRoute');
const resetPasswordRoute = require('./routes/resetPasswordRoute');
const signupRoute = require('./routes/signupRoute');
const app = express();
const PORT = process.env.PORT || 3000;
const blogRoute = require('./routes/blogRoute');

//############################################Do not touch######################################################
app.use('/css', express.static(path.join(__dirname, 'css'))); // Need this to access the css files. Do not remove.
app.use('/images', express.static(path.join(__dirname, 'images'))); // Need this to access the css files. Do not remove.
app.use('/script', express.static(path.join(__dirname, 'script'))); // Need this to access the css files. Do not remove.
app.set('view engine', 'ejs');
//####################################################################################################


// Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.set('views', path.join(__dirname, 'wellbot/html/templates'));

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


app.use('/forgot-password', forgotPasswordRoute);
app.use('/', launchRoute);
app.use('/login', loginRoute);
app.use('/reset-password', resetPasswordRoute);
app.use('/signup', signupRoute);


//Richard's script for collapsing meals and exercises button on homepage
app.get('/home', (req, res) => {
    res.render('home', {page: 'dashboard'});
});

app.use(blogRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

