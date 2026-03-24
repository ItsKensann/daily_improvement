const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth"); // security guard layer
const tasksController = require("../controllers/tasks");

// logic handled by controller functions
router.get("/", ensureAuth, tasksController.getTasks);
router.post("/", ensureAuth, tasksController.createTask);
router.delete("/:id", ensureAuth, tasksController.deleteTask);
router.patch("/:id", ensureAuth, tasksController.completeTask);

module.exports = router;
