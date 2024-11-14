//React app's main component - handles client-side routing

import React from 'react';
import './App.css';
import './components/Login.css';
import Login from './components/Login.js';

import Dashboard from './components/Dashboard.js';
import DatabaseAccess from './components/DatabaseAccess.js';
import ReportGeneration from './components/ReportGeneration.js';
import ViewDrafts from './components/ViewDrafts.js';
import ClientInfo from './components/ClientInfo.js';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
import Layout from './components/Layout'
//import { useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [setLoggedIn] = useState(false)
  const [setEmail] = useState('')

  return (
    <div className="App">
      <header>
            <Router>
                <Routes>
                  <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                  <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

                    {/* Private route for other components using Layout */}
                  <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/client-info" element={<ClientInfo />} />
                  <Route path="/report-generation" element={<ReportGeneration />} />
                  <Route path="/view-drafts" element={<ViewDrafts />} />
                  <Route path="/database-access" element={<DatabaseAccess />} />
                  </Route>
                
                {/* Add other routes here */}
                
                </Routes>
            </Router>
      </header>
    </div>
  );
}

export default App;