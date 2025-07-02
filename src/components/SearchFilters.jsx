"use client"

import { useState } from "react"
import { ChevronDown, RotateCcw } from "lucide-react"
import RangeSlider from "./RangeSlider"

const SearchFilters = ({ onSearch, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    searchBar: "",
    category: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    garage: "",
    minPrice: 0,
    maxPrice: 2500000,
    minSize: 0,
    maxSize: 2500000,
    features: [],
  })

  const propertyTypes = ["Apartments", "Houses", "Commercial shop", "Villas", "Peasant land", "Residential land"]

  const features = [
    "License",
    "Water",
    "Electricity",
    "Lawn",
    "A/C & Heating",
    "Swimming Pool",
    "Refrigerator",
    "Wifi",
    "Laundry",
    "Elevator",
    "Garden",
    "Fireplace",
    "Outdoor Shower",
    "Parking",
    "Certificate",
  ]

  const handleInputChange = (field, value) => {
    console.log(`🔧 Filter changed: ${field} = ${value}`)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (feature) => {
    setFilters((prev) => {
      const newFeatures = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature]

      console.log(`🏠 Features updated:`, newFeatures)
      return { ...prev, features: newFeatures }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("🔍 SearchFilters - Submitting search with filters:", filters)

    // Convert filters to backend format with proper field mapping
    const searchFilters = {}

    // Basic filters
    if (filters.status) searchFilters.listingType = filters.status
    if (filters.searchBar) searchFilters.searchQuery = filters.searchBar
    if (filters.category) searchFilters.category = filters.category

    // Room filters - convert to numbers
    if (filters.bedrooms) searchFilters.bedrooms = Number.parseInt(filters.bedrooms)
    if (filters.bathrooms) searchFilters.bathrooms = Number.parseInt(filters.bathrooms)
    if (filters.floors) searchFilters.floors = Number.parseInt(filters.floors)
    if (filters.garage) searchFilters.garage = Number.parseInt(filters.garage)

    // Price range
    if (filters.minPrice > 0) searchFilters.minPrice = filters.minPrice
    if (filters.maxPrice < 2500000) searchFilters.maxPrice = filters.maxPrice

    // Size range
    if (filters.minSize > 0) searchFilters.minSize = filters.minSize
    if (filters.maxSize < 2500000) searchFilters.maxSize = filters.maxSize

    // Features
    if (filters.features.length > 0) searchFilters.features = filters.features

    console.log("🔄 SearchFilters - Converted filters for backend:", searchFilters)
    onSearch(searchFilters)
  }

  const handleReset = () => {
    console.log("🔄 SearchFilters - Resetting filters")

    const resetFilters = {
      status: "",
      searchBar: "",
      category: "",
      bedrooms: "",
      bathrooms: "",
      floors: "",
      garage: "",
      minPrice: 0,
      maxPrice: 2500000,
      minSize: 0,
      maxSize: 2500000,
      features: [],
    }

    setFilters(resetFilters)
    onReset()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit}>
        {/* Main Search Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              type="button"
              onClick={() => handleInputChange("status", "Rent")}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filters.status === "Rent" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              For Rent
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("status", "Sale")}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filters.status === "Sale" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              For Sale
            </button>
          </div>

          {/* Search Input */}
          <div className="flex-1 min-w-80">
            <input
              type="text"
              placeholder="Search for city, neighborhood, zipcode..."
              value={filters.searchBar}
              onChange={(e) => handleInputChange("searchBar", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="min-w-48">
            <select
              value={filters.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Property type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Search Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <span>Advanced Search</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>

        {/* Advanced Search Panel */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-6">
            {/* Room Selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { field: "bedrooms", label: "Bedrooms" },
                { field: "bathrooms", label: "Bathrooms" },
                { field: "floors", label: "Floors" },
                { field: "garage", label: "Garage" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <select
                    value={filters[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any {label}</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}+ {label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Range Sliders */}
            <div className="grid md:grid-cols-2 gap-8">
              <RangeSlider
                label="Price Range"
                min={0}
                max={2500000}
                minValue={filters.minPrice}
                maxValue={filters.maxPrice}
                onMinChange={(value) => handleInputChange("minPrice", value)}
                onMaxChange={(value) => handleInputChange("maxPrice", value)}
                suffix="TND"
              />

              <RangeSlider
                label="Size Range"
                min={0}
                max={2500000}
                minValue={filters.minSize}
                maxValue={filters.maxSize}
                onMinChange={(value) => handleInputChange("minSize", value)}
                onMaxChange={(value) => handleInputChange("maxSize", value)}
                suffix="m²"
              />
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Other Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {features.map((feature) => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchFilters
