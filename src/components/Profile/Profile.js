import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import womenProfile from '../../assets/Images/profile.png';
import menProfile from '../../assets/Images/man.png';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setEditData(docSnap.data()); // Initialize edit data with user data
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // Save updated profile data to Firestore
  const handleSaveChanges = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(docRef, editData);
        setUserData(editData); // Update the displayed data
        setShowEditModal(false); // Close the edit modal
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  return (
    <Container className="mt-5 fullContainer">
      <section className="w-100 px-3 py-4">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-9 col-lg-8 col-xl-7">
            <Card style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4">
                <div className="d-flex flex-column flex-md-row">
                  <div className="flex-shrink-0 mb-3 mb-md-0">
                    <img 
                      src={userData?.gender === "female" ? womenProfile : menProfile} 
                      alt="Profile Picture" 
                      className="img-fluid" 
                      style={{ width: '180px', borderRadius: '10px' }} 
                    />
                  </div>
                  <div className="flex-grow-1 ms-0 ms-md-3">
                    <h4 className="mb-3 text-primary">{userData?.displayName || "User"}</h4>
                    <p className="mb-2 pb-1"><strong>Role: </strong>{userData?.role || "Role"}</p>
                    <div className="d-flex flex-wrap rounded-3 p-2 mb-2 bg-body-tertiary">
                      <div className="me-4 mb-3">
                        <p className="small text-muted mb-1"><strong>Age</strong></p>
                        <p className="mb-0">{calculateAge(userData?.dateOfBirth)}</p>
                      </div>
                      <div className="me-4 mb-3">
                        <p className="small text-muted mb-1"><strong>Gender</strong></p>
                        <p className="mb-0">{userData?.gender || "Gender"}</p>
                      </div>
                      <div className="me-4 mb-3">
                        <p className="small text-muted mb-1"><strong>Place</strong></p>
                        <p className="mb-0">{userData?.place || "Place"}</p>
                      </div>
                      <div className="mb-3">
                        <p className="small text-muted mb-1"><strong>Date of Birth</strong></p>
                        <p className="mb-0">{userData?.dateOfBirth || "N/A"}</p>
                      </div>
                    </div>
                    <div className="d-flex pt-1">
                      <Button variant="outline-primary" className="me-2 flex-grow-1" onClick={() => setShowEditModal(true)}>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="editDisplayName">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                name="displayName"
                value={editData.displayName || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Role Dropdown */}
            <Form.Group className="mb-3" controlId="editRole">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={editData.role || ""} onChange={handleInputChange}>
                <option value="">Select Role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={editData.dateOfBirth || ""}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* Gender Dropdown */}
            <Form.Group className="mb-3" controlId="editGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={editData.gender || ""} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="editPlace">
              <Form.Label>Place</Form.Label>
              <Form.Control
                type="text"
                name="place"
                value={editData.place || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "N/A"; // Handle undefined date of birth
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default Profile;
