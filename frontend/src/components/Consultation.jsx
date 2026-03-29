import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../style.css";

export default function Consultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedRefIndex, setSelectedRefIndex] = useState("");

   const isActive = (path) => location.pathname === path;

   const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/dosha", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data ? res.data.reverse() : []);
      } catch (err) { console.error("History Fetch Error:", err); }
    };
    fetchHistory();
  }, []);

  const handleBookClick = (expert) => {
    setSelectedExpert(expert);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedSlot || selectedRefIndex === "") {
      alert("Please select Date, Time, and a valid Reference ID.");
      return;
    }

    const token = localStorage.getItem("token");
    const report = history[selectedRefIndex];
    const actualRefId = history.length - selectedRefIndex;

    const dataToSave = {
      practitioner: selectedExpert.name,
      concern: `Ref #${actualRefId}: ${report.result}`,
      name: "User",
      date: selectedDate,
      time: selectedSlot
    };

    try {
      await axios.post("http://localhost:5000/api/consultation", dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      navigate("/my-consultations");
    } catch (err) { console.error("Booking Error:", err); }
  };

  const practitioners = [
    { id: 1, name: "Ananya Sharma", specialty: "Pancha Karma", fee: "800" },
    { id: 2, name: "Vikram Mehra", specialty: "Nadi Pariksha", fee: "1200" },
    { id: 3, name: "Kavita Iyer", specialty: "Nutritionist", fee: "600" }
  ];

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
        <div className="about-content-wrapper">
          <header className="about-header-simple">
            <h1 className="rx-main-title">Ayurvedic Experts</h1>
            <p className="vision-tag-gold" style={{ letterSpacing: '3px' }}>
              CERTIFIED PRACTITIONERS • SELECT YOUR HEALER
            </p>
          </header>

          <div className="dashboard-list-scroll">
            {practitioners.map((expert) => (
              <div key={expert.id} className="dashboard-row-item">
                <div className="dash-meta-grid">
                  <div className="dash-item">
                    <span>Expert ID</span>
                    <p style={{ color: '#FFD700', fontWeight: '700' }}>#{expert.id}</p>
                  </div>
                  <div className="dash-item">
                    <span>Practitioner</span>
                    <p style={{ fontWeight: '600' }}>{expert.name}</p>
                  </div>
                  <div className="dash-item">
                    <span>Specialization</span>
                    <p className="text-diagnosis-highlight">{expert.specialty}</p>
                  </div>
                  <div className="dash-item">
                    <span>Fee</span>
                    <p style={{ color: '#FF9933', fontWeight: '700' }}>₹{expert.fee}</p>
                  </div>
                  <div className="dash-item">
                    <span>Available</span>
                    <p>10 AM - 5 PM</p>
                  </div>
                  <div className="dash-item-btn">
                    <button
                      className="parrot-outline-btn"
                      style={{ borderRadius: '50px', padding: '10px 30px' }}
                      onClick={() => handleBookClick(expert)}
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '35px' }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>Schedule Slot</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-field-wrapper">
                <label>Date</label>
                <input
                  type="date"
                  className="custom-input"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="input-field-wrapper">
                <label>Time Slot</label>
                <select className="custom-select" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                  <option value="">Choose</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
              </div>
            </div>
            <div className="input-field-wrapper" style={{ marginTop: '20px' }}>
              <label>Link History (Available Ref IDs)</label>
              <select
                className="custom-select"
                value={selectedRefIndex}
                onChange={(e) => setSelectedRefIndex(e.target.value)}
              >
                <option value="">Select Reference ID</option>
                {history.map((h, i) => (
                  <option key={i} value={i}>
                    Ref #{history.length - i} — ({h.result})
                  </option>
                ))}
                {history.length === 0 && <option value="">No history found</option>}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button className="logout-btn-light" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="parrot-action-btn-large" style={{ flex: 2, padding: '12px' }} onClick={confirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
