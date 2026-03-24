const User = require("../models/User");
const FocusSession = require("../models/FocusSession");
const Task = require("../models/Task");

// @desc    Update the work time and break time of a user object
// @route   PATCH /api/user/timer-settings
// @access  Private
exports.updateTimer = async (req, res) => {
  try {
    const { workMinutes, breakMinutes } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // from auth middleware
      {
        $set: {
          "timerSettings.workMinutes": req.params.workMinutes,
          "timerSettings.brekMinutes": req.params.breakMinutes,
        },
      },
      { new: true },
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Get dashboard stats for the logged in user
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Time boundaries
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    // --- FOCUS STATS ---
    const focusSessionsToday = await FocusSession.find({
      user: userId,
      completedAt: { $gte: startOfToday },
    });

    const focusSessionsThisWeek = await FocusSession.find({
      user: userId,
      completedAt: { $gte: startOfWeek },
    });

    const focusMinutesToday = focusSessionsToday.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );
    const focusMinutesThisWeek = focusSessionsThisWeek.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );

    // Focus minutes per day for the last 7 days (for bar chart)
    const focusByDay = await FocusSession.aggregate([
      {
        $match: {
          user: userId,
          completedAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          totalMinutes: { $sum: "$durationMinutes" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- TASK STATS ---
    const tasksCompletedToday = await Task.countDocuments({
      user: userId,
      status: "completed",
      completedAt: { $gte: startOfToday },
    });

    const tasksCompletedThisWeek = await Task.countDocuments({
      user: userId,
      status: "completed",
      completedAt: { $gte: startOfWeek },
    });

    const tasksByCategory = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const overdueCount = await Task.countDocuments({
      user: userId,
      status: { $ne: "completed" },
      dueDate: { $lt: now },
    });

    res.json({
      focus: {
        minutesToday: focusMinutesToday,
        minutesThisWeek: focusMinutesThisWeek,
        sessionsToday: focusSessionsToday.length,
        sessionsThisWeek: focusSessionsThisWeek.length,
        byDay: focusByDay, // [{ _id: "2025-01-01", totalMinutes: 50 }, ...]
      },
      tasks: {
        completedToday: tasksCompletedToday,
        completedThisWeek: tasksCompletedThisWeek,
        overdueCount,
        byCategory: tasksByCategory, // [{ _id: "Coding", count: 3 }, ...]
        byPriority: tasksByPriority, // [{ _id: "high", count: 2 }, ...]
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
