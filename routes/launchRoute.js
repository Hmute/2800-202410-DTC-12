const express = require('express');
const router = express.Router();

// Route to display the launch form
router.get('/', (req, res) => {
  res.render('launch'); // Render the form on GET request to /launch
});

// Route to handle form submissions
router.post('/', (req, res) => {
  const { action } = req.body; // Extract the action from the request body

  // Check the value of the action and redirect accordingly
  if (action === 'login') {
    res.redirect('/login'); // Redirect to the login page if action is 'login'
  } else if (action === 'getStarted') {
    res.redirect('/signup'); // Redirect to the signup page if action is 'getStarted'
  } else {
    res.redirect('/launch'); // Redirect back to the launch page if action is invalid
  }
});

module.exports = router; // Export the router for use in other parts of the application
