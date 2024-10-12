import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './prediction.css'; // Custom CSS

function PredictDisease() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });
  const [disease, setDisease] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisease(null);
    setError(null);

    try {
      const response = await axios.post('https://heart-prediction-production.up.railway.app/predict', formData);
      setDisease(response.data.prediction);
      console.log(disease);
      setShowModal(true);
      setFormData({
        age: '',
        sex: '',
        cp: '',
        trestbps: '',
        chol: '',
        fbs: '',
        restecg: '',
        thalach: '',
        exang: '',
        oldpeak: '',
        slope: '',
        ca: '',
        thal: ''
      });
    } catch (error) {
      setError('Error making prediction. Please try again.');
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">
        <span className="heading_font">Heart Disease Predictor</span>
      </h2>
      <div className="text-center mb-4">
        <p>
          A Machine Learning Web Application that predicts the chances of having heart disease or not, built with Flask and deployed using Heroku.
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="mx-auto p-4 shadow" style={{ maxWidth: '600px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
  <h3 className="text-center mb-4">Heart Disease Prediction Form</h3>

  <Form.Group controlId="age" className="mb-3">
    <Form.Label>Age</Form.Label>
    <Form.Control
      type="number"
      name="age"
      value={formData.age}
      onChange={handleChange}
      placeholder="Enter your age"
      className="form-control"
      required
    />
  </Form.Group>

  <Form.Group controlId="sex" className="mb-3">
    <Form.Label>Sex</Form.Label>
    <Form.Control
      as="select"
      name="sex"
      value={formData.sex}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="1">Male</option>
      <option value="0">Female</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="cp" className="mb-3">
    <Form.Label>Chest Pain Type</Form.Label>
    <Form.Control
      as="select"
      name="cp"
      value={formData.cp}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="0">Typical Angina</option>
      <option value="1">Atypical Angina</option>
      <option value="2">Non-anginal Pain</option>
      <option value="3">Asymptomatic</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="trestbps" className="mb-3">
    <Form.Label>Resting Blood Pressure</Form.Label>
    <Form.Control
      type="number"
      name="trestbps"
      value={formData.trestbps}
      onChange={handleChange}
      placeholder="94-200 mmHg"
      className="form-control"
      required
    />
  </Form.Group>

  <Form.Group controlId="chol" className="mb-3">
    <Form.Label>Serum Cholesterol</Form.Label>
    <Form.Control
      type="number"
      name="chol"
      value={formData.chol}
      onChange={handleChange}
      placeholder="126-564 mg/dl"
      className="form-control"
      required
    />
  </Form.Group>

  <Form.Group controlId="fbs" className="mb-3">
    <Form.Label>Fasting Blood Sugar</Form.Label>
    <Form.Control
      as="select"
      name="fbs"
      value={formData.fbs}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="1">Greater than 120 mg/dl</option>
      <option value="0">Less than 120 mg/dl</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="restecg" className="mb-3">
    <Form.Label>Resting ECG Results</Form.Label>
    <Form.Control
      as="select"
      name="restecg"
      value={formData.restecg}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="0">Normal</option>
      <option value="1">ST-T wave abnormality</option>
      <option value="2">Left ventricular hypertrophy</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="thalach" className="mb-3">
    <Form.Label>Max Heart Rate</Form.Label>
    <Form.Control
      type="number"
      name="thalach"
      value={formData.thalach}
      onChange={handleChange}
      placeholder="71-202 bpm"
      className="form-control"
      required
    />
  </Form.Group>

  <Form.Group controlId="exang" className="mb-3">
    <Form.Label>Exercise-induced Angina</Form.Label>
    <Form.Control
      as="select"
      name="exang"
      value={formData.exang}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="1">Yes</option>
      <option value="0">No</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="oldpeak" className="mb-3">
    <Form.Label>ST Depression</Form.Label>
    <Form.Control
      type="number"
      name="oldpeak"
      value={formData.oldpeak}
      onChange={handleChange}
      placeholder="ST depression, typically in [0-6.2]"
      step="0.1"
      className="form-control"
      required
    />
  </Form.Group>

  <Form.Group controlId="slope" className="mb-3">
    <Form.Label>Slope of the Peak Exercise ST Segment</Form.Label>
    <Form.Control
      as="select"
      name="slope"
      value={formData.slope}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="0">Upsloping</option>
      <option value="1">Flat</option>
      <option value="2">Downsloping</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="ca" className="mb-3">
    <Form.Label>Number of Major Vessels</Form.Label>
    <Form.Control
      type="number"
      name="ca"
      value={formData.ca}
      onChange={handleChange}
      placeholder="Typically in [0-4]"
      className="form-control"
      required
    />
  </Form.Group>

  <Form.Group controlId="thal" className="mb-3">
    <Form.Label>Thalassemia</Form.Label>
    <Form.Control
      as="select"
      name="thal"
      value={formData.thal}
      onChange={handleChange}
      className="form-control"
      required
    >
      <option value="">Select option</option>
      <option value="0">Normal</option>
      <option value="1">Fixed Defect</option>
      <option value="2">Reversible Defect</option>
    </Form.Control>
  </Form.Group>

  <Button variant="primary" type="submit" className="w-100 mt-4">
    Predict
  </Button>
</Form>



      <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Disease Prediction</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {disease === 1 
      ? 'You have high chances of getting a heart attack.' 
      : 'No disease detected.'}
    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default PredictDisease;
