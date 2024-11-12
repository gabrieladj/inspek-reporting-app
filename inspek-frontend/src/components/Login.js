import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

//console.log("API URL:", process.env.REACT_APP_API_URL);

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
console.log("API URL:", apiUrl);

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`http://142.93.112.132/api/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include' // Important for sending cookies
      });      
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error response:', errorData); // Log error response
        setError(errorData.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } catch (error) {
    console.error('Error logging in:', error);
    setError('Login failed. Please try again.');
  }
};
  
    return (
      <div className="login-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/login_bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw', // make sure it spans full viewport width
        height: '100vh', // make sure it spans full viewport height
      }}
    >
        <div className="login-box">
          <img src="/inspek_logo_real.png" alt="Inspek Logo" className="logo" />
          <div className="logo_font">Inspek Reporting App</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="submit" className="login-button">Login</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    );
  }
  
  export default Login;