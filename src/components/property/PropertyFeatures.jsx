const PropertyFeatures = ({ property }) => {
  const features = [
    { label: "Bedrooms", value: property.bedrooms || 0 },
    { label: "Furnishing", value: "Semi furnished" },
    { label: "Bathrooms", value: property.bathrooms || 0 },
    { label: "Kitchens", value: property.kitchens || 0 },
    { label: "Floor", value: property.floors_number || 0 },
    { label: "Garage", value: property.garages || 0 },
    { label: "Garage Size", value: property.garage_size || "N/A" },
    { label: "Property Type", value: property.category || "N/A" },
    { label: "Number Property", value: property.house_number || "N/A" },
    { label: "Status", value: property.listed || "N/A" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Property Features
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {property.description_listing ||
            "Detailed property information and features."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
        {features.map((feature, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{feature.label}:</span>
            <span className="font-semibold text-gray-900">{feature.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFeatures;
