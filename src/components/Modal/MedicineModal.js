import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus} from '@fortawesome/free-solid-svg-icons';

const MedicineModal = ({ show, onHide, appointment }) => {
  const [catalog, setCatalog] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      const querySnapshot = await getDocs(collection(db, 'medicines'));
      const medicines = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        costPerUnit: parseFloat(doc.data().costPerUnit),
        quantity: parseInt(doc.data().quantity, 10),
      }));
      setCatalog(medicines);
    };

    fetchMedicines();
  }, []);

  // Add selected medicine to the cart
  const handleAddMedicine = () => {
    if (!selectedMedicine || !quantity) return;

    const medicine = catalog.find((med) => med.name === selectedMedicine);

    if (parseInt(quantity, 10) > medicine.quantity) {
      alert(`Not enough stock available. Available quantity: ${medicine.quantity}`);
      return;
    }

    setMedicineList([
      ...medicineList,
      {
        ...medicine,
        quantity: parseInt(quantity, 10),
        totalCost: medicine.costPerUnit * parseInt(quantity, 10),
      },
    ]);

    setSelectedMedicine('');
    setQuantity('');
  };

  // Navigate to the cart page with selected medicines
  const handleGoToCart = () => {
    navigate('/cart', { state: { appointment, medicineList } });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Provide Medicines to {appointment.patientName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Medicine</Form.Label>
            <Form.Control
              as="select"
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
            >
              <option value="">Select Medicine</option>
              {catalog.map((med) => (
                <option key={med.id} value={med.name}>
                  {med.name} - ${med.costPerUnit} (Available: {med.quantity})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" onClick={handleAddMedicine}>
            Add to Cart
            <FontAwesomeIcon icon={faCartPlus} className="mx-2"/>
          </Button>
        </Form>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {medicineList.map((med, index) => (
              <tr key={index}>
                <td>{med.name}</td>
                <td>${med.costPerUnit}</td>
                <td>{med.quantity}</td>
                <td>${med.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleGoToCart}>
          Go to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicineModal;
