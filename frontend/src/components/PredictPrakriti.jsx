import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ayurnavbar from "./Ayurnavbar";
import "../style.css";

const questions = [
  {
    question: "What is your body frame?",
    options: [
      { text: "It's thin", dosha: "Vata" },
      { text: "It's medium", dosha: "Pitta" },
      { text: "It's heavy or well built", dosha: "Kapha" }
    ]
  },
  {
    question: "Type of Hair",
    options: [
      { text: "Dry with split ends", dosha: "Vata" },
      { text: "Normal, thin, more hair fall", dosha: "Pitta" },
      { text: "Greasy, heavy", dosha: "Kapha" }
    ]
  },
  {
    question: "Color of Hair",
    options: [
      { text: "Pale brown", dosha: "Vata" },
      { text: "Red or brown", dosha: "Pitta" },
      { text: "Jet black", dosha: "Kapha" }
    ]
  },
  {
    question: "Skin",
    options: [
      { text: "Dry, rough", dosha: "Vata" },
      { text: "Soft, sweating, acne prone", dosha: "Pitta" },
      { text: "Moist, greasy", dosha: "Kapha" }
    ]
  },
  {
    question: "Complexion",
    options: [
      { text: "Dark, blackish", dosha: "Vata" },
      { text: "Pink to red", dosha: "Pitta" },
      { text: "Glowing, fair", dosha: "Kapha" }
    ]
  },
  {
    question: "Body Weight",
    options: [
      { text: "Low, difficult to gain weight", dosha: "Vata" },
      { text: "Medium, easy to gain or lose", dosha: "Pitta" },
      { text: "Overweight, difficult to lose", dosha: "Kapha" }
    ]
  },
  {
    question: "Nails",
    options: [
      { text: "Blackish, small, brittle", dosha: "Vata" },
      { text: "Reddish, small", dosha: "Pitta" },
      { text: "Pinkish, big, smooth", dosha: "Kapha" }
    ]
  },
  {
    question: "Size and color of teeth",
    options: [
      { text: "Irregular, blackish", dosha: "Vata" },
      { text: "Medium sized, yellowish", dosha: "Pitta" },
      { text: "Large, shining white", dosha: "Kapha" }
    ]
  },
  {
    question: "Pace of performing work",
    options: [
      { text: "Fast, always in hurry", dosha: "Vata" },
      { text: "Moderate, energetic", dosha: "Pitta" },
      { text: "Slow, steady", dosha: "Kapha" }
    ]
  },
  {
    question: "Mental activity",
    options: [
      { text: "Quick, restless", dosha: "Vata" },
      { text: "Smart intellect, aggressive", dosha: "Pitta" },
      { text: "Calm, stable", dosha: "Kapha" }
    ]
  },
  {
    question: "Memory",
    options: [
      { text: "Poor short-term memory", dosha: "Vata" },
      { text: "Good memory", dosha: "Pitta" },
      { text: "Excellent long-term memory", dosha: "Kapha" }
    ]
  },
  {
    question: "Grasping power",
    options: [
      { text: "Quick but forgets quickly", dosha: "Vata" },
      { text: "Quick and complete grasp", dosha: "Pitta" },
      { text: "Slow but retains longer", dosha: "Kapha" }
    ]
  },
  {
    question: "Sleep pattern",
    options: [
      { text: "Interrupted, light sleep", dosha: "Vata" },
      { text: "Moderate sleep", dosha: "Pitta" },
      { text: "Deep, long sleep", dosha: "Kapha" }
    ]
  },
  {
    question: "Intolerance to weather",
    options: [
      { text: "Cold intolerance", dosha: "Vata" },
      { text: "Heat intolerance", dosha: "Pitta" },
      { text: "Cold & damp intolerance", dosha: "Kapha" }
    ]
  },
  {
    question: "Reaction under stress",
    options: [
      { text: "Anxiety, worry", dosha: "Vata" },
      { text: "Anger, aggression", dosha: "Pitta" },
      { text: "Calm, withdrawn", dosha: "Kapha" }
    ]
  },
  {
    question: "Mood",
    options: [
      { text: "Frequent mood swings", dosha: "Vata" },
      { text: "Slow mood changes", dosha: "Pitta" },
      { text: "Stable mood", dosha: "Kapha" }
    ]
  },
  {
    question: "Eating habit",
    options: [
      { text: "Fast eating", dosha: "Vata" },
      { text: "Moderate speed", dosha: "Pitta" },
      { text: "Slow chewing", dosha: "Kapha" }
    ]
  },
  {
    question: "Hunger",
    options: [
      { text: "Irregular hunger", dosha: "Vata" },
      { text: "Strong hunger pangs", dosha: "Pitta" },
      { text: "Can skip meals easily", dosha: "Kapha" }
    ]
  },
  {
    question: "Body temperature",
    options: [
      { text: "Low, cold hands & feet", dosha: "Vata" },
      { text: "High body heat", dosha: "Pitta" },
      { text: "Normal temperature", dosha: "Kapha" }
    ]
  },
  {
    question: "Joints",
    options: [
      { text: "Weak, cracking sound", dosha: "Vata" },
      { text: "Strong joints", dosha: "Pitta" },
      { text: "Heavy weight bearing", dosha: "Kapha" }
    ]
  },
  {
    question: "Nature",
    options: [
      { text: "Timid, jealous", dosha: "Vata" },
      { text: "Fearless, egoistic", dosha: "Pitta" },
      { text: "Forgiving, content", dosha: "Kapha" }
    ]
  },
  {
    question: "Body energy",
    options: [
      { text: "Low energy by evening", dosha: "Vata" },
      { text: "Moderate energy", dosha: "Pitta" },
      { text: "High energy all day", dosha: "Kapha" }
    ]
  },
  {
    question: "Eyeball movement",
    options: [
      { text: "Fast moving eyes", dosha: "Vata" },
      { text: "Moderate movement", dosha: "Pitta" },
      { text: "Steady eyes", dosha: "Kapha" }
    ]
  },
  {
    question: "Quality of voice",
    options: [
      { text: "Rough, broken", dosha: "Vata" },
      { text: "Fast, commanding", dosha: "Pitta" },
      { text: "Soft, deep", dosha: "Kapha" }
    ]
  },
  {
    question: "Dreams",
    options: [
      { text: "Flying, confusion", dosha: "Vata" },
      { text: "Fire, violence", dosha: "Pitta" },
      { text: "Water, gardens", dosha: "Kapha" }
    ]
  },
  {
    question: "Social relations",
    options: [
      { text: "Prefers solitude", dosha: "Vata" },
      { text: "Many friends", dosha: "Pitta" },
      { text: "Long lasting relations", dosha: "Kapha" }
    ]
  },
  {
    question: "Wealth handling",
    options: [
      { text: "Spends quickly", dosha: "Vata" },
      { text: "Balanced spending", dosha: "Pitta" },
      { text: "Prefers saving", dosha: "Kapha" }
    ]
  },
  {
    question: "Bowel movement",
    options: [
      { text: "Dry, hard stools", dosha: "Vata" },
      { text: "Loose stools", dosha: "Pitta" },
      { text: "Heavy, sticky stools", dosha: "Kapha" }
    ]
  },
  {
    question: "Walking pace",
    options: [
      { text: "Fast, long steps", dosha: "Vata" },
      { text: "Steady pace", dosha: "Pitta" },
      { text: "Slow, short steps", dosha: "Kapha" }
    ]
  },
  {
    question: "Communication style",
    options: [
      { text: "Fast, unclear", dosha: "Vata" },
      { text: "Good speaker", dosha: "Pitta" },
      { text: "Less but firm speech", dosha: "Kapha" }
    ]
  }
];

export default function PredictPrakriti() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { setUser(null); }
    }
  }, []);

  const handleSelect = (doshaType) => {
    setAnswers({ ...answers, [currentIndex]: doshaType });
  };

  const calculatePrakriti = () => {
    const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
    Object.values(answers).forEach(type => {
      if (counts[type] !== undefined) counts[type]++;
    });
    
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const percentages = {
      Vata: Math.round((counts.Vata / total) * 100) || 0,
      Pitta: Math.round((counts.Pitta / total) * 100) || 0,
      Kapha: Math.round((counts.Kapha / total) * 100) || 0
    };

    const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
    let dominant = sorted[0][0]; 

    // Logic: Dash if Top 2 are Equal AND greater than the 3rd
    if (sorted[0][1] === sorted[1][1] && sorted[0][1] > sorted[2][1]) {
      dominant = `${sorted[0][0]}-${sorted[1][0]}`;
    }

    setResult({ percentages, dominant });
  };

  const currentQuestion = questions[currentIndex] || questions[0];

  return (
    <div className="home-page-wrapper">
      <Ayurnavbar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />

      <div className="about-direct-layout" style={{ 
        backgroundImage: "url('/images/Login img.png')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '120px 5% 80px 5%' 
      }}>
        <div className="prakriti-stepper-container">
          {!result ? (
            <div className="question-step-card">
              <header className="prakriti-header" style={{ textAlign: 'center' }}>
                {/* Fixed Heading at the Start */}
                <h1 className="hero-main-title" style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#C5F82A' }}>Prakriti Assessment</h1>
                
                <p className="section-tag" style={{ fontSize: '0.75rem', opacity: 0.8 }}>QUESTION {currentIndex + 1} OF {questions.length}</p>
                <h3 className="question-text" style={{ color: 'white', marginTop: '15px', fontSize: '1.5rem' }}>{currentQuestion.question}</h3>
                
                <div className="overall-progress-bg" style={{ margin: '15px 0' }}>
                  <div className="overall-progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
              </header>

              <div className="options-vertical">
                {currentQuestion.options.map((opt, i) => (
                  <button 
                    key={i} 
                    className={`option-pill ${answers[currentIndex] === opt.dosha ? "selected" : ""}`}
                    onClick={() => handleSelect(opt.dosha)}
                  >
                    <span className="radio-circle"></span>
                    {opt.text}
                  </button>
                ))}
              </div>

              <div className="stepper-controls" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} className="parrot-outline-btn">Back</button>
                {currentIndex === questions.length - 1 ? (
                  <button className="parrot-action-btn" onClick={calculatePrakriti} disabled={!answers[currentIndex]}>Finish →</button>
                ) : (
                  <button className="parrot-action-btn" disabled={!answers[currentIndex]} onClick={() => setCurrentIndex(currentIndex + 1)}>Next</button>
                )}
              </div>
            </div>
          ) : (
            <div className="prakriti-result-card-premium" style={{ 
              width: '100%', 
              maxWidth: '480px', 
              padding: '25px', 
              border: '1.5px solid #C5F82A', 
              borderRadius: '16px', 
              background: 'transparent', 
              backdropFilter: 'blur(12px)', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              margin: '0 auto'
            }}>
              <h2 className="hero-main-title" style={{ textAlign: "center", marginBottom: '15px', fontSize: '1.5rem' }}>Your Result</h2>
              
              <div className="dominant-badge" style={{ textAlign: "center", background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '8px' }}>Primary Prakriti</p>
                <h2 className="hero-accent-text" style={{ 
                  fontSize: '3.2rem', 
                  fontWeight: '800',
                  color: '#C5F82A', 
                  margin: 0,
                  letterSpacing: '-1px'
                }}>{result.dominant}</h2>
              </div>

              <div className="percentage-bars-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                {Object.entries(result.percentages).map(([name, val]) => (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'white', fontSize: '0.8rem', fontWeight: '600' }}>
                      <span>{name}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="overall-progress-bg" style={{ height: '7px', background: 'rgba(255,255,255,0.1)' }}>
                      <div className="overall-progress-fill" style={{ 
                        width: `${val}%`, 
                        backgroundColor: name === "Vata" ? "#3498db" : name === "Pitta" ? "#e74c3c" : "#2ecc71", 
                        height: '100%', 
                        borderRadius: '10px' 
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="parrot-outline-btn" onClick={() => setResult(null)} style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}>Retake</button>
                <button className="parrot-action-btn" onClick={() => navigate("/dashboard")} style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}>Dashboard →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}