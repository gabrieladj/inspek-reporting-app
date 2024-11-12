import React from 'react';
import './Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Navigate to login page
  };

  const handleAccessDatabase = () => {
    navigate('/databaseaccess'); // Navigate to the database page
  };

  return (
    <div className="main-content">
      <h1>Welcome to the Dashboard</h1>
    </div>
  );
};

export default Dashboard;
