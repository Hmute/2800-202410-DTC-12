const express = require('express');
const app = express();
const ejs = require('ejs'); // need to import because it's 'require' (npm i ejs)
app.set('view engine', 'ejs');

app.get('/homepage', (req, res) => {
    res.render('homepage');
});