#!/bin/sh
set -eu

KEYCLOAK_URL=${KEYCLOAK_URL:-http://localhost:8080}
API_URL=${API_URL:-http://localhost:3000}
REALM=${KEYCLOAK_REALM:-labfik}
CLIENT_ID=${KEYCLOAK_FRONTEND_CLIENT_ID:-labfik-frontend}
PASSWORD=${TRIAL_PASSWORD:-Trial123!}

token_for() {
  curl -fsS "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d "client_id=$CLIENT_ID" \
    -d "username=$1" \
    -d "password=$PASSWORD" \
    -d 'grant_type=password' |
    node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>process.stdout.write(JSON.parse(s).access_token||''))"
}

expect_code() {
  expected=$1
  token=$2
  method=$3
  path=$4
  body=${5:-}
  if [ -n "$body" ]; then
    code=$(curl -sS -o /tmp/labfik-test-response.json -w '%{http_code}' \
      -X "$method" "$API_URL$path" \
      -H "Authorization: Bearer $token" \
      -H 'Content-Type: application/json' \
      --data "$body")
  else
    code=$(curl -sS -o /tmp/labfik-test-response.json -w '%{http_code}' \
      -X "$method" "$API_URL$path" \
      -H "Authorization: Bearer $token")
  fi
  if [ "$code" != "$expected" ]; then
    echo "GAGAL $method $path: harap $expected, dapat $code"
    cat /tmp/labfik-test-response.json
    exit 1
  fi
  echo "LULUS $method $path -> $code"
}

for user in tu.trial wadek.trial laboran.trial kalab.trial teknisi.trial; do
  token=$(token_for "$user")
  expect_code 200 "$token" GET /dashboard
done

expect_code 403 "$(token_for laboran.trial)" POST /vendors '{}'
expect_code 403 "$(token_for teknisi.trial)" POST /stock-opname/periode '{}'
expect_code 403 "$(token_for wadek.trial)" POST /assets '{}'
expect_code 403 "$(token_for tu.trial)" PATCH /work-orders/00000000-0000-0000-0000-000000000000/prioritas '{}'
expect_code 403 "$(token_for kalab.trial)" POST /users '{}'
expect_code 403 "$(token_for laboran.trial)" POST /calibration/parameters '{}'
expect_code 403 "$(token_for wadek.trial)" PATCH /work-orders/00000000-0000-0000-0000-000000000000/laporan-wadek '{}'
expect_code 200 "$(token_for wadek.trial)" GET /work-orders

echo "Semua pengujian integrasi Keycloak dan role API lulus."
