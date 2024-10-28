import React from 'react';
import './App.css';
import Login from './components/Login.js';
import './components/Login.css'
import { useEffect, useState } from 'react'

import { Router, Route, Routes } from 'react-router-dom'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <Router basename="/">
    <div className="App">
      <header>
            <Router>
                <Routes>
                  <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                  <Route path="/Login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                    
                  {/* Add other routes here */}
                
                </Routes>
            </Router>
      </header>
    </div>
    </Router>
  );
}

export default App;