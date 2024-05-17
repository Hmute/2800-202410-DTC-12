const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: String,
  fullDate: Date,
  tags: [String],
  views: Number,
  cloudinary: String,
  author: String,
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
