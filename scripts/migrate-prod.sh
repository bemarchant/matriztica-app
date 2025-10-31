#!/bin/bash
# Script para ejecutar migraciones en producción
# Uso: ./scripts/migrate-prod.sh [vercel|railway|neon]

set -e

ENV=${1:-vercel}

echo "📦 Ejecutando migraciones en producción ($ENV)..."

case $ENV in
    vercel)
        echo "🔗 Conectando a Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Instalando Vercel CLI..."
            npm install -g vercel
        fi
        
        if ! vercel whoami &> /dev/null; then
            vercel login
        fi
        
        if [ ! -f ".vercel/project.json" ]; then
            vercel link
        fi
        
        echo "📥 Descargando variables de entorno..."
        vercel env pull .env.local
        
        echo "🔧 Generando Prisma Client..."
        npx prisma generate
        
        echo "📦 Ejecutando migraciones..."
        npx prisma migrate deploy
        
        echo "✅ Migraciones aplicadas"
        ;;
    
    railway)
        echo "🚂 Conectando a Railway..."
        if ! command -v railway &> /dev/null; then
            echo "📦 Instalando Railway CLI..."
            npm install -g @railway/cli
        fi
        
        if ! railway whoami &> /dev/null; then
            railway login
        fi
        
        if [ ! -f ".railway.json" ]; then
            railway link
        fi
        
        echo "📦 Ejecutando migraciones..."
        railway run npx prisma migrate deploy
        
        echo "✅ Migraciones aplicadas"
        ;;
    
    neon)
        echo "☁️ Conectando a Neon..."
        if [ -z "$DATABASE_URL" ]; then
            echo "❌ DATABASE_URL no está configurado"
            echo "Por favor configura: export DATABASE_URL='tu-connection-string'"
            exit 1
        fi
        
        echo "🔧 Generando Prisma Client..."
        npx prisma generate
        
        echo "📦 Ejecutando migraciones..."
        npx prisma migrate deploy
        
        echo "✅ Migraciones aplicadas"
        ;;
    
    *)
        echo "Uso: ./scripts/migrate-prod.sh [vercel|railway|neon]"
        exit 1
        ;;
esac

echo ""
echo "✅ ¡Migraciones completadas exitosamente!"

