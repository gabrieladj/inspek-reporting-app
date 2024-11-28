import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirect to the login page
  };

  const getButtonClass = (path) => {
    // Highlight "Access Database" if viewing a client profile
    if (path === '/database-access' && location.pathname.startsWith('/client/')) {
      return 'sidebar-button active';
    }
    return location.pathname === path ? 'sidebar-button active' : 'sidebar-button';
  };
  

  return (
    <div className="layout">
      <div className="sidebar">
        <h1>Navigation</h1>

        <Link to="/dashboard">
          <button className={getButtonClass('/dashboard')} style={{ fontFamily: 'Bitter, serif' }}>Home</button>
        </Link>

        <Link to="/report-generation">
          <button className={getButtonClass('/report-generation')} style={{ fontFamily: 'Bitter, serif' }}>Start New Report</button>
        </Link>

        <Link to="/database-access">
          <button className={getButtonClass('/database-access')} style={{ fontFamily: 'Bitter, serif' }}>Access Database</button>
        </Link>

        <Link to="/project-details">
          <button className={getButtonClass('/project-details')} style={{ fontFamily: 'Bitter, serif' }}>View Project Details</button>
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
