import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Jumbotron, Button } from 'react-bootstrap';
import svgPic from '../../assets/Images/10130.jpg';
import HomeStyle from './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const role = userData.role;

          if (role === "patient") {
            navigate("/patient-dashboard");
          } else if (role === "doctor") {
            navigate("/doctor-dashboard");
          } else if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "pharmacist") {
            navigate("/pharmacy-dashboard");
          }
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <Container fluid className="fullContainer">
      <Row className="align-items-center">
        <Col md={4}>
          <span className="HomeStyle.h1">
          <h1>Welcome to</h1>
          <h1>Hospital Management</h1>
          <h1>System</h1>
          </span>
          <p className="lead">An efficient way to manage hospital operations.</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
          Login to HMS
        </Button>
        </Col>
        <Col md={8}>
          <img className="HomeStyle.img" src={svgPic} alt="Hospital SVG" />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;