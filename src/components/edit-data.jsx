import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';

const EditDataModal = ({ show, setShow, editingDate, setEditingDate, nutrientData, setNutrientData }) => {
  // const [currentDate, setCurrentDate] = useState(editingDate);
  const [nutrients, setNutrients] = useState(nutrientData[editingDate] || {});

  useEffect(() => {
    // setCurrentDate(editingDate);
    setNutrients(nutrientData[editingDate] || {});
  }, [editingDate, nutrientData]);

  const handleClose = () => {
    setNutrients(nutrientData[editingDate] || {});
    setShow(false);
  };

  const handleSave = () => {
    localStorage.setItem('history', JSON.stringify({ data: { nutrients: { ...nutrientData, [editingDate]: nutrients } } }));
    setNutrientData({ ...nutrientData, [editingDate]: nutrients });
    handleClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to remove the data for this date?")) {
      const updatedNutrients = { ...nutrientData };
      delete updatedNutrients[editingDate];
      localStorage.setItem('history', JSON.stringify({ data: { nutrients: updatedNutrients } }));
      setNutrientData(updatedNutrients);
      handleClose();
    }
  };

  const handleChange = (key, value) => {
    setNutrients({ ...nutrients, [key]: value });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Nutrient Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="datePicker">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={editingDate}
              onChange={(e) => setEditingDate(e.target.value)}
            />
          </Form.Group>
          <hr></hr>
          {Object.keys(nutrients).map(nutrient => (
            <Form.Group as={Row} key={nutrient} controlId={"edit-" + nutrient} style={{paddingBottom: '5px'}}>
              <Form.Label column xs={6}>
                {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
              </Form.Label>
              <Col xs={6}>
                <Form.Control
                  type="number"
                  value={nutrients[nutrient]}
                  onChange={(e) => handleChange(nutrient, e.target.value)}
                />
              </Col>
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete}>Remove Data</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDataModal