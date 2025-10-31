# Guía de desarrollo con Docker

Esta guía te permite ejecutar Matríztica App usando Docker, sin necesidad de instalar Node.js directamente en tu sistema.

## Requisitos previos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido en Docker Desktop)

## Configuración inicial

### 1. Configura variables de entorno (opcional)

Las variables de entorno ya están configuradas en `docker-compose.yml` con valores por defecto para desarrollo. Si quieres cambiarlas, edita `docker-compose.yml` o crea un `.env` local.

### 2. Construir e iniciar los contenedores

```powershell
# Construir las imágenes y levantar los servicios
docker-compose up --build
```

Esto iniciará:
- **PostgreSQL** en el puerto 5432
- **Next.js app** en http://localhost:3000

### 3. Ejecutar migraciones de Prisma

Si es la primera vez, las migraciones se ejecutan automáticamente. Si necesitas ejecutarlas manualmente:

```powershell
# En otra terminal
docker-compose exec app pnpm prisma:migrate
```

### 4. Acceder a la aplicación

Abre tu navegador en: **http://localhost:3000**

## Comandos útiles

### Ver logs
```powershell
docker-compose logs -f app
```

### Ejecutar comandos dentro del contenedor
```powershell
# Instalar una nueva dependencia
docker-compose exec app npm install nombre-paquete

# Ejecutar tests
docker-compose exec app npm test

# Ejecutar migraciones
docker-compose exec app npm run prisma:migrate

# Generar Prisma Client
docker-compose exec app npm run prisma:generate

# Abrir shell interactivo
docker-compose exec app sh
```

### Detener los contenedores
```powershell
docker-compose down
```

### Detener y eliminar volúmenes (elimina la base de datos)
```powershell
docker-compose down -v
```

### Reconstruir después de cambios en dependencias
```powershell
docker-compose up --build
```

## Estructura de desarrollo

- Los cambios en código se reflejan automáticamente (hot reload)
- La base de datos persiste en un volumen Docker
- Los `node_modules` están en un volumen separado para mejor rendimiento

## Solución de problemas

### El puerto 3000 ya está en uso
Cambia el puerto en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Cambia 3001 al puerto que prefieras
```

### Error de conexión a la base de datos
Verifica que el servicio `postgres` esté saludable:
```powershell
docker-compose ps
```

### Limpiar todo y empezar de nuevo
```powershell
docker-compose down -v
docker-compose up --build
```

## Producción

Para producción, necesitarás:
- Configurar variables de entorno seguras
- Usar una base de datos externa (ej: Neon)
- Optimizar el Dockerfile para builds de producción
- Configurar SSL/TLS

