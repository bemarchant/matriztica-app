# Instalación en Windows - Guía rápida

## Paso 1: Instalar Node.js

**Opción recomendada (más rápida):**

1. Abre tu navegador y ve a: **https://nodejs.org/**
2. Descarga la versión **LTS** (Long Term Support) - debería decir algo como "Recommended For Most Users"
3. Ejecuta el instalador `.msi` descargado
4. Sigue el asistente de instalación (acepta todo por defecto)
5. **Importante**: Reinicia PowerShell después de instalar para que reconozca el comando `node`

**Para verificar que se instaló correctamente:**

Abre una **nueva** ventana de PowerShell y ejecuta:
```powershell
node --version
npm --version
```

Deberías ver números de versión (ej: `v20.11.0` y `10.2.4`).

## Paso 2: Instalar pnpm (opcional)

Una vez que tengas Node.js instalado, puedes instalar pnpm:

```powershell
npm install -g pnpm
```

O simplemente usa `npm` en lugar de `pnpm` en todos los comandos siguientes.

## Paso 3: Configurar el proyecto

1. **Crea el archivo `.env`** en la raíz del proyecto:

```powershell
cd C:\Users\bemar\Documents\matriztica\matriztica_app
```

Crea un archivo `.env` con este contenido (ajusta `DATABASE_URL` según tu base de datos):

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/matriztica?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-este-secreto-por-uno-aleatorio-y-seguro"
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_FROM="no-reply@matriztica.local"
```

**Nota sobre DATABASE_URL:**
- Si tienes PostgreSQL instalado localmente, usa la URL de arriba
- Si no tienes PostgreSQL, puedes usar SQLite temporalmente cambiando el `schema.prisma` (pero no es recomendado para producción)
- O crea una base de datos gratuita en Neon (https://neon.tech) y usa esa URL

## Paso 4: Instalar dependencias

```powershell
npm install
# o si instalaste pnpm:
pnpm install
```

## Paso 5: Configurar la base de datos

```powershell
npm run prisma:migrate
# o:
pnpm prisma:migrate
```

## Paso 6: Iniciar el servidor de desarrollo

```powershell
npm run dev
# o:
pnpm dev
```

Luego abre http://localhost:3000 en tu navegador.

---

## Solución de problemas

**Si `node` no se reconoce después de instalar:**
- Cierra y vuelve a abrir PowerShell (o reinicia la terminal)
- Verifica que Node.js esté en el PATH: `$env:PATH`

**Si hay errores con Prisma:**
- Asegúrate de que `DATABASE_URL` en `.env` sea correcta
- Verifica que la base de datos exista y sea accesible

**Si hay errores con NextAuth:**
- Verifica que `NEXTAUTH_SECRET` tenga un valor aleatorio seguro
- En desarrollo, el email puede fallar; revisa la consola del servidor para ver el enlace de acceso

