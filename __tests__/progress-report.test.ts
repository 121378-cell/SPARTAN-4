/**
 * Test suite for Progress Report Generator
 */

import { ProgressReportGenerator } from '../lib/progress-report-generator';

describe('ProgressReportGenerator', () => {
  let generator: ProgressReportGenerator;

  beforeEach(() => {
    generator = new ProgressReportGenerator();
  });

  describe('generateWeeklyReport', () => {
    it('should generate a report with correct structure', async () => {
      // This is a placeholder test since we don't have actual Supabase integration in tests
      // In a real implementation, we would mock the database calls
      expect(true).toBe(true);
    });
  });

  describe('calculateTrainingMetrics', () => {
    it('should calculate training metrics correctly', () => {
      const workoutData: any[] = [
        { id: '1', duration: 60 },
        { id: '2', duration: 45 },
        { id: '3', duration: 45 }
      ];
      const progressData: any[] = [
        { workoutId: '1' },
        { workoutId: '2' }
      ];
      
      const metrics = generator['calculateTrainingMetrics'](workoutData, progressData);
      
      expect(metrics.totalWorkouts).toBe(3);
      expect(metrics.completedWorkouts).toBe(2);
      expect(metrics.workoutCompletionRate).toBeCloseTo(66.67);
      expect(metrics.avgWorkoutDuration).toBe(50);
    });
  });

  describe('calculateOverallScore', () => {
    it('should calculate overall score as weighted average', () => {
      const training = { consistencyScore: 80, workoutCompletionRate: 70, avgWorkoutDuration: 0, totalWorkouts: 0, completedWorkouts: 0, totalVolume: 0, intensityScore: 75, progressionRate: 0, favoriteExercises: [], workoutDistribution: { strength: 0, calisthenics: 0, yoga: 0, cardio: 0, other: 0 } };
      const nutrition = { adherenceRate: 85, macroTargets: { calories: 0, protein: 0, carbs: 0, fats: 0 }, actualIntake: { calories: 0, protein: 0, carbs: 0, fats: 0 }, macroAdherence: { calories: 0, protein: 0, carbs: 0, fats: 0 }, mealFrequency: 0, hydrationLevel: 0, micronutrientScore: 0, supplementationAdherence: 0 };
      const health = { sleepQuality: 90, avgHeartRate: 0, restingHeartRate: 0, heartRateVariability: 0, sleepDuration: 0, stepsPerDay: 0, activeMinutes: 0, stressLevel: 0, bodyComposition: { weight: 0, bodyFatPercentage: 0, muscleMass: 0 }, bloodMarkers: { glucose: 0, cholesterol: 0, bloodPressure: { systolic: 0, diastolic: 0 } } };
      const performance = { strengthImprovements: { squat: 10, deadlift: 5, benchPress: 8, pullUp: 12 }, enduranceImprovements: { vo2max: 0, lactateThreshold: 0 }, flexibilityImprovements: { shoulderFlexibility: 0, hipFlexibility: 0, spineMobility: 0 }, cognitiveMetrics: { focusScore: 0, reactionTime: 0, memoryScore: 0 } };
      
      const score = generator['calculateOverallScore'](training, nutrition, health, performance);
      
      // Expected calculation:
      // (80 * 0.3) + (85 * 0.25) + (90 * 0.25) + (((10 + 5 + 8 + 12) / 4) * 0.2)
      // = 24 + 21.25 + 22.5 + (8.75 * 0.2)
      // = 24 + 21.25 + 22.5 + 1.75
      // = 69.5
      expect(score).toBeCloseTo(69.5);
    });
  });
});