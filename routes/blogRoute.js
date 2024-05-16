const express = require("express");
const router = express.Router();
const Blog = require("./blogSchema");

router.get("/", (req, res) => {
  res.render("blogPage", { page: "Blog Posts" });
});

router.get("/create", (req, res) => {
  res.render("blogCreate");
});

router.post("/save", async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const newBlog = new Blog({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [tags],
      createdAt: new Date(),
    });
    await newBlog.save();
    res.redirect("/blog");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error saving blog post");
  }
});

module.exports = router;
