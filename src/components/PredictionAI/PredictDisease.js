import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './prediction.css';

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
  const fieldRefs = useRef({});

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

    const emptyField = Object.keys(formData).find(key => !formData[key]);
    if (emptyField) {
      fieldRefs.current[emptyField].focus();
      setError(`Please fill in the ${emptyField} field.`);
      return;
    }

    try {
      const response = await axios.post('https://heart-prediction-production.up.railway.app/predict', formData);
      setDisease(response.data.prediction);
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
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Your age in years. Heart disease risk increases with age.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            ref={el => fieldRefs.current.age = el}
            className="form-control"
            required
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="sex" className="mb-3">
          <Form.Label>Sex</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Gender: Male or Female. Risk factors may differ between genders.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            as="select"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            ref={el => fieldRefs.current.sex = el}
            className="form-control"
            required
          >
            <option value="">Select option</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="cp" className="mb-3">
          <Form.Label>
            Chest Pain Type
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Types of chest pain: 0 - Typical Angina (chest pain related to heart problems), 1 - Atypical Angina, 2 - Non-anginal Pain, 3 - Asymptomatic (no pain).</Tooltip>}
            >
              <Button variant="link">?</Button>
            </OverlayTrigger>
          </Form.Label>
          <Form.Control
            as="select"
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            ref={el => fieldRefs.current.cp = el}
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
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Blood pressure at rest, measured in mmHg. Normal range is typically around 120/80 mmHg.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            name="trestbps"
            value={formData.trestbps}
            onChange={handleChange}
            placeholder="94-200 mmHg"
            ref={el => fieldRefs.current.trestbps = el}
            className="form-control"
            required
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="chol" className="mb-3">
          <Form.Label>Serum Cholesterol</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Cholesterol level in blood, measured in mg/dl. High levels can increase heart disease risk.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            name="chol"
            value={formData.chol}
            onChange={handleChange}
            placeholder="126-564 mg/dl"
            ref={el => fieldRefs.current.chol = el}
            className="form-control"
            required
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="fbs" className="mb-3">
          <Form.Label>Fasting Blood Sugar</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Blood sugar level after fasting. Higher levels can indicate diabetes risk.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            as="select"
            name="fbs"
            value={formData.fbs}
            onChange={handleChange}
            ref={el => fieldRefs.current.fbs = el}
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
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Results from an ECG (electrocardiogram) test at rest. Abnormal results can indicate heart issues.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            as="select"
            name="restecg"
            value={formData.restecg}
            onChange={handleChange}
            ref={el => fieldRefs.current.restecg = el}
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
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Maximum heart rate achieved during exercise. Higher rates can indicate better heart health.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            name="thalach"
            value={formData.thalach}
            onChange={handleChange}
            placeholder="60-202 bpm"
            ref={el => fieldRefs.current.thalach = el}
            className="form-control"
            required
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="exang" className="mb-3">
          <Form.Label>Exercise Induced Angina</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Indicates if chest pain occurs during exercise. A sign of heart disease risk.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            as="select"
            name="exang"
            value={formData.exang}
            onChange={handleChange}
            ref={el => fieldRefs.current.exang = el}
            className="form-control"
            required
          >
            <option value="">Select option</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="oldpeak" className="mb-3">
          <Form.Label>Oldpeak</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>ST depression induced by exercise relative to rest. Higher values indicate more severe heart disease.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            name="oldpeak"
            value={formData.oldpeak}
            onChange={handleChange}
            placeholder="0-6.2"
            ref={el => fieldRefs.current.oldpeak = el}
            className="form-control"
            required
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="slope" className="mb-3">
          <Form.Label>Slope of ST Segment</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Represents the slope of the ST segment during exercise. Indicates heart condition severity.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            as="select"
            name="slope"
            value={formData.slope}
            onChange={handleChange}
            ref={el => fieldRefs.current.slope = el}
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
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Number of major blood vessels (0-3) colored by fluoroscopy. More vessels may indicate higher risk.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            name="ca"
            value={formData.ca}
            onChange={handleChange}
            placeholder="0-3"
            ref={el => fieldRefs.current.ca = el}
            className="form-control"
            required
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="thal" className="mb-3">
          <Form.Label>Thalassemia</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Types of thalassemia: 0 - Normal, 1 - Fixed defect, 2 - Reversible defect.</Tooltip>}
          >
            <Button variant="link">?</Button>
          </OverlayTrigger>
          <Form.Control
            as="select"
            name="thal"
            value={formData.thal}
            onChange={handleChange}
            ref={el => fieldRefs.current.thal = el}
            className="form-control"
            required
          >
            <option value="">Select option</option>
            <option value="0">Normal</option>
            <option value="1">Fixed defect</option>
            <option value="2">Reversible defect</option>
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
