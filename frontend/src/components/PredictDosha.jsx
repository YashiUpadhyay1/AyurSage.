import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../style.css";

export default function PredictDosha() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState(1);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Identify current imbalances in your lifestyle and health factors";

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    prakriti: "",
    sleep: "",
    stress: "",
    diet: "",
    season: "",
    symptoms: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const isStep1Valid = form.name.trim() !== "" && form.age !== "" && form.gender !== "" && form.prakriti !== "";
  const isStep2Valid = form.sleep !== "" && form.stress !== "" && form.diet !== "" && form.season !== "";
  const isStep3Valid = form.symptoms.trim() !== ""; 

  // const handleSubmit = async () => {
  //   let sampleOutcome = "Dosha Imbalance Detected";
  //   const token = localStorage.getItem("token");

  //   try {
  //     await axios.post(
  //       "http://localhost:5000/api/ml/predict",
  //       { result: sampleOutcome, details: form },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     navigate("/result", { state: { result: sampleOutcome, details: form, type: "Dosha" } });
  //   } catch (err) {
  //     navigate("/result", { state: { result: sampleOutcome, details: form, type: "Dosha" } });
  //   }
  // };

  //  ML CONNECTED SUBMIT
  const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  // ✅ 1. Minimum length validation
  if (form.symptoms.trim().length < 5) {
    alert("Please enter valid symptoms (at least 5 characters)");
    return;
  }

  // ✅ 2. Meaningful text validation
  if (!/[a-zA-Z]/.test(form.symptoms)) {
    alert("Enter meaningful symptoms (only random characters not allowed)");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/ml/predict",
      {
        Age: form.age,
        Gender: form.gender,
        Prakriti: form.prakriti,
        Symptoms: form.symptoms,
        "Stress Level": form.stress,
        "Sleep Pattern": form.sleep,
        "Diet Type": form.diet,
        Season: form.season,
        Climate: "Cold"
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = response.data;

    // ✅ 3. ML confidence check (if backend sends error)
    if (data.error) {
      alert("Low confidence prediction. Please enter more accurate symptoms.");
      return;
    }

    // Save history
    await axios.post(
      "http://localhost:5000/api/dosha",
      { result: data.predicted_dosha, details: form },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/result", {
      state: {
        result: data,
        details: form,
        type: "Dosha"
      }
    });

  } catch (err) {
    console.error("ML Error:", err);
    alert("ML prediction failed");
  }
};

  // Modern Flexbox logic to keep step internal content consistent
  const cardInternalStyle = { 
    height: '420px', // Fixed height for internal content
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between' 
  };

  return (
    <div className="home-page-wrapper">
      <nav className="home-nav-dark" style={{ width: '100%', boxSizing: 'border-box' }}>
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

      <div 
        className="about-direct-layout" 
        style={{ 
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '40px 5% 80px 5%',
          boxSizing: 'border-box'
        }}
      >
        <div className="prakriti-stepper-container" style={{ marginTop: '40px' }}>
          <header className="prakriti-header">
            <p className="section-tag">ANALYSIS STEP {step} OF 3</p>
            <h1 className="hero-main-title">Dosha Analysis</h1>
            <p className="hero-para" style={{ margin: "0 auto 20px auto", textAlign: "center" }}>{displayText}</p>
            
            <div className="overall-progress-bg">
              <div className="overall-progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
          </header>

          <div className="question-step-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="form-content" style={cardInternalStyle}>
                <div className="inputs-top-area">
                    <h3 className="form-title" style={{color: 'white', marginBottom: '20px', textAlign: 'center'}}>Basic Profile</h3>
                    <div className="input-group">
                        <div className="input-field-wrapper">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your name" className="custom-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="input-field-wrapper">
                                <label>Age</label>
                                <input type="number" placeholder="Age" className="custom-input" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                            </div>
                            <div className="input-field-wrapper">
                                <label>Gender</label>
                                <select className="custom-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-field-wrapper">
                            <label>Baseline Prakriti</label>
                            <select className="custom-select" value={form.prakriti} onChange={(e) => setForm({ ...form, prakriti: e.target.value })}>
                                <option value="">Select Prakriti</option>
                                <option value="Vata">Vata</option>
                                <option value="Pitta">Pitta</option>
                                <option value="Kapha">Kapha</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button className="parrot-action-btn" disabled={!isStep1Valid} onClick={nextStep} style={{ width: '100%', opacity: isStep1Valid ? 1 : 0.5 }}>Next Step →</button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="form-content" style={cardInternalStyle}>
                <div className="inputs-top-area">
                    <h3 className="form-title" style={{color: 'white', marginBottom: '20px', textAlign: 'center'}}>Environment & Diet</h3>
                    <div className="input-group">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="input-field-wrapper">
                                <label>Season</label>
                                <select className="custom-select" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="Winter">Winter</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Monsoon">Monsoon</option>
                                    <option value="Spring">Spring</option>
                                </select>
                            </div>
                            <div className="input-field-wrapper">
                                <label>Diet Type</label>
                                <select className="custom-select" value={form.diet} onChange={(e) => setForm({ ...form, diet: e.target.value })}>
                                    <option value="">Select Diet</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-field-wrapper">
                            <label>Sleep Quality</label>
                            <select className="custom-select" value={form.sleep} onChange={(e) => setForm({...form, sleep: e.target.value})}>
                                <option value="">Select</option>
                                <option value="Insomnia">Insomnia</option>
                                <option value="Normal">Normal</option>
                                <option value="Heavy">Heavy</option>
                            </select>
                        </div>
                        <div className="input-field-wrapper">
                            <label>Stress Level</label>
                            <select className="custom-select" value={form.stress} onChange={(e) => setForm({...form, stress: e.target.value})}>
                                <option value="">Select</option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="stepper-controls">
                  <button className="parrot-outline-btn" onClick={prevStep}>Back</button>
                  <button className="parrot-action-btn" disabled={!isStep2Valid} onClick={nextStep} style={{ opacity: isStep2Valid ? 1 : 0.5 }}>Next Step →</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="form-content" style={cardInternalStyle}>
                <div className="inputs-top-area">
                    <h3 className="form-title" style={{color: 'white', marginBottom: '20px', textAlign: 'center'}}>Physical Symptoms</h3>
                    <div className="input-field-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Symptoms (e.g., dry skin, anxiety)</label>
                        <textarea 
                            className="custom-textarea" 
                            placeholder="Describe how you feel..." 
                            style={{ flexGrow: 1, minHeight: '220px' }} 
                            value={form.symptoms} 
                            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                        ></textarea>
                    </div>
                </div>
                <div className="stepper-controls" style={{ marginTop: '20px' }}>
                  <button className="parrot-outline-btn" onClick={prevStep}>Back</button>
                  <button className="parrot-action-btn" disabled={!isStep3Valid} onClick={handleSubmit} style={{ opacity: isStep3Valid ? 1 : 0.5 }}>Get Analysis →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}