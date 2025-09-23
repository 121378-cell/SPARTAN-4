import { ChatMaestroPredictiveEngine } from '../lib/chat-maestro-predictive-engine';
import { ChatMaestroService } from '../lib/chat-maestro-service';
import { ChatContext } from '../lib/chat-maestro-service';
import { storageManager } from '../lib/storage';
import { LongTermStrategicPlan, StrategicFocusArea, PlanAdjustmentRecommendation } from '../lib/chat-maestro-strategic-planning-types';

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

describe('ChatMaestro Long-Term Strategic Planning', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;
  let chatService: ChatMaestroService;
  
  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
    chatService = ChatMaestroService.getInstance();
    
    // Mock storage methods
    (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([]);
    (storageManager.getDailyNutrition as jest.Mock).mockReturnValue([]);
    (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([]);
  });
  
  describe('generateLongTermStrategicPlan', () => {
    it('should generate a 6-month strategic plan focused on hypertrophy', async () => {
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
          averageTrainingDuration: 60,
          preferredTrainingDays: [1, 2, 4, 5], // Monday, Tuesday, Thursday, Friday
          preferredMealTimes: ['08:00', '13:00', '19:00'],
          preferredFoods: ['pollo', 'arroz', 'verduras'],
          dislikedFoods: ['brócoli'],
          dietaryRestrictions: [],
          nutritionGoals: ['muscle_mass']
        }],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const strategicPlan = await chatService.generateLongTermStrategicPlan(context, 6);
      
      expect(strategicPlan).toBeDefined();
      expect(strategicPlan.durationMonths).toBe(6);
      expect(strategicPlan.primaryFocus).toBe('hypertrophy');
      expect(strategicPlan.secondaryFocuses).toContain('strength');
      expect(strategicPlan.phases.length).toBeGreaterThan(0);
      expect(strategicPlan.variations.length).toBeGreaterThan(0);
      expect(strategicPlan.name).toContain('6 meses');
    });
    
    it('should generate a 12-month strategic plan focused on strength', async () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Aumentar fuerza máxima']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const strategicPlan = await chatService.generateLongTermStrategicPlan(context, 12);
      
      expect(strategicPlan).toBeDefined();
      expect(strategicPlan.durationMonths).toBe(12);
      expect(strategicPlan.primaryFocus).toBe('strength');
      expect(strategicPlan.name).toContain('12 meses');
      expect(strategicPlan.phases.length).toBeGreaterThan(2); // Should have at least 3 phases for 12 months
    });
    
    it('should generate a 24-month strategic plan focused on endurance', async () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['Mejorar resistencia cardiovascular']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };
      
      const strategicPlan = await chatService.generateLongTermStrategicPlan(context, 24);
      
      expect(strategicPlan).toBeDefined();
      expect(strategicPlan.durationMonths).toBe(24);
      expect(strategicPlan.primaryFocus).toBe('endurance');
      expect(strategicPlan.name).toContain('24 meses');
      expect(strategicPlan.phases.length).toBeGreaterThan(3); // Should have at least 4 phases for 24 months
    });
  });
  
  describe('analyzeLongTermPlanProgress', () => {
    it('should analyze progress for a strategic plan and generate recommendations', async () => {
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
      
      const strategicPlan: LongTermStrategicPlan = {
        id: 'test-plan-1',
        userId: 'test-user',
        name: 'Plan estratégico a 6 meses',
        description: 'Plan estratégico personalizado de 6 meses enfocado en hypertrophy',
        durationMonths: 6,
        startDate: new Date(),
        endDate: new Date(),
        primaryFocus: 'hypertrophy',
        secondaryFocuses: ['strength'],
        currentPhase: {
          id: 'phase-1',
          planId: 'test-plan-1',
          phase: 'accumulation',
          name: 'Fase de Acumulación',
          description: 'Construcción de volumen y capacidad de trabajo',
          startDate: new Date(),
          endDate: new Date(),
          objectives: ['Construir base de fuerza y resistencia'],
          keyMetrics: ['Volumen total', 'Frecuencia semanal'],
          expectedOutcomes: ['Mejora en resistencia muscular'],
          durationWeeks: 4
        },
        phases: [],
        variations: [],
        progressTracking: [],
        adaptations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const recommendations = await chatService.analyzeLongTermPlanProgress(context, strategicPlan);
      
      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });
  
  describe('autoAdjustLongTermPlan', () => {
    it('should automatically adjust a strategic plan based on user progress', async () => {
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
      
      const strategicPlan: LongTermStrategicPlan = {
        id: 'test-plan-1',
        userId: 'test-user',
        name: 'Plan estratégico a 6 meses',
        description: 'Plan estratégico personalizado de 6 meses enfocado en hypertrophy',
        durationMonths: 6,
        startDate: new Date(),
        endDate: new Date(),
        primaryFocus: 'hypertrophy',
        secondaryFocuses: ['strength'],
        currentPhase: {
          id: 'phase-1',
          planId: 'test-plan-1',
          phase: 'accumulation',
          name: 'Fase de Acumulación',
          description: 'Construcción de volumen y capacidad de trabajo',
          startDate: new Date(),
          endDate: new Date(),
          objectives: ['Construir base de fuerza y resistencia'],
          keyMetrics: ['Volumen total', 'Frecuencia semanal'],
          expectedOutcomes: ['Mejora en resistencia muscular'],
          durationWeeks: 4
        },
        phases: [],
        variations: [],
        progressTracking: [],
        adaptations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const adjustedPlan = await chatService.autoAdjustLongTermPlan(strategicPlan, context);
      
      expect(adjustedPlan).toBeDefined();
      expect(adjustedPlan.id).toBe(strategicPlan.id);
      expect(adjustedPlan.updatedAt).not.toEqual(strategicPlan.updatedAt);
    });
  });
  
  describe('Long-term Plan Generation with Real Data', () => {
    it('should generate plans with appropriate phases based on duration', () => {
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
      
      // Test 6-month plan
      const plan6Months = predictiveEngine.generateLongTermStrategicPlan(context, 6);
      expect(plan6Months.phases.length).toBe(3); // Should have 3 phases for 6 months
      
      // Test 12-month plan
      const plan12Months = predictiveEngine.generateLongTermStrategicPlan(context, 12);
      expect(plan12Months.phases.length).toBe(4); // Should have 4 phases for 12 months
      
      // Test 24-month plan
      const plan24Months = predictiveEngine.generateLongTermStrategicPlan(context, 24);
      expect(plan24Months.phases.length).toBe(5); // Should have 5 phases for 24 months
    });
    
    it('should generate appropriate strategic variations based on focus area', () => {
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
      
      const strategicPlan = predictiveEngine.generateLongTermStrategicPlan(context, 12);
      
      // Should have variations for primary and secondary focuses
      expect(strategicPlan.variations.length).toBeGreaterThanOrEqual(2);
      
      // Should have a variation for hypertrophy (primary focus)
      const hypertrophyVariation = strategicPlan.variations.find(v => v.focusArea === 'hypertrophy');
      expect(hypertrophyVariation).toBeDefined();
      expect(hypertrophyVariation?.volumeProfile).toBe('high');
      expect(hypertrophyVariation?.intensityProfile).toBe('moderate');
      expect(hypertrophyVariation?.frequencyProfile).toBe('high');
      
      // Should have a variation for strength (secondary focus)
      const strengthVariation = strategicPlan.variations.find(v => v.focusArea === 'strength');
      expect(strengthVariation).toBeDefined();
      expect(strengthVariation?.volumeProfile).toBe('moderate');
      expect(strengthVariation?.intensityProfile).toBe('high');
    });
  });
  
  describe('Physical Evolution Analysis', () => {
    it('should analyze physical evolution based on user data', () => {
      // Mock recovery analyses with real data
      (storageManager.getRecoveryAnalyses as jest.Mock).mockReturnValue([
        { date: new Date(), recoveryScore: 80, fatigueLevel: 'moderate' },
        { date: new Date(), recoveryScore: 75, fatigueLevel: 'moderate' },
        { date: new Date(), recoveryScore: 85, fatigueLevel: 'low' }
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
          goals: ['Ganar masa muscular']
        },
        userHabits: [],
        recentWorkouts: [
          {
            id: 'workout-1',
            workoutPlanId: 'plan-1',
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            duration: 60,
            exercises: [
              {
                exerciseId: 'exercise-1',
                name: 'Press de banca',
                sets: [
                  { setNumber: 1, weight: 80, reps: 8, rpe: 7, tempo: '3-1-2', rest: 90, notes: '' },
                  { setNumber: 2, weight: 80, reps: 8, rpe: 8, tempo: '3-1-2', rest: 90, notes: '' },
                  { setNumber: 3, weight: 80, reps: 8, rpe: 9, tempo: '3-1-2', rest: 90, notes: '' }
                ]
              }
            ],
            notes: ''
          }
        ],
        progressionPlans: []
      };
      
      // Test that physical evolution analysis works with real data
      const physicalEvolution = (predictiveEngine as any).analyzePhysicalEvolution(context);
      
      expect(physicalEvolution).toBeDefined();
      expect(physicalEvolution.userId).toBe('test-user');
      expect(physicalEvolution.measurements.weight).toBe(75);
      expect(physicalEvolution.performanceMetrics).toBeDefined();
      expect(physicalEvolution.healthMarkers).toBeDefined();
    });
  });
  
  describe('Plan Adjustment Recommendations', () => {
    it('should generate phase change recommendations when appropriate', () => {
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
      
      const strategicPlan: LongTermStrategicPlan = {
        id: 'test-plan-1',
        userId: 'test-user',
        name: 'Plan estratégico a 6 meses',
        description: 'Plan estratégico personalizado de 6 meses enfocado en hypertrophy',
        durationMonths: 6,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), // 150 days from start
        primaryFocus: 'hypertrophy',
        secondaryFocuses: ['strength'],
        currentPhase: {
          id: 'phase-1',
          planId: 'test-plan-1',
          phase: 'accumulation',
          name: 'Fase de Acumulación',
          description: 'Construcción de volumen y capacidad de trabajo',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          endDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago (phase should be over)
          objectives: ['Construir base de fuerza y resistencia'],
          keyMetrics: ['Volumen total', 'Frecuencia semanal'],
          expectedOutcomes: ['Mejora en resistencia muscular'],
          durationWeeks: 4
        },
        phases: [],
        variations: [],
        progressTracking: [],
        adaptations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const recommendations = predictiveEngine.analyzeLongTermPlanProgress(context, strategicPlan);
      
      // Should have at least one recommendation
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Should have a phase change recommendation since the current phase is over
      const phaseChangeRec = recommendations.find((rec: PlanAdjustmentRecommendation) => rec.type === 'phase_change');
      expect(phaseChangeRec).toBeDefined();
    });
  });
});