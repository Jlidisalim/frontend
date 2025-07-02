/* eslint-disable no-unused-vars */
"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ items, itemsPerPage = 10, onPageChange, currentPage, totalPages }) => {
  // You can use the utility hook if you want internal pagination state
  // const { currentPage, totalPages, goToPage, goToNextPage, goToPrevPage, hasNextPage, hasPrevPage } = usePagination(items, itemsPerPage)

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) return null

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md px-4 py-3">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-md transition-colors
            ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors font-medium
                ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-md transition-colors
            ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            }
          `}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
