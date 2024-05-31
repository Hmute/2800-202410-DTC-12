const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/blogMiddlewares'); // Adjust the path as needed

// GET route to render logExercise.ejs
router.get('/', isAuthenticated, (req, res) => {
  res.render('addFood', { user: req.session.user, page: 'Add Food' });
});

module.exports = router;
