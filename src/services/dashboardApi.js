import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dashboard API endpoints
export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => api.get("/dashboard/stats"),

  // Get sales data per month
  getSalesPerMonth: () => api.get("/dashboard/sales-per-month"),

  // Get property types distribution
  getPropertyTypes: () => api.get("/dashboard/property-types"),

  // Get new clients over time
  getNewClientsOverTime: () => api.get("/dashboard/new-clients"),

  // Get diagnostic data
  getDiagnostics: () => api.get("/dashboard/diagnostics"),
};

export default api;
