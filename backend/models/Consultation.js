const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  age: Number,
  gender: String,
  prakriti: String,
  predictedDosha: String,
  predictedDisease: String,
  symptoms: String,
  reportFile: String, 
  practitioner: { type: String, required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ["Reserved", "Confirmed", "Rejected", "Completed"], 
    default: "Reserved" 
  },
  medicines: { type: String, default: "" },
  lifestyle: { type: String, default: "" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// TTL Index: Auto-delete "Reserved" slots after 24 hours
ConsultationSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 86400, 
    partialFilterExpression: { status: "Reserved" } 
  }
);

module.exports = mongoose.model("Consultation", ConsultationSchema);