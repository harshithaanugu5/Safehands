// PharmacyDashboard.js
import React from 'react';
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faMedkit} from '@fortawesome/free-solid-svg-icons';


const PharmacyDashboard = () => {
  const navigate = useNavigate();
  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center mb-5">Pharmacy Dashboard</h2>
      <div className="row">
              {/* Card 1 */}
              <div className="col-md-6 mb-4">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Medical Inventory</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-primary">
                          <FontAwesomeIcon icon={faListUl} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/medicine-inventory")}>
                      View Inventory
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
                        <span className="h2 font-weight-bold mb-0">Medicine Purchase</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-danger">
                         <FontAwesomeIcon icon={faMedkit} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/patient-search")}>
                Sell Medicines
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
      </div>
    </Container>
  );
};

export default PharmacyDashboard;