"use client";

import { useState } from "react";
import {
  MoreVertical,
  Trash2,
  Edit,
  StickyNote,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";

const ClientCard = ({
  client,
  onEdit,
  onDelete,
  onViewNotes,
  onViewVisits,
}) => {
  const [imageError, setImageError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getImageSrc = () => {
    if (imageError || !client.img_dir) {
      return `/placeholder.svg?height=120&width=120`;
    }

    // Handle your image path structure
    const imagePath = client.img_dir;

    if (imagePath.startsWith("img/")) {
      return `http://localhost:5000/uploads/${imagePath}`;
    }

    return `http://localhost:5000/uploads/clients/${imagePath}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "interesting":
        return "bg-green-100 text-green-800";
      case "potential":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = () => {
    setDropdownOpen(false);
    onEdit(client.id_client);
  };

  const handleDelete = () => {
    setDropdownOpen(false);
    onDelete(client.id_client);
  };

  const handleViewNotes = () => {
    setDropdownOpen(false);
    onViewNotes(client.id_client);
  };

  const handleViewVisits = () => {
    setDropdownOpen(false);
    onViewVisits(client.id_client);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header with Image and Status */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={getImageSrc() || "/placeholder.svg"}
                alt={client.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={() => setImageError(true)}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {client.full_name}
              </h3>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  client.status
                )}`}
              >
                {client.status}
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Client</span>
                    </button>
                    <button
                      onClick={handleViewNotes}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <StickyNote className="w-4 h-4" />
                      <span>View Notes</span>
                    </button>
                    <button
                      onClick={handleViewVisits}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Visits</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="px-6 space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{client.mail}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {client.phone_display || `+216 ${client.phone_number}`}
          </span>
        </div>
        {client.locatiion && (
          <div className="flex items-center space-x-3 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{client.locatiion}</span>
          </div>
        )}
      </div>

      {/* Property Interest */}
      {client.appartement_interesting && (
        <div className="px-6 py-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium mb-1">
              Interested Property
            </p>
            <p className="text-sm text-blue-800">
              {client.appartement_interesting}
            </p>
          </div>
        </div>
      )}

      {/* Call Information */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">First Call</span>
            </div>
            <p className="text-gray-900 font-medium">
              {formatDate(client.first_call)}
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Last Call</span>
            </div>
            <p className="text-gray-900 font-medium">
              {formatDate(client.last_call)}
            </p>
          </div>
        </div>
      </div>

      {/* Notes Count */}
      {client.notes && client.notes.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Notes</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {client.notes.length} note{client.notes.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCard;
