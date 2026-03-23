import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../style.css";

export default function About() {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight active link in navbar
  const isActive = (path) => location.pathname === path;

  // Clear session and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-page-wrapper">
      
      {/* Universal Capsule Navigation Bar */}
      <nav className="home-nav-dark">
        {/* Brand Logo & Name */}
        <div className="logo-area" onClick={() => navigate("/home")}>
          <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
          <span className="brand-name-light">AyurSage</span>
        </div>

        {/* Centered Route Links */}
        <div className="nav-center-links">
          <Link to="/home" className={`nav-box ${isActive("/home") ? "active" : ""}`}>Home</Link>
          <Link to="/predict-prakriti" className={`nav-box ${isActive("/predict-prakriti") ? "active" : ""}`}>Prakriti</Link>
          <Link to="/predict-dosha" className={`nav-box ${isActive("/predict-dosha") ? "active" : ""}`}>Dosha</Link>
          <Link to="/consultation" className={`nav-box ${isActive("/consultation") ? "active" : ""}`}>Consultations</Link>
          <Link to="/dashboard" className={`nav-box ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
          <Link to="/my-consultations" className={`nav-box ${isActive("/my-consultations") ? "active" : ""}`}>Booked</Link>
          <Link to="/about" className={`nav-box ${isActive("/about") ? "active" : ""}`}>About Us</Link>
        </div>

        {/* Right Side Actions */}
        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn-light">Logout</button>
        </div>
      </nav>

      {/* Background Wrapper: Manages Image, Fixed Scroll, & Top Padding */}
      <div 
        className="about-direct-layout" 
        style={{ 
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '100px 5% 80px 5%', 
          boxSizing: 'border-box'
        }}
      >
        {/* Main Content Container */}
        <div className="about-content-wrapper">
          
          {/* Section Heading */}
          <header className="about-header-simple">
            <h1 className="rx-main-title">Our Vision</h1>
            <p className="vision-tag-gold">ANCIENT WISDOM • DIGITAL PRECISION</p>
          </header>

          {/* Grid Layout: Main text and Sidebar list */}
          <div className="about-grid-direct">
            
            {/* Branding & Introduction */}
            <div className="about-text-main">
              <h2 className="rx-main-title">
                <span style={{color: '#ffffff'}}>Empowering Wellness Through</span> <br /> 
                <span className="text-mint">Nature</span> & <span className="text-saffron">Intelligence</span>
              </h2>
              <p className="about-para-large">
                AyurSage is a <span className="text-white-bold">personalized wellness sanctuary</span> merging Ayurveda with the digital age.
              </p>
              <p className="about-para-large">
                We combine Vedic wisdom with <span className="text-mint">modern analytics</span> to balance mind, body, and spirit.
              </p>
            </div>
            
            {/* Key Features Sidebar */}
            <aside className="about-edge-list">
              <h3 className="edge-title-advantage">The AyurSage Advantage</h3>
              <ul className="clean-list-white-dots">
                <li>Authentic Vedic Principles</li>
                <li>Precision Constitution Mapping</li>
                <li>Secure Personal Health Insights</li>
                <li>Expert Ayurvedic Guidance</li>
              </ul>
            </aside>
          </div>

          {/* Footer: Mission Statement & Call to Action */}
          <footer className="about-mission-footer">
            <h1 className="rx-main-title">Our Mission</h1>
            <p className="mission-para-light-blue">
              "To inspire a global movement of self-healing by reconnecting individuals with their innate nature."
            </p>
            <button className="parrot-action-btn-large" onClick={() => navigate("/predict-prakriti")}>
                Begin Your Transformation →
            </button>
          </footer>

        </div>
      </div>
    </div>
  );
}