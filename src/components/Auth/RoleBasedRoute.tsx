import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorPage from "@/pages/Error/ErrorPage";

interface RoleBasedRouteProps {
  allowedRoles: string[];
  children: React.ReactElement;
}

const RoleBasedRoute = ({ allowedRoles, children }: RoleBasedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.profile?.role;

  if (!role || !allowedRoles.includes(role)) {
    return <ErrorPage message="You do not have permission to access this page." />;
  }

  return children;
};

export default RoleBasedRoute;
