/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyOverview from "../components/AddProperty/PropertyOverview";
import ListingDetails from "../components/AddProperty/ListingDetails";
import FileAttachments from "../components/AddProperty/FileAttachments";
import AmenitiesSelection from "../components/AddProperty/AmenitiesSelection";
import LocationDetails from "../components/AddProperty/LocationDetails";
import ReviewSubmit from "../components/AddProperty/ReviewSubmit";

const steps = [
  { id: 1, title: "Property Overview", component: PropertyOverview },
  { id: 2, title: "Listing Details", component: ListingDetails },
  { id: 3, title: "Photos & Videos", component: FileAttachments },
  { id: 4, title: "Amenities", component: AmenitiesSelection },
  { id: 5, title: "Location", component: LocationDetails },
  { id: 6, title: "Review & Submit", component: ReviewSubmit },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Files - CRITICAL: Initialize as empty array
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
  });

  const { trigger, getValues, watch } = methods;

  // Watch files for debugging
  const watchedFiles = watch("files") || [];
  const watchedAmenities = watch("amenities") || [];

  console.log("🔍 AddProperty - Current files in form:", watchedFiles.length);
  console.log("🔍 AddProperty - Current amenities:", watchedAmenities);

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return [
          "propertyTitle",
          "description",
          "category",
          "listingType",
          "price",
        ];
      case 2:
        return [
          "sizeInFt",
          "bedrooms",
          "bathrooms",
          "kitchens",
          "floors",
          "listingDescription",
        ];
      case 3:
        return ["files"];
      case 4:
        return ["amenities"];
      case 5:
        return ["address", "country", "city", "state", "mapLocation"];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    console.log("🚀 === FORM SUBMISSION START ===");
    setIsSubmitting(true);

    try {
      // Get the current form values including files
      const currentValues = getValues();
      console.log("📋 Current form values:", {
        ...currentValues,
        files: currentValues.files?.length || 0,
      });

      // CRITICAL FIX: Properly handle files from the form
      const files = currentValues.files || [];
      console.log("📁 Files to upload:", files.length);

      if (files.length > 0) {
        console.log("📸 File details:");
        files.forEach((file, index) => {
          console.log(`  File ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });
        });
      } else {
        console.log("⚠️ No files selected for upload");
      }

      const formData = new FormData();

      // Add all text fields
      Object.keys(data).forEach((key) => {
        if (key === "files" || key === "deletedImages") {
          return; // Skip files, handle separately
        }

        if (key === "amenities") {
          // Handle amenities array
          const amenities = Array.isArray(data[key]) ? data[key] : [];
          console.log("🏠 Adding amenities:", amenities);
          formData.append("amenities", JSON.stringify(amenities));
          return;
        }

        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      // CRITICAL FIX: Add files to FormData
      if (files && files.length > 0) {
        console.log("📎 Adding files to FormData...");
        files.forEach((file, index) => {
          formData.append("files", file); // Use 'files' as field name
          console.log(`📎 Added file ${index + 1}: ${file.name}`);
        });
      } else {
        console.log("⚠️ No files to add to FormData");
      }

      // Debug: Log FormData contents
      console.log("📋 FormData contents:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      console.log("🌐 Sending request to backend...");

      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        body: formData, // Don't set Content-Type header, let browser set it
      });

      console.log("📡 Response status:", response.status);

      const result = await response.json();
      console.log("📝 Server response:", result);

      if (response.ok && result.success) {
        console.log("✅ Property created successfully!");
        console.log("📊 Upload summary:", {
          propertyId: result.data?.propertyId,
          filesUploaded: result.data?.uploadedFiles || 0,
          totalFilesReceived: result.data?.totalFilesReceived || 0,
          filesInDatabase: result.data?.filesInDatabase || 0,
        });

        // Show success message
        if (window.showToast) {
          window.showToast("Property added successfully!", "success");
        } else {
          alert("Property added successfully!");
        }

        // Reset form and navigate
        methods.reset();
        setCurrentStep(1);
        navigate("/properties");
      } else {
        throw new Error(result.message || "Failed to create property");
      }
    } catch (error) {
      console.error("❌ === FORM SUBMISSION ERROR ===");
      console.error("Error:", error.message);
      console.error("Stack:", error.stack);

      // Show error message
      if (window.showToast) {
        window.showToast(`Failed to add property: ${error.message}`, "error");
      } else {
        alert(`Failed to add property: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
      console.log("🏁 === FORM SUBMISSION END ===");
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Property
          </h1>
          <p className="text-gray-600">
            Fill in the details to list your property
          </p>
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
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center max-w-20 text-gray-600">
                    {step.title}
                  </span>
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

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-gray-100 p-4 rounded-lg text-sm mb-6">
                <h4 className="font-semibold mb-2">Debug Info:</h4>
                <p>Current Step: {currentStep}</p>
                <p>Files Selected: {watchedFiles.length}</p>
                <p>Amenities Selected: {watchedAmenities.length}</p>
                {watchedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Selected Files:</p>
                    {watchedFiles.map((file, index) => (
                      <p key={index} className="ml-2">
                        • {file.name} ({Math.round(file.size / 1024)}KB)
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Submit Property</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddProperty;
