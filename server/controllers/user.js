const mongoose = require("mongoose");
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
// @route   GET /api/user/dashboard-stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userIdStr = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userIdStr);

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 7);

    // --- FOCUS STATS ---
    const focusSessionsToday = await FocusSession.find({
      user: userIdStr,
      completedAt: { $gte: startOfToday },
    });

    const focusSessionsThisWeek = await FocusSession.find({
      user: userIdStr,
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
          user: userObjectId, // Using the casted ObjectId!
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

    const tasksCompletedToday = await Task.countDocuments({
      user: userIdStr,
      status: "completed",
      completedAt: { $gte: startOfToday },
    });

    const tasksCompletedThisWeek = await Task.countDocuments({
      user: userIdStr,
      status: "completed",
      completedAt: { $gte: startOfWeek },
    });

    const tasksByCategory = await Task.aggregate([
      { $match: { user: userObjectId } }, // Casted ObjectId
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const tasksByPriority = await Task.aggregate([
      { $match: { user: userObjectId, status: { $ne: "completed" } } }, // only active tasks
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const topTasks = await Task.aggregate([{ $limit: 3 }]);

    const overdueCount = await Task.countDocuments({
      user: userIdStr,
      status: { $ne: "completed" },
      dueDate: { $lt: now },
    });

    res.json({
      focus: {
        minutesToday: focusMinutesToday,
        minutesThisWeek: focusMinutesThisWeek,
        sessionsToday: focusSessionsToday.length,
        sessionsThisWeek: focusSessionsThisWeek.length,
        byDay: focusByDay,
      },
      tasks: {
        completedToday: tasksCompletedToday,
        completedThisWeek: tasksCompletedThisWeek,
        topTasks: topTasks,
        overdueCount,
        byCategory: tasksByCategory,
        byPriority: tasksByPriority,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
