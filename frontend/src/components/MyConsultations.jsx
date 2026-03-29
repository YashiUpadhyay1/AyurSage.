import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../style.css";

export default function MyConsultations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/consultation", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-page-wrapper">
      <nav className="home-nav-dark">
        {/* Navbar Same As Above */}
        <div className="nav-center-links">
          <Link to="/home" className={`nav-box ${isActive("/home") ? "active" : ""}`}>Home</Link>
          <Link to="/dashboard" className={`nav-box ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn-light">Logout</button>
        </div>
      </nav>

      <div className="about-direct-layout" style={{ backgroundImage: "url('/images/Login img.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', padding: '140px 5% 80px 5%', boxSizing: 'border-box' }}>
        <div className="about-content-wrapper">
          <header className="about-header-simple">
            <h1 className="rx-main-title">Booked <span className="text-gold">Sessions</span></h1>
            <p className="vision-tag-gold">UPCOMING APPOINTMENTS • SYNCED RECORDS</p>
          </header>

          {loading ? (
            <p className="mission-para-light-blue" style={{ fontSize: '1.2rem' }}>Syncing Appointments...</p>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p className="about-para-large">No sessions found.</p>
              <button className="parrot-action-btn-large" onClick={() => navigate("/consultation")}>Book One Now</button>
            </div>
          ) : (
            <div className="dashboard-list-scroll">
              {history.map((booking, index) => (
                <div key={index} className="dashboard-row-item" style={{ borderLeft: '4px solid #A7FF83' }}>
                  <div className="dash-meta-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1.2fr 0.8fr' }}>
                    <div className="dash-item"><span>Practitioner</span><p className="title-white">{booking.practitioner}</p></div>
                    <div className="dash-item"><span>Booking Date</span><p>{booking.date}</p></div>
                    <div className="dash-item"><span>Specialty/Concern</span><p className="text-diagnosis-highlight">{booking.concern}</p></div>
                    <div className="dash-item"><span>Status</span><p className="text-mint">Confirmed ✓</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}