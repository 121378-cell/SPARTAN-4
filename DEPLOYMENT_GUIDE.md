# 🚀 Guía de Despliegue - SPARTAN 4

## 📋 Opciones de Despliegue

### 1. 🌐 **Vercel (Recomendado para Frontend)**

#### Paso a Paso:
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Hacer login en Vercel
vercel login

# 3. Configurar el proyecto
vercel

# 4. Desplegar
vercel --prod
```

#### Configuración Automática:
- **Framework**: Detecta Vite automáticamente
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. 🚀 **Netlify**

#### Opción A - Desde Git:
1. Conecta tu repositorio en [netlify.com](https://netlify.com)
2. Configuración:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18+

#### Opción B - Deploy Manual:
```bash
# 1. Construir para producción
npm run build

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

### 3. ☁️ **GitHub Pages**

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agregar scripts al package.json
# Ver configuración abajo

# 3. Deploy
npm run deploy
```

### 4. 🐳 **Docker + cualquier proveedor**

```dockerfile
# Dockerfile incluido abajo
# Funciona con: Railway, Render, DigitalOcean, AWS, etc.
```

## ⚙️ Configuraciones Necesarias

### 📝 **1. Variables de Entorno**

Crea un archivo `.env.production`:
```env
VITE_API_URL=https://tu-backend-url.com
VITE_GEMINI_API_KEY=tu_gemini_api_key
NODE_ENV=production
```

### 📦 **2. Package.json - Scripts de Deploy**

Agrega estos scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "build:prod": "NODE_ENV=production npm run build",
    "preview": "vite preview"
  }
}
```

### 🔧 **3. Vite Config para Producción**

El proyecto ya está configurado, pero verifica:
```typescript
// vite.config.ts ya optimizado para producción
- Bundle splitting ✅
- Asset optimization ✅
- PWA support ✅
- Performance optimizations ✅
```

## 🐳 Opción Docker (Recomendado para Full Stack)

### Dockerfile para Frontend
```dockerfile
# Multi-stage build para optimizar tamaño
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Nginx para servir archivos estáticos
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (Frontend + Backend)
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=tu_jwt_secret
      - GEMINI_API_KEY=tu_gemini_api_key
    volumes:
      - ./backend/data:/app/data
```

## 🌐 Despliegue Separado (Frontend + Backend)

### Frontend (Estático)
- **Vercel, Netlify, GitHub Pages**: Para el React app
- **CDN**: Cloudflare, AWS CloudFront para mejor rendimiento

### Backend (Node.js)
- **Railway**: `railway login && railway deploy`
- **Render**: Deploy desde Git
- **Heroku**: `git push heroku main`
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

## 📝 Checklist Pre-Despliegue

### ✅ **Preparación**
- [ ] Variables de entorno configuradas
- [ ] Build de producción funciona: `npm run build`
- [ ] Tests pasan: `npm test`
- [ ] API endpoints configurados correctamente
- [ ] CORS configurado en backend
- [ ] Base de datos lista (si aplica)

### ✅ **Optimizaciones**
- [ ] Imágenes optimizadas
- [ ] Service Worker registrado
- [ ] PWA manifest configurado
- [ ] Performance monitoring activo
- [ ] Error logging configurado

### ✅ **Seguridad**
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] API keys en variables de entorno
- [ ] Rate limiting activo
- [ ] CORS apropiadamente configurado

## 🎯 Recomendación Específica para SPARTAN 4

### Para Desarrollo/Testing:
```bash
# Deploy rápido en Vercel
vercel
```

### Para Producción:
1. **Frontend**: Vercel o Netlify
2. **Backend**: Railway o Render
3. **Base de Datos**: SQLite → PostgreSQL en producción

### Comando de Deploy Rápido:
```bash
# 1. Build
npm run build

# 2. Deploy (elige uno)
vercel --prod              # Vercel
netlify deploy --prod --dir=dist  # Netlify
npm run deploy            # GitHub Pages
```

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de Build
```bash
# Verificar variables de entorno
npm run build:prod
```

### PWA no funciona
- Verifica que esté en HTTPS
- Service Worker registrado correctamente
- Manifest.json accesible

## 📱 Post-Despliegue

1. **Verificar PWA**: Prueba instalación en móvil
2. **Performance**: Usa Lighthouse para auditar
3. **Monitoring**: Configura alertas de errores
4. **Analytics**: Implementa tracking si necesario

¿Qué opción prefieres para tu despliegue?