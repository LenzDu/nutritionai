import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDailyValueStore } from '../stores';

function DailyValueModal() {
  const { value, setValue, showModal, setShowModal } = useDailyValueStore();
  const [localValues, setLocalValues] = useState(value);

  const handleSave = () => {
    setValue(localValues);
    setShowModal(false);
  };

  const handleCancel = () => {
    setLocalValues(value); // Reset to the original values
    setShowModal(false);
  };

  const handleChange = (key) => (e) => {
    setLocalValues({
      ...localValues,
      [key]: parseFloat(e.target.value),
    });
  };

  return (
    <Modal show={showModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Daily Value Setup</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {Object.keys(localValues).map(nutrient => (
          <Form.Group as={Row} key={nutrient} style={{ paddingBottom: '5px' }}>
            <Form.Label column xs={6}>
              {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
            </Form.Label>
            <Col xs={6}>
              <Form.Control
                type="number"
                value={localValues[nutrient]}
                onChange={handleChange(nutrient)}
              />
            </Col>
          </Form.Group>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DailyValueModal;
