# 🚀 Guía de Deploy del Backend SPARTAN 4

## Opción 1: Render (Recomendado - Más Fácil)

### Paso a Paso:

1. **Ve a [render.com](https://render.com) y crea una cuenta**

2. **Conecta tu repositorio:**
   - Click "New +" → "Web Service"
   - Conecta tu repo de GitHub/GitLab
   - Selecciona la carpeta `backend/`

3. **Configuración automática:**
   ```
   Name: spartan4-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variables de entorno:**
   ```
   NODE_ENV = production
   PORT = 10000 (automático en Render)
   JWT_SECRET = (generar una clave segura)
   GEMINI_API_KEY = tu_api_key_aquí
   ```

5. **Deploy automático:** Render desplegará automáticamente

### URL resultante:
`https://spartan4-backend.onrender.com`

---

## Opción 2: Railway

### Comandos:
```bash
cd backend
railway login
railway init
railway up
```

### Variables de entorno en Railway:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=tu_jwt_secret_seguro
railway variables set GEMINI_API_KEY=tu_gemini_api_key
```

---

## Opción 3: Heroku

### Comandos:
```bash
cd backend
heroku create spartan4-backend
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_jwt_secret
heroku config:set GEMINI_API_KEY=tu_api_key
git add .
git commit -m "Deploy backend"
git push heroku main
```

---

## ✅ Verificar Deploy

Una vez desplegado, verifica que funciona:

```bash
curl https://tu-backend-url.com/api/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "timestamp": "2025-01-16T..."
}
```

---

## 🔧 Configurar Frontend

Después del deploy del backend, actualiza la variable en Vercel:

```bash
vercel env add VITE_API_URL production
# Valor: https://tu-backend-url.onrender.com
```

Luego redeploy el frontend:
```bash
vercel --prod
```

¡Listo! Tu aplicación full-stack estará funcionando.