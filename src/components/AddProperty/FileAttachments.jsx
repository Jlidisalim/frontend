/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Upload,
  X,
  ImageIcon,
  Video,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const FileAttachments = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [dragActive, setDragActive] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedId, setLastFetchedId] = useState(null);

  const watchedFiles = watch("files") || [];

  // CRITICAL FIX: Ensure form state is always synchronized with component state
  useEffect(() => {
    console.log("🔄 Syncing files with form state...");
    console.log("📁 newFiles:", newFiles.length);
    console.log("📁 watchedFiles:", watchedFiles.length);

    // Only update if there's a difference to avoid infinite loops
    if (newFiles.length !== watchedFiles.length) {
      console.log("🔧 Updating form files...");
      setValue("files", newFiles, { shouldValidate: true });
    }
  }, [newFiles, setValue, watchedFiles.length]);

  // Load existing images when in edit mode
  useEffect(() => {
    const propertyTitle = watch("propertyTitle");
    const pathParts = window.location.pathname.split("/");
    const propertyId = pathParts[pathParts.length - 1];

    if (
      propertyTitle &&
      propertyId &&
      propertyId !== "add-property" &&
      propertyId !== lastFetchedId
    ) {
      console.log("🔄 Property data changed, fetching fresh images...");
      fetchExistingImages(propertyId);
      setLastFetchedId(propertyId);
    }
  }, [watch("propertyTitle"), lastFetchedId]);

  // Reset state when component unmounts or property changes
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up FileAttachments component state...");
      setExistingImages([]);
      setDeletedImages([]);
      setNewFiles([]);
      setLastFetchedId(null);
    };
  }, []);

  const fetchExistingImages = async (propertyId) => {
    try {
      setLoading(true);
      console.log("🖼️ Fetching existing images for property:", propertyId);

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyId}?t=${Date.now()}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.images) {
          console.log("📸 Found existing images:", result.data.images);

          const validImages = result.data.images.filter(
            (img) => img && img.trim() !== ""
          );

          // Test each image URL accessibility
          const accessibleImages = [];
          for (const filename of validImages) {
            try {
              const imageUrl = getImageUrl(filename);
              const imageResponse = await fetch(imageUrl, { method: "HEAD" });
              if (imageResponse.ok) {
                accessibleImages.push(filename);
                console.log("✅ Image accessible:", filename);
              } else {
                console.log(
                  "❌ Image not accessible:",
                  filename,
                  imageResponse.status
                );
              }
            } catch (error) {
              console.log("❌ Image check failed:", filename, error.message);
            }
          }

          setExistingImages(accessibleImages);
          setDeletedImages([]);
          setValue("deletedImages", []);
        } else {
          console.log("📸 No images found for property");
          setExistingImages([]);
        }
      } else {
        console.error("❌ Failed to fetch property data:", response.status);
        setExistingImages([]);
      }
    } catch (error) {
      console.error("❌ Error fetching existing images:", error);
      setExistingImages([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = () => {
    const pathParts = window.location.pathname.split("/");
    const propertyId = pathParts[pathParts.length - 1];

    if (propertyId && propertyId !== "add-property") {
      console.log("🔄 Manual refresh of images...");
      setLastFetchedId(null);
      fetchExistingImages(propertyId);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log("📁 File input changed, files:", e.target.files?.length || 0);

    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    console.log("🔍 Processing files:", files.length);

    const validFiles = Array.from(files).filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/avi",
        "video/mov",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      console.log(
        "✅ Valid files:",
        validFiles.map((f) => f.name)
      );

      const updatedFiles = [...newFiles, ...validFiles];
      console.log("📁 Updated files array:", updatedFiles.length);

      setNewFiles(updatedFiles);
      // The useEffect will handle syncing with form state

      console.log("🔧 Files added to component state:", updatedFiles.length);
    } else {
      console.log("❌ No valid files to add");
    }
  };

  const removeNewFile = (index) => {
    console.log("🗑️ Removing file at index:", index);
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedFiles);
    // The useEffect will handle syncing with form state
    console.log("📁 Files after removal:", updatedFiles.length);
  };

  const removeExistingImage = (imagePath) => {
    console.log("🗑️ Marking image for deletion:", imagePath);
    const updatedDeletedImages = [...deletedImages, imagePath];
    setDeletedImages(updatedDeletedImages);
    setExistingImages(existingImages.filter((img) => img !== imagePath));
    setValue("deletedImages", updatedDeletedImages);
  };

  const getFileIcon = (file) => {
    if (file.type?.startsWith("video/")) {
      return <Video className="w-8 h-8 text-blue-500" />;
    }
    return <ImageIcon className="w-8 h-8 text-green-500" />;
  };

  const getImageUrl = (filename) => {
    if (filename.startsWith("http")) {
      return filename;
    }
    return `http://localhost:5000/uploads/${filename}`;
  };

  const displayedExistingImages = existingImages.filter(
    (img) => !deletedImages.includes(img)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Photos & Videos
        </h3>
        <p className="text-gray-600">
          Upload images and videos of your property
        </p>
      </div>

      {/* File Selection Status - CRITICAL DEBUG INFO */}
      <div
        className={`border rounded-lg p-4 ${
          newFiles.length === 0
            ? "bg-yellow-50 border-yellow-200"
            : "bg-green-50 border-green-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <AlertCircle
            className={`w-5 h-5 ${
              newFiles.length === 0 ? "text-yellow-600" : "text-green-600"
            }`}
          />
          <span className="font-medium text-gray-900">
            File Selection Status:
          </span>
        </div>
        <div className="mt-2 text-sm">
          <p>
            • Files selected: <strong>{newFiles.length}</strong>
          </p>
          <p>
            • Form files: <strong>{watchedFiles.length}</strong>
          </p>
          <p>
            • Existing images: <strong>{displayedExistingImages.length}</strong>
          </p>
          {newFiles.length === 0 && (
            <p className="text-red-600 font-medium mt-2">
              ⚠️ No files selected - this is why images aren't uploading!
            </p>
          )}
          {newFiles.length > 0 && (
            <p className="text-green-600 font-medium mt-2">
              ✅ Files ready for upload!
            </p>
          )}
        </div>
      </div>

      {/* Existing Images Section */}
      {(displayedExistingImages.length > 0 || loading) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Current Images ({displayedExistingImages.length})
            </h4>
            <button
              type="button"
              onClick={refreshImages}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading images...</span>
            </div>
          ) : displayedExistingImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedExistingImages.map((filename, index) => (
                <div
                  key={`existing-${filename}-${index}`}
                  className="relative group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={getImageUrl(filename) || "/placeholder.svg"}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("❌ Image failed to load:", filename);
                        e.target.src = "/placeholder.svg?height=200&width=200";
                        setExistingImages((prev) =>
                          prev.filter((img) => img !== filename)
                        );
                      }}
                      onLoad={() => {
                        console.log("✅ Image loaded successfully:", filename);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(filename)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    Existing
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>No existing images found</p>
            </div>
          )}
        </div>
      )}

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* CRITICAL: Remove register from input - we handle files manually */}
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drag & drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500">
          Supports: JPG, PNG, GIF, WEBP, MP4, AVI, MOV (Max 10MB each)
        </p>

        {newFiles.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              👆 Click here or drag files to select images for upload
            </p>
          </div>
        )}
      </div>

      {/* New Files Preview */}
      {newFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-green-700">
            ✅ Files Ready to Upload ({newFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newFiles.map((file, index) => (
              <div key={`new-${file.name}-${index}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-green-200 flex items-center justify-center">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      {getFileIcon(file)}
                      <p className="text-xs mt-2 text-gray-600 truncate px-2">
                        {file.name}
                      </p>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  New
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">
          Upload Guidelines:
        </h4>
        <ul className="space-y-2 text-blue-800">
          <li>• Upload high-quality images that showcase your property</li>
          <li>• Include photos of all rooms, exterior, and special features</li>
          <li>• Videos should be well-lit and stable</li>
          <li>• Maximum file size: 10MB per file</li>
          <li>• At least 3 photos are recommended</li>
        </ul>
      </div>

      {errors.files && (
        <p className="text-red-500 text-sm">{errors.files.message}</p>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 p-4 rounded-lg text-sm">
          <h5 className="font-semibold mb-2">Debug Info:</h5>
          <p>Existing Images: {existingImages.length}</p>
          <p>Deleted Images: {deletedImages.length}</p>
          <p>New Files: {newFiles.length}</p>
          <p>Watched Files: {watchedFiles.length}</p>
          <p>Last Fetched ID: {lastFetchedId}</p>
          {newFiles.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Selected Files:</p>
              {newFiles.map((file, index) => (
                <p key={index} className="ml-2 text-xs">
                  • {file.name} ({Math.round(file.size / 1024)}KB)
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileAttachments;
