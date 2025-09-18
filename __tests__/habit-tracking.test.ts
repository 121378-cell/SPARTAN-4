/**
 * Test suite for Habit Tracking Service
 */

import { HabitTrackingService } from '../lib/habit-tracking';
import { storageManager } from '../lib/storage';
import type { UserHabit, WorkoutSession } from '../lib/types';

// Mock storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getUserHabits: jest.fn(),
    setUserHabits: jest.fn(),
    addUserHabit: jest.fn(),
    addWorkoutSession: jest.fn()
  }
}));

describe('HabitTrackingService', () => {
  let habitService: HabitTrackingService;
  const mockUserId = 'test-user';

  beforeEach(() => {
    habitService = HabitTrackingService.getInstance();
    jest.clearAllMocks();
  });

  describe('initializeUserHabitTracking', () => {
    it('should create a new user habit if none exists', () => {
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([]);
      
      const habit = habitService.initializeUserHabitTracking(mockUserId);
      
      expect(habit.userId).toBe(mockUserId);
      expect(habit.preferredTrainingTimes).toEqual([]);
      expect(habit.trainingFrequency).toBe(0);
      expect(storageManager.addUserHabit).toHaveBeenCalledWith(habit);
    });

    it('should return existing user habit if it exists', () => {
      const existingHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00', '18:00'],
        trainingFrequency: 3,
        lastTrainingSessions: [],
        averageTrainingDuration: 45,
        preferredTrainingDays: [1, 3, 5]
      };
      
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([existingHabit]);
      
      const habit = habitService.initializeUserHabitTracking(mockUserId);
      
      expect(habit).toBe(existingHabit);
      expect(storageManager.addUserHabit).not.toHaveBeenCalled();
    });
  });

  describe('recordWorkoutSession', () => {
    it('should add workout session and update user habits', () => {
      const mockSession: WorkoutSession = {
        id: 'session-1',
        workoutPlanId: 'plan-1',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000), // 1 hour later
        duration: 60,
        exercises: [],
        notes: 'Test session'
      };
      
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([]);
      (storageManager.addUserHabit as jest.Mock).mockImplementation(() => {});
      
      habitService.recordWorkoutSession(mockSession);
      
      expect(storageManager.addWorkoutSession).toHaveBeenCalledWith(mockSession);
    });
  });

  describe('predictTrainingPatterns', () => {
    it('should return null values when no habits exist', () => {
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([]);
      
      const patterns = habitService.predictTrainingPatterns(mockUserId);
      
      expect(patterns.nextLikelySession).toBeNull();
      expect(patterns.recommendedTimes).toEqual([]);
      expect(patterns.recommendedDays).toEqual([]);
      expect(patterns.averageDuration).toBe(0);
    });

    it('should predict patterns based on user habits', () => {
      const mockHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00', '18:00', '07:00'], // 07:00 is most frequent
        trainingFrequency: 3,
        lastTrainingSessions: [],
        averageTrainingDuration: 45,
        preferredTrainingDays: [1, 3, 5, 1] // Monday is most frequent
      };
      
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([mockHabit]);
      
      const patterns = habitService.predictTrainingPatterns(mockUserId);
      
      expect(patterns.recommendedTimes).toContain('07:00');
      expect(patterns.recommendedDays).toContain(1);
      expect(patterns.averageDuration).toBe(45);
    });
  });

  describe('generateRecommendations', () => {
    it('should return empty arrays when no habits exist', () => {
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([]);
      
      const recommendations = habitService.generateRecommendations(mockUserId);
      
      expect(recommendations.workoutReminders).toEqual([]);
      expect(recommendations.restRecommendations).toEqual([]);
      expect(recommendations.nutritionTips).toEqual([]);
    });

    it('should generate recommendations based on user habits', () => {
      const mockHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00'],
        trainingFrequency: 3,
        lastTrainingSessions: [],
        averageTrainingDuration: 45,
        preferredTrainingDays: [1]
      };
      
      (storageManager.getUserHabits as jest.Mock).mockReturnValue([mockHabit]);
      
      const recommendations = habitService.generateRecommendations(mockUserId);
      
      // Check that at least one type of recommendation is generated
      const totalRecommendations = recommendations.workoutReminders.length + 
                                  recommendations.restRecommendations.length + 
                                  recommendations.nutritionTips.length;
      expect(totalRecommendations).toBeGreaterThan(0);
    });
  });
});