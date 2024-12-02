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
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
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

  const handleReportSelect = (report) => {
    const isSelected = selectedReport?._id === report._id;
    const newSelection = isSelected ? null : report;
  
    setSelectedReport(newSelection);
    setSelectedClient(newSelection?.clientId || null); // Automatically associate the client

    console.log('Selected Report:', newSelection); // Log the selected report here
    console.log("Selected Report Client Data:", newSelection.clientId);

  };  
  

  // Handle proposal generation based on selected report
  const handleGenerateReport = () => {
    if (selectedReport) {

      const requestBody = {
        reportId: selectedReport._id,
        clientId: selectedReport.clientId._id, // Add a default value if needed
        clientName: selectedReport.clientId.clientName || 'Unknown Client',
        mailingAddress: selectedReport.clientId.mailingAddress,
        propertyName: selectedReport.propertyInfo.propertyName,
        propertyAddress: selectedReport.clientId.propertyAddress,

        officeSpacePercentage: selectedReport.buildingDetails.officeSpacePercentage,
        warehouseSpacePercentage: selectedReport.buildingDetails.warehouseSpacePercentage,
        retailSpacePercentage: selectedReport.buildingDetails.retailSpacePercentage,
        otherSpacePercentage: selectedReport.buildingDetails.otherSpacePercentage,
        propertyRepresentativeName: selectedReport.clientId.propertyRepresentativeName,
      };
  
      const endpoint = `${API_BASE_URL}/generate-report`;
  
      console.log('POST request to:', endpoint);
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          if (blob.size > 0) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Proposal_${selectedReport.clientId?.clientName}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
          } else {
            throw new Error('Blob is empty.');
          }
        })
        .catch((error) => {
          console.error('Error generating report:', error);
          alert('Failed to generate the report. Please try again.');
        });
    } else {
      alert('Please select a report!');
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
          {/* <button
            type="button"
            className={`bubble-button ${reportType === 'summaryReport' ? 'selected' : ''}`}
            onClick={() => setReportType('summaryReport')}
          >
            Summary Report
          </button> */}
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
                      <th>Report Description</th>
                      <th>Select</th>
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
                          className={`select-circle ${selectedReport?._id === report._id ? 'selected' : ''}`}
                          onClick={() => handleReportSelect(report)}
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
