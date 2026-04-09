import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; 

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 1. "userName" ya "doctorName" jo bhi aap login ke waqt set kar rahe ho
  const docName = localStorage.getItem("userName"); 

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      // ── UPDATED API CALL ──
      // Humne pichle step mein "doctor-requests" route banaya tha jo query param 'name' leta hai
      const res = await axios.get(`http://localhost:5000/api/consultation/doctor-requests?name=${encodeURIComponent(docName)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) { 
      console.error("Fetch Error:", err); 
      setAppointments([]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    if (!docName) {
      navigate("/drlogin");
    } else {
      fetchAppointments(); 
    }
  }, [docName]);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/consultation/update-status/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert(`Consultation ${newStatus}`);
      fetchAppointments(); 
    } catch (err) {
      alert("Status update failed");
    }
  };

  return (
    <div className="home-page-wrapper" style={{ background: '#022417', minHeight: '100vh', padding: '40px' }}>
      
      {/* --- NAVBAR --- */}
      <nav className="home-nav-dark" style={{ background: 'rgba(2, 36, 23, 0.95)', padding: '10px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px', marginBottom: '20px' }}>
        <div className="auth-logo-brand" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/images/logo.jpeg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {/* Display name handle: Agar docName mein "Dr." nahi hai toh add kar do display ke liye */}
            {docName?.startsWith("Dr.") ? docName : `Dr. ${docName}`}
          </span>
        </div>
        <button onClick={() => { localStorage.clear(); navigate("/"); }} className="logout-btn-light">Logout</button>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div style={{ padding: '20px 0' }}>
        <header style={{ marginBottom: '30px' }}>
            <h1 className="hero-title" style={{ fontSize: '3rem' }}>Doctor <span className="hero-subtitle-main" style={{ color: '#FFD700' }}>Panel</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '10px' }}>Manage appointments, analyze AI diagnosis, and issue digital prescriptions.</p>
        </header>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: "#FFD700", fontSize: '1.2rem' }}>Syncing clinical records...</p>
          </div>
        ) : appointments.length === 0 ? (
            <div className="stat-card-glass" style={{ padding: '80px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                <p style={{ color: '#888', fontSize: '1.1rem' }}>No consultation requests found for your account.</p>
            </div>
        ) : (
          <div className="dashboard-list-scroll">
            {appointments.map((app) => (
              <div key={app._id} className="stat-card-glass" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 0.8fr 1fr 1.5fr 1.5fr 1.2fr', 
                alignItems: 'center', 
                padding: '25px',
                textAlign: 'left',
                marginBottom: '15px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '15px',
                borderLeft: app.status === 'Confirmed' ? '5px solid #A7FF83' : 
                           app.status === 'Reserved' ? '5px solid #FFD700' : 'none'
              }}>
                {/* Patient Info */}
                <div>
                    <span style={{ color: '#FFD700', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.8 }}>PATIENT</span>
                    <h3 style={{color: 'white', margin: '5px 0', fontSize: '1.1rem'}}>{app.name} ({app.age}Y)</h3>
                </div>

                {/* Gender */}
                <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>GENDER</span>
                    <p style={{color: 'white', margin: '5px 0'}}>{app.gender || "N/A"}</p>
                </div>

                {/* AI Predicted Dosha */}
                <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>AI DOSHA</span>
                    <p style={{color: '#FFD700', margin: '5px 0', fontWeight: 'bold'}}>{app.predictedDosha}</p>
                </div>
                
                {/* AI Disease Diagnosis */}
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>AI DIAGNOSIS</span>
                  <p style={{color: '#A7FF83', fontWeight: 'bold', margin: '5px 0'}}>{app.predictedDisease || "General Imbalance"}</p>
                </div>

                {/* Date and Time */}
                <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>DATE & SLOT</span>
                    <p style={{color: 'white', margin: '5px 0'}}>{app.date} | {app.time}</p>
                </div>

                {/* Actions */}
                <div style={{ textAlign: 'right' }}>
                  {app.status === "Reserved" ? (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={() => handleStatusUpdate(app._id, "Confirmed")}
                            className="main-button" 
                            style={{ background: '#A7FF83', color: '#022417', padding: '8px 15px', fontSize: '0.8rem', width: 'auto', borderRadius: '8px' }}
                        >
                            Accept
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate(app._id, "Rejected")}
                            className="main-button" 
                            style={{ background: '#ff4d4d', padding: '8px 15px', fontSize: '0.8rem', width: 'auto', borderRadius: '8px' }}
                        >
                            Reject
                        </button>
                    </div>
                  ) : app.status === "Confirmed" ? (
                    <button 
                      className="main-button" 
                      style={{ fontSize: '0.85rem', padding: '10px 15px', background: '#FFD700', color: '#022417', fontWeight: 'bold', borderRadius: '8px' }}
                      onClick={() => navigate(`/prescription/${app._id}`, { state: { patient: app } })}
                    >
                      Write Prescription
                    </button>
                  ) : (
                     <span style={{ 
                        padding: '6px 15px', 
                        borderRadius: '8px', 
                        fontSize: '0.85rem', 
                        background: app.status === 'Completed' ? 'rgba(167, 255, 131, 0.1)' : 'rgba(255, 77, 77, 0.1)', 
                        color: app.status === 'Completed' ? '#A7FF83' : '#ff4d4d',
                        border: `1px solid ${app.status === 'Completed' ? '#A7FF83' : '#ff4d4d'}`
                     }}>
                        {app.status}
                     </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}