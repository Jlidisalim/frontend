"use client";

import { Edit, Trash2, Eye, User, Home, Calendar } from "lucide-react";

const SaleCard = ({ sale, onEdit, onDelete, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "promise":
        return "bg-yellow-100 text-yellow-800";
      case "full_sale":
        return "bg-blue-100 text-blue-800";
      case "finalized":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "promise":
        return "Promise";
      case "full_sale":
        return "Full Sale";
      case "finalized":
        return "Finalized";
      default:
        return status;
    }
  };

  const getProgressPercentage = () => {
    return Number.parseFloat(sale.paid_percentage) || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {sale.property_title || "Property Sale"}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Home className="w-4 h-4 mr-1" />
              <span>{sale.property_type}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              sale.sale_status
            )}`}
          >
            {getStatusText(sale.sale_status)}
          </span>
        </div>

        {/* Property Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Address:</span>
            <span className="ml-2">
              {sale.property_address}, {sale.property_city}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>{sale.client_name}</span>
          </div>
        </div>

        {/* Financial Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Total Amount
            </span>
            <span className="text-lg font-bold text-gray-900">
              {Number.parseFloat(sale.total_amount).toLocaleString()} TND
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Paid: {sale.paid_percentage}%</span>
              <span>Remaining: {sale.remaining_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">
              Paid: {Number.parseFloat(sale.paid_amount).toLocaleString()} TND
            </span>
            <span className="text-red-600 font-medium">
              Remaining:{" "}
              {Number.parseFloat(sale.remaining_amount).toLocaleString()} TND
            </span>
          </div>
        </div>

        {/* Dates */}
        {sale.signature_date && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              Signed: {new Date(sale.signature_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(sale.id)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View Details</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(sale.id)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Sale"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(sale.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete Sale"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
