/**
 * Test suite for Notification Service
 */

import { NotificationService } from '../lib/notification-service';
import { habitTrackingService } from '../lib/habit-tracking';
import type { UserHabit } from '../lib/types';

// Mock habit tracking service
jest.mock('../lib/habit-tracking', () => ({
  habitTrackingService: {
    getUserHabits: jest.fn()
  }
}));

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const mockUserId = 'test-user';

  beforeEach(() => {
    notificationService = NotificationService.getInstance();
    jest.clearAllMocks();
  });

  describe('generateContextualNotifications', () => {
    it('should return empty array when no habits exist', () => {
      (habitTrackingService.getUserHabits as jest.Mock).mockReturnValue(null);
      
      const notifications = notificationService.generateContextualNotifications(mockUserId);
      
      expect(notifications).toEqual([]);
    });

    it('should generate notifications for infrequent training', () => {
      const mockHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00'],
        trainingFrequency: 2,
        lastTrainingSessions: [new Date()],
        averageTrainingDuration: 45,
        preferredTrainingDays: [1]
      };
      
      (habitTrackingService.getUserHabits as jest.Mock).mockReturnValue(mockHabit);
      
      const notifications = notificationService.generateContextualNotifications(mockUserId);
      
      expect(notifications.some(n => n.includes('frecuencia'))).toBe(true);
    });

    it('should generate notifications for high training frequency', () => {
      const mockHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00'],
        trainingFrequency: 6,
        lastTrainingSessions: [new Date()],
        averageTrainingDuration: 45,
        preferredTrainingDays: [1, 2, 3, 4, 5, 6]
      };
      
      (habitTrackingService.getUserHabits as jest.Mock).mockReturnValue(mockHabit);
      
      const notifications = notificationService.generateContextualNotifications(mockUserId);
      
      expect(notifications.some(n => n.includes('descanso'))).toBe(true);
    });
  });

  describe('sendNutritionRecommendations', () => {
    it('should generate nutrition recommendations based on training times', () => {
      const mockHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00', '12:00', '19:00'],
        trainingFrequency: 3,
        lastTrainingSessions: [],
        averageTrainingDuration: 45,
        preferredTrainingDays: [1, 3, 5]
      };
      
      (habitTrackingService.getUserHabits as jest.Mock).mockReturnValue(mockHabit);
      
      // Mock console.log to capture output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      notificationService.sendNutritionRecommendations(mockUserId);
      
      expect(consoleSpy).toHaveBeenCalledWith('Sending nutrition recommendations based on training schedule');
      expect(consoleSpy).toHaveBeenCalledWith('Recommendation: Consume protein and complex carbs before morning training');
      expect(consoleSpy).toHaveBeenCalledWith('Recommendation: Eat a light meal 1-2 hours before afternoon training');
      expect(consoleSpy).toHaveBeenCalledWith('Recommendation: Avoid training on a full stomach in the evening');
      
      consoleSpy.mockRestore();
    });
  });

  describe('sendRecoveryRecommendations', () => {
    it('should generate recovery recommendations based on training habits', () => {
      const mockHabit: UserHabit = {
        id: 'habit-test-user-123',
        userId: mockUserId,
        preferredTrainingTimes: ['07:00'],
        trainingFrequency: 6,
        lastTrainingSessions: [],
        averageTrainingDuration: 95,
        preferredTrainingDays: [1, 2, 3, 4, 5, 6]
      };
      
      (habitTrackingService.getUserHabits as jest.Mock).mockReturnValue(mockHabit);
      
      // Mock console.log to capture output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      notificationService.sendRecoveryRecommendations(mockUserId);
      
      expect(consoleSpy).toHaveBeenCalledWith('Sending recovery recommendations');
      expect(consoleSpy).toHaveBeenCalledWith('Recommendation: Consider an active rest day this week');
      expect(consoleSpy).toHaveBeenCalledWith('Recommendation: Ensure adequate sleep and hydration for long training sessions');
      
      consoleSpy.mockRestore();
    });
  });
});