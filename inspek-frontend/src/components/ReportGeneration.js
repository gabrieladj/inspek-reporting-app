import React, { useState } from 'react';
import './ReportGeneration.css'; // Importing the CSS file for this component

// Dummy deficiency data (replace with MongoDB data)
const preLoadedDeficiencies = [
  "Crack in facade",
  "Water leakage",
  "Loose window",
  "Roof damage",
  "Chimney problem"
];

const ReportGeneration = () => {
  // Set "proposal" as the default value
  const [reportType, setReportType] = useState('proposal');  
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    buildingType: '',
    existingClient: 'no', // "yes" or "no"
    numberOfBuildings: 1,
    facades: [],
    deficiencies: [],
  });

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExistingClientChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      existingClient: value,
    }));
  };

  const handleNumberOfBuildingsChange = (e) => {
    const numberOfBuildings = parseInt(e.target.value);
    const facades = Array(numberOfBuildings).fill(0); // Start with no facades selected
    setFormData((prevData) => ({
      ...prevData,
      numberOfBuildings,
      facades,
    }));
  };

  const handleFacadeChange = (buildingIndex, e) => {
    const updatedFacades = [...formData.facades];
    updatedFacades[buildingIndex] = parseInt(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      facades: updatedFacades,
    }));
  };

  const handleDeficiencyChange = (buildingIndex, facadeIndex, e) => {
    const updatedDeficiencies = [...formData.deficiencies];
    const selectedDeficiency = e.target.value;

    if (!updatedDeficiencies[buildingIndex]) {
      updatedDeficiencies[buildingIndex] = [];
    }

    updatedDeficiencies[buildingIndex][facadeIndex] = selectedDeficiency;
    setFormData((prevData) => ({
      ...prevData,
      deficiencies: updatedDeficiencies,
    }));
  };

  const handleAddDeficiency = (buildingIndex, facadeIndex) => {
    const updatedDeficiencies = [...formData.deficiencies];
    if (!updatedDeficiencies[buildingIndex]) {
      updatedDeficiencies[buildingIndex] = [];
    }
    updatedDeficiencies[buildingIndex][facadeIndex] = 'Other (please specify)';
    setFormData((prevData) => ({
      ...prevData,
      deficiencies: updatedDeficiencies,
    }));
  };

  return (
    <div className="report-generation-container">
      <h2>Generate Report</h2>

      <div className="form-group">
        <label>Select Report Type</label>
        <div className="existing-client-bubble">
          <button
            type="button"
            className={`bubble-button ${reportType === 'proposal' ? 'selected' : ''}`}
            onClick={() => setReportType('proposal')}
          >
            Proposal
          </button>
          <button
            type="button"
            className={`bubble-button ${reportType === 'summaryReport' ? 'selected' : ''}`}
            onClick={() => setReportType('summaryReport')}
          >
            Summary Report
          </button>
          <button
            type="button"
            className={`bubble-button ${reportType === 'fullReport' ? 'selected' : ''}`}
            onClick={() => setReportType('fullReport')}
          >
            Full Report
          </button>
        </div>
      </div>

      {/* Fields for Proposal */}
      {reportType === 'proposal' && (
        <div className="proposal-fields">
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
        </div>
      )}

      {/* Full Report Fields */}
      {reportType === 'fullReport' && (
        <div className="full-report-fields">
          <div className="form-group">
            <label>Is this an existing client?</label>
            <div className="existing-client-bubble">
              <button
                type="button"
                className={`bubble-button ${formData.existingClient === 'yes' ? 'selected' : ''}`}
                onClick={() => handleExistingClientChange('yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`bubble-button ${formData.existingClient === 'no' ? 'selected' : ''}`}
                onClick={() => handleExistingClientChange('no')}
              >
                No
              </button>
            </div>
          </div>

          {/* Preload client fields if "Yes" */}
          {formData.existingClient === 'yes' && (
            <div className="preloaded-client-fields">
              <p>Preloaded client details will go here (placeholder)</p>
            </div>
          )}

          <div className="form-group">
            <label>Number of Buildings</label>
            <select
              name="numberOfBuildings"
              value={formData.numberOfBuildings}
              onChange={handleNumberOfBuildingsChange}
            >
              {Array.from({ length: 10 }, (_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <hr />

          {Array.from({ length: formData.numberOfBuildings }, (_, buildingIndex) => (
            <div key={buildingIndex} className="building-fields">
              <h3>Building {buildingIndex + 1}</h3>
              <div className="form-group">
                <label>Number of Facades</label>
                <select
                  value={formData.facades[buildingIndex] || 0}
                  onChange={(e) => handleFacadeChange(buildingIndex, e)}
                >
                  {Array.from({ length: 8 }, (_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              {Array.from({ length: formData.facades[buildingIndex] || 0 }, (_, facadeIndex) => (
                <div key={facadeIndex} className="facade-fields">
                  <div className="form-group">
                    <label>Deficiencies for Facade {facadeIndex + 1}</label>
                    <select
                      value={formData.deficiencies[buildingIndex]?.[facadeIndex] || ''}
                      onChange={(e) => handleDeficiencyChange(buildingIndex, facadeIndex, e)}
                    >
                      <option value="">Select a deficiency</option>
                      {preLoadedDeficiencies.map((deficiency, idx) => (
                        <option key={idx} value={deficiency}>
                          {deficiency}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={() => handleAddDeficiency(buildingIndex, facadeIndex)}>
                      Add Deficiency
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="report-generation-button">Generate Report</button>
    </div>
  );
};

export default ReportGeneration;
