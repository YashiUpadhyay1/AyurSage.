import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'; 
import Ayurnavbar from "./Ayurnavbar"; 
import "../style.css";

/**
 * Production Backend URL on Render
 */
const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function PredictDosha() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Identify current imbalances in your lifestyle and health factors";

  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { setUser(null); }
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const isStep1Valid = form.name.trim() !== "" && form.age !== "" && form.gender !== "" && form.prakriti !== "";
  const isStep2Valid = form.sleep !== "" && form.stress !== "" && form.diet !== "" && form.season !== "";
  const isStep3Valid = form.symptoms.trim() !== "";

  const validateSymptoms = () => {
    const text = form.symptoms.toLowerCase();
    const age = parseInt(form.age);
    const gender = form.gender.toLowerCase();
    
    const maleBlocked = [
      "menstrual pain", "period cramps", "heavy periods", "missed period", "menstruation",
      "pms", "pcos", "menopause", "hot flashes", "period pain", "irregular periods", "ovary", "uterus"
    ];

    if (gender === "male") {
      const found = maleBlocked.find(s => text.includes(s));
      if (found) {
        Swal.fire({
          title: 'Symptom Conflict',
          text: `"${found}" is not applicable for male patients. Please recheck your symptoms.`,
          icon: 'error',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#C5F82A',
          confirmButtonText: 'Review Symptoms'
        });
        return false;
      }
    }

    if (gender === "female") {
      if (age >= 55 && (text.includes("missed period") || text.includes("no period"))) {
        Swal.fire({
          title: 'Clinical Context',
          text: "At age 55+, absent periods may indicate menopause. Try: 'hot flashes' or 'mood changes'.",
          icon: 'info',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#C5F82A'
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateSymptoms()) return;

    const token = localStorage.getItem("token");

    if (form.symptoms.trim().length < 5) {
      Swal.fire({
        title: 'Input Required',
        text: "Please enter valid symptoms (at least 5 characters).",
        icon: 'warning',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#C5F82A'
      });
      return;
    }

    try {
      // Step 1: Get Prediction from Live ML Model
      const response = await axios.post(
        `${API_BASE_URL}/api/ml/predict`,
        {
          Age: form.age,
          Gender: form.gender,
          Prakriti: form.prakriti,
          Symptoms: form.symptoms,
          "Stress Level": form.stress,
          "Sleep Pattern": form.sleep,
          "Diet Type": form.diet,
          Season: form.season,
          Climate: form.season === "Greeshma" ? "Hot" : "Cold"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Low Confidence',
          text: 'Please enter more accurate symptoms.',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#C5F82A'
        });
        return;
      }

      // Step 2: Save Assessment Result to Live Database
      await axios.post(
        `${API_BASE_URL}/api/dosha`,
        { 
          result: data.predicted_dosha, 
          disease: data.predicted_disease, 
          details: form,
          treatment: data.treatment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/result", {
        state: { result: data, details: form, type: "Dosha" }
      });

    } catch (err) {
      console.error("ML Error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Prediction Failed',
        text: 'System could not reach the AI model server.',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#C5F82A'
      });
    }
  };

  const cardInternalStyle = {
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <div className="about-direct-layout" style={{
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '120px 5% 80px 5%',
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
            {step === 1 && (
              <div className="form-content" style={cardInternalStyle}>
                <div className="inputs-top-area">
                  <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Basic Profile</h3>
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
                        <option value="Vata-Pitta">Vata-Pitta</option>
                        <option value="Pitta-Kapha">Pitta-Kapha</option>
                        <option value="Kapha-Vata">Kapha-Vata</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button className="parrot-action-btn" disabled={!isStep1Valid} onClick={nextStep} style={{ width: '100%', opacity: isStep1Valid ? 1 : 0.5 }}>Next Step →</button>
              </div>
            )}

            {step === 2 && (
              <div className="form-content" style={cardInternalStyle}>
                <div className="inputs-top-area">
                  <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Environment & Diet</h3>
                  <div className="input-group">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="input-field-wrapper">
                        <label>Season</label>
                        <select className="custom-select" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
                          <option value="">Select</option>
                          <option value="Greeshma">Greeshma (Summer)</option>
                          <option value="Vasant">Vasant (Spring)</option>
                          <option value="Varsha">Varsha (Monsoon)</option>
                          <option value="Sharad">Sharad (Autumn)</option>
                          <option value="Hemant">Hemant (Pre-Winter)</option>
                          <option value="Shishir">Shishir (Winter)</option>
                        </select>
                      </div>
                      <div className="input-field-wrapper">
                        <label>Diet Type</label>
                        <select className="custom-select" value={form.diet} onChange={(e) => setForm({ ...form, diet: e.target.value })}>
                          <option value="">Select Diet</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-vegetarian">Non-vegetarian</option>
                          <option value="Mixed">Mixed</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-field-wrapper">
                      <label>Sleep Pattern</label>
                      <select className="custom-select" value={form.sleep} onChange={(e) => setForm({ ...form, sleep: e.target.value })}>
                        <option value="">Select</option>
                        <option value="Normal">Normal</option>
                        <option value="Insomnia">Insomnia</option>
                        <option value="Hypersomnia">Hypersomnia</option>
                        <option value="Interrupted">Interrupted</option>
                      </select>
                    </div>
                    <div className="input-field-wrapper">
                      <label>Stress Level</label>
                      <select className="custom-select" value={form.stress} onChange={(e) => setForm({ ...form, stress: e.target.value })}>
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

            {step === 3 && (
              <div className="form-content" style={cardInternalStyle}>
                <div className="inputs-top-area">
                  <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Physical Symptoms</h3>
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