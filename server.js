require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');

// Routes
const forgotPasswordRoute = require('./routes/forgotPasswordRoute');
const launchRoute = require('./routes/launchRoute');
const loginRoute = require('./routes/loginRoute');
const resetPasswordRoute = require('./routes/resetPasswordRoute');
const signupRoute = require('./routes/signupRoute');
const blogRoute = require('./routes/blogRoute');

const app = express();
const PORT = process.env.PORT || 3000;

//############################################Do not touch######################################################
app.use('/css', express.static(path.join(__dirname, 'css'))); // Need this to access the css files. Do not remove.
app.use('/images', express.static(path.join(__dirname, 'images'))); // Need this to access the css files. Do not remove.
app.set('view engine', 'ejs');
//####################################################################################################

// Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Session Secret
const sessionSecret = process.env.SESSION_SECRET;

// Express Session Configuration
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Routes
app.use('/forgot-password', forgotPasswordRoute);
app.use('/', launchRoute);
app.use('/login', loginRoute);
app.use('/reset-password', resetPasswordRoute);
app.use('/signup', signupRoute);
app.use(blogRoute);

//Richard's script for collapsing meals and exercises button on homepage
app.get('/home', (req, res) => {
  res.render('home', { page: 'dashboard' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
