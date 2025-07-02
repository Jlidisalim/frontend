const Amenities = ({ amenities = [] }) => {
  // Amenity ID to name mapping (same as in AmenitiesSelection)
  const amenityNames = {
    air_conditioning: "Air Conditioning",
    parking: "Parking",
    security: "Security",
    garden: "Garden",
    swimming_pool: "Swimming Pool",
    gym: "Gym",
    elevator: "Elevator",
    balcony: "Balcony",
    terrace: "Terrace",
    fireplace: "Fireplace",
    storage: "Storage Room",
    laundry: "Laundry Room",
    internet: "High-Speed Internet",
    furnished: "Furnished",
    pet_friendly: "Pet Friendly",
    wheelchair_accessible: "Wheelchair Accessible",
  };

  // Amenity ID to icon mapping
  const amenityIcons = {
    air_conditioning: "❄️",
    parking: "🚗",
    security: "🔒",
    garden: "🌿",
    swimming_pool: "🏊",
    gym: "💪",
    elevator: "🛗",
    balcony: "🏠",
    terrace: "🏡",
    fireplace: "🔥",
    storage: "📦",
    laundry: "👕",
    internet: "📶",
    furnished: "🛋️",
    pet_friendly: "🐕",
    wheelchair_accessible: "♿",
  };

  // Default amenities if none provided
  const defaultAmenities = [
    "air_conditioning",
    "parking",
    "security",
    "garden",
  ];

  // Use provided amenities or defaults
  const displayAmenities = amenities.length > 0 ? amenities : defaultAmenities;

  // Filter out any invalid amenities and map to display objects
  const validAmenities = displayAmenities
    .filter((amenityId) => amenityNames[amenityId]) // Only include valid amenity IDs
    .map((amenityId) => ({
      id: amenityId,
      name: amenityNames[amenityId],
      icon: amenityIcons[amenityId] || "✓",
    }));

  console.log("🏠 Amenities received:", amenities);
  console.log("🏠 Valid amenities to display:", validAmenities);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Property amenities and features for your comfort and convenience.
        </p>
      </div>

      {validAmenities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validAmenities.map((amenity) => (
            <div
              key={amenity.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                <span className="text-xl">{amenity.icon}</span>
              </div>
              <span className="text-gray-700 font-medium">{amenity.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">
          <p>No amenities specified for this property.</p>
        </div>
      )}
    </div>
  );
};

export default Amenities;
