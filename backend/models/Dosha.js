const mongoose = require("mongoose");

const DoshaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  form: { type: Object, required: true },
  result: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Dosha", DoshaSchema);
