const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Consultation = require("../models/Consultation");
const auth = require("../middleware/auth");

if (!fs.existsSync("uploads/")) {
  fs.mkdirSync("uploads/");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/"); },
  filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage: storage });

// --- FETCH DOCTOR REQUESTS (FIXED FOR PREFIX MISMATCH) ---
router.get("/doctor-requests", auth, async (req, res) => {
  try {
    const doctorName = req.query.name; 
    if (!doctorName) return res.status(400).json({ message: "Doctor name required" });

    const baseName = doctorName.replace(/^Dr\.\s+/i, ""); 

    const requests = await Consultation.find({
      $or: [
        { practitioner: doctorName },
        { practitioner: baseName },
        { practitioner: new RegExp(baseName, 'i') }
      ]
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Doctor fetch error:", err);
    res.status(500).json({ message: "Error fetching requests" });
  }
});

// --- A. SMART FETCH: Busy Slots ---
router.get("/busy-slots", async (req, res) => {
  try {
    const { practitioner, date } = req.query; 
    if (!practitioner || !date) return res.json([]);

    const parts = date.split('-'); 
    const altDate = `${parts[1]}/${parts[2]}/${parts[0]}`; 
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const busyBookings = await Consultation.find({
      practitioner: practitioner,
      $or: [{ date: date }, { date: altDate }],
      $or: [
        { status: { $in: ["Confirmed", "Completed"] } }, 
        { status: "Reserved", createdAt: { $gte: twentyFourHoursAgo } } 
      ]
    }).select("time");

    const busyTimes = busyBookings.map(b => b.time.trim());
    res.json(busyTimes);
  } catch (err) {
    res.status(500).json([]);
  }
});

// --- B. Book a Consultation ---
router.post("/", auth, upload.single("report"), async (req, res) => {
  try {
    const { date, time, practitioner } = req.body;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existingSlot = await Consultation.findOne({
      practitioner,
      date,
      time,
      $or: [
        { status: { $in: ["Confirmed", "Completed"] } },
        { status: "Reserved", createdAt: { $gte: twentyFourHoursAgo } }
      ]
    });

    if (existingSlot) {
      return res.status(400).json({ message: "This slot is currently unavailable." });
    }

    const newBooking = new Consultation({
      ...req.body,
      userId: req.userId || req.user?.id,
      reportFile: req.file ? req.file.path : null,
      status: "Reserved",
      createdAt: new Date()
    });

    await newBooking.save();
    res.status(201).json({ message: "Slot reserved!", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- C. My Bookings (For Patient) ---
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Consultation.find({ userId: req.userId || req.user?.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// --- D. Update Status (General) ---
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

// --- E. UPDATE PRESCRIPTION & COMPLETE (NEW ROUTE) ---
router.put("/update-prescription/:id", auth, async (req, res) => {
  try {
    const { medicines, lifestyle, notes, status } = req.body;
    const updated = await Consultation.findByIdAndUpdate(
      req.params.id,
      { 
        medicines, 
        lifestyle, 
        notes, 
        status: status || "Completed" 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    res.json({ success: true, message: "Prescription updated successfully!", data: updated });
  } catch (err) {
    console.error("Prescription Save Error:", err);
    res.status(500).json({ success: false, message: "Server error saving prescription" });
  }
});

module.exports = router;