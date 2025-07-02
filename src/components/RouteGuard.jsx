/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

const RouteGuard = ({ children }) => {
  const location = useLocation();
  const { userRole, isAdmin, loading, error } = useUserRole();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Define admin-only routes
  const adminOnlyRoutes = [
    "/expenses",
    "/add-expense",
    "/employees",
    "/add-employee",
    "/edit-employee",
    "/settings",
  ];

  // Check if current route requires admin access
  const requiresAdmin = adminOnlyRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    if (!loading && !error && requiresAdmin && !isAdmin) {
      console.log("🚫 Access denied - Admin required for:", location.pathname);
      setShouldRedirect(true);
    } else {
      setShouldRedirect(false);
    }
  }, [loading, error, requiresAdmin, isAdmin, location.pathname]);

  // Show loading while checking permissions
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Show error if role check failed
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Redirect if user doesn't have permission
  if (shouldRedirect) {
    return <Navigate to="/access-denied" replace />;
  }

  // User has access, render the content
  return children;
};

export default RouteGuard;
