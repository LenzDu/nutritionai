import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useApiPopupStore } from '../stores'; // update the path to your Zustand store

const ApiPopupModal = () => {
  const { apiKey, setApiKey, showApiModal, setShowApiModal } = useApiPopupStore();
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(localApiKey);
    setShowApiModal(false);
  };

  const handleCancel = () => {
    // Reset to the persisted apiKey state
    setLocalApiKey(apiKey);
    setShowApiModal(false);
  };

  return (
    <Modal show={showApiModal} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>API Key Setup</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter API Key"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
          />
          <Form.Text className="text-muted">
            This API key is only stored locally in your browser and
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
};

export default ApiPopupModal;