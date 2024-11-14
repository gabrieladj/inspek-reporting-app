import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientInfo.css';

const ClientInfo = () => {
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState('questionnaire'); // "questionnaire" or "onboarding"
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    buildingType: '',
    contactPerson: '',
    contactPhone: '',
  });

  const navigate = useNavigate();

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
            <div className="form-group">
              <label>Client Address</label>
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="Enter client address"
              />
            </div>
            <div className="form-group">
              <label>Property Address</label>
              <input
                type="text"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                placeholder="Enter property address"
              />
            </div>
            <div className="form-group">
              <label>Building Type</label>
              <input
                type="text"
                name="buildingType"
                value={formData.buildingType}
                onChange={handleChange}
                placeholder="Enter building type"
              />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person"
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter contact phone"
              />
            </div>
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
              <button className="upload-button">Upload</button>
            </div>
          </div>
        )}
      </div>

      <div className="submit-container">
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default ClientInfo;
