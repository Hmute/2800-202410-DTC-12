const express = require("express");
const router = express.Router();
const Blog = require("./blogSchema");
const multer = require("multer");
const cloudinary = require("../setup/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    // Fetch the latest blogs
    const blogs = await Blog.find().sort({ fullDate: -1 });

    // Fetch the top 5 popular blogs
    const popularBlogs = await Blog.find().sort({ views: -1 }).limit(5);

    res.render("blogPage", {
      page: "Blog Posts",
      blogs: blogs,
      popularBlogs: popularBlogs,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error loading blogs");
  }
});

router.get("/create", (req, res) => {
  res.render("blogCreate");
});

router.post("/save", upload.single("image"), async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    // Upload the file from memory to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          res.status(500).send("Error uploading image");
        } else {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split("T")[0];

          const newBlog = new Blog({
            title,
            content,
            tags: Array.isArray(tags) ? tags : [tags],
            createdAt: formattedDate,
            fullDate: currentDate,
            views: 0,
            cloudinary: result.secure_url,
            author: req.session.username,
          });

          newBlog
            .save()
            .then(() => res.redirect("/blog"))
            .catch((err) => {
              console.error("Database Error:", err);
              res.status(500).send("Error saving blog post");
            });
        }
      }
    );

    if (req.file) {
      result.end(req.file.buffer);
    } else {
      res.status(400).send("No image file provided");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error saving blog post");
  }
});

router.get("/view", async (req, res) => {
  const blogId = req.query.id;
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });

    if (!blog) {
      res.status(404).send('Blog not found');
    }

    res.render('blogView', { blog });
  } catch (err) {
    res.status(500).send('Error loading blog post.');
  }
});

router.get("/posts", (req, res) => {
  res.render('blogUserPost', { page: 'Your Posts' });
});

router.post("/posts/delete", (req, res) => {
  res.redirect('/posts/delete');
});

module.exports = router;
