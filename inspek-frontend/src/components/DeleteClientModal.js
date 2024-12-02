import React from 'react';
import './ConfirmDeleteModal.css'; // Ensure correct path to the CSS file

const DeleteClientModal = ({ isOpen, onClose, onDelete, clientId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Delete Client</h2>
        <p className="modal-description">Are you sure you want to delete this client?</p>
        <p className="modal-description-danger">
            Deleting a client deletes all their associated reports too. 
        </p>
        <p className="modal-description">
            Do you wish to continue?
        </p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={() => onDelete(clientId)}>Delete</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
