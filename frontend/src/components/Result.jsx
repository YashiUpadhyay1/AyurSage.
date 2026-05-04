import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Ayurnavbar from "./Ayurnavbar"; 
import axios from "axios"; // Added axios for database sync
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

  // --- FALLBACK DATA FOR HISTORY VIEW ---
  const doshaContent = {
    Vata: {
      diet: "Warm cooked grains, Healthy fats like Ghee, Root vegetables, Avoid cold/raw foods",
      therapy: "Abhyanga (Oil Massage), Shirodhara, Keep body warm, Nasya",
      medicine: "Ashwagandha, Triphala, Dashamula, Brahmi",
      exercise: "Slow Yoga, Nature Walks, Grounding Meditation"
    },
    Pitta: {
      diet: "Cooling fruits (Melons, Pears), Coconut water, Leafy greens, Avoid spicy/fried foods",
      therapy: "Shitala Pranayama, Calming meditation, Stay in cool environments",
      medicine: "Amalaki, Shatavari, Guduchi, Brahmi",
      exercise: "Swimming, Moonlit walks, Gentle Stretching"
    },
    Kapha: {
      diet: "Light spicy foods, Warm ginger tea, Barley, Honey, Avoid dairy and sweets",
      therapy: "Udvartana (Dry Powder Massage), Wake up before sunrise, Dry heat therapy",
      medicine: "Trikatu, Guggulu, Tulsi, Punarnava",
      exercise: "Sun Salutations (Surya Namaskar), Vinyasa Flow, Active Aerobics"
    }
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

  const { result: mlData, details, type, refId } = data;
  const result = typeof mlData === 'string' ? mlData : (mlData?.predicted_dosha || "Unknown");
  const disease = mlData?.predicted_disease || mlData?.disease || null;
  
  // Choose correct details object depending on source
  const finalDetails = type === "History Report" ? (mlData?.form || details) : details;
  const today = finalDetails?.date ? new Date(finalDetails.date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");

  // --- LOGIC: Use ML treatment OR Fallback to Local Content ---
  let treatment = mlData?.treatment || null;

  if (!treatment) {
    const resStr = result?.toLowerCase() || "";
    if (resStr.includes("vata")) treatment = doshaContent.Vata;
    else if (resStr.includes("pitta")) treatment = doshaContent.Pitta;
    else if (resStr.includes("kapha")) treatment = doshaContent.Kapha;
  }

  // --- DATABASE SYNC LOGIC ---
  useEffect(() => {
    const saveResultToDB = async () => {
      // Don't save if viewing history or if already saved in this session
      if (type === "History Report") return;
      if (localStorage.getItem("lastResultSaved") === JSON.stringify(finalDetails?.symptoms)) return;

      const token = localStorage.getItem("token");
      if (!token || result === "Unknown") return;

      try {
        await axios.post(`${API_BASE_URL}/api/dosha`, {
          result: result,
          disease: disease,
          details: finalDetails, 
          treatment: treatment // Sending the calculated treatment to fix the 'null' issue
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem("lastResultSaved", JSON.stringify(finalDetails?.symptoms));
      } catch (err) {
        console.error("Database save failed:", err.message);
      }
    };

    saveResultToDB();
  }, [result, disease, finalDetails, treatment, type]);

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
            <h2 className="text-diagnosis-highlight" style={{ fontSize: "1.8rem", marginBottom: "15px" }}>{result}</h2>
            {disease && (
              <div style={{marginTop: '10px'}}>
                <p className="rx-sub-label">Most Likely Disease</p>
                <h2 className="text-diagnosis-highlight">{disease}</h2>
              </div>
            )}
            <p className="rx-sub-label" style={{marginTop: '20px'}}>Chief Complaints / Symptoms</p>
            <p style={{ fontStyle: "italic", color: "#fff" }}>"{finalDetails?.symptoms || "No specific symptoms reported."}"</p>
          </div>

          <hr style={{ opacity: "0.1", margin: "30px 0" }} />

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
          ) : <p style={{color: '#ccc', textAlign: 'center'}}>Calculating wellness metrics...</p>}

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
