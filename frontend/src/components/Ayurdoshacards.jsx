import React, { useState, useRef, useEffect } from "react";
import "../styles/DoshaCards.css";

const doshas = [
  {
    id: "vata",
    name: "Vata",
    icon: "🌬️",
    element: "Air & Ether",
    color: "#7ECEF4",
    gradient: "linear-gradient(135deg, #7ECEF4 0%, #5BA3D9 100%)",
    tagline: "Movement & Creativity",
    short:
      "Vata governs all movement in the body and mind — breathing, circulation, and nervous impulses.",
    traits: ["Creative", "Quick-thinking", "Enthusiastic", "Light sleeper"],
    imbalance: "Anxiety, dry skin, irregular digestion, insomnia",
    balance: "Warm foods, routine, grounding practices, oil massage",
    season: "Autumn & Early Winter",
    body: "Light, thin frame with prominent joints",
    mind: "Quick learner, imaginative, easily distracted",
    emoji: "🌪️",
  },
  {
    id: "pitta",
    name: "Pitta",
    icon: "🔥",
    element: "Fire & Water",
    color: "#F4A74A",
    gradient: "linear-gradient(135deg, #F4A74A 0%, #E07B2D 100%)",
    tagline: "Transformation & Intelligence",
    short:
      "Pitta governs transformation — digestion, metabolism, and the processing of thoughts and emotions.",
    traits: ["Intelligent", "Focused", "Ambitious", "Strong digestion"],
    imbalance: "Inflammation, anger, acid reflux, skin rashes",
    balance: "Cooling foods, nature walks, meditation, moderation",
    season: "Summer",
    body: "Medium build, muscular, warm skin",
    mind: "Sharp intellect, goal-oriented, leadership",
    emoji: "⚡",
  },
  {
    id: "kapha",
    name: "Kapha",
    icon: "🌊",
    element: "Earth & Water",
    color: "#6EC98F",
    gradient: "linear-gradient(135deg, #6EC98F 0%, #3A9E6A 100%)",
    tagline: "Stability & Endurance",
    short:
      "Kapha provides structure and stability — the body's tissues, immune strength, and emotional groundedness.",
    traits: ["Calm", "Loyal", "Strong", "Deep sleeper"],
    imbalance: "Weight gain, lethargy, congestion, depression",
    balance: "Vigorous exercise, stimulating foods, new experiences",
    season: "Spring",
    body: "Heavier, well-built, great stamina",
    mind: "Patient, loving, steady, long-term memory",
    emoji: "🌿",
  },
];

const DoshaCard = ({ dosha }) => {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`dosha-card dosha-card-${dosha.id} ${visible ? "dosha-card-visible" : ""} ${expanded ? "dosha-card-expanded" : ""}`}
      style={{ "--dosha-color": dosha.color, "--dosha-gradient": dosha.gradient }}
    >
      {/* Glow effect */}
      <div className="card-glow" />

      {/* Header */}
      <div className="dosha-card-header">
        <div className="dosha-icon-wrap">
          <span className="dosha-icon">{dosha.icon}</span>
        </div>
        <div>
          <h3 className="dosha-card-name">{dosha.name}</h3>
          <span className="dosha-element">{dosha.element}</span>
        </div>
        <div className="dosha-emoji-float">{dosha.emoji}</div>
      </div>

      <p className="dosha-tagline">{dosha.tagline}</p>
      <p className="dosha-short">{dosha.short}</p>

      {/* Traits */}
      <div className="dosha-traits">
        {dosha.traits.map((t) => (
          <span key={t} className="trait-chip">{t}</span>
        ))}
      </div>

      {/* Expand toggle */}
      <button
        className="dosha-expand-btn"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show Less ▲" : "Explore More ▼"}
      </button>

      {/* Expanded content */}
      <div className={`dosha-expanded-content ${expanded ? "dosha-expanded-open" : ""}`}>
        <div className="expand-grid">
          <div className="expand-item">
            <span className="expand-label">⚠️ Imbalance Signs</span>
            <p>{dosha.imbalance}</p>
          </div>
          <div className="expand-item">
            <span className="expand-label">✅ How to Balance</span>
            <p>{dosha.balance}</p>
          </div>
          <div className="expand-item">
            <span className="expand-label">🍂 Peak Season</span>
            <p>{dosha.season}</p>
          </div>
          <div className="expand-item">
            <span className="expand-label">🧠 Mind Type</span>
            <p>{dosha.mind}</p>
          </div>
          <div className="expand-item expand-item-full">
            <span className="expand-label">🏋️ Body Type</span>
            <p>{dosha.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoshaCards = () => {
  const titleRef = useRef(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.2 }
    );
    if (titleRef.current) obs.observe(titleRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="dosha-section">
      <div className="section-container">
        <div
          ref={titleRef}
          className={`section-title-block ${titleVisible ? "title-visible" : ""}`}
        >
          <span className="section-eyebrow">Ancient Wisdom</span>
          <h2 className="section-heading">Understand the Three Doshas</h2>
          <p className="section-subtext">
            In Ayurveda, every person is a unique combination of three biological
            energies — Vata, Pitta, and Kapha. Click a card to explore yours.
          </p>
        </div>

        <div className="dosha-cards-grid">
          {doshas.map((d) => (
            <DoshaCard key={d.id} dosha={d} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoshaCards;
