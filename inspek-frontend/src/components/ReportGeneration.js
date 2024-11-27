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
  const [reports, setReports] = useState([]); // State for storing reports
  const [selectedClient, setSelectedClient] = useState(null); // Start with no selected client
  const [clientAction, setClientAction] = useState('');

  const reportsPerPage = 15; // Number of reports per page
  const [currentPage, setCurrentPage] = useState(1); // Start at page 1

  // Fetching reports when the component mounts
  useEffect(() => {
    fetch(`${API_BASE_URL}/reports`) // Adjust your API endpoint here
      .then((response) => response.json())
      .then((data) => {
        setReports(data.reverse()); // Reverse the order here
      }) 
      .catch((error) => console.error('Error fetching reports:', error));
  }, []);

  const handleExistingClientChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      existingClient: value,
    }));

    if (value === 'no') {
      setClientAction('');
      setSelectedClient(null); // Clear selected client when "No" is clicked
    }
  };

  const handleClientSelect = (report) => {
    setSelectedClient((prevSelectedClient) =>
      prevSelectedClient?._id === report._id ? null : report // Deselect if same report
    );
  };

  // Handle report generation based on selected report
  const handleGenerateReport = () => {
    if (selectedClient) {
      fetch(`${API_BASE_URL}/generate-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: selectedClient._id }), // Use report._id here
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
      alert('Please select a report first!');
    }
  };

  // Pagination logic: calculate the reports to display based on the current page
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // Function to handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const totalPages = Math.ceil(reports.length / reportsPerPage);

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
                      <th>Select User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReports.map((report) => (
                      <tr key={`${report._id}-${report.clientId?._id}`}>
                        <td>{report.clientId?.clientName}</td>
                        <td>{report.propertyInfo?.propertyName}</td>
                        <td>{report.description}</td>
                        <td>
                          <button
                            className={`select-circle ${selectedClient?._id === report._id ? 'selected' : ''}`}
                            onClick={() => handleClientSelect(report)} // Use report._id here
                          ></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination">
                  <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>{`Page ${currentPage} of ${totalPages}`}</span>
                  <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>

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
                    onClick={() => (window.location.href = '/client-info')}
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
