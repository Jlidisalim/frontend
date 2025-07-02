"use client";

import { useFormContext } from "react-hook-form";
import { Home, DollarSign } from "lucide-react";

const PropertyInformation = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const mainPrice = watch("mainPrice");
  const arbounAmount = watch("arbounAmount");

  // Auto-calculate remaining amount
  const calculateRemaining = () => {
    const main = Number.parseFloat(mainPrice) || 0;
    const arboun = Number.parseFloat(arbounAmount) || 0;
    const remaining = main - arboun;
    setValue("remainingAmount", remaining > 0 ? remaining : 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Home className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Property Information
        </h3>
        <p className="text-gray-600">
          Enter the property details for this sale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            {...register("propertyType", {
              required: "Property type is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select property type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.propertyType.message}
            </p>
          )}
        </div>

        {/* Property Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            {...register("propertyTitle", {
              required: "Property title is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Appartement S+2 Lac 2"
          />
          {errors.propertyTitle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.propertyTitle.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            {...register("propertyAddress")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Property address"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            {...register("propertyCity")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="City"
          />
        </div>

        {/* Governorate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Governorate/State
          </label>
          <input
            type="text"
            {...register("propertyGovernorate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Governorate"
          />
        </div>

        {/* Property Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Status
          </label>
          <select
            {...register("propertyStatus")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* Surface Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Surface Area (m²)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("surfaceArea")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Surface area in m²"
          />
        </div>

        {/* Number of Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Rooms
          </label>
          <input
            type="number"
            {...register("numberOfRooms")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Number of rooms"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <input
            type="number"
            {...register("bathrooms")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Number of bathrooms"
          />
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 text-green-600 mr-2" />
          <h4 className="text-lg font-semibold text-green-900">
            Price Information
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Price (TND) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("mainPrice", { required: "Main price is required" })}
              onBlur={calculateRemaining}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Main price"
            />
            {errors.mainPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mainPrice.message}
              </p>
            )}
          </div>

          {/* Arboun Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arboun (Down Payment)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("arbounAmount")}
              onBlur={calculateRemaining}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Down payment amount"
            />
          </div>

          {/* Remaining Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remaining Amount
            </label>
            <input
              type="number"
              step="0.01"
              {...register("remainingAmount")}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="Auto-calculated"
            />
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Name
          </label>
          <input
            type="text"
            {...register("ownerName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Property owner name"
          />
        </div>

        {/* Owner Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Phone Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              +216
            </span>
            <input
              type="text"
              {...register("ownerPhone")}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Owner phone number"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformation;
