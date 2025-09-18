/**
 * Chat Maestro Tests
 */

import { ChatMaestroService, ChatContext } from '../lib/chat-maestro-service';
import { storageManager } from '../lib/storage';
import { habitTrackingService } from '../lib/habit-tracking';
import { recoveryService } from '../lib/recovery-service';
import { loadProgressionService } from '../lib/load-progression-service';
import { nutritionService } from '../lib/nutrition-service';

// Mock all services
jest.mock('../lib/storage');
jest.mock('../lib/habit-tracking');
jest.mock('../lib/recovery-service');
jest.mock('../lib/load-progression-service');
jest.mock('../lib/nutrition-service');

describe('ChatMaestroService', () => {
  let chatMaestroService: ChatMaestroService;
  const mockUserId = 'test-user-id';
  const mockCurrentScreen = 'dashboard';
  
  const mockUserData = {
    name: 'Test User',
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: 'intermediate' as const,
    goals: ['Muscle Gain', 'Strength']
  };
  
  const mockContext: ChatContext = {
    userId: mockUserId,
    currentScreen: mockCurrentScreen,
    userData: mockUserData,
    userHabits: [],
    recentWorkouts: [],
    progressionPlans: []
  };

  beforeEach(() => {
    chatMaestroService = ChatMaestroService.getInstance();
    jest.clearAllMocks();
  });

  describe('determineIntent', () => {
    it('should correctly identify workout inquiry intent', () => {
      const intent = (chatMaestroService as any).determineIntent('¿Qué ejercicio debo hacer hoy?', mockContext);
      expect(intent).toBe('workout_inquiry');
    });

    it('should correctly identify recovery advice intent', () => {
      const intent = (chatMaestroService as any).determineIntent('Me siento muy cansado, ¿debería descansar?', mockContext);
      expect(intent).toBe('recovery_advice');
    });

    it('should correctly identify progression guidance intent', () => {
      const intent = (chatMaestroService as any).determineIntent('¿Debo aumentar la carga en mis sentadillas?', mockContext);
      expect(intent).toBe('progression_guidance');
    });

    it('should correctly identify nutrition guidance intent', () => {
      const intent = (chatMaestroService as any).determineIntent('¿Qué debo comer después del entrenamiento?', mockContext);
      expect(intent).toBe('nutrition_guidance');
    });

    it('should correctly identify routine modification intent', () => {
      const intent = (chatMaestroService as any).determineIntent('Quiero cambiar mi rutina semanal', mockContext);
      expect(intent).toBe('routine_modification');
    });

    it('should correctly identify performance analysis intent', () => {
      const intent = (chatMaestroService as any).determineIntent('¿Cómo va mi progreso últimamente?', mockContext);
      expect(intent).toBe('performance_analysis');
    });

    it('should correctly identify goal setting intent', () => {
      const intent = (chatMaestroService as any).determineIntent('Quiero establecer una nueva meta de fuerza', mockContext);
      expect(intent).toBe('goal_setting');
    });

    it('should correctly identify motivation intent', () => {
      const intent = (chatMaestroService as any).determineIntent('Necesito motivación para entrenar hoy', mockContext);
      expect(intent).toBe('motivation');
    });

    it('should correctly identify technical support intent', () => {
      const intent = (chatMaestroService as any).determineIntent('Tengo un problema con la aplicación', mockContext);
      expect(intent).toBe('technical_support');
    });

    it('should default to general intent for unclear queries', () => {
      const intent = (chatMaestroService as any).determineIntent('Hola, ¿cómo estás?', mockContext);
      expect(intent).toBe('general');
    });
  });

  describe('processUserInput', () => {
    it('should process user input and generate a response', async () => {
      const input = '¿Qué ejercicio debo hacer hoy?';
      const response = await chatMaestroService.processUserInput(input, mockContext);
      
      expect(response).toHaveProperty('response');
      expect(typeof response.response).toBe('string');
    });

    it('should handle workout inquiries', async () => {
      const input = '¿Cuál es mi próxima rutina?';
      const response = await chatMaestroService.processUserInput(input, mockContext);
      
      expect(response.response).toContain('No he encontrado un entrenamiento activo');
    });

    it('should handle recovery advice requests', async () => {
      const input = 'Me siento muy cansado';
      const response = await chatMaestroService.processUserInput(input, mockContext);
      
      expect(response.response).toContain('No tengo datos recientes sobre tu estado de recuperación');
    });
  });

  describe('buildContext', () => {
    it('should build a comprehensive context object', async () => {
      // Mock storage manager methods
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockUserData);
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([]);
      (storageManager.getWorkoutSessions as jest.Mock).mockReturnValue([]);
      (storageManager.getProgressionPlans as jest.Mock).mockReturnValue([]);
      
      const context = await chatMaestroService.buildContext(mockUserId, mockCurrentScreen);
      
      expect(context).toHaveProperty('userId', mockUserId);
      expect(context).toHaveProperty('currentScreen', mockCurrentScreen);
      expect(context).toHaveProperty('userData');
      expect(context).toHaveProperty('userHabits');
      expect(context).toHaveProperty('recentWorkouts');
      expect(context).toHaveProperty('progressionPlans');
    });
  });

  describe('performRealTimeAnalysis', () => {
    it('should perform real-time analysis and return insights', async () => {
      const insights = await (chatMaestroService as any).performRealTimeAnalysis(mockContext);
      
      expect(insights).toHaveProperty('trainingPatterns');
      expect(insights).toHaveProperty('recoveryTrends');
      expect(insights).toHaveProperty('progressionTrends');
      expect(insights).toHaveProperty('nutritionAdherence');
      expect(insights).toHaveProperty('predictiveInsights');
    });

    it('should analyze training patterns', () => {
      const trainingPatterns = (chatMaestroService as any).analyzeTrainingPatterns(mockContext);
      
      expect(trainingPatterns).toHaveProperty('message', 'No hay datos de entrenamiento recientes');
    });

    it('should analyze recovery trends', () => {
      const recoveryTrends = (chatMaestroService as any).analyzeRecoveryTrends(mockContext);
      
      expect(recoveryTrends).toHaveProperty('message', 'No hay datos de recuperación recientes');
    });

    it('should analyze progression trends', () => {
      const progressionTrends = (chatMaestroService as any).analyzeProgressionTrends(mockContext);
      
      expect(progressionTrends).toHaveProperty('message', 'No hay datos de progresión recientes');
    });
  });

  describe('generatePersonalizedRecommendations', () => {
    it('should generate personalized recommendations based on context', () => {
      const recommendations = (chatMaestroService as any).generatePersonalizedRecommendations(mockContext);
      
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });
});