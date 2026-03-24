const User = require("../models/User");

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
