import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css"; 

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const navigate = useNavigate();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0]; 
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const docName = localStorage.getItem("userName"); 
  const docEmail = localStorage.getItem("userEmail") || "contact@ayursage.com";

  // --- [FIX: UPDATED TO LIVE RENDER URL] ---
  const API_BASE_URL = "https://ayur-sage.onrender.com";

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      // Updated to live API
      const res = await axios.get(`${API_BASE_URL}/api/consultation/doctor-requests?name=${encodeURIComponent(docName)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const validAppointments = res.data.filter(app => {
        if (app.status === "Reserved") {
          const createdAt = new Date(app.createdAt || app.date); 
          const hoursPassed = (now - createdAt) / (1000 * 60 * 60);
          if (hoursPassed > 24) return false; 
        }
        return true;
      });

      setAppointments(validAppointments);
      filterByDate(validAppointments, selectedDate);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  };

  const filterByDate = (data, date) => {
    const filtered = data.filter(app => normalizeDate(app.date) === date);
    setFilteredAppointments(filtered);
  };

  useEffect(() => { 
    if (!docName) navigate("/drlogin");
    else fetchAppointments(); 
  }, [docName]);

  useEffect(() => {
    filterByDate(appointments, selectedDate);
  }, [selectedDate, appointments]);

  useEffect(() => {
    const onOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      // Updated to live API
      await axios.put(`${API_BASE_URL}/api/consultation/update-status/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert(`Consultation ${newStatus}`);
      fetchAppointments(); 
    } catch (err) {
      alert("Status update failed");
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    const cleanPath = filePath.replace(/^uploads[\\/]/, '');
    // Fetching from live Render server
    return `${API_BASE_URL}/uploads/${cleanPath}`;
  };

  const getInitials = (name) => {
    if (!name) return "D";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const upcomingAppointments = appointments
    .filter(app => normalizeDate(app.date) > todayStr) 
    .sort((a, b) => new Date(normalizeDate(a.date)) - new Date(normalizeDate(b.date)));

  return (
    <div style={{ background: 'linear-gradient(135deg, #FFFEF2 0%, #FFF9C4 100%)', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", position: 'relative' }}>
      
      <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: '300px', height: '300px', background: '#F9E79F', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.4 }}></div>

      {/* --- NAVBAR --- */}
      <nav style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/images/logo.jpeg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '10px' }} />
          <h2 style={{ color: '#023E0B', margin: 0, fontWeight: '900' }}>Doctor Console</h2>
        </div>

        <div style={{ position: 'relative' }} ref={profileRef}>
          <button onClick={() => setProfileOpen(!profileOpen)} style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#023E0B', color: 'white', border: '2px solid #F1C40F', fontWeight: 'bold', cursor: 'pointer' }}>
            {getInitials(docName)}
          </button>

          {profileOpen && (
            <div style={{ position: 'absolute', right: 0, top: '55px', background: 'white', width: '220px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #EEE' }}>
              <div style={{ padding: '15px', background: '#FFFDE7', borderBottom: '1px solid #EEE' }}>
                <p style={{ margin: 0, fontWeight: '900', fontSize: '0.9rem', color: '#023E0B' }}>{docName}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#666' }}>{docEmail}</p>
              </div>
              <Link to="/dr-profile" style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333', fontSize: '0.9rem', fontWeight: '700' }} onClick={() => setProfileOpen(false)}>My Profile</Link>
              <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{ width: '100%', textAlign: 'left', padding: '12px 15px', border: 'none', background: 'none', color: '#FF4D4D', fontWeight: '900', cursor: 'pointer' }}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div style={{ padding: '30px 5%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            <div style={{ background: '#FFF', padding: '25px', borderRadius: '20px', borderBottom: '6px solid #F39C12' }}>
                <p style={{ margin: 0, color: '#F39C12', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase' }}>Pending Requests</p>
                <h2 style={{ margin: '10px 0 0 0', fontWeight: '900', fontSize: '2.5rem', color: '#000' }}>{appointments.filter(a => a.status === 'Reserved').length}</h2>
            </div>
            <div style={{ background: '#FFF', padding: '25px', borderRadius: '20px', borderBottom: '6px solid #27AE60' }}>
                <p style={{ margin: 0, color: '#27AE60', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase' }}>Confirmed Today</p>
                <h2 style={{ margin: '10px 0 0 0', fontWeight: '900', fontSize: '2.5rem', color: '#000' }}>{filteredAppointments.filter(a => a.status === 'Confirmed' || a.status === 'Completed').length}</h2>
            </div>
            <div style={{ background: '#FFF', padding: '25px', borderRadius: '20px', borderBottom: '6px solid #3498DB' }}>
                <p style={{ margin: 0, color: '#3498DB', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase' }}>Upcoming Bookings</p>
                <h2 style={{ margin: '10px 0 0 0', fontWeight: '900', fontSize: '2.5rem', color: '#000' }}>{upcomingAppointments.length}</h2>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontWeight: '900', color: '#023E0B' }}>Schedule Calendar</h4>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '3px solid #FFF9C4', fontSize: '1.1rem', fontWeight: '900', color: '#023E0B', outline: 'none', background: '#FFFEF2' }}
              />
            </div>

            <div style={{ background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontWeight: '900', color: '#3498DB' }}>Upcoming Details</h4>
              {upcomingAppointments.length === 0 ? (
                <p style={{ color: '#999', fontSize: '0.9rem', fontWeight: '700' }}>No future appointments scheduled.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                  {upcomingAppointments.map((app) => (
                    <div key={app._id} onClick={() => setSelectedDate(normalizeDate(app.date))}
                      style={{ padding: '15px', background: '#F0F7FF', borderRadius: '15px', cursor: 'pointer', border: '1px solid #D1E9FF' }}>
                      <p style={{ margin: 0, fontWeight: '900', fontSize: '1rem', color: '#000' }}>{app.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#3498DB', fontWeight: '900' }}>Date: {app.date}</span>
                        <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '900' }}>Time: {app.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <section>
            <h3 style={{ margin: '0 0 20px 0', fontWeight: '900', fontSize: '1.8rem', color: '#023E0B' }}>Queue for {selectedDate}</h3>
            {filteredAppointments.length === 0 ? (
              <div style={{ background: 'white', padding: '100px 40px', borderRadius: '30px', textAlign: 'center', border: '3px dashed #F1C40F' }}>
                <h2 style={{color: '#F1C40F', fontWeight: '900'}}>No Appointments Found</h2>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredAppointments.map((app) => (
                  <div key={app._id} style={{ background: 'white', padding: '30px', borderRadius: '25px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.5fr', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', borderLeft: `12px solid ${app.status === 'Completed' ? '#27AE60' : (app.status === 'Confirmed' ? '#27AE60' : '#F39C12')}` }}>
                    <div>
                      <small style={{ color: '#999', fontWeight: '900', textTransform: 'uppercase' }}>Patient</small>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '900', fontSize: '1.4rem', color: '#000' }}>{app.name}</p>
                      <p style={{ margin: 0, fontWeight: '800', color: '#666' }}>{app.age}Y | {app.gender}</p>
                    </div>
                    <div>
                      <small style={{ color: '#999', fontWeight: '900', textTransform: 'uppercase' }}>Diagnosis</small>
                      <p style={{ margin: '5px 0 0 0', color: '#27AE60', fontWeight: '900' }}>{app.predictedDosha || "Prakriti"}</p>
                    </div>
                    <div>
                      <small style={{ color: '#999', fontWeight: '900', textTransform: 'uppercase' }}>Reports</small>
                      <div style={{ marginTop: '10px' }}>
                        {app.reportFile ? (
                          <a href={getFileUrl(app.reportFile)} target="_blank" rel="noreferrer" style={{ background: '#3498DB', color: 'white', padding: '10px 18px', borderRadius: '12px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '900' }}>View PDF</a>
                        ) : <span style={{ color: '#DDD', fontWeight: '900' }}>Empty</span>}
                      </div>
                    </div>
                    <div>
                      <small style={{ color: '#999', fontWeight: '900', textTransform: 'uppercase' }}>Time Slot</small>
                      <p style={{ margin: '5px 0 0 0', fontWeight: '900', color: '#000', fontSize: '1.2rem' }}>{app.time}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {app.status === "Reserved" ? (
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleStatusUpdate(app._id, "Confirmed")} style={{ background: '#27AE60', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '15px', cursor: 'pointer', fontWeight: '900' }}>Confirm</button>
                          <button onClick={() => handleStatusUpdate(app._id, "Rejected")} style={{ background: '#FFEBEB', color: '#E74C3C', border: 'none', padding: '12px 20px', borderRadius: '15px', cursor: 'pointer', fontWeight: '900' }}>Cancel</button>
                        </div>
                      ) : app.status === "Completed" ? (
                        // Persistently shows Prescribed after prescription is saved
                        <span style={{ color: '#27AE60', fontWeight: '900', fontSize: '1.2rem', padding: '15px 30px', display: 'inline-block' }}>Prescribed ✅</span>
                      ) : (
                        <button onClick={() => navigate(`/prescription/${app._id}`, { state: { patient: app } })} style={{ background: '#023E0B', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '15px', cursor: 'pointer', fontWeight: '900', fontSize: '1rem', boxShadow: '0 5px 15px rgba(2, 62, 11, 0.2)' }}>Prescribe</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}