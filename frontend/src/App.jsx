import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import PredictDosha from "./components/PredictDosha";
import PredictPrakriti from "./components/PredictPrakriti";
import Result from "./components/Result";
import Dashboard from "./components/Dashboard";
import Consultation from "./components/Consultation";
import ProtectedRoute from "./components/ProtectedRoute";
import MyConsultations from "./components/MyConsultations";
import About from "./components/Ayurabout"; // 1. About component import kiya

import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES   */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predict-dosha"
          element={
            <ProtectedRoute>
              <PredictDosha />
            </ProtectedRoute>
          }
        />

        <Route
          path="/predict-prakriti"
          element={
            <ProtectedRoute>
              <PredictPrakriti />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultation"
          element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-consultations"
          element={
            <ProtectedRoute>
              <MyConsultations />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}