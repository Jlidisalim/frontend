"use client";

import { useState } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";

const SaleFilters = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    propertyType: "",
    city: "",
    minAmount: "",
    maxAmount: "",
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
      status: "",
      propertyType: "",
      city: "",
      minAmount: "",
      maxAmount: "",
    });
    onReset();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search Query */}
        <div>
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
              placeholder="Search by property, client, or address..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="promise">Promise</option>
            <option value="full_sale">Full Sale</option>
            <option value="arboun_only">Arboun Only</option>
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleInputChange("propertyType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
            placeholder="1000000"
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

export default SaleFilters;
