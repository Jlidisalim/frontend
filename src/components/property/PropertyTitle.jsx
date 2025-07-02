import { MapPin, Phone, User, Calendar, Tag } from "lucide-react";

const PropertyTitle = ({ property }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {property.property_title_overview || property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <Tag className="w-3 h-3" />
              {property.listed || property.status || "For Sale"}
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              <Calendar className="w-3 h-3" />
              {property.category || "Property"}
            </span>
          </div>

          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-lg">
              {property.address && `${property.address}, `}
              {property.city && `${property.city}, `}
              {property.state}
            </span>
          </div>
        </div>

        <div className="lg:text-right space-y-4">
          <p className="text-3xl lg:text-4xl font-bold text-green-600">
            {property.price} TND
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 lg:justify-end">
              <User className="w-4 h-4" />
              <span className="font-medium">Owner: Salim Jlidi</span>
            </div>
            <div className="flex items-center gap-2 lg:justify-end">
              <Phone className="w-4 h-4" />
              <span className="font-medium">+216 26901747</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTitle;
