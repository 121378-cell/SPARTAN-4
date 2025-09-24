import { describe, it, expect, beforeEach } from 'vitest';
import { dailyNutritionAdjuster } from '../lib/daily-nutrition-adjuster';
import { nutritionService } from '../lib/nutrition-service';
import { storageManager } from '../lib/storage';
import type { WorkoutSession } from '../lib/types';
import type { WearableData } from '../lib/wearable-integration-service';

// Mock data for testing
const userId = 'test-user-123';
const testDate = new Date('2025-09-24');

// Mock workout session
const mockWorkoutSession: WorkoutSession = {
  id: 'workout-123',
  workoutPlanId: 'plan-123',
  date: testDate,
  startTime: new Date('2025-09-24T08:00:00'),
  endTime: new Date('2025-09-24T09:30:00'),
  duration: 90,
  exercises: [
    {
      exerciseId: 'bench-press',
      name: 'Bench Press',
      sets: [
        { setNumber: 1, weight: 60, reps: 10, rpe: 7, tempo: '2-1-1', rest: 90, notes: '' },
        { setNumber: 2, weight: 65, reps: 8, rpe: 8, tempo: '2-1-1', rest: 90, notes: '' },
        { setNumber: 3, weight: 70, reps: 6, rpe: 9, tempo: '2-1-1', rest: 120, notes: '' }
      ]
    },
    {
      exerciseId: 'squat',
      name: 'Back Squat',
      sets: [
        { setNumber: 1, weight: 80, reps: 10, rpe: 7, tempo: '3-1-1', rest: 120, notes: '' },
        { setNumber: 2, weight: 90, reps: 8, rpe: 8, tempo: '3-1-1', rest: 120, notes: '' },
        { setNumber: 3, weight: 100, reps: 6, rpe: 9, tempo: '3-1-1', rest: 150, notes: '' }
      ]
    }
  ],
  notes: 'strength training'
};

// Mock wearable data
const mockWearableData: WearableData = {
  source: 'whoop',
  sleep: {
    duration: 480,
    quality: 85,
    deepSleep: 90,
    remSleep: 120,
    lightSleep: 240,
    wakeTimes: 2,
    bedtime: '22:00',
    wakeTime: '06:00',
    sleepEfficiency: 92,
    sleepLatency: 15,
  },
  activity: {
    steps: 8000,
    calories: 2800,
    activeMinutes: 60,
    vo2max: 45,
    trainingLoad: 75,
    lactateThreshold: 160,
    maxHeartRate: 190,
    zones: {
      zone1: 20,
      zone2: 30,
      zone3: 40,
      zone4: 20,
      zone5: 10
    }
  },
  recovery: {
    hrv: 65,
    restingHeartRate: 60,
    stress: 45,
    recoveryScore: 80,
    autonomicBalance: 1.2
  },
  vitals: {
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      pulse: 60,
      timestamp: '2025-09-24T06:00:00'
    },
    glucose: {
      current: 95,
      average24h: 98,
      timeInRange: 88,
      variability: 12,
      timestamp: '2025-09-24T06:00:00'
    },
    temperature: {
      body: 36.6,
      skin: 35.2,
      variance: 0.3
    },
    hydration: {
      level: 85,
      electrolytes: {
        sodium: 142,
        potassium: 4.2,
        magnesium: 2.0
      }
    },
    inflammation: {
      crp: 1.5,
      il6: 1.8,
      score: 35
    }
  },
  performance: {
    fitnessAge: 30,
    recoveryTime: 24,
    trainingReadiness: 85,
    metabolicEfficiency: 75,
    powerOutput: {
      ftp: 280,
      critical: 320,
      anaerobic: 550
    },
    cognitiveLoad: 40
  },
  lastSync: '2025-09-24T06:30:00'
};

describe('Nutrition Synchronization System', () => {
  beforeEach(() => {
    // Clear storage before each test
    storageManager.clearAllData();
    
    // Initialize user habits and data
    const habit = nutritionService.initializeUserNutritionProfile(userId);
    habit.nutritionGoals = ['muscle_mass'];
    
    // Set user data
    storageManager.setUserData({
      name: 'Test User',
      age: 30,
      weight: 75,
      height: 175,
      fitnessLevel: 'advanced',
      goals: ['muscle_mass']
    });
    
    // Add workout session
    storageManager.addWorkoutSession(mockWorkoutSession);
  });

  it('should create initial nutrition plan based on user goals', () => {
    const nutritionData = nutritionService.getNutritionRecommendations(userId, testDate);
    
    expect(nutritionData).toBeDefined();
    expect(nutritionData.date.toDateString()).toBe(testDate.toDateString());
    expect(nutritionData.nutritionGoal).toBe('muscle_mass');
    expect(nutritionData.totalNutrients.calories).toBeGreaterThan(2500);
    expect(nutritionData.totalNutrients.protein).toBeGreaterThan(150);
    expect(nutritionData.meals).toHaveLength(5); // breakfast, lunch, dinner, pre-workout, post-workout
    
    // Check that pre and post workout meals are included
    const preWorkoutMeal = nutritionData.meals.find(m => m.type === 'pre_workout');
    const postWorkoutMeal = nutritionData.meals.find(m => m.type === 'post_workout');
    
    expect(preWorkoutMeal).toBeDefined();
    expect(postWorkoutMeal).toBeDefined();
  });

  it('should synchronize nutrition with workout performance', () => {
    const adjustedNutrition = dailyNutritionAdjuster.processDailyAdjustments(
      userId,
      testDate,
      mockWorkoutSession,
      mockWearableData
    );
    
    expect(adjustedNutrition).toBeDefined();
    expect(adjustedNutrition.date.toDateString()).toBe(testDate.toDateString());
    
    // Verify that macros have been adjusted based on workout and biometrics
    const originalNutrition = nutritionService.calculateDailyNutritionNeeds(userId, testDate);
    
    // With muscle mass goal and strength training, protein should be high
    expect(adjustedNutrition.totalNutrients.protein).toBeGreaterThan(
      originalNutrition.totalNutrients.protein * 1.1
    );
    
    // With good recovery (HRV 65) and strength training, carbs should be increased
    expect(adjustedNutrition.totalNutrients.carbs).toBeGreaterThan(
      originalNutrition.totalNutrients.carbs * 1.1
    );
    
    // Check that supplement recommendations were added
    const postWorkoutMeal = adjustedNutrition.meals.find(m => m.type === 'post_workout');
    expect(postWorkoutMeal).toBeDefined();
    if (postWorkoutMeal) {
      expect(postWorkoutMeal.ingredients).toContain('Creatina monohidratada (5g)');
    }
    
    const preWorkoutMeal = adjustedNutrition.meals.find(m => m.type === 'pre_workout');
    expect(preWorkoutMeal).toBeDefined();
    // No beta-alanine since volume is not extremely high
    if (preWorkoutMeal) {
      expect(preWorkoutMeal.ingredients).not.toContain('Beta-alanina (3g)');
    }
  });

  it('should adjust nutrition based on poor recovery metrics', () => {
    // Create wearable data with poor recovery
    const poorRecoveryData = { ...mockWearableData };
    poorRecoveryData.recovery.hrv = 40; // Low HRV
    poorRecoveryData.recovery.stress = 80; // High stress
    poorRecoveryData.sleep.quality = 50; // Poor sleep
    
    const adjustedNutrition = dailyNutritionAdjuster.processDailyAdjustments(
      userId,
      testDate,
      mockWorkoutSession,
      poorRecoveryData
    );
    
    expect(adjustedNutrition).toBeDefined();
    
    // With poor recovery, the system should prioritize protein for repair
    // but reduce overall intensity of recommendations
    expect(adjustedNutrition.totalNutrients.protein).toBeGreaterThan(
      adjustedNutrition.totalNutrients.carbs * 0.5
    );
    
    // Check that recovery-focused ingredients were added
    const dinner = adjustedNutrition.meals.find(m => m.type === 'dinner');
    expect(dinner).toBeDefined();
    if (dinner) {
      expect(dinner.ingredients).toContain('Omega-3');
      expect(dinner.ingredients).toContain('Cúrcuma');
    }
    
    const snack = adjustedNutrition.meals.find(m => m.type === 'snack');
    expect(snack).toBeDefined();
    if (snack) {
      expect(snack.ingredients).toContain('Proteína en polvo');
    }
  });

  it('should handle hydration needs for long workouts', () => {
    // Create a longer workout session
    const longWorkoutSession = { ...mockWorkoutSession };
    longWorkoutSession.duration = 120; // 2 hours
    
    const adjustedNutrition = dailyNutritionAdjuster.processDailyAdjustments(
      userId,
      testDate,
      longWorkoutSession,
      mockWearableData
    );
    
    expect(adjustedNutrition).toBeDefined();
    
    // Check that hydrating ingredients were added to relevant meals
    const preWorkoutMeal = adjustedNutrition.meals.find(m => m.type === 'pre_workout');
    const postWorkoutMeal = adjustedNutrition.meals.find(m => m.type === 'post_workout');
    const lunch = adjustedNutrition.meals.find(m => m.type === 'lunch');
    
    expect(preWorkoutMeal).toBeDefined();
    expect(postWorkoutMeal).toBeDefined();
    expect(lunch).toBeDefined();
    
    if (preWorkoutMeal) {
      expect(preWorkoutMeal.ingredients.some((ing: string) => 
        ing.includes('Agua') || ing.includes('coco') || ing.includes('Pepino'))
      ).toBe(true);
    }
    
    if (postWorkoutMeal) {
      expect(postWorkoutMeal.ingredients.some((ing: string) => 
        ing.includes('Agua') || ing.includes('coco') || ing.includes('Pepino'))
      ).toBe(true);
    }
    
    if (lunch) {
      expect(lunch.ingredients.some((ing: string) => 
        ing.includes('Agua') || ing.includes('coco') || ing.includes('Pepino'))
      ).toBe(true);
    }
  });

  it('should provide supplement recommendations based on biomarkers', () => {
    // Create wearable data indicating need for omega-3 and vitamin D
    const biomarkerData = { ...mockWearableData };
    biomarkerData.vitals.inflammation.score = 75; // High inflammation
    biomarkerData.performance.trainingReadiness = 60; // Low readiness
    biomarkerData.sleep.quality = 65; // Suboptimal sleep
    
    const adjustedNutrition = dailyNutritionAdjuster.processDailyAdjustments(
      userId,
      testDate,
      mockWorkoutSession,
      biomarkerData
    );
    
    expect(adjustedNutrition).toBeDefined();
    
    // Check that omega-3 was added for high inflammation
    const dinner = adjustedNutrition.meals.find(m => m.type === 'dinner');
    expect(dinner).toBeDefined();
    if (dinner) {
      expect(dinner.ingredients).toContain('Aceite de pescado (1000mg EPA/DHA)');
    }
    
    // Check that vitamin D was added for low readiness and suboptimal sleep
    const breakfast = adjustedNutrition.meals.find(m => m.type === 'breakfast');
    expect(breakfast).toBeDefined();
    if (breakfast) {
      expect(breakfast.ingredients).toContain('Vitamina D3 (2000-5000 UI)');
    }
    
    // Check that magnesium was added for suboptimal sleep
    const eveningSnack = adjustedNutrition.meals.find(m => 
      m.type === 'snack' && m.time > '18:00'
    );
    expect(eveningSnack).toBeDefined();
    if (eveningSnack) {
      expect(eveningSnack.ingredients).toContain('Magnesio (400mg)');
    }
  });
});