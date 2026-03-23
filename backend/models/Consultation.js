const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  age: String,
  concern: String, 
  practitioner: String,
  date: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consultation", ConsultationSchema);