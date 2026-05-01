// Import core dependencies for routing, file handling, and database interaction
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Consultation = require("../models/Consultation");
const auth = require("../middleware/auth");

/**
 * FILE SYSTEM PREPARATION
 * Purpose: Ensures the local upload directory exists to prevent errors during file storage
 */
if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

/**
 * STORAGE CONFIGURATION
 * Purpose: Defines how uploaded health reports are named and stored using Multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage: storage });

/**
 * ROUTE A: SMART FETCH BUSY SLOTS
 * Path: GET /api/consultation/busy-slots
 * Purpose: Identifies unavailable time slots for a specific doctor on a specific date
 */
router.get("/busy-slots", async (req, res) => {
  try {
    const { practitioner, date } = req.query; 
    if (!practitioner || !date) return res.json([]);

    // Normalize doctor name by removing "Dr. " prefix to ensure consistent matching
    const baseName = practitioner.replace(/^Dr\.\s+/i, ""); 
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Query database for bookings that are Confirmed, Completed, or recently Reserved
    const busyBookings = await Consultation.find({
      $or: [
        { practitioner: practitioner },
        { practitioner: new RegExp(baseName, 'i') }
      ],
      date: date,
      $or: [
        { status: { $in: ["Confirmed", "Completed"] } }, 
        { status: "Reserved", createdAt: { $gte: twentyFourHoursAgo } } 
      ]
    }).select("time");

    // Return a unique array of busy time strings
    const busyTimes = [...new Set(busyBookings.map(b => b.time.trim()))];
    res.json(busyTimes);
  } catch (err) {
    console.error("Busy slots error:", err);
    res.status(500).json([]);
  }
});

/**
 * ROUTE B: BOOK A CONSULTATION
 * Path: POST /api/consultation/
 * Purpose: Reserves a slot and handles health report uploads with double-booking validation
 */
router.post("/", auth, upload.single("report"), async (req, res) => {
  try {
    const { date, time, practitioner } = req.body;
    const baseName = practitioner.replace(/^Dr\.\s+/i, "");
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Verify if the slot is still available immediately before creating the record
    const existingSlot = await Consultation.findOne({
      $or: [
        { practitioner: practitioner },
        { practitioner: new RegExp(baseName, 'i') }
      ],
      date,
      time,
      $or: [
        { status: { $in: ["Confirmed", "Completed"] } },
        { status: "Reserved", createdAt: { $gte: twentyFourHoursAgo } }
      ]
    });

    if (existingSlot) {
      return res.status(400).json({ message: "This slot is already booked for this date." });
    }

    // Create and save the new consultation record
    const newBooking = new Consultation({
      ...req.body,
      userId: req.userId || req.user?.id,
      reportFile: req.file ? req.file.path : null,
      status: "Reserved",
      createdAt: new Date()
    });

    await newBooking.save();
    res.status(201).json({ message: "Slot reserved successfully!", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error during booking" });
  }
});

/**
 * ROUTE C: DOCTOR DASHBOARD REQUESTS
 * Path: GET /api/consultation/doctor-requests
 * Purpose: Allows practitioners to view all patient requests assigned to them
 */
router.get("/doctor-requests", auth, async (req, res) => {
  try {
    const doctorName = req.query.name; 
    if (!doctorName) return res.status(400).json({ message: "Doctor name required" });

    const baseName = doctorName.replace(/^Dr\.\s+/i, ""); 

    const requests = await Consultation.find({
      $or: [
        { practitioner: doctorName },
        { practitioner: new RegExp(baseName, 'i') }
      ]
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests" });
  }
});

/**
 * ROUTE D: MY BOOKINGS (PATIENT)
 * Path: GET /api/consultation/my-bookings
 * Purpose: Enables patients to see their personal appointment history
 */
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Consultation.find({ userId: req.userId || req.user?.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

/**
 * ROUTE E: UPDATE STATUS
 * Path: PUT /api/consultation/update-status/:id
 * Purpose: Updates the appointment lifecycle (e.g., Confirmed or Rejected)
 */
router.put("/update-status/:id", auth, async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) { res.status(500).send(err); }
});

/**
 * ROUTE F: UPDATE PRESCRIPTION & COMPLETE
 * Path: PUT /api/consultation/update-prescription/:id
 * Purpose: Finalizes the consultation with medicines, lifestyle tips, and clinical notes
 */
router.put("/update-prescription/:id", auth, async (req, res) => {
  try {
    const { medicines, lifestyle, notes, status } = req.body;
    const updated = await Consultation.findByIdAndUpdate(
      req.params.id,
      { medicines, lifestyle, notes, status: status || "Completed" },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving prescription" });
  }
});

module.exports = router;