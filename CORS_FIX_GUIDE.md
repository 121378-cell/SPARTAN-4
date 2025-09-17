# 🔧 Guía para Corregir Error CORS en Vercel

## Problema Identificado
El error CORS se debe a que el frontend en Vercel está intentando hacer requests al backend en Railway, pero el backend no tiene configurado el origen de Vercel en su lista de CORS permitidos.

```
Request blocked
login from: https://spartan-4-hxvkb5zxz-sergimarquezbrugal-2353s-projects.vercel.app/
Allowed origin: https://railway.com
```

## ✅ Soluciones Implementadas

### 1. Backend (Railway) - CORS Configuration
- ✅ Actualizado `backend/server.js` para incluir dominios de Vercel
- ✅ Agregados patrones regex para subdominios de Vercel
- ✅ Mejorado logging para debug de CORS

### 2. Frontend (Vercel) - API URL Configuration  
- ✅ Actualizado `.env.production` con URL correcta del backend
- ✅ Configurado `VITE_API_URL=https://spartan-4-backend.up.railway.app/api`

## 🚀 Pasos para Completar la Configuración

### Opción A: Configurar Variables de Entorno en Vercel Dashboard

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto SPARTAN 4
3. Ve a Settings → Environment Variables
4. Agrega estas variables:

**Para Production:**
```
VITE_API_URL = https://spartan-4-backend.up.railway.app/api
VITE_GEMINI_API_KEY = AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8
NODE_ENV = production
```

**Para Preview:**
```
VITE_API_URL = https://spartan-4-backend.up.railway.app/api
VITE_GEMINI_API_KEY = AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8
NODE_ENV = production
```

5. Hacer redeploy del proyecto

### Opción B: Usar Vercel CLI (Automático)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer login
vercel login

# Ejecutar script de configuración
bash setup-vercel-env.sh
```

### 3. Verificar Backend en Railway

1. Ve a tu proyecto en Railway
2. Ve a Variables → Environment Variables
3. Asegúrate de que estén configuradas:

```
FRONTEND_URL=https://spartan-4.vercel.app
PRODUCTION_FRONTEND_URL=https://spartan-4.vercel.app
VERCEL_PREVIEW_URL=https://spartan-4-hxvkb5zxz-sergimarquezbrugal-2353s-projects.vercel.app
```

4. Redeploy el backend si es necesario

## 🔍 Verificación

Una vez completados los pasos:

1. Ve a tu aplicación en Vercel
2. Abre Developer Tools (F12)
3. Intenta hacer login
4. Verifica que no hay errores CORS en la consola
5. Los requests deberían ir a: `https://spartan-4-backend.up.railway.app/api/auth/login`

## 🎯 Resultado Esperado

```
✅ Request to: https://spartan-4-backend.up.railway.app/api/auth/login
✅ Origin: https://spartan-4-hxvkb5zxz-sergimarquezbrugal-2353s-projects.vercel.app
✅ Status: 200 OK
✅ Login successful
```

## 📝 URLs Configuradas

**Frontend (Vercel):**
- Production: `https://spartan-4.vercel.app`
- Preview: `https://spartan-4-hxvkb5zxz-sergimarquezbrugal-2353s-projects.vercel.app`

**Backend (Railway):**
- API Base: `https://spartan-4-backend.up.railway.app/api`

## 🔄 Auto-Deploy

Los cambios ya están en GitHub y se desplegará automáticamente en Vercel. Solo necesitas configurar las variables de entorno para que la conexión funcione correctamente.