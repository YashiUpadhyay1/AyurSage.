import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function DrSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", license: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIXED: Sending explicit role 'doctor'
      await axios.post("http://localhost:5000/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        licenseNumber: formData.license,
        role: "doctor" // This ensures the DB saves it as a doctor
      });
      
      alert("Practitioner Registration Successful!");
      navigate("/drlogin");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-hero-section" style={{ backgroundImage: "url('/images/Login img.png')" }}>
        <div className="auth-hero-content">
          <div className="auth-logo-brand">
            <img src="/images/logo.jpeg" alt="Logo" className="auth-logo-img" />
            <span>AyurSage</span>
          </div>
          <h1 className="hero-title">AyurSage</h1>
          <h1 className="hero-subtitle-main">Expert Portal.</h1>
          <p className="hero-description">Join the global network of certified Ayurvedic practitioners and provide ancient healing through modern technology.</p>
          <div className="hero-stats-cards-container">
            <div className="stat-card-glass"><h3>5,000+</h3><p>Seekers</p></div>
            <div className="stat-card-glass"><h3>98%</h3><p>Accuracy</p></div>
            <div className="stat-card-glass"><h3>50+</h3><p>Experts</p></div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-wrapper">
          <div className="auth-toggle-bar">
            <button className="toggle-btn" onClick={() => navigate("/drlogin")}>Sign In</button>
            <button className="toggle-btn active">Sign Up</button>
          </div>
          <h2 className="welcome-title">Create Account</h2>
          <p className="form-subtitle">Register as a certified healer on AyurSage</p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>FULL NAME</label>
              <input type="text" placeholder="Dr. Agastya Upadhyay" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-field">
              <label>EMAIL ADDRESS</label>
              <input type="email" placeholder="testing11@gmail.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="input-field">
              <label>MEDICAL LICENSE NO.</label>
              <input type="text" placeholder="AYU-0100171" required onChange={(e) => setFormData({...formData, license: e.target.value})} />
            </div>
            <div className="input-field">
              <label>PASSWORD</label>
              <input type="password" placeholder="••••••••" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="main-button">Register Now →</button>
          </form>
          <p className="footer-link">Already an expert? <Link to="/drlogin" className="signup-link">Sign In</Link></p>
          <Link to="/" className="back-portal-link">
            ← Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}