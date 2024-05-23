require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define rate limit for API requests (adjust settings as needed)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});

app.use('/bot/generate', apiLimiter);

// Middleware to make user available in all templates
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/script', express.static(path.join(__dirname, 'script')));
app.use('/setup', express.static(path.join(__dirname, 'setup')));
app.use('/middlewares', express.static(path.join(__dirname, 'middlewares')));

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
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: { maxAge: 60 * 60 * 1000 },
  }));

  // Middleware to make user available in all templates (must be after session middleware)
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

  // Routes
  const forgotPasswordResetRoute = require('./routes/forgotPasswordResetRoute');
  const launchRoute = require('./routes/launchRoute');
  const loginRoute = require('./routes/loginRoute');
  const signupRoute = require('./routes/signupRoute');
  const blogRoute = require('./routes/blogRoute');
  const botRoute = require('./routes/botRoute');
  const userProfileRoute = require('./routes/userProfileRoute');
  const weightRoute = require('./routes/weightRoute');
  const logExerciseRoute = require('./routes/logExerciseRoute');
  const homeRoute = require('./routes/homeRoute');
  const addFoodRoute = require('./routes/addFoodRoute');
  const healthRoutes = require('./routes/healthRoutes');
  

  app.use('/forgotPasswordReset', forgotPasswordResetRoute);
  app.use('/', launchRoute);
  app.use('/login', loginRoute);
  app.use('/signup', signupRoute);
  app.use('/blog', blogRoute);
  app.use('/bot', botRoute);
  app.use('/user', userProfileRoute);
  app.use('/weight', weightRoute);
  app.use('/logExercise', logExerciseRoute);
  app.use('/home', homeRoute);
  app.use('/addFood', addFoodRoute);
  app.use('/health', healthRoutes);
  

  // Sign-out route
  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/login'); // Redirect to the login page after logging out
    });
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
