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

if [ "$NODE_ENV" = "production" ]; then
  echo "Construyendo aplicación para producción..."
  npm run build
  echo "Iniciando servidor de producción..."
  exec npm start
else
  echo "Iniciando servidor de desarrollo..."
  exec npm run dev
fi
