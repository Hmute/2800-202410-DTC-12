const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Routine = require("../routes/Routine"); // Import the central model

// Route to render the home page and fetch user routines
router.get("/", async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }
  const { saved } = req.query;
  const user = req.session.user;

  try {
    // Switch to the 'test' database
    const myDatabase = mongoose.connection.useDb("test");
    // Use the Routine schema with the 'test' database
    const Routines = myDatabase.model("Routine", Routine.schema);
    // Fetch routines for the current user
    const routines = await Routines.find({ user: user._id });

    res.render("home", {
      userName: user.fullName,
      user,
      page: "Home",
      saved,
      routines,
    });
  } catch (err) {
    console.error("Error fetching routines:", err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
