import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/featureCards.css";

// ✅ All paths match your App.jsx routes exactly
const features = [
  {
    id: "prakriti",
    icon: "🧬",
    title: "Prakriti Analysis",
    subtitle: "Know Your Constitution",
    description:
      "Discover your unique body-mind constitution through a comprehensive AI-powered questionnaire. Your Prakriti is your personal blueprint — determined at birth and unchanging throughout life.",
    highlight: "Most Popular",
    path: "/predict-prakriti",
    bullets: [
      "Multi-parameter body assessment",
      "Mental & emotional profiling",
      "Personalized lifestyle guidance",
      "Detailed result report",
    ],
    color: "#7ECEF4",
    gradient:
      "linear-gradient(135deg, rgba(126,206,244,0.15) 0%, rgba(91,163,217,0.08) 100%)",
    border: "rgba(126,206,244,0.4)",
    btn: "Analyze My Prakriti",
  },
  {
    id: "dosha",
    icon: "⚡",
    title: "Dosha Prediction",
    subtitle: "Current Imbalance Check",
    description:
      "Unlike your fixed Prakriti, your Dosha can fluctuate daily. Our ML model analyzes your current symptoms, lifestyle, and habits to predict active imbalances.",
    highlight: "AI-Powered",
    path: "/predict-dosha",
    bullets: [
      "Real-time symptom analysis",
      "Disease risk assessment",
      "ML confidence scoring",
      "Treatment recommendations",
    ],
    color: "#F4A74A",
    gradient:
      "linear-gradient(135deg, rgba(244,167,74,0.15) 0%, rgba(224,123,45,0.08) 100%)",
    border: "rgba(244,167,74,0.4)",
    btn: "Predict My Dosha",
  },
  {
    id: "consultation",
    icon: "👨‍⚕️",
    title: "Expert Consultation",
    subtitle: "Talk to an Ayurvedic Doctor",
    description:
      "Connect with certified Ayurvedic practitioners for personalized consultations. Book sessions, get detailed treatment plans, and track your healing journey.",
    highlight: "Live Sessions",
    path: "/consultation",
    bullets: [
      "Verified Ayurvedic doctors",
      "Online & offline sessions",
      "Herbal prescription plans",
      "Follow-up tracking",
    ],
    color: "#6EC98F",
    gradient:
      "linear-gradient(135deg, rgba(110,201,143,0.15) 0%, rgba(58,158,106,0.08) 100%)",
    border: "rgba(110,201,143,0.4)",
    btn: "Book Consultation",
  },
];

const FeatureCard = ({ feature, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`feature-card ${visible ? "feature-card-visible" : ""}`}
      style={{
        "--feature-color": feature.color,
        "--feature-gradient": feature.gradient,
        "--feature-border": feature.border,
        animationDelay: `${index * 0.15}s`,
      }}
      onClick={() => navigate(feature.path)}
    >
      <div className="feature-card-glow" />

      {feature.highlight && (
        <span className="feature-badge">{feature.highlight}</span>
      )}

      <div className="feature-icon-wrap">
        <span className="feature-icon">{feature.icon}</span>
      </div>

      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-subtitle">{feature.subtitle}</p>
      <p className="feature-desc">{feature.description}</p>

      <ul className="feature-bullets">
        {feature.bullets.map((b, i) => (
          <li key={i} className="feature-bullet">
            <span className="bullet-check">✓</span>
            {b}
          </li>
        ))}
      </ul>

      <button
        className="feature-cta"
        onClick={(e) => {
          e.stopPropagation();
          navigate(feature.path);
        }}
      >
        {feature.btn}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const AyurFeatures = () => {
  const titleRef = useRef(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleVisible(true);
      },
      { threshold: 0.2 }
    );
    if (titleRef.current) obs.observe(titleRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="features-section">
      <div className="section-container">
        <div
          ref={titleRef}
          className={`section-title-block ${titleVisible ? "title-visible" : ""}`}
        >
          <span className="section-eyebrow">Our Services</span>
          <h2 className="section-heading">Your Wellness Journey Starts Here</h2>
          <p className="section-subtext">
            Three powerful tools combining 5000 years of Ayurvedic science with
            cutting-edge AI — built to give you clarity, balance, and a path
            forward.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AyurFeatures;
