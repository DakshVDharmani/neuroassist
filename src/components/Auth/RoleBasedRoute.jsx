import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // read role from metadata (or profile if you’ve set it there)
  const role =
    user?.profile?.role?.toLowerCase() || user?.user_metadata?.role?.toLowerCase();

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <a
          href="/home"
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Go Home
        </a>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;

