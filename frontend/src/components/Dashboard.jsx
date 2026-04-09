import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Ayurnavbar from "./Ayurnavbar"; // 👈 Global Modern Navbar Integrated
import "../style.css";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // 👈 For Navbar profile
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // 1. Sync User Data for Navbar
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }

    try {
      const res = await axios.get("http://localhost:5000/api/dosha", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = Array.isArray(res.data) ? res.data : [];
      
      /**
       * FIX: Hum [...data].reverse() use karenge. 
       * Taaki backend se aane wala Newest record last index par chala jaye,
       * aur numbering index+1 karne par oldest record hamesha #1 dikhe.
       */
      setHistory([...data].reverse()); 
      
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="home-page-wrapper">
      {/* ── UPDATED: Ayurnavbar globally integrated ── */}
      <Ayurnavbar user={user} onLogout={handleLogout} />

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
          padding: '120px 5% 80px 5%', // 👈 Padding increased for fixed navbar
          boxSizing: 'border-box'
        }}
      >
        <div className="about-content-wrapper">
          <header className="about-header-simple">
            <h1 className="rx-main-title">Wellness Dashboard</h1>
            <p className="vision-tag-gold" style={{ letterSpacing: '3px' }}>
              ASSESSMENT HISTORY • TOTAL RECORDS: {history.length}
            </p>
          </header>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <h2 className="rx-main-title" style={{ fontSize: '1.5rem', color: '#A7FF83' }}>Syncing Records...</h2>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h2 className="rx-main-title" style={{ fontSize: '2rem', marginBottom: '20px' }}>No History Found</h2>
              <p className="about-para-large">Aapne abhi tak koi assessment nahi kiya hai.</p>
              <button className="parrot-action-btn-large" onClick={() => navigate("/predict-dosha")}>Start Assessment</button>
            </div>
          ) : (
            <div className="dashboard-list-scroll">
              {history.map((r, index) => {
                const displayId = index + 1;
                const formData = r.form || r.details || {}; 

                return (
                  <div key={r._id || index} className="dashboard-row-item">
                    <div className="dash-meta-grid">
                      <div className="dash-item">
                        <span>Ref ID</span>
                        <p style={{ color: '#FFD700', fontWeight: '700' }}>#{displayId}</p>
                      </div>
                      <div className="dash-item">
                        <span>Patient</span>
                        <p style={{ fontWeight: '600' }}>{formData.name || "User"}</p>
                      </div>
                      <div className="dash-item">
                        <span>Date</span>
                        <p>{new Date(r.date).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div className="dash-item">
                        <span>Diagnosis</span>
                        <p className="text-diagnosis-highlight">{r.result}</p>
                      </div>
                      <div className="dash-item">
                        <span>Age</span>
                        <p>{formData.age ? `${formData.age} Y` : "N/A"}</p>
                      </div>
                      <div className="dash-item-btn">
                        <button
                          className="parrot-outline-btn"
                          style={{ borderRadius: '50px', padding: '10px 30px' }}
                          onClick={() => navigate("/result", { 
                            state: { 
                                result: { 
                                    predicted_dosha: r.result,
                                    predicted_disease: r.disease 
                                }, 
                                details: formData, 
                                type: "Dosha", 
                                refId: displayId 
                            } 
                          })}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}