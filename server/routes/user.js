const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const userController = require("../controllers/user");

router.patch("/timer-settings", ensureAuth, userController.updateTimer);

module.exports = router;
