import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { db } from '../../firebase/config';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus} from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const { state } = useLocation();
  const { appointment, medicineList } = state;
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    try {
      const today = new Date(); // Get the current date
      const formattedDate = today.toLocaleDateString(); 
      // Save the order in the Firestore 'orders' collection
      await addDoc(collection(db, 'orders'), {
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        medicines: medicineList,
        date: formattedDate,
      });

      // Update each medicine quantity and total cost in the Firestore 'medicines' collection
      for (const med of medicineList) {
        const medRef = doc(db, 'medicines', med.id);

        // Fetch the current quantity from Firestore
        const docSnap = await getDoc(medRef);
        if (docSnap.exists()) {
          const currentQuantity = parseInt(docSnap.data().quantity, 10);
          const costPerUnit = parseFloat(docSnap.data().costPerUnit);

          // Subtract the quantity needed from the current stock
          const newQuantity = currentQuantity - med.quantity;

          // Calculate the new total cost
          const newTotalCost = newQuantity * costPerUnit;

          // Update the new quantity and total cost in Firestore
          await updateDoc(medRef, {
            quantity: newQuantity,
            totalCost: newTotalCost,
          });
        } else {
          console.log('No such document!');
        }
      }

      // Show success notification
      setShowSuccess(true);

      // Generate the PDF bill
      generatePDF();

      // Redirect after some time (optional)
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order. Try again later.');
    }
  };

  // Generate PDF with bill details
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Hospital Management System - Bill', 14, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Patient Name: ${appointment.patientName}`, 14, 40);
    doc.text(`Appointment ID: ${appointment.id}`, 14, 50);

    // Prepare table data for medicines
    const tableColumn = ['Medicine Name', 'Price per Unit', 'Quantity', 'Total Cost'];
    const tableRows = medicineList.map((med) => [
      med.name,
      `$${med.costPerUnit}`,
      med.quantity,
      `$${med.totalCost}`,
    ]);

    // Add the table to the PDF
    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
    });

    // Calculate total cost
    const totalCost = medicineList.reduce((acc, med) => acc + med.totalCost, 0);
    doc.text(`Total Cost: $${totalCost}`, 14, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save(`Bill_${appointment.patientName}_${appointment.id}.pdf`);
  };

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center">Bill for {appointment.patientName}</h2>
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          Order placed successfully! Generating your bill...
        </Alert>
      )}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Price per Unit</th>
            <th>Quantity</th>
            <th>Total Cost</th>
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
      <Button variant="primary" onClick={handlePlaceOrder}>
        Confirm and Place Order 
        <FontAwesomeIcon icon={faCartPlus} className="mx-2"/>
      </Button>
    </Container>
  );
};

export default Cart;
