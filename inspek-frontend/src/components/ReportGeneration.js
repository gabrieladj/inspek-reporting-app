import React, { useState, useEffect } from 'react';
import './ReportGeneration.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
const googleFormUrl = process.env.REACT_APP_GOOGLE_FORM_URL;


const ReportGeneration = () => {
  const [reportType, setReportType] = useState('proposal');
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    propertyAddress: '',
    buildingType: '',
    existingClient: '',
    numberOfBuildings: 0,
    facades: [],
    deficiencies: [],
  });
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientAction, setClientAction] = useState('');

  useEffect(() => {
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
      setClientAction('');
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleGenerateReport = () => {
    if (selectedClient) {
      fetch(`${API_BASE_URL}/generate-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClient._id }),
      })
        .then((response) => response.blob())
        .then((blob) => {
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

  const handleClientActionChange = (action) => {
    setClientAction(action);
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
                    <th>Client Name</th>
                    <th>Property Name</th>
                    <th>Description</th>
                    <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td>{client.clientName}</td>
                        <td>{client.propertyName || 'N/A'}</td>
                        <td>{client.description || 'N/A'}</td>
                        <td>
                          <button onClick={() => handleClientSelect(client)}>
                            {selectedClient?._id === client._id ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="report-generation-button" onClick={handleGenerateReport}>
                  Generate Report
                </button>
              </div>
            )}

            {formData.existingClient === 'no' && (
              <div className="client-action-options">
                <p>Would you like to:</p>
                
                <div className="client-action-bubble">
                <button
                  type="button"
                  className={`bubble-button ${clientAction === 'viewForms' ? 'selected' : ''}`}
                  onClick={() => {
                    if (googleFormUrl) {
                      window.open(googleFormUrl, '_blank');
                    } else {
                      console.error('Google Form URL is not defined!');
                    }
                  }}
                >
                  View Forms
                </button>
                  <button
                    type="button"
                    className={`bubble-button ${clientAction === 'manual' ? 'selected' : ''}`}
                    onClick={() => window.location.href = '/client-info'}
                  >
                    Manual Entry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;
