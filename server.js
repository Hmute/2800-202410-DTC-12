/* This is our main server. We import our routes here from the routes folder. 
This will result in less conflict. Just google or chatGPT how to export routes*/


const express = require('express');
const app = express();
const path = require('path'); // Import the path module for path.join
const ejs = require('ejs'); // need to import because it's 'require' (npm i ejs)

const blogRoute = require('./routes/blogRoute');

//############################################Do not touch######################################################
app.use('/css', express.static(path.join(__dirname, 'css'))); // Need this to access the css files. Do not remove.
app.use('/images', express.static(path.join(__dirname, 'images'))); // Need this to access the css files. Do not remove.
app.use('/script', express.static(path.join(__dirname, 'script'))); // Need this to access the css files. Do not remove.
app.set('view engine', 'ejs');
//####################################################################################################

//Richard's script for collapsing meals and exercises button on homepage
app.get('/home', (req, res) => {
    res.render('home', {page: 'dashboard'});
});

app.use(blogRoute);


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});