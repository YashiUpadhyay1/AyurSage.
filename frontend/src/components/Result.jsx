import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../style.css";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  // Function to handle session logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Fallback if user accesses page directly without form data
  if (!data) {
    return (
      <div className="home-page-wrapper">
        <div style={{ textAlign: "center", padding: "100px" }}>
          <h1 className="rx-main-title">No Result Found</h1>
          <button className="parrot-action-btn-large" onClick={() => navigate("/predict-dosha")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { result, details, type, refId } = data;
  const today = new Date().toLocaleDateString("en-GB");

  // Recommendation logic based on Diagnosis result
  const doshaContent = {
    Vata: {
      diet: ["Warm, cooked grains", "Healthy fats like Ghee", "Avoid cold/raw foods"],
      lifestyle: ["Consistent sleep routine", "Daily oil massage (Abhyanga)", "Keep body warm"],
      exercises: ["Slow Yoga (Hatha)", "Nature Walks", "Grounding Meditation"],
    },
    Pitta: {
      diet: ["Cooling fruits (Melons, Pears)", "Coconut water", "Avoid spicy/fried foods"],
      lifestyle: ["Avoid midday sun", "Calming meditation", "Stay in cool environments"],
      exercises: ["Swimming", "Moonlit walks", "Gentle Stretching"],
    },
    Kapha: {
      diet: ["Light, spicy foods", "Warm ginger tea", "Avoid dairy and sweets"],
      lifestyle: ["Wake up before sunrise", "Avoid daytime napping", "Dry heat therapy"],
      exercises: ["Sun Salutations (Surya Namaskar)", "Vinyasa Flow", "Active Aerobics"],
    },
    Balanced: {
      diet: ["Seasonal organic meals", "Balanced Macro-nutrients"],
      lifestyle: ["Regular daily routine", "Stress management"],
      exercises: ["Brisk walking", "Moderate Yoga"],
    },
  };

  // Maps "Vata Imbalance Detected" or similar strings to the correct guide keys
  const getGuide = () => {
    if (result?.toLowerCase().includes("vata")) return doshaContent.Vata;
    if (result?.toLowerCase().includes("pitta")) return doshaContent.Pitta;
    if (result?.toLowerCase().includes("kapha")) return doshaContent.Kapha;
    return doshaContent.Balanced;
  };

  const guide = getGuide();

  return (
    <div className="home-page-wrapper">
      {/* Universal Capsule Navbar */}
      <nav className="home-nav-dark">
        <div className="logo-area" onClick={() => navigate("/home")}>
          <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
          <span className="brand-name-light">AyurSage</span>
        </div>
        <div className="nav-center-links">
          <Link to="/home" className={`nav-box ${isActive("/home") ? "active" : ""}`}>Home</Link>
          <Link to="/predict-prakriti" className={`nav-box ${isActive("/predict-prakriti") ? "active" : ""}`}>Prakriti</Link>
          <Link to="/predict-dosha" className={`nav-box ${isActive("/predict-dosha") ? "active" : ""}`}>Dosha</Link>
          <Link to="/consultation" className={`nav-box ${isActive("/consultation") ? "active" : ""}`}>Consultations</Link>
          <Link to="/dashboard" className={`nav-box ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
          <Link to="/my-consultations" className={`nav-box ${isActive("/my-consultations") ? "active" : ""}`}>Booked</Link>
          <Link to="/about" className={`nav-box ${isActive("/about") ? "active" : ""}`}>About Us</Link>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn-light">Logout</button>
        </div>
      </nav>

      {/* Main Page Layout */}
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
          {/* Report Header */}
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

          {/* Section 1: Patient Profile */}
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

          {/* Section 2: Lifestyle Vitals */}
          <div className="rx-vitals-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="rx-vital-card">
              <span>Season</span>
              <h3>{details?.season || "--"}</h3>
            </div>
            <div className="rx-vital-card">
              <span>Diet</span>
              <h3>{details?.diet || "--"}</h3>
            </div>
            <div className="rx-vital-card">
              <span>Sleep</span>
              <h3>{details?.sleep || "--"}</h3>
            </div>
            <div className="rx-vital-card">
              <span>Stress</span>
              <h3>{details?.stress || "--"}</h3>
            </div>
          </div>

          {/* Section 3: Diagnosis & Symptoms */}
          <div className="rx-complaints">
            <p className="rx-sub-label">Diagnosis Result</p>
            <h2 className="text-diagnosis-highlight" style={{ fontSize: "1.8rem", marginBottom: "15px" }}>
              {result}
            </h2>
            <p className="rx-sub-label">Chief Complaints / Symptoms</p>
            <p className="about-para-large" style={{ fontSize: "1.05rem", fontStyle: "italic", color: "#fff" }}>
              "{details?.symptoms || "No specific symptoms reported."}"
            </p>
          </div>

          <hr className="rx-divider" style={{ opacity: "0.1", margin: "30px 0" }} />

          {/* Section 4: Ayurvedic Recommendations */}
          <div className="rx-recommendations">
            <div className="rx-column">
              <p className="rx-section-title">Ahara (Dietary)</p>
              <ul className="rx-list">
                {guide.diet.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="rx-column">
              <p className="rx-section-title">Vihara (Lifestyle)</p>
              <ul className="rx-list">
                {guide.lifestyle.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          {/* Section 5: Exercise Therapy */}
          <div className="rx-exercise-section" style={{ marginTop: "30px" }}>
            <p className="rx-sub-label">Vyayama (Exercise Therapy)</p>
            <div className="rx-exercise-grid">
              {guide.exercises.map((ex, i) => (
                <div key={i} className="rx-ex-chip">{ex}</div>
              ))}
            </div>
          </div>

          {/* Section 6: Footer Actions */}
          <div className="rx-footer-btns">
            <button className="rx-btn outline" onClick={() => navigate(-1)}>Re-Analyze</button>
            <button className="rx-btn primary" onClick={() => window.print()}>Print Report</button>
            <button className="rx-btn accent" onClick={() => navigate("/consultation")}>Consult Doctor</button>
          </div>
        </div>
      </div>
    </div>
  );
}