import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import { getCurrentLocalDateISOString } from '../utils/date'

const SaveDataModal = ({ show, setShow, data }) => {
  const [selectedDate, setSelectedDate] = useState(getCurrentLocalDateISOString());
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState(null); // Initialize to null

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = JSON.parse(localStorage.getItem('history')) || { data: { nutrients: {} } };
        setHistoryData(loadedData);
      } catch (e) {
        console.error('Error loading history from localStorage:', e);
        setError('Failed to load history data.');
      }
    };
    loadData();
  }, []);

  const handleSave = (add = false) => {
    if (!historyData) {
      setError('Please wait until history data is loaded before saving.');
      return;
    }

    setError(null); // Reset previous errors

    const updatedHistory = { ...historyData };
    const currentDataForDate = updatedHistory.data.nutrients[selectedDate] || {};

    // Determine the new data for the selected date
    const newDataForDate = add
      ? Object.keys(data).reduce((acc, nutrient) => {
        acc[nutrient] = (currentDataForDate[nutrient] || 0) + data[nutrient];
        return acc;
      }, {})
      : data;

    updatedHistory.data.nutrients[selectedDate] = newDataForDate;

    try {
      localStorage.setItem('history', JSON.stringify(updatedHistory));
      alert(add ? 'Results added to the existing data!' : 'Results saved!');
      setShow(false);
    } catch (e) {
      setError('An error occurred while saving data.');
      console.error('Error saving data to localStorage:', e);
    }
  };

  const dataExists = !!historyData?.data.nutrients[selectedDate];

  return (
    <Modal show={show} onHide={() => { setShow(false) }}>
      <Modal.Header closeButton>
        <Modal.Title>Save Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {dataExists && (
          <Alert variant="warning">
            The date you have selected already has data. You can choose to overwrite the existing data or add this meal's data to it.
          </Alert>
        )}
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
        {dataExists ? (
          <>
            <Button variant="secondary" onClick={() => handleSave(true)} disabled={!historyData}>
              Add
            </Button>
            <Button variant="primary" onClick={() => handleSave()} disabled={!historyData}>
              Overwrite
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => handleSave()} disabled={!historyData}>
            Confirm
          </Button>
        )}
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