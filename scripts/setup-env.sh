#!/bin/bash
# Script para configurar variables de entorno en producción
# Uso: ./scripts/setup-env.sh

set -e

echo "🔧 Configuración de Variables de Entorno para Producción"
echo ""

# Generar NEXTAUTH_SECRET si no existe
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "🔐 Generando NEXTAUTH_SECRET..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "✅ NEXTAUTH_SECRET generado: $NEXTAUTH_SECRET"
    echo ""
fi

# Prompt para DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "📦 Ingresa tu DATABASE_URL (de Neon, Railway, etc.):"
    read -r DATABASE_URL
    echo ""
fi

# Prompt para NEXTAUTH_URL
if [ -z "$NEXTAUTH_URL" ]; then
    echo "🌐 Ingresa tu NEXTAUTH_URL (ej: https://tu-app.vercel.app):"
    read -r NEXTAUTH_URL
    echo ""
fi

# Prompt para email
echo "📧 Configuración de Email:"
echo "1. Resend (recomendado)"
echo "2. Gmail SMTP"
echo "3. SendGrid"
read -p "Selecciona opción (1-3): " email_option

case $email_option in
    1)
        echo "📧 Ingresa tu API Key de Resend:"
        read -r RESEND_API_KEY
        EMAIL_SERVER_HOST="smtp.resend.com"
        EMAIL_SERVER_PORT="587"
        EMAIL_SERVER_USER="resend"
        EMAIL_SERVER_PASSWORD="$RESEND_API_KEY"
        EMAIL_FROM="onboarding@resend.dev"
        ;;
    2)
        echo "📧 Ingresa tu email de Gmail:"
        read -r GMAIL_EMAIL
        echo "📧 Ingresa tu App Password de Gmail:"
        read -r GMAIL_PASSWORD
        EMAIL_SERVER_HOST="smtp.gmail.com"
        EMAIL_SERVER_PORT="587"
        EMAIL_SERVER_USER="$GMAIL_EMAIL"
        EMAIL_SERVER_PASSWORD="$GMAIL_PASSWORD"
        EMAIL_FROM="$GMAIL_EMAIL"
        ;;
    3)
        echo "📧 Ingresa tu API Key de SendGrid:"
        read -r SENDGRID_API_KEY
        EMAIL_SERVER_HOST="smtp.sendgrid.net"
        EMAIL_SERVER_PORT="587"
        EMAIL_SERVER_USER="apikey"
        EMAIL_SERVER_PASSWORD="$SENDGRID_API_KEY"
        echo "📧 Ingresa tu email remitente:"
        read -r EMAIL_FROM
        ;;
    *)
        echo "Opción inválida"
        exit 1
        ;;
esac

# Crear archivo .env.local
echo ""
echo "📝 Creando archivo .env.local..."
cat > .env.local << EOF
# Base de Datos
DATABASE_URL=$DATABASE_URL

# NextAuth
NEXTAUTH_URL=$NEXTAUTH_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Email
EMAIL_SERVER_HOST=$EMAIL_SERVER_HOST
EMAIL_SERVER_PORT=$EMAIL_SERVER_PORT
EMAIL_SERVER_USER=$EMAIL_SERVER_USER
EMAIL_SERVER_PASSWORD=$EMAIL_SERVER_PASSWORD
EMAIL_FROM=$EMAIL_FROM
EOF

echo "✅ Archivo .env.local creado"
echo ""
echo "📋 Variables configuradas:"
echo "  DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "  NEXTAUTH_URL: $NEXTAUTH_URL"
echo "  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "  EMAIL_SERVER_HOST: $EMAIL_SERVER_HOST"
echo ""
echo "💡 Para Vercel, ejecuta: vercel env pull"
echo "💡 Para Railway, ejecuta: railway variables set DATABASE_URL=\"$DATABASE_URL\""

