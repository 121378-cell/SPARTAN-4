/**
 * Test suite for Load Progression Service
 */

import { LoadProgressionService } from '../lib/load-progression-service';
import { storageManager } from '../lib/storage';
import type { WorkoutSession, LoadProgressionMetric, ProgressionPlan } from '../lib/types';

// Mock storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getProgressionMetrics: jest.fn(),
    addProgressionMetric: jest.fn(),
    getProgressionHistory: jest.fn(),
    addProgressionHistory: jest.fn(),
    addProgressionPlan: jest.fn(),
    getProgressionPlans: jest.fn()
  }
}));

describe('LoadProgressionService', () => {
  let loadProgressionService: LoadProgressionService;
  const mockUserId = 'test-user';
  const mockExerciseName = 'Bench Press';

  beforeEach(() => {
    loadProgressionService = LoadProgressionService.getInstance();
    jest.clearAllMocks();
  });

  describe('recordProgressionMetrics', () => {
    it('should record progression metrics from a workout session', () => {
      const mockSession: WorkoutSession = {
        id: 'session-1',
        workoutPlanId: 'plan-1',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000), // 1 hour later
        duration: 60,
        exercises: [
          {
            exerciseId: 'exercise-1',
            name: mockExerciseName,
            sets: [
              {
                setNumber: 1,
                weight: 100,
                reps: 8,
                rpe: 7,
                tempo: '3-1-2',
                rest: 90,
                notes: ''
              },
              {
                setNumber: 2,
                weight: 100,
                reps: 6,
                rpe: 8,
                tempo: '3-1-2',
                rest: 90,
                notes: ''
              }
            ]
          }
        ],
        notes: 'Test session'
      };
      
      const metrics = loadProgressionService.recordProgressionMetrics(mockSession);
      
      expect(metrics).toHaveLength(2);
      expect(metrics[0].exerciseName).toBe(mockExerciseName);
      expect(metrics[0].weight).toBe(100);
      expect(metrics[0].reps).toBe(8);
      expect(metrics[0].rpe).toBe(7);
      expect(storageManager.addProgressionMetric).toHaveBeenCalledTimes(2);
    });

    it('should calculate RIR correctly', () => {
      const mockSession: WorkoutSession = {
        id: 'session-1',
        workoutPlanId: 'plan-1',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        duration: 60,
        exercises: [
          {
            exerciseId: 'exercise-1',
            name: mockExerciseName,
            sets: [
              {
                setNumber: 1,
                weight: 100,
                reps: 8,
                rpe: 7,
                tempo: '3-1-2',
                rest: 90,
                notes: ''
              }
            ]
          }
        ],
        notes: 'Test session'
      };
      
      const metrics = loadProgressionService.recordProgressionMetrics(mockSession);
      
      // RIR should be 10 - RPE = 10 - 7 = 3
      expect(metrics[0].rir).toBe(3);
    });
  });

  describe('analyzeProgression', () => {
    it('should return default plan when no metrics exist', () => {
      (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue([]);
      
      const plan = loadProgressionService.analyzeProgression(mockUserId, mockExerciseName);
      
      expect(plan.exerciseName).toBe(mockExerciseName);
      expect(plan.currentWeight).toBe(0);
      expect(plan.recommendedWeight).toBe(0);
      expect(plan.nextPhase).toBe('accumulation');
      expect(plan.adjustments).toEqual([]);
      expect(plan.notes).toEqual(['No hay datos suficientes para generar recomendaciones']);
    });

    it('should recommend weight increase when performance is good', () => {
      const mockMetrics: LoadProgressionMetric[] = [
        {
          exerciseName: mockExerciseName,
          date: new Date(),
          weight: 100,
          reps: 8,
          rpe: 6, // Low RPE indicates good performance
          rir: 4, // High RIR indicates capacity for more
          completed: true
        }
      ];
      
      (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue(mockMetrics);
      
      const plan = loadProgressionService.analyzeProgression(mockUserId, mockExerciseName);
      
      expect(plan.currentWeight).toBe(100);
      expect(plan.adjustments).toHaveLength(1);
      expect(plan.adjustments[0].adjustmentType).toBe('weight');
      expect(plan.adjustments[0].value).toBe(5); // 5% increase
      expect(plan.adjustments[0].reason).toContain('RPE bajo y RIR alto');
    });

    it('should recommend deload when performance is poor', () => {
      const mockMetrics: LoadProgressionMetric[] = [
        {
          exerciseName: mockExerciseName,
          date: new Date(),
          weight: 100,
          reps: 8,
          rpe: 9, // High RPE indicates difficulty
          rir: 1, // Low RIR indicates struggle
          completed: true
        },
        {
          exerciseName: mockExerciseName,
          date: new Date(Date.now() - 86400000), // Yesterday
          weight: 100,
          reps: 8,
          rpe: 9,
          rir: 1,
          completed: true
        },
        {
          exerciseName: mockExerciseName,
          date: new Date(Date.now() - 2 * 86400000), // 2 days ago
          weight: 100,
          reps: 8,
          rpe: 9,
          rir: 1,
          completed: true
        },
        {
          exerciseName: mockExerciseName,
          date: new Date(Date.now() - 3 * 86400000), // 3 days ago
          weight: 100,
          reps: 8,
          rpe: 9,
          rir: 1,
          completed: true
        }
      ];
      
      (storageManager.getProgressionMetrics as jest.Mock).mockReturnValue(mockMetrics);
      
      const plan = loadProgressionService.analyzeProgression(mockUserId, mockExerciseName);
      
      expect(plan.adjustments).toHaveLength(1);
      expect(plan.adjustments[0].adjustmentType).toBe('deload');
      expect(plan.adjustments[0].value).toBe(-10); // 10% reduction
      expect(plan.adjustments[0].reason).toContain('Sobrecarga detectada');
    });
  });

  describe('getProgressionHistory', () => {
    it('should return progression history for an exercise', () => {
      const mockHistory = [
        {
          exerciseName: mockExerciseName,
          date: new Date(),
          weight: 100,
          reps: 8,
          rpe: 7,
          rir: 3,
          volume: 800,
          intensity: 0.7
        }
      ];
      
      (storageManager.getProgressionHistory as jest.Mock).mockReturnValue(mockHistory);
      
      const history = loadProgressionService.getProgressionHistory(mockExerciseName, 30);
      
      expect(history).toHaveLength(1);
      expect(history[0].exerciseName).toBe(mockExerciseName);
      expect(history[0].weight).toBe(100);
    });
  });
});