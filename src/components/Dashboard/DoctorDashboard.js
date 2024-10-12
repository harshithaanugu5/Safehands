// components/Dashboard/DoctorDashboard.js
import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faNotesMedical, faUserEdit, faSearch } from '@fortawesome/free-solid-svg-icons';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center mb-5">Doctor Dashboard</h2>
      <div className="row">
              {/* Card 1 */}
              <div className="col-md-6 mb-4">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Appointment</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-primary shadow">
                          <FontAwesomeIcon icon={faCalendarCheck} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/appointments")}>
                      View Appointments
                    </Button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-md-6">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Patient Records</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-danger">
                         <FontAwesomeIcon icon={faNotesMedical} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/patient-records")}>
                View Records
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
      </div>
    </Container>
  );
};

export default DoctorDashboard;
