"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // FIXED: Consistent image URL generation
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=400&width=600";

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // For filenames, create proper URL
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  const getThumbnailUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=64&width=80";

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // For filenames, create proper URL
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  if (!images.length) {
    return (
      <div className="bg-white rounded-lg p-6 text-center shadow-sm">
        <div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // FIXED: Handle both string arrays and object arrays
  const getCurrentImage = () => {
    const currentImg = images[currentIndex];
    if (typeof currentImg === "string") {
      return currentImg;
    }
    return currentImg?.img_dir || currentImg;
  };

  const getImageAtIndex = (index) => {
    const img = images[index];
    if (typeof img === "string") {
      return img;
    }
    return img?.img_dir || img;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="relative">
        {/* Main Image */}
        <div className="aspect-video w-full overflow-hidden rounded-lg relative">
          <img
            src={getImageUrl(getCurrentImage()) || "/placeholder.svg"}
            alt={`Property image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("❌ Image failed to load:", getCurrentImage());
              e.target.src = "/placeholder.svg?height=400&width=600";
            }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={
                    getThumbnailUrl(getImageAtIndex(index)) ||
                    "/placeholder.svg"
                  }
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=64&width=80";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
