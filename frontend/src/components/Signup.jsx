import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../style.css";

const API = "http://localhost:5000";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/Signup`, formData);
      alert("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Error creating account ❌");
    }
  };

  return (
    <div className="auth-container">
      <div 
        className="hero-section" 
        style={{ backgroundImage: "url('/images/Login img.png')" }}
      >
        <div className="hero-content">
          <div className="hero-top-group">
            <div className="logo-area">
              <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
              <span className="brand-name">AyurSage</span>
            </div>
            
            <h1 className="hero-title">
              AyurSage <br />
              <span className="hero-subtitle">Start Your Journey.</span>
            </h1>
            
            <p className="hero-description">
              Discover your Prakriti and balance your life with personalized Ayurvedic insights.
            </p>

            <ul className="hero-features-list">
              <li>• Personalized Dosha Analysis</li>
              <li>• Book Certified Practitioners</li>
              <li>• Access Ancient Wisdom</li>
            </ul>
          </div>

          <div className="stats-row">
            <div className="stat-card"><strong>5,000+</strong><br/>Seekers</div>
            <div className="stat-card"><strong>98%</strong><br/>Accuracy</div>
            <div className="stat-card"><strong>50+</strong><br/>Experts</div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-wrapper">
          <div className="auth-toggle">
            <button onClick={() => navigate("/login")} className="toggle-btn">Sign In</button>
            <button className="toggle-btn active">Sign Up</button>
          </div>

          <div className="form-header">
            <h2 className="welcome-title">Create Account</h2>
            <p className="welcome-subtitle">Join us to start your wellness journey</p>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="input-field">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Your Name" 
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="input-field">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="main-button">Create Account →</button>
          </form>

          <p className="footer-link">
            Already have an account? <Link to="/login" className="signup-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}