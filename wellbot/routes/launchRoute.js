const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('launch'); // Render the form on GET request to /launch
});

router.post('/', (req, res) => {
  const { action } = req.body;
  if (action === 'login') {
    res.redirect('/login');
  } else if (action === 'getStarted') {
    res.redirect('/signup');
  } else {
    res.redirect('/launch'); // Redirect back to launch if action is invalid
  }
});

module.exports = router;
