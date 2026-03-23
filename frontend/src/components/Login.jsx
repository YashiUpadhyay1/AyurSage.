import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../style.css";

const API = "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, data);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert("Invalid email or password ❌");
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
              <span className="hero-subtitle">Balance Your Wellness.</span>
            </h1>
            
            <p className="hero-description">
              Begin your personalized Ayurvedic journey based on Dosha & Prakriti insights.
            </p>

            <ul className="hero-features-list">
              <li>• 30-question Prakriti constitution test</li>
              <li>• Book certified Ayurvedic practitioners</li>
              <li>• Verified Ayurvedic texts</li>
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
            <button className="toggle-btn active">Sign In</button>
            <button onClick={() => navigate("/signup")} className="toggle-btn">Sign Up</button>
          </div>

          <div className="form-header">
            <h2 className="welcome-title">Welcome back</h2>
            <p className="welcome-subtitle">Join us to start your wellness journey</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-field">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="main-button">Sign In →</button>
          </form>

          <p className="footer-link">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}