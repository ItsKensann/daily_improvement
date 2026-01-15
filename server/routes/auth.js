const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to the dashboard
    res.redirect("http://localhost:5173/dashboard");
  }
);

// @desc    Get current logged in user
// @route   GET /auth/current_user
router.get("/current_user", (req, res) => {
  // Passport attaches the user to the req object
  if (req.user) {
    res.json(req.user);
  } else {
    res.send(null);
  }
});

// @desc    Logout user
// @route   GET /auth/logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
