import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Table, Container, Form, Button, Alert, Modal } from 'react-bootstrap';

const MedicineInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showEditMedicineModal, setShowEditMedicineModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [newMedicineName, setNewMedicineName] = useState('');
  const [newMedicineQuantity, setNewMedicineQuantity] = useState('');
  const [newMedicineCostPerUnit, setNewMedicineCostPerUnit] = useState('');
  const [editMedicineName, setEditMedicineName] = useState('');
  const [editMedicineQuantity, setEditMedicineQuantity] = useState('');
  const [editMedicineCostPerUnit, setEditMedicineCostPerUnit] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fetchMedicinesRef = useRef(null);

  useEffect(() => {
    fetchMedicinesRef.current = async () => {
      const querySnapshot = await getDocs(collection(db, "medicines"));
      const medicinesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(medicinesData);
    };

    fetchMedicinesRef.current();
  }, []);

  const handleAddMedicineSubmit = async () => {
    try {
      const newMedicine = {
        name: newMedicineName,
        quantity: newMedicineQuantity,
        costPerUnit: newMedicineCostPerUnit,
        totalCost: newMedicineQuantity * newMedicineCostPerUnit
      };
      await addDoc(collection(db, "medicines"), newMedicine);
      setSuccessMessage("Medicine added successfully!");
      setShowAddMedicineModal(false);
      setNewMedicineName('');
      setNewMedicineQuantity('');
      setNewMedicineCostPerUnit('');
      fetchMedicinesRef.current();
    } catch (err) {
      setErrorMessage("Failed to add medicine. Please try again.");
    }
  };

  const handleEditMedicineSubmit = async () => {
    try {
      const medicineRef = doc(db, "medicines", selectedMedicine.id);
      await updateDoc(medicineRef, {
        name: editMedicineName,
        quantity: editMedicineQuantity,
        costPerUnit: editMedicineCostPerUnit,
        totalCost: editMedicineQuantity * editMedicineCostPerUnit
      });
      setSuccessMessage("Medicine updated successfully!");
      setShowEditMedicineModal(false);
      setSelectedMedicine(null);
      fetchMedicinesRef.current();
    } catch (err) {
      setErrorMessage("Failed to update medicine. Please try again.");
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await deleteDoc(doc(db, "medicines", medicineId));
      setSuccessMessage("Medicine deleted successfully!");
      fetchMedicinesRef.current();
    } catch (err) {
      setErrorMessage("Failed to delete medicine. Please try again.");
    }
  };

  return (
    <Container className="mt-5 screenHandler">
      <h2 className="text-center">Medicine Inventory</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Button variant="primary" onClick={() => setShowAddMedicineModal(true)}>
        Add Medicine
      </Button>
      <div className="table-responsive">
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Cost Per Unit</th>
            <th>Total Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, index) => (
            <tr key={medicine.id}>
              <td>{index + 1}</td>
              <td>{medicine.name}</td>
              <td>{medicine.quantity}</td>
              <td>{medicine.costPerUnit}</td>
              <td>{medicine.totalCost}</td>
              <td>
                <Button className="me-2" variant="primary" size="sm" disabled>
                  Edit
                </Button>
                <Button variant="danger" size="sm" disabled>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <Modal show={showAddMedicineModal} onHide={() => setShowAddMedicineModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Medicine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control type="text" placeholder="Enter medicine name" value={newMedicineName} onChange={(e) => setNewMedicineName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" placeholder="Enter quantity" value={newMedicineQuantity} onChange={(e) => setNewMedicineQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Per Unit</Form.Label>
              <Form.Control type="number" placeholder="Enter cost per unit" value={newMedicineCostPerUnit} onChange={(e) => setNewMedicineCostPerUnit(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddMedicineModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddMedicineSubmit}>
            Add Medicine
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditMedicineModal} onHide={() => setShowEditMedicineModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Medicine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control type="text" placeholder="Enter medicine name" value={editMedicineName} onChange={(e) => setEditMedicineName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" placeholder="Enter quantity" value={editMedicineQuantity} onChange={(e) => setEditMedicineQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Per Unit</Form.Label>
              <Form.Control type="number" placeholder="Enter cost per unit" value={editMedicineCostPerUnit} onChange={(e) => setEditMedicineCostPerUnit(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditMedicineModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditMedicineSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <br/>
      <br/>
    </Container>
  );
};

export default MedicineInventory;