import axios from "axios";
import { runtimeConfig } from "../config/runtime";
export const api = axios.create({ baseURL: runtimeConfig.API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export function errorMessage(error: unknown, fallback = "Terjadi kesalahan.") {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message;
    return Array.isArray(msg) ? msg.join(", ") : msg || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
