import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../firebase/config";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
