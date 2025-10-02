import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ show, handleClose, handleDelete }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: 'red' }}>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this item? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
