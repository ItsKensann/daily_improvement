const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String }, // Optional details

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    category: { type: String, default: "General" }, // e.g., "Coding", "Fitness"

    dueDate: { type: Date },
    completedAt: { type: Date }, // Crucial for "Yesterday's Review" AI generation

    // AI-generated subtasks (hidden by default in UI until expanded)
    aiBreakdown: [
      {
        step: String,
        isDone: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
