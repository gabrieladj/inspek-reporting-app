// Updated PrivateRoute component for react-router-dom v6

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if user is logged in by looking for the token in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // If authenticated, render the component passed in as children; otherwise, redirect to /login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
