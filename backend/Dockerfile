# Backend Dockerfile para SPARTAN 4
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Crear directorio de datos y asignar permisos
RUN mkdir -p /app/data && chown -R appuser:nodejs /app/data

# Copiar código fuente
COPY . .

# Cambiar al usuario no-root
USER appuser

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]