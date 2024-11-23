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
        <h2 style={{ fontFamily: 'Oswald, sans-serif' }}>Navigation</h2>

        <Link to="/dashboard">
          <button className={getButtonClass('/dashboard')} style={{ fontFamily: 'Bitter, serif' }}>Home</button>
        </Link>

        <Link to="/report-generation">
          <button className={getButtonClass('/report-generation')} style={{ fontFamily: 'Bitter, serif' }}>Start New Report</button>
        </Link>

        <Link to="/view-drafts">
          <button className={getButtonClass('/view-drafts')} style={{ fontFamily: 'Bitter, serif' }}>View Report Drafts</button>
        </Link>

        <Link to="/database-access">
          <button className={getButtonClass('/database-access')} style={{ fontFamily: 'Bitter, serif' }}>Access Database</button>
        </Link>

        <Link to="/client-profile">
          <button className={getButtonClass('/client-profile')} style={{ fontFamily: 'Bitter, serif' }}>View Client Profiles</button>
        </Link>

        <Link to="/client-info">
          <button className={getButtonClass('/client-info')} style={{ fontFamily: 'Bitter, serif' }}>Add Client (manual)</button>
        </Link>

        <div className="logout-container">
          <button className="sidebar-button logout" onClick={handleLogout} style={{ fontFamily: 'Bitter, serif' }}>
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
