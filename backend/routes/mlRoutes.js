const express = require("express");
const axios = require("axios");

const router = express.Router();

// 🔥 ML PREDICTION ROUTE
router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/predict", // ML server
      req.body
    );

    res.json(response.data);

  } catch (error) {
    console.error("ML Server Error:", error.message);

    res.status(500).json({
      error: "ML prediction failed",
      details: error.message
    });
  }
});

module.exports = router;