// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";
import Register from "./components/Auth/Register";


function App() {
  return (
    <Router>
      <Header />
      <Container className="mt-3">
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
