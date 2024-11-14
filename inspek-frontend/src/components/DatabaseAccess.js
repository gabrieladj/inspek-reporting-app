import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

const DatabaseAccess = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/reports`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setReports(response.data);
                } else {
                    console.error("Expected an array but got:", response.data);
                }
            })
            .catch(error => console.error("Error fetching reports:", error));
    }, []);
  
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/reports/${id}`);
            setReports(reports.filter((report) => report._id !== id)); // Remove deleted report from the state
        } catch (err) {
            setError('Failed to delete report');
        }
    };

    const tableStyles = {
      borderCollapse: 'collapse',
      width: '100%',
      marginTop: '20px',
    };
  
    const thTdStyles = {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
      fontSize: '14px',
    };

    return (
        <div>
            <h1>Database Access</h1>
            {error && <p>{error}</p>}
            <center>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={thTdStyles}>Title</th>
                        <th style={thTdStyles}>Description</th>
                        <th style={thTdStyles}>Status</th>
                        <th style={thTdStyles}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id}>
                            <td style={thTdStyles}>{report.title}</td>
                            <td style={thTdStyles}>{report.description}</td>
                            <td style={thTdStyles}>{report.status}</td>
                            <td style={thTdStyles}>
                                <button>Edit</button>
                                <button onClick={() => handleDelete(report._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </center>
        </div>
    );
};

export default DatabaseAccess;
