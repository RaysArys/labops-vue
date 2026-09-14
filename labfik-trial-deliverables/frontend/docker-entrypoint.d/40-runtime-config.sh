#!/bin/sh
set -eu
cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__LABFIK_CONFIG__ = {
  API_URL: "${API_URL:-http://localhost:3000}",
  AUTH_STRATEGY: "${AUTH_STRATEGY:-keycloak}",
  KEYCLOAK_URL: "${KEYCLOAK_URL:-http://localhost:8080}",
  KEYCLOAK_REALM: "${KEYCLOAK_REALM:-labfik}",
  KEYCLOAK_CLIENT_ID: "${KEYCLOAK_CLIENT_ID:-labfik-frontend}",
  KEYCLOAK_ROLE_CLIENT_ID: "${KEYCLOAK_ROLE_CLIENT_ID:-labfik-api}"
};
EOF
