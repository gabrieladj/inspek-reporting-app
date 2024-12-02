import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReportDetails';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const ViewReportProfile = () => {
  const { reportId } = useParams(); // Retrieve reportId from the URL
  const [clientData, setClientData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/database-access');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch report data
        const reportResponse = await axios.get(`${API_BASE_URL}/reports/${reportId}`);
        console.log('Report data:', reportResponse.data);
        setReportData(reportResponse.data);

        // Fetch client data associated with the report
        const clientResponse = await axios.get(`${API_BASE_URL}/clients/${reportResponse.data.clientId}`);
        console.log('Client data:', clientResponse.data);
        setClientData(clientResponse.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [reportId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!clientData || !reportData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {/* Close Button */}
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

      <div style={{ display: 'flex', width: '100%' }}>
        {/* Left Section - Client Info */}
        <div style={{ flex: 1, marginRight: '20px' }} className="left-selection">
          <h1>{clientData.clientName}</h1>
          <p><strong>Client Name:</strong> {clientData.clientName}</p>
          <p><strong>Email:</strong> {clientData.propertyRepresentativeEmail}</p>
          <p><strong>Phone:</strong> {clientData.propertyRepresentativePhone}</p>
          <p><strong>Mailing Address:</strong> {clientData.mailingAddress}</p>
        </div>

        {/* Middle Section - Report Details */}
        <div style={{ flex: 2 }} className="report-details">
          <h2>Report Details</h2>
          <p><strong>Title:</strong> {reportData.title}</p>
          <p><strong>Description:</strong> {reportData.description}</p>
          <p><strong>Date:</strong> {reportData.date}</p>
          {/* Add other report fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default ViewReportProfile;
