"use client";

import { useState } from "react";
import { Search, Filter, RotateCcw, Calendar } from "lucide-react";

const ExpenseFilters = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    paymentMethod: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    responsiblePerson: "",
  });

  const handleInputChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: "",
      category: "",
      paymentMethod: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      responsiblePerson: "",
    });
    onReset();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Quick date filters
  const setQuickDate = (days) => {
    const today = new Date();
    const fromDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    setFilters((prev) => ({
      ...prev,
      dateFrom: fromDate.toISOString().split("T")[0],
      dateTo: today.toISOString().split("T")[0],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Search & Filter Expenses
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuickDate(7)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Last 7 days
          </button>
          <button
            onClick={() => setQuickDate(30)}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            Last 30 days
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Query */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by note, person, employee, campaign..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="employee_salary">Employee Salary</option>
            <option value="ads">Advertisements</option>
            <option value="daily_purchases">Daily Purchases</option>
            <option value="rent">Rent</option>
            <option value="bills">Bills</option>
            <option value="transport">Transport</option>
            <option value="materials">Materials</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange("dateFrom", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange("dateTo", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Amount (DT)
          </label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleInputChange("minAmount", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Amount (DT)
          </label>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleInputChange("maxAmount", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Responsible Person */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsible Person
          </label>
          <input
            type="text"
            value={filters.responsiblePerson}
            onChange={(e) =>
              handleInputChange("responsiblePerson", e.target.value)
            }
            onKeyPress={handleKeyPress}
            placeholder="Enter person name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilters;
