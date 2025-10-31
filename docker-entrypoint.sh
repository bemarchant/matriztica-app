#!/bin/sh
set -e

echo "Esperando a que PostgreSQL esté listo..."
until nc -z postgres 5432; do
  sleep 1
done

echo "Ejecutando migraciones de Prisma..."
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init || true

echo "Generando Prisma Client..."
npx prisma generate

echo "Iniciando servidor de desarrollo..."
exec npm run dev

