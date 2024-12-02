import React from 'react';
import './ConfirmDeleteModal.css'; // Ensure the correct path

const DeleteReportModal = ({ isOpen, onClose, onDelete, reportId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <h2 className="modal-title">Delete Report</h2>
        <p className="modal-description">
          You are about to delete this report. This action cannot be undone.</p>
        <div className="modal-buttons">
          <button className="delete-button" onClick={() => onDelete(reportId)}>
            Delete
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReportModal;
