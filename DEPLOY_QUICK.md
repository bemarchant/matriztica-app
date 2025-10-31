# Guía de Deploy Rápida - Matríztica App

## 🚀 Deploy en 10 minutos

### Paso 1: Base de Datos (Neon) - 2 min

1. Ve a https://neon.tech y crea cuenta gratuita
2. Click "Create Project"
3. Nombre: `matriztica-prod`
4. Copia el **Connection String** (DATABASE_URL)

### Paso 2: Deploy (Vercel) - 5 min

1. Ve a https://vercel.com y conecta tu cuenta de GitHub
2. Click "Import Project" → Selecciona este repositorio
3. Vercel detectará automáticamente Next.js

4. **Configurar variables de entorno** en Vercel Dashboard:
   ```
   DATABASE_URL=postgresql://... (de Neon)
   NEXTAUTH_URL=https://tu-app.vercel.app
   NEXTAUTH_SECRET=<generar con: openssl rand -base64 32>
   EMAIL_SERVER_HOST=smtp.resend.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=resend
   EMAIL_SERVER_PASSWORD=re_xxxxxxxxx
   EMAIL_FROM=onboarding@resend.dev
   ```

5. Click "Deploy"

### Paso 3: Migraciones - 3 min

Después del primer deploy, ejecuta migraciones:

**Opción A: Desde tu máquina local**
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npm run prisma:migrate:deploy
```

**Opción B: Desde Vercel Dashboard**
- Ve a tu proyecto → Settings → Environment Variables
- Asegúrate de que DATABASE_URL esté configurada
- Ve a Deployments → Latest → View Function Logs
- O usa Vercel CLI shell: `vercel shell`

**Opción C: Usar script automatizado**
```bash
npm run migrate:prod vercel
```

### Paso 4: Configurar Email (Resend) - 5 min

1. Ve a https://resend.com y crea cuenta
2. Ve a API Keys → Create API Key
3. Copia la API Key
4. Actualiza en Vercel:
   - `EMAIL_SERVER_PASSWORD=re_xxxxxxxxx`
5. Verifica dominio (opcional, puedes usar `onboarding@resend.dev` temporalmente)

---

## ✅ Verificación

```bash
# Verificar que todo esté listo
npm run deploy:check
```

---

## 🔄 Deploy Futuros

Después del setup inicial, solo necesitas:

```bash
# Push a GitHub → Deploy automático en Vercel
git push origin main
```

O si prefieres control manual:
```bash
npm run deploy:vercel
```

---

## 📋 Checklist Pre-Deploy

- [ ] Base de datos creada en Neon
- [ ] Variables de entorno configuradas en Vercel
- [ ] NEXTAUTH_SECRET generado y configurado
- [ ] Email provider configurado (Resend recomendado)
- [ ] Migraciones ejecutadas en producción
- [ ] Build exitoso (`npm run build`)

---

## 🆘 Troubleshooting

**Error: "Cannot find module '@prisma/client'"**
- Vercel ejecuta `postinstall` automáticamente ✅
- Si persiste, verifica que `postinstall` esté en `package.json`

**Error: "Migration not found"**
- Ejecuta: `npm run migrate:prod vercel`
- O manualmente: `vercel env pull && npx prisma migrate deploy`

**Error: "Build failed"**
- Verifica variables de entorno
- Revisa logs en Vercel Dashboard
- Ejecuta `npm run deploy:check` localmente

**Email no funciona**
- Verifica variables EMAIL_SERVER_*
- Prueba con Resend primero (más fácil)
- Verifica que el dominio esté verificado (si usas dominio propio)

---

## 📚 Documentación Completa

- `DEPLOY.md` - Guía completa con todas las opciones
- `scripts/README.md` - Documentación de scripts
- `.env.example` - Template de variables de entorno

---

## 💰 Costos

**Gratis para empezar:**
- Vercel: Free tier (100GB bandwidth/mes)
- Neon: Free tier (0.5GB storage)
- Resend: Free tier (100 emails/día)

**Total: $0/mes para empezar** 🎉
