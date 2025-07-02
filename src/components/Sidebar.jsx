"use client";

import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mail,
  Building,
  Plus,
  Users,
  DollarSign,
  Settings,
  X,
  Receipt,
  UserCheck,
  BarChart3,
} from "lucide-react";
import UserDropdown from "./UserDropdown";
import { useUserRole } from "../hooks/useUserRole";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAdmin, isEmployee, loading } = useUserRole();

  // Employee menu items (limited access)
  const employeeMenuItems = [
    { icon: Building, label: "Properties", path: "/properties" },
    { icon: Mail, label: "Message", path: "/messages" },
    { icon: Plus, label: "Add New Properties", path: "/add-property" },
    { icon: Users, label: "Client", path: "/clients" },
    { icon: DollarSign, label: "Sales", path: "/sales" },
  ];

  // Admin-only menu items
  const adminOnlyItems = [
    { icon: BarChart3, label: "Analytics Dashboard", path: "/dashboard" }, // Added Dashboard menu item
    { icon: Receipt, label: "Massarif (Expenses)", path: "/expenses" },
    { icon: UserCheck, label: "Employés", path: "/employees" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Combine menus based on role
  const getMenuItems = () => {
    if (loading) return employeeMenuItems; // Show basic menu while loading

    if (isAdmin) {
      return [...employeeMenuItems, ...adminOnlyItems];
    } else {
      return employeeMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  // Show loading state
  if (loading) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Sidebar - Loading state */}
        <div
          className={`
            fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-30
          `}
        >
          <div className="h-full flex flex-col">
            {/* Logo Section */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src="../../public/icon.ico"
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Horizon
                  </h3>
                  <p className="text-sm text-gray-600">Immobilier</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Loading indicator */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading menu...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Fixed position with higher z-index */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-30
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="../../public/icon.ico"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Horizon</h3>
                <p className="text-sm text-gray-600">Immobilier</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role indicator */}
          {!loading && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAdmin ? "bg-green-500" : "bg-blue-500"
                  }`}
                ></div>
                <span className="text-xs font-medium text-gray-600 uppercase">
                  {isAdmin ? "Admin Access" : "Employee Access"}
                </span>
              </div>
            </div>
          )}

          {/* Navigation - Allow overflow for dropdown */}
          <nav className="flex-1 py-4 bg-white" style={{ overflow: "visible" }}>
            <div className="px-4 space-y-1">
              {/* Menu Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full
                    ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {/* Show restricted message for employees */}
              {isEmployee && (
                <div className="mt-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      Employee access - Contact admin for additional permissions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* User Dropdown at bottom - Allow overflow */}
          <div
            className="p-4 border-t border-gray-200 bg-white flex-shrink-0"
            style={{ overflow: "visible" }}
          >
            <UserDropdown />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
