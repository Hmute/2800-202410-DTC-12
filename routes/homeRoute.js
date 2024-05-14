const express = require('express');
const app = express();
const ejs = require('ejs'); // need to import because it's 'require' (npm i ejs)
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});