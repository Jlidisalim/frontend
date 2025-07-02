"use client";
import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardDiagnostics from "../components/dashboard/DashboardDiagnostics";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [newClientsData, setNewClientsData] = useState([]);
  const [diagnostics, setDiagnostics] = useState(null);

  const [loading, setLoading] = useState({
    stats: true,
    sales: true,
    propertyTypes: true,
    newClients: true,
    diagnostics: true,
  });

  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        setStats(statsResult.data);
        setLoading((prev) => ({ ...prev, stats: false }));
      }

      // Fetch sales data
      const salesResponse = await fetch(
        `${API_BASE_URL}/dashboard/sales-per-month`
      );
      if (salesResponse.ok) {
        const salesResult = await salesResponse.json();
        setSalesData(salesResult.data);
        setLoading((prev) => ({ ...prev, sales: false }));
      }

      // Fetch property types
      const propertyTypesResponse = await fetch(
        `${API_BASE_URL}/dashboard/property-types`
      );
      if (propertyTypesResponse.ok) {
        const propertyTypesResult = await propertyTypesResponse.json();
        setPropertyTypes(propertyTypesResult.data);
        setLoading((prev) => ({ ...prev, propertyTypes: false }));
      }

      // Fetch new clients data
      const newClientsResponse = await fetch(
        `${API_BASE_URL}/dashboard/new-clients`
      );
      if (newClientsResponse.ok) {
        const newClientsResult = await newClientsResponse.json();
        setNewClientsData(newClientsResult.data);
        setLoading((prev) => ({ ...prev, newClients: false }));
      }

      // Fetch diagnostics
      const diagnosticsResponse = await fetch(
        `${API_BASE_URL}/dashboard/diagnostics`
      );
      if (diagnosticsResponse.ok) {
        const diagnosticsResult = await diagnosticsResponse.json();
        setDiagnostics(diagnosticsResult.data);
        setLoading((prev) => ({ ...prev, diagnostics: false }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      setLoading({
        stats: false,
        sales: false,
        propertyTypes: false,
        newClients: false,
        diagnostics: false,
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">
            Error loading dashboard data
          </h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your real estate
            business.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <DashboardStats stats={stats} loading={loading.stats} />

      {/* Charts Section */}
      <DashboardCharts
        salesData={salesData}
        propertyTypes={propertyTypes}
        newClientsData={newClientsData}
        loading={loading}
      />

      {/* Diagnostics Section */}
      <DashboardDiagnostics
        diagnostics={diagnostics}
        loading={loading.diagnostics}
      />
    </div>
  );
};

export default Dashboard;
