import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Style from "./comStyle.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faSignIn, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleNavLinkClick = () => {
    setExpanded(false); // Close the menu
  };

  const handleBrandClick = async () => {
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
    } else {
      navigate('/');
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif' }}>Hospital Management System</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile" className="btn btn-dark d-flex align-items-center" onClick={handleNavLinkClick}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                  Profile
                </Nav.Link>
                <Nav.Link onClick={() => { logout(); handleNavLinkClick(); }} className="btn btn-dark d-flex align-items-center">
                  <FontAwesomeIcon icon={faSignOut} style={{ marginRight: '10px' }} />
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-dark d-flex align-items-center" onClick={handleNavLinkClick}>
                  <FontAwesomeIcon icon={faSignIn} style={{ marginRight: '10px' }} />
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-dark d-flex align-items-center" onClick={handleNavLinkClick}>
                  <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '10px' }} />
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
