import { ChatMaestroPredictiveEngine, RecommendationExplanation } from '../lib/chat-maestro-predictive-engine';
import { ChatContext, PredictiveRecommendation } from '../lib/chat-maestro-service';
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

describe('ChatMaestroPredictiveEngine - Logic Explanation System', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    
    // Mock storage methods
    (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([]);
    (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([]);
    (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([]);
  });
  
  describe('generateRecommendationExplanation', () => {
    it('should generate explanation for workout suggestion', () => {
      const recommendation: PredictiveRecommendation = {
        id: 'test-rec-1',
        type: 'workout_suggestion',
        confidence: 0.8,
        priority: 'medium',
        title: 'Optimiza tu rutina de entrenamiento',
        description: 'Basado en tu historial, te recomiendo entrenar hoy para mantener consistencia.',
        logicExplanation: 'Tu consistencia de entrenamiento es del 60%, lo que sugiere necesitas mejorar adherencia.',
        actionable: true
      };
      
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
          preferredTrainingDays: [1, 3, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const explanation = predictiveEngine.generateRecommendationExplanation(recommendation, context);
      
      expect(explanation.recommendationId).toBe('test-rec-1');
      expect(explanation.explanation).toBe('Tu consistencia de entrenamiento es del 60%, lo que sugiere necesitas mejorar adherencia.');
      expect(explanation.supportingData.length).toBeGreaterThan(0);
      expect(explanation.confidenceFactors.length).toBeGreaterThan(0);
      expect(explanation.alternativeOptions.length).toBeGreaterThan(0);
    });
    
    it('should generate explanation for modification suggestion', () => {
      const recommendation: PredictiveRecommendation = {
        id: 'test-rec-2',
        type: 'modification_suggestion',
        confidence: 0.9,
        priority: 'critical',
        title: 'Modificación de rutina por fatiga',
        description: 'Detecto alta fatiga. Te recomiendo reducir la intensidad o volumen de tu entrenamiento de hoy.',
        logicExplanation: 'Tu nivel de fatiga es alto, lo que indica que tu cuerpo necesita una carga menor para recuperarse adecuadamente.',
        actionable: true
      };
      
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
      
      const explanation = predictiveEngine.generateRecommendationExplanation(recommendation, context);
      
      expect(explanation.recommendationId).toBe('test-rec-2');
      expect(explanation.supportingData.length).toBeGreaterThan(0);
      expect(explanation.supportingData.some(data => data.dataType === 'fatigue_level')).toBe(true);
      expect(explanation.supportingData.some(data => data.dataType === 'recovery_score')).toBe(true);
    });
    
    it('should generate explanation for recovery advice', () => {
      const recommendation: PredictiveRecommendation = {
        id: 'test-rec-3',
        type: 'recovery_advice',
        confidence: 0.85,
        priority: 'high',
        title: 'Prioriza actividades de recuperación',
        description: 'Tu puntuación de recuperación es baja. Te recomiendo actividades de recuperación activa.',
        logicExplanation: 'Tu puntuación de recuperación es 40/100, lo que indica necesidad de enfocarte en recuperación antes que en entrenamiento intenso.',
        actionable: true
      };
      
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
      
      const explanation = predictiveEngine.generateRecommendationExplanation(recommendation, context);
      
      expect(explanation.recommendationId).toBe('test-rec-3');
      expect(explanation.supportingData.length).toBeGreaterThan(0);
      expect(explanation.supportingData.some(data => data.dataType === 'current_recovery_score')).toBe(true);
      expect(explanation.supportingData.some(data => data.dataType === 'current_fatigue_level')).toBe(true);
    });
  });
  
  describe('formatExplanationsForChat', () => {
    it('should format explanations for chat response', () => {
      const explanations: RecommendationExplanation[] = [
        {
          recommendationId: 'test-rec-1',
          explanation: 'Tu consistencia de entrenamiento es del 60%, lo que sugiere necesitas mejorar adherencia.',
          supportingData: [
            {
              dataType: 'training_consistency',
              dataValue: 3,
              relevance: 0.8
            }
          ],
          confidenceFactors: [
            {
              factor: 'data_quality',
              weight: 0.3,
              impact: 'positive'
            }
          ],
          alternativeOptions: [
            'Entrenar en otro momento del día',
            'Reducir la intensidad del entrenamiento'
          ]
        }
      ];
      
      const chatResponse = predictiveEngine.formatExplanationsForChat(explanations);
      
      expect(chatResponse.response).toContain('Explicaciones Detalladas');
      expect(chatResponse.response).toContain('Datos de Soporte');
      expect(chatResponse.response).toContain('Factores de Confianza');
      expect(chatResponse.response).toContain('Opciones Alternativas');
      expect(chatResponse.actionItems).toHaveLength(1);
    });
    
    it('should handle empty explanations', () => {
      const explanations: RecommendationExplanation[] = [];
      
      const chatResponse = predictiveEngine.formatExplanationsForChat(explanations);
      
      expect(chatResponse.response).toContain('No hay explicaciones detalladas disponibles');
      expect(chatResponse.actionItems).toHaveLength(0);
    });
  });
});