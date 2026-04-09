const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");
const doshaRoutes = require("./routes/dosha");
const consultationRoutes = require("./routes/consultation");
const mlRoutes = require("./routes/mlRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static Folder Serving for Reports
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/dosha", doshaRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/ml", mlRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// --- FIXED SIGNUP ROUTE ---
app.post("/signup", async (req, res) => {
  // Extracting role and licenseNumber from request body
  const { name, email, password, role, licenseNumber } = req.body;
  
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    
    // Creating user with explicit role and license
    await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: role || "user", // Default to user if not provided
      licenseNumber: role === "doctor" ? licenseNumber : undefined 
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error during signup" });
  }
});

// --- FIXED LOGIN ROUTE ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  // Adding role in JWT token and response
  const token = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" }
  );

  res.json({ 
    message: "Login successful", 
    token, 
    user: { 
      name: user.name, 
      email: user.email,
      role: user.role // Extremely important for frontend navigation
    } 
  });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on PORT 5000");
});