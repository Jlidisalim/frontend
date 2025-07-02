"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Calendar,
  Tag,
  Loader2,
  Star,
  DollarSign,
} from "lucide-react";
import ImageGallery from "../components/property/ImageGallery";
import PropertyOverview from "../components/property/PropertyOverview";
import PropertyFeatures from "../components/property/PropertyFeatures";
import Amenities from "../components/property/Amenities";
import FloorPlans from "../components/property/FloorPlans";
import LocationMap from "../components/property/LocationMap";
import ScrollToTop from "../components/ScrollToTop";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Fetching property details for ID:", id);

      const response = await fetch(
        `http://localhost:5000/api/properties/${id}`
      );
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Property not found (${response.status})`);
      }

      const result = await response.json();
      console.log("📝 Property data received:", result);

      if (result.success && result.data) {
        // FIXED: Process images consistently with our backend format
        const processedImages = result.data.images || [];

        // Images are now stored as filenames only, so we just pass them as strings
        const formattedImages = processedImages.filter(
          (img) => img && img.trim() !== ""
        );

        const processedProperty = {
          ...result.data,
          // FIXED: Use the cleaned image array - just filenames
          images: formattedImages,
          // Add any missing fields with defaults
          amenities: result.data.amenities || [],
          latitude: result.data.latitude || 36.8065, // Default to Tunis coordinates
          longitude: result.data.longitude || 10.1815,
        };

        setProperty(processedProperty);
        console.log("✅ Property data processed:", processedProperty);
        console.log("📸 Processed images:", formattedImages);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("❌ Error fetching property:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <span className="block mt-2 text-gray-600">
            Loading property details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back Home
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
    );
  }

  if (!property) return null;

  // Helper function to format apartment state
  const formatApartmentState = (state) => {
    const stateMap = {
      excellent: "Excellent",
      "tres-bon": "Très bon",
      bon: "Bon",
      moyen: "Moyen",
      "a-renover": "À rénover",
      neuf: "Neuf",
      "en-construction": "En construction",
    };
    return stateMap[state] || state;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Properties</span>
        </button>
      </div>

      {/* Property Title Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {property.property_title_overview ||
                  property.propertyTitle ||
                  "Property Title"}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Tag className="w-3 h-3" />
                  {property.listed || property.listingType || "For Sale"}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Calendar className="w-3 h-3" />
                  {property.category || "Property"}
                </span>
                {(property.apartment_state || property.apartmentState) && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="w-3 h-3" />
                    {formatApartmentState(
                      property.apartment_state || property.apartmentState
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-lg">
                  {property.address && `${property.address}, `}
                  {property.city && `${property.city}, `}
                  {property.state}
                  {property.country && `, ${property.country}`}
                </span>
              </div>
            </div>

            <div className="lg:text-right space-y-4">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-green-600">
                  {property.price
                    ? `${Number(property.price).toLocaleString()} TND`
                    : "Prix sur demande"}
                </p>

                {/* Price Range Display */}
                {(property.price_min ||
                  property.priceMin ||
                  property.price_max ||
                  property.priceMax) && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 lg:justify-end">
                      <DollarSign className="w-4 h-4" />
                      <span>Fourchette de prix:</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {(property.price_min || property.priceMin) && (
                        <span>
                          Min:{" "}
                          {Number(
                            property.price_min || property.priceMin
                          ).toLocaleString()}{" "}
                          TND
                        </span>
                      )}
                      {(property.price_min || property.priceMin) &&
                        (property.price_max || property.priceMax) && (
                          <span> - </span>
                        )}
                      {(property.price_max || property.priceMax) && (
                        <span>
                          Max:{" "}
                          {Number(
                            property.price_max || property.priceMax
                          ).toLocaleString()}{" "}
                          TND
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 lg:justify-end">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    Propriétaire:{" "}
                    {property.owner_name || property.ownerName || "Salim Jlidi"}
                  </span>
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">
                    {property.owner_phone ||
                      property.ownerPhone ||
                      "+216 26901747"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery - FIXED: Pass images as simple array */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ImageGallery images={property.images} />
      </div>

      {/* Property Details */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-12">
          <PropertyOverview property={property} />
          <hr className="border-gray-200" />
          <PropertyFeatures property={property} />
          <hr className="border-gray-200" />
          <Amenities amenities={property.amenities} />
          <hr className="border-gray-200" />
          <FloorPlans
            floors={property.floors_number || 1}
            property={property}
          />
          <hr className="border-gray-200" />
          <LocationMap
            latitude={property.latitude}
            longitude={property.longitude}
          />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default PropertyDetails;
