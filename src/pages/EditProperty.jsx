/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import PropertyOverview from "../components/AddProperty/PropertyOverview"
import ListingDetails from "../components/AddProperty/ListingDetails"
import FileAttachments from "../components/AddProperty/FileAttachments"
import AmenitiesSelection from "../components/AddProperty/AmenitiesSelection"
import LocationDetails from "../components/AddProperty/LocationDetails"
import ReviewSubmit from "../components/AddProperty/ReviewSubmit"

const steps = [
  { id: 1, title: "Property Overview", component: PropertyOverview },
  { id: 2, title: "Listing Details", component: ListingDetails },
  { id: 3, title: "Photos & Videos", component: FileAttachments },
  { id: 4, title: "Amenities", component: AmenitiesSelection },
  { id: 5, title: "Location", component: LocationDetails },
  { id: 6, title: "Review & Submit", component: ReviewSubmit },
]

const EditProperty = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      // Property Overview
      propertyTitle: "",
      description: "",
      category: "",
      listingType: "",
      price: "",
      taxRate: "",
      apartmentState: "",
      ownerName: "",
      ownerPhone: "",
      priceMin: "",
      priceMax: "",

      // Listing Details
      sizeInFt: "",
      bedrooms: "",
      bathrooms: "",
      kitchens: "",
      garages: "",
      garageSize: "",
      floors: "",
      houseNumber: "",
      listingDescription: "",

      // Files
      files: [],
      deletedImages: [],

      // Amenities
      amenities: [],

      // Location
      address: "",
      country: "",
      city: "",
      state: "",
      mapLocation: "",
    },
  })

  const { trigger, setValue, getValues } = methods

  // Fetch property data when component mounts
  useEffect(() => {
    if (id) {
      fetchPropertyData()
    } else {
      setError("No property ID provided")
      setLoading(false)
    }
  }, [id])

  const fetchPropertyData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:5000/api/properties/${id}`)

      if (!response.ok) {
        throw new Error(`Property not found (${response.status})`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const property = result.data

        // Populate form with existing data
        setValue("propertyTitle", property.property_title_overview || "")
        setValue("description", property.description_overview || "")
        setValue("category", property.category || "")
        setValue("listingType", property.listed || "")
        setValue("price", property.price?.toString() || "")
        setValue("taxRate", property.yearly_tax_rate?.toString() || "")

        setValue("sizeInFt", property.size_in_ft?.toString() || "")
        setValue("bedrooms", property.bedrooms?.toString() || "")
        setValue("bathrooms", property.bathrooms?.toString() || "")
        setValue("kitchens", property.kitchens?.toString() || "")
        setValue("garages", property.garages?.toString() || "")
        setValue("garageSize", property.garage_size?.toString() || "")
        setValue("floors", property.floors_number?.toString() || "")
        setValue("houseNumber", property.house_number?.toString() || "")
        setValue("listingDescription", property.description_listing || "")

        setValue("amenities", property.amenities || [])

        setValue("address", property.address || "")
        setValue("country", property.country || "")
        setValue("city", property.city || "")
        setValue("state", property.state || "")
        setValue("mapLocation", property.map_location || "")

        setValue("apartmentState", property.apartment_state || "")
        setValue("ownerName", property.owner_name || "")
        setValue("ownerPhone", property.owner_phone || "")
        setValue("priceMin", property.price_min?.toString() || "")
        setValue("priceMax", property.price_max?.toString() || "")

        // Initialize file-related fields
        setValue("files", [])
        setValue("deletedImages", [])
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["propertyTitle", "description", "category", "listingType", "price"]
      case 2:
        return ["sizeInFt", "bedrooms", "bathrooms", "kitchens", "floors", "listingDescription"]
      case 3:
        return ["files"]
      case 4:
        return ["amenities"]
      case 5:
        return ["address", "country", "city", "state", "mapLocation"]
      default:
        return []
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      const currentValues = getValues()
      const files = currentValues.files || []
      const deletedImages = currentValues.deletedImages || []

      const formData = new FormData()

      // Add all text fields
      Object.keys(data).forEach((key) => {
        if (key === "files" || key === "deletedImages") {
          return // Skip files, handle separately
        }

        if (key === "amenities") {
          const amenities = Array.isArray(data[key]) ? data[key] : []
          formData.append("amenities", JSON.stringify(amenities))
          return
        }

        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key])
        }
      })

      // Add deleted images
      if (deletedImages.length > 0) {
        formData.append("deletedImages", JSON.stringify(deletedImages))
      }

      // Add new files
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file)
        })
      }

      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: "PUT",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (window.showToast) {
          window.showToast("Property updated successfully!", "success")
        } else {
          alert("Property updated successfully!")
        }

        navigate("/properties")
      } else {
        throw new Error(result.message || "Failed to update property")
      }
    } catch (error) {
      if (window.showToast) {
        window.showToast(`Failed to update property: ${error.message}`, "error")
      } else {
        alert(`Failed to update property: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <span className="block mt-2 text-gray-600">Loading property data...</span>
          <span className="block mt-1 text-sm text-gray-500">Property ID: {id}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-600 mb-4">Property ID: {id}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/properties")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Property</h1>
          <p className="text-gray-600">Update your property details</p>
          <p className="text-sm text-gray-500">Property ID: {id}</p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                      ${
                        currentStep > step.id
                          ? "bg-green-500 text-white"
                          : currentStep === step.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 text-center max-w-20 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4 transition-all duration-300
                      ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                `}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Update Property</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default EditProperty
