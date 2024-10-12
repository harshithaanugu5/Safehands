import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCalendarCheck, faNotesMedical, faUserEdit, faSearch } from '@fortawesome/free-solid-svg-icons';

const PatientDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="main-content fullContainer">
      <div className="header bg-gradient-primary pb-8 pt-5 pt-md-8">
        <div className="container-fluid">
          <h2 className="text-center mb-5">Patient Dashboard</h2>
          <div className="header-body">
            <div className="row">
              {/* Card 1 */}
              <div className="col-md-6 mb-4">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Book Appointment</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-primary shadow">
                          <FontAwesomeIcon icon={faCalendarCheck} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/book-appointment")}>
                Book Now
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
                        <span className="h2 font-weight-bold mb-0">Medical Records</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-danger">
                         <FontAwesomeIcon icon={faNotesMedical} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/medical-history")}>
                View Medical Records
                      </Button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-md-6">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Profile</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-success">
                          <FontAwesomeIcon icon={faUserEdit} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/profile")}>
                Edit Profile
                      </Button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="col-md-6">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Predict Disease</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-secondary">
                         <FontAwesomeIcon icon={faSearch} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/predict-disease")}>
                      Predict
                      </Button>
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
