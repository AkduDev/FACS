#!/bin/bash
set -e

echo "=== FCAS Backend Startup ==="

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push --skip-generate

echo "Seeding database..."
npx tsx prisma/seed.ts || echo "Seed skipped (data may already exist)"

echo "Starting server..."
node dist/server.mjs
