// Import mongoose to define the data structure for MongoDB [cite: 8]
const mongoose = require("mongoose");

/**
 * User Schema Definition
 * Purpose: Defines the structure for user profiles and authentication data [cite: 34]
 */
const userSchema = new mongoose.Schema({
  // Basic identifying information for the user
  name: { 
    type: String, 
    required: true,
    trim: true // Removes extra whitespace from start and end
  },
  // Unique email used for login and identification [cite: 10]
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  // Hashed password string for secure authentication [cite: 10, 34]
  password: { 
    type: String, 
    required: true 
  },
  // Defines access levels within the AyurSage platform
  role: { 
    type: String, 
    enum: ["user", "doctor"], 
    default: "user" 
  },
  
  /**
   * Permanent Factors
   * These health attributes are usually set at signup and remain constant
   */
  dob: { 
    type: String, 
    required: true // Expected Format: YYYY-MM-DD
  },
  bloodGroup: { 
    type: String, 
    required: true,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] 
  },
  gender: { 
    type: String, 
    required: true,
    enum: ["Male", "Female", "Other"]
  },
  
  /**
   * Doctor Specific Field
   * Conditional validation: only required if the role is set to 'doctor'
   */
  licenseNumber: { 
    type: String,
    required: function() { return this.role === 'doctor'; } 
  }
}, { 
  // Automatically creates 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

/**
 * Export the model to be used by the 'Manager' (Node.js) for database queries [cite: 7, 34]
 */
module.exports = mongoose.model("User", userSchema);