import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Use Link for navigation

const Layout = () => {
  const location = useLocation(); // Get the current location/path
  
  // Function to check if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Navigation</h2>

        <Link to="/dashboard">
          <button className={`sidebar-button ${isActive('/dashboard') ? 'active' : ''}`} disabled={isActive('/dashboard')}>
            Home
          </button>
        </Link>

        <Link to="/database-access">
          <button className={`sidebar-button ${isActive('/database-access') ? 'active' : ''}`} disabled={isActive('/database-access')}>
            Access Database
          </button>
        </Link>

        <Link to="/report-generation">
          <button className={`sidebar-button ${isActive('/newreport') ? 'active' : ''}`} disabled={isActive('/newreport')}>
            Start New Report
          </button>
        </Link>

        <Link to="/view-drafts">
          <button className={`sidebar-button ${isActive('/viewdrafts') ? 'active' : ''}`} disabled={isActive('/viewdrafts')}>
            View Drafts
          </button>
        </Link>

        <button className="sidebar-button logout" onClick={() => localStorage.removeItem('token')}>
          Logout
        </button>
      </div>

      <div className="main-content">
        <Outlet /> {/* This renders the child components like Dashboard, DatabaseAccess */}
      </div>
    </div>
  );
};

export default Layout;
