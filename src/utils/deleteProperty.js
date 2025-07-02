import { propertiesAPI } from "../services/api";

export const deletePropertyHandler = async (propertyId, onSuccess, onError) => {
  try {
    const response = await propertiesAPI.delete(propertyId);

    if (response.data.success) {
      // Call success callback
      if (onSuccess) {
        onSuccess(propertyId, response.data);
      }

      // Show success message
      if (window.showToast) {
        window.showToast("Property deleted successfully", "success");
      }

      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.message || "Failed to delete property");
    }
  } catch (error) {
    console.error("Delete error:", error);

    // Call error callback
    if (onError) {
      onError(error);
    }

    // Show error message
    if (window.showToast) {
      window.showToast("Failed to delete property", "error");
    }

    return { success: false, error: error.message };
  }
};

// Alternative function for direct DOM manipulation (if needed for legacy support)
export const deletePropertyLegacy = (propertyId) => {
  if (!confirm("Are you sure you want to delete this property?")) {
    return;
  }

  fetch("/api/properties/" + propertyId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);

      // Remove the property card from DOM
      const propertyCard = document.querySelector(
        `[data-property-id="${propertyId}"]`
      );
      if (propertyCard) {
        propertyCard.remove();
      }

      // Show success message
      if (window.showToast) {
        window.showToast("Property deleted successfully", "success");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (window.showToast) {
        window.showToast("Failed to delete property", "error");
      }
    });
};
