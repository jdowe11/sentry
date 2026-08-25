#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
else
  echo "Error: .env file not found at $PROJECT_ROOT/.env"
  exit 1
fi

# must run this when initializing database because postgres can be slow with docker
echo "Connecting to database $POSTGRES_DB_NAME..."

echo "Waiting for PostgreSQL to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=1
until docker exec sentry-postgres pg_isready -U "$POSTGRES_DB_USER" -d "$POSTGRES_DB_NAME" >/dev/null 2>&1; do
  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "Error: PostgreSQL was not ready after $MAX_ATTEMPTS seconds. Exiting."
    exit 1
  fi
  echo "Database is not ready yet (attempt $ATTEMPT/$MAX_ATTEMPTS). Retrying in 1 second..."
  sleep 1
  ATTEMPT=$((ATTEMPT + 1))
done

echo "Creating tables..."
docker exec -i sentry-postgres psql -U "$POSTGRES_DB_USER" -d "$POSTGRES_DB_NAME" < "$PROJECT_ROOT/database/create-tables.sql"

echo "Seeding users..."
docker exec -i sentry-postgres psql -U "$POSTGRES_DB_USER" -d "$POSTGRES_DB_NAME" < "$PROJECT_ROOT/database/seed-users.sql"

echo "Seeding friend requests..."
docker exec -i sentry-postgres psql -U "$POSTGRES_DB_USER" -d "$POSTGRES_DB_NAME" < "$PROJECT_ROOT/database/seed-friend-requests.sql"

echo "Seeding friendships..."
docker exec -i sentry-postgres psql -U "$POSTGRES_DB_USER" -d "$POSTGRES_DB_NAME" < "$PROJECT_ROOT/database/seed-friendships.sql"

echo "Database initialization completed successfully!"
