const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  dosha: {
    type: String,
    required: true
  },
  disease: { // Added to match the data sent from frontend
    type: String
  },
  details: { // Renamed from 'data' to 'details' to match PredictDosha.js
    type: Object
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Assessment", assessmentSchema);