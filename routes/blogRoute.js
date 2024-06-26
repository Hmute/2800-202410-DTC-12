const express = require("express");
const router = express.Router();
const Blog = require("./blogSchema");
const multer = require("multer");
const cloudinary = require("../setup/cloudinary");
const User = require("./User");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const isAuthenticated = require("../middlewares/blogMiddlewares");

// Route to fetch and display blog posts
router.get("/", async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }
  try {
    const blogs = await Blog.find().sort({ fullDate: -1 }); // Fetch latest blogs
    const popularBlogs = await Blog.find().sort({ views: -1 }).limit(5); // Fetch top 5 popular blogs

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

// Route to render the blog creation page
router.get("/create", (req, res) => {
  res.render("blogCreate");
});

// Route to handle blog saving with image upload
router.post("/save", upload.single("image"), async (req, res) => {
  const { title, content, tags } = req.body;

  if (!req.file || !title || !content || !tags || tags === "None") {
    res
      .status(400)
      .send("All fields (image, title, content, and tags) are required.");
    return;
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "blog_images" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

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
      author: req.session.fullName,
    });

    const savedBlog = await newBlog.save();
    console.log("Blog saved successfully:", savedBlog);
    res.status(200).send(savedBlog._id.toString());
  } catch (err) {
    console.log("Detailed error: ", err);
    res.status(500).send("Error processing your request");
  }
});

// Route to save the blog post to the user's list
router.get("/postSave", async (req, res) => {
  const blogId = req.query.blogId;

  if (!req.session.userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    await User.findByIdAndUpdate(req.session.userId, {
      $push: { blogPosts: blogId },
    });
    console.log("Blog has been saved to user.");
    res.redirect("/blog");
  } catch (err) {
    console.error("Error updating user with blog post:", err);
    res.status(500).send("Error updating user with blog post");
  }
});

// Route to view a specific blog post
router.get("/view", isAuthenticated, async (req, res) => {
  const blogId = req.query.id;
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
    if (!blog) {
      res.status(404).send("Blog not found");
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
      res.status(404).send("User not found.");
    }
    const profile = user.profilePicture || "/images/Default_pfp.png";
    res.render("blogView", { blog, profile });
  } catch (err) {
    res.status(500).send("Error loading blog post.");
  }
});

// Route to display user's blog posts
router.get("/posts", async (req, res) => {
  if (!req.session.userId) {
    console.log("No user currently logged in.");
    res.redirect("/");
  }

  try {
    const user = await User.findById(req.session.userId).populate("blogPosts");

    if (!user) {
      res.redirect("/");
    }

    const blogPosts = user.blogPosts;
    res.render("blogUserPost", { page: "Your Posts", blogs: blogPosts });
  } catch (err) {
    res.status(500).send("Error retrieving posts");
  }
});

// Route to delete a blog post
router.post("/posts/delete", async (req, res) => {
  const { blogId } = req.body;

  try {
    await Blog.findByIdAndDelete(blogId); // Delete from Blog db
    console.log(`${blogId} has been delete from the blog collection.`);

    await User.updateOne(
      { blogPosts: blogId },
      { $pull: { blogPosts: blogId } }
    ); // Delete from User blogPosts Array
    console.log(`${blogId} has been delete from the User blogPosts Array.`);
    res.redirect("/blog/posts");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Error deleting post");
  }
});

module.exports = router;
