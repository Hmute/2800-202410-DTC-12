const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  //   author: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: [true, "Author is required"],
  //   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
