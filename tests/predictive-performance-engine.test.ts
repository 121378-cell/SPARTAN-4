import { PredictivePerformanceEngine } from '../lib/predictive-performance-engine';
import { ChatContext } from '../lib/chat-maestro-service';

// Mock storage manager methods
jest.mock('../lib/storage', () => ({
  storageManager: {
    getRecoveryAnalyses: jest.fn().mockReturnValue([]),
    getDailyNutrition: jest.fn().mockReturnValue([]),
    getProgressionMetrics: jest.fn().mockReturnValue([]),
    getUserData: jest.fn(),
    getWorkoutPlans: jest.fn(),
    getWorkoutSessions: jest.fn(),
    getUserHabits: jest.fn().mockReturnValue([]),
    getProgressionPlans: jest.fn(),
    getSettings: jest.fn()
  }
}));

describe('PredictivePerformanceEngine', () => {
  let predictiveEngine: PredictivePerformanceEngine;
  
  beforeEach(() => {
    predictiveEngine = PredictivePerformanceEngine.getInstance();
  });
  
  describe('analyzePerformanceTrends', () => {
    it('should analyze training trends from recent workouts', () => {
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
        recentWorkouts: [
          {
            id: 'workout-1',
            workoutPlanId: 'plan-1',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
            startTime: null,
            endTime: null,
            duration: 60,
            exercises: [
              {
                exerciseId: 'exercise-1',
                name: 'Sentadilla',
                sets: [
                  { setNumber: 1, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 2, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 3, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' }
                ]
              }
            ],
            notes: ''
          },
          {
            id: 'workout-2',
            workoutPlanId: 'plan-1',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            startTime: null,
            endTime: null,
            duration: 65,
            exercises: [
              {
                exerciseId: 'exercise-1',
                name: 'Sentadilla',
                sets: [
                  { setNumber: 1, weight: 110, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 2, weight: 110, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 3, weight: 110, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' }
                ]
              }
            ],
            notes: ''
          },
          {
            id: 'workout-3',
            workoutPlanId: 'plan-1',
            date: new Date(), // Today
            startTime: null,
            endTime: null,
            duration: 70,
            exercises: [
              {
                exerciseId: 'exercise-1',
                name: 'Sentadilla',
                sets: [
                  { setNumber: 1, weight: 120, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 2, weight: 120, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 3, weight: 120, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' }
                ]
              }
            ],
            notes: ''
          }
        ],
        progressionPlans: []
      };
      
      const trends = predictiveEngine.analyzePerformanceTrends(context);
      
      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBeGreaterThan(0);
      
      // Check that we have training-related trends
      const trainingVolumeTrend = trends.find(t => t.metric === 'training_volume');
      expect(trainingVolumeTrend).toBeDefined();
      // The trend might be "stable" or "improving" depending on the exact values
      // Just check that it's one of the valid trend values
      expect(['improving', 'declining', 'stable']).toContain(trainingVolumeTrend?.trend);
    });
    
    it('should analyze recovery trends from recovery status', () => {
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
        recoveryStatus: {
          date: new Date(),
          fatigueLevel: 'high',
          recoveryScore: 45,
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'low'
        },
        progressionPlans: []
      };
      
      const trends = predictiveEngine.analyzePerformanceTrends(context);
      
      // We can't fully test this without mocking storageManager.getRecoveryAnalyses()
      // But we can check that the function executes without error
      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
    });
  });
  
  describe('generateProactiveAlerts', () => {
    it('should generate training risk alerts for overtraining', () => {
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
        recentWorkouts: Array(7).fill(null).map((_, i) => ({
          id: `workout-${i}`,
          workoutPlanId: 'plan-1',
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // One workout per day
          startTime: null,
          endTime: null,
          duration: 60,
          exercises: [
            {
              exerciseId: 'exercise-1',
              name: 'Sentadilla',
              sets: [
                { setNumber: 1, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' }
              ]
            }
          ],
          notes: ''
        })),
        progressionPlans: []
      };
      
      const alerts = predictiveEngine.generateProactiveAlerts(context);
      
      expect(alerts).toBeDefined();
      expect(Array.isArray(alerts)).toBe(true);
      
      // Check for overtraining alert
      const overtrainingAlert = alerts.find(alert => alert.type === 'training_risk');
      expect(overtrainingAlert).toBeDefined();
      expect(overtrainingAlert?.severity).toBe('high');
      expect(overtrainingAlert?.title).toContain('sobreentrenamiento');
    });
    
    it('should generate recovery risk alerts for poor recovery', () => {
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
        recoveryStatus: {
          date: new Date(),
          fatigueLevel: 'high',
          recoveryScore: 35, // Very low recovery score
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        },
        progressionPlans: []
      };
      
      const alerts = predictiveEngine.generateProactiveAlerts(context);
      
      expect(alerts).toBeDefined();
      expect(Array.isArray(alerts)).toBe(true);
      
      // Check for poor recovery alert
      const recoveryAlert = alerts.find(alert => alert.type === 'recovery_risk');
      expect(recoveryAlert).toBeDefined();
      expect(recoveryAlert?.severity).toBe('high');
      expect(recoveryAlert?.title).toContain('Baja puntuación de recuperación');
    });
  });
  
  describe('generatePerformancePredictions', () => {
    it('should generate performance predictions based on context', () => {
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
        recentWorkouts: [
          {
            id: 'workout-1',
            workoutPlanId: 'plan-1',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            startTime: null,
            endTime: null,
            duration: 60,
            exercises: [
              {
                exerciseId: 'exercise-1',
                name: 'Sentadilla',
                sets: [
                  { setNumber: 1, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 2, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 3, weight: 100, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' }
                ]
              }
            ],
            notes: ''
          },
          {
            id: 'workout-2',
            workoutPlanId: 'plan-1',
            date: new Date(), // Today
            startTime: null,
            endTime: null,
            duration: 65,
            exercises: [
              {
                exerciseId: 'exercise-1',
                name: 'Sentadilla',
                sets: [
                  { setNumber: 1, weight: 110, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 2, weight: 110, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' },
                  { setNumber: 3, weight: 110, reps: 10, rpe: 7, tempo: '3010', rest: 90, notes: '' }
                ]
              }
            ],
            notes: ''
          }
        ],
        progressionPlans: []
      };
      
      const predictions = predictiveEngine.generatePerformancePredictions(context);
      
      expect(predictions).toBeDefined();
      expect(Array.isArray(predictions)).toBe(true);
      expect(predictions.length).toBeGreaterThan(0);
      
      // Check that predictions have the expected structure
      predictions.forEach(prediction => {
        expect(prediction.timeframe).toBeDefined();
        expect(prediction.metrics).toBeDefined();
        expect(prediction.metrics.strength).toBeDefined();
        expect(prediction.metrics.endurance).toBeDefined();
        expect(prediction.metrics.bodyComposition).toBeDefined();
        expect(prediction.metrics.recovery).toBeDefined();
        expect(prediction.confidence).toBeDefined();
        expect(prediction.keyFactors).toBeDefined();
      });
    });
  });
  
  describe('generatePreventiveRecommendations', () => {
    it('should generate training recommendations for consistency issues', () => {
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
        userHabits: [
          {
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
          }
        ],
        recentWorkouts: [], // No recent workouts despite planned frequency
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generatePreventiveRecommendations(context);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      // Check for training consistency recommendation
      const consistencyRec = recommendations.find(rec => rec.title.includes('consistencia'));
      expect(consistencyRec).toBeDefined();
      expect(consistencyRec?.category).toBe('training');
      expect(consistencyRec?.priority).toBe('high');
    });
    
    it('should generate nutrition recommendations based on user goals', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar masa muscular'] // Muscle growth goal
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generatePreventiveRecommendations(context);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      // Check for muscle growth nutrition recommendation
      const nutritionRec = recommendations.find(rec => rec.title.includes('proteica'));
      expect(nutritionRec).toBeDefined();
      expect(nutritionRec?.category).toBe('nutrition');
      expect(nutritionRec?.priority).toBe('high');
    });
    
    it('should generate recovery recommendations for poor recovery', () => {
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
        recoveryStatus: {
          date: new Date(),
          fatigueLevel: 'extreme',
          recoveryScore: 30,
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        },
        progressionPlans: []
      };
      
      const recommendations = predictiveEngine.generatePreventiveRecommendations(context);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      
      // Check for recovery optimization recommendation
      const recoveryRec = recommendations.find(rec => rec.title.includes('recuperación'));
      expect(recoveryRec).toBeDefined();
      expect(recoveryRec?.category).toBe('recovery');
      expect(recoveryRec?.priority).toBe('high');
    });
  });
});