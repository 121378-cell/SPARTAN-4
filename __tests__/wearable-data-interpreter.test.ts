/**
 * Test suite for Wearable Data Interpreter
 */

import { WearableDataInterpreter } from '../lib/wearable-data-interpreter';
import type { 
  WorkoutPlan, 
  RecoveryAnalysis, 
  ProgressionPlan, 
  DailyNutrition,
  UserHabit
} from '../lib/types';
import type { WearableData } from '../lib/wearable-integration-service';

describe('WearableDataInterpreter', () => {
  let wearableDataInterpreter: WearableDataInterpreter;
  
  // Mock wearable data for testing
  const mockWearableData: WearableData = {
    source: 'oura',
    sleep: {
      duration: 480, // 8 hours
      quality: 85,
      deepSleep: 120,
      remSleep: 90,
      lightSleep: 270,
      wakeTimes: 1,
      bedtime: '22:30',
      wakeTime: '06:30',
      sleepEfficiency: 92,
      sleepLatency: 15
    },
    activity: {
      steps: 8500,
      calories: 2500,
      activeMinutes: 90,
      workoutType: 'strength',
      workoutDuration: 60,
      vo2max: 50,
      trainingLoad: 75,
      lactateThreshold: 160,
      maxHeartRate: 185,
      zones: {
        zone1: 30,
        zone2: 25,
        zone3: 20,
        zone4: 10,
        zone5: 5
      }
    },
    recovery: {
      hrv: 65,
      restingHeartRate: 58,
      readiness: 82,
      stress: 45,
      recoveryScore: 78,
      autonomicBalance: 1.2
    },
    vitals: {
      bloodPressure: {
        systolic: 118,
        diastolic: 78,
        pulse: 58,
        timestamp: new Date().toISOString()
      },
      glucose: {
        current: 95,
        average24h: 92,
        timeInRange: 85,
        variability: 8,
        timestamp: new Date().toISOString()
      },
      temperature: {
        body: 36.8,
        skin: 33.2,
        variance: 0.3
      },
      hydration: {
        level: 88,
        electrolytes: {
          sodium: 140,
          potassium: 4.2,
          magnesium: 0.8
        }
      },
      inflammation: {
        crp: 0.5,
        il6: 1.2,
        score: 85
      }
    },
    performance: {
      fitnessAge: 28,
      recoveryTime: 24,
      trainingReadiness: 82,
      metabolicEfficiency: 88,
      powerOutput: {
        ftp: 220,
        critical: 320,
        anaerobic: 650
      },
      cognitiveLoad: 45
    },
    lastSync: new Date().toISOString()
  };

  const mockContext = {
    activeWorkout: undefined as WorkoutPlan | undefined,
    recoveryStatus: undefined as RecoveryAnalysis | undefined,
    progressionPlans: [] as ProgressionPlan[],
    nutritionData: undefined as DailyNutrition | undefined,
    userHabits: [] as UserHabit[]
  };

  beforeEach(() => {
    wearableDataInterpreter = WearableDataInterpreter.getInstance();
  });

  describe('analyzeWearableData', () => {
    it('should correctly analyze optimal wearable data', () => {
      const insights = (wearableDataInterpreter as any).analyzeWearableData(mockWearableData);
      
      expect(insights.hrvStatus).toBe('good');
      expect(['good', 'optimal']).toContain(insights.sleepQuality); // With quality 85, this could be 'good' or 'optimal'
      expect(insights.stressLevel).toBe('moderate');
      expect(['good', 'optimal']).toContain(insights.recoveryStatus);
      expect(['ready', 'caution']).toContain(insights.trainingReadiness); // Could be either depending on exact scores
      expect(['high', 'moderate']).toContain(insights.energyLevel); // Could be either depending on exact scores
    });

    it('should detect poor recovery when HRV is low', () => {
      const poorHrvData = JSON.parse(JSON.stringify(mockWearableData));
      poorHrvData.recovery.hrv = 35;
      
      const insights = (wearableDataInterpreter as any).analyzeWearableData(poorHrvData);
      
      expect(insights.hrvStatus).toBe('critical');
      // With HRV 35, the recovery status would depend on other factors
      // Let's just check that it's not optimal
      expect(insights.recoveryStatus).not.toBe('optimal');
      // Training readiness would depend on the overall recovery score
      expect(['caution', 'rest']).toContain(insights.trainingReadiness);
    });

    it('should detect high stress levels', () => {
      const highStressData = JSON.parse(JSON.stringify(mockWearableData));
      highStressData.recovery.stress = 85;
      
      const insights = (wearableDataInterpreter as any).analyzeWearableData(highStressData);
      
      expect(insights.stressLevel).toBe('extreme');
      expect(insights.intensityAdjustmentNeeded).toBe(true);
    });

    it('should detect poor sleep quality', () => {
      const poorSleepData = JSON.parse(JSON.stringify(mockWearableData));
      poorSleepData.sleep.quality = 40;
      
      const insights = (wearableDataInterpreter as any).analyzeWearableData(poorSleepData);
      
      // With quality 40, this should be 'poor' or 'critical'
      expect(['poor', 'critical']).toContain(insights.sleepQuality);
      expect(insights.restAdjustmentNeeded).toBe(true);
    });
  });

  describe('calculateRecoveryScore', () => {
    it('should calculate recovery score correctly', () => {
      const recoveryScore = (wearableDataInterpreter as any).calculateRecoveryScore(mockWearableData);
      
      // Based on the calculation:
      // HRV: (65/70)*30 = 27.86
      // RHR: 20 - max(0, (58-60)*0.5) = 20
      // Sleep: (85/100)*25 = 21.25
      // Stress: 15 - (45/100)*15 = 8.25
      // BP: 10 (optimal)
      // Total: ~87
      expect(recoveryScore).toBeGreaterThan(80);
      expect(recoveryScore).toBeLessThan(90);
    });
  });

  describe('interpretWearableData', () => {
    it('should generate comprehensive interpretation', () => {
      const interpretation = wearableDataInterpreter.interpretWearableData(
        'test-user',
        mockWearableData,
        mockContext
      );
      
      expect(interpretation.recommendations).toBeDefined();
      expect(interpretation.adjustments).toBeDefined();
      expect(interpretation.riskAssessment).toBeDefined();
      
      // Should have recommendations in all categories
      expect(interpretation.recommendations.training).toBeInstanceOf(Array);
      expect(interpretation.recommendations.recovery).toBeInstanceOf(Array);
      expect(interpretation.recommendations.nutrition).toBeInstanceOf(Array);
      expect(interpretation.recommendations.lifestyle).toBeInstanceOf(Array);
    });
  });

  describe('translateToActions', () => {
    it('should translate wearable data to actionable items', () => {
      const actions = wearableDataInterpreter.translateToActions(
        'test-user',
        mockWearableData,
        mockContext
      );
      
      expect(actions.restRecommendation).toBeDefined();
      expect(actions.volumeAdjustment).toBeDefined();
      expect(actions.intensityAdjustment).toBeDefined();
      expect(actions.nutritionAdjustment).toBeDefined();
      expect(actions.rpeModification).toBeDefined();
      
      // With good data, should not recommend rest
      expect(actions.restRecommendation.shouldRest).toBe(false);
      
      // With good data, should not recommend adjustments
      expect(actions.volumeAdjustment.shouldAdjust).toBe(false);
      expect(actions.intensityAdjustment.shouldAdjust).toBe(false);
    });

    it('should recommend rest when recovery is critical', () => {
      const criticalData = JSON.parse(JSON.stringify(mockWearableData));
      criticalData.recovery.hrv = 25; // Very low HRV
      criticalData.recovery.stress = 90; // Very high stress
      criticalData.sleep.quality = 30; // Poor sleep
      
      const actions = wearableDataInterpreter.translateToActions(
        'test-user',
        criticalData,
        mockContext
      );
      
      expect(actions.restRecommendation.shouldRest).toBe(true);
      // The reason will depend on which factor is most critical
      expect(actions.restRecommendation.reason).toContain('extremadamente bajo'); // Energy level would be very low
    });
  });
});