import React from 'react';
import './ConfirmDeleteModal.css'; // Ensure this is properly linked

const ConfirmDeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-warning">Warning! You cannot undo this action!</h2>
        <p className="modal-description">
          - This action is irreversible. <br />
          - By deleting a client, you also delete their reports.
        </p>
        <p>Would you still like to delete the client?</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={onDelete}>
            Yes, delete client
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
