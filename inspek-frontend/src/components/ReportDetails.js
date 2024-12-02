import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ReportDetails.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const ReportDetails = () => {
  const { reportId } = useParams(); // Extracts the reportId from the URL
  const [reportDetails, setReportDetails] = useState(null);
  const [clientData, setClientData] = useState(null); // State for client data
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        // Fetch report details
        const reportResponse = await fetch(`${API_BASE_URL}/reports/${reportId}`);
        if (!reportResponse.ok) {
          throw new Error(`Error fetching report details: ${reportResponse.statusText}`);
        }
        const reportData = await reportResponse.json();
        setReportDetails(reportData);

        // Fetch client data related to this report
        const clientResponse = await fetch(`${API_BASE_URL}/clients/${reportData.clientId}`); // Assuming the report has a clientId
        if (!clientResponse.ok) {
          throw new Error(`Error fetching client data: ${clientResponse.statusText}`);
        }
        const clientData = await clientResponse.json();
        setClientData(clientData); // Set client data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchReportDetails();
  }, [reportId]);

  const handleClose = () => {
    navigate('/database-access');
  };

  if (!reportDetails || !clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="report-container">
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleClose}
      >
        X
      </button>
      {/* Title */}
      <h1 className="main-title">{reportDetails.title}</h1>
      <p>{reportDetails.description}</p>

      {/* Main Content Grid */}
      <div className="report-details-grid">
        {/* Left-hand side: Client and Property Info */}
        <div style={{ flex: 1, marginRight: '20px' }} className="left-selection">
          <h1>{clientData.clientName}</h1>
          <p><strong>Client Name:</strong> {clientData.clientName}</p>
          <p><strong>Email:</strong> {clientData.propertyRepresentativeEmail}</p>
          <p><strong>Phone:</strong> {clientData.propertyRepresentativePhone}</p>
          <p><strong>Mailing Address:</strong> {clientData.mailingAddress}</p>

          <h3>Property Information</h3>
          <p><strong>Name:</strong> {reportDetails.propertyInfo.propertyName}</p>
          <p><strong>Address:</strong> {reportDetails.propertyInfo.propertyAddress}</p>
          <p><strong>Type:</strong> {reportDetails.propertyInfo.propertyType}</p>
          <p><strong>Year Built:</strong> {reportDetails.propertyInfo.yearBuilt}</p>
          <p><strong>Total Square Footage:</strong> {reportDetails.propertyInfo.totalBuildingSqFt} sq ft</p>
          <p><strong>Floors:</strong> {reportDetails.propertyInfo.numFloors}</p>
        </div>

        {/* Right-hand side: Report Details */}
        <div className="right-column">
          {/* Inspection Scope */}
          <h3>Inspection Scope</h3>
          <p><strong>Type of Inspection:</strong> {reportDetails.inspectionScope.typeOfInspection}</p>
          <p><strong>Drone Imagery:</strong> {reportDetails.inspectionScope.droneImagery ? 'Yes' : 'No'}</p>
          <p><strong>Areas of Concern:</strong> {reportDetails.inspectionScope.specificAreasOfConcern}</p>

          {/* Inspection Details */}
          <h3>Inspection Details</h3>
          <p><strong>Preferred Date:</strong> {reportDetails.inspectionDetails.preferredDate}</p>
          <p><strong>Preferred Time:</strong> {reportDetails.inspectionDetails.preferredTime}</p>
          <p><strong>Alternate Date:</strong> {reportDetails.inspectionDetails.alternateDate}</p>
          <p><strong>Alternate Time:</strong> {reportDetails.inspectionDetails.alternateTime}</p>
          <p><strong>Additional Information:</strong> {reportDetails.inspectionDetails.additionalInfo}</p>

          {/* Building Details */}
          <h3>Building Details</h3>
          <p><strong>Recent Maintenance:</strong> {reportDetails.buildingDetails.recentMaintenance}</p>
          <p><strong>Ongoing Issues:</strong> {reportDetails.buildingDetails.ongoingIssues}</p>
          <p><strong>Water Intrusion:</strong> {reportDetails.buildingDetails.waterIntrusion}</p>
          <p><strong>Structural Issues:</strong> {reportDetails.buildingDetails.structuralIssues}</p>
          {/* Add other building details here */}
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
