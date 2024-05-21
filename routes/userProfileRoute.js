const express = require("express");
const router = express.Router();
const User = require("./User");
const multer = require("multer");
const cloudinary = require("../setup/cloudinary");

// Set storage engine for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "photos", maxCount: 3 },
]);

// Get profile page
router.get("/profile", async (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).send("Unauthorized: No username in session");
  }
  try {
    const user = await User.findOne({ fullName: username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).send("User not found");
    }
    console.log("Displaying profile for user:", user);
    res.render("userProfile", { user, page: "Profile" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Edit profile page
router.post("/profile/edit", upload, async (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).send("Unauthorized: No username in session");
  }
  const {
    fullName,
    gender,
    age,
    height,
    weight,
    bodyFat,
    fitnessLevel,
    workoutType,
    fitnessGoals,
    additionalInterests,
    personalQuote,
    instagram,
    facebook,
    twitter,
  } = req.body;

  try {
    const user = await User.findOne({ fullName: username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).send("User not found");
    }

    // Handle profile picture upload to Cloudinary
    if (req.files["profilePicture"]) {
      const profilePicBuffer = req.files["profilePicture"][0].buffer;
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(profilePicBuffer);
      });
      user.profilePicture = result.secure_url;
    }

    // Update user details
    user.fullName = fullName || user.fullName;
    user.gender = gender || user.gender;
    user.age = age || user.age;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.bodyFat = bodyFat || user.bodyFat;
    user.fitnessLevel = fitnessLevel || user.fitnessLevel;
    user.workoutType = workoutType || user.workoutType;
    user.fitnessGoals = fitnessGoals || user.fitnessGoals;
    user.additionalInterests = additionalInterests || user.additionalInterests;
    user.personalQuote = personalQuote || user.personalQuote;
    user.instagram = instagram || user.instagram;
    user.facebook = facebook || user.facebook;
    user.twitter = twitter || user.twitter;

    await user.save();
    res.redirect(`/user/profile`);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session during logout:", err);
      return res.status(500).send("Failed to log out");
    }
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/");
  });
});

module.exports = router;
