const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const userController = require("../controllers/user");

router.patch("/timer-settings", ensureAuth, userController.updateTimer);
router.get("/dashboard-stats", ensureAuth, userController.getDashboardStats);

module.exports = router;
