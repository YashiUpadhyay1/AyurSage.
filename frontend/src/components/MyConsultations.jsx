import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Ayurnavbar from "./Ayurnavbar"; 
import "../style.css"; 
import "../styles/Auth.css"; 

/**
 * Production Backend URL on Render
 */
const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function MyConsultations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 

  const [showRxModal, setShowRxModal] = useState(false);
  const [selectedRx, setSelectedRx] = useState(null);

  useEffect(() => {
    // Sync User data for Ayurnavbar
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("User sync error", e);
      }
    }

    // Fetch user-specific bookings from live server
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/consultation/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setHistory(prev => (Array.isArray(prev) ? prev : []));
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openPrescription = (booking) => {
    setSelectedRx(booking);
    setShowRxModal(true);
  };

  /**
   * Resolve live file URLs for uploaded medical reports
   */
  const getFileUrl = (path) => {
    if (!path) return "#";
    const cleanPath = path.replace(/\\/g, '/');
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <div className="home-page-wrapper" style={{ background: '#022417', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <div style={{ padding: '120px 10% 60px 10%', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 className="hero-title" style={{ fontSize: '3.5rem', color: 'white', margin: 0 }}>
            Booked <span style={{ color: '#FFD700' }}>Sessions</span>
          </h1>
          <p style={{ color: '#FFD700', letterSpacing: '2px', fontSize: '0.8rem', marginTop: '10px', opacity: 0.8 }}>
            UPCOMING APPOINTMENTS • SYNCED RECORDS
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: "white", fontSize: '1.2rem' }}>Syncing Records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="dashboard-row-item" style={{ textAlign: 'center', padding: '80px' }}>
            <p style={{ color: 'white', opacity: 0.6 }}>No appointments found in your history.</p>
            <button className="main-button" style={{ width: '200px', marginTop: '20px' }} onClick={() => navigate("/consultation")}>Book Now</button>
          </div>
        ) : (
          <div className="dashboard-list-scroll">
            {history.map((booking) => (
              <div key={booking._id} className="dashboard-row-item" style={{ 
                borderLeft: booking.status === "Completed" ? '6px solid #FFD700' : 
                          booking.status === "Confirmed" ? '6px solid #A7FF83' : 
                          booking.status === "Rejected" ? '6px solid #ff4d4d' : '6px solid #555'
              }}>
                <div className="dash-meta-grid" style={{ gridTemplateColumns: '1.1fr 1.3fr 0.9fr 0.8fr 0.8fr 1.1fr' }}>
                  <div className="dash-item">
                    <span>Practitioner</span>
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>Dr. {booking.practitioner}</p>
                  </div>
                  <div className="dash-item">
                    <span>Date & Slot</span>
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.date} | {booking.time}</p>
                  </div>
                  <div className="dash-item">
                    <span>Diagnosis</span>
                    <p className="text-diagnosis-highlight" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.predictedDisease || "General"}</p>
                  </div>
                  <div className="dash-item">
                    <span>Status</span>
                    <p style={{ 
                        color: booking.status === "Completed" ? "#FFD700" : 
                               booking.status === "Confirmed" ? "#A7FF83" : 
                               booking.status === "Rejected" ? "#ff4d4d" : "white", 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem' 
                    }}>
                        {booking.status}
                    </p>
                  </div>
                  <div className="dash-item">
                    <span>RECORDS</span>
                    {booking.reportFile ? (
                      <button 
                        className="main-button" 
                        style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: 'auto', marginTop: '5px' }}
                        onClick={() => window.open(getFileUrl(booking.reportFile), "_blank")}
                      >
                        View File
                      </button>
                    ) : (
                      <p style={{ color: 'white', opacity: 0.5, margin: '5px 0', fontSize: '0.9rem' }}>None</p>
                    )}
                  </div>
                  <div className="dash-item">
                    <span>PRESCRIPTION</span>
                    {booking.status === "Completed" ? (
                      <button 
                        className="main-button" 
                        style={{ 
                          padding: '6px 15px', 
                          fontSize: '0.75rem', 
                          background: 'rgba(255, 215, 0, 0.1)', 
                          border: '1px solid #FFD700', 
                          color: '#FFD700', 
                          width: 'auto', 
                          marginTop: '5px',
                          whiteSpace: 'nowrap' 
                        }}
                        onClick={() => openPrescription(booking)}
                      >
                        View Prescription
                      </button>
                    ) : (
                      <p style={{ color: 'white', opacity: 0.5, margin: '5px 0', fontSize: '0.9rem' }}>Pending</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Modal Display */}
      {showRxModal && selectedRx && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ 
            background: '#0a2113', 
            border: '2px solid #FFD700', 
            maxWidth: '700px', 
            padding: '0', 
            textAlign: 'left',
            maxHeight: '85vh', 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' 
          }}>
            <div style={{ 
              padding: '30px 40px 20px 40px', 
              borderBottom: '1px solid rgba(255,255,255,0.1)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexShrink: 0 
            }}>
                <h2 style={{ color: '#FFD700', margin: 0 }}>Doctor's Prescription</h2>
                <button onClick={() => setShowRxModal(false)} style={{background: 'none', border: 'none', color: '#FFD700', fontSize: '2rem', cursor: 'pointer', lineHeight: '1'}}>×</button>
            </div>

            <div style={{ 
              padding: '20px 40px', 
              overflowY: 'auto', 
              flexGrow: 1 
            }}>
                <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <p style={{ color: 'white' }}><strong>Doctor:</strong> Dr. {selectedRx.practitioner}</p>
                    <p style={{ color: '#A7FF83' }}><strong>Condition:</strong> {selectedRx.predictedDisease || "General Imbalance"}</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>MEDICINES & DOSAGE</label>
                    <div style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'pre-line' }}>
                        {selectedRx.medicines || "No medicines recorded."}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>DIET & LIFESTYLE ADVICE</label>
                    <div style={{ color: 'white', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'pre-line' }}>
                        {selectedRx.lifestyle || "Standard Ayurvedic advice provided."}
                    </div>
                </div>

                {selectedRx.notes && (
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>ADDITIONAL NOTES</label>
                        <p style={{ color: 'white', fontStyle: 'italic', opacity: 0.8 }}>{selectedRx.notes}</p>
                    </div>
                )}
            </div>

            <div style={{ 
              padding: '20px 40px 30px 40px', 
              textAlign: 'right', 
              borderTop: '1px solid rgba(255,255,255,0.05)',
              flexShrink: 0 
            }}>
              <button className="main-button" style={{ width: '120px', background: '#FFD700', color: '#022417', fontWeight: 'bold' }} onClick={() => setShowRxModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}