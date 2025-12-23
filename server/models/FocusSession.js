const mongoose = require("mongoose");

const FocusSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  linkedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // Optional: what were you working on?
  durationMinutes: { type: Number, required: true }, // e.g., 25
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FocusSession", FocusSessionSchema);
