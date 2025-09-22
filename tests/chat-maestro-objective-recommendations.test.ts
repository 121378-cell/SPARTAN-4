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

describe('ChatMaestroPredictiveEngine - Objective Based Recommendations', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    
    // Mock storage methods
    (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([
      { date: new Date(), recoveryScore: 75, fatigueLevel: 'moderate' },
      { date: new Date(Date.now() - 86400000), recoveryScore: 70, fatigueLevel: 'moderate' },
      { date: new Date(Date.now() - 172800000), recoveryScore: 65, fatigueLevel: 'high' }
    ]);
    (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([
      { date: new Date(), meals: [{ time: '08:00', completed: true }, { time: '13:00', completed: true }, { time: '19:00', completed: false }] },
      { date: new Date(Date.now() - 86400000), meals: [{ time: '08:00', completed: true }, { time: '13:00', completed: true }, { time: '19:00', completed: true }] }
    ]);
    (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([
      { exerciseName: 'Press de banca', weight: 80, reps: 5, rpe: 8, date: new Date() },
      { exerciseName: 'Press de banca', weight: 75, reps: 5, rpe: 7, date: new Date(Date.now() - 86400000) },
      { exerciseName: 'Sentadilla', weight: 100, reps: 5, rpe: 8, date: new Date() },
      { exerciseName: 'Sentadilla', weight: 95, reps: 5, rpe: 7, date: new Date(Date.now() - 86400000) }
    ]);
  });
  
  describe('generateObjectiveBasedRecommendations', () => {
    it('should generate strength-focused recommendations with enhanced analysis', () => {
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
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 3,
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 3, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [
          { id: 'workout-1', date: new Date().toISOString(), duration: 60, exercises: [] },
          { id: 'workout-2', date: new Date(Date.now() - 86400000).toISOString(), duration: 65, exercises: [] },
          { id: 'workout-3', date: new Date(Date.now() - 172800000).toISOString(), duration: 60, exercises: [] }
        ],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Aumentar fuerza']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Aumentar fuerza');
      expect(recommendations[0].recommendedAction).toBeDefined();
      expect(recommendations[0].timeline).toBeDefined();
      expect(recommendations[0].successMetrics).toHaveLength(2);
      expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0.6);
    });
    
    it('should generate muscle mass recommendations with enhanced analysis', () => {
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
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 4,
          lastTrainingSessions: [],
          averageTrainingDuration: 75,
          preferredTrainingDays: [1, 2, 4, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [
          { id: 'workout-1', date: new Date().toISOString(), duration: 75, exercises: [] },
          { id: 'workout-2', date: new Date(Date.now() - 86400000).toISOString(), duration: 80, exercises: [] },
          { id: 'workout-3', date: new Date(Date.now() - 172800000).toISOString(), duration: 75, exercises: [] },
          { id: 'workout-4', date: new Date(Date.now() - 259200000).toISOString(), duration: 70, exercises: [] }
        ],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Ganar masa muscular']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Ganar masa muscular');
      expect(recommendations[0].recommendedAction).toBeDefined();
      expect(recommendations[0].timeline).toBeDefined();
      expect(recommendations[0].successMetrics).toHaveLength(2);
      expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0.6);
    });
    
    it('should generate definition recommendations with enhanced analysis', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Definición muscular']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 5,
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 2, 3, 4, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'verduras'],
          dislikedFoods: ['postres'],
          dietaryRestrictions: [],
          nutritionGoals: ['definition']
        }],
        recentWorkouts: [
          { id: 'workout-1', date: new Date().toISOString(), duration: 60, exercises: [] },
          { id: 'workout-2', date: new Date(Date.now() - 86400000).toISOString(), duration: 60, exercises: [] },
          { id: 'workout-3', date: new Date(Date.now() - 172800000).toISOString(), duration: 60, exercises: [] },
          { id: 'workout-4', date: new Date(Date.now() - 259200000).toISOString(), duration: 60, exercises: [] },
          { id: 'workout-5', date: new Date(Date.now() - 345600000).toISOString(), duration: 60, exercises: [] }
        ],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Definición muscular']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Definición muscular');
      expect(recommendations[0].recommendedAction).toBeDefined();
      expect(recommendations[0].timeline).toBeDefined();
      expect(recommendations[0].successMetrics).toHaveLength(2);
      expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0.6);
    });
    
    it('should generate endurance recommendations with enhanced analysis', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Mejorar resistencia']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 6,
          lastTrainingSessions: [],
          averageTrainingDuration: 45,
          preferredTrainingDays: [1, 2, 3, 4, 5, 6],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['carbohidratos', 'frutas'],
          dislikedFoods: ['grasas pesadas'],
          dietaryRestrictions: [],
          nutritionGoals: ['endurance']
        }],
        recentWorkouts: [
          { id: 'workout-1', date: new Date().toISOString(), duration: 45, exercises: [] },
          { id: 'workout-2', date: new Date(Date.now() - 86400000).toISOString(), duration: 45, exercises: [] },
          { id: 'workout-3', date: new Date(Date.now() - 172800000).toISOString(), duration: 45, exercises: [] },
          { id: 'workout-4', date: new Date(Date.now() - 259200000).toISOString(), duration: 45, exercises: [] },
          { id: 'workout-5', date: new Date(Date.now() - 345600000).toISOString(), duration: 45, exercises: [] },
          { id: 'workout-6', date: new Date(Date.now() - 432000000).toISOString(), duration: 45, exercises: [] }
        ],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Mejorar resistencia']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Mejorar resistencia');
      expect(recommendations[0].recommendedAction).toBeDefined();
      expect(recommendations[0].timeline).toBeDefined();
      expect(recommendations[0].successMetrics).toHaveLength(2);
      expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0.6);
    });
    
    it('should generate mobility recommendations with enhanced analysis', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Mejorar movilidad']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 4,
          lastTrainingSessions: [],
          averageTrainingDuration: 90,
          preferredTrainingDays: [1, 2, 4, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['antiinflamatorios', 'verduras'],
          dislikedFoods: ['procesados'],
          dietaryRestrictions: [],
          nutritionGoals: ['mobility']
        }],
        recentWorkouts: [
          { id: 'workout-1', date: new Date().toISOString(), duration: 90, exercises: [] },
          { id: 'workout-2', date: new Date(Date.now() - 86400000).toISOString(), duration: 90, exercises: [] },
          { id: 'workout-3', date: new Date(Date.now() - 172800000).toISOString(), duration: 90, exercises: [] },
          { id: 'workout-4', date: new Date(Date.now() - 259200000).toISOString(), duration: 90, exercises: [] }
        ],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Mejorar movilidad']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Mejorar movilidad');
      expect(recommendations[0].recommendedAction).toBeDefined();
      expect(recommendations[0].timeline).toBeDefined();
      expect(recommendations[0].successMetrics).toHaveLength(2);
      expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0.6);
    });
    
    it('should generate recovery recommendations with enhanced analysis', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Optimizar recuperación']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 6,
          lastTrainingSessions: [],
          averageTrainingDuration: 75,
          preferredTrainingDays: [1, 2, 3, 4, 5, 6],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['recuperación', 'proteínas'],
          dislikedFoods: ['inflamatorios'],
          dietaryRestrictions: [],
          nutritionGoals: ['recovery']
        }],
        recentWorkouts: [
          { id: 'workout-1', date: new Date().toISOString(), duration: 75, exercises: [] },
          { id: 'workout-2', date: new Date(Date.now() - 86400000).toISOString(), duration: 80, exercises: [] },
          { id: 'workout-3', date: new Date(Date.now() - 172800000).toISOString(), duration: 75, exercises: [] },
          { id: 'workout-4', date: new Date(Date.now() - 259200000).toISOString(), duration: 80, exercises: [] },
          { id: 'workout-5', date: new Date(Date.now() - 345600000).toISOString(), duration: 75, exercises: [] },
          { id: 'workout-6', date: new Date(Date.now() - 432000000).toISOString(), duration: 80, exercises: [] }
        ],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Optimizar recuperación']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Optimizar recuperación');
      expect(recommendations[0].recommendedAction).toBeDefined();
      expect(recommendations[0].timeline).toBeDefined();
      expect(recommendations[0].successMetrics).toHaveLength(2);
      expect(recommendations[0].confidence).toBeGreaterThanOrEqual(0.6);
    });
    
    it('should handle multiple objectives', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar fuerza', 'Ganar masa muscular']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Aumentar fuerza', 'Ganar masa muscular']);
      
      expect(recommendations).toHaveLength(2);
      expect(recommendations[0].objective).toBe('Aumentar fuerza');
      expect(recommendations[1].objective).toBe('Ganar masa muscular');
    });
    
    it('should handle unknown objectives with default recommendation', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Objetivo desconocido']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generateObjectiveBasedRecommendations(context, ['Objetivo desconocido']);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].objective).toBe('Objetivo desconocido');
      expect(recommendations[0].recommendedAction).toContain('Mantén tu enfoque actual');
    });
  });
  
  describe('formatObjectiveRecommendationsForChat', () => {
    it('should format objective recommendations for chat response', () => {
      const recommendations = [
        {
          objective: 'Aumentar fuerza',
          recommendedAction: 'Aumenta progresivamente la carga en ejercicios compuestos',
          timeline: '4-6 semanas',
          successMetrics: ['Incremento del 5-10% en press de banca', 'Mejora del 5-10% en sentadilla'],
          confidence: 0.85
        }
      ];
      
      const chatResponse = predictiveEngine.formatObjectiveRecommendationsForChat(recommendations);
      
      expect(chatResponse.response).toContain('Recomendaciones Basadas en Tus Objetivos');
      expect(chatResponse.response).toContain('Aumentar fuerza');
      expect(chatResponse.response).toContain('Aumenta progresivamente la carga en ejercicios compuestos');
      expect(chatResponse.response).toContain('4-6 semanas');
      expect(chatResponse.response).toContain('Incremento del 5-10% en press de banca');
      expect(chatResponse.response).toContain('85%');
      expect(chatResponse.actionItems).toHaveLength(1);
    });
    
    it('should handle empty objective recommendations', () => {
      const recommendations: any[] = [];
      
      const chatResponse = predictiveEngine.formatObjectiveRecommendationsForChat(recommendations);
      
      expect(chatResponse.response).toContain('No tengo recomendaciones específicas');
      expect(chatResponse.actionItems).toHaveLength(0);
    });
  });
});