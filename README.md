# SPARTAN 4 - AI Fitness Coach

Un ecosistema fitness completo con inteligencia artificial para entrenamiento, nutrición y análisis de salud.

## 🚀 Características

- **Generación de Planes de Entrenamiento**: Crea planes personalizados con IA
- **Análisis de Forma**: Verifica la técnica de ejercicios
- **Generador de Recetas**: Planes nutricionales adaptados
- **Planificador Circadiano**: Optimiza horarios de entrenamiento
- **Integración de Wearables**: Conecta dispositivos de seguimiento
- **Análisis de Análisis de Sangre**: Interpreta biomarcadores
- **Detección de Sobrecarga**: Previene lesiones
- **Autenticación JWT**: Sistema de usuarios seguro
- **Persistencia de Datos**: Almacenamiento local y backend
- **Validación de Formularios**: Validaciones robustas
- **Optimización de Rendimiento**: Lazy loading y memoización
- **Tests Unitarios**: Cobertura completa de testing

## 🛠️ Tecnologías

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Recharts** - Gráficos

### Backend
- **Express.js** - Servidor API
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **Google Gemini AI** - Generación de contenido
- **CORS** - Cross-origin requests
- **Helmet** - Seguridad
- **Rate Limiting** - Protección contra spam

### Testing
- **Jest** - Framework de testing
- **Testing Library** - Testing de componentes
- **Supertest** - Testing de API

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Clave de API de Google Gemini

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/spartan4.git
cd spartan4
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar variables de entorno

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GEMINI_API_KEY=tu-gemini-api-key
```

#### Backend (backend/.env)
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu-super-secret-jwt-key
GEMINI_API_KEY=tu-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

### 5. Ejecutar la aplicación

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## 🧪 Testing

### Ejecutar tests
```bash
# Tests unitarios
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

### Tests del backend
```bash
cd backend
npm test
```

## 📁 Estructura del Proyecto

```
spartan4/
├── components/          # Componentes React
│   ├── AuthScreen.tsx
│   ├── Dashboard.tsx
│   ├── ProfileScreen.tsx
│   └── ...
├── lib/                # Lógica de negocio
│   ├── api.ts          # Integración con Gemini AI
│   ├── auth.ts         # Sistema de autenticación
│   ├── storage.ts      # Persistencia de datos
│   ├── validation.ts   # Validaciones de formularios
│   ├── api-client.ts   # Cliente API para backend
│   └── __tests__/      # Tests unitarios
├── backend/            # Servidor Express
│   ├── server.js       # Servidor principal
│   ├── package.json    # Dependencias del backend
│   └── env.example     # Variables de entorno
├── public/             # Archivos estáticos
├── index.html          # HTML principal
├── index.tsx           # Punto de entrada React
├── package.json        # Dependencias del frontend
├── vite.config.ts      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind
├── jest.config.js      # Configuración de Jest
└── README.md           # Este archivo
```

## 🔧 Configuración

### Variables de Entorno

#### Frontend
- `VITE_API_URL`: URL del backend API
- `VITE_GEMINI_API_KEY`: Clave de API de Google Gemini

#### Backend
- `PORT`: Puerto del servidor (default: 3001)
- `NODE_ENV`: Entorno de ejecución
- `JWT_SECRET`: Clave secreta para JWT
- `GEMINI_API_KEY`: Clave de API de Google Gemini
- `FRONTEND_URL`: URL del frontend para CORS

### Configuración de Gemini AI

1. Obtén una clave de API en [Google AI Studio](https://aistudio.google.com/)
2. Añade la clave a las variables de entorno
3. El sistema funcionará tanto con backend como sin él

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
npm run build
# Subir la carpeta dist/
```

### Backend (Railway/Heroku)
```bash
cd backend
# Configurar variables de entorno
# Desplegar con el servicio elegido
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token

### Usuario
- `GET /api/user/profile` - Obtener perfil

### Planes de Entrenamiento
- `GET /api/workout-plans` - Listar planes
- `POST /api/workout-plans` - Crear plan
- `PUT /api/workout-plans/:id` - Actualizar plan
- `DELETE /api/workout-plans/:id` - Eliminar plan

### Progreso
- `GET /api/progress` - Listar progreso
- `POST /api/progress` - Añadir progreso

### IA
- `POST /api/generate/workout` - Generar plan con IA

### Sistema
- `GET /api/health` - Health check

## 🔒 Seguridad

- Autenticación JWT con refresh tokens
- Rate limiting en todas las rutas
- Validación de entrada en todos los endpoints
- CORS configurado correctamente
- Headers de seguridad con Helmet
- Hash de contraseñas con bcrypt

## 🧪 Testing

El proyecto incluye tests completos para:
- Sistema de validación
- Autenticación
- Almacenamiento de datos
- Componentes React (preparado)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollo Frontend**: React, TypeScript, Tailwind CSS
- **Desarrollo Backend**: Express.js, JWT, Google Gemini AI
- **Testing**: Jest, Testing Library
- **DevOps**: Vite, NPM Scripts

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

- [ ] Integración con base de datos real (MongoDB/PostgreSQL)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Integración con más wearables
- [ ] Análisis avanzado de datos
- [ ] Sistema de recomendaciones ML
- [ ] Chat con IA para consultas
- [ ] Video llamadas con entrenadores
- [ ] Marketplace de planes de entrenamiento

---

**SPARTAN 4** - Transformando el fitness con inteligencia artificial 🏋️‍♂️🤖