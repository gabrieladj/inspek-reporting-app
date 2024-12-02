import React from 'react';
import './App.css';
import './components/Login.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import DatabaseAccess from './components/DatabaseAccess.js';
import ReportGeneration from './components/ReportGeneration.js';
import ClientProfile from './components/ClientProfile.js';
// import ProjectDetails from './components/ProjectDetails.js';
import ClientInfo from './components/ClientInfo.js';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <div className="App">
      <header>
        <Router>
          <Routes>
            {/* Redirect root based on authentication */}
            <Route path="/" element={
              localStorage.getItem('token') 
                ? <Navigate to="/dashboard" /> 
                : <Navigate to="/login" />
            } />
            <Route path="/login" element={<Login />} />

            {/* Private route for authenticated components */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client-info" element={<ClientInfo />} />
              <Route path="/report-generation" element={<ReportGeneration />} />
              {/* <Route path="/project-details" element={<ProjectDetails />} /> */}
              <Route path="/database-access" element={<DatabaseAccess />} />
              {/* <Route path="/client-profile" element={<ClientProfile />} /> */}
              <Route path="/client/:clientId" element={<ClientProfile />} />
            </Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
