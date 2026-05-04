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

  const doshaContent = {
    Vata: { diet: "Warm grains, Ghee", therapy: "Abhyanga Massage", medicine: "Ashwagandha", exercise: "Slow Yoga" },
    Pitta: { diet: "Cooling fruits, Coconut", therapy: "Shitala Pranayama", medicine: "Amalaki", exercise: "Swimming" },
    Kapha: { diet: "Light spicy food", therapy: "Dry Massage", medicine: "Trikatu", exercise: "Surya Namaskar" }
  };

  if (!data) {
    return (
      <div className="home-page-wrapper">
        <Ayurnavbar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
        <div style={{ textAlign: "center", padding: "150px 20px" }}>
          <h1 className="rx-main-title">No Result Found</h1>
          <button className="parrot-action-btn-large" onClick={() => navigate("/predict-dosha")}>Go Back</button>
        </div>
      </div>
    );
  }

  const { result: mlData, details, type, refId } = data;
  const finalResult = mlData?.predicted_dosha || mlData?.result || (typeof mlData === 'string' ? mlData : "Unknown");
  const finalDisease = mlData?.predicted_disease || mlData?.disease || "Not Identified";
  const finalDetails = type === "History Report" ? (mlData?.form || details) : details;
  const today = finalDetails?.date ? new Date(finalDetails.date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

  // logic to determine treatment
  let finalTreatment = mlData?.treatment || null;
  if (!finalTreatment && finalResult !== "Unknown") {
    const resStr = finalResult.toLowerCase();
    if (resStr.includes("vata")) finalTreatment = doshaContent.Vata;
    else if (resStr.includes("pitta")) finalTreatment = doshaContent.Pitta;
    else if (resStr.includes("kapha")) finalTreatment = doshaContent.Kapha;
  }

  // FORCE SAVE TO DB Logic
  useEffect(() => {
    const saveResultToDB = async () => {
      // 1. History report hai toh save mat karo
      if (type === "History Report") return;
      
      // 2. IMPORTANT: Jab tak treatment calculat na ho jaye, wait karo
      if (!finalResult || finalResult === "Unknown" || !finalTreatment) return;

      const symptomsKey = JSON.stringify(finalDetails?.symptoms);
      // 3. Duplicate check
      if (localStorage.getItem("lastResultSaved") === symptomsKey) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await axios.post(`${API_BASE_URL}/api/dosha`, {
          result: finalResult,
          disease: finalDisease,
          details: finalDetails, 
          treatment: finalTreatment 
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.setItem("lastResultSaved", symptomsKey);
        console.log("Assessment saved to database successfully.");
      } catch (err) { 
        console.error("Database save failed:", err.response?.data || err.message); 
      }
    };

    saveResultToDB();
    // Dependency array mein finalTreatment zaroor hona chahiye
  }, [finalResult, finalTreatment, finalDisease, finalDetails, type]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={handleLogout} />
      
      <div className="about-direct-layout" style={{ 
          backgroundImage: "url('/images/Login img.png')", 
          padding: "120px 5% 80px 5%", 
          minHeight: "100vh", 
          display: "flex", 
          justifyContent: "center" 
        }}>
        
        <div className="prescription-container">
          <header className="rx-header">
            <div className="rx-title-area">
              <h1 className="rx-main-title">Ayurvedic Report</h1>
              <p className="rx-type-tag">{type?.toUpperCase() || "DOSHA"} ANALYSIS</p>
            </div>
            <div className="rx-date-id">
              <p>Analysis Date: <strong>{today}</strong></p>
              <p style={{ color: "#A7FF83", marginTop: "5px" }}>Ref ID: <strong>#{refId || "NEW"}</strong></p>
            </div>
          </header>

          <section className="rx-patient-box">
            <div className="rx-meta-grid">
              <div className="rx-meta-item"><span>Patient Name</span><p>{finalDetails?.name || "User"}</p></div>
              <div className="rx-meta-item"><span>Age / Gender</span><p>{finalDetails?.age || "--"} Y / {finalDetails?.gender || "--"}</p></div>
              <div className="rx-meta-item"><span>Dominant Prakriti</span><p className="text-diagnosis-highlight">{finalDetails?.prakriti || "Not Set"}</p></div>
            </div>
          </section>

          <div className="rx-vitals-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="rx-vital-card"><span>Season</span><h3>{finalDetails?.season || "--"}</h3></div>
            <div className="rx-vital-card"><span>Diet</span><h3>{finalDetails?.diet || "--"}</h3></div>
            <div className="rx-vital-card"><span>Sleep</span><h3>{finalDetails?.sleep || "--"}</h3></div>
            <div className="rx-vital-card"><span>Stress</span><h3>{finalDetails?.stress || "--"}</h3></div>
          </div>

          <div className="rx-complaints">
            <p className="rx-sub-label">Diagnosis Result</p>
            <h2 className="text-diagnosis-highlight" style={{ fontSize: "1.8rem", marginBottom: "15px" }}>{finalResult}</h2>
            
            <p className="rx-sub-label">Most Likely Disease</p>
            <h2 className="text-diagnosis-highlight">{finalDisease}</h2>
            
            <p className="rx-sub-label" style={{marginTop: '20px'}}>Chief Complaints / Symptoms</p>
            <p style={{ fontStyle: "italic", color: "#fff" }}>"{finalDetails?.symptoms || "No specific symptoms reported."}"</p>
          </div>

          <hr style={{ opacity: "0.1", margin: "30px 0" }} />

          {finalTreatment ? (
            <>
              <div className="rx-recommendations">
                <div className="rx-column">
                  <p className="rx-section-title">Ahara (Dietary Plan)</p>
                  <ul className="rx-list">
                    {finalTreatment.diet?.split(",").map((item, i) => (
                      <li key={i}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
                <div className="rx-column">
                  <p className="rx-section-title">Chikitsa (Therapy)</p>
                  <ul className="rx-list">
                    {finalTreatment.therapy?.split(",").map((item, i) => (
                      <li key={i}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: "25px" }}>
                <p className="rx-sub-label">Aushadhi (Medicines)</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {finalTreatment.medicine?.split(",").map((med, i) => (
                    <div key={i} style={{ 
                      background: "rgba(255, 153, 51, 0.1)", 
                      padding: "5px 15px", 
                      borderRadius: "20px", 
                      color: "#FF9933", 
                      border: "1px solid rgba(255, 153, 51, 0.3)", 
                      fontSize: "0.9rem" 
                    }}>
                      {med.trim()}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "25px" }}>
                <p className="rx-sub-label">Vyayama (Exercise Therapy)</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                  {finalTreatment.exercise ? finalTreatment.exercise.split(",").map((ex, i) => (
                    <div key={i} style={{ 
                      background: "rgba(167, 255, 131, 0.1)", 
                      padding: "5px 15px", 
                      borderRadius: "20px", 
                      color: "#A7FF83", 
                      border: "1px solid rgba(167, 255, 131, 0.3)", 
                      fontSize: "0.9rem" 
                    }}>
                      {ex.trim()}
                    </div>
                  )) : <p style={{color: '#888'}}>Consult a specialist for yoga & exercise.</p>}
                </div>
              </div>
            </>
          ) : (
            <p style={{textAlign:'center', color:'#A7FF83', padding: '20px', border: '1px dashed #A7FF83', borderRadius: '10px'}}>
              Retrieving customized treatment plan...
            </p>
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
