const express = require('express');
const router = express.Router();
const User = require('./User');
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'photos', maxCount: 10 }]);

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Get profile page
router.get('/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(404).send('User not found');
        }
        console.log('Displaying profile for user:', user);
        res.render('userProfile', { user, page: 'Profile' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

// Edit profile page
router.post('/:username/edit', upload, async (req, res) => {
    const username = req.params.username;
    const { fullName, gender, age, height, weight } = req.body;
    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].filename : null;
    const photos = req.files['photos'] ? req.files['photos'].map(file => file.filename) : [];

    console.log('Uploaded Profile Picture:', profilePicture);
    console.log('Uploaded Photos:', photos);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(404).send('User not found');
        }

        user.fullName = fullName || user.fullName;
        user.gender = gender || user.gender;
        user.age = age || user.age;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        if (profilePicture) user.profilePicture = profilePicture;
        if (photos.length) user.photos.push(...photos);

        await user.save();
        res.redirect(`/user/${username}`);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
