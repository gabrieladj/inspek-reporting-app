//React app's main component - handles client-side routing

import React from 'react';
import './App.css';
import './components/Login.css';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
//import { useEffect } from 'react'

import { HashRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  // const [loggedIn, setLoggedIn] = useState(false)
  // const [email, setEmail] = useState('')

  const [setLoggedIn] = useState(false)
  const [setEmail] = useState('')

  return (
    <div className="App">
      <header>
            <Router>
                <Routes>
                  <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                  <Route path="/Login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> 
                  
                  {/* Add other routes here */}
                
                </Routes>
            </Router>
      </header>
    </div>
  );
}

export default App;