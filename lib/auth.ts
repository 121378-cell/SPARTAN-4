// Sistema de autenticación con JWT
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = 'spartan4-secret-key-2024';

// Simulación de base de datos de usuarios (en producción sería una DB real)
const USERS_DB: Map<string, { user: User; password: string }> = new Map();

// Función para generar JWT (simplificada)
function generateJWT(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(header + '.' + body + JWT_SECRET);
  return `${header}.${body}.${signature}`;
}

// Función para verificar JWT
function verifyJWT(token: string): any {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSignature = btoa(header + '.' + body + JWT_SECRET);
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }
    
    const payload = JSON.parse(atob(body));
    
    // Verificar expiración
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Función para hashear contraseñas (simplificada)
function hashPassword(password: string): string {
  return btoa(password + 'salt-spartan4');
}

// Función para verificar contraseñas
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// API de autenticación
export const authAPI = {
  // Registrar nuevo usuario
  async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Validaciones básicas
    if (!credentials.email || !credentials.password || !credentials.name) {
      throw new Error('Todos los campos son requeridos');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      throw new Error('Email inválido');
    }
    
    // Usar backend API si está disponible
    try {
      const { apiClient } = await import('./api-client');
      const response = await apiClient.register(credentials);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data!;
    } catch (error) {
      // Fallback a implementación local si el backend no está disponible
      console.warn('Backend not available, using local auth:', error);
      
      // Verificar si el usuario ya existe
      if (USERS_DB.has(credentials.email)) {
        throw new Error('El usuario ya existe');
      }
      
      // Crear nuevo usuario
      const user: User = {
        id: crypto.randomUUID(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date(),
      };
      
      // Guardar en "base de datos"
      USERS_DB.set(credentials.email, {
        user,
        password: hashPassword(credentials.password)
      });
      
      // Generar tokens
      const tokens = this.generateTokens(user);
      
      return { user, tokens };
    }
  },
  
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Usar backend API si está disponible
    try {
      const { apiClient } = await import('./api-client');
      const response = await apiClient.login(credentials);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data!;
    } catch (error) {
      // Fallback a implementación local si el backend no está disponible
      console.warn('Backend not available, using local auth:', error);
      
      const userData = USERS_DB.get(credentials.email);
      
      if (!userData) {
        throw new Error('Credenciales inválidas');
      }
      
      if (!verifyPassword(credentials.password, userData.password)) {
        throw new Error('Credenciales inválidas');
      }
      
      // Actualizar último login
      userData.user.lastLogin = new Date();
      
      // Generar tokens
      const tokens = this.generateTokens(userData.user);
      
      return { user: userData.user, tokens };
    }
  },
  
  // Generar tokens JWT
  generateTokens(user: User): AuthTokens {
    const now = Math.floor(Date.now() / 1000);
    
    const accessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: now,
      exp: now + (15 * 60), // 15 minutos
      type: 'access'
    };
    
    const refreshTokenPayload = {
      sub: user.id,
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 días
      type: 'refresh'
    };
    
    return {
      accessToken: generateJWT(accessTokenPayload),
      refreshToken: generateJWT(refreshTokenPayload),
      expiresIn: 15 * 60
    };
  },
  
  // Verificar token
  async verifyToken(token: string): Promise<User> {
    try {
      const payload = verifyJWT(token);
      
      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }
      
      // Buscar usuario en la base de datos
      for (const [, userData] of USERS_DB) {
        if (userData.user.id === payload.sub) {
          return userData.user;
        }
      }
      
      throw new Error('User not found');
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
  
  // Refrescar token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = verifyJWT(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      
      // Buscar usuario
      for (const [, userData] of USERS_DB) {
        if (userData.user.id === payload.sub) {
          return this.generateTokens(userData.user);
        }
      }
      
      throw new Error('User not found');
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },
  
  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      const { apiClient } = await import('./api-client');
      await apiClient.logout();
    } catch (error) {
      console.warn('Backend logout failed, using local logout:', error);
      // Fallback a limpieza local
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('user_data');
    }
  }
};

// Hook para manejar el estado de autenticación
export class AuthManager {
  private static instance: AuthManager;
  private listeners: Set<(state: AuthState) => void> = new Set();
  private state: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  };
  
  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }
  
  private constructor() {
    this.initializeAuth();
  }
  
  private async initializeAuth() {
    try {
      const tokens = this.getStoredTokens();
      if (tokens) {
        const user = await authAPI.verifyToken(tokens.accessToken);
        this.setState({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        this.setState({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      // Token inválido, limpiar almacenamiento
      this.clearStoredAuth();
      this.setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }
  
  private getStoredTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem('auth_tokens');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  private storeTokens(tokens: AuthTokens) {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }
  
  private storeUser(user: User) {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
  
  private clearStoredAuth() {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('user_data');
  }
  
  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
  
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  getState(): AuthState {
    return this.state;
  }
  
  async login(credentials: LoginCredentials) {
    this.setState({ isLoading: true, error: null });
    
    try {
      const { user, tokens } = await authAPI.login(credentials);
      this.storeTokens(tokens);
      this.storeUser(user);
      this.setState({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error de autenticación'
      });
      throw error;
    }
  }
  
  async register(credentials: RegisterCredentials) {
    this.setState({ isLoading: true, error: null });
    
    try {
      const { user, tokens } = await authAPI.register(credentials);
      this.storeTokens(tokens);
      this.storeUser(user);
      this.setState({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      this.setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error de registro'
      });
      throw error;
    }
  }
  
  async logout() {
    await authAPI.logout();
    this.clearStoredAuth();
    this.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }
  
  async refreshTokens() {
    if (!this.state.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const tokens = await authAPI.refreshToken(this.state.tokens.refreshToken);
      this.storeTokens(tokens);
      this.setState({ tokens });
    } catch (error) {
      // Refresh falló, hacer logout
      await this.logout();
      throw error;
    }
  }
}

// Exportar instancia singleton
export const authManager = AuthManager.getInstance();
