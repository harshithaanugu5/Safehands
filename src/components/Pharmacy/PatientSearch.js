import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Table, Container, Form, Button } from 'react-bootstrap';
import MedicineModal from '../Modal/MedicineModal'; // Import the modal component

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [latestAppointments, setLatestAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(
        collection(db, 'appointments'),
        where('status', '==', 'Completed')
      );

      const querySnapshot = await getDocs(q);
      const fetchedAppointments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        patientName: doc.data().patientName,
        appointmentDate: new Date(doc.data().date),
      }));

      setAppointments(fetchedAppointments);
      const latest = filterLatestAppointments(fetchedAppointments);
      setLatestAppointments(latest);
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAppointments(latestAppointments);
    } else {
      const filtered = latestAppointments.filter((appointment) =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAppointments(filtered);
    }
  }, [searchTerm, latestAppointments]);

  const filterLatestAppointments = (appointments) => {
    const latestAppointmentsMap = new Map();

    appointments.forEach((appointment) => {
      const { patientName, appointmentDate } = appointment;

      if (!latestAppointmentsMap.has(patientName)) {
        latestAppointmentsMap.set(patientName, appointment);
      } else {
        const existingAppointment = latestAppointmentsMap.get(patientName);
        if (appointmentDate > existingAppointment.appointmentDate) {
          latestAppointmentsMap.set(patientName, appointment);
        }
      }
    });

    return Array.from(latestAppointmentsMap.values());
  };

  const handleProvideMedicines = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center">Patient Search</h2>
      <Form>
        <Form.Group id="patient" className="mb-3">
          <Form.Label htmlFor="patient">Patient Name</Form.Label>
          <Form.Control
            id="patient"
            type="text"
            placeholder="Enter patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>
      <div className="table-responsive">
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Latest Appointment ID</th>
            <th>Latest Appointment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{index + 1}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.id}</td>
              <td>{appointment.appointmentDate.toLocaleDateString()}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleProvideMedicines(appointment)}
                >
                  Provide Medicines
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>

      {selectedAppointment && (
        <MedicineModal
          show={showModal}
          onHide={() => setShowModal(false)}
          appointment={selectedAppointment}
        />
      )}
    </Container>
  );
};

export default PatientSearch;
