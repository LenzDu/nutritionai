import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const SaveDataModal = ({ show, setShow, data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10)); // yyyy-mm-dd
  const [error, setError] = useState(null);

  if (!data) return null;

  const handleConfirm = () => {
    try {
      setError(null); // Reset previous errors
      const existingData = JSON.parse(localStorage.getItem('history')) || { 'data': { 'nutrients': {} } };

      existingData.data.nutrients[selectedDate] = data;

      localStorage.setItem('history', JSON.stringify(existingData));
      alert('Data saved correctly!');
      setShow(false);
    } catch (e) {
      setError('An error occurred while saving data.');
      console.error('Error saving data to localStorage:', e);
    }
  };

  const handleClose = () => {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Add data</p>
        <Form>
          <Form.Group>
            <Form.Label>Date:</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const SaveData = ({ data }) => {
  const [showSaveDataModal, setShowSaveDataModal] = useState(false);

  return (
    <>
      <hr></hr>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          variant="primary"
          onClick={() => setShowSaveDataModal(true)}>
          Save Results
        </Button>
      </div>

      <SaveDataModal
        show={showSaveDataModal}
        setShow={setShowSaveDataModal}
        data={data}
      />
    </>
  )
}

export default SaveData