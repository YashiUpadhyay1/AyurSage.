const express = require("express");
const axios = require("axios");
const router = express.Router();

// React calls -> Node (5000) -> Node calls Flask (5001)
router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/predict", req.body);
    res.json(response.data);
  } catch (error) {
    console.error("ML Server Error:", error.message);
    res.status(500).json({ error: "ML prediction failed", details: error.message });
  }
});

module.exports = router;