const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const focusController = require("../controllers/focus");

router.post("/", ensureAuth, focusController.logSession);
router.get("/", ensureAuth, focusController.getSessions);
router.delete("/:id", ensureAuth, focusController.deleteSession);

module.exports = router;
