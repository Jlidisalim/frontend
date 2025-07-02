"use client";

import { useFormContext } from "react-hook-form";
import { MapPin, Globe, Building2, Map } from "lucide-react";

const LocationDetails = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const countries = ["Tunisia", "Algeria", "Morocco", "Egypt", "Libya"];

  const cities = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Kairouan",
    "Bizerte",
    "Gabès",
    "Ariana",
    "Gafsa",
    "Monastir",
    "Ben Arous",
  ];

  const states = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Kef",
    "Siliana",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Gabès",
    "Medenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kebili",
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Location Details
        </h2>
        <p className="text-gray-600">Where is your property located?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline w-4 h-4 mr-1" />
            Street Address *
          </label>
          <input
            {...register("address", {
              required: "Address is required",
              minLength: {
                value: 5,
                message: "Address must be at least 5 characters",
              },
            })}
            type="text"
            placeholder="Enter full street address"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.address ? "border-red-500" : "border-gray-300"}
            `}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline w-4 h-4 mr-1" />
            Country *
          </label>
          <select
            {...register("country", {
              required: "Please select a country",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.country ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline w-4 h-4 mr-1" />
            City *
          </label>
          <select
            {...register("city", {
              required: "Please select a city",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.city ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province *
          </label>
          <select
            {...register("state", {
              required: "Please select a state",
            })}
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.state ? "border-red-500" : "border-gray-300"}
            `}
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        {/* Map Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Map className="inline w-4 h-4 mr-1" />
            Map Location/Coordinates *
          </label>
          <input
            {...register("mapLocation", {
              required: "Map location is required",
            })}
            type="text"
            placeholder="e.g., 36.8065, 10.1815 or Google Maps link"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
              ${errors.mapLocation ? "border-red-500" : "border-gray-300"}
            `}
          />
          {errors.mapLocation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.mapLocation.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            You can paste coordinates or a Google Maps link
          </p>
        </div>
      </div>

      {/* Location Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Location Tips:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Provide the exact street address for better visibility</li>
          <li>• Double-check the city and state selection</li>
          <li>• Map coordinates help buyers find your property easily</li>
          <li>
            • You can get coordinates from Google Maps by right-clicking on the
            location
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LocationDetails;
