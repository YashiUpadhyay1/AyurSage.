const express = require("express");
const router = express.Router();
const Dosha = require("../models/Dosha");
const auth = require("../middleware/auth");

// SAVE RESULT - Frontend variables ko model fields mein map karna
router.post("/", auth, async (req, res) => {
  try {
    const { result, disease, details, treatment } = req.body;

    // Data verification for logging
    console.log("Data Received for Saving:", { result, disease, treatment });

    const saved = await Dosha.create({
      user: req.userId,
      form: details || {}, // Frontend 'details' -> Model 'form'
      result: result,
      disease: disease || "Not Identified",
      treatment: treatment || null // explicitly saving treatment object
    });

    res.status(201).json(saved);
  } catch (err) {
    console.log("SAVE ERROR:", err.message); // Validation failure check
    res.status(500).json({ message: "Server error while saving result" });
  }
});

// GET ALL HISTORY
router.get("/", auth, async (req, res) => {
  try {
    const history = await Dosha.find({ user: req.userId }).sort({ date: -1 });
    res.json(history);
  } catch {
    res.status(500).json({ message: "Error fetching history" });
  }
});

module.exports = router;
