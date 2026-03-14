import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7208/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json"
  }
});

// ======================================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// ======================================
API.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================
// RESPONSE INTERCEPTOR
// Global error handling
// ======================================
API.interceptors.response.use(
  (response) => response,
  (error) => {

    // Network error
    if (!error.response) {
      console.error("Network error. Backend may be down.");
      alert("Server not reachable. Make sure backend is running.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 401 Unauthorized
    if (status === 401) {

      localStorage.removeItem("token");

      alert("Session expired. Please login again.");

      window.location.href = "/login";
    }

    // 403 Forbidden
    if (status === 403) {
      alert("You do not have permission to perform this action.");
    }

    // 500 Server error
    if (status === 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default API;