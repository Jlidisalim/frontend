"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  Home,
  Loader2,
  Save,
  X,
} from "lucide-react";

const ClientVisits = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [newVisit, setNewVisit] = useState({
    timeViste: "",
    propertie: "",
    interestingClient: "Yes",
    anotherVisite: "",
  });

  useEffect(() => {
    if (id) {
      fetchClientData();
      fetchVisits();
      fetchProperties();
    }
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/clients/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setClient(result.data);
      } else {
        throw new Error("Client not found");
      }
    } catch (err) {
      console.error("Error fetching client:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${id}/visits`
      );
      const result = await response.json();

      if (result.success) {
        setVisits(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/properties/list`
      );
      const result = await response.json();

      if (result.success) {
        setProperties(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const handleAddVisit = async () => {
    if (!newVisit.timeViste || !newVisit.propertie) {
      if (window.showToast) {
        window.showToast("Please fill in visit date and property", "error");
      }
      return;
    }

    try {
      const visitData = {
        nomClient: client.full_name,
        timeViste: newVisit.timeViste,
        phoneClient: `+216 ${client.phone_number}`,
        interestingClient: newVisit.interestingClient,
        anotherVisite: newVisit.anotherVisite || null,
        propertie: newVisit.propertie,
      };

      const response = await fetch(
        `http://localhost:5000/api/clients/${id}/visits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitData),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setNewVisit({
          timeViste: "",
          propertie: "",
          interestingClient: "Yes",
          anotherVisite: "",
        });
        setIsAddingVisit(false);
        fetchVisits(); // Refresh visits list
        if (window.showToast) {
          window.showToast("Visit added successfully!", "success");
        }
      } else {
        throw new Error(result.message || "Failed to add visit");
      }
    } catch (error) {
      console.error("Error adding visit:", error);
      if (window.showToast) {
        window.showToast(`Failed to add visit: ${error.message}`, "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <span className="block mt-2 text-gray-600">
            Loading client visits...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/clients")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Clients</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Client Visits</h1>
            {client && <p className="text-gray-600">{client.full_name}</p>}
          </div>

          <button
            onClick={() => setIsAddingVisit(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Visit</span>
          </button>
        </div>

        {/* Client Info Card */}
        {client && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                {client.img_dir ? (
                  <img
                    src={`http://localhost:5000/uploads/${client.img_dir}`}
                    alt={client.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-600">
                    {client.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {client.full_name}
                </h2>
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{client.mail}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <Phone className="w-4 h-4" />
                  <span>+216 {client.phone_number}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{client.locatiion || "Location not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Visit Modal/Form */}
        {isAddingVisit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Visit
                </h3>
                <button
                  onClick={() => setIsAddingVisit(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    value={newVisit.timeViste}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, timeViste: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property *
                  </label>
                  <select
                    value={newVisit.propertie}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, propertie: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.title}>
                        {property.title} - {property.category} (
                        {property.price?.toLocaleString()} TND)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Phone
                  </label>
                  <input
                    type="text"
                    value={`+216 ${client?.phone_number || ""}`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={client?.mail || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interested?
                  </label>
                  <select
                    value={newVisit.interestingClient}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        interestingClient: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Visit Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newVisit.anotherVisite}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        anotherVisite: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAddingVisit(false);
                    setNewVisit({
                      timeViste: "",
                      propertie: "",
                      interestingClient: "Yes",
                      anotherVisite: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVisit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Visit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visit History Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Visit History
            </h3>
            <span className="text-sm text-gray-500">
              {visits.length} total visits
            </span>
          </div>

          {visits.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No visits recorded
              </h4>
              <p className="text-gray-500 mb-6">Start tracking client visits</p>
              <button
                onClick={() => setIsAddingVisit(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Visit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {new Date(visit.timeViste).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Home className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{visit.propertie}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          visit.interestingClient === "Yes"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {visit.interestingClient === "Yes"
                          ? "Interested"
                          : "Not Interested"}
                      </span>
                      {visit.anotherVisite && (
                        <div className="text-sm text-gray-600">
                          Next:{" "}
                          {new Date(visit.anotherVisite).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Phone: {visit.phoneClient}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientVisits;
