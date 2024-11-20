import React, { useState } from 'react';
import axios from 'axios';
import './ClientInfo.css';

const ClientInfo = () => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState('questionnaire');
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    buildingType: '',
    contactPerson: '',
    contactPhone: '',
  });

  const handleUploadSelection = (type) => {
    setSelectedUpload(type);
  };

  const toggleManualEntry = () => {
    setIsManualEntry(!isManualEntry);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', selectedUpload);  // Send the type of upload

    axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(response => alert('File uploaded successfully!'))
      .catch(error => console.error('Error uploading file:', error));
  };

  return (
    <div className="client-info-container">
      <h2>Client Information</h2>

      <div className="toggle-container">
        <label>Manual Entry</label>
        <div className={`toggle-switch ${isManualEntry ? 'active' : ''}`} onClick={toggleManualEntry}>
          <div className={`toggle-slider ${isManualEntry ? 'active' : ''}`} />
        </div>
      </div>

      <div className="file-upload-container">
        {isManualEntry ? (
          // Manual entry form
          <div className="manual-entry-fields">
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
              />
            </div>
            {/* Additional fields here */}
          </div>
        ) : (
          // Upload section with "drag your file" prompt
          <div className="upload-selection">
            <button
              className={`bubble-button ${selectedUpload === 'questionnaire' ? 'selected' : ''}`}
              onClick={() => handleUploadSelection('questionnaire')}
            >
              Questionnaire Upload
            </button>
            <button
              className={`bubble-button ${selectedUpload === 'onboarding' ? 'selected' : ''}`}
              onClick={() => handleUploadSelection('onboarding')}
            >
              Onboarding Upload
            </button>
            <div className="upload-box">
              <p>Upload or drag your file here for {selectedUpload === 'questionnaire' ? 'Questionnaire' : 'Onboarding'}</p>
              <input type="file" onChange={handleFileUpload} />
            </div>
          </div>
        )}
      </div>

      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ClientInfo;
