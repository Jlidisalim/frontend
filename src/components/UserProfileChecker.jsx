import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import AdditionalUserInfo from "./AdditionalUserInfo";

const UserProfileChecker = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [profileStatus, setProfileStatus] = useState("checking"); // checking, complete, incomplete
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (!isLoaded || !user) {
        return;
      }

      console.log("🔍 Checking if user exists in database:", user.id);

      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${backendUrl}/users/clerk/${user.id}`);

        console.log("📡 Database check response status:", response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log("✅ User found in database:", userData.data);
          setProfileStatus("complete");
        } else if (response.status === 404) {
          console.log(
            "❌ User not found in database, needs profile completion"
          );
          setProfileStatus("incomplete");
        } else {
          console.error("❌ Unexpected response:", response.status);
          setError("Failed to check user profile");
          setProfileStatus("incomplete"); // Default to incomplete to be safe
        }
      } catch (error) {
        console.error("❌ Error checking user in database:", error);
        setError("Network error while checking profile");
        setProfileStatus("incomplete"); // Default to incomplete to be safe
      }
    };

    checkUserInDatabase();
  }, [user, isLoaded]);

  // Show loading while checking
  if (!isLoaded || profileStatus === "checking") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Show error state
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
            Connection Error
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

  // Show profile completion form if needed
  if (profileStatus === "incomplete") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-blue-600">
            Horizon Immobilier
          </span>
          <p className="text-gray-600 mt-2">
            Welcome! Let's complete your profile.
          </p>
        </div>
        <AdditionalUserInfo onComplete={() => setProfileStatus("complete")} />
      </div>
    );
  }

  // Profile is complete, show the dashboard
  return children;
};

export default UserProfileChecker;
