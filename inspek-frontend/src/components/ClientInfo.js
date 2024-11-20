import React, { useState } from 'react';
import axios from 'axios';
import './ClientInfo.css';

const ClientInfo = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    propertyType: '',
    yearBuilt: '',
    totalBuildingSquareFootage: '',
    numberOfFloors: '',
    typeOfInspection: '',
    droneImagery: false, // Default false, could be checkbox or dropdown for yes/no
    preferredInspectionDate: '',
    propertyRepresentativeName: '',
    propertyRepresentativePhone: '',
    propertyRepresentativeEmail: '',
    mailingAddress: '',
    roleOrRelationship: '',
    onSiteContactName: '',
    onSiteContactPhone: '',
    onSiteContactEmail: '', // Optional
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Send client data to the backend to be saved or updated
      await axios.post(`${process.env.REACT_APP_API_URL}/clients`, formData);
      alert('Client information submitted successfully!');
    } catch (error) {
      console.error('Error submitting client info:', error);
      alert('Failed to submit client information');
    }
  };

  return (
    <div className="client-info-container">
      <h2>Add a Client Manually</h2>

      <div className="manual-entry-fields">
        <div className="form-group">
          <label>Client Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Enter client name"
            required
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
            required
          />
        </div>
        <div className="form-group">
          <label>Property Type</label>
          <input
            type="text"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            placeholder="Enter property type"
            required
          />
        </div>
        <div className="form-group">
          <label>Year Built</label>
          <input
            type="number"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            placeholder="Enter year built"
            required
          />
        </div>
        <div className="form-group">
          <label>Total Building Square Footage</label>
          <input
            type="number"
            name="totalBuildingSquareFootage"
            value={formData.totalBuildingSquareFootage}
            onChange={handleChange}
            placeholder="Enter total building square footage"
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Floors</label>
          <input
            type="number"
            name="numberOfFloors"
            value={formData.numberOfFloors}
            onChange={handleChange}
            placeholder="Enter number of floors"
            required
          />
        </div>
        <div className="form-group">
          <label>Type of Inspection</label>
          <input
            type="text"
            name="typeOfInspection"
            value={formData.typeOfInspection}
            onChange={handleChange}
            placeholder="Enter type of inspection"
            required
          />
        </div>
        <div className="form-group">
          <label>Drone Imagery</label>
          <input
            type="checkbox"
            name="droneImagery"
            checked={formData.droneImagery}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Preferred Inspection Date</label>
          <input
            type="date"
            name="preferredInspectionDate"
            value={formData.preferredInspectionDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Property Representative Name</label>
          <input
            type="text"
            name="propertyRepresentativeName"
            value={formData.propertyRepresentativeName}
            onChange={handleChange}
            placeholder="Enter property representative name"
            required
          />
        </div>
        <div className="form-group">
          <label>Property Representative Phone</label>
          <input
            type="text"
            name="propertyRepresentativePhone"
            value={formData.propertyRepresentativePhone}
            onChange={handleChange}
            placeholder="Enter property representative phone"
            required
          />
        </div>
        <div className="form-group">
          <label>Property Representative Email</label>
          <input
            type="email"
            name="propertyRepresentativeEmail"
            value={formData.propertyRepresentativeEmail}
            onChange={handleChange}
            placeholder="Enter property representative email"
            required
          />
        </div>
        <div className="form-group">
          <label>Mailing Address</label>
          <input
            type="text"
            name="mailingAddress"
            value={formData.mailingAddress}
            onChange={handleChange}
            placeholder="Enter mailing address"
            required
          />
        </div>
        <div className="form-group">
          <label>Role/Relationship to the Property</label>
          <input
            type="text"
            name="roleOrRelationship"
            value={formData.roleOrRelationship}
            onChange={handleChange}
            placeholder="Enter role/relationship to the property"
            required
          />
        </div>
        <div className="form-group">
          <label>On-Site Contact Name</label>
          <input
            type="text"
            name="onSiteContactName"
            value={formData.onSiteContactName}
            onChange={handleChange}
            placeholder="Enter on-site contact name"
            required
          />
        </div>
        <div className="form-group">
          <label>On-Site Contact Phone</label>
          <input
            type="text"
            name="onSiteContactPhone"
            value={formData.onSiteContactPhone}
            onChange={handleChange}
            placeholder="Enter on-site contact phone"
            required
          />
        </div>
        <div className="form-group">
          <label>On-Site Contact Email (Optional)</label>
          <input
            type="email"
            name="onSiteContactEmail"
            value={formData.onSiteContactEmail}
            onChange={handleChange}
            placeholder="Enter on-site contact email"
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
