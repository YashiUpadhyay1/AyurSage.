import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Ayurnavbar from "./Ayurnavbar"; 
import "../style.css";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  
  // Navbar ke liye user data state
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Sync User for Navbar Profile Icon
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
          <p style={{ marginTop: "10px", color: "#ccc" }}>
            Please complete the Dosha assessment first.
          </p>
          <button className="parrot-action-btn-large" onClick={() => navigate("/predict-dosha")}>Go Back</button>
        </div>
      </div>
    );
  }

  // Destructuring logic
  const { result: mlData, details, type, refId } = data;
  const result = typeof mlData === 'string' ? mlData : (mlData?.predicted_dosha || "Unknown");
  const disease = mlData?.predicted_disease || null;
  const today = new Date().toLocaleDateString("en-GB");

  // const doshaContent = {
  //   Vata: {
  //     diet: ["Warm, cooked grains", "Healthy fats like Ghee", "Avoid cold/raw foods"],
  //     lifestyle: ["Consistent sleep routine", "Daily oil massage (Abhyanga)", "Keep body warm"],
  //     exercises: ["Slow Yoga (Hatha)", "Nature Walks", "Grounding Meditation"],
  //   },
  //   Pitta: {
  //     diet: ["Cooling fruits (Melons, Pears)", "Coconut water", "Avoid spicy/fried foods"],
  //     lifestyle: ["Avoid midday sun", "Calming meditation", "Stay in cool environments"],
  //     exercises: ["Swimming", "Moonlit walks", "Gentle Stretching"],
  //   },
  //   Kapha: {
  //     diet: ["Light, spicy foods", "Warm ginger tea", "Avoid dairy and sweets"],
  //     lifestyle: ["Wake up before sunrise", "Avoid daytime napping", "Dry heat therapy"],
  //     exercises: ["Sun Salutations (Surya Namaskar)", "Vinyasa Flow", "Active Aerobics"],
  //   },
  //   Balanced: {
  //     diet: ["Seasonal organic meals", "Balanced Macro-nutrients"],
  //     lifestyle: ["Regular daily routine", "Stress management"],
  //     exercises: ["Brisk walking", "Moderate Yoga"],
  //   },
  // };

  // const getGuide = () => {
  //   const resStr = result?.toLowerCase() || "";
  //   if (resStr.includes("vata")) return doshaContent.Vata;
  //   if (resStr.includes("pitta")) return doshaContent.Pitta;
  //   if (resStr.includes("kapha")) return doshaContent.Kapha;
  //   return doshaContent.Balanced;
  // };

  // const guide = getGuide();

  // Treatment from ML
const treatment = mlData?.treatment || null;

  return (
    <div className="home-page-wrapper">
      {/* Global Ayurnavbar */}
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <div
        className="about-direct-layout"
        style={{
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          padding: "120px 5% 80px 5%", 
          boxSizing: "border-box",
        }}
      >
        <div className="prescription-container">
          <header className="rx-header">
            <div className="rx-title-area">
              <h1 className="rx-main-title">Prescription Report</h1>
              <p className="rx-type-tag">{type?.toUpperCase() || "DOSHA"} ANALYSIS</p>
            </div>
            <div className="rx-date-id">
              <p>Analysis Date: <strong>{today}</strong></p>
              <p style={{ color: "#A7FF83", marginTop: "5px" }}>
                Ref ID: <strong>#{refId || "NEW"}</strong>
              </p>
            </div>
          </header>

          <section className="rx-patient-box">
            <div className="rx-meta-grid">
              <div className="rx-meta-item">
                <span>Patient Name</span>
                <p>{details?.name || "User"}</p>
              </div>
              <div className="rx-meta-item">
                <span>Age / Gender</span>
                <p>{details?.age || "--"} Y / {details?.gender || "--"}</p>
              </div>
              <div className="rx-meta-item">
                <span>Dominant Prakriti</span>
                <p className="text-diagnosis-highlight">{details?.prakriti || "Not Set"}</p>
              </div>
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
            <h2 className="text-diagnosis-highlight" style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
              {result}
            </h2>

            {disease && (
              <>
                <p className="rx-sub-label" style={{ marginTop: "10px" }}>Most Likely Disease</p>
                <h2 className="text-diagnosis-highlight">{disease}</h2>
              </>
            )}
            <br />
            <p className="rx-sub-label">Chief Complaints / Symptoms</p>
            <p className="about-para-large" style={{ fontSize: "1.05rem", fontStyle: "italic", color: "#fff" }}>
              "{details?.symptoms || "No specific symptoms reported."}"
            </p>
          </div>

          <hr style={{ opacity: "0.1", margin: "30px 0" }} />

          {treatment ? (
  <>
    <div className="rx-recommendations">
      <div className="rx-column">
        <p className="rx-section-title">Ahara (Dietary Plan)</p>
        <ul className="rx-list">
          {treatment.diet?.split(",").map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
        </ul>
      </div>
      <div className="rx-column">
        <p className="rx-section-title">Chikitsa (Therapy)</p>
        <ul className="rx-list">
          {treatment.therapy?.split(",").map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
        </ul>
      </div>
    </div>

    <div style={{ marginTop: "25px" }}>
      <p className="rx-sub-label">Aushadhi (Medicines)</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {treatment.medicine?.split(",").map((med, i) => (
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

    <div className="rx-exercise-section" style={{ marginTop: "25px" }}>
      <p className="rx-sub-label">Vyayama (Exercise Therapy)</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {treatment.exercise?.split(",").map((ex, i) => (
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
        ))}
      </div>
    </div>
  </>
) : (
  <p style={{ color: "#ccc", textAlign: "center", padding: "20px" }}>
    No treatment data available.
  </p>
)}

          <div className="rx-footer-btns" style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
            <button className="rx-btn outline" style={{ flex: 1 }} onClick={() => navigate(-1)}>Re-Analyze</button>
            <button className="rx-btn primary" style={{ flex: 1 }} onClick={() => window.print()}>Print Report</button>
            <button className="rx-btn accent" style={{ flex: 1 }} onClick={() => navigate("/consultation")}>Consult Doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
}