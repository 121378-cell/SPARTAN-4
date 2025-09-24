import { ChatMaestroPredictiveEngine } from '../lib/chat-maestro-predictive-engine';
import { ExternalLifeVariables } from '../lib/types';
import { storageManager } from '../lib/storage';

// Define ChatContext type locally since it's defined in chat-maestro-service.ts
interface ChatContext {
  userId: string;
  currentScreen: string;
  activeWorkout?: any;
  activeSession?: any;
  userData: any;
  userHabits: any[];
  recentWorkouts: any[];
  recoveryStatus?: any;
  progressionPlans: any[];
  nutritionData?: any;
  wearableInsights?: any;
  externalLifeVariables?: ExternalLifeVariables;
}

// Mock storage manager methods
jest.mock('../lib/storage', () => ({
  storageManager: {
    getRecoveryAnalyses: jest.fn(),
    getDailyNutrition: jest.fn(),
    getProgressionMetrics: jest.fn()
  }
}));

describe('ChatMaestro - External Life Variables Integration', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    jest.clearAllMocks();
  });
  
  describe('analyzeExternalLifeVariables', () => {
    it('should analyze external life variables and return impact metrics', () => {
      // Arrange
      const context = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength', 'hypertrophy']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 4,
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 2, 4, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['chicken', 'rice'],
          dislikedFoods: ['broccoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [],
        progressionPlans: []
      } as ChatContext;
      
      const externalLifeVariables: ExternalLifeVariables = {
        workSchedule: {
          startTime: '09:00',
          endTime: '17:00',
          workDays: [1, 2, 3, 4, 5],
          workIntensity: 'high'
        },
        personalSchedule: {
          busyTimes: [{
            startTime: '19:00',
            endTime: '21:00',
            days: [2, 4]
          }],
          importantEvents: [{
            date: new Date(),
            description: 'Family dinner',
            duration: 120
          }]
        },
        travelSchedule: {
          trips: [{
            startDate: new Date(Date.now() + 86400000),
            endDate: new Date(Date.now() + 172800000),
            destination: 'Madrid',
            travelStress: 'moderate'
          }]
        },
        environment: {
          currentLocation: 'Madrid, Spain',
          weatherConditions: {
            temperature: 25,
            humidity: 60,
            precipitation: 10,
            airQuality: 70
          },
          seasonalFactors: 'summer'
        },
        lifestyleFactors: {
          stressLevel: 8,
          sleepQuality: 6,
          socialActivities: 7,
          personalProjects: 5
        },
        availability: {
          preferredWorkoutWindows: [{
            startTime: '07:00',
            endTime: '08:00',
            days: [1, 2, 4, 5]
          }],
          flexibility: 3,
          recoveryPriority: 8
        }
      };
      
      context.externalLifeVariables = externalLifeVariables;
      
      // Act
      const result = (predictiveEngine as any).analyzeExternalLifeVariables(context);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.workImpact).toBeGreaterThan(0);
      expect(result.stressImpact).toBeGreaterThan(0);
      expect(result.scheduleConflicts).toHaveLength(0);
      expect(result.environmentalImpact).toBeGreaterThan(0);
      expect(result.availabilityImpact).toBeGreaterThan(0);
    });
    
    it('should detect schedule conflicts when they exist', () => {
      // Arrange
      const context = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength', 'hypertrophy']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['19:30'],
          trainingFrequency: 4,
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [2],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['chicken', 'rice'],
          dislikedFoods: ['broccoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [],
        progressionPlans: []
      } as ChatContext;
      
      const externalLifeVariables: ExternalLifeVariables = {
        workSchedule: {
          startTime: '09:00',
          endTime: '17:00',
          workDays: [2],
          workIntensity: 'moderate'
        },
        personalSchedule: {
          busyTimes: [{
            startTime: '19:00',
            endTime: '21:00',
            days: [2]
          }],
          importantEvents: []
        },
        travelSchedule: {
          trips: []
        },
        environment: {
          currentLocation: 'Madrid, Spain',
          weatherConditions: {
            temperature: 22,
            humidity: 50,
            precipitation: 0,
            airQuality: 80
          },
          seasonalFactors: 'spring'
        },
        lifestyleFactors: {
          stressLevel: 5,
          sleepQuality: 7,
          socialActivities: 6,
          personalProjects: 4
        },
        availability: {
          preferredWorkoutWindows: [{
            startTime: '07:00',
            endTime: '08:00',
            days: [1, 2, 4, 5]
          }],
          flexibility: 7,
          recoveryPriority: 6
        }
      };
      
      context.externalLifeVariables = externalLifeVariables;
      
      // Mock current time to be during a conflict
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2023-06-13T19:30:00').valueOf());
      
      // Act
      const result = (predictiveEngine as any).analyzeExternalLifeVariables(context);
      
      // Assert
      expect(result.scheduleConflicts).toContain('Conflicto de agenda personal: 19:00-21:00');
    });
  });
  
  describe('enhancePatternRecognitionWithExternalVariables', () => {
    it('should log patterns when high work impact and declining sleep quality are detected', () => {
      // Arrange
      const trainingPatterns = {
        preferredDays: [1, 2, 4, 5],
        preferredTimes: ['07:00', '18:00'],
        consistency: 0.8,
        volumeTrends: 'stable' as const,
        intensityTrends: 'stable' as const
      };
      
      const recoveryPatterns = {
        fatigueCycles: [],
        sleepQualityTrends: 'declining' as const,
        stressPatterns: [75, 80, 78]
      };
      
      const externalLifeAnalysis = {
        workImpact: 0.8,
        stressImpact: 0.6,
        scheduleConflicts: [],
        environmentalImpact: 0.3,
        availabilityImpact: 0.2
      };
      
      const context = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength', 'hypertrophy']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      } as ChatContext;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Act
      (predictiveEngine as any).enhancePatternRecognitionWithExternalVariables(
        trainingPatterns,
        recoveryPatterns,
        externalLifeAnalysis,
        context
      );
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        '🔍 Detected work-recovery imbalance: High work impact with declining sleep quality'
      );
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('generateWorkoutSuggestions with External Life Variables', () => {
    it('should generate workout suggestions based on external life variables', () => {
      // Arrange
      const context = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength', 'hypertrophy']
        },
        userHabits: [{
          id: 'habit-1',
          userId: 'test-user',
          preferredTrainingTimes: ['07:00', '18:00'],
          trainingFrequency: 4,
          lastTrainingSessions: [],
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 2, 4, 5],
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['chicken', 'rice'],
          dislikedFoods: ['broccoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [],
        progressionPlans: []
      } as ChatContext;
      
      const externalLifeVariables: ExternalLifeVariables = {
        workSchedule: {
          startTime: '09:00',
          endTime: '17:00',
          workDays: [2], // Tuesday
          workIntensity: 'high'
        },
        personalSchedule: {
          busyTimes: [],
          importantEvents: []
        },
        travelSchedule: {
          trips: []
        },
        environment: {
          currentLocation: 'Madrid, Spain',
          weatherConditions: {
            temperature: 35,
            humidity: 40,
            precipitation: 0,
            airQuality: 60
          },
          seasonalFactors: 'summer'
        },
        lifestyleFactors: {
          stressLevel: 9,
          sleepQuality: 4,
          socialActivities: 5,
          personalProjects: 6
        },
        availability: {
          preferredWorkoutWindows: [{
            startTime: '07:00',
            endTime: '08:00',
            days: [1, 2, 4, 5]
          }],
          flexibility: 2,
          recoveryPriority: 9
        }
      };
      
      context.externalLifeVariables = externalLifeVariables;
      
      const userPatterns = {
        trainingPatterns: {
          preferredDays: [1, 2, 4, 5],
          preferredTimes: ['07:00', '18:00'],
          consistency: 0.7,
          volumeTrends: 'stable',
          intensityTrends: 'stable'
        },
        recoveryPatterns: {
          fatigueCycles: [],
          sleepQualityTrends: 'stable',
          stressPatterns: []
        },
        nutritionPatterns: {
          mealTiming: ['08:00', '13:00', '19:00'],
          adherenceTrends: 'stable',
          macroPreferences: {
            protein: 30,
            carbs: 40,
            fats: 30
          }
        },
        performancePatterns: {
          strengthTrends: {},
          plateauIndicators: [],
          adaptationWindows: []
        }
      };
      
      // Mock current time to be during work hours on Tuesday
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => new Date('2023-06-13T10:30:00').valueOf());
      
      // Act
      const suggestions = (predictiveEngine as any).generateWorkoutSuggestions(context, userPatterns, {});
      
      // Assert
      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);
      
      // Check for work conflict suggestion
      const workConflictSuggestion = suggestions.find(
        s => s.title === 'Conflicto de horario laboral detectado'
      );
      expect(workConflictSuggestion).toBeDefined();
      
      // Check for high stress suggestion
      const highStressSuggestion = suggestions.find(
        s => s.title === 'Nivel de estrés elevado detectado'
      );
      expect(highStressSuggestion).toBeDefined();
      
      // Check for weather suggestion
      const weatherSuggestion = suggestions.find(
        s => s.title === 'Condiciones climáticas adversas'
      );
      expect(weatherSuggestion).toBeDefined();
    });
  });
  
  describe('analyzeExternalLifeVariablesImpact', () => {
    it('should analyze external life variables impact on long-term plans', () => {
      // Arrange
      const context = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength', 'hypertrophy']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      } as ChatContext;
      
      const externalLifeVariables: ExternalLifeVariables = {
        workSchedule: {
          startTime: '09:00',
          endTime: '17:00',
          workDays: [1, 2, 3, 4, 5, 6], // 6 days a week
          workIntensity: 'high'
        },
        personalSchedule: {
          busyTimes: [],
          importantEvents: []
        },
        travelSchedule: {
          trips: [{
            startDate: new Date(Date.now() + 86400000),
            endDate: new Date(Date.now() + 172800000),
            destination: 'Barcelona',
            travelStress: 'high'
          }]
        },
        environment: {
          currentLocation: 'Madrid, Spain',
          weatherConditions: {
            temperature: 25,
            humidity: 60,
            precipitation: 10,
            airQuality: 70
          },
          seasonalFactors: 'summer'
        },
        lifestyleFactors: {
          stressLevel: 8,
          sleepQuality: 5,
          socialActivities: 7,
          personalProjects: 5
        },
        availability: {
          preferredWorkoutWindows: [{
            startTime: '07:00',
            endTime: '08:00',
            days: [1, 2, 4, 5]
          }],
          flexibility: 2,
          recoveryPriority: 8
        }
      };
      
      context.externalLifeVariables = externalLifeVariables;
      
      const plan = {
        id: 'test-plan',
        userId: 'test-user',
        name: 'Test Plan',
        description: 'Test plan for testing',
        durationMonths: 12,
        startDate: new Date(),
        endDate: new Date(Date.now() + 31536000000), // 1 year from now
        primaryFocus: 'strength' as const,
        secondaryFocuses: ['hypertrophy' as const],
        currentPhase: null,
        phases: [],
        variations: [],
        progressTracking: [],
        adaptations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = (predictiveEngine as any).analyzeExternalLifeVariablesImpact(context, plan);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.impactScore).toBeGreaterThan(0);
      expect(result.recommendations).toHaveLength(4); // work, stress, travel, flexibility
      
      // Check for work schedule recommendation
      const workRec = result.recommendations.find((r: any) => r.type === 'work_schedule');
      expect(workRec).toBeDefined();
      expect(workRec.trigger).toBe('high_workload');
      
      // Check for stress management recommendation
      const stressRec = result.recommendations.find((r: any) => r.type === 'stress_management');
      expect(stressRec).toBeDefined();
      expect(stressRec.trigger).toBe('high_stress');
      
      // Check for travel preparation recommendation
      const travelRec = result.recommendations.find((r: any) => r.type === 'travel_preparation');
      expect(travelRec).toBeDefined();
      expect(travelRec.trigger).toBe('upcoming_travel');
      
      // Check for schedule flexibility recommendation
      const flexibilityRec = result.recommendations.find((r: any) => r.type === 'schedule_flexibility');
      expect(flexibilityRec).toBeDefined();
      expect(flexibilityRec.trigger).toBe('low_flexibility');
    });
  });
});