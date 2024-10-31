import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Get the navigate function

  const handleLogout = () => {
    // Clear user data from local storage (if you're using it)
    localStorage.removeItem('token'); // Adjust if your token is stored differently

    // Redirect to the login page
    navigate('/login'); // Use navigate to redirect
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Navigation</h2>
        <button className="sidebar-button" onClick={() => { /* Logic to access the database */ }}>
          Access Database
        </button>
        <button className="sidebar-button" onClick={() => { /* Logic to start a new report */ }}>
          Start New Report
        </button>
        <button className="sidebar-button" onClick={() => { /* Logic to view drafts */ }}>
          View Drafts
        </button>
        <button className="sidebar-button logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        {/* Additional content for the dashboard can go here */}
      </div>
    </div>
  );
};

export default Dashboard;
