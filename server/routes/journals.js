const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const journalsController = require("../controllers/journals");

// logic handled by controller functions
router.get("/", ensureAuth, journalsController.getJournals);
router.post("/", ensureAuth, journalsController.createJournal);
// router.delete("/:id", ensureAuth, journalsController.deleteJournal);

module.exports = router;
