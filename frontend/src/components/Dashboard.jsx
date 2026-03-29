import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../style.css";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      const res = await axios.get("http://localhost:5000/api/dosha", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setHistory(data.reverse());
    } catch (err) {
      setHistory([]);
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="home-page-wrapper">
      <nav className="home-nav-dark">
              {/* Navbar Same As Above */}
              <div className="nav-center-links">
                <Link to="/home" className={`nav-box ${isActive("/home") ? "active" : ""}`}>Home</Link>
                <Link to="/dashboard" className={`nav-box ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
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
          padding: '100px 5% 80px 5%',
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
                const displayId = history.length - index;
                return (
                  <div key={index} className="dashboard-row-item">
                    <div className="dash-meta-grid">
                      <div className="dash-item">
                        <span>Ref ID</span>
                        <p style={{ color: '#FFD700', fontWeight: '700' }}>#{displayId}</p>
                      </div>
                      <div className="dash-item">
                        <span>Patient</span>
                        <p style={{ fontWeight: '600' }}>{r.form?.name || "User"}</p>
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
                        <p>{r.form?.age} Y</p>
                      </div>
                      <div className="dash-item-btn">
                        <button
                          className="parrot-outline-btn"
                          style={{ borderRadius: '50px', padding: '10px 30px' }}
                          onClick={() => navigate("/result", { state: { result: r.result, details: r.form, type: "Dosha", refId: displayId } })}
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
