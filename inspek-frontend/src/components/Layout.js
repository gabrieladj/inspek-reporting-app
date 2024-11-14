import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirect to the login page
  };

  const getButtonClass = (path) => {
    return location.pathname === path ? 'sidebar-button active' : 'sidebar-button';
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Navigation</h2>

        <Link to="/dashboard">
          <button className={getButtonClass('/dashboard')}>Home</button>
        </Link>

        <Link to="/client-info">
          <button className={getButtonClass('/client-info')}>Client Information</button>
        </Link>

        <Link to="/report-generation">
          <button className={getButtonClass('/report-generation')}>Start New Report</button>
        </Link>

        <Link to="/view-drafts">
          <button className={getButtonClass('/view-drafts')}>View Report Drafts</button>
        </Link>

        <Link to="/database-access">
          <button className={getButtonClass('/database-access')}>Access Database</button>
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
