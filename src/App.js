// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Profile from "./components/Profile/Profile";
import Home from "./components/Home/Home";
import PrivateRoute from "./components/Auth/PrivateRoute"; // For protected routes
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import DoctorDashboard from "./components/Dashboard/DoctorDashboard";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import AppointmentList from "./components/Appointments/AppointmentList";
import BookAppointment from "./components/Appointments/BookAppointment";
import PatientRecords from "./components/Appointments/PatientRecords";
import MedicalHistory from "./components/Appointments/MedicalHistory";
import MedicineInventory from "./components/Pharmacy/MedicineInventory";
import PharmacyDashboard from "./components/Pharmacy/PharmacyDashboard";
import PredictDisease from "./components/PredictionAI/PredictDisease";


function App() {
  return (
    <Router>
      <Header />
      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/doctor-dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
          <Route path="/patient-dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><AppointmentList /></PrivateRoute>} />
          <Route path="/book-appointment" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
          <Route path="/patient-records" element={<PrivateRoute><PatientRecords /></PrivateRoute>} />
          <Route path="/medical-history" element={<PrivateRoute><MedicalHistory /></PrivateRoute>} />
          <Route path="/pharmacy-dashboard" element={<PrivateRoute><PharmacyDashboard /></PrivateRoute>} />
          <Route path="/medicine-inventory" element={<PrivateRoute><MedicineInventory /></PrivateRoute>} />
          <Route path="/predict-disease" element={<PrivateRoute><PredictDisease /></PrivateRoute>} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
