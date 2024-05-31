const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"], // User's full name
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"], // Unique username
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"], // Unique email address
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"], // Password with minimum length of 8 characters
    minlength: [8, "Password must be at least 8 characters long"],
  },
  gender: String, // User's gender
  age: Number, // User's age
  height: Number, // User's height
  weight: Number, // User's weight
  bodyFat: String, // User's body fat percentage
  fitnessLevel: String, // User's fitness level
  workoutType: String, // User's preferred workout type
  fitnessGoals: String, // User's fitness goals
  additionalInterests: String, // User's additional interests
  personalQuote: String, // User's personal quote
  profilePicture: String, // URL to user's profile picture
  resetPasswordToken: String, // Token for password reset
  resetPasswordExpires: Date, // Expiry date for password reset token
  blogPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // References to user's blog posts
    },
  ],
  instagram: String, // User's Instagram handle
  facebook: String, // User's Facebook handle
  twitter: String, // User's Twitter handle
  profilePictureEtag: String, // ETag for user's profile picture
  currentRoutine: { type: mongoose.Schema.Types.ObjectId, ref: "Routine" }, // Reference to user's current routine
  pastRoutines: [{ type: mongoose.Schema.Types.ObjectId, ref: "PastRoutine" }], // References to user's past routines
  startWeight: { type: Number, default: null }, // User's starting weight
  weightGoal: Number, // User's weight goal
  calorieGoal: Number, // User's daily calorie goal
  goalTimeframe: Number, // Timeframe for user's fitness goal
});

// Pre-save middleware to hash the password if modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.skipHashing) {
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

const User = mongoose.model("User", userSchema);

module.exports = User;
