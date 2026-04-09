import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function DrLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      if (res.data.user.role !== "doctor") {
        alert("Access Denied. This is the Practitioner Portal.");
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("userName", res.data.user.name);
      navigate("/doctor-dashboard");
    } catch (err) {
      alert("Invalid Doctor Credentials");
    }
  };

  return (
    <div className="auth-container">
      {/* Left Section - EXACT MATCH TO PATIENT LAYOUT */}
      <div className="auth-hero-section" style={{ backgroundImage: "url('/images/Login img.png')" }}>
        <div className="auth-hero-content">
          <div className="auth-logo-brand">
            <img src="/images/logo.jpeg" alt="Logo" className="auth-logo-img" />
            <span>AyurSage</span>
          </div>
          
          <h1 className="hero-title">AyurSage</h1>
          <h1 className="hero-subtitle-main" style={{color: '#FFD700', fontSize: '2.5rem', fontWeight: 'bold'}}>
            Expert Portal.
          </h1>
          
          <p className="hero-description">
            Manage your clinical practice, review patient cases, and provide ancient healing through modern technology.
          </p>

          <ul className="hero-bullets" style={{color: 'white', opacity: 0.9, listStyle: 'none', padding: 0}}>
            <li>• Access detailed patient Prakriti insights</li>
            <li>• Manage digital health reports & records</li>
            <li>• Verified Ayurvedic Practitioner network</li>
          </ul>

          <div className="hero-stats-cards-container" style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <div className="stat-card-glass"><h3>5,000+</h3><p>Seekers</p></div>
            <div className="stat-card-glass"><h3>98%</h3><p>Accuracy</p></div>
            <div className="stat-card-glass"><h3>50+</h3><p>Experts</p></div>
          </div>
        </div>
      </div>

      {/* Right Section - WITH TOGGLE BAR */}
      <div className="form-section">
        <div className="form-wrapper">
          <div className="auth-toggle-bar">
            <button className="toggle-btn active">Sign In</button>
            <button className="toggle-btn" onClick={() => navigate("/drsignup")}>Sign Up</button>
          </div>

          <h2 className="welcome-title" style={{marginTop: '30px'}}>Welcome back</h2>
          <p className="form-subtitle">Join us to manage your practitioner journey</p>
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-field">
              <label>DOCTOR EMAIL</label>
              <input type="email" placeholder="dr.testing@gmail.com" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-field">
              <label>PASSWORD</label>
              <input type="password" placeholder="••••••••" required onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="main-button">Sign In →</button>
          </form>
          <p className="footer-link">Don't have an account? <Link to="/drsignup" className="signup-link">Sign Up</Link></p>
          <Link to="/" className="back-portal-link">
            ← Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}