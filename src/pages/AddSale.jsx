"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Search,
  Home,
  User,
  DollarSign,
  FileText,
} from "lucide-react";

const AddSale = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Search states
  const [propertySearch, setPropertySearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [propertyResults, setPropertyResults] = useState([]);
  const [clientResults, setClientResults] = useState([]);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [formData, setFormData] = useState({
    // Property Information (will be auto-filled)
    propertyId: "",
    propertyType: "",
    propertyTitle: "",
    propertyAddress: "",
    propertyCity: "",
    propertyGovernorate: "",
    surfaceArea: "",
    numberOfRooms: "",
    bathrooms: "",
    mainPrice: "",
    ownerName: "",
    ownerPhone: "",

    // Client Information (will be auto-filled)
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    clientCity: "",
    buyType: "cash",
    clientNote: "",

    // Sale Details
    saleStatus: "promise",
    signatureDate: "",
    percentagePaid: "",
    amountPaid: "",
    remainingSaleAmount: "",
    saleNote: "",

    // Other Information
    senateurState: "preparation",
    propertyNotes: "",
    agentName: "",
    agentCommission: "",
    commissionPaid: false,
  });

  // Search for properties (excluding sold ones)
  const searchProperties = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setPropertyResults([]);
      setShowPropertyDropdown(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/properties/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchTerm,
            excludeSold: true, // Add this parameter to exclude sold properties
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setPropertyResults(result.data.slice(0, 10));
        setShowPropertyDropdown(true);
      }
    } catch (error) {
      console.error("Error searching properties:", error);
    }
  };

  // Search for clients
  const searchClients = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setClientResults([]);
      setShowClientDropdown(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/clients/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchTerm,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setClientResults(result.data.slice(0, 10)); // Limit to 10 results
        setShowClientDropdown(true);
      }
    } catch (error) {
      console.error("Error searching clients:", error);
    }
  };

  // Handle property selection
  const selectProperty = (property) => {
    setSelectedProperty(property);
    setPropertySearch(`${property.property_title_overview} - ${property.city}`);
    setShowPropertyDropdown(false);

    // Auto-fill property data
    setFormData((prev) => ({
      ...prev,
      propertyId: property.id_overview_property,
      propertyType: property.category || "",
      propertyTitle: property.property_title_overview || "",
      propertyAddress: property.address || "",
      propertyCity: property.city || "",
      propertyGovernorate: property.state || "",
      surfaceArea: property.size_in_ft || "",
      numberOfRooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      mainPrice: property.price || "",
      ownerName: property.owner_name || "",
      ownerPhone: property.owner_phone || "",
    }));
  };

  // Handle client selection
  const selectClient = (client) => {
    setSelectedClient(client);
    setClientSearch(`${client.full_name} - ${client.phone_number}`);
    setShowClientDropdown(false);

    // Auto-fill client data
    setFormData((prev) => ({
      ...prev,
      clientId: client.id_client,
      clientName: client.full_name || "",
      clientPhone: client.phone_number || "",
      clientEmail: client.mail || "",
      clientAddress: client.locatiion || "",
      clientCity: client.locatiion || "", // You might want to separate this
      clientNote: client.notes ? client.notes.join(", ") : "",
    }));
  };

  // Handle property search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (propertySearch && !selectedProperty) {
        searchProperties(propertySearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [propertySearch, selectedProperty]);

  // Handle client search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (clientSearch && !selectedClient) {
        searchClients(clientSearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [clientSearch, selectedClient]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-calculate amounts and percentages
      if (name === "mainPrice" || name === "amountPaid") {
        const total = Number.parseFloat(newData.mainPrice) || 0;
        const paid = Number.parseFloat(newData.amountPaid) || 0;
        const remaining = total - paid;
        const percentage = total > 0 ? ((paid / total) * 100).toFixed(1) : 0;

        newData.remainingSaleAmount = remaining.toString();
        newData.percentagePaid = percentage.toString();
      }

      if (name === "percentagePaid") {
        const total = Number.parseFloat(newData.mainPrice) || 0;
        const percentage = Number.parseFloat(value) || 0;
        const paid = (total * percentage) / 100;
        const remaining = total - paid;

        newData.amountPaid = paid.toFixed(2);
        newData.remainingSaleAmount = remaining.toFixed(2);
      }

      return newData;
    });
  };

  const steps = [
    { id: 1, title: "Property Information", icon: Home },
    { id: 2, title: "Client Information", icon: User },
    { id: 3, title: "Sale Details", icon: DollarSign },
    { id: 4, title: "Other Information", icon: FileText },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (window.showToast) {
          window.showToast("Sale created successfully!", "success");
        }
        navigate("/sales");
      } else {
        throw new Error(result.message || "Failed to create sale");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      if (window.showToast) {
        window.showToast(`Failed to create sale: ${error.message}`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Home className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Property Information
              </h2>
            </div>

            {/* Property Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Property *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={propertySearch}
                  onChange={(e) => {
                    setPropertySearch(e.target.value);
                    setSelectedProperty(null);
                  }}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by property title, address, or city..."
                  required
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Property Dropdown */}
              {showPropertyDropdown && propertyResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {propertyResults.map((property) => (
                    <div
                      key={property.id_overview_property}
                      onClick={() => selectProperty(property)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {property.property_title_overview}
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.address}, {property.city} - {property.price}{" "}
                        DT
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.category} • {property.bedrooms} bed •{" "}
                        {property.bathrooms} bath
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-filled Property Details */}
            {selectedProperty && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Selected Property:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Title:</span>{" "}
                    {formData.propertyTitle}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {formData.propertyType}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {formData.propertyAddress}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span>{" "}
                    {formData.mainPrice} DT
                  </div>
                  <div>
                    <span className="font-medium">Owner:</span>{" "}
                    {formData.ownerName}
                  </div>
                  <div>
                    <span className="font-medium">Owner Phone:</span>{" "}
                    {formData.ownerPhone}
                  </div>
                </div>
              </div>
            )}

            {/* Manual Property Entry (if needed) */}
            {!selectedProperty && propertySearch && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Property not found? You can enter details manually:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) =>
                        handleInputChange("propertyType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select property type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Title
                    </label>
                    <input
                      type="text"
                      value={formData.propertyTitle}
                      onChange={(e) =>
                        handleInputChange("propertyTitle", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Appartement S+2 Lac 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Price (DT)
                    </label>
                    <input
                      type="number"
                      value={formData.mainPrice}
                      onChange={(e) =>
                        handleInputChange("mainPrice", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="250000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Owner name"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Client Information
              </h2>
            </div>

            {/* Client Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Client *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setSelectedClient(null);
                  }}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by client name, phone, or email..."
                  required
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Client Dropdown */}
              {showClientDropdown && clientResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clientResults.map((client) => (
                    <div
                      key={client.id_client}
                      onClick={() => selectClient(client)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {client.full_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        +216 {client.phone_number} • {client.mail}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: {client.status} • Location: {client.locatiion}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-filled Client Details */}
            {selectedClient && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Selected Client:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {formData.clientName}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> +216{" "}
                    {formData.clientPhone}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {formData.clientEmail}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {formData.clientAddress}
                  </div>
                </div>
              </div>
            )}

            {/* Manual Client Entry (if needed) */}
            {!selectedClient && clientSearch && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Client not found? You can enter details manually:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) =>
                        handleInputChange("clientName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) =>
                        handleInputChange("clientPhone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) =>
                        handleInputChange("clientEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buy Type
                    </label>
                    <select
                      value={formData.buyType}
                      onChange={(e) =>
                        handleInputChange("buyType", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cash">Cash</option>
                      <option value="loan">Loan</option>
                      <option value="installments">Installments</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <DollarSign className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Sale Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Status
                </label>
                <select
                  value={formData.saleStatus}
                  onChange={(e) =>
                    handleInputChange("saleStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="promise">Promise</option>
                  <option value="full_sale">Full Sale</option>
                  <option value="arboun_only">Arboun Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Signature
                </label>
                <input
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) =>
                    handleInputChange("signatureDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage Paid (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.percentagePaid}
                  onChange={(e) =>
                    handleInputChange("percentagePaid", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid (DT)
                </label>
                <input
                  type="number"
                  value={formData.amountPaid}
                  onChange={(e) =>
                    handleInputChange("amountPaid", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remaining Amount (DT)
                </label>
                <input
                  type="number"
                  value={formData.remainingSaleAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="225000"
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Note
                </label>
                <textarea
                  value={formData.saleNote}
                  onChange={(e) =>
                    handleInputChange("saleNote", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the sale..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Other Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senateur State
                </label>
                <select
                  value={formData.senateurState}
                  onChange={(e) =>
                    handleInputChange("senateurState", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="preparation">Preparation</option>
                  <option value="signature">Signature</option>
                  <option value="registered">Registered</option>
                  <option value="finalized">Finalized</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent/Samsar Name
                </label>
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) =>
                    handleInputChange("agentName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agent name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission % for Samsar
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.agentCommission}
                  onChange={(e) =>
                    handleInputChange("agentCommission", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2.5"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.commissionPaid}
                  onChange={(e) =>
                    handleInputChange("commissionPaid", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Commission Paid
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes sur Appartement/Maison
                </label>
                <textarea
                  value={formData.propertyNotes}
                  onChange={(e) =>
                    handleInputChange("propertyNotes", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the property..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/sales")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Sales</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Sale</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                        currentStep >= step.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 text-gray-500 bg-white"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="mt-2">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/sales")}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedProperty || !selectedClient}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Creating..." : "Create Sale"}</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedProperty) ||
                  (currentStep === 2 && !selectedClient)
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSale;
