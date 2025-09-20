import { AdvancedPlanDesignEngine } from '../modals/plan-design-engine';
import { AdvancedPlanDesignService } from '../modals/plan-design-service';
import {
  PlanConfiguration,
  PlanObjective,
  UserPreferences,
  UserBiometrics
} from '../modals/plan-design-types';

describe('AdvancedPlanDesignEngine', () => {
  let engine: AdvancedPlanDesignEngine;
  let mockObjective: PlanObjective;
  let mockPreferences: UserPreferences;
  let mockBiometrics: UserBiometrics;
  let mockConfiguration: PlanConfiguration;

  beforeEach(() => {
    engine = new AdvancedPlanDesignEngine();
    
    mockObjective = {
      id: 'strength_primary',
      name: 'Strength Development',
      description: 'Maximize muscular strength through progressive overload',
      primaryFocus: 'strength',
      secondaryFocuses: ['hypertrophy'],
      recommendedDuration: [8, 12, 16],
      intensityProfile: 'high'
    };

    mockPreferences = {
      equipment: ['barbell', 'dumbbells', 'bench'],
      timeAvailability: {
        weekdays: [7, 8, 12, 18, 19],
        weekends: [9, 10, 11, 15, 16]
      },
      trainingFrequency: 4,
      preferredTrainingTimes: ['evening'],
      recoveryPriority: 'moderate',
      nutritionPreferences: ['high_protein']
    };

    mockBiometrics = {
      age: 28,
      gender: 'male',
      height: 175,
      weight: 75,
      bodyFatPercentage: 15,
      fitnessLevel: 'intermediate',
      trainingExperience: 3,
      injuryHistory: []
    };

    mockConfiguration = {
      objective: mockObjective,
      duration: 12,
      startDate: new Date('2024-02-01'),
      userPreferences: mockPreferences,
      userBiometrics: mockBiometrics,
      integrationSettings: {
        calendarSync: true,
        smartCardSync: true,
        chatMaestroSync: true,
        wearableSync: true
      }
    };
  });

  describe('Plan Generation', () => {
    it('should generate a plan with valid configuration', () => {
      const result = engine.generatePlan(mockConfiguration);
      
      expect(result.success).toBe(true);
      expect(result.plan).toBeDefined();
      expect(result.tacticalCalendar).toBeDefined();
      expect(result.smartCards).toBeDefined();
      
      if (result.plan) {
        expect(result.plan.name).toContain('Strength Development Plan');
        expect(result.plan.configuration.duration).toBe(12);
      }
    });

    it('should fail with invalid configuration', () => {
      const invalidConfig = { ...mockConfiguration, duration: 999 };
      const result = engine.generatePlan(invalidConfig as any);
      
      expect(result.success).toBe(false);
    });

    it('should create appropriate training blocks', () => {
      const result = engine.generatePlan(mockConfiguration);
      
      expect(result.success).toBe(true);
      if (result.plan) {
        expect(result.plan.blocks.length).toBe(4); // Four-block periodization for 12-week plan
        
        // Check block structure
        const block1 = result.plan.blocks[0];
        expect(block1.name).toBe('Accumulation Phase');
        expect(block1.focus).toBe('accumulation');
        
        const block2 = result.plan.blocks[1];
        expect(block2.name).toBe('Intensification Phase');
        expect(block2.focus).toBe('intensification');
      }
    });

    it('should create tactical calendar', () => {
      const result = engine.generatePlan(mockConfiguration);
      
      expect(result.success).toBe(true);
      if (result.tacticalCalendar) {
        expect(result.tacticalCalendar.weeks.length).toBe(12);
        expect(result.tacticalCalendar.startDate).toEqual(new Date('2024-02-01'));
      }
    });

    it('should create smart cards', () => {
      const result = engine.generatePlan(mockConfiguration);
      
      expect(result.success).toBe(true);
      if (result.smartCards) {
        expect(result.smartCards.length).toBeGreaterThan(0);
        
        const firstCard = result.smartCards[0];
        expect(firstCard.exerciseName).toBeDefined();
        expect(firstCard.instructions.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Configuration Validation', () => {
    it('should validate user age', () => {
      const configWithInvalidAge = { 
        ...mockConfiguration, 
        userBiometrics: { ...mockBiometrics, age: 10 } 
      };
      
      const result = engine.generatePlan(configWithInvalidAge);
      expect(result.success).toBe(false);
    });

    it('should validate training frequency', () => {
      const configWithInvalidFrequency = { 
        ...mockConfiguration, 
        userPreferences: { ...mockPreferences, trainingFrequency: 0 } 
      };
      
      const result = engine.generatePlan(configWithInvalidFrequency);
      expect(result.success).toBe(false);
    });
  });
});

describe('AdvancedPlanDesignService', () => {
  let service: AdvancedPlanDesignService;
  let mockConfiguration: PlanConfiguration;

  beforeEach(() => {
    service = new AdvancedPlanDesignService();
    
    const mockObjective: PlanObjective = {
      id: 'strength_primary',
      name: 'Strength Development',
      description: 'Maximize muscular strength through progressive overload',
      primaryFocus: 'strength',
      secondaryFocuses: ['hypertrophy'],
      recommendedDuration: [8, 12, 16],
      intensityProfile: 'high'
    };

    const mockPreferences: UserPreferences = {
      equipment: ['barbell', 'dumbbells', 'bench'],
      timeAvailability: {
        weekdays: [7, 8, 12, 18, 19],
        weekends: [9, 10, 11, 15, 16]
      },
      trainingFrequency: 4,
      preferredTrainingTimes: ['evening'],
      recoveryPriority: 'moderate',
      nutritionPreferences: ['high_protein']
    };

    const mockBiometrics: UserBiometrics = {
      age: 28,
      gender: 'male',
      height: 175,
      weight: 75,
      bodyFatPercentage: 15,
      fitnessLevel: 'intermediate',
      trainingExperience: 3,
      injuryHistory: []
    };

    mockConfiguration = {
      objective: mockObjective,
      duration: 12,
      startDate: new Date('2024-02-01'),
      userPreferences: mockPreferences,
      userBiometrics: mockBiometrics,
      integrationSettings: {
        calendarSync: true,
        smartCardSync: true,
        chatMaestroSync: true,
        wearableSync: true
      }
    };
  });

  describe('Plan Generation Service', () => {
    it('should generate a plan through the service', () => {
      const result = service.generatePlan(mockConfiguration);
      
      expect(result.success).toBe(true);
      expect(result.plan).toBeDefined();
    });

    it('should handle disabled service', () => {
      service.setModalEnabled(false);
      const result = service.generatePlan(mockConfiguration);
      
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Plan design modal is not enabled');
    });
  });

  describe('Analytics and Feedback', () => {
    it('should provide plan analytics', () => {
      const analytics = service.getPlanAnalytics('test_plan_id');
      
      expect(analytics).toBeDefined();
      expect(analytics.planId).toBe('test_plan_id');
      expect(analytics.adherenceRate).toBeGreaterThan(0);
    });

    it('should record user feedback', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      service.recordUserFeedback('test_plan_id', 5, 'Excellent plan!');
      
      expect(consoleSpy).toHaveBeenCalledWith('User feedback recorded for plan test_plan_id: 5/5 - Excellent plan!');
      
      consoleSpy.mockRestore();
    });
  });
});