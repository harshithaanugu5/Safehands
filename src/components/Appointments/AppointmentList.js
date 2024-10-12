import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc} from "firebase/firestore";
import { Table, Container, Button, Modal, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext"; // Assuming you have AuthContext for managing user state

const AppointmentList = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [userData, setUserData] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchAppointmentsRef = useRef(null);

   useEffect(() => {
    fetchAppointmentsRef.current = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointmentsData);
    };

    fetchAppointmentsRef.current();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such  document!");
        }
      }
    };

    fetchUserData();   

  }, [currentUser]);


  const handleMarkCompleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowMarkCompleteModal(true);
    setPrescription("");
    setDiagnosis(""); // Reset prescription and diagnosis fields when modal opens
  };

  const handleMarkCompleteSubmit = async () => {
    try {
      const appointmentDoc = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentDoc, {
        status: "Completed",
        prescription,
        diagnosis,
      });
      setSuccessMessage("Appointment marked as completed successfully!");
      setShowMarkCompleteModal(false);
      setSelectedAppointment(null);
      // Fetch updated appointments to reflect the status change
      fetchAppointmentsRef.current();
    } catch (err) {
      setErrorMessage("Failed to mark appointment as completed. Please try again.");
    }
  };

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center">Appointments</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <div className="table-responsive">
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            {userData?.role === "doctor" && (
              <th>Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{index + 1}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.status}</td>
              {userData?.role === "doctor" && (
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={appointment.status === "Completed" || userData?.displayName !== appointment.doctorName} // Disable button for completed appointments
                    onClick={() => handleMarkCompleteClick(appointment)}
                  >
                    Mark Completed
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <Modal show={showMarkCompleteModal} onHide={() => setShowMarkCompleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mark Appointment Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to mark the appointment with patient {selectedAppointment?.patientName} as completed?</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Prescription</Form.Label>
              <Form.Control as="textarea" rows={3} value={prescription} onChange={(e) => setPrescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control as="textarea" rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMarkCompleteModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMarkCompleteSubmit}>
            Mark Completed
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentList;