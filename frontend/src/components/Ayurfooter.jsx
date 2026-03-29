import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const faqs = [
  {
    q: "What is Dosha and why does it matter?",
    a: "Dosha refers to the three biological energies — Vata, Pitta, and Kapha — that govern all physical and mental functions in the body. When in balance, they maintain health. When imbalanced, they cause disease. Knowing your Dosha helps you make personalized choices about diet, lifestyle, and healthcare.",
  },
  {
    q: "How accurate is the AI Dosha prediction?",
    a: "Our ML model is trained on validated Ayurvedic datasets and achieves high classification accuracy on test data. Each prediction includes a confidence score. However, for best results, we recommend consulting a certified Ayurvedic practitioner to validate the AI's findings.",
  },
  {
    q: "Is Ayurveda scientifically validated?",
    a: "Yes — increasingly so. Numerous peer-reviewed studies have validated key Ayurvedic concepts, including the efficacy of herbs like Ashwagandha, Turmeric, and Triphala. WHO also recognizes Ayurveda as a traditional medicine system.",
  },
  {
    q: "What is the difference between Prakriti and Vikriti?",
    a: "Prakriti is your birth constitution — fixed and unchanging. Vikriti is your current state of imbalance, which changes based on diet, stress, season, and lifestyle. AyurSage assesses both.",
  },
  {
    q: "Can Ayurveda treat serious diseases?",
    a: "Ayurveda excels at preventive care, chronic condition management, and improving quality of life. For serious or acute conditions, it is best used as a complementary approach alongside conventional medicine.",
  },
  {
    q: "How do I book an expert consultation?",
    a: "Navigate to the 'Consultations' page, browse our verified Ayurvedic practitioners, select a doctor based on your preference and availability, and book a session.",
  },
];

const AyurFooter = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <footer className="footer">
      {/* FAQ */}
      <div className="footer-faq">
        <div className="section-container">
          <div className="section-title-block title-visible" style={{ marginBottom: "2.5rem" }}>
            <span className="section-eyebrow">Got Questions?</span>
            <h2 className="section-heading" style={{ fontSize: "2rem" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "faq-open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle">{openFaq === i ? "−" : "+"}</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer main */}
      <div className="footer-main">
        <div className="section-container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span>🌿</span>
                <span>Ayur<span className="logo-accent">Sage</span></span>
              </div>
              <p className="footer-brand-desc">
                Bridging 5000 years of Ayurvedic wisdom with modern AI to bring
                you personalized, preventive, holistic healthcare.
              </p>
              <div className="social-icons">
                <span className="social-icon">𝕏</span>
                <span className="social-icon">📸</span>
                <span className="social-icon">in</span>
                <span className="social-icon">▶</span>
              </div>
            </div>

            {/* Platform links */}
            <div className="footer-links-group">
              <h4 className="footer-links-heading">Platform</h4>
              <ul className="footer-links-list">
                <li><Link to="/predict-prakriti">Prakriti Analysis</Link></li>
                <li><Link to="/predict-dosha">Dosha Prediction</Link></li>
                <li><Link to="/consultation">Expert Consultation</Link></li>
                <li><Link to="/dashboard">My Dashboard</Link></li>
                <li><Link to="/my-consultations">My Bookings</Link></li>
              </ul>
            </div>

            {/* Learn links */}
            <div className="footer-links-group">
              <h4 className="footer-links-heading">Learn</h4>
              <ul className="footer-links-list">
                <li><Link to="/about">About Ayurveda</Link></li>
                <li><Link to="/home">The Three Doshas</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            {/* Account links */}
            <div className="footer-links-group">
              <h4 className="footer-links-heading">Account</h4>
              <ul className="footer-links-list">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/dashboard">My Profile</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} AyurSage. All rights reserved.</p>
            <p className="footer-disclaimer">
              AyurSage provides informational content only and is not a substitute
              for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AyurFooter;
