import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Register chart components
ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement // Register PointElement
);

const Statistics = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [pharmacistCount, setPharmacistCount] = useState(0);
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      // Fetch user counts
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
      const doctors = usersData.filter(user => user.role === 'doctor').length;
      const patients = usersData.filter(user => user.role === 'patient').length;
      const pharmacists = usersData.filter(user => user.role === 'pharmacist').length;

      setDoctorCount(doctors);
      setPatientCount(patients);
      setPharmacistCount(pharmacists);

      // Fetch daily appointments
      const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
      const appointmentsData = appointmentsSnapshot.docs.map((doc) => doc.data());
      const dailyCounts = {};

      appointmentsData.forEach((appt) => {
        const date = new Date(appt.date).toLocaleDateString();
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      setDailyAppointments(Object.entries(dailyCounts).map(([date, count]) => ({ date, count })));

      // Fetch pharmacy sales data
      const salesSnapshot = await getDocs(collection(db, 'orders'));
      const salesData = salesSnapshot.docs.map((doc) => doc.data());
      const salesByDate = {};

      salesData.forEach((order) => {
        const date = new Date(order.date).toLocaleDateString(); // Ensure you have a date field in your orders
        const totalSales = order.medicines.reduce((sum, med) => sum + med.totalCost, 0);
        salesByDate[date] = (salesByDate[date] || 0) + totalSales;
      });

      setSalesData(Object.entries(salesByDate).map(([date, sales]) => ({ date, sales })));
    };

    fetchStatistics();
  }, []);

  const pieData = {
    labels: ['Doctors', 'Patients', 'Pharmacists'],
    datasets: [{
      data: [doctorCount, patientCount, pharmacistCount],
      backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0']
    }]
  };

  const barData = {
    labels: dailyAppointments.map(appt => appt.date),
    datasets: [{
      label: 'Number of Appointments',
      data: dailyAppointments.map(appt => appt.count),
      backgroundColor: '#FFCE56'
    }]
  };

  const barOptions = {
    scales: {
      y: {
        min: 0,  // Minimum value of the y-axis
        max: 20, // Maximum value of the y-axis
        ticks: {
          stepSize: 2, // Increment step for y-axis ticks
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  const lineData = {
    labels: salesData.map(sale => sale.date),
    datasets: [{
      label: 'Total Sales',
      data: salesData.map(sale => sale.sales),
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true
    }]
  };

  return (
    <Container>
      <Row>
        <Col md={6} className="mt-5">
          <h2 className="text-center">Appointments Per Day</h2>
          <Bar data={barData} options={barOptions}/>
        </Col>
        <Col md={6} className="mt-5">
          <h2 className="text-center">Pharmacy Sales</h2>
          <Line data={lineData} />
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center">
      <Col md={4} className="d-flex flex-column align-items-center">
        <h2 className="text-center mb-4">User Distribution</h2>
        <Pie data={pieData} />
      </Col>
    </Row>
    </Container>
  );
};

export default Statistics;
