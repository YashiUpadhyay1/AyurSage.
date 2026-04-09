const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Role add karein: default 'user' rahega, hum manually 'doctor' set kar sakte hain
  role: { type: String, enum: ["user", "doctor"], default: "user" }
});

module.exports = mongoose.model("User", UserSchema);