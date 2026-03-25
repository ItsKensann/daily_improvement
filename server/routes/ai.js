const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const aiController = require("../controllers/ai");

router.get("/daily-insight", ensureAuth, aiController.getDailyInsight);
router.post(
  "/daily-insight/generate",
  ensureAuth,
  aiController.generateInsight,
);

module.exports = router;
