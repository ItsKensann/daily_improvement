const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/database");

// Load env variables
dotenv.config();

// import routes
const authRoutes = require("./routes/auth");
// const todoRoutes = require("./routes/todoRoutes");
const PORT = process.env.PORT || 5000;

// Passport config
require("./config/passport")(passport);

connectDB();
const app = express();

// middleware
app.use(express.json()); // express intercepts incoming requests and parses the JSON string and turn into Javascript object
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true, // Important for cookies/sessions
  })
);
app.use(helmet()); // Adds security headers
app.use(morgan("dev")); // Logs requests to the console

// Sessions
app.use(
  session({
    secret: "keyboard cat", // Change this to a random string in production
    resave: false,
    saveUninitialized: false,
  })
);

// passport middleware
// middleware for node js that tells the server how to handle logins
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);
// app.use("/api/todos", todoRoutes);

// Test Route to confirm login worked
app.get("/api/test-success", (req, res) => {
  if (req.user) {
    res.json({ message: "Login Successful!", user: req.user.displayName });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
