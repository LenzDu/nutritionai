import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ApiPopupModal({ apiKey, setApiKey, showModal, setShowModal }) {
  const handleSave = () => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    // If canceling, reset the API key to the current value in local storage
    setApiKey(localStorage.getItem('apiKey') || '');
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>API Key Setup</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Form.Text className="text-muted">
            Disclaimer: This API key is only stored locally in your browser and
            never leaves your device.
          </Form.Text>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ApiPopupModal;
