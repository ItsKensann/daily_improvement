const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now }, // Usually one entry per day
    title: { type: String, required: true, default: "Daily Reflection" },
    content: { type: String, required: true }, // Markdown content

    // Simple check-in for the AI context
    mood: {
      type: String,
      enum: ["happy", "meh", "frown", "tired"],
      default: "meh",
    },

    tags: [String], // e.g., ["Reflection", "Idea"]
  },
  { timestamps: true },
);

module.exports = mongoose.model("Journal", JournalSchema);
