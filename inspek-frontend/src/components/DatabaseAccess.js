import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DatabaseAccess = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetch("http://142.93.112.132:3001/reports")
          .then(response => response.json())
          .then(data => {
              if (Array.isArray(data)) {
                  setReports(data);
              } else {
                  console.error("Expected an array but got:", data);
              }
          })
          .catch(error => console.error("Error fetching reports:", error));
  }, []);
  

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/reports/${id}`);
            setReports(reports.filter((report) => report._id !== id)); // Remove deleted report from the state
        } catch (err) {
            setError('Failed to delete report');
        }
    };

    return (
        <div>
            <h1>Reports Dashboard</h1>
            {error && <p>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report._id}>
                            <td>{report.title}</td>
                            <td>{report.description}</td>
                            <td>{report.status}</td>
                            <td>
                                <button>Edit</button>
                                <button onClick={() => handleDelete(report._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatabaseAccess;
