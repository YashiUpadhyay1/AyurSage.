import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../style.css";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="home-page-wrapper">
      {/* Universal Navigation Bar */}
      <nav className="home-nav-dark" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div className="logo-area" onClick={() => navigate("/home")}>
          <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
          <span className="brand-name-light">AyurSage</span>
        </div>

        <div className="nav-center-links">
          <Link to="/home" className={`nav-box ${isActive("/home") ? "active" : ""}`}>Home</Link>
          <Link to="/predict-prakriti" className={`nav-box ${isActive("/predict-prakriti") ? "active" : ""}`}>Prakriti</Link>
          <Link to="/predict-dosha" className={`nav-box ${isActive("/predict-dosha") ? "active" : ""}`}>Dosha</Link>
          <Link to="/consultation" className={`nav-box ${isActive("/consultation") ? "active" : ""}`}>Consultations</Link>
          <Link to="/dashboard" className={`nav-box ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
          <Link to="/my-consultations" className={`nav-box ${isActive("/my-consultations") ? "active" : ""}`}>Booked</Link>
          <Link to="/about" className={`nav-box ${isActive("/about") ? "active" : ""}`}>About Us</Link>
        </div>

        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn-light">Logout</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="home-hero-dark">
        <div className="hero-content-box">
          <p className="section-tag">OUR MISSION</p>
          <h1 className="hero-main-title">
            Making Ayurveda <br />
            <span className="hero-accent-text">accessible to all</span>
          </h1>
          <p className="hero-para">
            We combine intelligent digital assessments with clinical expertise to help every person achieve lasting balance.
          </p>
          <button className="parrot-action-btn" onClick={() => navigate("/predict-dosha")}>
            Start Your Assessment →
          </button>
        </div>
        <div className="hero-visual">
          <img src="/images/Tridosha Diagram.png" alt="Ayurveda Balance" className="tridosha-frame" />
        </div>
      </header>

      {/* Service Grid Section */}
      <section className="services-section-dark">
        <div className="services-grid">
          <div className="service-card-premium">
            <div className="card-indicator"></div>
            <h3>Predict Prakriti</h3>
            <p>Discover your innate body constitution through our comprehensive assessment.</p>
            <button className="parrot-outline-btn" onClick={() => navigate("/predict-prakriti")}>Discover</button>
          </div>

          <div className="service-card-premium">
            <div className="card-indicator"></div>
            <h3>Predict Dosha</h3>
            <p>Identify potential imbalances in your current lifestyle and health factors.</p>
            <button className="parrot-outline-btn" onClick={() => navigate("/predict-dosha")}>Check Now</button>
          </div>

          <div className="service-card-premium">
            <div className="card-indicator"></div>
            <h3>Expert Consultation</h3>
            <p>Connect with certified Ayurvedic practitioners for personalized guidance.</p>
            <button className="parrot-outline-btn" onClick={() => navigate("/consultation")}>Book Now</button>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="principles-section-dark">
        <p className="section-tag">CORE PRINCIPLES</p>
        <h2 className="principles-title">What we stand for</h2>
        <div className="principles-container">
          <div className="principle-block">
            <span className="step-number">01</span>
            <h4>Authentic Knowledge</h4>
            <p>Rooted in classical texts like Charaka Samhita and validated by experts.</p>
          </div>
          <div className="principle-block">
            <span className="step-number">02</span>
            <h4>Intelligent Assessment</h4>
            <p>Advanced pattern recognition to determine states with clinical precision.</p>
          </div>
          <div className="principle-block">
            <span className="step-number">03</span>
            <h4>Expert Guidance</h4>
            <p>Network of vetted physicians bringing decades of clinical experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
}