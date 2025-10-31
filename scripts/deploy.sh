#!/bin/bash
# Script de Deploy Automatizado - Matríztica App
# Uso: ./scripts/deploy.sh [vercel|railway|render]

set -e

ENV=${1:-vercel}
echo "🚀 Iniciando deploy a $ENV..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar que las variables requeridas estén configuradas
check_env_vars() {
    echo "🔍 Verificando variables de entorno..."
    
    local missing_vars=()
    
    if [ -z "$DATABASE_URL" ]; then
        missing_vars+=("DATABASE_URL")
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        missing_vars+=("NEXTAUTH_SECRET")
    fi
    
    if [ -z "$NEXTAUTH_URL" ]; then
        missing_vars+=("NEXTAUTH_URL")
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo -e "${RED}❌ Faltan variables de entorno requeridas:${NC}"
        printf '%s\n' "${missing_vars[@]}"
        echo ""
        echo "Por favor configura estas variables antes de continuar."
        exit 1
    fi
    
    echo -e "${GREEN}✅ Variables de entorno OK${NC}"
}

# Función para verificar que Prisma esté configurado
check_prisma() {
    echo "🔍 Verificando configuración de Prisma..."
    
    if [ ! -f "prisma/schema.prisma" ]; then
        echo -e "${RED}❌ No se encontró prisma/schema.prisma${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Schema de Prisma encontrado${NC}"
}

# Función para generar Prisma Client
generate_prisma() {
    echo "🔧 Generando Prisma Client..."
    npx prisma generate
    echo -e "${GREEN}✅ Prisma Client generado${NC}"
}

# Función para ejecutar migraciones
run_migrations() {
    echo "📦 Ejecutando migraciones de base de datos..."
    npx prisma migrate deploy
    echo -e "${GREEN}✅ Migraciones aplicadas${NC}"
}

# Función para deploy en Vercel
deploy_vercel() {
    echo "🌐 Deployando a Vercel..."
    
    # Verificar que Vercel CLI esté instalado
    if ! command -v vercel &> /dev/null; then
        echo "📦 Instalando Vercel CLI..."
        npm install -g vercel
    fi
    
    # Verificar que esté logueado
    if ! vercel whoami &> /dev/null; then
        echo "🔐 Por favor inicia sesión en Vercel:"
        vercel login
    fi
    
    # Linkear proyecto si no está linkeado
    if [ ! -f ".vercel/project.json" ]; then
        echo "🔗 Linkeando proyecto..."
        vercel link
    fi
    
    # Pull de variables de entorno
    echo "📥 Descargando variables de entorno..."
    vercel env pull .env.local
    
    # Verificar variables
    check_env_vars
    
    # Generar Prisma Client
    generate_prisma
    
    # Ejecutar migraciones
    run_migrations
    
    # Deploy
    echo "🚀 Desplegando..."
    vercel --prod
    
    echo -e "${GREEN}✅ Deploy completado!${NC}"
    echo "🌍 Tu app está disponible en: https://$(vercel ls | grep Production | awk '{print $2}')"
}

# Función para deploy en Railway
deploy_railway() {
    echo "🚂 Deployando a Railway..."
    
    # Verificar que Railway CLI esté instalado
    if ! command -v railway &> /dev/null; then
        echo "📦 Instalando Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Verificar que esté logueado
    if ! railway whoami &> /dev/null; then
        echo "🔐 Por favor inicia sesión en Railway:"
        railway login
    fi
    
    # Linkear proyecto si no está linkeado
    if [ ! -f ".railway.json" ]; then
        echo "🔗 Linkeando proyecto..."
        railway link
    fi
    
    # Ejecutar migraciones
    echo "📦 Ejecutando migraciones..."
    railway run npx prisma migrate deploy
    
    # Deploy
    echo "🚀 Desplegando..."
    railway up
    
    echo -e "${GREEN}✅ Deploy completado!${NC}"
}

# Función para verificar pre-deploy
pre_deploy_check() {
    echo "🔍 Verificando preparación para deploy..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm no está instalado${NC}"
        exit 1
    fi
    
    # Verificar que existan las dependencias
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias..."
        npm install --legacy-peer-deps
    fi
    
    # Verificar Prisma
    check_prisma
    
    # Verificar build
    echo "🔨 Verificando build..."
    npm run build
    
    echo -e "${GREEN}✅ Todas las verificaciones pasaron${NC}"
}

# Menú principal
case $ENV in
    vercel)
        pre_deploy_check
        deploy_vercel
        ;;
    railway)
        pre_deploy_check
        deploy_railway
        ;;
    check)
        pre_deploy_check
        ;;
    *)
        echo "Uso: ./scripts/deploy.sh [vercel|railway|check]"
        echo ""
        echo "Comandos:"
        echo "  vercel   - Deploy a Vercel"
        echo "  railway  - Deploy a Railway"
        echo "  check    - Solo verificar preparación"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 ¡Deploy completado exitosamente!${NC}"

