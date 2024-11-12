import axios from 'axios';
import React, { useState, useEffect } from 'react';

function DatabaseAccess() {
  const [reports, setReports] = useState([]);
  
  // Fetch reports on component load
  useEffect(() => {
    axios.get('/api/reports')
      .then(response => setReports(response.data))
      .catch(error => console.error('Error fetching reports:', error));
  }, []);

  // Function to delete a report
  const deleteReport = (id) => {
    axios.delete(`/api/reports/${id}`)
      .then(() => setReports(reports.filter(report => report._id !== id)))
      .catch(error => console.error('Error deleting report:', error));
  };

  // ... More CRUD operations can be defined here

  return (
    <div>
      <h1>Access Database</h1>
      <ul>
        {reports.map(report => (
          <li key={report._id}>
            {report.title}
            <button onClick={() => deleteReport(report._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DatabaseAccess;
