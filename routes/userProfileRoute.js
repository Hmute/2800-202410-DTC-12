const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./User'); // Adjust the path as needed

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'profilePicture') {
            cb(null, './public/images/profile');
        } else {
            cb(null, './public/images');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
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
router.post('/:username/editProfile', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Handle Multer errors
            if (err instanceof multer.MulterError) {
                return res.status(400).send('File upload error: ' + err.message);
            }
            return res.status(500).send('Server error: ' + err.message);
        }

        const username = req.params.username;
        const {
            fullName, gender, age, height, weight, bodyFat, instagram, facebook, twitter, bio
        } = req.body;
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
            user.bodyFat = bodyFat || user.bodyFat;
            user.instagram = instagram || user.instagram;
            user.facebook = facebook || user.facebook;
            user.twitter = twitter || user.twitter;
            user.bio = bio || user.bio;

            if (profilePicture) {
                // Delete the old profile picture if it exists
                if (user.profilePicture) {
                    fs.unlinkSync(path.join(__dirname, '../public/images/profile', user.profilePicture));
                }
                user.profilePicture = profilePicture;
            }
            if (photos.length) user.photos.push(...photos);

            await user.save();
            res.redirect(`/user/${username}`);
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).send('Server error');
        }
    });
});

// Delete photo
router.post('/:username/deletePhoto', async (req, res) => {
    const username = req.params.username;
    const { photo } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(404).send('User not found');
        }

        // Remove photo from user photos array
        user.photos = user.photos.filter(p => p !== photo);
        await user.save();

        // Delete the photo file
        fs.unlinkSync(path.join(__dirname, '../public/images', photo));

        res.redirect(`/user/${username}`);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
