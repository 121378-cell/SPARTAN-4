# 🔧 Verificación de Variables de Entorno - SPARTAN 4

## ✅ Estado Actual: VARIABLES CONFIGURADAS PERO NECESITAN ACTUALIZACIÓN

### 📋 Variables Encontradas en Vercel:

#### ✅ Production Environment:
- `NODE_ENV` = "production" ✅
- `VITE_SUPABASE_URL` = "https://dbgksgnfpqndhvhnkhtx.supabase.co" ✅
- `VITE_SUPABASE_ANON_KEY` = "eyJ..." ✅
- `VITE_GA_TRACKING_ID` = "G-XXXXXXXXXX" ✅

#### ⚠️ Variables que Necesitan Actualización:
- `VITE_API_URL` = "https://spartan4-backend.railway.app" ❌
  - **Debería ser:** `https://spartan-4-backend.up.railway.app/api`
- `VITE_GEMINI_API_KEY` = "test-api-key-for-demo" ❌
  - **Debería ser:** `AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8`

## 🛠️ Acciones Requeridas

### Opción 1: Dashboard de Vercel (Recomendado)
1. Ve a [Vercel Dashboard](https://vercel.com/sergimarquezbrugal-2353s-projects/spartan-4/settings/environment-variables)
2. Actualiza las siguientes variables en **Production** y **Preview**:

```
VITE_API_URL = https://spartan-4-backend.up.railway.app/api
VITE_GEMINI_API_KEY = AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8
```

### Opción 2: CLI (Manual)
```bash
# Remover variables incorrectas
vercel env rm VITE_API_URL production
vercel env rm VITE_GEMINI_API_KEY production

# Agregar variables correctas
vercel env add VITE_API_URL production
# Cuando pregunte el valor: https://spartan-4-backend.up.railway.app/api

vercel env add VITE_GEMINI_API_KEY production  
# Cuando pregunte el valor: AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8
```

## 🎯 Verificación Post-Actualización

Una vez actualizadas las variables:

1. **Redeploy automático** se activará
2. **Verificar en:** https://spartan-4-hxvkb5zxz-sergimarquezbrugal-2353s-projects.vercel.app
3. **Abrir Developer Tools** (F12)
4. **Intentar login** y verificar que no hay errores CORS
5. **API requests** deberían ir a: `https://spartan-4-backend.up.railway.app/api/auth/login`

## 📊 Estado Actual vs Esperado

| Variable | Actual | Esperado | Estado |
|----------|--------|----------|--------|
| VITE_API_URL | spartan4-backend.railway.app | spartan-4-backend.up.railway.app/api | ❌ |
| VITE_GEMINI_API_KEY | test-api-key-for-demo | AIzaSy... | ❌ |
| VITE_SUPABASE_URL | dbgksgnfpqn... | dbgksgnfpqn... | ✅ |
| NODE_ENV | production | production | ✅ |

## 🚀 Resultado Esperado

Después de la actualización:
- ✅ Frontend conectará al backend correcto en Railway
- ✅ Sin errores CORS
- ✅ Login/Register funcionando
- ✅ AI features completamente operativas