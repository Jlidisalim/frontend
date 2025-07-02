"use client";

import { useFormContext } from "react-hook-form";
import { Check, Home } from "lucide-react";

const AmenitiesSelection = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedAmenities = watch("amenities") || [];

  const availableAmenities = [
    { id: "air_conditioning", name: "Air Conditioning", icon: "❄️" },
    { id: "parking", name: "Parking", icon: "🚗" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "garden", name: "Garden", icon: "🌿" },
    { id: "swimming_pool", name: "Swimming Pool", icon: "🏊" },
    { id: "gym", name: "Gym", icon: "💪" },
    { id: "elevator", name: "Elevator", icon: "🛗" },
    { id: "balcony", name: "Balcony", icon: "🏠" },
    { id: "terrace", name: "Terrace", icon: "🏡" },
    { id: "fireplace", name: "Fireplace", icon: "🔥" },
    { id: "storage", name: "Storage Room", icon: "📦" },
    { id: "laundry", name: "Laundry Room", icon: "👕" },
    { id: "internet", name: "High-Speed Internet", icon: "📶" },
    { id: "furnished", name: "Furnished", icon: "🛋️" },
    { id: "pet_friendly", name: "Pet Friendly", icon: "🐕" },
    { id: "wheelchair_accessible", name: "Wheelchair Accessible", icon: "♿" },
  ];

  const toggleAmenity = (amenityId) => {
    const currentAmenities = selectedAmenities || [];
    const isSelected = currentAmenities.includes(amenityId);

    let updatedAmenities;
    if (isSelected) {
      updatedAmenities = currentAmenities.filter((id) => id !== amenityId);
    } else {
      updatedAmenities = [...currentAmenities, amenityId];
    }

    setValue("amenities", updatedAmenities);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Home className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Property Amenities
        </h3>
        <p className="text-gray-600">
          Select the amenities and features available in your property
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">
          Available Amenities
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableAmenities.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity.id);

            return (
              <div
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`
                  relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{amenity.icon}</span>
                  <span className="font-medium text-gray-900">
                    {amenity.name}
                  </span>
                  {isSelected && (
                    <div className="ml-auto">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Amenities Summary */}
      {selectedAmenities.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">
            Selected Amenities ({selectedAmenities.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedAmenities.map((amenityId) => {
              const amenity = availableAmenities.find(
                (a) => a.id === amenityId
              );
              return (
                <span
                  key={amenityId}
                  className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span>{amenity?.icon}</span>
                  <span>{amenity?.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden input for form registration */}
      <input
        type="hidden"
        {...register("amenities")}
        value={JSON.stringify(selectedAmenities)}
      />

      {errors.amenities && (
        <p className="text-red-500 text-sm">{errors.amenities.message}</p>
      )}
    </div>
  );
};

export default AmenitiesSelection;
