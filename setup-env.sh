# 🔧 Configuración Automática de Variables de Entorno en Vercel

# Ejecuta estos comandos para configurar las variables de entorno:

# 1. Variables básicas de producción
vercel env add VITE_API_URL production
# Cuando te pregunte el valor, usa: https://spartan4-backend.railway.app

vercel env add VITE_GEMINI_API_KEY production  
# Cuando te pregunte el valor, usa tu API key de Google Gemini

vercel env add NODE_ENV production
# Cuando te pregunte el valor, usa: production

# 2. Para development también
vercel env add VITE_API_URL development
# Valor: http://localhost:3001

vercel env add VITE_GEMINI_API_KEY development
# Valor: tu_gemini_api_key

vercel env add NODE_ENV development  
# Valor: development

# 3. Para preview
vercel env add VITE_API_URL preview
# Valor: https://spartan4-backend.railway.app

vercel env add VITE_GEMINI_API_KEY preview
# Valor: tu_gemini_api_key

echo "Variables de entorno configuradas correctamente!"