const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Dosha = require("../models/Dosha");

// MIDDLEWARE 
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// SAVE ASSESSMENT 
router.post("/", auth, async (req, res) => {
  try {
    const { result, details } = req.body;

    const saved = await Dosha.create({
      user: req.userId,
      form: details,
      result
    });

    res.json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER HISTORY
router.get("/", auth, async (req, res) => {
  const history = await Dosha.find({ user: req.userId }).sort({ date: -1 });
  res.json(history);
});

module.exports = router;
