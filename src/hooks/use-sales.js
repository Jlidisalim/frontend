"use client";

import { useState, useEffect } from "react";

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    completedSales: 0,
    pendingSales: 0,
    totalValue: 0,
  });

  // Fetch all sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/sales");
      const result = await response.json();

      if (result.success) {
        setSales(result.data);
        calculateStats(result.data);
      } else {
        console.error("Failed to fetch sales:", result.message);
        setSales([]);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (salesData) => {
    const totalSales = salesData.length;
    const completedSales = salesData.filter(
      (sale) => sale.sale_status === "finalized"
    ).length;
    const pendingSales = salesData.filter(
      (sale) => sale.sale_status !== "finalized"
    ).length;
    const totalValue = salesData.reduce(
      (sum, sale) => sum + Number.parseFloat(sale.total_amount || 0),
      0
    );

    setStats({
      totalSales,
      completedSales,
      pendingSales,
      totalValue: Math.round(totalValue),
    });
  };

  // Search sales
  const searchSales = async (filters) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/sales/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      const result = await response.json();

      if (result.success) {
        setSales(result.data);
        calculateStats(result.data);
      } else {
        console.error("Failed to search sales:", result.message);
      }
    } catch (error) {
      console.error("Error searching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete sale
  const deleteSale = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sales/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setSales((prev) => prev.filter((sale) => sale.id !== id));
        if (window.showToast) {
          window.showToast("Sale deleted successfully!", "success");
        }
        // Recalculate stats
        const updatedSales = sales.filter((sale) => sale.id !== id);
        calculateStats(updatedSales);
      } else {
        throw new Error(result.message || "Failed to delete sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      if (window.showToast) {
        window.showToast(`Failed to delete sale: ${error.message}`, "error");
      }
    }
  };

  // Load sales on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    stats,
    searchSales,
    deleteSale,
    refetch: fetchSales,
  };
};
