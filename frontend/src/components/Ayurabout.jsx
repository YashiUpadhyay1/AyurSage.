import React, { useState, useRef, useEffect } from "react";
import "../styles/AboutSection.css";

const tabs = [
  {
    id: "ayurveda",
    label: "What is Ayurveda?",
    icon: "📖",
    content: {
      heading: "The Science of Life",
      intro:
        "Ayurveda — from Sanskrit 'Ayur' (life) and 'Veda' (knowledge) — is the world's oldest holistic healing system, developed in India over 5,000 years ago. It's not merely a system of treating illness; it's a comprehensive science of living that emphasizes prevention and the promotion of positive health.",
      points: [
        {
          title: "Holistic Approach",
          body:
            "Ayurveda treats the whole person — body, mind, and spirit — not just symptoms. It recognizes that health is the natural state when all systems are in harmony.",
        },
        {
          title: "Individualized Medicine",
          body:
            "No two people are the same. Your unique Prakriti (constitution) determines how you react to food, stress, climate, and lifestyle — your treatment is tailored accordingly.",
        },
        {
          title: "Root Cause Focus",
          body:
            "Rather than suppressing symptoms, Ayurveda seeks to identify and address the root imbalance causing the disease — through diet, herbs, lifestyle, and detox practices (Panchakarma).",
        },
        {
          title: "Five Element Theory",
          body:
            "All of creation — including the human body — is made of five elements: Earth (Prithvi), Water (Jal), Fire (Agni), Air (Vayu), and Ether (Akasha). These combine to form the three doshas.",
        },
      ],
    },
  },
  {
    id: "prakriti-dosha",
    label: "Prakriti & Dosha",
    icon: "🧬",
    content: {
      heading: "Your Blueprint and Your Balance",
      intro:
        "Understanding the difference between Prakriti and Dosha is fundamental to Ayurveda. Together, they form the foundation of personalized health care.",
      points: [
        {
          title: "Prakriti — Your Birth Constitution",
          body:
            "Prakriti is your unique mind-body constitution determined at conception. It remains constant throughout your life and is the baseline against which all health assessments are made. It's your personal wellness fingerprint.",
        },
        {
          title: "Vikriti — Your Current State",
          body:
            "Vikriti refers to your current doshic imbalance — how much you've deviated from your natural Prakriti due to lifestyle, diet, stress, or environment. This is what AyurSage's Dosha Prediction model assesses.",
        },
        {
          title: "Vata Dosha",
          body:
            "Composed of Air and Ether. Vata governs all movement — nerve impulses, circulation, respiration, elimination. Vata types are creative and quick but can become anxious and irregular when imbalanced.",
        },
        {
          title: "Pitta Dosha",
          body:
            "Composed of Fire and Water. Pitta governs transformation — digestion, metabolism, understanding, and perception. Pitta types are sharp and driven but can become irritable and inflamed when out of balance.",
        },
        {
          title: "Kapha Dosha",
          body:
            "Composed of Earth and Water. Kapha governs structure — all solid tissues, immune strength, and emotional stability. Kapha types are calm and strong but can become lethargic and resistant to change.",
        },
      ],
    },
  },
  {
    id: "ai-ml",
    label: "How Our AI Works",
    icon: "🤖",
    content: {
      heading: "Ancient Wisdom Meets Modern Intelligence",
      intro:
        "AyurSage bridges traditional Ayurvedic knowledge with machine learning to deliver accurate, personalized assessments. Here's how our technology pipeline works:",
      points: [
        {
          title: "Step 1 — Your Input",
          body:
            "You fill out a comprehensive questionnaire covering physical characteristics, lifestyle patterns, dietary habits, mental tendencies, and current symptoms. Each parameter is carefully mapped to Ayurvedic assessment criteria.",
        },
        {
          title: "Step 2 — Dosha Prediction Model",
          body:
            "Our first ML model (trained on validated Ayurvedic datasets) analyzes your responses to predict your dominant dosha imbalance (Vata, Pitta, or Kapha) with a confidence score. The model uses ensemble classification techniques.",
        },
        {
          title: "Step 3 — Disease Risk Model",
          body:
            "A second ML model takes your predicted dosha + your symptom inputs to identify your most likely disease risk areas — cross-referencing with traditional Ayurvedic disease-dosha mappings.",
        },
        {
          title: "Step 4 — Personalized Recommendations",
          body:
            "Based on your Prakriti and current imbalances, the system generates personalized recommendations — dietary guidelines, herbs, lifestyle adjustments, and Yoga/Pranayama practices — drawn from our curated Ayurvedic knowledge base.",
        },
        {
          title: "Step 5 — Expert Validation",
          body:
            "You can connect your AI report with a certified Ayurvedic practitioner through our consultation platform for professional validation and a deeper treatment plan.",
        },
      ],
    },
  },
];

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("ayurveda");
  const [openAccordions, setOpenAccordions] = useState({});
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const toggleAccordion = (tabId, idx) => {
    const key = `${tabId}-${idx}`;
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="section-container">
        <div className={`section-title-block ${visible ? "title-visible" : ""}`}>
          <span className="section-eyebrow">Knowledge Base</span>
          <h2 className="section-heading">About AyurSage</h2>
          <p className="section-subtext">
            Explore Ayurvedic wisdom — from ancient principles to how our AI system works.
          </p>
        </div>

        {/* Tabs */}
        <div className={`about-tabs ${visible ? "title-visible" : ""}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`about-tab ${activeTab === tab.id ? "about-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
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
  );
};

export default AboutSection;
