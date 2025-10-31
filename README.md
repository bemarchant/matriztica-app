# Matríztica App

Registro sereno de emociones–sentires–haceres para acompañar el hacer sentido de la persona usuaria.

## Coherencia Matríztica (síntesis)
- La app no prescribe ni patologiza; invita a observar coherencias entre sentir–hacer–decir.
- Determinismo estructural: el entorno gatilla, no determina. Los prompts guían reflexión para ver el propio operar.
- Emocionar y lenguajear entrelazados: se incluye la conversación a abrir.
- Triple armonía: consigo, con otros y con el entorno; se articula en “Conservo / Transformo”.
- Privacidad: datos sensibles, aislados por usuario y exportables bajo control de la persona.

## Stack
Next.js 14 (App Router), TypeScript, Tailwind, Prisma + PostgreSQL (Neon en prod), NextAuth (Email), Zod, Vitest, Playwright.

## Modelo de datos
`prisma/schema.prisma` contiene `User`, `Entry`, `EntryDomain`, `Tag`, `EntryTag` tal como se especifica.

## Flujo
1. `/calendar`: crear/editar entrada con formulario guiado.
2. `/review/weekly`: resumen semanal con “Conservo / Transformo”.
3. `/entries`: listado con filtros y búsqueda.
4. `/export`: exportar semana a Markdown (PDF pendiente).

## Deploy a Producción

### Opción Rápida (Recomendada): Vercel + Neon

1. **Preparar base de datos:**
   - Crear cuenta en [Neon](https://neon.tech)
   - Crear proyecto PostgreSQL
   - Copiar `DATABASE_URL`

2. **Configurar variables de entorno:**
   ```bash
   npm run setup:env
   ```
   O configurar manualmente en Vercel Dashboard.

3. **Deploy:**
   ```bash
   npm run deploy:vercel
   ```

### Verificación Pre-Deploy

Antes de hacer deploy, verifica que todo esté listo:
```bash
npm run deploy:check
```

### Scripts de Deploy Disponibles

- `npm run deploy:check` - Verificar preparación
- `npm run setup:env` - Configurar variables de entorno
- `npm run deploy:vercel` - Deploy a Vercel
- `npm run deploy:railway` - Deploy a Railway
- `npm run migrate:prod` - Ejecutar migraciones en producción

Para más detalles, ver `DEPLOY.md` y `scripts/README.md`.

---

## Desarrollo local

### Requisitos previos

**Windows (PowerShell):**

1. **Instala Node.js** (versión 18 o superior):
   - Opción A: Descarga desde [nodejs.org](https://nodejs.org/) (LTS recomendado)
   - Opción B: Con winget: `winget install OpenJS.NodeJS.LTS`
   - Opción C: Con Chocolatey: `choco install nodejs-lts`

2. **Instala pnpm** (opcional, también puedes usar npm):
   ```powershell
   npm install -g pnpm
   ```
   O usa npm directamente (viene con Node.js).

### Pasos de instalación

1. **Configura `.env`**: Copia `.env.example` a `.env` y completa las variables:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/matriztica?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="genera-un-secreto-aleatorio-aqui"
   EMAIL_SERVER_HOST="localhost"
   EMAIL_SERVER_PORT="1025"
   EMAIL_FROM="no-reply@matriztica.local"
   ```

2. **Instala dependencias**:
   ```bash
   pnpm i    # o npm install
   ```

3. **Ejecuta migraciones de Prisma**:
   ```bash
   pnpm prisma:migrate    # o npm run prisma:migrate
   ```

4. **Inicia el servidor de desarrollo**:
   ```bash
   pnpm dev    # o npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tests
- Unit: `pnpm test`
- E2E: `pnpm e2e` (con el dev server corriendo)

## Notas
- Email en dev: usa SMTP local (Mailhog) o se mostrará el enlace en consola si falla el envío.
- PDF server-side: por implementar con `@react-pdf/renderer`.
