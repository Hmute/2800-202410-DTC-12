// const express = require("express");
// const router = express.Router();
// const Blog = require("./blogSchema");
// const multer = require("multer");
// const cloudinary = require("../setup/cloudinary");
// const isAuthenticated = require("../middlewares/blogMiddlewares");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.get("/", isAuthenticated, async (req, res) => {
//   try {
//     // Fetch the latest blogs
//     const blogs = await Blog.find().sort({ fullDate: -1 });

//     // Fetch the top 5 popular blogs
//     const popularBlogs = await Blog.find().sort({ views: -1 }).limit(5);

//     res.render("blogPage", {
//       page: "Blog Posts",
//       blogs: blogs,
//       popularBlogs: popularBlogs,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Error loading blogs");
//   }
// });

// router.get("/create", isAuthenticated, (req, res) => {
//   res.render("blogCreate");
// });

// router.post("/save", upload.single("image"), async (req, res) => {
//   const { title, content, tags } = req.body;

//   try {
//     // Upload the file from memory to Cloudinary
//     const result = await cloudinary.uploader.upload_stream(
//       { folder: "blog_images" },
//       (error, result) => {
//         if (error) {
//           console.error("Cloudinary Error:", error);
//           res.status(500).send("Error uploading image");
//         } else {
//           const currentDate = new Date();
//           const formattedDate = currentDate.toISOString().split("T")[0];

//           const newBlog = new Blog({
//             title,
//             content,
//             tags: Array.isArray(tags) ? tags : [tags],
//             createdAt: formattedDate,
//             fullDate: currentDate,
//             views: 0,
//             cloudinary: result.secure_url,
//             author: req.session.username,
//           });

//           newBlog
//             .save()
//             .then(() => res.redirect("/blog")) // Maybe redirect them to another post route
//             // The post route is where I will save the id of the posted blog to the user.
//             // The user will get an array of id of their posts
//             .catch((err) => {
//               console.error("Database Error:", err);
//               res.status(500).send("Error saving blog post");
//             });
//         }
//       }
//     );

//     if (req.file) {
//       result.end(req.file.buffer);
//     } else {
//       res.status(400).send("No image file provided");
//     }
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Error saving blog post");
//   }
// });

// router.get("/view", isAuthenticated, async (req, res) => {
//   const blogId = req.query.id;
//   try {
//     const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });

//     if (!blog) {
//       res.status(404).send("Blog not found");
//     }

//     res.render("blogView", { blog });
//   } catch (err) {
//     res.status(500).send("Error loading blog post.");
//   }
// });

// router.get("/posts", isAuthenticated, (req, res) => {
//   // Get the array of posts id from the current user
//   // Access the blog collection and post the blogs on this route
//   res.render("blogUserPost", { page: "Your Blogs" });
// });

// router.post("/posts/delete", (req, res) => {
//   // Delete the id from the user's collection and also the blog collection and then redirect to blog/posts route.
//   res.redirect('/posts/delete');
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Blog = require("./blogSchema");
const multer = require("multer");
const cloudinary = require("../setup/cloudinary");
const User = require("./User");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const isAuthenticated = require("../middlewares/blogMiddlewares");

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

  if (!req.file) {
    return res.status(400).send("No image file provided");
  }

  try {
    // Upload the file to Cloudinary
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
      author: req.session.username,
    });

    const savedBlog = await newBlog.save();
    console.log("Blog saved successfully:", savedBlog);
    res.status(200).send(savedBlog._id.toString());
  } catch (err) {
    console.log("Detailed error: ", err);
    res.status(500).send("Error processing your request");
  }
});

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

router.get("/view", isAuthenticated, async (req, res) => {
  const blogId = req.query.id;
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });

    if (!blog) {
      res.status(404).send("Blog not found");
    }

    res.render("blogView", { blog });
  } catch (err) {
    res.status(500).send("Error loading blog post.");
  }
});

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

router.post("/posts/delete", async (req, res) => {
  const { blogId } = req.body;

  try {
    // Delete from Blog db
    await Blog.findByIdAndDelete(blogId);
    console.log(`${blogId} has been delete from the blog collection.`);

    // Delete from User blogPosts Array
    await User.updateOne(
      { blogPosts: blogId },
      { $pull: { blogPosts: blogId } }
    );
    console.log(`${blogId} has been delete from the User blogPosts Array.`);
    res.redirect('/blog/posts');
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Error deleting post");
  }
});

module.exports = router;
