const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { saved } = req.query;
  const user = req.session.user;
  res.render('home', { user, page: 'Home', saved });
});

module.exports = router;
