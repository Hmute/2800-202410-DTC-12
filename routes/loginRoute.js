const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcrypt");

// GET: Display login form
router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/home');
  }
  res.render("login", { error: null, user: req.session.user });
});

// POST: Handle login
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        error: "Invalid email or password.",
        user: req.session.user,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        error: "Invalid email or password.",
        user: req.session.user,
      });
    }

    // Do not remove this Sebastian
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isAuthenticated = true;
    req.session.fullName = user.fullName;
    console.log(
      req.session.userId,
      req.session.username,
      req.session.isAuthenticated,
      req.session.fullName
    );

    req.session.user = user;
    res.redirect("/home");
  } catch (err) {
    console.error("Error logging in:", err);
    res.render("login", {
      error: "An error occurred during login. Please try again.",
      user: req.session.user,
    });
  }
});

module.exports = router;
