const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const ML_LIVE_URL = process.env.ML_LIVE_URL || "https://ayursage-ml.onrender.com/predict";

    // 1. Data Cleaning: Model ko Number chahiye aur exact keys
    const formattedData = {
      Age: Number(req.body.age || req.body.Age), 
      Gender: req.body.gender || req.body.Gender,
      Prakriti: req.body.prakriti || req.body.Prakriti,
      Symptoms: req.body.symptoms || req.body.Symptoms,
      "Stress Level": req.body.stressLevel || req.body["Stress Level"],
      "Sleep Pattern": req.body.sleepPattern || req.body["Sleep Pattern"],
      "Diet Type": req.body.dietType || req.body["Diet Type"],
      Season: req.body.season || req.body.Season,
      Climate: req.body.climate || req.body.Climate
    };

    console.log("--- Sending Data to ML ---");
    console.log(formattedData);

    const response = await axios.post(ML_LIVE_URL, formattedData, {
      timeout: 60000 
    });

    res.json(response.data);

  } catch (error) {
    console.error("ML Connection Error:", error.message);
    res.status(500).json({ 
      error: "ML Engine is warming up. Please try again.", 
      details: error.message 
    });
  }
});

module.exports = router;