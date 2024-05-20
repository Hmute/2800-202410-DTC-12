const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    gender: String,
    age: Number,
    height: String,
    weight: String,
    bodyFat: String,
    fitnessLevel: String,
    workoutType: String,
    fitnessGoals: String,
    additionalInterests: String,
    personalQuote: String,
    profilePicture: String,
    photos: [String],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    blogPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') && !this.skipHashing) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
