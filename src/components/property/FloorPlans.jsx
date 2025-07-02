"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Home, Bed, Bath } from "lucide-react";

const FloorPlans = ({ floors = 1, property }) => {
  const [activeFloor, setActiveFloor] = useState(null);

  const toggleFloor = (floorIndex) => {
    setActiveFloor(activeFloor === floorIndex ? null : floorIndex);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Floor Plans</h3>

      {Array.from({ length: floors }, (_, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div
            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleFloor(index)}
          >
            <div className="flex items-center space-x-4">
              {activeFloor === index ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
              <h4 className="text-lg font-semibold">
                {index + 1}
                {getOrdinalSuffix(index + 1)} Floor
              </h4>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Sqft . {property.size_in_ft || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bed className="w-4 h-4" />
                <span>Bed . {property.bedrooms || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="w-4 h-4" />
                <span>Bath . {property.bathrooms || 0}</span>
              </div>
            </div>
          </div>

          {activeFloor === index && (
            <div className="px-6 pb-6">
              <div className="bg-gray-100 rounded-lg p-4">
                <img
                  src="/placeholder.svg?height=300&width=600"
                  alt={`Floor ${index + 1} plan`}
                  className="w-full h-auto rounded"
                />
                <p className="text-center text-gray-500 mt-4">
                  Floor plan coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloorPlans;
