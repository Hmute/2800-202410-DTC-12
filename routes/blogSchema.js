const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: String,
  fullDate: Date,
  tags: [String],
  views: Number,
  cloudinary: String,
  //   author: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: [true, "Author is required"],
  //   },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
