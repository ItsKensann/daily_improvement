const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    contextPills: [{ type: String }], // Array of short strings like ["240m Focus", "Energy Pattern"]
  },
  { timestamps: true },
);

module.exports = mongoose.model("Insight", InsightSchema);
