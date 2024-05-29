const express = require("express");
const router = express.Router();
const User = require("./User");
const { Weight } = require("./weightRoute"); 
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
    const user = await User.findOne({ username: username });
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
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).send("User not found");
    }

    if (req.files["profilePicture"]) {
      const profilePicBuffer = req.files["profilePicture"][0].buffer;
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures", eager: [{ transformation: {} }] },
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

      // Check for duplicate `etag`
      const existingUser = await User.findOne({
        profilePictureEtag: result.etag,
        email: user.email,
      });

      if (!existingUser) {
        user.profilePicture = result.secure_url;
        user.profilePictureEtag = result.etag;
      } else {
        console.log('Duplicate image detected');
      }
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

    // Update weight in Weight collection
    if (weight) {
      const normalizedDate = new Date();
      normalizedDate.setHours(0, 0, 0, 0);

      const existingWeights = await Weight.find({ userId: user._id }).exec();

      if (existingWeights.length === 0) {
        // Set start weight if no existing weight logs
        await User.findByIdAndUpdate(user._id, { startWeight: parseFloat(weight).toFixed(2) });
      }

      await Weight.findOneAndUpdate(
        { userId: user._id, date: normalizedDate },
        { $set: { weightKg: parseFloat(weight).toFixed(2) } },
        { new: true, upsert: true }
      );

      await User.findByIdAndUpdate(user._id, { weight: parseFloat(weight).toFixed(2) });
    }

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
