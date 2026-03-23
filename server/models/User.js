const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    preferences: {
      theme: { type: String, default: "dark" }, // 'light' or 'dark'
      dailyBriefingTime: { type: String, default: "09:00" }, // When to trigger the AI news
      workTime: { type: Number, default: 25 },
      breakTime: { type: Number, default: 5 },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
