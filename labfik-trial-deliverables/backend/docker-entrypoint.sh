#!/bin/sh
set -eu

echo "Menjalankan migration database..."
node ./node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js
if [ "${AUTH_STRATEGY:-keycloak}" = "local" ] && [ "${ALLOW_TRIAL_SEED:-false}" = "true" ]; then
  node scripts/seed-local-trial-users.js
fi
echo "Menjalankan API LabFIK..."
exec node dist/main.js
