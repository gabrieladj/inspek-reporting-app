import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const ViewClientProfile = () => {
  const { clientId } = useParams(); // Retrieve clientId from the URL
  const [clientData, setClientData] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client data
        const clientResponse = await axios.get(`${API_BASE_URL}/clients/${clientId}`);
        setClientData(clientResponse.data);

        // Fetch reports associated with the client
        const reportsResponse = await axios.get(`${API_BASE_URL}/reports?clientId=${clientId}`);
        setReports(reportsResponse.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [clientId]); // Fetch data whenever clientId changes

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!clientData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: 'flex', margin: '20px' }}>
      {/* Left Section - Client Info */}
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h1>{clientData.clientName}</h1>
        <p><strong>Client Name:</strong> {clientData.clientName}</p>
        <p><strong>Email:</strong> {clientData.propertyRepresentativeEmail}</p>
        <p><strong>Phone:</strong> {clientData.propertyRepresentativePhone}</p>
        <p><strong>Mailing Address:</strong> {clientData.mailingAddress}</p>
      </div>

      {/* Right Section - Reports, Properties, etc. */}
      <div style={{ flex: 2 }}>
        <h2>Properties and Reports</h2>
        <div style={{ marginBottom: '20px' }}>
          <h3>Properties Associated</h3>
          {clientData.properties && clientData.properties.length > 0 ? (
            clientData.properties.map((property) => (
              <div key={property._id}>
                <p><strong>{property.propertyName}</strong></p>
                <p>{property.propertyAddress}</p>
                <p>{property.propertyType} | Built: {property.yearBuilt}</p>
              </div>
            ))
          ) : (
            <p>No properties associated with this client.</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Reports Associated</h3>
          {reports.length > 0 ? (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.title}</td>
                    <td>{report.description}</td>
                    <td>{report.status}</td>
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
