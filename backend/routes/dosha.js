const express = require("express");
const router = express.Router();
const Dosha = require("../models/Dosha");
const auth = require("../middleware/auth");

// SAVE ASSESSMENT RESULT (Updated to include disease)
router.post("/", auth, async (req, res) => {
  try {
    // Frontend se result (dosha) aur disease dono nikalna
    const { result, disease, details } = req.body;

    const saved = await Dosha.create({
      user: req.userId, 
      form: details,
      result: result,   // Yeh aapka predicted_dosha hai
      disease: disease  // Yeh aapka predicted_disease hai
    });

    res.json(saved);
  } catch (err) {
    console.log("SAVE ERROR:", err.message);
    res.status(500).json({ message: "Server error while saving result" });
  }
});

// GET USER HISTORY
router.get("/", auth, async (req, res) => {
  try {
    const history = await Dosha.find({ user: req.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

module.exports = router;