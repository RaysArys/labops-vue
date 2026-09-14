export type AuthMode = "local" | "keycloak";

interface RuntimeConfig {
  API_URL: string;
  AUTH_STRATEGY: AuthMode;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_ROLE_CLIENT_ID: string;
}

declare global {
  interface Window {
    __LABFIK_CONFIG__?: Partial<RuntimeConfig>;
  }
}

const injected = window.__LABFIK_CONFIG__ ?? {};
export const runtimeConfig: RuntimeConfig = {
  API_URL:
    injected.API_URL || import.meta.env.VITE_API_URL || "http://localhost:3000",
  AUTH_STRATEGY:
    (injected.AUTH_STRATEGY || import.meta.env.VITE_AUTH_STRATEGY) ===
    "keycloak"
      ? "keycloak"
      : "local",
  KEYCLOAK_URL:
    injected.KEYCLOAK_URL ||
    import.meta.env.VITE_KEYCLOAK_URL ||
    "http://localhost:8080",
  KEYCLOAK_REALM:
    injected.KEYCLOAK_REALM || import.meta.env.VITE_KEYCLOAK_REALM || "labfik",
  KEYCLOAK_CLIENT_ID:
    injected.KEYCLOAK_CLIENT_ID ||
    import.meta.env.VITE_KEYCLOAK_CLIENT_ID ||
    "labfik-frontend",
  KEYCLOAK_ROLE_CLIENT_ID:
    injected.KEYCLOAK_ROLE_CLIENT_ID ||
    import.meta.env.VITE_KEYCLOAK_ROLE_CLIENT_ID ||
    "labfik-api",
};
