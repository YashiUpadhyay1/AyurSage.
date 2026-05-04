const mongoose = require("mongoose");

const DoshaSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  form: { 
    type: Object, 
    required: true 
  },
  result: { 
    type: String, 
    required: true 
  },
  disease: { 
    type: String 
  },

  // Save the full treatment so history doesn't fall back to dosha lookup
  treatment: {
    type: Object,
    default: null
  },

  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Dosha", DoshaSchema);
