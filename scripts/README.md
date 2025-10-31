# Scripts de Deploy - Matríztica App

## 🚀 Scripts Disponibles

### Verificación Pre-Deploy
```bash
npm run deploy:check
```
Verifica que todo esté listo antes de hacer deploy:
- Node.js y npm instalados
- Dependencias instaladas
- Prisma configurado
- Variables de entorno configuradas
- Build exitoso

### Configurar Variables de Entorno
```bash
npm run setup:env
```
Script interactivo que te ayuda a configurar todas las variables de entorno necesarias para producción.

### Deploy a Vercel
```bash
npm run deploy:vercel
```
Deploy completo a Vercel:
1. Verifica configuración
2. Instala/verifica Vercel CLI
3. Descarga variables de entorno
4. Ejecuta migraciones
5. Hace deploy a producción

### Deploy a Railway
```bash
npm run deploy:railway
```
Deploy completo a Railway:
1. Verifica configuración
2. Instala/verifica Railway CLI
3. Ejecuta migraciones
4. Hace deploy

### Ejecutar Migraciones en Producción
```bash
npm run migrate:prod
```
Ejecuta migraciones de Prisma en producción (Vercel por defecto).

Opciones:
- `npm run migrate:prod vercel` - Ejecutar migraciones en Vercel
- `npm run migrate:prod railway` - Ejecutar migraciones en Railway
- `npm run migrate:prod neon` - Ejecutar migraciones con DATABASE_URL local

---

## 📋 Flujo de Deploy Recomendado

### 1. Preparación (primera vez)
```bash
# 1. Configurar variables de entorno
npm run setup:env

# 2. Verificar que todo esté listo
npm run deploy:check
```

### 2. Deploy Inicial
```bash
# Opción A: Vercel (recomendado)
npm run deploy:vercel

# Opción B: Railway
npm run deploy:railway
```

### 3. Deploy Futuros
```bash
# Simplemente ejecuta el script de deploy
npm run deploy:vercel
```

O si usas GitHub Actions (automático):
- Push a `main` → Deploy automático 🎉

---

## 🔧 Configuración Manual (si prefieres)

### Vercel CLI
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npm run prisma:migrate:deploy
vercel --prod
```

### Railway CLI
```bash
npm install -g @railway/cli
railway login
railway link
railway run npm run prisma:migrate:deploy
railway up
```

---

## 📝 Variables de Entorno Requeridas

Ver `.env.example` para la lista completa. Mínimas requeridas:

- `DATABASE_URL` - Connection string de PostgreSQL
- `NEXTAUTH_SECRET` - Secreto para NextAuth (generar con `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL de tu app en producción
- Variables de email (ver `.env.example`)

---

## 🐛 Troubleshooting

**Error: "Permission denied"**
```bash
chmod +x scripts/*.sh
```

**Error: "Command not found"**
- En Windows: Usar Git Bash o WSL
- En Linux/Mac: Debería funcionar directamente

**Error: "Migration failed"**
```bash
npm run migrate:prod
```

**Error: "Build failed"**
```bash
npm run deploy:check
```

