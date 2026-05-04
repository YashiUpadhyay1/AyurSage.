import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Ayurnavbar from "./Ayurnavbar";
import "../style.css";

const API_BASE_URL = "https://ayur-sage.onrender.com";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Profile persistence fix
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error("User sync error"); }
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/dosha`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(Array.isArray(res.data) ? [...res.data] : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={handleLogout} />
      <div className="about-direct-layout" style={{
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 5% 80px 5%'
        }}>
        <div className="about-content-wrapper" style={{ width: '100%', maxWidth: '1200px' }}>
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="rx-main-title">Wellness Dashboard</h1>
            <p className="vision-tag-gold">CHRONOLOGICAL HISTORY • RECORDS: {history.length}</p>
          </header>

          {loading ? <p style={{textAlign:'center', color:'#A7FF83'}}>Syncing...</p> : (
            <div className="dashboard-list-scroll">
              {history.map((r, index) => {
                const displayId = history.length - index;
                const formData = r.form || r.details || {};
                
                return (
                  <div key={r._id || index} className="dashboard-row-item">
                    <div className="dash-meta-grid">
                      <div className="dash-item"><span>Ref ID</span><p>#{displayId}</p></div>
                      <div className="dash-item"><span>Patient</span><p>{formData.name || "User"}</p></div>
                      <div className="dash-item"><span>Diagnosis</span><p>{r.result}</p></div>
                      <div className="dash-item-btn">
                        <button className="parrot-outline-btn" onClick={() => {
                            // Standardized state mapping for Result.jsx
                            const resultState = { 
                              result: { 
                                predicted_dosha: r.result, 
                                predicted_disease: r.disease, 
                                treatment: r.treatment 
                              }, 
                              details: formData, 
                              type: "History Report", 
                              refId: displayId 
                            };
                            navigate("/result", { state: resultState });
                          }}>View Report</button>
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
