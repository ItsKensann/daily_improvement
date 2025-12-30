const Task = require("../models/Task");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create({
      title: req.body.title,
      priority: req.body.priority || "medium",
      category: req.body.category || "General",
      user: req.user.id,
    });
    res.json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    // Find the task first
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user id that is saved on the browser matches the user id that is associated with that task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Tells mongoose to go look through the collecton and delete the document where the field _id matches this value
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
