#!/bin/sh
# Startup script for Prisma application
# This script runs database migrations and starts the application

echo "Starting database migrations..."
pnpm prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "Error: Database migration failed. Aborting application startup."
  exit 1
fi

echo "Database migrations completed successfully"

echo "Starting application..."
node dist/index.js