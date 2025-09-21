# Guía para Iniciar SPARTAN 4

Esta guía explica las diferentes formas de iniciar el entorno de desarrollo de SPARTAN 4 de manera rápida y sencilla.

## Métodos de Inicio

### 1. Método Recomendado: Script de Windows (.bat)

Para usuarios de Windows, el método más sencillo es usar el archivo batch:

```
start-spartan.bat
```

Este script:
- Verifica que Node.js esté instalado
- Detiene cualquier proceso anterior de SPARTAN
- Inicia automáticamente el backend y frontend
- Abre el navegador en http://localhost:5174
- Muestra las credenciales de prueba

### 2. Método PowerShell (Avanzado)

Para usuarios más avanzados, puede usar el script de PowerShell:

```
start-spartan.ps1
```

Este script ofrece opciones adicionales:
- `-NoBrowser`: Inicia los servidores sin abrir el navegador
- `-Quiet`: Modo silencioso con menos salida en consola

Ejemplo:
```powershell
./start-spartan.ps1 -NoBrowser
```

### 3. Método Manual (Para desarrollo)

Si necesita control total, puede iniciar los servicios manualmente:

1. **Iniciar Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Iniciar Frontend (en otra terminal):**
   ```bash
   npm run dev
   ```

## Requisitos Previos

- Node.js v16 o superior
- npm (incluido con Node.js)

## Puertos Utilizados

- **Frontend:** http://localhost:5174
- **Backend:** http://localhost:3001

## Credenciales de Prueba

- **Email:** testuser@example.com
- **Contraseña:** TestPass123!

## Solución de Problemas

### Error: "npm no se reconoce como comando interno o externo"

1. Verifique que Node.js esté instalado: https://nodejs.org/
2. Asegúrese de que Node.js esté en su PATH del sistema

### Error: "Puerto ya en uso"

El script de inicio se encarga de detener procesos anteriores automáticamente. Si persiste el problema:

1. Cierre todas las ventanas de terminal
2. Ejecute el script nuevamente
3. O reinicie su computadora

### Los servidores no inician correctamente

1. Verifique que tenga conexión a internet
2. Asegúrese de que los puertos 5174 y 3001 no estén bloqueados por su firewall
3. Verifique que tenga permisos suficientes para ejecutar scripts

## Detener los Servidores

### Método 1: Cerrar ventanas de terminal
Simplemente cierre las ventanas de terminal donde se ejecutan los servidores.

### Método 2: Usar el administrador de tareas
Busque procesos de "node.exe" y finalícelos.

### Método 3: Comando PowerShell
```powershell
taskkill /F /IM node.exe
```

## Personalización

Puede modificar los scripts de inicio para adaptarlos a sus necesidades:

- Cambiar puertos en los archivos de configuración
- Agregar variables de entorno
- Modificar el tiempo de espera entre el inicio del backend y frontend

## Soporte

Para problemas adicionales, consulte la documentación en:
- [README.md](file:///c:/dev/SPARTAN%204/README.md)
- [DEPLOYMENT_GUIDE.md](file:///c:/dev/SPARTAN%204/DEPLOYMENT_GUIDE.md)