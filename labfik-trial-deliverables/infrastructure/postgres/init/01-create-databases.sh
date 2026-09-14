#!/bin/sh
set -eu

psql --set ON_ERROR_STOP=on --username "$POSTGRES_USER" --dbname postgres <<-SQL
  CREATE DATABASE "$POSTGRES_APP_DB";
  CREATE DATABASE "$POSTGRES_KEYCLOAK_DB";
SQL
