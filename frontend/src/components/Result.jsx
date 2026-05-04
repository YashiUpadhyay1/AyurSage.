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
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error("User sync error"); }
    }
  }, []);

  // Static Fallbacks for initial save/display
  const doshaContent = {
    Vata: { diet: "Warm grains, Ghee", therapy: "Abhyanga Massage", medicine: "Ashwagandha", exercise: "Slow Yoga" },
    Pitta: { diet: "Cooling fruits, Coconut", therapy: "Shitala Pranayama", medicine: "Amalaki", exercise: "Swimming" },
    Kapha: { diet: "Light spicy food", therapy: "Dry Massage", medicine: "Trikatu", exercise: "Surya Namaskar" }
  };

  if (!data) return <div style={{textAlign:'center', padding:'100px'}}><h1>No Result</h1><button onClick={()=>navigate("/dashboard")}>Back</button></div>;

  const { result: mlData, details, type, refId } = data;
  const finalResult = mlData?.predicted_dosha || mlData?.result || (typeof mlData === 'string' ? mlData : "Unknown");
  const finalDisease = mlData?.predicted_disease || mlData?.disease || "Not Identified";
  const finalDetails = type === "History Report" ? (mlData?.form || details) : details;
  const today = finalDetails?.date ? new Date(finalDetails.date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

  // Determine treatment object
  let finalTreatment = mlData?.treatment || null;
  if (!finalTreatment) {
    const resStr = finalResult?.toLowerCase() || "";
    if (resStr.includes("vata")) finalTreatment = doshaContent.Vata;
    else if (resStr.includes("pitta")) finalTreatment = doshaContent.Pitta;
    else if (resStr.includes("kapha")) finalTreatment = doshaContent.Kapha;
  }

  // FORCE SAVE TO DB
  useEffect(() => {
    const saveResultToDB = async () => {
      if (type === "History Report") return;
      const symptomsKey = JSON.stringify(finalDetails?.symptoms);
      if (localStorage.getItem("lastResultSaved") === symptomsKey) return;

      const token = localStorage.getItem("token");
      if (!token || finalResult === "Unknown") return;

      try {
        await axios.post(`${API_BASE_URL}/api/dosha`, {
          result: finalResult,
          disease: finalDisease,
          details: finalDetails, 
          treatment: finalTreatment // THIS WILL NO LONGER BE NULL
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem("lastResultSaved", symptomsKey);
      } catch (err) { console.error("Save failed", err.message); }
    };
    saveResultToDB();
  }, [finalResult, finalDisease, finalDetails, finalTreatment, type]);

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="about-direct-layout" style={{ backgroundImage: "url('/images/Login img.png')", padding: "120px 5% 80px 5%", minHeight: "100vh", display:"flex", justifyContent:"center" }}>
        <div className="prescription-container">
          <header className="rx-header">
            <h1 className="rx-main-title">Prescription Report</h1>
            <p>Date: {today} | ID: #{refId || "NEW"}</p>
          </header>
          {/* ... Baaki UI aapka original same rahega ... */}
          <div className="rx-complaints">
            <h2 className="text-diagnosis-highlight">{finalResult}</h2>
            <h2 className="text-diagnosis-highlight">{finalDisease}</h2>
          </div>
          <hr style={{ opacity: "0.1", margin: "30px 0" }} />
          {finalTreatment ? (
            <div className="rx-recommendations">
              <p className="rx-section-title">Ahara (Diet)</p>
              <ul>{finalTreatment.diet?.split(",").map((item, i) => <li key={i}>{item.trim()}</li>)}</ul>
              <p className="rx-section-title">Chikitsa (Therapy)</p>
              <ul>{finalTreatment.therapy?.split(",").map((item, i) => <li key={i}>{item.trim()}</li>)}</ul>
              <p className="rx-sub-label">Medicines</p>
              <p style={{color:'#FF9933'}}>{finalTreatment.medicine}</p>
            </div>
          ) : <p style={{textAlign:'center', color:'#A7FF83'}}>Retrieving plan...</p>}
          <div className="rx-footer-btns" style={{display:'flex', gap:'15px', marginTop:'40px'}}>
            <button className="rx-btn outline" onClick={() => navigate("/dashboard")}>Back to History</button>
            <button className="rx-btn primary" onClick={() => window.print()}>Print Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
