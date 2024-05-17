require("dotenv").config();
const cloudinary = require("cloudinary").v2; // Ensuring I am using v2

// Configuring cloudinary to my account(MARC)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

module.exports = cloudinary;
