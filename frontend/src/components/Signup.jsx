import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // Ensure file exists at this path

const API = "http://localhost:5000";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/signup`, formData);
      alert("Account created successfully! Please login. 🎉");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error creating account ❌";
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div 
        className="auth-hero-section" 
        style={{ backgroundImage: "url('/images/Login img.png')" }}
      >
        <div className="auth-hero-content">
          <div className="hero-top-group">
            {/* --- FIXED: Class names updated to match CSS --- */}
            <div className="auth-logo-brand">
              <img src="/images/logo.jpeg" alt="Logo" className="auth-logo-img" />
              <span>AyurSage</span>
            </div>
            
            <h1 className="hero-title">
              AyurSage <br />
              <span className="hero-subtitle-main">Start Your Journey.</span>
            </h1>
            
            <p className="hero-description">
              Discover your Prakriti and balance your life with personalized Ayurvedic insights.
            </p>

            <ul className="hero-bullets">
              <li>• Personalized Dosha Analysis</li>
              <li>• Book Certified Practitioners</li>
              <li>• Access Ancient Wisdom</li>
            </ul>
          </div>

          {/* --- FIXED: Class names updated to match CSS --- */}
          <div className="hero-stats-cards-container">
            <div className="stat-card-glass"><h3>5,000+</h3><p>Seekers</p></div>
            <div className="stat-card-glass"><h3>98%</h3><p>Accuracy</p></div>
            <div className="stat-card-glass"><h3>50+</h3><p>Experts</p></div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-wrapper">
          {/* --- FIXED: Class names updated to match CSS --- */}
          <div className="auth-toggle-bar">
            <button onClick={() => navigate("/login")} className="toggle-btn">Sign In</button>
            <button className="toggle-btn active">Sign Up</button>
          </div>

          <div className="form-header">
            <h2 className="welcome-title">Create Account</h2>
            <p className="form-subtitle">Join us to start your wellness journey</p>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="input-field">
              <label>Full Name</label>
              <input 
                type="text" placeholder="Your Name" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="input-field">
              <label>Email</label>
              <input 
                type="email" placeholder="your@email.com" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="input-field">
              <label>Password</label>
              <input 
                type="password" placeholder="••••••••" required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button type="submit" className="main-button">Create Account →</button>
          </form>

          <p className="footer-link">
            Already have an account? <Link to="/login" className="signup-link">Sign In</Link>
          </p>
          <Link to="/" className="back-portal-link">
            ← Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}