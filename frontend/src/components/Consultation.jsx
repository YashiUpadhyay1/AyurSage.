import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Ayurnavbar from "./Ayurnavbar"; 
import "../style.css";

// --- LIVE BACKEND URL ---
const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function Consultation() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedRefIndex, setSelectedRefIndex] = useState("");
  const [busySlots, setBusySlots] = useState([]); 
  const [reportFile, setReportFile] = useState(null);
  const [userProfile, setUserProfile] = useState({ age: "", gender: "Male" });
  const [user, setUser] = useState(null); 

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }

    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        // Updated to use API_BASE_URL
        const res = await axios.get(`${API_BASE_URL}/api/dosha`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data ? res.data.reverse() : []);
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedExpert) {
      const fetchBusySlots = async () => {
        const token = localStorage.getItem("token");
        try {
          // Updated to use API_BASE_URL
          const res = await axios.get(
            `${API_BASE_URL}/api/consultation/busy-slots?practitioner=${encodeURIComponent(selectedExpert.name)}&date=${selectedDate}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setBusySlots(res.data || []); 
        } catch (err) {
          console.error("Busy slots error", err);
          setBusySlots([]);
        }
      };
      fetchBusySlots();
    } else {
      setBusySlots([]); 
    }
  }, [selectedDate, selectedExpert]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedSlot || selectedRefIndex === "" || !userProfile.age) {
      alert("Please fill all required fields!");
      return;
    }
    const token = localStorage.getItem("token");
    const report = history[selectedRefIndex];
    const formData = new FormData();
    formData.append("name", localStorage.getItem("userName") || "User");
    formData.append("age", userProfile.age);
    formData.append("gender", userProfile.gender);
    formData.append("prakriti", report.form?.prakriti || "N/A");
    formData.append("predictedDosha", report.result);
    formData.append("symptoms", report.form?.symptoms || "N/A");
    formData.append("practitioner", selectedExpert.name);
    formData.append("date", selectedDate);
    formData.append("time", selectedSlot);
    if (reportFile) formData.append("report", reportFile);

    try {
      // Updated to use API_BASE_URL
      await axios.post(`${API_BASE_URL}/api/consultation`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Slot reserved successfully!");
      setShowModal(false);
      navigate("/my-consultations");
    } catch (err) { alert(err.response?.data?.message || "Booking Error"); }
  };

  const practitioners = [
    { id: 1, name: "Ananya Sharma", specialty: "Pancha Karma", fee: "800" },
    { id: 2, name: "Vikram Mehra", specialty: "Nadi Pariksha", fee: "1200" },
    { id: 3, name: "Kavita Iyer", specialty: "Nutritionist", fee: "600" }
  ];

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <div className="about-direct-layout" style={{ backgroundImage: "url('/images/Login img.png')", backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '120px 5% 80px 5%' }}>
        <div className="about-content-wrapper">
          <header className="about-header-simple">
            <h1 className="rx-main-title">Ayurvedic Experts</h1>
            <p className="vision-tag-gold">CERTIFIED PRACTITIONERS • SELECT YOUR HEALER</p>
          </header>

          <div className="dashboard-list-scroll">
            {practitioners.map((expert) => (
              <div key={expert.id} className="dashboard-row-item">
                <div className="dash-meta-grid">
                  <div className="dash-item"><span>Expert ID</span><p>#{expert.id}</p></div>
                  <div className="dash-item"><span>Practitioner</span><p>{expert.name}</p></div>
                  <div className="dash-item"><span>Specialization</span><p className="text-diagnosis-highlight">{expert.specialty}</p></div>
                  <div className="dash-item"><span>Fee</span><p>₹{expert.fee}</p></div>
                  <div className="dash-item-btn">
                    <button className="parrot-outline-btn" onClick={() => { setSelectedExpert(expert); setSelectedDate(""); setSelectedSlot(""); setBusySlots([]); setShowModal(true); }}>Book Slot</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="modal-content" style={{ maxWidth: '550px', padding: '35px', background: '#0a2113', borderRadius: '20px' }}>
            <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Schedule Consultation</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-field-wrapper">
                <label>Age</label>
                <input type="number" className="custom-input" value={userProfile.age} onChange={(e) => setUserProfile({...userProfile, age: e.target.value})} />
              </div>
              <div className="input-field-wrapper">
                <label>Gender</label>
                <select className="custom-select" value={userProfile.gender} onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="input-field-wrapper">
                <label>Date</label>
                <input 
                  type="date" 
                  className="custom-input" 
                  min={new Date().toISOString().split("T")[0]} 
                  value={selectedDate} 
                  onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }} 
                />
              </div>
              <div className="input-field-wrapper">
                <label>Time Slot</label>
                <select 
                  className="custom-select" 
                  value={selectedSlot} 
                  onChange={(e) => setSelectedSlot(e.target.value)} 
                  disabled={!selectedDate}
                >
                  <option value="">{selectedDate ? "Choose" : "Pick Date First"}</option>
                  {timeSlots.map(slot => {
                    const isBusy = busySlots.includes(slot);
                    return (
                      <option key={slot} value={slot} disabled={isBusy} style={{ color: isBusy ? '#ff4d4d' : 'white' }}>
                        {slot} {isBusy ? "— (Occupied)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="input-field-wrapper" style={{ marginTop: '20px' }}>
              <label>Reference Assessment</label>
              <select className="custom-select" value={selectedRefIndex} onChange={(e) => setSelectedRefIndex(e.target.value)}>
                <option value="">Choose History Record</option>
                {history.map((h, i) => <option key={i} value={i}>Ref #{history.length - i} — ({h.result})</option>)}
              </select>
            </div>

            <div className="input-field-wrapper" style={{ marginTop: '20px' }}>
              <label>Upload Health Reports</label>
              <input type="file" className="custom-input" style={{ padding: '8px' }} onChange={(e) => setReportFile(e.target.files[0])} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button className="logout-btn-light" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="parrot-action-btn-large" style={{ flex: 2 }} onClick={confirmBooking}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}