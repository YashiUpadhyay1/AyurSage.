import React, { useState, useEffect, useRef } from "react";
import "../styles/FactsSection.css";

const facts = [
  {
    icon: "📜",
    value: 5000,
    suffix: "+",
    label: "Years of Knowledge",
    desc: "Ayurveda is one of the world's oldest holistic healing systems, originating in India.",
  },
  {
    icon: "🌿",
    value: 700,
    suffix: "+",
    label: "Medicinal Herbs",
    desc: "Over 700 herbs documented in Ayurvedic texts like Charaka Samhita.",
  },
  {
    icon: "👥",
    value: 80,
    suffix: "%",
    label: "Preventive Focus",
    desc: "80% of Ayurvedic practice is focused on disease prevention, not just cure.",
  },
  {
    icon: "🧬",
    value: 3,
    suffix: "",
    label: "Dosha Types",
    desc: "Vata, Pitta, and Kapha — three energies governing every human body and mind.",
  },
];

const insights = [
  {
    icon: "⚖️",
    title: "Balance is Health",
    body:
      "Ayurveda views health as a dynamic balance between body, mind, and spirit. Disease arises when this balance is disrupted.",
  },
  {
    icon: "🍃",
    title: "Food as Medicine",
    body:
      "Every food has specific qualities (gunas) that either pacify or aggravate each dosha. Eating for your type is the foundation of wellness.",
  },
  {
    icon: "🌅",
    title: "Dinacharya (Daily Routine)",
    body:
      "A structured daily routine synchronized with nature's rhythms is the cornerstone of Ayurvedic living.",
  },
  {
    icon: "🤖",
    title: "AI Meets Ayurveda",
    body:
      "AyurSage combines 5000 years of Ayurvedic knowledge with modern machine learning to give you accurate, personalized insights.",
  },
];

const useCounter = (target, duration = 2000, isVisible) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
};

const StatCard = ({ fact, isVisible }) => {
  const count = useCounter(fact.value, 2000, isVisible);
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{fact.icon}</div>
      <div className="stat-card-value">
        {count}
        {fact.suffix}
      </div>
      <div className="stat-card-label">{fact.label}</div>
      <p className="stat-card-desc">{fact.desc}</p>
    </div>
  );
};

const FactsSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="facts-section" ref={sectionRef}>
      {/* Top: Stats */}
      <div className="section-container">
        <div className={`section-title-block ${visible ? "title-visible" : ""}`}>
          <span className="section-eyebrow">By the Numbers</span>
          <h2 className="section-heading">Ayurveda in Perspective</h2>
          <p className="section-subtext">
            The science of life — rooted in millennia of human experience, validated
            by modern research.
          </p>
        </div>

        <div className="stats-grid">
          {facts.map((f, i) => (
            <div
              key={i}
              className={`stat-card-wrapper ${visible ? "stat-visible" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <StatCard fact={f} isVisible={visible} />
            </div>
          ))}
        </div>

        {/* Insights horizontal scroll */}
        <div className={`insights-row ${visible ? "title-visible" : ""}`}>
          {insights.map((ins, i) => (
            <div
              key={i}
              className="insight-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="insight-icon">{ins.icon}</span>
              <h4 className="insight-title">{ins.title}</h4>
              <p className="insight-body">{ins.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FactsSection;
