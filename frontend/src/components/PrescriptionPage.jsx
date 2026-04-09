import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

export default function PrescriptionPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const patient = state?.patient;
  
  const docName = localStorage.getItem("userName");
  
  const [prescription, setPrescription] = useState({
    medicines: "",
    lifestyle: "",
    notes: ""
  });

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!patient?._id) {
      alert("Invalid Patient Session. Please try again from Dashboard.");
      return;
    }

    try {
      // Corrected call to /update-prescription/:id
      const response = await axios.put(`http://localhost:5000/api/consultation/update-prescription/${patient._id}`, {
        medicines: prescription.medicines,
        lifestyle: prescription.lifestyle,
        notes: prescription.notes,
        status: "Completed" 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Backend now sends { success: true }
      if (response.data.success) {
        alert(`Prescription successfully sent to ${patient.name}`);
        navigate("/doctor-dashboard");
      }
    } catch (err) {
      console.error("Prescription Save Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving prescription. Check backend console.");
    }
  };

  if (!patient) {
    return (
      <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>
        <h2 style={{color: '#FFD700'}}>Session Expired</h2>
        <p>No patient data found. Please go back to Dashboard.</p>
        <button className="main-button" onClick={() => navigate("/doctor-dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="home-page-wrapper" style={{ background: '#022417', minHeight: '100vh', padding: '60px 10%' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="hero-title" style={{ fontSize: '3rem' }}>
          AyurSage <span style={{ color: '#FFD700' }}>Prescription</span>
        </h1>
        <p className="vision-tag-gold" style={{ letterSpacing: '3px', fontWeight: 'bold' }}>
          OFFICIAL MEDICAL RECORD • DR. {docName?.toUpperCase()}
        </p>
      </div>

      <div className="stat-card-glass" style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid #FFD700', 
        padding: '40px', 
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.5fr 1fr 1.5fr', 
          gap: '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          paddingBottom: '30px', 
          marginBottom: '35px' 
        }}>
          <div>
            <span style={{ color: '#FFD700', fontSize: '0.7rem', letterSpacing: '1px' }}>PATIENT NAME</span>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.3rem', margin: '5px 0' }}>{patient.name}</p>
          </div>
          <div>
            <span style={{ color: '#FFD700', fontSize: '0.7rem', letterSpacing: '1px' }}>AGE / GENDER</span>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: '5px 0' }}>{patient.age}Y / {patient.gender}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#FFD700', fontSize: '0.7rem', letterSpacing: '1px' }}>AI CLINICAL DIAGNOSIS</span>
            <p style={{ color: '#A7FF83', fontWeight: 'bold', fontSize: '1.2rem', margin: '5px 0' }}>
              {patient.predictedDisease || "General Imbalance"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePrescription}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            <div className="input-field">
              <label style={{ color: 'white', marginBottom: '12px', display: 'block', fontWeight: '600' }}>
                AYURVEDIC MEDICINES & DOSAGE (℞)
              </label>
              <textarea 
                required
                rows="5"
                style={{ width: '100%', padding: '20px', borderRadius: '15px', background: '#f8faf9', border: 'none', fontSize: '1rem', outline: 'none', color: '#022417' }}
                placeholder="Ex: Triphala Churna - 1 tsp with lukewarm water after dinner."
                value={prescription.medicines}
                onChange={(e) => setPrescription({...prescription, medicines: e.target.value})}
              ></textarea>
            </div>

            <div className="input-field">
              <label style={{ color: 'white', marginBottom: '12px', display: 'block', fontWeight: '600' }}>
                DIET & LIFESTYLE RECOMMENDATIONS
              </label>
              <textarea 
                rows="4"
                style={{ width: '100%', padding: '20px', borderRadius: '15px', background: '#f8faf9', border: 'none', fontSize: '1rem', outline: 'none', color: '#022417' }}
                placeholder="Ex: Favor warm, easy-to-digest foods. Avoid cold drinks."
                value={prescription.lifestyle}
                onChange={(e) => setPrescription({...prescription, lifestyle: e.target.value})}
              ></textarea>
            </div>

            <div className="input-field">
              <label style={{ color: 'white', marginBottom: '12px', display: 'block', fontWeight: '600' }}>
                ADDITIONAL NOTES / FOLLOW-UP
              </label>
              <textarea 
                rows="2"
                style={{ width: '100%', padding: '20px', borderRadius: '15px', background: '#f8faf9', border: 'none', fontSize: '1rem', outline: 'none', color: '#022417' }}
                placeholder="Review after 14 days."
                value={prescription.notes}
                onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <button type="submit" className="main-button" style={{ 
                flex: 2, 
                background: '#FFD700', 
                color: '#022417', 
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                Finalize & Send Prescription
              </button>
              <button type="button" onClick={() => navigate(-1)} className="main-button" style={{ 
                flex: 1, 
                background: 'rgba(255,255,255,0.05)', 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                Discard
              </button>
            </div>

          </div>
        </form>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Digitally signed by <strong style={{ color: '#FFD700' }}>Dr. {docName}</strong>
        </p>
      </div>
    </div>
  );
}