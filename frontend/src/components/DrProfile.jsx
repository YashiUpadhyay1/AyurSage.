import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

const DrProfile = () => {
  const navigate = useNavigate();
  
  const doctor = {
    name: localStorage.getItem("userName") || "Dr. Ayush Sharma",
    email: localStorage.getItem("userEmail") || "contact@ayursage.com",
    age: 42,
    specialization: "BAMS, Ayurvedic Practitioner",
    experience: "15+ Years",
    license: "AYUR-998271",
    clinic: "AyurSage Holistic Wellness"
  };

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ 
      // Interactive Light Yellow Gradient Background
      background: 'linear-gradient(135deg, #FFFEF2 0%, #FFF9C4 100%)', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Background Elements for Interactivity */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: '#F9E79F', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: '#A7FF83', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.3 }}></div>

      <div className="prescription-container" style={{ 
        maxWidth: '750px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '40px', 
        boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        zIndex: 1,
        padding: '50px'
      }}>
        
        <header style={{ textAlign: 'center', paddingBottom: '30px', borderBottom: '2px dashed #F1C40F' }}>
           <div style={{ 
               width: '130px', height: '130px', borderRadius: '50%', 
               background: '#F1C40F', // Sun-bright Yellow
               color: '#000', 
               margin: '0 auto 20px', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               fontSize: '3.5rem', 
               fontWeight: '900', 
               border: '6px solid #FFF',
               boxShadow: '0 10px 20px rgba(241, 196, 15, 0.3)'
           }}>
             {getInitials(doctor.name)}
           </div>
           <h1 style={{ color: '#023E0B', margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>{doctor.name}</h1>
           <div style={{ 
             display: 'inline-block', 
             background: '#023E0B', 
             color: '#FFF', 
             padding: '5px 20px', 
             borderRadius: '50px', 
             marginTop: '10px',
             fontWeight: '700',
             fontSize: '0.9rem'
           }}>
             {doctor.specialization}
           </div>
        </header>

        <div style={{ padding: '40px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
                <small style={{ color: '#F39C12', fontWeight: '800', letterSpacing: '1px' }}>EMAIL ADDRESS</small>
                <p style={{ margin: '8px 0', fontWeight: '900', fontSize: '1.25rem', color: '#000' }}>
                  <strong>{doctor.email}</strong>
                </p>
            </div>

            <div>
                <small style={{ color: '#F39C12', fontWeight: '800', letterSpacing: '1px' }}>EXPERIENCE</small>
                <p style={{ margin: '8px 0', fontWeight: '900', fontSize: '1.25rem', color: '#000' }}>
                  <strong>{doctor.experience}</strong>
                </p>
            </div>

            <div>
                <small style={{ color: '#F39C12', fontWeight: '800', letterSpacing: '1px' }}>LICENSE NUMBER</small>
                <p style={{ margin: '8px 0', fontWeight: '900', fontSize: '1.25rem', color: '#023E0B' }}>
                  <strong>{doctor.license}</strong>
                </p>
            </div>

            <div>
                <small style={{ color: '#F39C12', fontWeight: '800', letterSpacing: '1px' }}>CLINIC LOCATION</small>
                <p style={{ margin: '8px 0', fontWeight: '900', fontSize: '1.25rem', color: '#000' }}>
                  <strong>{doctor.clinic}</strong>
                </p>
            </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            <button 
                onClick={() => navigate("/doctor-dashboard")}
                style={{ 
                  flex: 1,
                  background: '#023E0B', 
                  color: 'white', 
                  padding: '18px', 
                  borderRadius: '20px', 
                  border: 'none', 
                  fontWeight: '900', 
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(2, 62, 11, 0.2)',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                ← Back to Console
            </button>
            <button 
                style={{ 
                  flex: 1,
                  background: '#F1C40F', 
                  color: '#000', 
                  padding: '18px', 
                  borderRadius: '20px', 
                  border: 'none', 
                  fontWeight: '900', 
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(241, 196, 15, 0.2)',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                Edit Profile
            </button>
        </div>
      </div>
    </div>
  );
};

export default DrProfile;