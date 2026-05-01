import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

/**
 * Production API endpoint
 */
const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    role: "user" 
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      /**
       * Execute account creation request against the live production server
       */
      await axios.post(`${API_BASE_URL}/signup`, formData);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div className="auth-container">
      {/* Visual Identity Section */}
      <div className="auth-hero-section" style={{ backgroundImage: "url('/images/Login img.png')" }}>
        <div className="auth-hero-content">
          <div className="hero-top-group">
            <div className="auth-logo-brand">
              <img src="/images/logo.jpeg" alt="Logo" className="auth-logo-img" />
              <span>AyurSage</span>
            </div>
            <h1 className="hero-title">AyurSage <br /><span className="hero-subtitle-main">Start Your Journey.</span></h1>
            <p className="hero-description">Secure your health data today and receive personalized Ayurvedic insights.</p>
          </div>
          <div className="hero-stats-cards-container">
            <div className="stat-card-glass"><h3>5,000+</h3><p>Seekers</p></div>
            <div className="stat-card-glass"><h3>98%</h3><p>Accuracy</p></div>
            <div className="stat-card-glass"><h3>50+</h3><p>Experts</p></div>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="form-section">
        <div className="form-wrapper">
          <div className="auth-toggle-bar" style={{ marginTop: '10px', marginBottom: '15px' }}>
            <button onClick={() => navigate("/login")} className="toggle-btn">Sign In</button>
            <button className="toggle-btn active">Sign Up</button>
          </div>

          <div className="form-header" style={{ marginBottom: '5px' }}>
            <h2 className="welcome-title" style={{ margin: '0' }}>Create Account</h2>
            <p className="form-subtitle" style={{ margin: '0', fontSize: '0.8rem' }}>Fill in your health vitals to register</p>
          </div>

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div className="input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '2px' }}>FULL NAME</label>
              <input 
                type="text" placeholder="Your Name" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ padding: '8px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '2px' }}>EMAIL ADDRESS</label>
              <input 
                type="email" placeholder="your@email.com" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '8px', fontSize: '0.85rem' }}
              />
            </div>

            <div className="dr-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="input-field">
                <label style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '2px' }}>DATE OF BIRTH</label>
                <input 
                  type="date" required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  style={{ padding: '8px', fontSize: '0.85rem' }}
                />
              </div>
              <div className="input-field">
                <label style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '2px' }}>GENDER</label>
                <select 
                  required value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="auth-select"
                  style={{ padding: '8px', fontSize: '0.85rem' }}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '2px' }}>BLOOD GROUP</label>
              <select 
                required value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="auth-select"
                style={{ padding: '8px', fontSize: '0.85rem' }}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>

            <div className="input-field">
              <label style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '2px' }}>PASSWORD</label>
              <input 
                type="password" placeholder="********" required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ padding: '8px', fontSize: '0.85rem' }}
              />
            </div>

            <button type="submit" className="main-button" style={{ marginTop: '10px', padding: '12px' }}>
              Create Account &rarr;
            </button>
          </form>

          <p className="footer-link" style={{ marginTop: '10px', fontSize: '0.85rem', textAlign: 'center' }}>
            Already have an account? <Link to="/login" className="signup-link">Sign In &rarr;</Link>
          </p>

          <Link to="/" className="back-portal-link" style={{ fontSize: '0.75rem', display: 'block', textAlign: 'center', marginTop: '10px', color: '#888', textDecoration: 'none' }}>
            &larr; Back to Selection Portal
          </Link>
        </div>
      </div>
    </div>
  );
}