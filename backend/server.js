// Import core dependencies
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

// Load environment variables
require("dotenv").config();

// --- MODELS ---
const User = require("./models/User");

// --- ROUTES ---
const doshaRoutes = require("./routes/dosha");
const consultationRoutes = require("./routes/consultation");
const mlRoutes = require("./routes/mlRoutes");
const assessmentRoutes = require("./routes/assessment");

const app = express();

// --- [CRITICAL FIX: SIMPLIFIED CORS FOR NODE v24] ---
const corsOptions = {
  origin: "https://ayursage.vercel.app", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204 
};

// Apply CORS middleware first - handles preflight automatically
app.use(cors(corsOptions));

// JSON parser must come AFTER CORS
app.use(express.json());

// --- FILE SERVING ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROUTES MOUNTING ---
app.use("/api/dosha", doshaRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/assessment", assessmentRoutes);

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// --- AUTHENTICATION ROUTES ---
app.post("/signup", async (req, res) => {
  const { name, email, password, role, licenseNumber, bloodGroup, gender, dob } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ 
      name, email, password: hashed, role: role || "user", dob, bloodGroup, gender,
      licenseNumber: role === "doctor" ? licenseNumber : undefined 
    });
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message || "Error during signup" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.json({ 
      message: "Login successful", token, 
      user: { name: user.name, email: user.email, role: user.role, gender: user.gender, bloodGroup: user.bloodGroup } 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});