import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirect to the login page
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Navigation</h2>

        <Link to="/dashboard">
          <button className="sidebar-button">Home</button>
        </Link>

        <Link to="/database-access">
          <button className="sidebar-button">Access Database</button>
        </Link>

        <Link to="/report-generation">
          <button className="sidebar-button">Start New Report</button>
        </Link>

        <Link to="/viewdrafts">
          <button className="sidebar-button">View Drafts</button>
        </Link>

        <div className="logout-container">
          <button className="sidebar-button logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <Outlet /> {/* This renders child components like Dashboard, DatabaseAccess, ReportGeneration */}
      </div>
    </div>
  );
};

export default Layout;
