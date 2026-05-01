import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [user, setUser] = useState({
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "Not Provided",
    gender: localStorage.getItem("userGender") || "Not Specified",
    bloodGroup: localStorage.getItem("userBloodGroup") || "N/A",
    phone: "9876543210",
    height: "165",
    weight: "60",
    prakriti: "Pitta-Kapha",
    activity: "Moderate"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const calculateBMI = (h, w) => {
    if (!h || !w) return "N/A";
    const heightInMeters = h / 100;
    return (w / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <div style={{ background: '#022417', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", color: '#fff' }}>
      <div style={{ backgroundImage: "url('/images/Login img.png')", backgroundSize: 'cover', backgroundAttachment: 'fixed', padding: '40px 5%', minHeight: '100vh' }}>
        
        {/* --- TOP RIGHT RED BACK BUTTON --- */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '950px', margin: '0 auto 20px auto' }}>
          <button 
            onClick={() => navigate("/home")} 
            style={{ 
              background: '#FF5252', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 30px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '900', 
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(255, 82, 82, 0.3)',
              transition: '0.3s all ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#ff3333';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#FF5252';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ← BACK TO HOME
          </button>
        </div>

        <div style={{ maxWidth: '950px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', padding: '40px' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(167, 255, 131, 0.2)', paddingBottom: '20px' }}>
            <div>
              <h1 style={{ color: '#A7FF83', fontWeight: '900', fontSize: '2.2rem', margin: 0 }}>Health Passport</h1>
              <p style={{ color: '#FFD700', margin: 0, fontWeight: '700', fontSize: '0.8rem' }}>AYURVEDIC PERMANENT RECORD</p>
            </div>
            <button 
              className="main-button" 
              onClick={isEditing ? () => setIsEditing(false) : () => setIsEditing(true)}
              style={{ background: isEditing ? '#FFD700' : '#A7FF83', color: '#022417', width: 'auto', padding: '12px 30px', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer' }}
            >
              {isEditing ? "Save Updates" : "Update Vitals"}
            </button>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '50px' }}>
            {/* LEFT: STATIC IDENTITY */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '150px', height: '150px', margin: '0 auto 20px', fontSize: '3.5rem', background: 'rgba(167, 255, 131, 0.1)', color: '#A7FF83', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #A7FF83' }}>
                {user.name.charAt(0)}
              </div>
              <h2 style={{ fontWeight: '900', fontSize: '2rem', marginBottom: '5px' }}>{user.name}</h2>
              <p style={{ color: '#FFD700', fontWeight: '600', marginBottom: '25px' }}>{user.email}</p>
              
              <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(167, 255, 131, 0.1)' }}>
                <h4 style={{ color: '#A7FF83', marginBottom: '15px', borderBottom: '1px solid rgba(167,255,131,0.2)', paddingBottom: '5px' }}>🔒 Permanent Details</h4>
                <StaticRow label="Gender" value={user.gender} />
                <StaticRow label="Blood Group" value={user.bloodGroup} color="#FF5252" />
              </div>
            </div>

            {/* RIGHT: DYNAMIC VITALS */}
            <div>
              <h3 style={{ color: '#A7FF83', marginBottom: '20px' }}>🏃 Dynamic Vitals & Lifestyle</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <EditableBox label="Contact Phone" name="phone" value={user.phone} isEditing={isEditing} onChange={handleChange} />
                <EditableBox label="Height (cm)" name="height" value={user.height} isEditing={isEditing} onChange={handleChange} type="number" />
                <EditableBox label="Weight (kg)" name="weight" value={user.weight} isEditing={isEditing} onChange={handleChange} type="number" />
                
                <div style={dataBoxStyle}>
                  <small style={{ color: '#64B5F6', fontWeight: '800' }}>BMI INDEX</small>
                  <p style={{ fontWeight: '900', fontSize: '1.4rem', margin: '5px 0' }}>{calculateBMI(user.height, user.weight)}</p>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <EditableBox label="Physical Activity Level" name="activity" value={user.activity} isEditing={isEditing} onChange={handleChange} type="select" options={["Sedentary", "Moderate", "High Intensity"]} />
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(167, 255, 131, 0.05)', borderRadius: '20px', border: '1px solid rgba(167, 255, 131, 0.3)' }}>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#A7FF83' }}>
                  "Note: Permanent details like Blood Group and Gender are verified during registration and cannot be changed manually for medical accuracy."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-Components
const StaticRow = ({ label, value, color = "#fff" }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
    <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: '0.85rem' }}>{label}:</span>
    <span style={{ color: color, fontWeight: '900' }}>{value}</span>
  </div>
);

const EditableBox = ({ label, name, value, isEditing, onChange, type = "text", options }) => (
  <div style={dataBoxStyle}>
    <small style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '800', fontSize: '0.7rem' }}>{label}</small>
    {isEditing ? (
      type === "select" ? (
        <select name={name} value={value} onChange={onChange} style={inputStyle}>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>
      ) : <input type={type} name={name} value={value} onChange={onChange} style={inputStyle} />
    ) : (
      <p style={{ fontWeight: '900', fontSize: '1.2rem', margin: '5px 0' }}>{value}</p>
    )}
  </div>
);

const dataBoxStyle = {
  padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', borderLeft: '4px solid #A7FF83'
};

const inputStyle = {
  width: '100%', background: '#022417', border: '1px solid #A7FF83', color: '#fff', padding: '8px', borderRadius: '8px', marginTop: '5px', fontWeight: 'bold', outline: 'none'
};

export default Profile;