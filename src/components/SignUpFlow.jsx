"use client";

import { useState, useEffect } from "react";
import { SignUp } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AdditionalUserInfo from "./AdditionalUserInfo";

const SignUpFlow = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [userExistsInDb, setUserExistsInDb] = useState(false);

  // Check if user exists in database when they sign up
  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (!user?.id) return;

      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${backendUrl}/users/clerk/${user.id}`);

        if (response.ok) {
          // User exists in database, redirect to dashboard
          console.log("User already exists in database, redirecting...");
          setUserExistsInDb(true);
          navigate("/");
        } else if (response.status === 404) {
          // User doesn't exist in database, show additional info form
          console.log(
            "User not found in database, showing additional info form..."
          );
          setShowAdditionalInfo(true);
        }
      } catch (error) {
        console.error("Error checking user in database:", error);
        // If there's an error, show the additional info form to be safe
        setShowAdditionalInfo(true);
      }
    };

    if (isLoaded && user) {
      checkUserInDatabase();
    }
  }, [user, isLoaded, navigate]);

  const handleProfileComplete = () => {
    setShowAdditionalInfo(false);
    navigate("/");
  };

  // Show loading while checking
  if (isLoaded && user && !showAdditionalInfo && !userExistsInDb) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Show additional info form if user just signed up
  if (showAdditionalInfo) {
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
        <AdditionalUserInfo onComplete={handleProfileComplete} />
      </div>
    );
  }

  // Show Clerk's signup component
  return <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />;
};

export default SignUpFlow;
