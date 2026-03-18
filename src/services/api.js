const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const handleResponse = async (response) => {
  if (!response.ok) {
    let msg = "Error in request";
    try { const d = await response.json(); msg = d.message || d.error || msg; } catch { msg = `Error ${response.status}`; }
    throw new Error(msg);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers: getHeaders() });
    return handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch")
      throw new Error("Connection error. Check if the server is running on localhost:3000.");
    throw error;
  }
};

export const api = {
  auth: {
    register: (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    getProfile: () => apiRequest("/auth/profile"),
  },
  restaurants: {
    getAll: () => apiRequest("/restaurants"),
    getById: (id) => apiRequest(`/restaurants/${id}`),
    create: (data) => apiRequest("/restaurants", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/restaurants/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/restaurants/${id}`, { method: "DELETE" }),

    uploadImages: async (id, files) => {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      const response = await fetch(`${BASE_URL}/restaurants/${id}/images`, {
        method: "POST", headers: getAuthHeader(), body: formData,
      });
      return handleResponse(response);
    },
    deleteImage: (id, index) => apiRequest(`/restaurants/${id}/images/${index}`, { method: "DELETE" }),
    reorderImages: (id, images) => apiRequest(`/restaurants/${id}/images/reorder`, { method: "PUT", body: JSON.stringify({ images }) }),
  },
  reviews: {
    getByRestaurant: (restaurantId) => apiRequest(`/reviews/restaurant/${restaurantId}`),
    create: (data) => apiRequest("/reviews", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/reviews/${id}`, { method: "DELETE" }),
  },
  users: {
    getAll: () => apiRequest("/users"),
    getById: (id) => apiRequest(`/users/${id}`),
  },
};