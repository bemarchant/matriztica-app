# Guía de Deploy - Matríztica App

## Opción 1: Vercel + Neon (Recomendada) ⭐

### Paso 1: Preparar Base de Datos (Neon)

1. Crear cuenta en [Neon](https://neon.tech) (gratis)
2. Crear un nuevo proyecto PostgreSQL
3. Copiar la **Connection String** (DATABASE_URL)
   - Ejemplo: `postgresql://user:pass@host.neon.tech/dbname?sslmode=require`

### Paso 2: Deploy en Vercel

1. **Conectar repositorio:**
   - Ir a [Vercel](https://vercel.com)
   - Importar proyecto desde GitHub/GitLab
   - Conectar este repositorio

2. **Configurar variables de entorno:**
   ```
   DATABASE_URL=postgresql://... (de Neon)
   NEXTAUTH_URL=https://tu-app.vercel.app
   NEXTAUTH_SECRET=<generar-secreto-seguro>
   EMAIL_SERVER_HOST=smtp.gmail.com (o tu proveedor)
   EMAIL_SERVER_PORT=587
   EMAIL_FROM=tu-email@gmail.com
   EMAIL_SERVER_USER=tu-email@gmail.com
   EMAIL_SERVER_PASSWORD=tu-app-password
   ```

3. **Generar NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Ejecutar migraciones:**
   - Vercel ejecutará `npm run build` automáticamente
   - Necesitamos ejecutar migraciones manualmente la primera vez
   - Opción A: Usar Vercel CLI
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull .env.local
   npx prisma migrate deploy
   ```
   - Opción B: Usar Neon SQL Editor para ejecutar migraciones manualmente

### Paso 3: Configurar Build Command

En Vercel, asegurarse de que:
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install --legacy-peer-deps`

### Paso 4: Configurar Email (NextAuth)

Para desarrollo puedes usar:
- **Resend** (recomendado, fácil): https://resend.com
- **Gmail SMTP** (requiere App Password)
- **SendGrid** (gratis hasta 100 emails/día)

Con Resend:
```env
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_xxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
```

---

## Opción 2: Railway (Todo en Uno)

### Paso 1: Crear cuenta en Railway

1. Ir a [Railway](https://railway.app)
2. Conectar con GitHub

### Paso 2: Crear Base de Datos

1. En Railway Dashboard → "New Project"
2. "Add PostgreSQL" → Crear base de datos
3. Copiar `DATABASE_URL` de las variables

### Paso 3: Deploy App

1. "New" → "Deploy from GitHub repo"
2. Seleccionar este repositorio
3. Railway detectará automáticamente el Dockerfile

### Paso 4: Configurar Variables

En Railway → Variables:
```
DATABASE_URL=<automático de PostgreSQL>
NEXTAUTH_URL=https://tu-app.railway.app
NEXTAUTH_SECRET=<generar con openssl>
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_xxxxx
EMAIL_FROM=onboarding@resend.dev
```

### Paso 5: Ejecutar Migraciones

1. Railway CLI:
```bash
npm i -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
```

---

## Opción 3: Render (Similar a Railway)

1. Crear cuenta en [Render](https://render.com)
2. Crear PostgreSQL Database
3. Crear Web Service desde GitHub
4. Usar Dockerfile existente
5. Configurar variables de entorno
6. Ejecutar migraciones en Shell

---

## Checklist Pre-Deploy

- [ ] Base de datos PostgreSQL creada
- [ ] Variables de entorno configuradas
- [ ] NEXTAUTH_SECRET generado (seguro)
- [ ] Email provider configurado (Resend recomendado)
- [ ] Migraciones ejecutadas en producción
- [ ] Dominio personalizado (opcional)
- [ ] HTTPS habilitado (automático en Vercel/Railway)

---

## Costos Estimados

### Vercel + Neon:
- **Vercel:** Gratis (hasta 100GB bandwidth/mes)
- **Neon:** Gratis (hasta 0.5GB storage)
- **Total:** $0/mes para empezar

### Railway:
- **Free tier:** $5 crédito/mes (suficiente para empezar)
- PostgreSQL: ~$5/mes
- App: Gratis con créditos

---

## Recomendación Final

**Para empezar rápido:** Vercel + Neon
- Más fácil para Next.js
- Deploy automático desde Git
- Gratis para empezar
- Escala fácilmente

**Si prefieres Docker:** Railway
- Todo en un solo lugar
- Soporte Docker nativo
- Más control

¿Quieres que prepare algún archivo específico o que te guíe paso a paso con alguna opción?

