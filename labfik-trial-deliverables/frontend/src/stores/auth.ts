import { defineStore } from "pinia";
import Keycloak from "keycloak-js";
import axios from "axios";
import { runtimeConfig } from "../config/runtime";
import type { AuthUser, LoginResponse, Role } from "../types";

const roles: Role[] = [
  "teknisi",
  "laboran",
  "kepala_lab",
  "tata_usaha",
  "wakil_dekan",
];
function tokenRole(claims: any): Role | undefined {
  const found = new Set<string>(claims?.realm_access?.roles ?? []);
  for (const role of claims?.resource_access?.[
    runtimeConfig.KEYCLOAK_ROLE_CLIENT_ID
  ]?.roles ?? [])
    found.add(role);
  return roles.find((role) => found.has(role));
}

let keycloak: Keycloak | undefined;
let refreshTimer: number | undefined;
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    loading: true,
    initialized: false,
    mode: runtimeConfig.AUTH_STRATEGY,
    error: "",
  }),
  actions: {
    async initialize() {
      if (this.initialized) return;
      this.loading = true;
      this.error = "";
      try {
        if (this.mode === "local") {
          const raw = localStorage.getItem("auth_user");
          const token = localStorage.getItem("access_token");
          if (raw && token) this.user = JSON.parse(raw);
          return;
        }
        keycloak = new Keycloak({
          url: runtimeConfig.KEYCLOAK_URL,
          realm: runtimeConfig.KEYCLOAK_REALM,
          clientId: runtimeConfig.KEYCLOAK_CLIENT_ID,
        });
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          checkLoginIframe: false,
        });
        if (!authenticated || !keycloak.token || !keycloak.tokenParsed) return;
        const role = tokenRole(keycloak.tokenParsed);
        if (!role) throw new Error("Akun tidak memiliki role LabOps FIK");
        this.user = {
          userId: keycloak.subject ?? "",
          email: String(
            keycloak.tokenParsed.email ??
              keycloak.tokenParsed.preferred_username ??
              "",
          ),
          nama: String(
            keycloak.tokenParsed.name ??
              keycloak.tokenParsed.preferred_username ??
              "",
          ),
          role,
        };
        this.persist(keycloak.token);
        refreshTimer = window.setInterval(async () => {
          try {
            if (await keycloak?.updateToken(60))
              this.persist(keycloak?.token ?? "");
          } catch {
            this.clear();
          }
        }, 30000);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Autentikasi gagal";
        this.clear();
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },
    persist(token: string) {
      if (token) localStorage.setItem("access_token", token);
      if (this.user)
        localStorage.setItem("auth_user", JSON.stringify(this.user));
    },
    clear() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
      this.user = null;
      if (refreshTimer) window.clearInterval(refreshTimer);
    },
    async login(email: string, password: string) {
      const { data } = await axios.post<LoginResponse>(
        `${runtimeConfig.API_URL}/auth/login`,
        { email, password },
      );
      this.user = data.user;
      this.persist(data.access_token);
    },
    async loginSso() {
      await keycloak?.login({
        redirectUri: `${window.location.origin}/dashboard`,
      });
    },
    async logout() {
      this.clear();
      if (this.mode === "keycloak" && keycloak)
        await keycloak.logout({
          redirectUri: `${window.location.origin}/login`,
        });
      else window.location.href = "/login";
    },
  },
});
