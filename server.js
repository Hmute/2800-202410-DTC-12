require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');

const app = express();

// Define rate limit for API requests (adjust settings as needed)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});

app.use('/bot/generate', apiLimiter);

// Global Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/script', express.static(path.join(__dirname, 'script')));
app.set('view engine', 'ejs');

// Routes
const forgotPasswordResetRoute = require('./routes/forgotPasswordResetRoute');
const launchRoute = require('./routes/launchRoute');
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const blogRoute = require('./routes/blogRoute');
const botRoute = require('./routes/botRoute');
const userProfileRoute = require('./routes/userProfileRoute');

// Database Connection
const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoHost = process.env.MONGODB_HOST;
const mongoOptions = process.env.MONGODB_OPTIONS;
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoHost}/?${mongoOptions}`;

mongoose.connect(mongoUri, {
}).then(() => {
  console.log('Connected to MongoDB');

  // Session configuration (after successful MongoDB connection)
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    cookie: { maxAge: 60 * 60 * 1000 },
  }));

  // Use routes (after session middleware)
  app.use('/forgotPasswordReset', forgotPasswordResetRoute);
  app.use('/', launchRoute);
  app.use('/login', loginRoute);
  app.use('/signup', signupRoute);
  app.use('/blog', blogRoute);
  app.use('/bot', botRoute);
  app.use('/user', userProfileRoute);

  app.get('/home', (req, res) => {
    const user = req.session.user;
    res.render('home', { user, page: 'Home' });
  });

  // Error Handling Middleware (catch-all)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });

  // Start Server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
