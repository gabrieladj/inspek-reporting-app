import React from 'react';
import './Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); // Get the navigate function

  return (
    <div className="main-content">
      <h1>Welcome to the Dashboard</h1>
    </div>
  );
};

export default Dashboard;
