import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css"; 

/**
 * Production API endpoint
 */
const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  /**
   * Redirect users if a valid session token already exists
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      role === "doctor" ? navigate("/doctor-dashboard") : navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      /**
       * Authenticate against the live production server
       */
      const res = await axios.post(`${API_BASE_URL}/login`, data);
      const { token, user } = res.data;

      // Persistence: Session Data
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);

      // Persistence: User Profile Details
      localStorage.setItem("userGender", user.gender || "Not Specified");
      localStorage.setItem("userBloodGroup", user.bloodGroup || "N/A");

      // Sync the complete user object for global access
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");

      /**
       * Execute role-based navigation logic
       */
      if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/home");
      }
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid email or password";
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
            <div className="auth-logo-brand">
              <img src="/images/logo.jpeg" alt="Logo" className="auth-logo-img" />
              <span>AyurSage</span>
            </div>
            
            <h1 className="hero-title">
              AyurSage <br />
              <span className="hero-subtitle-main">Balance Your Wellness.</span>
            </h1>
            
            <p className="hero-description">
              Begin your personalized Ayurvedic journey based on Dosha and Prakriti insights.
            </p>

            <ul className="hero-bullets">
              <li>• 30-question Prakriti constitution test</li>
              <li>• Book certified Ayurvedic practitioners</li>
              <li>• Verified Ayurvedic texts</li>
            </ul>
          </div>

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
            <button className="toggle-btn active">Sign In</button>
            <button onClick={() => navigate("/signup")} className="toggle-btn">Sign Up</button>
          </div>

          <div className="form-header">
            <h2 className="welcome-title">Welcome back</h2>
            <p className="form-subtitle">Join us to start your wellness journey</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-field">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="input-field">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="********" 
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <button type="submit" className="main-button">Sign In </button>
          </form>

          <p className="footer-link">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up &rarr;</Link>
          </p>
          <Link to="/" className="back-portal-link">
            &larr; Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}