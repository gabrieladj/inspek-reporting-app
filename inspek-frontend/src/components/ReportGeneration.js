import React, { useState, useEffect } from 'react';
import './ReportGeneration.css'; // Importing the CSS file for this component

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

// const preLoadedDeficiencies = [
//   "Crack in facade",
//   "Water leakage",
//   "Loose window",
//   "Roof damage",
//   "Chimney problem"
// ];

const ReportGeneration = () => {
  const [reportType, setReportType] = useState('proposal');
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    buildingType: '',
    existingClient: 'yes', // Default to "Yes"
    numberOfBuildings: 0,
    facades: [],
    deficiencies: [],
  });
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    // Fetch clients from MongoDB
    fetch(`${API_BASE_URL}/clients`)
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  const handleExistingClientChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      existingClient: value,
    }));

    if (value === 'no') {
      window.location.href = `/client-info`;
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleGenerateReport = () => {
    if (selectedClient) {
      // POST request to backend to generate the proposal
      fetch(`${API_BASE_URL}/generate-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId: selectedClient._id }),
      })
        .then((response) => response.blob())
        .then((blob) => {
          // Create a link to download the generated proposal
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Proposal-${selectedClient.clientName}.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch((error) => console.error('Error generating report:', error));
    } else {
      alert('Please select a client first!');
    }
  };

  const handleNumberOfBuildingsChange = (e) => {
    const numberOfBuildings = parseInt(e.target.value);
    const facades = Array(numberOfBuildings).fill(0);
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

      {['proposal', 'summaryReport', 'fullReport'].includes(reportType) && (
        <div className="report-fields">
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
            {formData.existingClient === 'yes' && (
              <div className="preloaded-client-fields">
                <p>Please select client from DB to generate report:</p>
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td>{client.clientName}</td>
                        <td>{client.clientAddress}</td>
                        <td>
                          <button onClick={() => handleClientSelect(client)}>
                            {selectedClient?._id === client._id ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <button type="button" className="report-generation-button" onClick={handleGenerateReport}>
        Generate Report
      </button>
    </div>
  );
};

export default ReportGeneration;
