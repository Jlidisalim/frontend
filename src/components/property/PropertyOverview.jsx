import { Home, Bed, Bath, ChefHat } from "lucide-react";

const PropertyOverview = ({ property }) => {
  const features = [
    {
      icon: Home,
      label: "Sqft",
      value: property.size_in_ft || 0,
    },
    {
      icon: Bed,
      label: "Bed",
      value: property.bedrooms || 0,
    },
    {
      icon: Bath,
      label: "Bath",
      value: property.bathrooms || 0,
    },
    {
      icon: ChefHat,
      label: "Kitchen",
      value: property.kitchens || 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Overview</h3>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {property.description_overview || "No description available."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="text-center relative">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-gray-600 font-medium">
                  {feature.label} . {feature.value}
                </span>
              </div>
              {index < features.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gray-300 opacity-40" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyOverview;
