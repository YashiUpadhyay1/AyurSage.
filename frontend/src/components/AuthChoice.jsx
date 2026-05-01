import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div className="auth-container" style={{ 
      display: 'flex', 
      height: '100vh', 
      alignItems: 'center', 
      justifyContent: 'center', 
      // ── ONLY IMAGE (Color Overlay Removed) ──
      backgroundImage: "url('/images/Login img.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
        <h1 className="rx-main-title" style={{ 
          fontSize: '3.5rem', 
          marginBottom: '10px',
          textShadow: '2px 4px 10px rgba(0,0,0,0.5)' // Shadow for readability
        }}>
          Welcome to <span className="text-gold" style={{ color: '#FFD700' }}>AyurSage</span>
        </h1>
        <p className="vision-tag-gold" style={{ 
          marginBottom: '50px', 
          letterSpacing: '2px', 
          color: '#FFD700',
          fontWeight: 'bold',
          textShadow: '1px 2px 5px rgba(0,0,0,0.5)'
        }}>
          SELECT YOUR PORTAL
        </p>
        
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
          
          {/* Patient Card */}
          <div className="choice-box" onClick={() => navigate("/login")} style={cardStyle}>
            <div className="icon-circle" style={iconStyle}>👤</div>
            <h3 style={{ margin: '15px 0' }}>Patient Portal</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Check Dosha & Book Doctors</p>
          </div>

          {/* Doctor Card */}
          <div className="choice-box" onClick={() => navigate("/drlogin")} style={cardStyle}>
            <div className="icon-circle" style={iconStyle}>⚕️</div>
            <h3 style={{ margin: '15px 0' }}>Doctor Portal</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Manage Patients & Consults</p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Optimized Styles for clean background
const cardStyle = {
  background: 'rgba(2, 36, 23, 0.7)', // Semi-transparent dark green for contrast
  padding: '40px',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  transition: '0.3s all ease',
  width: '260px',
  textAlign: 'center',
  backdropFilter: 'blur(8px)', // Glassmorphism effect
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
};

const iconStyle = {
  fontSize: '40px',
  background: 'rgba(255, 215, 0, 0.15)',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FFD700',
  border: '1px solid rgba(255, 215, 0, 0.3)'
};