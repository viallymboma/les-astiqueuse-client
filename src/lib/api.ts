import axios from "axios";
import keycloak from "./keycloak";
import { ensureFreshToken } from "./auth-refresh";

const api = axios.create({
  baseURL: "https://www.dev.lesastiqueuses.fr/api",
});

api.interceptors.request.use(async (config) => {
  await ensureFreshToken();

  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});

export default api;
