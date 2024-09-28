import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Custom context for authentication
import { db } from "../../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import singUpImg from "../../assets/Images/singup.svg"

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("patient"); // Default to patient
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male"); // Default to male
  const [place, setPlace] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth(); // signup function from AuthContext
  const navigate = useNavigate();

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      // Register user with Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        role,
        dateOfBirth,
        gender,
        place,
      });

      // Redirect to the appropriate dashboard based on role
      if (role === "patient") {
        navigate("/patient-dashboard");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "pharmacist") {
        navigate("/pharmacy-dashboard");
      }
    } catch (error) {
      setError("Failed to create an account. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col md={6}>
          <h2 className="text-center m-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group id="displayName" className="mb-3">
          <Form.Label><strong>Full Name</strong></Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Enter your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Form.Group>
        <Form.Group id="email" className="mb-3">
          <Form.Label><strong>Email Address</strong></Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group id="password" className="mb-3">
          <Form.Label><strong>Password</strong></Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group id="confirmPassword" className="mb-3">
          <Form.Label><strong>Confirm Password</strong></Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group id="dateOfBirth" className="mb-3">
          <Form.Label><strong>Date of Birth</strong></Form.Label>
          <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </Form.Group>
        <Form.Group id="gender" className="mb-3">
          <Form.Label><strong>Gender</strong></Form.Label>
          <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Select>
        </Form.Group>
        <Form.Group id="place" className="mb-3">
          <Form.Label><strong>Place</strong></Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Enter your place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </Form.Group>
        <Form.Group id="role" className="mb-3">
          <Form.Label><strong>Role</strong></Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
          </Form.Select>
        </Form.Group>
        <Button
          disabled={loading}
          className="w-100 mt-3"
          variant="primary"
          type="submit"
        >
          Register
        </Button>
      </Form>
        </Col>
        <Col md={6}>
          <img className="HomeStyle.img" src={singUpImg} alt="Singup SVG" />
        </Col>
      </Row>
    </Container>
  );
};

export default Register;