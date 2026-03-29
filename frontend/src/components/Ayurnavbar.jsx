import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

const AyurNavbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { label: "Home",          path: "/home" },
    { label: "Prakriti",      path: "/predict-prakriti" },
    { label: "Dosha",         path: "/predict-dosha" },
    { label: "Consultations", path: "/consultation" },
    { label: "Dashboard",     path: "/dashboard" },
    { label: "My Bookings",   path: "/my-consultations" },
    { label: "About Us",      path: "/Ayurabout" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const displayName = user?.name || user?.username || "User";
  const displayEmail = user?.email || "";

  return (
    <nav className={`ayur-navbar ${scrolled ? "ayur-navbar-scrolled" : ""}`}>
      <div className="ayur-navbar-inner">

        {/* ── Logo ── */}
        <Link to="/home" className="ayur-logo">
          <span className="ayur-logo-leaf">🌿</span>
          <span className="ayur-logo-text">
            Ayur<span className="ayur-logo-accent">Sage</span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="ayur-nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`ayur-nav-link ${
                  location.pathname === link.path ? "ayur-nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right side ── */}
        <div className="ayur-navbar-right">

          {user ? (
            <div className="ayur-profile-wrap" ref={profileRef}>
              {/* Avatar */}
              <button
                className="ayur-avatar-btn"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Profile menu"
              >
                {getInitials(displayName)}
              </button>

              {/* Dropdown */}
              <div className={`ayur-dropdown ${profileOpen ? "ayur-dropdown-open" : ""}`}>
                <div className="ayur-dropdown-header">
                  <div className="ayur-dropdown-avatar">
                    {getInitials(displayName)}
                  </div>
                  <div>
                    <p className="ayur-dropdown-name">{displayName}</p>
                    <p className="ayur-dropdown-email">{displayEmail}</p>
                  </div>
                </div>

                <hr className="ayur-dropdown-hr" />

                <Link
                  to="/dashboard"
                  className="ayur-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>📊</span> Dashboard
                </Link>
                <Link
                  to="/my-consultations"
                  className="ayur-dropdown-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>📅</span> My Bookings
                </Link>

                <hr className="ayur-dropdown-hr" />

                <button
                  className="ayur-dropdown-item ayur-dropdown-logout"
                  onClick={onLogout}
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="ayur-auth-btns">
              <Link to="/login"  className="ayur-btn-ghost">Login</Link>
              <Link to="/signup" className="ayur-btn-primary">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`ayur-hamburger ${menuOpen ? "ayur-hamburger-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`ayur-mobile-menu ${menuOpen ? "ayur-mobile-menu-open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`ayur-mobile-link ${
              location.pathname === link.path ? "ayur-nav-link-active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {!user && (
          <div className="ayur-mobile-auth">
            <Link to="/login"  className="ayur-btn-ghost"   onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="ayur-btn-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AyurNavbar;
