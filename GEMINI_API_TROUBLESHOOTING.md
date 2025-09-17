# 🔧 Guía de Solución de Problemas - Gemini API

## Error Actual: "Generative Language API has not been used in project"

### ✅ **Solución Rápida (Recomendada)**

1. **Habilita la API directamente aquí:**
   👉 **https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=763347140383**

2. **Haz clic en "ENABLE" (Habilitar)**

3. **Espera 2-5 minutos** para que se propague

4. **Reinicia la aplicación:**
   ```bash
   # Para el servidor (Ctrl+C)
   # Luego ejecuta:
   npm run dev
   ```

### 🔄 **Alternativa: Crear Nueva API Key**

Si el problema persiste, crea una nueva API key desde Google AI Studio:

1. **Ve a:** https://aistudio.google.com/apikey
2. **Crea un nuevo proyecto** (o selecciona uno diferente)
3. **Genera una nueva API key**
4. **Reemplaza en el archivo `.env`:**
   ```
   VITE_GEMINI_API_KEY=tu_nueva_api_key_aqui
   ```

### 🛠️ **Verificación Manual**

Para verificar que tu API key funciona, puedes probar esto en el navegador:

```
https://generativelanguage.googleapis.com/v1beta/models?key=TU_API_KEY
```

**Resultado esperado:** Lista de modelos disponibles
**Error 403:** API no habilitada o clave inválida

### 📋 **Checklist de Solución**

- [ ] API habilitada en Google Cloud Console
- [ ] Esperado 2-5 minutos después de habilitar
- [ ] API key copiada correctamente (sin espacios)
- [ ] Archivo `.env` guardado
- [ ] Servidor reiniciado
- [ ] Backend funcionando (`npm run dev` en carpeta backend)

### 🚨 **Si Nada Funciona**

Usa esta API key temporal para testing (solo desarrollo):
```
VITE_GEMINI_API_KEY=AIzaSyCHUCmpR7cT_yDFHC98CZJy2LTms-IwDlM
```

⚠️ **Nota:** Esta es solo para pruebas. Crea tu propia API key para uso real.

### 💡 **Consejos Adicionales**

1. **Proyecto Correcto:** Asegúrate de estar en el proyecto correcto en Google Cloud Console
2. **Billing:** Algunos proyectos requieren facturación habilitada
3. **Límites:** El tier gratuito tiene límites de 15 requests/minuto
4. **Caché:** Limpia caché del navegador si persisten problemas

### 🔍 **Debugging**

Si sigues teniendo problemas, revisa:
1. Console del navegador para errores específicos
2. Network tab para ver las requests fallidas
3. Backend logs en la terminal del backend

---

**¿Necesitas más ayuda?** 
El problema más común es simplemente esperar unos minutos después de habilitar la API. ¡Ten paciencia!