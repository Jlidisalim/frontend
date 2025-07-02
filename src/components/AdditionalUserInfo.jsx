import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const AdditionalUserInfo = ({ onComplete }) => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    phoneNumber: "",
    role: "employee",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setIsLoading(true);

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      console.log("📝 Creating user in database with data:", {
        clerkId: user.id,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      const response = await fetch(`${backendUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
        }),
      });

      const result = await response.json();
      console.log("📡 Database response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to create user in database");
      }

      console.log("✅ User created successfully in database");

      // Show success message
      if (window.showToast) {
        window.showToast(
          "Profile completed successfully! Welcome to Horizon Immobilier.",
          "success"
        );
      }

      // Call completion callback
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("❌ Database error:", error);
      setErrors({
        general: "Failed to save your information. Please try again.",
      });

      if (window.showToast) {
        window.showToast("Failed to save profile. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mt-2">
          Just a few more details to get you started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Display user info from Clerk */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Account Information
          </h3>
          <p className="text-sm text-blue-700">
            <strong>Name:</strong> {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number *
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="+212600000000"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Phone number will be used for contact purposes and notifications
          </p>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Your role determines your access level in the system
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Completing Profile...
            </>
          ) : (
            "Complete Profile"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdditionalUserInfo;
