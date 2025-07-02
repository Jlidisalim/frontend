/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { propertiesAPI } from "../services/api"

export const useProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const showToast = (message, type = "success") => {
    if (window.showToast) {
      window.showToast(message, type)
    }
  }

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 Fetching all properties...")

      const response = await propertiesAPI.getAll()
      console.log("✅ Properties fetched:", response.data)

      setProperties(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error("❌ Error fetching properties:", err)
      setError(err.message)
      showToast("Failed to fetch properties", "error")
    } finally {
      setLoading(false)
    }
  }

  const searchProperties = async (filters) => {
    try {
      setIsSearching(true)
      setError(null)
      console.log("🔍 Searching properties with filters:", filters)

      // Clean up filters - remove empty values
      const cleanFilters = {}
      Object.keys(filters).forEach((key) => {
        const value = filters[key]
        if (value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)) {
          // Convert string numbers to actual numbers for numeric fields
          if (
            ["bedrooms", "bathrooms", "floors", "garage", "minPrice", "maxPrice", "minSize", "maxSize"].includes(key)
          ) {
            cleanFilters[key] = Number(value)
          } else {
            cleanFilters[key] = value
          }
        }
      })

      console.log("🧹 Cleaned filters:", cleanFilters)

      // If no filters, fetch all properties
      if (Object.keys(cleanFilters).length === 0) {
        console.log("📋 No filters provided, fetching all properties")
        await fetchProperties()
        return
      }

      const response = await propertiesAPI.search(cleanFilters)
      console.log("✅ Search response:", response.data)

      setProperties(response.data.data || [])
      setError(null)
      showToast(`Found ${response.data.count || 0} properties`)
    } catch (err) {
      console.error("❌ Search error:", err)
      setError(err.message)
      showToast("Search failed", "error")
    } finally {
      setIsSearching(false)
    }
  }

  const resetSearch = async () => {
    console.log("🔄 Resetting search, fetching all properties")
    await fetchProperties()
  }

  const deleteProperty = async (id) => {
    try {
      console.log("🗑️ Deleting property:", id)
      await propertiesAPI.delete(id)
      setProperties((prev) => prev.filter((p) => p.id_overview_property !== id))
      showToast("Property deleted successfully")
    } catch (err) {
      console.error("❌ Delete error:", err)
      showToast("Failed to delete property", "error")
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading: loading || isSearching,
    error,
    fetchProperties,
    searchProperties,
    resetSearch,
    deleteProperty,
    isSearching,
  }
}
