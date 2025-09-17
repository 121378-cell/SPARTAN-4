# Configuración de la API de Gemini para SPARTAN 4

## ¿Por qué necesitas esto?

SPARTAN 4 utiliza Google Gemini AI para generar rutinas de entrenamiento personalizadas, analizar análisis de sangre, crear recetas y más. Para que estas funciones funcionen, necesitas una clave de API de Gemini.

## Cómo obtener tu API Key de Gemini

### Paso 1: Visita Google AI Studio
Ve a: https://aistudio.google.com/apikey

### Paso 2: Inicia sesión
Inicia sesión con tu cuenta de Google.

### Paso 3: Crea una API Key
1. Haz clic en "Create API Key"
2. Selecciona un proyecto de Google Cloud (o crea uno nuevo)
3. Copia la API key generada

### Paso 4: Configura la API Key en SPARTAN 4
1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza `tu_gemini_api_key_aqui` con tu API key real:
   ```
   VITE_GEMINI_API_KEY=AIzaSyC7x1234567890abcdefghijklmnopqrstuvwxyz
   ```

### Paso 5: Reinicia la aplicación
1. Para el servidor de desarrollo (Ctrl+C)
2. Ejecuta nuevamente: `npm run dev`

## Precios de Gemini AI

- **Uso gratuito**: 15 solicitudes por minuto, 1500 solicitudes por día
- **Muy económico**: Para uso personal, generalmente es gratis
- **Más información**: https://ai.google.dev/pricing

## Troubleshooting

### Error: "No se encontró una clave de API válida"
- Verifica que hayas copiado correctamente la API key
- Asegúrate de que no haya espacios extra al inicio o final
- Reinicia el servidor de desarrollo

### La API key no funciona
- Verifica que la API key esté activa en Google AI Studio
- Asegúrate de que tu proyecto de Google Cloud tenga habilitado Gemini API
- Revisa que no hayas excedido los límites de uso gratuito

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca compartas tu API key públicamente
- No la subas a repositorios públicos de Git
- El archivo `.env` ya está en `.gitignore` para protegerla

## ¿Necesitas ayuda?

Si tienes problemas configurando la API key, revisa la documentación oficial:
https://ai.google.dev/gemini-api/docs/api-key