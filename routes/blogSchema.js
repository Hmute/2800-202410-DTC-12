const mongoose = require("mongoose");

// Define the schema for the blog model
const blogSchema = new mongoose.Schema({
  title: String, // Title of the blog post
  content: String, // Content of the blog post
  createdAt: String, // Date the blog was created in string format
  fullDate: Date, // Full date object for the creation date
  tags: [String], // Array of tags associated with the blog post
  views: Number, // Number of views the blog post has
  cloudinary: String, // URL to the blog's image hosted on Cloudinary
  author: String, // Author of the blog post
});

// Create the blog model from the schema
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog; // Export the blog model
