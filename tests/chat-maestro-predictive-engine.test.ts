import { ChatMaestroPredictiveEngine } from '../lib/chat-maestro-predictive-engine';
import { ChatContext } from '../lib/chat-maestro-service';
import { storageManager } from '../lib/storage';

// Mock storage manager methods
jest.mock('../lib/storage', () => ({
  storageManager: {
    getRecoveryAnalyses: jest.fn(),
    getDailyNutrition: jest.fn(),
    getProgressionMetrics: jest.fn(),
    getUserData: jest.fn(),
    getWorkoutPlans: jest.fn(),
    getWorkoutSessions: jest.fn(),
    getUserHabits: jest.fn(),
    getProgressionPlans: jest.fn(),
    getSettings: jest.fn()
  }
}));

describe('ChatMaestroPredictiveEngine', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    
    // Mock storage methods
    (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([]);
    (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([]);
    (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([]);
  });
  
  describe('generatePredictiveRecommendations', () => {
    it('should generate workout suggestions based on user patterns', async () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar masa muscular']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 3,
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 3, 5], // Monday, Wednesday, Friday
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const recommendations = await predictiveEngine.generatePredictiveRecommendations(context);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });
    
    it('should generate modification suggestions based on recovery status', async () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar masa muscular']
        },
        userHabits: [],
        recentWorkouts: [],
        recoveryStatus: {
          date: new Date(),
          fatigueLevel: 'high',
          recoveryScore: 40,
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        },
        progressionPlans: []
      };
      
      const recommendations = await predictiveEngine.generatePredictiveRecommendations(context);
      
      // Should have at least one modification suggestion
      const modificationSuggestions = recommendations.filter(rec => rec.type === 'modification_suggestion');
      expect(modificationSuggestions.length).toBeGreaterThan(0);
      
      // Check that the recommendation has the expected properties
      const firstSuggestion = modificationSuggestions[0];
      expect(firstSuggestion.title).toBeDefined();
      expect(firstSuggestion.description).toBeDefined();
      expect(firstSuggestion.logicExplanation).toBeDefined();
      expect(firstSuggestion.actionable).toBe(true);
    });
    
    it('should generate recovery advice based on wearable data', async () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar masa muscular']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: [],
        wearableInsights: {
          recoveryStatus: 'poor',
          trainingReadiness: 'rest',
          adjustments: [],
          recommendations: [],
          riskFactors: []
        }
      };
      
      const recommendations = await predictiveEngine.generatePredictiveRecommendations(context);
      
      // Should have at least one recovery advice
      const recoveryAdvice = recommendations.filter(rec => rec.type === 'recovery_advice');
      expect(recoveryAdvice.length).toBeGreaterThan(0);
    });
  });
  
  describe('generateObjectiveBasedRecommendations', () => {
    it('should generate strength-focused recommendations', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar fuerza']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Aumentar fuerza']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Aumentar fuerza');
      expect(recommendations[0].recommendedAction).toContain('Aumenta progresivamente la carga');
    });
    
    it('should generate muscle mass recommendations', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Ganar masa muscular']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Ganar masa muscular']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Ganar masa muscular');
      expect(recommendations[0].recommendedAction).toContain('Aumenta el volumen de entrenamiento');
    });
  });
  
  describe('formatRecommendationsForChat', () => {
    it('should format recommendations for chat response', () => {
      const recommendations = [
        {
          id: 'test-1',
          type: 'workout_suggestion',
          confidence: 0.8,
          priority: 'medium',
          title: 'Optimiza tu rutina de entrenamiento',
          description: 'Basado en tu historial, te recomiendo entrenar hoy para mantener consistencia.',
          logicExplanation: 'Tu consistencia es del 60%, lo que sugiere necesitas mejorar adherencia.',
          actionable: true
        }
      ];
      
      const chatResponse = predictiveEngine.formatRecommendationsForChat(recommendations);
      
      expect(chatResponse.response).toContain('Recomendaciones Proactivas');
      expect(chatResponse.response).toContain('Optimiza tu rutina de entrenamiento');
      expect(chatResponse.response).toContain('Lógica:');
      expect(chatResponse.actionItems).toHaveLength(1);
    });
    
    it('should handle empty recommendations', () => {
      const recommendations: any[] = [];
      
      const chatResponse = predictiveEngine.formatRecommendationsForChat(recommendations);
      
      expect(chatResponse.response).toContain('No tengo recomendaciones específicas');
      expect(chatResponse.actionItems).toHaveLength(0);
    });
  });
});