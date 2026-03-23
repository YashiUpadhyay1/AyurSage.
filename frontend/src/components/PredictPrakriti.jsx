import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const fullText = "Answer honestly to discover your natural constitution";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
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

    const dominant = Object.keys(percentages).reduce((a, b) =>
      percentages[a] > percentages[b] ? a : b
    );

    setResult({ percentages, dominant });
  };

  const currentQuestion = questions[currentIndex] || questions[0];

  return (
    <div className="home-page-wrapper">
      {/* UNIVERSAL NAVBAR */}
      <nav className="home-nav-dark" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div className="logo-area" onClick={() => navigate("/home")}>
          <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
          <span className="brand-name-light">AyurSage</span>
        </div>

        <div className="nav-center-links">
          <Link to="/home" className={`nav-box ${isActive("/home") ? "active" : ""}`}>Home</Link>
          <Link to="/predict-prakriti" className={`nav-box ${isActive("/predict-prakriti") ? "active" : ""}`}>Prakriti</Link>
          <Link to="/predict-dosha" className={`nav-box ${isActive("/predict-dosha") ? "active" : ""}`}>Dosha</Link>
          <Link to="/consultation" className={`nav-box ${isActive("/consultation") ? "active" : ""}`}>Consultations</Link>
          <Link to="/dashboard" className={`nav-box ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
          <Link to="/my-consultations" className={`nav-box ${isActive("/my-consultations") ? "active" : ""}`}>Booked</Link>
          <Link to="/about" className={`nav-box ${isActive("/about") ? "active" : ""}`}>About Us</Link>
        </div>

        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn-light">Logout</button>
        </div>
      </nav>

      {/* Main Assessment Content with Background */}
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
          padding: '40px 5% 80px 5%',
          boxSizing: 'border-box'
        }}
      >
        <div className="prakriti-stepper-container" style={{ marginTop: '40px' }}>
          {!result ? (
            <>
              <header className="prakriti-header">
                <p className="section-tag">QUESTION {currentIndex + 1} OF {questions.length}</p>
                <h1 className="hero-main-title">Prakriti Assessment</h1>
                <p className="hero-para" style={{ margin: "0 auto 20px auto" }}>{displayText}</p>
                
                <div className="overall-progress-bg">
                  <div 
                    className="overall-progress-fill" 
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </header>

              <div className="question-step-card">
                <h3 className="question-text">{currentIndex + 1}. {currentQuestion.question}</h3>
                
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

                <div className="stepper-controls">
                  <button 
                    disabled={currentIndex === 0} 
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="parrot-outline-btn"
                  >
                    Previous
                  </button>
                  
                  {currentIndex === questions.length - 1 ? (
                    <button 
                      className="parrot-action-btn" 
                      onClick={calculatePrakriti}
                      disabled={!answers[currentIndex]}
                    >
                      Complete Assessment →
                    </button>
                  ) : (
                    <button 
                      className="parrot-action-btn" 
                      disabled={!answers[currentIndex]}
                      onClick={() => setCurrentIndex(currentIndex + 1)}
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="prakriti-result-card-premium">
              <h2 className="hero-main-title" style={{ fontSize: "2rem", textAlign: "center" }}>Your Result</h2>
              <div className="dominant-badge" style={{ textAlign: "center" }}>
                <p>Primary Prakriti</p>
                <h2 className="hero-accent-text">{result.dominant}</h2>
              </div>

              <div className="results-grid">
                {Object.entries(result.percentages).map(([type, val]) => (
                  <div key={type} className="result-stat-item">
                    <div className="stat-info">
                      <span>{type}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="stat-bar-bg">
                      <div 
                        className={`stat-bar-fill ${type.toLowerCase()}`} 
                        style={{ 
                          width: `${val}%`,
                          background: type === 'Vata' ? '#3498db' : type === 'Pitta' ? '#e74c3c' : '#2ecc71' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="parrot-action-btn" 
                onClick={() => window.location.reload()} 
                style={{ width: "100%", marginTop: "30px" }}
              >
                Retake Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}