// components/Dashboard/AdminDashboard.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilSquare, faTh} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5 fullContainer">
      <h2 className="text-center mb-5">Admin Dashboard</h2>
      <div className="row">
              {/* Card 1 */}
              <div className="col-md-6 mb-4">
                <div className="card card-stats mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <span className="h2 font-weight-bold mb-0">Hospital Statistics</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-primary">
                          <FontAwesomeIcon icon={faTh} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/statistics")}>
                      View Statistics
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
                        <span className="h2 font-weight-bold mb-0">Users</span>
                      </div>
                      <div className="col-auto">
                        <div className="icon icon-shape text-danger">
                         <FontAwesomeIcon icon={faPencilSquare} size="4x"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <Button variant="warning" onClick={() => navigate("/manage-users")}>
                Manage
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
      </div>
    </Container>
  );
};

export default AdminDashboard;
