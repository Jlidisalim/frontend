"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import SaleFilters from "../components/sales/SaleFilters"

const Sales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Load all sales on component mount
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/sales");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setSales(result.data);
          setFilteredSales(result.data); // Initially show all sales
        } else {
          throw new Error(result.message || "Failed to fetch sales");
        }
      } catch (err) {
        console.error("Error fetching sales:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Handle search/filter from SaleFilters component
  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/sales/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: filters.query,
          status: filters.status,
          propertyType: filters.propertyType,
          city: filters.city,
          minAmount: filters.minAmount,
          maxAmount: filters.maxAmount,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFilteredSales(result.data);
      } else {
        throw new Error(result.message || "Failed to search sales");
      }
    } catch (error) {
      console.error("Error searching sales:", error);
      if (window.showToast) {
        window.showToast(`Search failed: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset filters to show all sales
  const handleReset = () => {
    setFilteredSales(sales);
  };

  // Calculate stats from current filtered sales
  const stats = {
    totalSales: filteredSales.length,
    completedSales: filteredSales.filter((s) => s.sale_status === "full_sale")
      .length,
    pendingSales: filteredSales.filter((s) => s.sale_status === "promise")
      .length,
    totalValue: filteredSales.reduce(
      (sum, sale) => sum + (Number(sale.main_price) || 0),
      0
    ),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "promise":
        return "bg-yellow-100 text-yellow-800";
      case "full_sale":
        return "bg-green-100 text-green-800";
      case "arboun_only":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "promise":
        return "Promise";
      case "full_sale":
        return "Full Sale";
      case "arboun_only":
        return "Arboun Only";
      default:
        return status;
    }
  };

  const handleDelete = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) {
      return;
    }

    setDeleteLoading(saleId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/${saleId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update both sales arrays
        const updatedSales = sales.filter((sale) => sale.id_sale !== saleId);
        const updatedFilteredSales = filteredSales.filter(
          (sale) => sale.id_sale !== saleId
        );

        setSales(updatedSales);
        setFilteredSales(updatedFilteredSales);

        if (window.showToast) {
          window.showToast("Sale deleted successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to delete sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      if (window.showToast) {
        window.showToast(`Failed to delete sale: ${error.message}`, "error");
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading && filteredSales.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="block mt-2 text-gray-600">Loading sales...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-medium mb-2">
            Failed to load sales data
          </h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sales Management
            </h1>
            <p className="text-gray-600">
              Manage your property sales and transactions
            </p>
          </div>
          <button
            onClick={() => navigate("/add-sale")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Sale</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSales}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedSales}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingSales}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalValue.toLocaleString()} DT
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <SaleFilters onSearch={handleSearch} onReset={handleReset} />
        </div>

        {/* Sales List */}
        <div className="space-y-4">
          {filteredSales.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sales found
              </h3>
              <p className="text-gray-500 mb-4">
                {sales.length === 0
                  ? "Get started by creating your first sale"
                  : "Try adjusting your search filters"}
              </p>
              <button
                onClick={() => navigate("/add-sale")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Sale
              </button>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div
                key={sale.id_sale}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sale.property_title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          sale.sale_status
                        )}`}
                      >
                        {getStatusText(sale.sale_status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Client:</span>{" "}
                        {sale.client_name}
                      </div>
                      <div>
                        <span className="font-medium">City:</span>{" "}
                        {sale.property_city || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>{" "}
                        {Number(sale.main_price).toLocaleString()} DT
                      </div>
                      <div>
                        <span className="font-medium">Paid:</span>{" "}
                        {Number(sale.amount_paid || 0).toLocaleString()} DT
                      </div>
                    </div>
                    {sale.remaining_sale_amount > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Payment Progress</span>
                          <span>
                            {(
                              ((sale.amount_paid || 0) / sale.main_price) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                ((sale.amount_paid || 0) / sale.main_price) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-6 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {Number(sale.main_price).toLocaleString()} DT
                      </p>
                      {sale.remaining_sale_amount > 0 && (
                        <p className="text-sm text-gray-500">
                          Remaining:{" "}
                          {Number(sale.remaining_sale_amount).toLocaleString()}{" "}
                          DT
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Signed:{" "}
                        {sale.signature_date
                          ? new Date(sale.signature_date).toLocaleDateString()
                          : "Not signed"}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => navigate(`/edit-sale/${sale.id_sale}`)}
                        className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Sale"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(sale.id_sale)}
                        disabled={deleteLoading === sale.id_sale}
                        className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Sale"
                      >
                        {deleteLoading === sale.id_sale ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
