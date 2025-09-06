import axios from "axios";
import cookie from "js-cookie";

const BASE_URL = process.env.BASE_DEV_URL || "http://localhost:8888";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = cookie.get("access_token");
  if (token && !isPublicEndpoint(config.url)) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

function isPublicEndpoint(url) {
  const publicPaths = ["/login", "/register", "/otp", "/otp/verify"];
  return publicPaths.some((path) => url.startsWith(path));
}

export default api;
