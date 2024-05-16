// This route is only for blog page. Do not touch if you're not Marc. Create your own instead.

const express = require('express');
const router = express.Router();

router.get('/blog', (req, res) => {
    res.render('blogPage', {page: 'Blog Posts'});
});

router.get('/blog/create', (req, res) => {
    res.render('blogCreate');
});
module.exports = router;