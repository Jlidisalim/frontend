"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom" // Add this import
import SearchFilters from "../components/SearchFilters"
import PropertyCard from "../components/PropertyCard"
import Pagination from "../components/Pagination"
import ScrollToTop from "../components/ScrollToTop"
import { useProperties } from "../hooks/useProperties"
import { Loader2 } from "lucide-react"

const Home = () => {
  const navigate = useNavigate() // Add this hook
  const { properties, loading, searchProperties, deleteProperty } = useProperties()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Pagination logic
  const totalPages = Math.ceil(properties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProperties = properties.slice(startIndex, endIndex)

  const handleSearch = (filters) => {
    searchProperties(filters)
    setCurrentPage(1)
  }

  const handleReset = () => {
    window.location.reload()
  }

  const handleEdit = (id) => {
    console.log("🔧 Edit property:", id)
    // Navigate to edit page
    navigate(`/edit-property/${id}`)
  }

  const handleDelete = async (id) => {
    await deleteProperty(id)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="h-full flex flex-col w-full pt-16">
      {/* Search Filters */}
      <div className="flex-shrink-0 w-full">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <SearchFilters onSearch={handleSearch} onReset={handleReset} />
        </div>
      </div>

      {/* Results Summary */}
      {!loading && properties.length > 0 && (
        <div className="flex-shrink-0 w-full">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {startIndex + 1}-{Math.min(endIndex, properties.length)} of {properties.length} properties
              </p>
              <p>
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Properties List */}
      <div className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-6 pb-6 h-full">
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <span className="block mt-2 text-gray-600">Loading properties...</span>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No properties found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentProperties.map((property) => (
                <PropertyCard
                  key={property.id_overview_property}
                  property={property}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && properties.length > 0 && (
        <div className="flex-shrink-0 w-full">
          <div className="max-w-6xl mx-auto px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={properties.length}
            />
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}

export default Home
