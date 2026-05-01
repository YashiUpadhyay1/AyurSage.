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
    if (!token) {
      navigate("/login");
      return;
    }

    // User session details load karna
    const savedUserName = localStorage.getItem("userName");
    const savedUserEmail = localStorage.getItem("userEmail");
    if (savedUserName) {
      setUser({ name: savedUserName, email: savedUserEmail });
    }

    try {
      // FIX: Yahan /api/dosha ki jagah wahi route use karein jo Assessment.js model use karta hai
      // Agar aapne common endpoint rakha hai toh check karein ki wo 'Assessment' model se fetch kare
      const res = await axios.get(`${API_BASE_URL}/api/dosha`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = Array.isArray(res.data) ? res.data : [];
      
      // Latest reports ko sabse upar dikhane ke liye reverse kiya hai
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
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <div className="about-direct-layout" style={{
          backgroundImage: "url('/images/Login img.png')",
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
          minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center',
          padding: '120px 5% 80px 5%', boxSizing: 'border-box'
        }}>
        <div className="about-content-wrapper">
          <header className="about-header-simple">
            <h1 className="rx-main-title">Wellness Dashboard</h1>
            <p className="vision-tag-gold" style={{ letterSpacing: '3px' }}>
              CHRONOLOGICAL HISTORY • TOTAL RECORDS: {history.length}
            </p>
          </header>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <h2 className="rx-main-title" style={{ fontSize: '1.5rem', color: '#A7FF83' }}>Syncing Records...</h2>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h2 className="rx-main-title" style={{ fontSize: '2rem', marginBottom: '20px' }}>No History Found</h2>
              <button className="parrot-action-btn-large" onClick={() => navigate("/predict-dosha")}>Start Assessment</button>
            </div>
          ) : (
            <div className="dashboard-list-scroll">
              {history.map((r, index) => {
                const displayId = history.length - index; 
                // Dono models (Dosha aur Assessment) ko handle karne ke liye fallback keys:
                const formData = r.details || r.form || {}; 
                const resultDosha = r.dosha || r.result;
                const resultDisease = r.disease || "";
                const treatmentData = r.treatment || (r.details ? r.details.treatment : null);

                return (
                  <div key={r._id || index} className="dashboard-row-item">
                    <div className="dash-meta-grid">
                      <div className="dash-item">
                        <span>Ref ID</span>
                        <p style={{ color: '#C5F82A', fontWeight: '700' }}>#{displayId}</p>
                      </div>
                      
                      <div className="dash-item">
                        <span>Patient</span>
                        <p style={{ fontWeight: '600' }}>{formData.name || user?.name || "User"}</p>
                      </div>

                      <div className="dash-item">
                        <span>Date</span>
                        <p>{new Date(r.createdAt || r.date).toLocaleDateString('en-GB')}</p>
                      </div>

                      <div className="dash-item">
                        <span>Diagnosis</span>
                        <p className="text-diagnosis-highlight">{resultDosha}</p>
                      </div>

                      <div className="dash-item">
                        <span>Age</span>
                        <p>{formData.age ? `${formData.age} Y` : "N/A"}</p>
                      </div>

                      <div className="dash-item-btn">
                        <button
                          className="parrot-outline-btn"
                          style={{ borderRadius: '50px', padding: '10px 30px' }}
                          onClick={() => {
                            // Syncing the state structure exactly as the Result page expects it
                            const resultState = { 
                              result: { 
                                predicted_dosha: resultDosha,
                                predicted_disease: resultDisease,
                                treatment: treatmentData
                              }, 
                              details: formData, 
                              type: "History Report", 
                              refId: displayId 
                            };
                            localStorage.setItem("lastResult", JSON.stringify(resultState));
                            navigate("/result", { state: resultState });
                          }}
                        >
                          View Report
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
