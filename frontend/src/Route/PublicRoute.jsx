import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ restricted = false }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated && restricted) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
