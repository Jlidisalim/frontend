"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  DollarSign,
  Calendar,
  User,
  FileText,
} from "lucide-react";

const AddExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    expenseDate: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
    paymentMethod: "cash",
    responsiblePerson: "",
    note: "",
    // Category-specific data
    salaryData: {
      employeeName: "",
      monthPeriod: "",
      salaryAmount: "",
      isPaid: false,
      datePaid: "",
      note: "",
    },
    adData: {
      platform: "",
      campaignName: "",
      adDate: "",
      targetAudience: "",
      resultDescription: "",
      note: "",
    },
    rentData: {
      locationName: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      isPaid: false,
      datePaid: "",
      landlordName: "",
      landlordContact: "",
      note: "",
    },
  });

  const handleInputChange = (name, value) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Auto-fill amount for salary
    if (name === "salaryData.salaryAmount") {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
    if (name === "rentData.monthlyRent") {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (window.showToast) {
          window.showToast("Expense created successfully!", "success");
        }
        navigate("/expenses");
      } else {
        throw new Error(result.message || "Failed to create expense");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      if (window.showToast) {
        window.showToast(`Failed to create expense: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "employee_salary":
        return "👨‍💼";
      case "ads":
        return "📢";
      case "daily_purchases":
        return "🛒";
      case "rent":
        return "🏢";
      case "bills":
        return "⚡";
      case "transport":
        return "🚗";
      case "materials":
        return "🔧";
      case "miscellaneous":
        return "📦";
      default:
        return "💰";
    }
  };

  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case "employee_salary":
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center space-x-2">
              <span>👨‍💼</span>
              <span>Employee Salary Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={formData.salaryData.employeeName}
                  onChange={(e) =>
                    handleInputChange("salaryData.employeeName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month Period *
                </label>
                <input
                  type="month"
                  value={formData.salaryData.monthPeriod}
                  onChange={(e) =>
                    handleInputChange("salaryData.monthPeriod", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Amount (DT) *
                </label>
                <input
                  type="number"
                  value={formData.salaryData.salaryAmount}
                  onChange={(e) =>
                    handleInputChange("salaryData.salaryAmount", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1200"
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.salaryData.isPaid}
                    onChange={(e) =>
                      handleInputChange("salaryData.isPaid", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Already Paid
                  </span>
                </label>
                {formData.salaryData.isPaid && (
                  <input
                    type="date"
                    value={formData.salaryData.datePaid}
                    onChange={(e) =>
                      handleInputChange("salaryData.datePaid", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "ads":
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-purple-800 flex items-center space-x-2">
              <span>📢</span>
              <span>Advertisement Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <select
                  value={formData.adData.platform}
                  onChange={(e) =>
                    handleInputChange("adData.platform", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select platform</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.adData.campaignName}
                  onChange={(e) =>
                    handleInputChange("adData.campaignName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New Properties Campaign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.adData.targetAudience}
                  onChange={(e) =>
                    handleInputChange("adData.targetAudience", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age 25-45, Tunis area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Date
                </label>
                <input
                  type="date"
                  value={formData.adData.adDate}
                  onChange={(e) =>
                    handleInputChange("adData.adDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result Description
                </label>
                <textarea
                  value={formData.adData.resultDescription}
                  onChange={(e) =>
                    handleInputChange(
                      "adData.resultDescription",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Campaign results, leads generated, etc."
                />
              </div>
            </div>
          </div>
        );

      case "rent":
        return (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-orange-800 flex items-center space-x-2">
              <span>🏢</span>
              <span>Rent Details</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={formData.rentData.locationName}
                  onChange={(e) =>
                    handleInputChange("rentData.locationName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Office - Tunis Center"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent (DT) *
                </label>
                <input
                  type="number"
                  value={formData.rentData.monthlyRent}
                  onChange={(e) =>
                    handleInputChange("rentData.monthlyRent", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.rentData.startDate}
                  onChange={(e) =>
                    handleInputChange("rentData.startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.rentData.endDate}
                  onChange={(e) =>
                    handleInputChange("rentData.endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landlord Name
                </label>
                <input
                  type="text"
                  value={formData.rentData.landlordName}
                  onChange={(e) =>
                    handleInputChange("rentData.landlordName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Landlord name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landlord Contact
                </label>
                <input
                  type="text"
                  value={formData.rentData.landlordContact}
                  onChange={(e) =>
                    handleInputChange(
                      "rentData.landlordContact",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone or email"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rentData.isPaid}
                    onChange={(e) =>
                      handleInputChange("rentData.isPaid", e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Already Paid
                  </span>
                </label>
                {formData.rentData.isPaid && (
                  <input
                    type="date"
                    value={formData.rentData.datePaid}
                    onChange={(e) =>
                      handleInputChange("rentData.datePaid", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/expenses")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Expenses</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            💰 Add New Expense
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) =>
                      handleInputChange("expenseDate", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="employee_salary">👨‍💼 Employee Salary</option>
                  <option value="ads">📢 Advertisements</option>
                  <option value="daily_purchases">🛒 Daily Purchases</option>
                  <option value="rent">🏢 Rent</option>
                  <option value="bills">⚡ Bills</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="materials">🔧 Materials</option>
                  <option value="miscellaneous">📦 Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (DT) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    handleInputChange("paymentMethod", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="cash">💵 Cash</option>
                  <option value="bank_transfer">🏦 Bank Transfer</option>
                  <option value="card">💳 Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsible Person
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.responsiblePerson}
                    onChange={(e) =>
                      handleInputChange("responsiblePerson", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Person responsible for this expense"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this expense..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category-specific fields */}
          {formData.category && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">
                  {getCategoryIcon(formData.category)}
                </span>
                <h2 className="text-xl font-semibold text-gray-900">
                  Category Details
                </h2>
              </div>
              {renderCategorySpecificFields()}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/expenses")}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={loading || !formData.category || !formData.amount}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Creating..." : "Create Expense"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
