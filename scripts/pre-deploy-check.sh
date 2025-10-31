#!/bin/bash
# Script de verificación pre-deploy
# Verifica que todo esté listo antes de hacer deploy

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 Verificación Pre-Deploy"
echo "=========================="
echo ""

ERRORS=0

# Verificar Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    VERSION=$(node -v)
    echo -e "${GREEN}✅ $VERSION${NC}"
else
    echo -e "${RED}❌ No instalado${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Verificar npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    VERSION=$(npm -v)
    echo -e "${GREEN}✅ $VERSION${NC}"
else
    echo -e "${RED}❌ No instalado${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Verificar dependencias
echo -n "Dependencias: "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  No instaladas (ejecuta: npm install)${NC}"
fi

# Verificar Prisma
echo -n "Prisma Schema: "
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅ Encontrado${NC}"
else
    echo -e "${RED}❌ No encontrado${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Verificar migraciones
echo -n "Migraciones: "
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    COUNT=$(find prisma/migrations -mindepth 1 -type d | wc -l)
    echo -e "${GREEN}✅ $COUNT migraciones encontradas${NC}"
else
    echo -e "${YELLOW}⚠️  No hay migraciones${NC}"
fi

# Verificar variables de entorno
echo ""
echo "Variables de Entorno:"
echo -n "  DATABASE_URL: "
if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✅ Configurada${NC}"
else
    echo -e "${RED}❌ No configurada${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo -n "  NEXTAUTH_SECRET: "
if [ -n "$NEXTAUTH_SECRET" ]; then
    echo -e "${GREEN}✅ Configurada${NC}"
else
    echo -e "${RED}❌ No configurada${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo -n "  NEXTAUTH_URL: "
if [ -n "$NEXTAUTH_URL" ]; then
    echo -e "${GREEN}✅ Configurada${NC}"
else
    echo -e "${YELLOW}⚠️  No configurada (necesaria para producción)${NC}"
fi

# Verificar build
echo ""
echo -n "Build: "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Exitoso${NC}"
else
    echo -e "${RED}❌ Falló${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Resumen
echo ""
echo "=========================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las verificaciones pasaron${NC}"
    echo "🚀 Listo para deploy!"
    exit 0
else
    echo -e "${RED}❌ Se encontraron $ERRORS error(es)${NC}"
    echo "Por favor corrige los errores antes de hacer deploy"
    exit 1
fi

