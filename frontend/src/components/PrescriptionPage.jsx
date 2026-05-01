import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

export default function PrescriptionPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const patient = state?.patient;
  const docName = localStorage.getItem("userName");

  const API_BASE_URL = "https://ayur-sage.onrender.com";

  const [prescription, setPrescription] = useState({
    medicines: "",
    lifestyle: "",
    notes: ""
  });

  // FIX: fetch exact dosha record instead of latest
  useEffect(() => {
    const fetchAITreatment = async () => {
      const token = localStorage.getItem("token");

      // priority: use passed doshaId else fallback to last saved
      const doshaId = state?.doshaId || localStorage.getItem("lastDoshaId");
      if (!doshaId) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/dosha/${doshaId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = res.data;

        setPrescription({
          medicines: data?.treatment?.medicine || "",
          lifestyle: data?.treatment?.diet || "",
          notes: data?.disease || ""
        });

      } catch (err) {
        console.error("AI Treatment Fetch Error:", err);
      }
    };

    fetchAITreatment();
  }, [state]);

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!patient?._id) {
      alert("Invalid Patient Session. Please try again from Dashboard.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/consultation/update-prescription/${patient._id}`,
        {
          medicines: prescription.medicines,
          lifestyle: prescription.lifestyle,
          notes: prescription.notes,
          status: "Completed"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert(`Prescription successfully sent to ${patient.name}`);
        navigate("/doctor-dashboard");
      }
    } catch (err) {
      console.error("Prescription Save Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving prescription.");
    }
  };

  if (!patient) {
    return (
      <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>
        <h2 style={{ color: '#FFD700' }}>Session Expired</h2>
        <p>No patient data found. Please go back to Dashboard.</p>
        <button className="main-button" onClick={() => navigate("/doctor-dashboard")}>
          Back to Dashboard
        </button>
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

      <div className="stat-card-glass" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid #FFD700', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px', marginBottom: '35px' }}>
          <div>
            <span style={{ color: '#FFD700', fontSize: '0.7rem' }}>PATIENT NAME</span>
            <p style={{ color: 'white', fontWeight: 'bold' }}>{patient.name}</p>
          </div>
          <div>
            <span style={{ color: '#FFD700', fontSize: '0.7rem' }}>AGE / GENDER</span>
            <p style={{ color: 'white' }}>{patient.age}Y / {patient.gender}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#FFD700', fontSize: '0.7rem' }}>AI ANALYSIS RESULT</span>
            <p style={{ color: '#A7FF83', fontWeight: 'bold' }}>
              {patient.predictedDosha || "Fetching..."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePrescription}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            <textarea
              required
              rows="5"
              placeholder="Loading medicines from AI analysis..."
              value={prescription.medicines}
              onChange={(e) => setPrescription({ ...prescription, medicines: e.target.value })}
            />

            <textarea
              rows="4"
              placeholder="Loading diet plan..."
              value={prescription.lifestyle}
              onChange={(e) => setPrescription({ ...prescription, lifestyle: e.target.value })}
            />

            <textarea
              rows="2"
              placeholder="AI Clinical Analysis summary..."
              value={prescription.notes}
              onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
            />

            <div style={{ display: 'flex', gap: '20px' }}>
              <button type="submit" className="main-button">Finalize & Send</button>
              <button type="button" onClick={() => navigate(-1)}>Discard</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}