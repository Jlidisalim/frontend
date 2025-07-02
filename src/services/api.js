import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Properties API
export const propertiesAPI = {
  getAll: () => api.get("/properties"),
  search: (filters) => api.post("/properties/search", filters),
  delete: (id) => api.delete(`/properties/${id}`),
  getById: (id) => api.get(`/properties/${id}`),
  create: (formData) =>
    api.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/properties/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get("/clients"),
  search: (filters) => api.post("/clients/search", filters),
  delete: (id) => api.delete(`/clients/${id}`),
  getById: (id) => api.get(`/clients/${id}`),
  create: (formData) =>
    api.post("/clients", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/clients/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // Client visits
  getVisits: (id) => api.get(`/clients/${id}/visits`),
  createVisit: (id, visitData) => api.post(`/clients/${id}/visits`, visitData),
  // Client notes
  getNotes: (id) => api.get(`/clients/${id}/notes`),
  createNote: (id, noteData) => api.post(`/clients/${id}/notes`, noteData),
  updateNote: (id, noteIndex, noteData) =>
    api.put(`/clients/${id}/notes/${noteIndex}`, noteData),
  deleteNote: (id, noteIndex) =>
    api.delete(`/clients/${id}/notes/${noteIndex}`),
  // Properties list for dropdowns
  getPropertiesList: () => api.get("/clients/properties/list"),
};

// Sales API - Complete implementation
export const salesAPI = {
  // Basic CRUD
  getAll: () => api.get("/sales"),
  search: (filters) => api.post("/sales/search", filters),
  delete: (id) => api.delete(`/sales/${id}`),
  getById: (id) => api.get(`/sales/${id}`),
  create: (formData) =>
    api.post("/sales", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/sales/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Sale payments
  getPayments: (id) => api.get(`/sales/${id}/payments`),
  createPayment: (id, paymentData) =>
    api.post(`/sales/${id}/payments`, paymentData),

  // Sale documents
  getDocuments: (id) => api.get(`/sales/${id}/documents`),
  uploadDocument: (id, formData) =>
    api.post(`/sales/${id}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Status updates
  updateStatus: (id, statusData) =>
    api.patch(`/sales/${id}/status`, statusData),

  // Commission calculation
  calculateCommission: (id, commissionData) =>
    api.post(`/sales/${id}/calculate-commission`, commissionData),

  // Dropdown data
  getPropertiesList: () => api.get("/sales/properties/list"),
  getClientsList: () => api.get("/sales/clients/list"),

  // Health check
  healthCheck: () => api.get("/sales/health"),
};

// Dashboard API - NEW ADDITION
export const dashboardAPI = {
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

  // Health check for dashboard
  healthCheck: () => api.get("/dashboard/health"),
};

// Health check
export const healthCheck = () => api.get("/health");

// Export individual APIs and main api instance
export default api;
