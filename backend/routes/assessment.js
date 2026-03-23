import express from "express";
import Assessment from "../models/Assessment.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Save result
router.post("/save", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret123");

    const doc = await Assessment.create({
      userId: decoded.id,
      dosha: req.body.dosha,
      data: req.body.data,
    });

    res.json({ success: true, saved: doc });
  } catch (err) {
    res.status(500).json({ error: "Failed to save" });
  }
});

// Fetch history
router.get("/history", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secret123");

  const entries = await Assessment.find({ userId: decoded.id }).sort({ createdAt: -1 });

  res.json(entries);
});

export default router;
