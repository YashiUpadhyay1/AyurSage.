const express = require("express");
const router = express.Router();
const Dosha = require("../models/Dosha");
const auth = require("../middleware/auth");

// SAVE RESULT - Frontend 'details' ko model 'form' mein map karna[cite: 1]
router.post("/", auth, async (req, res) => {
  try {
    const { result, disease, details, treatment } = req.body;

    const saved = await Dosha.create({
      user: req.userId,
      form: details, // Direct mapping: Frontend details -> Backend form[cite: 1]
      result: result,
      disease: disease,
      treatment: treatment
    });

    res.json(saved);
  } catch (err) {
    console.log("SAVE ERROR:", err.message);
    res.status(500).json({ message: "Server error while saving" });
  }
});

// GET ALL HISTORY[cite: 1]
router.get("/", auth, async (req, res) => {
  try {
    const history = await Dosha.find({ user: req.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

// GET SINGLE RECORD BY ID[cite: 1]
router.get("/:id", auth, async (req, res) => {
  try {
    const record = await Dosha.findById(req.params.id);
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Error fetching record" });
  }
});

module.exports = router;
