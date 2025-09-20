import { ChatMaestroFeedbackEngine } from '../lib/chat-maestro-feedback-engine';
import { 
  FeedbackContext, 
  UserData, 
  WorkoutData, 
  ProgressData 
} from '../lib/chat-maestro-feedback-types';

describe('ChatMaestroFeedbackEngine', () => {
  let engine: ChatMaestroFeedbackEngine;
  let mockContext: FeedbackContext;

  beforeEach(() => {
    engine = new ChatMaestroFeedbackEngine();
    
    const mockUserData: UserData = {
      id: 'user123',
      name: 'John Doe',
      age: 30,
      gender: 'male',
      goals: ['strength', 'muscle_gain'],
      experienceLevel: 'intermediate',
      preferences: {
        communicationStyle: 'direct',
        feedbackFrequency: 'high',
        motivationTriggers: ['strength', 'progress']
      },
      currentMetrics: {
        strength_score: 7.5,
        consistency_score: 8.2
      },
      psychologicalState: {
        energy: 7,
        motivation: 8,
        stress: 3,
        confidence: 6
      }
    };

    const mockWorkouts: WorkoutData[] = [
      {
        exercise: 'Squat',
        sets: 5,
        reps: [5, 5, 5, 5, 5],
        weight: [100, 100, 100, 100, 100],
        rpe: [7, 7, 8, 8, 8],
        formNotes: ['Good form', 'Knees caved in slightly on set 3'],
        timestamp: new Date()
      }
    ];

    const mockProgress: ProgressData[] = [
      {
        metric: 'squat_1rm',
        values: [80, 85, 90, 95, 100],
        dates: [
          new Date('2023-01-01'),
          new Date('2023-02-01'),
          new Date('2023-03-01'),
          new Date('2023-04-01'),
          new Date('2023-05-01')
        ],
        goal: 120,
        unit: 'kg'
      }
    ];

    mockContext = {
      userData: mockUserData,
      recentWorkouts: mockWorkouts,
      progressData: mockProgress,
      currentProgramPhase: 'initiation',
      recentFeedbackHistory: []
    };
  });

  describe('Technical Feedback', () => {
    it('should detect form issues and provide feedback', () => {
      const feedback = engine.generateFeedback(mockContext);
      const formFeedback = feedback.find(f => f.category === 'technical');
      
      expect(formFeedback).toBeDefined();
      expect(formFeedback?.message).toContain('form issues');
    });
  });

  describe('Progress Feedback', () => {
    it('should detect significant improvements', () => {
      const feedback = engine.generateFeedback(mockContext);
      const progressFeedback = feedback.find(f => f.category === 'progress');
      
      expect(progressFeedback).toBeDefined();
      expect(progressFeedback?.message).toContain('Outstanding progress');
    });
  });

  describe('Motivational Feedback', () => {
    it('should provide motivation for low confidence users', () => {
      // Create a context with low motivation
      const lowMotivationContext = {...mockContext};
      lowMotivationContext.userData.psychologicalState.motivation = 3;
      
      const feedback = engine.generateFeedback(lowMotivationContext);
      const motivationalFeedback = feedback.find(f => f.category === 'motivational');
      
      expect(motivationalFeedback).toBeDefined();
      expect(motivationalFeedback?.message).toContain('motivation');
    });
  });

  describe('Settings Management', () => {
    it('should respect disabled feedback categories', () => {
      // Disable technical feedback
      engine.updateSettings({
        enableTechnicalFeedback: false
      });
      
      const feedback = engine.generateFeedback(mockContext);
      const technicalFeedback = feedback.find(f => f.category === 'technical');
      
      expect(technicalFeedback).toBeUndefined();
    });
  });
});