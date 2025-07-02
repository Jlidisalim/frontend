"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [profileComplete, setProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${backendUrl}/users/clerk/${user.id}`);

        if (response.ok) {
          const userData = await response.json();
          setProfileComplete(true);
          console.log("User profile found:", userData.data);
        } else if (response.status === 404) {
          setProfileComplete(false);
          console.log("User profile not found, needs completion");
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        setProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user, isLoaded]);

  return { profileComplete, loading, user };
};
