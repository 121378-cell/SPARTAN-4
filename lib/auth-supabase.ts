// Sistema de autenticación mejorado con Supabase para SPARTAN 4
import { useState, useEffect } from 'react';
import { supabase, auth, db } from './supabase';
import type { Database } from './supabase';
import { freeTierMonitor } from './free-tier-monitor';

export interface User {
  id: string;
  email: string;
  name: string;
  fitness_level: string;
  goals: string[];
  age?: number;
  weight?: number;
  height?: number;
  avatar?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  fitness_level?: string;
  goals?: string[];
  age?: number;
  weight?: number;
  height?: number;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Check if Supabase is configured
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'Esperando tu SUPABASE_URL...') {
        console.log('Supabase no configurado, usando autenticación local');
        this.setState({ isLoading: false });
        return;
      }

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        this.setState({ error: error.message, isLoading: false });
        return;
      }

      if (session?.user) {
        await this.handleAuthUser(session.user, session);
      } else {
        this.setState({ isLoading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await this.handleAuthUser(session.user, session);
        } else if (event === 'SIGNED_OUT') {
          this.setState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      });

    } catch (error) {
      console.error('Error initializing auth:', error);
      this.setState({ 
        error: 'Error al inicializar autenticación', 
        isLoading: false 
      });
    }
  }

  private async handleAuthUser(authUser: any, session: any) {
    try {
      // Get or create user profile
      const { data: userProfile, error } = await db.getUser(authUser.id);
      
      if (error && error.code === 'PGRST116') {
        // User profile doesn't exist, create it
        const newProfile = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
          fitness_level: 'beginner',
          goals: ['Mantenerse en forma'],
        };

        const { data: createdProfile, error: createError } = await db.createUser(newProfile);
        
        if (createError) {
          console.error('Error creating user profile:', createError);
          this.setState({ 
            error: 'Error al crear perfil de usuario', 
            isLoading: false 
          });
          return;
        }

        this.setState({
          user: createdProfile!,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else if (userProfile) {
        this.setState({
          user: userProfile,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        console.error('Error getting user profile:', error);
        this.setState({ 
          error: 'Error al obtener perfil de usuario', 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error handling auth user:', error);
      this.setState({ 
        error: 'Error al procesar usuario', 
        isLoading: false 
      });
    }
  }

  async register(credentials: RegisterCredentials): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Validaciones
      if (!credentials.email || !credentials.password || !credentials.name) {
        throw new Error('Todos los campos son requeridos');
      }

      if (credentials.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        throw new Error('Email inválido');
      }

      // Check if Supabase is configured
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'Esperando tu SUPABASE_URL...') {
        throw new Error('Base de datos no configurada. Por favor configura Supabase.');
      }

      // Register with Supabase Auth
      const { data, error } = await auth.signUp(
        credentials.email,
        credentials.password,
        {
          name: credentials.name,
          fitness_level: credentials.fitness_level || 'beginner',
          goals: credentials.goals || ['Mantenerse en forma'],
          age: credentials.age,
          weight: credentials.weight,
          height: credentials.height,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && !data.session) {
        // Email confirmation required
        this.setState({
          isLoading: false,
          error: null,
        });
        
        // Show confirmation message
        alert('¡Registro exitoso! Por favor revisa tu email para confirmar tu cuenta.');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      this.setState({
        error: error.message || 'Error al registrarse',
        isLoading: false,
      });
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Check if Supabase is configured
      const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'Esperando tu SUPABASE_URL...') {
        throw new Error('Base de datos no configurada. Por favor configura Supabase.');
      }

      const { data, error } = await auth.signIn(credentials.email, credentials.password);

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && data.session) {
        // User will be handled by onAuthStateChange
        console.log('Login successful for:', data.user.email);
      }

    } catch (error: any) {
      console.error('Login error:', error);
      this.setState({
        error: error.message || 'Error al iniciar sesión',
        isLoading: false,
      });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const { error } = await auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      // State will be updated by onAuthStateChange

    } catch (error: any) {
      console.error('Logout error:', error);
      this.setState({
        error: error.message || 'Error al cerrar sesión',
        isLoading: false,
      });
    }
  }

  async updateProfile(updates: Partial<User>): Promise<void> {
    try {
      if (!this.state.user) {
        throw new Error('Usuario no autenticado');
      }

      this.setState({ isLoading: true, error: null });

      const { data, error } = await db.updateUser(this.state.user.id, updates);

      if (error) {
        throw new Error(error.message);
      }

      this.setState({
        user: data!,
        isLoading: false,
        error: null,
      });

    } catch (error: any) {
      console.error('Profile update error:', error);
      this.setState({
        error: error.message || 'Error al actualizar perfil',
        isLoading: false,
      });
      throw error;
    }
  }

  // Get current state
  getState(): AuthState {
    return { ...this.state };
  }

  // Subscribe to state changes
  subscribe(callback: (state: AuthState) => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private setState(updates: Partial<AuthState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  // Check if user can use AI features
  canUseAI(): boolean {
    return freeTierMonitor.canUseAI();
  }

  // Get remaining AI requests
  getRemainingAIRequests(): number {
    return freeTierMonitor.getRemainingAIRequests();
  }

  // Track AI usage
  trackAIUsage() {
    freeTierMonitor.trackUsage('gemini', 'requests');
  }
}

// Export singleton instance
export const authManager = new AuthManager();

// Export for backward compatibility
export default authManager;

// Helper hooks for React components
export const useAuth = () => {
  const [state, setState] = useState(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    register: authManager.register.bind(authManager),
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    updateProfile: authManager.updateProfile.bind(authManager),
    canUseAI: authManager.canUseAI.bind(authManager),
    getRemainingAIRequests: authManager.getRemainingAIRequests.bind(authManager),
    trackAIUsage: authManager.trackAIUsage.bind(authManager),
  };
};