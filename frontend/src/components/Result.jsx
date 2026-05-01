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

  if (!data) return <div style={{padding: "100px", textAlign: "center"}}><h1>No Data Found</h1><button onClick={() => navigate("/dashboard")}>Back</button></div>;

  // Unified Data Extraction[cite: 3]
  const { result: mlData, details, type, refId } = data;
  
  // Mapping logic for Dashboard History vs ML Result[cite: 3]
  const finalResult = mlData?.result || mlData?.predicted_dosha || (typeof mlData === 'string' ? mlData : "Unknown");
  const finalDisease = mlData?.disease || mlData?.predicted_disease || "Not Identified";
  const finalTreatment = mlData?.treatment || null;
  const finalDetails = type === "History Report" ? (mlData?.form || details) : details;
  
  const today = finalDetails?.date ? new Date(finalDetails.date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="about-direct-layout" style={{ padding: "120px 5% 80px 5%", minHeight: "100vh" }}>
        <div className="prescription-container">
          <header className="rx-header">
            <h1 className="rx-main-title">Ayurvedic Report</h1>
            <p>Date: {today} | ID: #{refId || "NEW"}</p>
          </header>

          <section className="rx-patient-box">
            <div className="rx-meta-grid">
              <div className="rx-meta-item"><span>Patient</span><p>{finalDetails?.name || "User"}</p></div>
              <div className="rx-meta-item"><span>Age/Gender</span><p>{finalDetails?.age}Y / {finalDetails?.gender}</p></div>
              <div className="rx-meta-item"><span>Prakriti</span><p>{finalDetails?.prakriti || "Not Set"}</p></div>
            </div>
          </section>

          <div className="rx-complaints">
            <p className="rx-sub-label">Diagnosis Result</p>
            <h2 className="text-diagnosis-highlight">{finalResult}</h2>
            <p className="rx-sub-label">Most Likely Disease</p>
            <h2 className="text-diagnosis-highlight">{finalDisease}</h2>
            <p className="rx-sub-label">Symptoms</p>
            <p><em>"{finalDetails?.symptoms || "No symptoms reported."}"</em></p>
          </div>

          <hr style={{ opacity: "0.1", margin: "30px 0" }} />

          {/* DYNAMIC TREATMENT SECTION[cite: 3] */}
          {finalTreatment ? (
            <>
              <div className="rx-recommendations">
                <div className="rx-column">
                  <p className="rx-section-title">Ahara (Diet)</p>
                  <ul className="rx-list">
                    {finalTreatment.diet?.split(",").map((item, i) => <li key={i}>{item.trim()}</li>)}
                  </ul>
                </div>
                <div className="rx-column">
                  <p className="rx-section-title">Chikitsa (Therapy)</p>
                  <ul className="rx-list">
                    {finalTreatment.therapy?.split(",").map((item, i) => <li key={i}>{item.trim()}</li>)}
                  </ul>
                </div>
              </div>
              <div style={{marginTop: "20px"}}>
                <p className="rx-sub-label">Medicines</p>
                <p style={{color: "#FF9933"}}>{finalTreatment.medicine || "Consult doctor."}</p>
              </div>
            </>
          ) : <p style={{textAlign: "center", color: "#A7FF83"}}>Plan available in medical history record.</p>}

          <div className="rx-footer-btns" style={{display: "flex", gap: "10px", marginTop: "30px"}}>
            <button className="rx-btn outline" onClick={() => navigate("/dashboard")}>Back to History</button>
            <button className="rx-btn primary" onClick={() => window.print()}>Print</button>
          </div>
        </div>
      </div>
    </div>
  );
}
