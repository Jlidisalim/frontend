"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { MoreVertical, Trash2, Edit, Bed, Bath, Car, Home, MapPin } from "lucide-react"

const PropertyCard = ({ property, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price)
  }

  const getImageSrc = () => {
    if (imageError || !property.img_dir) {
      return `/placeholder.svg?height=200&width=300`
    }

    // Handle different image path formats
    const imagePath = property.img_dir

    // If it's already a proper relative path starting with 'uploads/'
    if (imagePath.startsWith("uploads/")) {
      return `http://localhost:5000/${imagePath}`
    }

    // If it's an absolute Windows path, extract the filename
    if (imagePath.includes("\\uploads\\")) {
      const filename = imagePath.split("\\uploads\\")[1]
      return `http://localhost:5000/uploads/${filename}`
    }

    // If it's an absolute Unix path, extract the filename
    if (imagePath.includes("/uploads/")) {
      const filename = imagePath.split("/uploads/")[1]
      return `http://localhost:5000/uploads/${filename}`
    }

    // If it's just a filename, assume it's in uploads folder
    if (!imagePath.includes("/") && !imagePath.includes("\\")) {
      return `http://localhost:5000/uploads/${imagePath}`
    }

    // Fallback: try to use it as is
    return `http://localhost:5000/${imagePath}`
  }

  const handleEdit = () => {
    console.log("🔧 PropertyCard: Edit button clicked for property:", property.id_overview_property)
    setDropdownOpen(false)
    // Call the onEdit function passed from parent (Home component)
    onEdit(property.id_overview_property)
  }

  const handleDelete = () => {
    setDropdownOpen(false)
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(property.id_overview_property)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Property Image */}
        <div className="relative w-80 h-48 flex-shrink-0">
          <Link to={`/property/${property.id_overview_property}`}>
            <img
              src={getImageSrc() || "/placeholder.svg"}
              alt={property.property_title_overview}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
              onError={() => {
                console.log("Image failed to load:", getImageSrc())
                setImageError(true)
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", getImageSrc())
              }}
            />
          </Link>
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            For {property.listed}
          </div>
        </div>

        {/* Property Details */}
        <div className="flex-1 p-6">
          {/* Header with Title and Price */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Link
                to={`/property/${property.id_overview_property}`}
                className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {property.property_title_overview}
              </Link>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {property.address}, {property.city}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">{formatPrice(property.price)} TND</p>
              </div>

              {/* Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1">
                        <Link
                          to={`/property/${property.id_overview_property}`}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Home className="w-4 h-4" />
                          <span>View Details</span>
                        </Link>
                        <button
                          onClick={handleEdit}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Property Info Grid */}
          <div className="grid grid-cols-6 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Realtors</p>
              <p className="font-medium text-gray-800">Naby Keita</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Status</p>
              <p className="font-medium text-gray-800">{property.listed}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Type</p>
              <p className="font-medium text-gray-800">{property.category}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Country</p>
              <p className="font-medium text-gray-800">{property.country}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">City</p>
              <p className="font-medium text-gray-800">{property.city}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Condition</p>
              <p className="font-medium text-gray-800">In Progress</p>
            </div>
          </div>

          {/* Property Features */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>{property.size_in_ft} SqFt</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Bed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>{property.kitchens} Kitchen</span>
            </div>
            <div className="flex items-center space-x-1">
              <Car className="w-4 h-4" />
              <span>{property.garages} Garage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
