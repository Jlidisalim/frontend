/* eslint-disable no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, ChevronDown } from "lucide-react";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("top");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceAbove = buttonRect.top;
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      // If there's more space above, show dropdown above
      setDropdownPosition(spaceAbove > spaceBelow ? "top" : "bottom");
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      console.log("🚪 Signing out user...");

      if (window.showToast) {
        window.showToast("Signing out...", "info");
      }

      // Sign out and redirect to custom sign-in page
      await signOut({ redirectUrl: "/sign-in" });

      console.log("✅ User signed out successfully");
    } catch (error) {
      console.error("❌ Error signing out:", error);

      if (window.showToast) {
        window.showToast("Failed to sign out. Please try again.", "error");
      }
    }
  };

  const handleManageAccount = () => {
    console.log("Opening account management...");
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            {user.firstName?.charAt(0) ||
              user.emailAddresses[0]?.emailAddress?.charAt(0) ||
              "U"}
          </span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.emailAddresses[0]?.emailAddress}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60]
            ${dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}
          `}
          style={{
            minWidth: "200px",
            maxWidth: "250px",
          }}
        >
          <button
            onClick={handleManageAccount}
            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Manage account</span>
          </button>

          <hr className="my-1 border-gray-200" />

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign out</span>
          </button>

          <div className="px-4 py-2 border-t border-gray-200 mt-1">
            <p className="text-xs text-gray-500 text-center">
              Secured by <span className="font-medium">Clerk</span>
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Development mode
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
