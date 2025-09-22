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

describe('ChatMaestroPredictiveEngine - Enhanced Pattern Recognition', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    
    // Mock storage methods
    (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([]);
    (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([]);
    (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([]);
  });
  
  describe('analyzeUserPatterns', () => {
    it('should analyze user patterns with cross-domain correlation', () => {
      // Mock storage data for comprehensive pattern analysis
      (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([
        { date: new Date(), recoveryScore: 40, fatigueLevel: 'high', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'rest' },
        { date: new Date(), recoveryScore: 35, fatigueLevel: 'extreme', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'rest' },
        { date: new Date(), recoveryScore: 45, fatigueLevel: 'high', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'rest' },
        { date: new Date(), recoveryScore: 50, fatigueLevel: 'moderate', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'rest' },
        { date: new Date(), recoveryScore: 60, fatigueLevel: 'moderate', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'rest' },
        { date: new Date(), recoveryScore: 70, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'rest' },
        { date: new Date(), recoveryScore: 80, fatigueLevel: 'low', recommendations: [], predictedWorkoutIntensity: 'rest' }
      ]);
      
      (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([
        { date: new Date(), meals: [{ time: '08:00', completed: true, nutrients: { calories: 400 } }, { time: '13:00', completed: true, nutrients: { calories: 600 } }, { time: '19:00', completed: true, nutrients: { calories: 800 } }], totalNutrients: { calories: 1800, protein: 150, carbs: 200, fats: 60 } },
        { date: new Date(), meals: [{ time: '08:00', completed: true, nutrients: { calories: 400 } }, { time: '13:00', completed: false, nutrients: { calories: 0 } }, { time: '19:00', completed: true, nutrients: { calories: 800 } }], totalNutrients: { calories: 1200, protein: 100, carbs: 150, fats: 40 } },
        { date: new Date(), meals: [{ time: '08:00', completed: true, nutrients: { calories: 400 } }, { time: '13:00', completed: true, nutrients: { calories: 600 } }, { time: '19:00', completed: false, nutrients: { calories: 0 } }], totalNutrients: { calories: 1000, protein: 80, carbs: 120, fats: 30 } }
      ]);
      
      (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([
        { exerciseName: 'Press de banca', date: new Date(), weight: 100, reps: 5, rpe: 8 },
        { exerciseName: 'Press de banca', date: new Date(), weight: 100, reps: 5, rpe: 8 },
        { exerciseName: 'Press de banca', date: new Date(), weight: 95, reps: 5, rpe: 9 },
        { exerciseName: 'Press de banca', date: new Date(), weight: 95, reps: 5, rpe: 9 },
        { exerciseName: 'Sentadilla', date: new Date(), weight: 120, reps: 5, rpe: 8 },
        { exerciseName: 'Sentadilla', date: new Date(), weight: 120, reps: 5, rpe: 8 },
        { exerciseName: 'Sentadilla', date: new Date(), weight: 120, reps: 5, rpe: 8 },
        { exerciseName: 'Sentadilla', date: new Date(), weight: 120, reps: 5, rpe: 8 }
      ]);
      
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
        recentWorkouts: [
          { 
            id: '1', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '2', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '3', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          }
        ],
        progressionPlans: [
          { exerciseName: 'Press de banca', currentWeight: 100, recommendedWeight: 105, nextPhase: 'accumulation', adjustments: [], notes: [] },
          { exerciseName: 'Sentadilla', currentWeight: 120, recommendedWeight: 125, nextPhase: 'accumulation', adjustments: [], notes: [] }
        ]
      };
      
      // We're testing that the method doesn't throw an error
      expect(() => {
        const patterns = (predictiveEngine as any).analyzeUserPatterns(context);
        expect(patterns).toBeDefined();
        expect(patterns.trainingPatterns).toBeDefined();
        expect(patterns.recoveryPatterns).toBeDefined();
        expect(patterns.nutritionPatterns).toBeDefined();
        expect(patterns.performancePatterns).toBeDefined();
      }).not.toThrow();
    });
  });
  
  describe('crossDomainCorrelationAnalysis', () => {
    it('should perform cross-domain correlation analysis without errors', () => {
      const trainingPatterns = {
        preferredDays: [1, 3, 5],
        preferredTimes: ['07:00', '18:00'],
        consistency: 0.9,
        volumeTrends: 'stable' as const,
        intensityTrends: 'stable' as const
      };
      
      const recoveryPatterns = {
        fatigueCycles: [1, 3, 5],
        sleepQualityTrends: 'stable' as const,
        stressPatterns: [60, 70, 65, 75, 80, 60, 55]
      };
      
      const nutritionPatterns = {
        mealTiming: ['08:00', '13:00', '19:00'],
        adherenceTrends: 'stable' as const,
        macroPreferences: {
          protein: 30,
          carbs: 40,
          fats: 30
        }
      };
      
      const performancePatterns = {
        strengthTrends: {
          'Press de banca': 'stable' as const,
          'Sentadilla': 'stable' as const
        },
        plateauIndicators: ['Press de banca', 'Sentadilla'],
        adaptationWindows: []
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
        progressionPlans: []
      };
      
      // Test that the cross-domain analysis doesn't throw errors
      expect(() => {
        (predictiveEngine as any).performCrossDomainCorrelationAnalysis(
          trainingPatterns,
          recoveryPatterns,
          nutritionPatterns,
          performancePatterns,
          context
        );
      }).not.toThrow();
    });
  });
});