const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // FIX 1: Use the full URL for the callback
        callbackURL: "http://localhost:5000/auth/google/callback",
        // FIX 2: Define the scope directly here
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        // ... (The rest of your code inside here remains exactly the same) ...
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // task the user id and turn it into a cookie,
  // cookie is the wristbrand/session for the user, as lng as the browser has this cookie, server knows you are logged in
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
