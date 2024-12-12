import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken"); // Example: Check for auth token
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
