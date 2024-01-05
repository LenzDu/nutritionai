import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const getLocalDateISOString = () => {
  const now = new Date();
  const timeOffsetInMS = now.getTimezoneOffset() * 60000; // convert offset to milliseconds
  const adjustedDate = new Date(now - timeOffsetInMS);
  return adjustedDate.toISOString().substr(0, 10); // format to yyyy-mm-dd
};

const SaveDataModal = ({ show, setShow, data }) => {
  const [selectedDate, setSelectedDate] = useState(getLocalDateISOString()); 
  const [error, setError] = useState(null);

  if (!data) return null;

  const handleConfirm = () => {
    try {
      setError(null); // Reset previous errors
      const existingData = JSON.parse(localStorage.getItem('history')) || { 'data': { 'nutrients': {} } };

      existingData.data.nutrients[selectedDate] = data;

      localStorage.setItem('history', JSON.stringify(existingData));
      alert('Results saved!');
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
        <Modal.Title>Save Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>
          Results will be saved on your device for the day you select. You can see all results in the history page.
        </p>
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