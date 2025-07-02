/* eslint-disable no-undef */
// Property service to handle API calls
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const fetchPropertyById = async (id) => {
  try {
    // Make actual API call to your backend
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);

    if (!response.ok) {
      throw new Error("Property not found");
    }

    const data = await response.json();

    // Process images to match your backend structure
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.map((img) => {
        if (typeof img === "string") return img;
        if (img.img_dir) return `http://localhost:5000/${img.img_dir}`;
        return img.url || img.src || "/placeholder.svg?height=500&width=800";
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching property:", error);

    // Fallback to mock data for development
    return getMockPropertyData(id);
  }
};

// Mock data that matches your backend structure
const getMockPropertyData = (id) => {
  return {
    id_overview_property: id,
    property_title_overview: "Beautiful Modern Villa with Garden View",
    description_overview:
      "This stunning property offers luxurious living with modern amenities and breathtaking views. Perfect for families looking for comfort and style in a prime location.",
    description_listing:
      "Experience the epitome of modern living in this beautifully designed villa. Featuring spacious rooms, high-end finishes, and thoughtful layouts that maximize both comfort and functionality.",
    category: "Villa",
    listed: "Sale",
    price: "850000",
    size_in_ft: "2500",
    bedrooms: "4",
    bathrooms: "3",
    kitchens: "2",
    garages: "2",
    garage_size: "400 sqft",
    floors_number: "2",
    house_number: "123",
    address: "123 Luxury Lane",
    city: "Tunis",
    state: "Tunis",
    country: "Tunisia",
    map_location: "36.8065,10.1815",
    img_dir: "uploads/property1.jpg",
    images: [
      "http://localhost:5000/uploads/property1.jpg",
      "http://localhost:5000/uploads/property2.jpg",
      "http://localhost:5000/uploads/property3.jpg",
      "http://localhost:5000/uploads/property4.jpg",
    ],
    amenities: [
      { name_select_details: "High-Speed Internet" },
      { name_select_details: "Swimming Pool" },
      { name_select_details: "Fitness Center" },
      { name_select_details: "24/7 Security" },
      { name_select_details: "Covered Parking" },
      { name_select_details: "Garden/Balcony" },
      { name_select_details: "Air Conditioning" },
      { name_select_details: "Central Heating" },
    ],
  };
};

export const fetchAllProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
