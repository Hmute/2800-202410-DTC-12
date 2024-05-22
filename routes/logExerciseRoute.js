const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/blogMiddlewares'); // Adjust the path as needed

// GET route to render logExercise.ejs
router.get('/', isAuthenticated, (req, res) => {
  res.render('logExercise', { user: req.session.user, page: 'Log Exercise' });
});

module.exports = router;
