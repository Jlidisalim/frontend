/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSignUp, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import SignUpFlow from "../components/SignUpFlow";

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log("User already signed in, redirecting to dashboard");
      navigate("/");
    }
  }, [user, navigate]);

  const createUserInDatabase = async (clerkUserId) => {
    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      console.log("Creating user in database with Clerk ID:", clerkUserId);

      const response = await fetch(`${backendUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: clerkUserId,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
        }),
      });

      const result = await response.json();
      console.log("Database response:", result);

      if (!response.ok) {
        console.warn("Failed to create user in database:", result);
        throw new Error(result.message || "Failed to create user in database");
      } else {
        console.log("✅ User created successfully in database");
        return result;
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Update password strength
    if (field === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (passwordStrength < 3) {
      newErrors.password =
        "Password is too weak. Include uppercase, lowercase, numbers, and special characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded || !validateForm()) return;

    setIsLoading(true);

    try {
      // Create user with Clerk - simple approach
      const signUpData = {
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(" ")[0],
        lastName: formData.fullName.split(" ").slice(1).join(" ") || "",
        skipEmailVerification: true, // Skip verification for now
        unsafeMetadata: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
        },
      };

      console.log("Creating Clerk user with data:", signUpData);

      const result = await signUp.create(signUpData);
      console.log("Clerk signup result:", result);

      // Try to create user in database immediately
      try {
        await createUserInDatabase(result.id);
      } catch (dbError) {
        console.warn(
          "Database creation failed, but continuing with Clerk signup:",
          dbError
        );
      }

      // Set the session active
      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      }

      // Show success message
      if (window.showToast) {
        window.showToast(
          "Account created successfully! Welcome to Horizon Immobilier.",
          "success"
        );
      }

      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);

      // Handle specific Clerk errors
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];

        switch (clerkError.code) {
          case "form_identifier_exists":
            setErrors({ email: "This email is already registered" });
            break;
          case "form_password_pwned":
            setErrors({
              password:
                "This password has been found in a data breach. Please choose a different password.",
            });
            break;
          case "form_password_validation_failed":
            setErrors({ password: "Password does not meet requirements" });
            break;
          case "form_param_format_invalid":
            if (clerkError.meta?.paramName === "email_address") {
              setErrors({ email: "Please enter a valid email address" });
            } else {
              setErrors({ general: clerkError.message });
            }
            break;
          default:
            if (
              clerkError.message?.includes("restricted") ||
              clerkError.message?.includes("disabled")
            ) {
              setErrors({
                general:
                  "Account registration is currently disabled. Please contact the administrator to create your account.",
              });
            } else {
              setErrors({
                general:
                  clerkError.message || "An error occurred during signup",
              });
            }
        }
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  // Show admin contact message if sign-ups are restricted
  if (errors.general && errors.general.includes("administrator")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="mb-8 text-center">
          <Link to="/" className="flex items-center justify-center space-x-3">
            <span className="text-3xl font-bold text-blue-600">
              Horizon Immobilier
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              New account registration is currently disabled. Please contact
              your administrator to create an account for you.
            </p>
            <div className="space-y-3">
              <Link
                to="/sign-in"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In Instead
              </Link>
              <button
                onClick={() => setErrors({})}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center space-x-3">
          <span className="text-3xl font-bold text-blue-600">
            Horizon Immobilier
          </span>
        </Link>
        <p className="text-gray-600 mt-2">Create an account to get started.</p>
      </div>
      <SignUpFlow />
    </div>
  );
};

export default SignUpPage;
