const express = require("express");
const auth = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const JournalEntry = require("../models/JournalEntry");

const router = express.Router();

router.get(
  "/ledger",
  auth,
  rbac(["AUDITOR"]),
  async (req, res) => {
    try {
      const entries = await JournalEntry.find()
        .populate("lines.account", "name type asset")
        .sort({ timestamp: -1 });

      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch ledger" });
    }
  }
);

module.exports = router;
