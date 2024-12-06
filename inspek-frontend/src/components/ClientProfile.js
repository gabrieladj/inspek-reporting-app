import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientProfile.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const ViewClientProfile = () => {
  const { clientId } = useParams(); // Retrieve clientId from the URL
  const [clientData, setClientData] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate



  const handleClose = () => {
    navigate('/database-access');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client data
        const clientResponse = await axios.get(`${API_BASE_URL}/clients/${clientId}`);
        console.log('Client data:', clientResponse.data);
        setClientData(clientResponse.data);
  
        // Fetch reports associated with the client
        const reportsResponse = await axios.get(`${API_BASE_URL}/reports/by-client/${clientId}`);
        console.log('Reports data:', reportsResponse.data);
        
        // Ensure reports is always an array
        setReports(Array.isArray(reportsResponse.data) ? reportsResponse.data : []);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', err);
        setReports([]);  // Ensure reports is an empty array on error
      }
    };
  
    fetchData();
  }, [clientId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!clientData) {
    return <p>Loading...</p>;
  }

  // console.log("clientData properties:", clientData.properties);

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
    <div style={{ display: 'flex' }}>
      {/* Left Section - Client Info */}
      <div style={{ flex: 1, marginRight: '20px' }} className="left-selection">
        <h1>{clientData.clientName}</h1>
        <p><strong>Client Name:</strong> {clientData.clientName}</p>
        <p><strong>Email:</strong> {clientData.propertyRepresentativeEmail}</p>
        <p><strong>Phone:</strong> {clientData.propertyRepresentativePhone}</p>
        <p><strong>Mailing Address:</strong> {clientData.mailingAddress}</p>
      </div>
</div>
      {/* Right Section - Reports, Properties, etc. */}
      <div style={{ flex: 2 }}>
        <h2>Client Overview</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3>Properties Associated</h3>
          {clientData.properties && clientData.properties.length > 0 ? (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Property Address</th>
                  <th>Property Type</th>
                  <th>Year Built</th>
                  <th>Total SqFt</th>
                </tr>
              </thead>
              <tbody>
                {clientData.properties.map((property, index) => (
                  <tr key={property._id || index}>
                    <td>{property.propertyName}</td>
                    <td>{property.propertyAddress}</td>
                    <td>{property.propertyType}</td>
                    <td>{property.yearBuilt}</td>
                    <td>{property.totalBuildingSqFt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No properties associated with this client.</p>
          )}
        </div>

        {/* Contacts */}
        <div style={{ marginBottom: '20px' }}>
          {/* <h3>Contacts</h3> */}

          {/* Property Representatives Table */}
<div>
  <h4>Property Representatives</h4>
  {clientData.properties && clientData.properties.length > 0 ? (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Property Name</th>
          <th>Property Representative Name</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {clientData.properties.map((property, index) => (
          <tr key={property._id || index}>
            <td>{property.propertyName}</td>
            <td>{clientData.propertyRepresentativeName}</td>
            <td>{clientData.propertyRepresentativePhone}</td>
            <td>{clientData.propertyRepresentativeEmail}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No property representatives available for this client.</p>
  )}
</div>
        </div>

        {/* Associated Reports */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Associated Reports</h3>
          {reports.length > 0 ? (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Report Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report._id || index}>
                    <td>{report.propertyInfo?.propertyName}</td>
                    <td>{report.title}</td>
                    <td>{report.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reports available for this client.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewClientProfile;
