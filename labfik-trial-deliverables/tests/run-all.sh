#!/bin/sh
set -eu

(cd backend && npm test -- --runInBand)
(cd frontend && npm run typecheck)
(cd frontend && npm run build)

if command -v docker >/dev/null 2>&1; then
  docker compose config >/dev/null
  docker compose up -d --build
  ./tests/functional/infrastructure-smoke.sh
  ./tests/integration/keycloak-api-role-matrix.sh
else
  echo "Docker tidak tersedia; functional/integration runtime dilewati."
fi
