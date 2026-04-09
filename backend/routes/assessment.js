const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assesment"); // Matches your filename Assesment.js
const auth = require("../middleware/auth");

// Save result
router.post("/save", auth, async (req, res) => {
  try {
    const doc = await Assessment.create({
      userId: req.userId,
      dosha: req.body.dosha,
      data: req.body.data,
    });
    res.json({ success: true, saved: doc });
  } catch (err) {
    res.status(500).json({ error: "Failed to save" });
  }
});

// Fetch history
router.get("/history", auth, async (req, res) => {
  try {
    const entries = await Assessment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;