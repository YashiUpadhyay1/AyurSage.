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
  
  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.get(`${API_BASE_URL}/api/dosha`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
      <div className="about-direct-layout" style={{ padding: '120px 5% 80px 5%', minHeight: '100vh' }}>
        <div className="about-content-wrapper">
          <h1 className="rx-main-title">Wellness Dashboard</h1>
          {loading ? <p>Syncing...</p> : (
            <div className="dashboard-list-scroll">
              {history.map((r, index) => {
                const displayId = history.length - index; 
                const formData = r.form || r.details || {}; 
                const resultDosha = r.result || r.dosha;

                return (
                  <div key={r._id || index} className="dashboard-row-item">
                    <div className="dash-meta-grid">
                      <div className="dash-item"><span>Ref ID</span><p>#{displayId}</p></div>
                      <div className="dash-item"><span>Patient</span><p>{formData.name || "User"}</p></div>
                      <div className="dash-item"><span>Diagnosis</span><p>{resultDosha}</p></div>
                      <div className="dash-item-btn">
                        <button className="parrot-outline-btn" onClick={() => {
                            // FULL OBJECT 'r' bhej rahe hain[cite: 2]
                            const resultState = { 
                              result: r, 
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
