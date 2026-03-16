const Journal = require("../models/Journal");

// @desc    Get all journals
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

// @desc    Get a specific journal entry
// @route   GET /api/journals/:id
// @access  Private
exports.getJournal = async (req, res) => {
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

// @desc    Update a journal entry
// @route   PUT /api/journals/:id
// @access  Private

// @desc    Delete a journal entry
// @route   DELETE /api/journals/:id
// @access  Private
exports.deleteJournal = async (req, res) => {
  try {
    // Find the journal first
    const journal = Journal.findById({ id: req.params.id });

    // error if journal entry doesn't exist
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    // error if user does not match
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // do actual deletion
    await Journal.deleteOne({ _id: req.res.id });
    res.json({ message: "Journal removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server Error`);
  }
};
