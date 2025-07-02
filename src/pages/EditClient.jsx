/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Calendar,
  FileText,
  Plus,
  X,
  Loader2,
} from "lucide-react";

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notes, setNotes] = useState([""]);
  const [properties, setProperties] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      mail: "",
      location: "",
      firstCall: "",
      lastCall: "",
      status: "interesting",
      appartementInteresting: "",
    },
  });

  // Fetch client data and properties
  useEffect(() => {
    if (id) {
      fetchClientData();
      fetchProperties();
    }
  }, [id]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/clients/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        const client = result.data;

        // Split full name into first and last name
        const nameParts = client.full_name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Populate form fields
        setValue("fullName", client.full_name);
        setValue("phoneNumber", client.phone_number?.toString() || "");
        setValue("mail", client.mail || "");
        setValue("location", client.locatiion || "");
        setValue(
          "firstCall",
          client.first_call ? formatDateTimeLocal(client.first_call) : ""
        );
        setValue(
          "lastCall",
          client.last_call ? formatDateTimeLocal(client.last_call) : ""
        );
        setValue("status", client.status || "interesting");
        setValue(
          "appartementInteresting",
          client.appartement_interesting || ""
        );

        // Set notes
        if (client.notes && client.notes.length > 0) {
          setNotes(client.notes.filter((note) => note && note.trim() !== ""));
        }

        // Set image preview if exists
        if (client.img_dir) {
          setImagePreview(`http://localhost:5000/uploads/${client.img_dir}`);
        }
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

  const fetchProperties = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/properties");
      const result = await response.json();

      if (result.success) {
        setProperties(result.data);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addNote = () => {
    setNotes([...notes, ""]);
  };

  const removeNote = (index) => {
    if (notes.length > 1) {
      setNotes(notes.filter((_, i) => i !== index));
    }
  };

  const updateNote = (index, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });

      // Append notes
      notes.forEach((note) => {
        if (note.trim()) {
          formData.append("notes", note.trim());
        }
      });

      // Append image if selected
      if (selectedImage) {
        formData.append("files", selectedImage);
      } else if (imagePreview && imagePreview.includes("uploads/")) {
        // Keep existing image
        const imagePath = imagePreview.split("uploads/")[1];
        formData.append("currentImage", imagePath);
      }

      console.log("🚀 Updating client data...");

      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        window.showToast("Client updated successfully!", "success");
        navigate("/clients");
      } else {
        throw new Error(result.message || "Failed to update client");
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      window.showToast(`Failed to update client: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <span className="block mt-2 text-gray-600">
            Loading client data...
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
          <div className="space-x-4">
            <button
              onClick={() => navigate("/clients")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Clients
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

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Clients</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +216
                  </span>
                  <input
                    type="text"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="26901747"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("mail", { required: "Email is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@example.com"
                />
                {errors.mail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mail.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="145/A, Ranchview"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="interesting">Interesting</option>
                  <option value="little interesting">Little Interesting</option>
                  <option value="not interesting">Not Interesting</option>
                </select>
              </div>

              {/* Property Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Property *
                </label>
                <select
                  {...register("appartementInteresting")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select List Property</option>
                  {properties.map((property) => (
                    <option
                      key={property.id_overview_property}
                      value={property.id_overview_property}
                    >
                      {property.property_title_overview}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Call Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Call Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Call */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Call *
                </label>
                <input
                  type="datetime-local"
                  {...register("firstCall")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Last Call */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Call *
                </label>
                <input
                  type="datetime-local"
                  {...register("lastCall")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Photo & Video Attachment
              </h2>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                File Attachment *
              </label>

              <div className="flex items-center space-x-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <div className="flex items-center justify-center space-x-2 text-blue-600">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Upload file</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload file .jpg,.png,.mp4
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Note *
              </label>

              {notes.map((note, index) => (
                <div key={index} className="relative">
                  <textarea
                    value={note}
                    onChange={(e) => updateNote(index, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Write About This Client"
                  />
                  {notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addNote}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note</span>
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="reset"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset All
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Client</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClient;
