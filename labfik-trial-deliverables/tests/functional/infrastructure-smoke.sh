#!/bin/sh
set -eu

check() {
  name=$1
  url=$2
  curl -fsS --retry 20 --retry-delay 2 --retry-all-errors "$url" >/dev/null
  echo "LULUS $name: $url"
}

check "Frontend" "${FRONTEND_URL:-http://localhost:3001}"
check "Backend" "${API_URL:-http://localhost:3000}"
check "Keycloak realm" "${KEYCLOAK_URL:-http://localhost:8080}/realms/${KEYCLOAK_REALM:-labfik}/.well-known/openid-configuration"
check "Mailpit" "${MAILPIT_URL:-http://localhost:8025}/api/v1/info"

echo "Seluruh service trial dapat dijangkau."
