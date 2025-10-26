import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // base path for your API endpoints
});

// 🧠 Automatically attach X-Role for ADMIN or STAFF
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Add X-Role header for both roles
  if (user && (user.role === "ADMIN" || user.role === "STAFF")) {
    config.headers["X-Role"] = user.role;
  }

  return config;
});

export default api;
