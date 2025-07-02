"use client";

import { useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

const AccessDenied = () => {
  const navigate = useNavigate();
  const { userRole, isAdmin } = useUserRole();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>

        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area is restricted
          to administrators only.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Your current role:</span>
            <span
              className={`font-medium px-2 py-1 rounded-full text-xs ${
                isAdmin
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {userRole || "Loading..."}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need admin access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
