"use client";

import { useFormContext } from "react-hook-form";
import { CheckCircle, Home, Building, Upload, MapPin } from "lucide-react";

const ReviewSubmit = () => {
  const { watch } = useFormContext();
  const formData = watch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600">
          Please review your property details before submitting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Property Overview */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Home className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Property Overview
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Title:</span>
              <p className="font-medium">
                {formData.propertyTitle || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <p className="font-medium">
                {formData.category || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Listing:</span>
              <p className="font-medium">
                For {formData.listingType || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Price:</span>
              <p className="font-medium text-green-600">
                {formData.price
                  ? `${formatPrice(formData.price)} TND`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Tax Rate:</span>
              <p className="font-medium">
                {formData.taxRate
                  ? `${formatPrice(formData.taxRate)} TND/year`
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Listing Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Property Details
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Size:</span>
              <p className="font-medium">
                {formData.sizeInFt
                  ? `${formData.sizeInFt} sq ft`
                  : "Not specified"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Bedrooms:</span>
                <p className="font-medium">{formData.bedrooms || "0"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Bathrooms:</span>
                <p className="font-medium">{formData.bathrooms || "0"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Kitchens:</span>
                <p className="font-medium">{formData.kitchens || "0"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Floors:</span>
                <p className="font-medium">{formData.floors || "0"}</p>
              </div>
            </div>
            {formData.garages && (
              <div>
                <span className="text-sm text-gray-500">Garages:</span>
                <p className="font-medium">
                  {formData.garages}{" "}
                  {formData.garageSize ? `(${formData.garageSize} sq ft)` : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Files */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Media Files</h3>
          </div>
          <div>
            <span className="text-sm text-gray-500">Files uploaded:</span>
            <p className="font-medium">
              {formData.files?.length || 0} file
              {formData.files?.length !== 1 ? "s" : ""}
            </p>
            {formData.files?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.files.slice(0, 3).map((file, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {file.name?.substring(0, 15)}...
                  </span>
                ))}
                {formData.files.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{formData.files.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Address:</span>
              <p className="font-medium">
                {formData.address || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">City, State:</span>
              <p className="font-medium">
                {formData.city || "Not specified"},{" "}
                {formData.state || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Country:</span>
              <p className="font-medium">
                {formData.country || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Property Description
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {formData.description || "No description provided"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Detailed Description
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {formData.listingDescription || "No detailed description provided"}
          </p>
        </div>
      </div>

      {/* Final Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Before you submit:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Double-check all information for accuracy</li>
          <li>• Ensure all required fields are completed</li>
          <li>• Verify that uploaded images are clear and representative</li>
          <li>• Confirm the price and location details</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewSubmit;
