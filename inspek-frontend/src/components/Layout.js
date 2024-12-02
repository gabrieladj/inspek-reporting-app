import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';  // Redirect to the login page
  };

  const getButtonClass = (path) => {
    // Highlight "Access Database" if on a client or report page
    if (path === '/database-access' && (location.pathname.startsWith('/client/') || location.pathname.startsWith('/report/'))) {
      return 'sidebar-button active';  // Add 'active' class if we're on a report or client page
    }
    return location.pathname === path ? 'sidebar-button active' : 'sidebar-button';  // Normal matching logic
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
