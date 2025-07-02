"use client";

import { useFormContext } from "react-hook-form";
import {
  Building,
  Bed,
  Bath,
  ChefHat,
  Car,
  Layers,
  Home,
  FileText,
} from "lucide-react";

const ListingDetails = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const garages = watch("garages");

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Listing Details
        </h2>
        <p className="text-gray-600">
          Provide detailed information about your property
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Size in Ft */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="inline w-4 h-4 mr-1" />
            Size (sq ft) *
          </label>
          <input
            {...register("sizeInFt", {
              required: "Size is required",
              pattern: {
                value: /^\d+$/,
                message: "Please enter a valid number",
              },
            })}
            type="number"
            placeholder="1200"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.sizeInFt ? "border-red-500" : "border-gray-300"}
            `}
          />
          {errors.sizeInFt && (
            <p className="mt-1 text-sm text-red-600">
              {errors.sizeInFt.message}
            </p>
          )}
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Bed className="inline w-4 h-4 mr-1" />
            Bedrooms *
          </label>
          <select
            {...register("bedrooms", {
              required: "Number of bedrooms is required",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.bedrooms ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Bedroom" : "Bedrooms"}
              </option>
            ))}
          </select>
          {errors.bedrooms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bedrooms.message}
            </p>
          )}
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Bath className="inline w-4 h-4 mr-1" />
            Bathrooms *
          </label>
          <select
            {...register("bathrooms", {
              required: "Number of bathrooms is required",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.bathrooms ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Bathroom" : "Bathrooms"}
              </option>
            ))}
          </select>
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bathrooms.message}
            </p>
          )}
        </div>

        {/* Kitchens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ChefHat className="inline w-4 h-4 mr-1" />
            Kitchens *
          </label>
          <select
            {...register("kitchens", {
              required: "Number of kitchens is required",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.kitchens ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Kitchen" : "Kitchens"}
              </option>
            ))}
          </select>
          {errors.kitchens && (
            <p className="mt-1 text-sm text-red-600">
              {errors.kitchens.message}
            </p>
          )}
        </div>

        {/* Floors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Layers className="inline w-4 h-4 mr-1" />
            Floors *
          </label>
          <select
            {...register("floors", {
              required: "Number of floors is required",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.floors ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Floor" : "Floors"}
              </option>
            ))}
          </select>
          {errors.floors && (
            <p className="mt-1 text-sm text-red-600">{errors.floors.message}</p>
          )}
        </div>

        {/* Garages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Car className="inline w-4 h-4 mr-1" />
            Garages
          </label>
          <select
            {...register("garages")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">None</option>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Garage" : "Garages"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Garage Size - Show only if garages selected */}
      {garages && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Garage Size (sq ft) *
            </label>
            <input
              {...register("garageSize", {
                required: garages
                  ? "Garage size is required when garages are selected"
                  : false,
                pattern: {
                  value: /^\d+$/,
                  message: "Please enter a valid number",
                },
              })}
              type="number"
              placeholder="200"
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                ${errors.garageSize ? "border-red-500" : "border-gray-300"}
              `}
            />
            {errors.garageSize && (
              <p className="mt-1 text-sm text-red-600">
                {errors.garageSize.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              House Number
            </label>
            <input
              {...register("houseNumber")}
              type="text"
              placeholder="123A"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Listing Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline w-4 h-4 mr-1" />
          Detailed Description *
        </label>
        <textarea
          {...register("listingDescription", {
            required: "Detailed description is required",
            minLength: {
              value: 30,
              message: "Description must be at least 30 characters",
            },
          })}
          rows={5}
          placeholder="Provide detailed information about the property features, amenities, and any special characteristics..."
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none
            ${errors.listingDescription ? "border-red-500" : "border-gray-300"}
          `}
        />
        {errors.listingDescription && (
          <p className="mt-1 text-sm text-red-600">
            {errors.listingDescription.message}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {watch("listingDescription")?.length || 0} characters (minimum 30)
        </p>
      </div>
    </div>
  );
};

export default ListingDetails;
