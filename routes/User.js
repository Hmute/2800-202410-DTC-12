const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'], // Full name is required
        trim: true, // Remove whitespace around the value
    },
    email: {
        type: String,
        required: [true, 'Email is required'], // Email is required
        unique: true, // Email must be unique
        trim: true, // Remove whitespace around the value
        lowercase: true, // Convert the email to lowercase
        validate: {
            validator: function(v) {
                // Regular expression to validate email format
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address' // Custom error message for invalid email
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'], // Password is required
        minlength: [8, 'Password must be at least 8 characters long'] // Minimum length for password
    },
    resetPasswordToken: String, // Token for password reset functionality
    resetPasswordExpires: Date // Expiration date for the password reset token
});

// Pre-save middleware to hash passwords before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // If password hasn't changed, skip hashing
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password using the salt
        next(); // Proceed to save the user
    } catch (err) {
        return next(err); // Handle any errors that occur during hashing
    }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the User model for use in other parts of the application
