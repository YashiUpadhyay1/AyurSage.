const express = require("express");
const router = express.Router();
const Dosha = require("../models/Dosha");
const auth = require("../middleware/auth");

// SAVE RESULT - Frontend variables ko model fields mein map karna
router.post("/", auth, async (req, res) => {
  try {
    const { result, disease, details, treatment } = req.body;

    const saved = await Dosha.create({
      user: req.userId,
      form: details, // Frontend 'details' -> Model 'form'
      result: result,
      disease: disease,
      treatment: treatment // Explicitly saving treatment object
    });

    res.json(saved);
  } catch (err) {
    console.log("SAVE ERROR:", err.message);
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
