const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const user = req.session.user;
  res.render('home', { user, page: 'Home' });
});

module.exports = router;
