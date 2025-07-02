import { useNavigate } from "react-router-dom";

export const editPropertyHandler = (propertyId, navigate) => {
  // Navigate to edit page with property ID
  navigate(`/edit-property/${propertyId}`);
};

// React hook for edit functionality
export const useEditProperty = () => {
  const navigate = useNavigate();

  const handleEdit = (propertyId) => {
    editPropertyHandler(propertyId, navigate);
  };

  return { handleEdit };
};

// Alternative function for form submission (legacy support)
export const editPropertyLegacy = (propertyId) => {
  const form = document.createElement("form");
  form.method = "post";
  form.action = "/edit-property";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "id";
  input.value = propertyId;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
};

// Function to redirect with property data
export const redirectToEdit = (propertyId, propertyData = null) => {
  const url = new URL("/edit-property", window.location.origin);
  url.searchParams.set("id", propertyId);

  if (propertyData) {
    // Store property data in sessionStorage for the edit page
    sessionStorage.setItem(
      `property_${propertyId}`,
      JSON.stringify(propertyData)
    );
  }

  window.location.href = url.toString();
};
