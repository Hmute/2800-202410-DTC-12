/* This is our main server. We import our routes here from the routes folder. 
This will result in less conflict. Just google or chatGPT how to export routes*/


//Richard's script for collapsing meals and exercises button on homepage
const express = require('express');
const app = express();
const ejs = require('ejs'); // need to import because it's 'require' (npm i ejs)
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});