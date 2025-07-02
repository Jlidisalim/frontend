"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export const useUserRole = () => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isLoaded) {
        return; // Wait for Clerk to load
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Fetching user role for:", user.id);

        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${backendUrl}/users/clerk/${user.id}`);

        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.data.role);
          console.log("✅ User role fetched:", userData.data.role);
        } else if (response.status === 404) {
          console.log("❌ User not found in database");
          setError("User not found in database");
        } else {
          console.error("❌ Failed to fetch user role:", response.status);
          setError("Failed to fetch user role");
        }
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
        setError("Network error while fetching user role");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isLoaded]);

  const isAdmin = userRole === "admin";
  const isEmployee = userRole === "employee";

  return {
    userRole,
    isAdmin,
    isEmployee,
    loading,
    error,
    user,
  };
};
