# Cómo Iniciar SPARTAN 4 de Forma Fácil

Esta guía explica las diferentes formas de iniciar SPARTAN 4 con un solo clic o comando, sin complicaciones.

## Opciones Disponibles

### 1. Archivo Batch (.bat) - MÉTODO RECOMENDADO

**Archivo:** [start-spartan.bat](file:///c:/dev/SPARTAN%204/start-spartan.bat)

Este es el método más sencillo para usuarios de Windows:

1. Doble clic en `start-spartan.bat`
2. El sistema verificará los requisitos
3. Iniciará automáticamente el backend y frontend
4. Abrirá el navegador automáticamente
5. Mostrará las credenciales de prueba

**Ventajas:**
- No requiere conocimientos técnicos
- Verifica automáticamente los requisitos
- Maneja errores comunes
- Abre el navegador automáticamente

### 2. Script de PowerShell Mejorado

**Archivo:** [start-spartan.ps1](file:///c:/dev/SPARTAN%204/start-spartan.ps1)

Para usuarios que prefieren PowerShell:

```powershell
./start-spartan.ps1
```

**Opciones adicionales:**
- `-NoBrowser`: Inicia sin abrir el navegador
- `-Quiet`: Modo silencioso

### 3. Acceso Directo en el Escritorio

**Archivo:** [create-desktop-shortcut.bat](file:///c:/dev/SPARTAN%204/create-desktop-shortcut.bat)

Crea un acceso directo en tu escritorio para iniciar SPARTAN 4 con un solo clic:

1. Ejecuta `create-desktop-shortcut.bat`
2. Se creará un acceso directo llamado "SPARTAN 4" en tu escritorio
3. Haz doble clic en ese acceso directo cuando quieras iniciar SPARTAN 4

## Requisitos

- Windows 10 o superior
- Node.js instalado (https://nodejs.org/)
- Acceso a internet (para algunas funcionalidades)

## Credenciales de Prueba

- **Email:** testuser@example.com
- **Contraseña:** TestPass123!

## Puertos

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

## ¿Problemas Comunes?

### "Node.js no está instalado"
1. Descarga e instala Node.js desde https://nodejs.org/
2. Reinicia tu computadora
3. Intenta nuevamente

### "Puerto ocupado"
Los scripts se encargan de detener procesos anteriores automáticamente. Si persiste:
1. Reinicia tu computadora
2. Ejecuta el script nuevamente

### "El script no se ejecuta por seguridad"
1. Haz clic derecho en el archivo .bat o .ps1
2. Selecciona "Ejecutar como administrador"

## Personalización

Puedes modificar los scripts para:
- Cambiar puertos
- Agregar variables de entorno
- Modificar tiempos de espera
- Cambiar credenciales de prueba

## Soporte

Para cualquier problema, consulta:
- [START_SPARTAN_GUIDE.md](file:///c:/dev/SPARTAN%204/START_SPARTAN_GUIDE.md) - Guía detallada
- [README.md](file:///c:/dev/SPARTAN%204/README.md) - Documentación general
- [DEPLOYMENT_GUIDE.md](file:///c:/dev/SPARTAN%204/DEPLOYMENT_GUIDE.md) - Guía de despliegue

---

**¡Ahora puedes disfrutar de SPARTAN 4 con un solo clic!**