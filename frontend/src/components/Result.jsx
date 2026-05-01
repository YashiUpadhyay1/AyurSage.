import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Ayurnavbar from "./Ayurnavbar"; 
import axios from "axios";
import "../style.css";

const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("User sync error", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!data) {
    return (
      <div className="home-page-wrapper">
        <Ayurnavbar user={user} onLogout={handleLogout} />
        <div style={{ textAlign: "center", padding: "150px 20px" }}>
          <h1 className="rx-main-title">No Result Found</h1>
          <button className="parrot-action-btn-large" onClick={() => navigate("/predict-dosha")}>Go Back</button>
        </div>
      </div>
    );
  }

  // Dashboard aur PredictDosha dono se aane wale data ko handle karne ke liye mapping
  const { result: mlData, details, type, refId } = data;
  
  // PredictDosha.js aur Database ke fields ko normalize karna[cite: 2, 4]
  const result = typeof mlData === 'string' ? mlData : (mlData?.predicted_dosha || mlData?.result || "Unknown");
  const disease = mlData?.predicted_disease || mlData?.disease || "Not Identified";
  const today = details?.date ? new Date(details.date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

  // Dashboard se aate waqt 'treatment' field 'mlData' ke andar hoti hai[cite: 4, 8]
  const treatment = mlData?.treatment || null;

  // Auto-save result logic (Sirf tab chalega jab naya prediction ho)[cite: 8]
  useEffect(() => {
    const saveResultToDB = async () => {
      if (type === "History Report") return;
      if (localStorage.getItem("lastResultSaved") === JSON.stringify(details?.symptoms)) return;

      const token = localStorage.getItem("token");
      if (!token || !result || result === "Unknown") return;

      try {
        await axios.post(`${API_BASE_URL}/api/dosha`, {
          result: result,
          disease: disease,
          details: details, 
          treatment: treatment // ML Server se aane wala real treatment save karein
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        localStorage.setItem("lastResultSaved", JSON.stringify(details?.symptoms));
      } catch (err) {
        console.error("Database save failed:", err.message);
      }
    };

    saveResultToDB();
  }, [result, disease, details, treatment, type]);

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <div className="about-direct-layout" style={{
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
          minHeight: "100vh", display: "flex", justifyContent: "center",
          padding: "120px 5% 80px 5%", boxSizing: "border-box",
        }}>
        <div className="prescription-container">
          <header className="rx-header">
            <div className="rx-title-area">
              <h1 className="rx-main-title">Prescription Report</h1>
              <p className="rx-type-tag">{type?.toUpperCase() || "DOSHA"} ANALYSIS</p>
            </div>
            <div className="rx-date-id">
              <p>Analysis Date: <strong>{today}</strong></p>
              <p style={{ color: "#A7FF83", marginTop: "5px" }}>Ref ID: <strong>#{refId || "NEW"}</strong></p>
            </div>
          </header>

          <section className="rx-patient-box">
            <div className="rx-meta-grid">
              <div className="rx-meta-item"><span>Patient Name</span><p>{details?.name || "User"}</p></div>
              <div className="rx-meta-item"><span>Age / Gender</span><p>{details?.age || "--"} Y / {details?.gender || "--"}</p></div>
              <div className="rx-meta-item"><span>Dominant Prakriti</span><p className="text-diagnosis-highlight">{details?.prakriti || "Not Set"}</p></div>
            </div>
          </section>

          <div className="rx-vitals-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="rx-vital-card"><span>Season</span><h3>{details?.season || "--"}</h3></div>
            <div className="rx-vital-card"><span>Diet</span><h3>{details?.diet || "--"}</h3></div>
            <div className="rx-vital-card"><span>Sleep</span><h3>{details?.sleep || "--"}</h3></div>
            <div className="rx-vital-card"><span>Stress</span><h3>{details?.stress || "--"}</h3></div>
          </div>

          <div className="rx-complaints">
            <p className="rx-sub-label">Diagnosis Result</p>
            <h2 className="text-diagnosis-highlight" style={{ fontSize: "1.8rem", marginBottom: "15px" }}>{result}</h2>
            
            <p className="rx-sub-label">Most Likely Disease</p>
            <h2 className="text-diagnosis-highlight">{disease}</h2>
            
            <p className="rx-sub-label" style={{marginTop: '20px'}}>Chief Complaints / Symptoms</p>
            <p style={{ fontStyle: "italic", color: "#fff" }}>"{details?.symptoms || "No specific symptoms reported."}"</p>
          </div>

          <hr style={{ opacity: "0.1", margin: "30px 0" }} />

          {/* Sirf dynamic treatment dikhayega jo Database/ML se aaya hai[cite: 4, 9] */}
          {treatment ? (
            <>
              <div className="rx-recommendations">
                <div className="rx-column">
                  <p className="rx-section-title">Ahara (Dietary Plan)</p>
                  <ul className="rx-list">
                    {treatment.diet?.split(",").map((item, i) => (<li key={i}>{item.trim()}</li>))}
                  </ul>
                </div>
                <div className="rx-column">
                  <p className="rx-section-title">Chikitsa (Therapy)</p>
                  <ul className="rx-list">
                    {treatment.therapy?.split(",").map((item, i) => (<li key={i}>{item.trim()}</li>))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: "25px" }}>
                <p className="rx-sub-label">Aushadhi (Medicines)</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {treatment.medicine?.split(",").map((med, i) => (
                    <div key={i} style={{ background: "rgba(255, 153, 51, 0.1)", padding: "5px 15px", borderRadius: "20px", color: "#FF9933", border: "1px solid rgba(255, 153, 51, 0.3)", fontSize: "0.9rem" }}>
                      {med.trim()}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "25px" }}>
                <p className="rx-sub-label">Vyayama (Exercise Therapy)</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {treatment.exercise?.split(",").map((ex, i) => (
                    <div key={i} style={{ background: "rgba(167, 255, 131, 0.1)", padding: "5px 15px", borderRadius: "20px", color: "#A7FF83", border: "1px solid rgba(167, 255, 131, 0.3)", fontSize: "0.9rem" }}>
                      {ex.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '20px', border: '1px dashed #A7FF83', borderRadius: '10px'}}>
               <p style={{color: '#A7FF83'}}>Customized treatment plan loading from history...</p>
            </div>
          )}

          <div className="rx-footer-btns" style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
            <button className="rx-btn outline" style={{ flex: 1 }} onClick={() => navigate("/dashboard")}>Back to History</button>
            <button className="rx-btn primary" style={{ flex: 1 }} onClick={() => window.print()}>Print Report</button>
            <button className="rx-btn accent" style={{ flex: 1 }} onClick={() => navigate("/consultation")}>Consult Doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
