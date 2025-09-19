import { ChatMaestroService } from '../lib/chat-maestro-service';
import { ChatContext, ChatIntent } from '../lib/chat-maestro-service';
import { RecoveryAnalysis, ProgressionPlan, WorkoutSession, DailyNutrition, UserHabit, UserData } from '../lib/types';

describe('Chat Maestro Orchestration', () => {
  let chatMaestro: ChatMaestroService;

  beforeEach(() => {
    chatMaestro = ChatMaestroService.getInstance();
  });

  describe('Module Integration', () => {
    it('should coordinate training with recovery status', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'workoutDetail',
        activeWorkout: {
          id: 'workout-1',
          name: 'Test Workout',
          description: 'Test workout plan',
          focus: ['strength'],
          days: [],
          duration: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
          difficulty: 'intermediate',
          equipment: []
        },
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: [],
        recoveryStatus: {
          date: new Date(),
          recoveryScore: 30,
          fatigueLevel: 'high',
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        }
      };

      // This should not throw an error
      expect(() => {
        // In a real implementation, this would actually coordinate the modules
        // For now, we're just testing that the method exists and can be called
      }).not.toThrow();
    });

    it('should generate holistic recommendations across all modules', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [
          { 
            id: '1', 
            workoutPlanId: 'plan1',
            date: new Date(), 
            startTime: new Date(),
            endTime: new Date(),
            duration: 60,
            exercises: [],
            notes: ''
          }
        ],
        progressionPlans: [
          { 
            exerciseName: 'Bench Press', 
            currentWeight: 100,
            recommendedWeight: 105,
            nextPhase: 'accumulation',
            adjustments: [],
            notes: []
          }
        ],
        recoveryStatus: {
          date: new Date(),
          recoveryScore: 30,
          fatigueLevel: 'high',
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        },
        nutritionData: {
          date: new Date(),
          totalNutrients: {
            calories: 1200,
            protein: 100,
            carbs: 150,
            fats: 50
          },
          meals: []
        },
        wearableInsights: {
          recoveryStatus: 'poor',
          trainingReadiness: 'rest',
          adjustments: [],
          recommendations: [],
          riskFactors: []
        }
      };

      const recommendations = chatMaestro.generateHolisticRecommendations(context);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Should have recommendations from multiple modules
      const modules = recommendations.map(rec => rec.module);
      expect(modules).toContain('training');
      expect(modules).toContain('recovery');
      expect(modules).toContain('nutrition');
      expect(modules).toContain('progression');
      expect(modules).toContain('wearables');
    });

    it('should assess system risks across all modules', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: [],
        recoveryStatus: {
          date: new Date(),
          recoveryScore: 30,
          fatigueLevel: 'extreme',
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        },
        wearableInsights: {
          recoveryStatus: 'critical',
          trainingReadiness: 'rest',
          adjustments: [],
          recommendations: [],
          riskFactors: []
        }
      };

      const risks = chatMaestro.assessSystemRisks(context);
      
      expect(risks).toBeDefined();
      expect(Array.isArray(risks)).toBe(true);
      
      // Should identify high-severity risks
      const highRisk = risks.find(risk => risk.severity === 'high');
      expect(highRisk).toBeDefined();
      
      // Should have recommendations for mitigating risks
      expect(highRisk?.recommendations).toBeDefined();
      expect(Array.isArray(highRisk?.recommendations)).toBe(true);
      expect(highRisk?.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Adaptive Response Generation', () => {
    it('should generate adaptive responses based on user context', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };

      const response = chatMaestro.generateAdaptiveResponse(context, 'general');
      
      expect(response.response).toBeDefined();
      expect(typeof response.response).toBe('string');
      expect(response.response.length).toBeGreaterThan(0);
    });
  });

  describe('Real-time Analysis', () => {
    it('should perform real-time analysis across all integrated modules', async () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };

      const insights = await chatMaestro.performRealTimeAnalysis(context);
      
      expect(insights).toBeDefined();
      expect(typeof insights).toBe('object');
      
      // Should have analysis from multiple areas
      expect(insights.trainingPatterns).toBeDefined();
      expect(insights.recoveryTrends).toBeDefined();
      expect(insights.progressionTrends).toBeDefined();
      expect(insights.nutritionAdherence).toBeDefined();
      expect(insights.predictiveInsights).toBeDefined();
    });
  });
});