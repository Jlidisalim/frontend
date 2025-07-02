"use client";

import { useState } from "react";

// Advanced search toggle functionality
export const toggleAdvancedSearch = (isOpen, setIsOpen) => {
  setIsOpen(!isOpen);
};

// React hook for advanced search
export const useAdvancedSearch = (initialState = false) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(initialState);

  const toggleAdvanced = () => {
    setIsAdvancedOpen((prev) => !prev);
  };

  return {
    isAdvancedOpen,
    setIsAdvancedOpen,
    toggleAdvanced,
  };
};

// Legacy DOM manipulation version
export const initAdvancedSearchLegacy = () => {
  const btnMore = document.querySelector(".advance-search-button");

  if (btnMore) {
    btnMore.addEventListener("click", () => {
      const advancedSearch = document.querySelector(".advance-search");
      if (advancedSearch) {
        advancedSearch.classList.toggle("show");
      }
    });
  }
};

// Function to handle search form submission
export const handleAdvancedSearchSubmit = (formData, onSearch) => {
  const searchParams = {
    status: formData.get("status") || "",
    searchBar: formData.get("searchBar") || "",
    category: formData.get("category") || "",
    bedrooms: formData.get("bedrooms") || "",
    bathrooms: formData.get("bathrooms") || "",
    floors: formData.get("floors") || "",
    garage: formData.get("garage") || "",
    minPrice: Number.parseInt(formData.get("minPrice")) || 0,
    maxPrice: Number.parseInt(formData.get("maxPrice")) || 2500000,
    minSize: Number.parseInt(formData.get("minSize")) || 0,
    maxSize: Number.parseInt(formData.get("maxSize")) || 2500000,
    features: formData.getAll("features") || [],
  };

  if (onSearch) {
    onSearch(searchParams);
  }

  return searchParams;
};
