FROM node:24-alpine

# Instala netcat para healthchecks y OpenSSL para Prisma
RUN apk add --no-cache netcat-openbsd openssl openssl-dev

WORKDIR /app

# Copia archivos de dependencias y schema de Prisma (necesario para postinstall)
COPY package.json ./
COPY prisma ./prisma

# Instala dependencias con npm (viene con Node.js)
RUN npm install --legacy-peer-deps

# Copia el resto del código
COPY . .

# Copia y configura script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
