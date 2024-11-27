import React from 'react';
import './ConfirmDeleteModal.css'; // If you want to style it separately

const ConfirmDeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>This action is irreversible. Delete client and associated reports?</h3>
        <button onClick={onDelete}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
