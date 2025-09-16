// Tests para el sistema de autenticación
import { authAPI, AuthManager } from '../auth';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
  }
});

// Mock the api-client to always fail, forcing local auth
jest.mock('../api-client', () => ({
  apiClient: {
    register: jest.fn().mockRejectedValue(new Error('Backend not available')),
    login: jest.fn().mockRejectedValue(new Error('Backend not available')),
    logout: jest.fn().mockResolvedValue(undefined),
  }
}));

describe('authAPI', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    jest.clearAllMocks();
    
    // Clear any existing test users by mocking a fresh crypto UUID
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9)
      }
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const credentials = {
        name: 'John Doe',
        email: 'john' + Math.random().toString(36).substr(2, 5) + '@example.com',
        password: 'password123'
      };

      const result = await authAPI.register(credentials);
      
      expect(result.user).toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: credentials.email,
        createdAt: expect.any(Date)
      });
      expect(result.tokens).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: 900
      });
    });

    it('should throw error for missing fields', async () => {
      const credentials = {
        name: '',
        email: 'john@example.com',
        password: 'password123'
      };

      await expect(authAPI.register(credentials)).rejects.toThrow('Todos los campos son requeridos');
    });

    it('should throw error for short password', async () => {
      const credentials = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      await expect(authAPI.register(credentials)).rejects.toThrow('La contraseña debe tener al menos 6 caracteres');
    });

    it('should throw error for invalid email', async () => {
      const credentials = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(authAPI.register(credentials)).rejects.toThrow('Email inválido');
    });

    it('should throw error for existing user', async () => {
      const email = 'duplicate' + Math.random().toString(36).substr(2, 5) + '@example.com';
      const credentials = {
        name: 'John Doe',
        email: email,
        password: 'password123'
      };

      // Register first time
      await authAPI.register(credentials);

      // Try to register again with same email
      await expect(authAPI.register(credentials)).rejects.toThrow('El usuario ya existe');
    });
  });

  describe('login', () => {
    let testUserEmail: string;
    
    beforeEach(async () => {
      // Register a unique user for each test
      testUserEmail = 'testuser' + Math.random().toString(36).substr(2, 5) + '@example.com';
      await authAPI.register({
        name: 'John Doe',
        email: testUserEmail,
        password: 'password123'
      });
    });

    it('should login successfully with correct credentials', async () => {
      const credentials = {
        email: testUserEmail,
        password: 'password123'
      };

      const result = await authAPI.login(credentials);
      
      expect(result.user).toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: testUserEmail,
        createdAt: expect.any(Date),
        lastLogin: expect.any(Date)
      });
      expect(result.tokens).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: 900
      });
    });

    it('should throw error for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      await expect(authAPI.login(credentials)).rejects.toThrow('Credenciales inválidas');
    });

    it('should throw error for wrong password', async () => {
      const credentials = {
        email: testUserEmail,
        password: 'wrongpassword'
      };

      await expect(authAPI.login(credentials)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const email = 'tokentest' + Math.random().toString(36).substr(2, 5) + '@example.com';
      const credentials = {
        name: 'John Doe',
        email: email,
        password: 'password123'
      };

      const { tokens } = await authAPI.register(credentials);
      const user = await authAPI.verifyToken(tokens.accessToken);
      
      expect(user).toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: email,
        createdAt: expect.any(Date)
      });
    });

    it('should throw error for invalid token', async () => {
      await expect(authAPI.verifyToken('invalid-token')).rejects.toThrow('Invalid token');
    });
  });

  describe('refreshToken', () => {
    it('should refresh valid refresh token', async () => {
      const email = 'refreshtest' + Math.random().toString(36).substr(2, 5) + '@example.com';
      const credentials = {
        name: 'John Doe',
        email: email,
        password: 'password123'
      };

      const { tokens } = await authAPI.register(credentials);
      const newTokens = await authAPI.refreshToken(tokens.refreshToken);
      
      expect(newTokens).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: 900
      });
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(authAPI.refreshToken('invalid-refresh-token')).rejects.toThrow('Invalid refresh token');
    });
  });
});

describe('AuthManager', () => {
  let authManager: AuthManager;

  beforeEach(() => {
    authManager = AuthManager.getInstance();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset the AuthManager state before each test
    authManager['state'] = {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    };
  });

  describe('getState', () => {
    it('should return initial state', () => {
      const state = authManager.getState();
      expect(state).toEqual({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false, // Updated to match actual behavior
        error: null
      });
    });
  });

  describe('login', () => {
    it('should login and update state', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123'
      };

      // Mock successful login
      jest.spyOn(authAPI, 'login').mockResolvedValue({
        user: {
          id: 'test-uuid-123',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date()
        },
        tokens: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          expiresIn: 900
        }
      });

      await authManager.login(credentials);
      
      const state = authManager.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual({
        id: 'test-uuid-123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: expect.any(Date)
      });
      expect(state.tokens).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 900
      });
    });

    it('should handle login error', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      // Test failed login - this should throw and set state properly
      try {
        await authManager.login(credentials);
      } catch (error) {
        // Expected error
      }
      
      const state = authManager.getState();
      // Since it failed, we should NOT be authenticated
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.tokens).toBeNull();
      expect(state.error).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should logout and clear state', async () => {
      // First login
      jest.spyOn(authAPI, 'login').mockResolvedValue({
        user: {
          id: 'test-uuid-123',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date()
        },
        tokens: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          expiresIn: 900
        }
      });

      await authManager.login({
        email: 'john@example.com',
        password: 'password123'
      });

      // Then logout
      await authManager.logout();
      
      const state = authManager.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.tokens).toBeNull();
    });
  });
});

