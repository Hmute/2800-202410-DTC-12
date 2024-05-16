require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // There is no public folder. The hell is this for?
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/script", express.static(path.join(__dirname, "script")));
app.set("view engine", "ejs");

// Routes
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const launchRoute = require("./routes/launchRoute");
const loginRoute = require("./routes/loginRoute");
const resetPasswordRoute = require("./routes/resetPasswordRoute");
const signupRoute = require("./routes/signupRoute");
const blogRoute = require("./routes/blogRoute");

const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
const mongoHost = process.env.MONGODB_HOST;
const mongoOptions = process.env.MONGODB_OPTIONS;
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoHost}/?${mongoOptions}`;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoUri }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

// Use routes here
app.use("/forgotPassword", forgotPasswordRoute);
app.use("/", launchRoute);
app.use("/login", loginRoute);
app.use("/resetPassword", resetPasswordRoute);
app.use("/signup", signupRoute);
app.use(blogRoute);
// Richard's script for collapsing meals and exercises button on homepage (Change this soon richard)
app.get("/home", (req, res) => {
  res.render("home", { page: "dashboard" });
});

async function main() {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }


main();
