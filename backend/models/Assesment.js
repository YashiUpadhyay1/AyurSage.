// Import the mongoose library to define the assessment data structure
const mongoose = require("mongoose");

/**
 * Assessment Schema Definition
 * Purpose: Acts as a permanent "Memory" to log every diagnostic session
 * This allows the system to track how a user's health changes over time
 */
const assessmentSchema = new mongoose.Schema({
  /**
   * User Connection
   * Connects this assessment to a specific person in the User database
   * This ensures users only see their own health history on their dashboard
   */
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },

  /**
   * Prediction Result
   * Saves the specific Dosha (Vata, Pitta, or Kapha) identified by the ML server
   */
  dosha: {
    type: String
  },

  /**
   * Raw Symptom Data
   * Stores the full list of symptoms and answers provided by the user
   * Saved as an Object to handle flexible data sent from the frontend
   */
  data: {
    type: Object
  },

  /**
   * Time Tracking
   * Automatically captures the date and time when the test was completed
   * Used to build the timeline for the user's wellness history
   */
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * Export the Assessment model
 * The Node.js backend uses this to fetch and display the user's health journey
 */
module.exports = mongoose.model("Assessment", assessmentSchema);