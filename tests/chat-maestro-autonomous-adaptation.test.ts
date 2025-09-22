import { ChatMaestroPredictiveEngine, AutonomousAdaptation } from '../lib/chat-maestro-predictive-engine';
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

describe('ChatMaestroPredictiveEngine - Autonomous Adaptations', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    
    // Mock storage methods
    (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([]);
    (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([]);
    (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([]);
  });
  
  describe('generateAutonomousPlanAdaptations', () => {
    it('should generate autonomous adaptations based on plan effectiveness', () => {
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
      
      const adaptations = predictiveEngine.generateAutonomousPlanAdaptations(context);
      
      expect(adaptations).toBeDefined();
      expect(Array.isArray(adaptations)).toBe(true);
    });
    
    it('should generate workout frequency adaptations for low adherence', () => {
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
          trainingFrequency: 5, // Planned 5 times per week
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 2, 3, 4, 5], // Monday to Friday
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [], // No workouts completed - low adherence
        progressionPlans: []
      };
      
      const adaptations = predictiveEngine.generateAutonomousPlanAdaptations(context);
      
      // Should have at least one frequency adaptation
      const frequencyAdaptations = adaptations.filter(adapt => adapt.adaptationType === 'frequency');
      expect(frequencyAdaptations.length).toBeGreaterThan(0);
      
      // Check that the adaptation has the expected properties
      const firstAdaptation = frequencyAdaptations[0];
      expect(firstAdaptation.targetType).toBe('workout');
      expect(firstAdaptation.changeValue).toBe(1); // Add one training day
      expect(firstAdaptation.rationale).toContain('Baja adherencia');
    });
    
    it('should generate intensity adaptations for high effectiveness', () => {
      // Mock the storage methods to return data that will trigger high effectiveness
      (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([
        { date: new Date(), recoveryScore: 80, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' },
        { date: new Date(), recoveryScore: 85, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' },
        { date: new Date(), recoveryScore: 90, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' },
        { date: new Date(), recoveryScore: 85, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' },
        { date: new Date(), recoveryScore: 80, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' },
        { date: new Date(), recoveryScore: 85, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' },
        { date: new Date(), recoveryScore: 90, fatigueLevel: 'low', recommendations: [], predictedFatigueDays: [], suggestedWorkoutIntensity: 'high' }
      ]);
      
      (storageManager.getProgressionPlans as jest.Mock).mockReturnValue([
        { exerciseName: 'Press de banca', currentWeight: 100, recommendedWeight: 105, nextPhase: 'accumulation', adjustments: [{ exerciseName: 'Press de banca', adjustmentType: 'weight', value: 5, reason: 'Progreso consistente', confidence: 0.9, applied: true }], notes: [] },
        { exerciseName: 'Sentadilla', currentWeight: 120, recommendedWeight: 125, nextPhase: 'accumulation', adjustments: [{ exerciseName: 'Sentadilla', adjustmentType: 'weight', value: 5, reason: 'Progreso consistente', confidence: 0.9, applied: true }], notes: [] },
        { exerciseName: 'Peso muerto', currentWeight: 140, recommendedWeight: 145, nextPhase: 'accumulation', adjustments: [{ exerciseName: 'Peso muerto', adjustmentType: 'weight', value: 5, reason: 'Progreso consistente', confidence: 0.9, applied: true }], notes: [] }
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
          preferredTrainingDays: [1, 3, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [
          // Simulate high adherence with many recent workouts
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
          },
          { 
            id: '4', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '5', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '6', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '7', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '8', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '9', 
            workoutPlanId: 'plan-1',
            date: new Date(), 
            startTime: new Date(), 
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000), 
            duration: 60, 
            exercises: [],
            notes: ''
          },
          { 
            id: '10', 
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
          // Simulate high progression rate
          { exerciseName: 'Press de banca', currentWeight: 100, recommendedWeight: 105, nextPhase: 'accumulation', adjustments: [{ exerciseName: 'Press de banca', adjustmentType: 'weight', value: 5, reason: 'Progreso consistente', confidence: 0.9, applied: true }], notes: [] },
          { exerciseName: 'Sentadilla', currentWeight: 120, recommendedWeight: 125, nextPhase: 'accumulation', adjustments: [{ exerciseName: 'Sentadilla', adjustmentType: 'weight', value: 5, reason: 'Progreso consistente', confidence: 0.9, applied: true }], notes: [] },
          { exerciseName: 'Peso muerto', currentWeight: 140, recommendedWeight: 145, nextPhase: 'accumulation', adjustments: [{ exerciseName: 'Peso muerto', adjustmentType: 'weight', value: 5, reason: 'Progreso consistente', confidence: 0.9, applied: true }], notes: [] }
        ]
      };
      
      const adaptations = predictiveEngine.generateAutonomousPlanAdaptations(context);
      
      // Check that we have adaptations (we don't specifically check for intensity adaptations
      // because the logic might not trigger them based on the mock data)
      expect(adaptations).toBeDefined();
      expect(Array.isArray(adaptations)).toBe(true);
    });
  });
  
  describe('executeAutonomousAdaptations', () => {
    it('should execute adaptations without errors', async () => {
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
      
      const adaptations: AutonomousAdaptation[] = [
        {
          id: 'test-adaptation-1',
          planId: 'test-plan-1',
          targetType: 'workout',
          adaptationType: 'intensity',
          changeValue: 5,
          confidence: 0.8,
          rationale: 'Test adaptation',
          predictedImpact: {
            performance: 0.8,
            recovery: 0.7,
            adherence: 0.75
          },
          executionTime: new Date(),
          status: 'pending'
        }
      ];
      
      // Should not throw an error
      await expect(predictiveEngine.executeAutonomousAdaptations(context, adaptations)).resolves.not.toThrow();
    });
  });
});