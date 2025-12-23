const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now }, // Usually one entry per day
    content: { type: String, required: true }, // Markdown content

    // Simple check-in for the AI context
    mood: {
      type: String,
      enum: ["great", "neutral", "stressed", "tired"],
      default: "neutral",
    },

    tags: [String], // e.g., ["Reflection", "Idea"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", JournalSchema);
