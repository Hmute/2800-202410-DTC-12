const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
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
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // Don't rehash if password hasn't changed
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
