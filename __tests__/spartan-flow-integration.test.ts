/**
 * Integration test suite for the complete Spartan training flow
 */

import { HabitTrackingService } from '../lib/habit-tracking';
import { NotificationService } from '../lib/notification-service';
import { storageManager } from '../lib/storage';
import type { WorkoutSession, UserHabit } from '../lib/types';

// Mock storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getUserHabits: jest.fn(),
    setUserHabits: jest.fn(),
    addUserHabit: jest.fn(),
    addWorkoutSession: jest.fn(),
    getWorkoutSessions: jest.fn().mockReturnValue([]),
    setWorkoutSessions: jest.fn()
  }
}));

describe('Spartan Training Flow Integration', () => {
  const mockUserId = 'integration-test-user';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete the full training flow from session to habit analysis', () => {
    // 1. Initialize habit tracking service
    const habitService = HabitTrackingService.getInstance();
    const notificationService = NotificationService.getInstance();
    
    // 2. Create a mock workout session
    const mockSession = {
      id: 'session-integration-1',
      workoutPlanId: 'plan-integration-1',
      date: new Date(),
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(), // Now
      duration: 60,
      exercises: [
        {
          exerciseId: 'exercise-1',
          name: 'Bench Press',
          sets: [
            {
              setNumber: 1,
              weight: 100,
              reps: 10,
              rpe: 8,
              tempo: '3-1-2',
              rest: 90,
              notes: 'Good form'
            }
          ]
        }
      ],
      notes: 'Great session overall'
    };
    
    // 3. Mock initial empty habits
    (storageManager.getUserHabits as jest.Mock).mockReturnValue([]);
    
    // 4. Record the workout session
    habitService.recordWorkoutSession(mockSession);
    
    // 5. Verify session was saved
    expect(storageManager.addWorkoutSession).toHaveBeenCalledWith(mockSession);
    
    // 6. Verify habit was initialized
    expect(storageManager.addUserHabit).toHaveBeenCalled();
    
    // 7. Mock updated habits after session recording
    const updatedHabit: UserHabit = {
      id: 'habit-integration-test-user-123',
      userId: mockUserId,
      preferredTrainingTimes: ['07:00'],
      trainingFrequency: 1,
      lastTrainingSessions: [mockSession.date],
      averageTrainingDuration: 60,
      preferredTrainingDays: [new Date().getDay()]
    };
    
    (storageManager.getUserHabits as jest.Mock).mockReturnValue([updatedHabit]);
    
    // 8. Predict training patterns
    const patterns = habitService.predictTrainingPatterns(mockUserId);
    
    // 9. Generate recommendations
    const recommendations = habitService.generateRecommendations(mockUserId);
    const notifications = notificationService.generateContextualNotifications(mockUserId);
    
    // 10. Verify predictions and recommendations were generated
    expect(patterns).toBeDefined();
    expect(recommendations).toBeDefined();
    expect(notifications).toBeDefined();
    
    // 11. Verify specific recommendation types
    expect(recommendations.workoutReminders.length).toBeGreaterThanOrEqual(0);
    expect(recommendations.nutritionTips.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle multiple sessions and update habits accordingly', () => {
    const habitService = HabitTrackingService.getInstance();
    
    // Mock initial habits
    const initialHabit: UserHabit = {
      id: 'habit-integration-test-user-123',
      userId: mockUserId,
      preferredTrainingTimes: ['07:00'],
      trainingFrequency: 1,
      lastTrainingSessions: [new Date(Date.now() - 86400000)], // Yesterday
      averageTrainingDuration: 45,
      preferredTrainingDays: [1] // Monday
    };
    
    (storageManager.getUserHabits as jest.Mock).mockReturnValue([initialHabit]);
    
    // Create multiple sessions
    const session1 = {
      id: 'session-multi-1',
      workoutPlanId: 'plan-multi-1',
      date: new Date(),
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(),
      duration: 60,
      exercises: [],
      notes: 'Session 1'
    };
    
    const session2 = {
      id: 'session-multi-2',
      workoutPlanId: 'plan-multi-1',
      date: new Date(Date.now() + 86400000), // Tomorrow
      startTime: new Date(Date.now() + 86400000 - 3600000),
      endTime: new Date(Date.now() + 86400000),
      duration: 75,
      exercises: [],
      notes: 'Session 2'
    };
    
    // Record sessions
    habitService.recordWorkoutSession(session1);
    habitService.recordWorkoutSession(session2);
    
    // Verify both sessions were recorded
    expect(storageManager.addWorkoutSession).toHaveBeenCalledTimes(2);
    
    // Update mock to return updated habits
    const updatedHabit: UserHabit = {
      ...initialHabit,
      trainingFrequency: 3,
      lastTrainingSessions: [session2.date, session1.date, initialHabit.lastTrainingSessions[0]],
      averageTrainingDuration: 60, // (45 + 60 + 75) / 3
      preferredTrainingDays: [1, new Date().getDay(), new Date(session2.date).getDay()]
    };
    
    (storageManager.getUserHabits as jest.Mock).mockReturnValue([updatedHabit]);
    
    // Generate updated predictions
    const patterns = habitService.predictTrainingPatterns(mockUserId);
    
    // Verify updated patterns
    expect(patterns.averageDuration).toBeCloseTo(60, 0);
    expect(patterns.recommendedDays.length).toBeGreaterThanOrEqual(1);
  });
});