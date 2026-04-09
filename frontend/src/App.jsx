import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- USER COMPONENTS ---
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import PredictDosha from "./components/PredictDosha";
import PredictPrakriti from "./components/PredictPrakriti";
import Result from "./components/Result";
import Dashboard from "./components/Dashboard";
import Consultation from "./components/Consultation";
import MyConsultations from "./components/MyConsultations";
import Ayurabout from "./components/Ayurabout"; 

// --- DOCTOR COMPONENTS ---
import DrLogin from "./components/DrLogin";
import DrSignup from "./components/DrSignup";
import DoctorDashboard from "./components/DoctorDashboard";
import PrescriptionPage from "./components/PrescriptionPage";

// --- COMMON & PROTECTED ---
import ProtectedRoute from "./components/ProtectedRoute";
import AuthChoice from "./components/AuthChoice"; 
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Portal Selection (Landing Page) */}
        <Route path="/" element={<AuthChoice />} />
        
        {/* --- USER AUTH ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- USER PROTECTED ROUTES --- */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/predict-dosha" element={<ProtectedRoute><PredictDosha /></ProtectedRoute>} />
        <Route path="/predict-prakriti" element={<ProtectedRoute><PredictPrakriti /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
        <Route path="/my-consultations" element={<ProtectedRoute><MyConsultations /></ProtectedRoute>} />
        <Route path="/Ayurabout" element={<ProtectedRoute><Ayurabout /></ProtectedRoute>} />
        {/* --- DOCTOR ROUTES --- */}
        <Route path="/drlogin" element={<DrLogin />} />
        <Route path="/drsignup" element={<DrSignup />} />
        <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/prescription/:id" element={<ProtectedRoute><PrescriptionPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}