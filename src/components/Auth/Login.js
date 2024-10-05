// components/Auth/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import loginSVG from "../../assets/Images/login.svg";
import { doc, getDoc } from "firebase/firestore"; // Firestore methods for fetching data

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.role;

        // Redirect based on user role
        switch (userRole) {
          case "patient":
            navigate("/patient-dashboard");
            break;
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "pharmacist":
            navigate("/pharmacy-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            setError("Unknown user role.");
            break;
        }
      } else {
        setError("No user data found.");
      }
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col md={7}>
          <h2 className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Login</h2>
          <br/>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin} style={{ fontFamily: 'Open Sans, sans-serif' }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label><strong>Email address</strong></Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label><strong>Password</strong></Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
        </Col>
        <Col md={5}>
          <img className="HomeStyle.img" src={loginSVG} alt="Hospital SVG" />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
