import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { Table, Container, Button, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MedicalHistory = () => {
  const { currentUser } = useAuth();
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPatientDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    const fetchPatientRecords = async () => {
  if (currentUser && patientDetails) { // Check if patientDetails is available
    const q = query(
      collection(db, "appointments"),
      where("patientName", "==", patientDetails.displayName),
      where("status", "==", "Completed")
    );
    const querySnapshot = await getDocs(q);
    const recordsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPatientRecords(recordsData);
  }
};

    fetchPatientDetails();
    console.log(patientDetails);
    fetchPatientRecords();
  }, [currentUser, patientDetails]);

  const handleViewDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleDownloadMedicalReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Medical Report', 10, 10);

    // Add patient details
    // doc.text(`Patient Name: ${patientDetails?.displayName}`, 10, 30);
    // doc.text(`Doctor Name: ${selectedAppointment?.doctorName}`, 10, 40);
    // doc.text(`Appointment Date: ${selectedAppointment?.date}`, 10, 50);
    // doc.text(`Diagnosis: ${selectedAppointment?.diagnosis}`, 10, 60);
    // doc.text(`Prescription: ${selectedAppointment?.prescription}`, 10, 70);

    // // Add additional fields
    // doc.text(`Age: ${calculateAge(patientDetails?.dob)}`, 10, 80);
    // doc.text(`Gender: ${patientDetails?.gender}`, 10, 90);
    // doc.text(`DOB: ${patientDetails?.dob}`, 10, 100);

    // Generate PDF table
    doc.autoTable({
      head: [['Date Generated', today]],
      body: [
        ['Patient Name', patientDetails?.displayName],
        ['Doctor Name', selectedAppointment?.doctorName],
        ['Appointment Date', selectedAppointment?.date],
        ['Age', calculateAge(patientDetails?.dob)],
        ['Gender', patientDetails?.gender],
        ['DOB', patientDetails?.dob],
        ['Diagnosis', selectedAppointment?.diagnosis],
        ['Prescription', selectedAppointment?.prescription]
      ]
    });

    doc.save('medical_report.pdf');
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center">Medical History</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Appointment Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patientRecords.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td>{record.date}</td>
              <td>{record.status}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetailsClick(record)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Patient Name:</strong> {patientDetails?.displayName}</p>
          <p><strong>Doctor Name:</strong> {selectedAppointment?.doctorName}</p>
          <p><strong>Date:</strong> {selectedAppointment?.date}</p>
          <p><strong>Status:</strong> {selectedAppointment?.status}</p>
          <p><strong>Diagnosis:</strong> {selectedAppointment?.diagnosis}</p>
          <p><strong>Prescription:</strong> {selectedAppointment?.prescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadMedicalReport}>
            Download Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicalHistory;