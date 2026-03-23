const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Consultation = require("../models/Consultation");

/*
  AUTHENTICATION MIDDLEWARE
  This middleware verifies the JWT token sent in the request header.
  If the token is valid, the userId is extracted and attached to the request.
*/
const auth = (req, res, next) => {
  try {

    // Get Authorization header from request
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      console.log("No Authorization Header");
      return res.status(401).json({ message: "No Token" });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    // Check if token exists
    if (!token) {
      console.log("Token missing");
      return res.status(401).json({ message: "Invalid Token" });
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request object
    req.userId = decoded.id;

    // Continue to next middleware or route
    next();

  } catch (err) {

    console.log("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Token Failed" });

  }
};

/*
  POST /api/consultation
  Saves a new consultation booking for the authenticated user.
*/
router.post("/", auth, async (req, res) => {
  try {

    // Log request data for debugging
    console.log("📥 BODY:", req.body);
    console.log("👤 USER:", req.userId);

    // Create and save consultation record in database
    const saved = await Consultation.create({
      userId: req.userId,
      name: req.body.name,
      age: req.body.age,
      concern: req.body.concern,
      practitioner: req.body.practitioner,
      date: req.body.date,
      time: req.body.time,
    });

    // Send saved consultation as response
    res.json(saved);

  } catch (err) {

    console.log("SAVE ERROR:", err.message);
    res.status(500).json({ message: "Error saving consultation" });

  }
});

/*
  GET /api/consultation
  Fetches all consultations booked by the authenticated user.
*/
router.get("/", auth, async (req, res) => {
  try {

    // Find consultations belonging to the logged-in user
    const data = await Consultation
      .find({ userId: req.userId })
      .sort({ createdAt: -1 }); // Latest first

    // Send consultations list
    res.json(data);

  } catch (err) {

    console.log("FETCH ERROR:", err.message);
    res.status(500).json({ message: "Error fetching consultations" });

  }
});

// Export router to use in main server file
module.exports = router;