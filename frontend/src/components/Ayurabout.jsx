import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import Ayurnavbar from "./Ayurnavbar"; // Import matching your file name
import "../styles/AboutSection.css";

const tabs = [
  {
    id: "ayurveda",
    label: "What is Ayurveda?",
    icon: "📖",
    content: {
      heading: "The Science of Life",
      intro: "Ayurveda — from Sanskrit 'Ayur' (life) and 'Veda' (knowledge) — is the world's oldest holistic healing system, developed in India over 5,000 years ago.",
      points: [
        { title: "Holistic Approach", body: "Ayurveda treats the whole person — body, mind, and spirit — not just symptoms." },
        { title: "Individualized Medicine", body: "No two people are the same. Your unique Prakriti (constitution) determines your treatment." },
        { title: "Root Cause Focus", body: "Ayurveda seeks to address the root imbalance through diet, herbs, and lifestyle." },
        { title: "Five Element Theory", body: "Creation is made of Earth, Water, Fire, Air, and Ether. These form the three doshas." }
      ]
    }
  },
  {
    id: "prakriti-dosha",
    label: "Prakriti & Dosha",
    icon: "🧬",
    content: {
      heading: "Your Blueprint and Your Balance",
      intro: "Understanding the difference between Prakriti and Dosha is fundamental to Ayurveda.",
      points: [
        { title: "Prakriti — Your Birth Constitution", body: "Prakriti is your unique mind-body constitution determined at conception. It remains constant." },
        { title: "Vikriti — Your Current State", body: "Vikriti refers to your current imbalance due to lifestyle or stress. This is what our AI assesses." },
        { title: "Vata (Air + Ether)", body: "Governs movement. Vata types are creative but can become anxious when imbalanced." },
        { title: "Pitta (Fire + Water)", body: "Governs metabolism. Pitta types are sharp but can become irritable when imbalanced." },
        { title: "Kapha (Earth + Water)", body: "Governs structure. Kapha types are calm but can become lethargic when imbalanced." }
      ]
    }
  },
  {
    id: "ai-ml",
    label: "How Our AI Works",
    icon: "🤖",
    content: {
      heading: "Ancient Wisdom Meets Modern Intelligence",
      intro: "AyurSage bridges traditional Ayurvedic knowledge with machine learning via these 5 critical steps:",
      points: [
        { title: "Step 01 — Comprehensive User Input", body: "You provide data on physical traits, lifestyle, and mental tendencies via our intelligent questionnaire." },
        { title: "Step 02 — ML Dosha Prediction", body: "Our model predicts your dominant dosha imbalance (Vata, Pitta, or Kapha) with a confidence score." },
        { title: "Step 03 — Disease Risk Mapping", body: "A second model cross-references your dosha and symptoms to identify potential health risks." },
        { title: "Step 04 — Smart Recommendations", body: "Personalized diet, herbs, and Yoga plans are generated from our curated knowledge base." },
        { title: "Step 05 — Expert Validation", body: "Connect with certified Ayurvedic experts on our platform to finalize your clinical treatment plan." }
      ]
    }
  }
];

const AboutSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ayurveda");
  const [openAccordions, setOpenAccordions] = useState({});
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);

  // User state fetch from localStorage (for Navbar)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleAccordion = (tabId, idx) => {
    const key = `${tabId}-${idx}`;
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className="about-page-wrapper">
      {/* --- NAVBAR INTEGRATED --- */}
      <Ayurnavbar user={user} onLogout={handleLogout} />

      <section className="about-section" ref={sectionRef} style={{ paddingTop: '100px' }}>
        <div className="section-container">
          <div className={`section-title-block ${visible ? "title-visible" : ""}`}>
            <span className="section-eyebrow">Knowledge Base</span>
            <h2 className="section-heading">About AyurSage</h2>
            <p className="section-subtext">
              Explore Ayurvedic wisdom — from ancient principles to how our AI system works.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className={`about-tabs ${visible ? "title-visible" : ""}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`about-tab ${activeTab === tab.id ? "about-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeContent && (
            <div className={`about-content ${visible ? "about-content-visible" : ""}`}>
              <div className="about-content-header">
                <h3 className="about-content-heading">{activeContent.heading}</h3>
                <p className="about-content-intro">{activeContent.intro}</p>
              </div>

              <div className="about-accordion-list">
                {activeContent.points.map((point, idx) => {
                  const key = `${activeTab}-${idx}`;
                  const isOpen = openAccordions[key];
                  return (
                    <div
                      key={idx}
                      className={`accordion-item ${isOpen ? "accordion-open" : ""}`}
                    >
                      <button
                        className="accordion-header"
                        onClick={() => toggleAccordion(activeTab, idx)}
                      >
                        <span className="accordion-num">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="accordion-title">{point.title}</span>
                        <span className="accordion-arrow">{isOpen ? "▲" : "▼"}</span>
                      </button>
                      <div className="accordion-body">
                        <p>{point.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutSection;