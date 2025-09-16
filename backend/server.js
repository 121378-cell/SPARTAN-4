// Backend server para SPARTAN 4
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Database imports
const { User, Conversation, Progress, syncDatabase } = require('./database/models');
const { testConnection } = require('./database/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Validar variables de entorno críticas
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not set - AI features will be unavailable');
}

// Middleware de seguridad mejorado
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuración segura
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000', // Para desarrollo
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting mejorado
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // en segundos
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting para health check
  skip: (req) => req.path === '/api/health'
});
app.use('/api/', limiter);

// Rate limiting más estricto para auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos de autenticación por IP
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// In-memory database fallback (cuando SQLite no esté disponible)
const users = new Map();
const workoutPlans = new Map();
const progressData = new Map();
const recipes = new Map();
const bloodAnalyses = new Map();
const overloadData = new Map();
const correctiveExercises = new Map();

// Database flag
let useDatabaseStorage = false;

// Initialize database and Gemini AI
async function initializeServices() {
  // Test database connection
  const dbConnected = await testConnection();
  if (dbConnected) {
    await syncDatabase();
    useDatabaseStorage = true;
    console.log('✨ Database storage enabled');
  } else {
    console.warn('⚠️ Using in-memory storage - data will be lost on restart');
  }

  // Initialize Gemini AI
  if (GEMINI_API_KEY) {
    try {
      geminiAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      console.log('✅ Gemini AI initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error.message);
    }
  }
}

// Initialize Gemini AI
let geminiAI = null;

// Utility functions
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken, expiresIn: 900 };
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || decoded.type !== 'access') {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.userId = decoded.userId;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!geminiAI,
      database: 'in-memory'
    }
  });
});

// Auth routes con rate limiting
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    let user;
    let userId;

    if (useDatabaseStorage) {
      // Check if user exists in database
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in database
      const dbUser = await User.create({
        username: name,
        email,
        password: hashedPassword,
      });

      user = {
        id: dbUser.id.toString(),
        name: dbUser.username,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
        lastLogin: null
      };
      userId = dbUser.id.toString();
    } else {
      // Fallback to in-memory storage
      if (users.has(email)) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      userId = uuidv4();
      user = {
        id: userId,
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        lastLogin: null
      };

      users.set(email, user);
    }

    // Generate tokens
    const tokens = generateTokens(userId);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      tokens
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    users.set(email, user);

    // Generate tokens
    const tokens = generateTokens(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
      if (err || decoded.type !== 'refresh') {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const tokens = generateTokens(decoded.userId);
      res.json(tokens);
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Workout plans routes
app.get('/api/workout-plans', authenticateToken, (req, res) => {
  try {
    const userPlans = Array.from(workoutPlans.values())
      .filter(plan => plan.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(userPlans);
  } catch (error) {
    console.error('Workout plans fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/workout-plans', authenticateToken, async (req, res) => {
  try {
    const planData = req.body;
    const planId = uuidv4();
    
    const workoutPlan = {
      id: planId,
      userId: req.userId,
      ...planData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    workoutPlans.set(planId, workoutPlan);
    res.status(201).json(workoutPlan);
  } catch (error) {
    console.error('Workout plan creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Progress data routes
app.get('/api/progress', authenticateToken, (req, res) => {
  try {
    const userProgress = Array.from(progressData.values())
      .filter(progress => progress.userId === req.userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(userProgress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/progress', authenticateToken, (req, res) => {
  try {
    const progressId = uuidv4();
    const progress = {
      id: progressId,
      userId: req.userId,
      ...req.body,
      date: new Date()
    };

    progressData.set(progressId, progress);
    res.status(201).json(progress);
  } catch (error) {
    console.error('Progress creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Generation routes
app.post('/api/generate/workout', authenticateToken, async (req, res) => {
  try {
    if (!geminiAI) {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    const { level, availableDays, location, equipment, injuries, goals } = req.body;

    // Generate workout plan using Gemini AI
    const prompt = `Generate a personalized workout plan for a ${level} level user.
Available days: ${availableDays.join(', ')}
Location: ${location}
Equipment: ${equipment.join(', ')}
Injuries: ${injuries.join(', ')}
Goals: ${goals.join(', ')}

Return a JSON response with the workout plan including exercises, sets, reps, and rest periods.`;

    const model = geminiAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and structure the response
    const workoutPlan = {
      id: uuidv4(),
      userId: req.userId,
      name: `Generated Workout - ${new Date().toLocaleDateString()}`,
      description: 'AI-generated workout plan',
      focus: goals,
      days: JSON.parse(text),
      duration: 60,
      difficulty: level,
      equipment: equipment,
      estimatedCalories: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    workoutPlans.set(workoutPlan.id, workoutPlan);
    res.json(workoutPlan);
  } catch (error) {
    console.error('Workout generation error:', error);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  await initializeServices();
  
  app.listen(PORT, () => {
    console.log(`🚀 SPARTAN 4 Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 JWT Secret: ${JWT_SECRET ? 'Set' : 'Using default'}`);
    console.log(`🤖 Gemini AI: ${geminiAI ? 'Connected' : 'Not available'}`);
    console.log(`💾 Storage: ${useDatabaseStorage ? 'SQLite Database' : 'In-Memory'}`);
  });
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;


