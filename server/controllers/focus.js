const FocusSession = require("../models/FocusSession");
const Task = require("../models/Task");

// @desc    Log a completed focus session
// @route   POST /api/focus
// @access  Private
exports.logSession = async (req, res) => {
  try {
    const { durationMinutes, linkedTask } = req.body;

    if (!durationMinutes)
      return res.status(400).json({ message: "Duration is required" });

    // 1. Create the Focus Session (for the charts/Daily News)
    const newSession = await FocusSession.create({
      user: req.user.id,
      durationMinutes,
      linkedTask: linkedTask || null, // Null if user focuses without choosing a task
    });

    // 2. Update running time tally on the task
    if (linkedTask) {
      await Task.findByIdAndUpdate(
        linkedTask,
        { $inc: { totalTimeSpent: durationMinutes } }, // Adds duration to existing total
      );
    }

    res.json(newSession);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all focus sessions for specific user, info used on the dashboard
// @route   GET /api/focus
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ user: req.user.id })
      .sort({ completedAt: -1 }) // newest first
      .populate("linkedTask", "title category");

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a focus session
// @route   DELETE /api/focus/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await FocusSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await FocusSession.deleteOne({ _id: req.params.id });
    res.json({ message: "Focus session removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
