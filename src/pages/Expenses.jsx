/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Printer,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import ExpenseFilters from "../components/ExpenseFilters";

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Load all expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/expenses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setExpenses(result.data);
          setFilteredExpenses(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch expenses");
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/expenses/stats"
        );
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchExpenses();
    fetchStats();
  }, []);

  // Handle search/filter
  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/expenses/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        }
      );

      const result = await response.json();
      if (result.success) {
        setFilteredExpenses(result.data);
      } else {
        throw new Error(result.message || "Failed to search expenses");
      }
    } catch (error) {
      console.error("Error searching expenses:", error);
      if (window.showToast) {
        window.showToast(`Search failed: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFilteredExpenses(expenses);
  };

  // Calculate current stats from filtered expenses
  const currentStats = {
    totalExpenses: filteredExpenses.length,
    totalAmount: filteredExpenses.reduce(
      (sum, expense) => sum + (Number(expense.amount) || 0),
      0
    ),
    thisMonth: filteredExpenses
      .filter((expense) => {
        const expenseDate = new Date(expense.expense_date);
        const currentDate = new Date();
        return (
          expenseDate.getMonth() === currentDate.getMonth() &&
          expenseDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0),
    categories: [
      ...new Set(filteredExpenses.map((expense) => expense.category)),
    ].length,
  };

  const getCategoryColor = (category) => {
    const colors = {
      employee_salary: "bg-blue-100 text-blue-800",
      ads: "bg-purple-100 text-purple-800",
      daily_purchases: "bg-green-100 text-green-800",
      rent: "bg-orange-100 text-orange-800",
      bills: "bg-yellow-100 text-yellow-800",
      transport: "bg-indigo-100 text-indigo-800",
      materials: "bg-pink-100 text-pink-800",
      miscellaneous: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getCategoryText = (category) => {
    const texts = {
      employee_salary: "Employee Salary",
      ads: "Advertisements",
      daily_purchases: "Daily Purchases",
      rent: "Rent",
      bills: "Bills",
      transport: "Transport",
      materials: "Materials",
      miscellaneous: "Miscellaneous",
    };
    return texts[category] || category;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return "💵";
      case "bank_transfer":
        return "🏦";
      case "card":
        return "💳";
      default:
        return "💰";
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeleteLoading(expenseId);
    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedExpenses = expenses.filter(
          (expense) => expense.id_expense !== expenseId
        );
        const updatedFilteredExpenses = filteredExpenses.filter(
          (expense) => expense.id_expense !== expenseId
        );

        setExpenses(updatedExpenses);
        setFilteredExpenses(updatedFilteredExpenses);

        if (window.showToast) {
          window.showToast("Expense deleted successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      if (window.showToast) {
        window.showToast(`Failed to delete expense: ${error.message}`, "error");
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      [
        "Date",
        "Category",
        "Amount",
        "Payment Method",
        "Responsible Person",
        "Note",
      ],
      ...filteredExpenses.map((expense) => [
        expense.expense_date,
        getCategoryText(expense.category),
        expense.amount,
        expense.payment_method,
        expense.responsible_person || "",
        expense.note || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && filteredExpenses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="block mt-2 text-gray-600">Loading expenses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h3 className="text-lg font-medium mb-2">
            Failed to load expenses data
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
              💰 Massarif (Expenses)
            </h1>
            <p className="text-gray-600">
              Track and manage all your business expenses
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={() => navigate("/add-expense")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.totalExpenses}
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
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.totalAmount.toLocaleString()} DT
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.thisMonth.toLocaleString()} DT
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.categories}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <ExpenseFilters onSearch={handleSearch} onReset={handleReset} />
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No expenses found
              </h3>
              <p className="text-gray-500 mb-4">
                {expenses.length === 0
                  ? "Get started by adding your first expense"
                  : "Try adjusting your search filters"}
              </p>
              <button
                onClick={() => navigate("/add-expense")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Expense
              </button>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id_expense}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-2xl">
                        {getPaymentMethodIcon(expense.payment_method)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {expense.employee_name ||
                            expense.campaign_name ||
                            expense.location_name ||
                            getCategoryText(expense.category)}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              expense.category
                            )}`}
                          >
                            {getCategoryText(expense.category)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              expense.expense_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Amount:</span>{" "}
                        {Number(expense.amount).toLocaleString()} DT
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span>{" "}
                        {expense.payment_method.replace("_", " ")}
                      </div>
                      <div>
                        <span className="font-medium">Responsible:</span>{" "}
                        {expense.responsible_person || "N/A"}
                      </div>
                    </div>

                    {expense.note && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">Note:</span>{" "}
                        {expense.note}
                      </div>
                    )}

                    {/* Category-specific details */}
                    {expense.category === "employee_salary" &&
                      expense.employee_name && (
                        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                          <span className="font-medium">Employee:</span>{" "}
                          {expense.employee_name} •
                          <span className="font-medium">Period:</span>{" "}
                          {expense.month_period} •
                          <span className="font-medium">Status:</span>{" "}
                          {expense.salary_paid ? "Paid" : "Pending"}
                        </div>
                      )}

                    {expense.category === "ads" && expense.platform && (
                      <div className="mt-3 text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
                        <span className="font-medium">Platform:</span>{" "}
                        {expense.platform}
                        {expense.target_audience && (
                          <>
                            {" "}
                            • <span className="font-medium">Target:</span>{" "}
                            {expense.target_audience}
                          </>
                        )}
                      </div>
                    )}

                    {expense.category === "rent" && expense.location_name && (
                      <div className="mt-3 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                        <span className="font-medium">Location:</span>{" "}
                        {expense.location_name}
                        {expense.landlord_name && (
                          <>
                            {" "}
                            • <span className="font-medium">
                              Landlord:
                            </span>{" "}
                            {expense.landlord_name}
                          </>
                        )}
                        {" • "}
                        <span className="font-medium">Status:</span>{" "}
                        {expense.rent_paid ? "Paid" : "Pending"}
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        -{Number(expense.amount).toLocaleString()} DT
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Added:{" "}
                        {new Date(expense.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() =>
                          navigate(`/expense/${expense.id_expense}`)
                        }
                        className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/edit-expense/${expense.id_expense}`)
                        }
                        className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Expense"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(expense.id_expense)}
                        disabled={deleteLoading === expense.id_expense}
                        className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Expense"
                      >
                        {deleteLoading === expense.id_expense ? (
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

export default Expenses;
