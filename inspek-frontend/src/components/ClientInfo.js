import React, { useState } from 'react';
import axios from 'axios';
import './ClientInfo.css';

const ClientInfo = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    buildingType: '',
    contactPerson: '',
    contactPhone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Send client data to the backend to be saved or updated
      const response = await axios.post('https://your-live-backend.com/api/reports', {
        clientInfo: formData,  // Include form data in the request
      });
      alert('Client information submitted successfully!');
    } catch (error) {
      console.error('Error submitting client info:', error);
      alert('Failed to submit client information');
    }
  };

  return (
    <div className="client-info-container">
      <h2>Client Information</h2>

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
            type="text"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Enter contact phone"
          />
        </div>
      </div>

      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ClientInfo;
