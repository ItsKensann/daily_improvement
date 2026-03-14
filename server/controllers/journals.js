const Journal = require("../models/Journal");

// @desc    Get all journaks
// @route   GET /api/journals
// @access  Private
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server Error`);
  }
};

// @desc    Create a journal entry
// @route   POST /api/journals
// @access  Private
exports.createJournal = async (req, res) => {
  try {
    const newJournal = await Journal.create({
      date: req.body.date,
      title: req.body.title || "Daily Reflection",
      content: req.body.content,
      mood: req.body.mood || "meh",
      user: req.user.id,
    });
    res.json(newJournal);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server Error`);
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journals/:id
// @access  Private
exports.deleteJournal = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server Error`);
  }
};
