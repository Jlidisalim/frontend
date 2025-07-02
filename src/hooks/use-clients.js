"use client";

import { useState, useEffect, useCallback } from "react";

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/clients");
      const result = await response.json();

      if (result.success) {
        setClients(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch clients");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to fetch clients");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search clients with filters
  const searchClients = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/clients/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      const result = await response.json();

      if (result.success) {
        setClients(result.data);
      } else {
        throw new Error(result.message || "Failed to search clients");
      }
    } catch (err) {
      console.error("Error searching clients:", err);
      setError(err.message || "Failed to search clients");
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete client
  const deleteClient = useCallback(async (clientId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Remove client from local state
        setClients((prev) =>
          prev.filter((client) => client.id_client !== clientId)
        );

        // Show success message if available
        if (typeof window !== "undefined" && window.showToast) {
          window.showToast("Client deleted successfully!", "success");
        }

        return true;
      } else {
        throw new Error(result.message || "Failed to delete client");
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      const errorMessage = err.message || "Failed to delete client";

      // Show error message if available
      if (typeof window !== "undefined" && window.showToast) {
        window.showToast(errorMessage, "error");
      }

      setError(errorMessage);
      return false;
    }
  }, []);

  // Create new client
  const createClient = useCallback(
    async (clientData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/clients", {
          method: "POST",
          body: clientData,
        });

        const result = await response.json();

        if (result.success) {
          // Refresh clients list
          await fetchClients();

          if (typeof window !== "undefined" && window.showToast) {
            window.showToast("Client created successfully!", "success");
          }

          return result.data;
        } else {
          throw new Error(result.message || "Failed to create client");
        }
      } catch (err) {
        console.error("Error creating client:", err);
        const errorMessage = err.message || "Failed to create client";
        setError(errorMessage);

        if (typeof window !== "undefined" && window.showToast) {
          window.showToast(errorMessage, "error");
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchClients]
  );

  // Update client
  const updateClient = useCallback(
    async (clientId, clientData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/clients/${clientId}`,
          {
            method: "PUT",
            body: clientData,
          }
        );

        const result = await response.json();

        if (result.success) {
          // Refresh clients list
          await fetchClients();

          if (typeof window !== "undefined" && window.showToast) {
            window.showToast("Client updated successfully!", "success");
          }

          return result.data;
        } else {
          throw new Error(result.message || "Failed to update client");
        }
      } catch (err) {
        console.error("Error updating client:", err);
        const errorMessage = err.message || "Failed to update client";
        setError(errorMessage);

        if (typeof window !== "undefined" && window.showToast) {
          window.showToast(errorMessage, "error");
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchClients]
  );

  // Get client by ID
  const getClientById = useCallback(async (clientId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}`
      );
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Client not found");
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    fetchClients,
    searchClients,
    deleteClient,
    createClient,
    updateClient,
    getClientById,
  };
};
