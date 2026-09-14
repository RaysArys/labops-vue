#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Pemakaian: $0 http://IP-SERVER:3001"
  exit 1
fi

APP_URL=${1%/}
KEYCLOAK_CONTAINER=${KEYCLOAK_CONTAINER:-labfik-trial-deliverables-keycloak-1}
ADMIN_USER=${KEYCLOAK_ADMIN:-admin}
ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD:-admin-trial-change-me}

docker exec "$KEYCLOAK_CONTAINER" /opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 --realm master \
  --user "$ADMIN_USER" --password "$ADMIN_PASSWORD"

CLIENT_UUID=$(docker exec "$KEYCLOAK_CONTAINER" /opt/keycloak/bin/kcadm.sh \
  get clients -r labfik -q clientId=labfik-frontend --fields id --format csv --noquotes)

docker exec "$KEYCLOAK_CONTAINER" /opt/keycloak/bin/kcadm.sh update \
  "clients/$CLIENT_UUID" -r labfik \
  -s "redirectUris=[\"$APP_URL/*\"]" \
  -s "webOrigins=[\"$APP_URL\"]" \
  -s "attributes.\"post.logout.redirect.uris\"=\"$APP_URL/*\""

echo "Redirect, web origin, dan logout URI Keycloak diubah ke $APP_URL"
