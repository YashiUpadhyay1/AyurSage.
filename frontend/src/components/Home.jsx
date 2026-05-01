import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AyurNavbar from "./Ayurnavbar";
import AyurHero from "./Ayurhero";
import AyurDoshaCards from "./Ayurdoshacards";
import AyurFacts from "./Ayurfacts";
import AyurFeatures from "./Ayurfeatures";
import AyurAbout from "./Ayurabout";
import AyurFooter from "./Ayurfooter";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /**
   * Effect: Session Synchronization
   * Reads individual user strings from localStorage to rebuild the user state.
   * This matches the storage logic updated in Login.jsx.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    // Set user state only if both token and name exist
    if (token && userName) {
      setUser({
        name: userName,
        email: userEmail || "",
      });
    } else if (!token) {
      // Redirect to login if no active session is found
      navigate("/login");
    }
  }, [navigate]);

  /**
   * Handler: Logout
   * Clears all session-related data from localStorage and resets local state.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="home-root">
      {/* Background visual elements */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Global Navigation */}
      <AyurNavbar user={user} onLogout={handleLogout} />

      {/* Main Content Sections */}
      <main>
        <AyurHero />
        <AyurFeatures />
        <AyurDoshaCards />
        <AyurFacts />
        
        <AyurAbout />
      </main>

      {/* Global Footer */}
      <AyurFooter />
    </div>
  );
};

export default Home;