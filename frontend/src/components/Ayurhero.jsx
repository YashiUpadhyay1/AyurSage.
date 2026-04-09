import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HeroSection.css";

const AyurHero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          heroRef.current?.classList.add("hero-visible");
        }
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      {/* Left: Text content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Modern Ayurvedic Wisdom
        </div>

        <h1 className="hero-heading">
          Making Ayurveda
          <br />
          <span className="hero-heading-gradient">Accessible to All</span>
        </h1>

        <p className="hero-subtext">
          Discover your unique mind-body constitution through ancient Ayurvedic
          science, powered by modern ML. Get personalized insights on your
          Dosha, Prakriti, and holistic wellness path — in minutes.
        </p>

        <div className="hero-cta-group">
          {/* ✅ Correct route from your App.jsx */}
          <button
            className="cta-primary"
            onClick={() => navigate("/predict-prakriti")}
          >
            <span>Start Your Assessment</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            className="cta-secondary"
            onClick={() => navigate("/about")}
          >
            Learn More
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">5000+</span>
            <span className="stat-label">Years of Wisdom</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">3</span>
            <span className="stat-label">Dosha Types</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">ML</span>
            <span className="stat-label">Driven Insights</span>
          </div>
        </div>
      </div>

      {/* Right: Animated Dosha Visual */}
      <div className="hero-visual">
        <div className="dosha-orbit-container">
          {/* Central glowing orb */}
          <div className="dosha-core">
            <div className="dosha-core-inner">
              <span className="dosha-core-symbol">ॐ</span>
              <span className="dosha-core-label">Balance</span>
            </div>
            <div className="dosha-core-ring ring-1" />
            <div className="dosha-core-ring ring-2" />
            <div className="dosha-core-ring ring-3" />
          </div>

          {/* Orbiting Dosha nodes */}
          <div className="orbit orbit-path">
            <div
              className="dosha-node vata-node"
              style={{ "--angle": "0deg" }}
            >
              <div className="node-inner">
                <span className="node-icon">🌬️</span>
                <span className="node-name">Vata</span>
                <span className="node-element">Air + Ether</span>
              </div>
            </div>
            <div
              className="dosha-node pitta-node"
              style={{ "--angle": "120deg" }}
            >
              <div className="node-inner">
                <span className="node-icon">🔥</span>
                <span className="node-name">Pitta</span>
                <span className="node-element">Fire + Water</span>
              </div>
            </div>
            <div
              className="dosha-node kapha-node"
              style={{ "--angle": "240deg" }}
            >
              <div className="node-inner">
                <span className="node-icon">🌊</span>
                <span className="node-name">Kapha</span>
                <span className="node-element">Earth + Water</span>
              </div>
            </div>
          </div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="float-particle"
              style={{
                "--delay": `${i * 0.4}s`,
                "--x": `${Math.cos((i * Math.PI * 2) / 8) * 160}px`,
                "--y": `${Math.sin((i * Math.PI * 2) / 8) * 160}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default AyurHero;
