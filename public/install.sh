#!/bin/sh
set -e

# OpenSOAR installer
# Usage: curl -fsSL https://opensoar.app/install.sh | sh

INSTALL_DIR="${OPENSOAR_DIR:-opensoar}"
COMPOSE_URL="https://raw.githubusercontent.com/opensoar-hq/opensoar-deploy/main/docker-compose.yml"
ENV_URL="https://raw.githubusercontent.com/opensoar-hq/opensoar-deploy/main/.env.example"

echo "Installing OpenSOAR..."

# Check for docker
if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed. Install it from https://docs.docker.com/get-docker/" >&2
  exit 1
fi

# Check for docker compose
if ! docker compose version >/dev/null 2>&1; then
  echo "Error: docker compose is not available. Install Docker Compose v2." >&2
  exit 1
fi

# Create directory
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Download compose file
echo "Downloading docker-compose.yml..."
curl -fsSL "$COMPOSE_URL" -o docker-compose.yml

# Download .env if it doesn't exist
if [ ! -f .env ]; then
  curl -fsSL "$ENV_URL" -o .env
  # Generate a random JWT secret
  JWT_SECRET=$(head -c 32 /dev/urandom | base64 | tr -d '/+=' | head -c 32)
  if command -v sed >/dev/null 2>&1; then
    sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env 2>/dev/null || true
    rm -f .env.bak
  fi
fi

# Start services
echo "Starting OpenSOAR..."
docker compose up -d

echo ""
echo "OpenSOAR is running!"
echo "  UI:  http://localhost:3000"
echo "  API: http://localhost:8000"
echo ""
echo "Default login: admin / admin123"
echo "Directory: $(pwd)"
