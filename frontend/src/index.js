import React from "react";
import ReactDOM from "react-dom/client";
 
// STYLE.CSS FIRST TO AVOID OVERRIDING
import "./style.css";
import "./App.css";
 
// HOME PAGE CSS
import "./styles/Home.css";
import "./styles/navbar.css";
import "./styles/HeroSection.css";
import "./styles/DoshaCards.css";
import "./styles/FactsSection.css";
import "./styles/featureCards.css";
import "./styles/AboutSection.css";
import "./styles/footer.css";
 
import App from "./App";
 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

