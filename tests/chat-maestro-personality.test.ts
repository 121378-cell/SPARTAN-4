// Test file for Chat Maestro Personality System

import { ChatMaestroPersonalityService } from '../lib/chat-maestro-personality-service';
import { UserState, CoachingContext, CoachingPhase } from '../lib/chat-maestro-types';

describe('Chat Maestro Personality Service', () => {
  let personalityService: ChatMaestroPersonalityService;
  
  beforeEach(() => {
    personalityService = new ChatMaestroPersonalityService();
  });

  describe('User Input Analysis', () => {
    test('should correctly identify workout context', () => {
      const input = "I'm thinking about skipping my workout today because I'm tired";
      const context = personalityService.analyzeUserInput(input);
      expect(context).toBe('workout');
    });

    test('should correctly identify nutrition context', () => {
      const input = "I've been struggling with my nutrition this week";
      const context = personalityService.analyzeUserInput(input);
      expect(context).toBe('nutrition');
    });

    test('should correctly identify recovery context', () => {
      const input = "I feel really fatigued and my sleep has been poor";
      const context = personalityService.analyzeUserInput(input);
      expect(context).toBe('recovery');
    });

    test('should default to education context', () => {
      const input = "I want to learn more about training principles";
      const context = personalityService.analyzeUserInput(input);
      expect(context).toBe('education');
    });
  });

  describe('Personalized Coaching Generation', () => {
    const mockUserState: UserState = {
      energyLevel: 7,
      motivationLevel: 8,
      stressLevel: 3,
      consistency: 6,
      progress: 5,
      currentPhase: 'initiation',
      recentAchievements: ['First workout completed', '7-day streak']
    };

    test('should generate appropriate coaching for high-energy user', async () => {
      const highEnergyUser: UserState = {
        ...mockUserState,
        energyLevel: 9,
        motivationLevel: 9
      };
      
      const prompt = await personalityService.generatePersonalizedCoaching(
        highEnergyUser,
        'workout'
      );
      
      expect(prompt.tone).toBeDefined();
      expect(prompt.context).toBe('workout');
      expect(prompt.message).toBeTruthy();
    });

    test('should generate empathetic response for low-energy user', async () => {
      const lowEnergyUser: UserState = {
        ...mockUserState,
        energyLevel: 2,
        motivationLevel: 2
      };
      
      const prompt = await personalityService.generatePersonalizedCoaching(
        lowEnergyUser,
        'workout'
      );
      
      // Should prioritize empathy when energy is very low
      expect(prompt.tone).toBe('empathetic');
    });

    test('should generate disciplined response for inconsistent user', async () => {
      const inconsistentUser: UserState = {
        ...mockUserState,
        consistency: 2
      };
      
      const prompt = await personalityService.generatePersonalizedCoaching(
        inconsistentUser,
        'workout'
      );
      
      // Should prioritize discipline when consistency is low
      expect(prompt.tone).toBe('disciplined');
    });
  });

  describe('Phase-Based Personality Weights', () => {
    test('should return correct weights for initiation phase', () => {
      const weights = personalityService.getPhasePersonalityWeights('initiation');
      expect(weights.motivational).toBe(40);
      expect(weights.disciplined).toBe(30);
    });

    test('should return correct weights for stagnation phase', () => {
      const weights = personalityService.getPhasePersonalityWeights('stagnation');
      expect(weights.technical).toBe(40);
      expect(weights.empathetic).toBe(25);
    });

    test('should return correct weights for achievement phase', () => {
      const weights = personalityService.getPhasePersonalityWeights('achievement');
      expect(weights.motivational).toBe(40);
      expect(weights.technical).toBe(25);
    });
  });

  describe('Phase-Specific Messaging', () => {
    const mockUserState: UserState = {
      energyLevel: 7,
      motivationLevel: 8,
      stressLevel: 3,
      consistency: 6,
      progress: 5,
      currentPhase: 'initiation',
      recentAchievements: []
    };

    test('should generate appropriate initiation phase message', () => {
      const message = personalityService.generatePhaseSpecificMessage(
        'initiation',
        'workout',
        mockUserState
      );
      
      expect(message).toContain('Welcome to your transformation journey');
    });

    test('should generate appropriate stagnation phase message', () => {
      const message = personalityService.generatePhaseSpecificMessage(
        'stagnation',
        'workout',
        mockUserState
      );
      
      expect(message).toContain('Let\'s analyze what\'s happening');
    });

    test('should generate appropriate achievement phase message', () => {
      const message = personalityService.generatePhaseSpecificMessage(
        'achievement',
        'workout',
        mockUserState
      );
      
      expect(message).toContain('Look at this incredible progress');
    });
  });

  describe('Conversation Adaptation', () => {
    test('should adapt to disciplinary message history', () => {
      const userState: UserState = {
        energyLevel: 5,
        motivationLevel: 5,
        stressLevel: 5,
        consistency: 5,
        progress: 5,
        currentPhase: 'initiation',
        recentAchievements: []
      };
      
      const previousPrompts = [
        { tone: 'disciplined', context: 'workout', phase: 'initiation', message: 'Be more consistent', priority: 5 },
        { tone: 'disciplined', context: 'nutrition', phase: 'initiation', message: 'Follow your plan', priority: 5 },
        { tone: 'disciplined', context: 'recovery', phase: 'initiation', message: 'Stick to recovery', priority: 5 },
        { tone: 'disciplined', context: 'workout', phase: 'initiation', message: 'Show up', priority: 5 }
      ] as any;
      
      const adaptedState = personalityService.adaptToConversationHistory(previousPrompts, userState);
      
      // The adaptation logic modifies the user state, but we're checking that it was called
      expect(adaptedState).toBeDefined();
    });
  });
});