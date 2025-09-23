import { ExtremePersonalizationEngine, PersonalizationProfile } from '../lib/extreme-personalization-engine';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { storageManager } from '../lib/storage';
import { logger } from '../lib/logger';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    getUserData: jest.fn().mockReturnValue({
      name: 'Test User',
      age: 30,
      weight: 75,
      height: 180,
      fitnessLevel: 'intermediate',
      goals: ['strength']
    }),
    getUserHabits: jest.fn().mockReturnValue([]),
    getWorkoutSessions: jest.fn().mockReturnValue([]),
    getRecoveryAnalyses: jest.fn().mockReturnValue([]),
    getDailyNutrition: jest.fn().mockReturnValue([])
  }
}));

// Mock the logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

// Mock the Spartan Nervous System
jest.mock('../lib/spartan-nervous-system', () => ({
  spartanNervousSystem: {
    subscribe: jest.fn(),
    emitEvent: jest.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ExtremePersonalizationEngine', () => {
  let personalizationEngine: ExtremePersonalizationEngine;
  const testUserId = 'test-user-id';
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Create a new instance of the personalization engine
    personalizationEngine = ExtremePersonalizationEngine.getInstance();
  });
  
  afterEach(() => {
    // Reset the singleton instance for each test
    // @ts-ignore - accessing private property for testing
    ExtremePersonalizationEngine.instance = null;
  });
  
  describe('Profile Management', () => {
    it('should create a new personalization profile', async () => {
      const partialProfile: Partial<PersonalizationProfile> = {
        theme: 'dark',
        colorScheme: '#ff0000',
        layout: 'compact'
      };
      
      const profile = await personalizationEngine.createOrUpdateProfile(testUserId, partialProfile);
      
      expect(profile.userId).toBe(testUserId);
      expect(profile.theme).toBe('dark');
      expect(profile.colorScheme).toBe('#ff0000');
      expect(profile.layout).toBe('compact');
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.lastUpdated).toBeInstanceOf(Date);
    });
    
    it('should update an existing personalization profile', async () => {
      // First create a profile
      const initialProfile = await personalizationEngine.createOrUpdateProfile(testUserId, {
        theme: 'light'
      });
      
      const createdAt = initialProfile.createdAt;
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Update the profile
      const updatedProfile = await personalizationEngine.createOrUpdateProfile(testUserId, {
        theme: 'dark',
        colorScheme: '#00ff00'
      });
      
      expect(updatedProfile.userId).toBe(testUserId);
      expect(updatedProfile.theme).toBe('dark');
      expect(updatedProfile.colorScheme).toBe('#00ff00');
      expect(updatedProfile.createdAt).toEqual(createdAt);
      expect(updatedProfile.lastUpdated.getTime()).toBeGreaterThan(createdAt.getTime());
    });
    
    it('should retrieve an existing profile', async () => {
      // Create a profile first
      const createdProfile = await personalizationEngine.createOrUpdateProfile(testUserId, {
        theme: 'neon',
        animationLevel: 'full'
      });
      
      // Retrieve the profile
      const retrievedProfile = personalizationEngine.getProfile(testUserId);
      
      expect(retrievedProfile).toEqual(createdProfile);
    });
    
    it('should return undefined for non-existent profile', () => {
      const profile = personalizationEngine.getProfile('non-existent-user');
      expect(profile).toBeUndefined();
    });
  });
  
  describe('Personalization Context Generation', () => {
    it('should generate personalization context', async () => {
      const context = await personalizationEngine.generatePersonalizationContext(testUserId, 'dashboard');
      
      expect(context.userId).toBe(testUserId);
      expect(context.userData).toBeDefined();
      expect(context.userHabits).toBeDefined();
      expect(context.recentWorkouts).toBeDefined();
      expect(context.currentScreen).toBe('dashboard');
      expect(context.timeOfDay).toBeDefined();
      expect(context.dayOfWeek).toBeDefined();
      expect(context.systemLoad).toBeDefined();
    });
  });
  
  describe('UI Adaptations', () => {
    it('should generate UI adaptations based on profile', async () => {
      // Create a profile first
      await personalizationEngine.createOrUpdateProfile(testUserId, {
        theme: 'holographic',
        colorScheme: '#0000ff',
        layout: 'spacious',
        terminologyStyle: 'technical'
      });
      
      // Generate context
      const context = await personalizationEngine.generatePersonalizationContext(testUserId, 'dashboard');
      
      // Generate adaptations
      const adaptations = await personalizationEngine.generateUIAdaptations(context);
      
      expect(adaptations.length).toBeGreaterThan(0);
      expect(adaptations.some(a => a.adaptationType === 'theme')).toBeTruthy();
      expect(adaptations.some(a => a.adaptationType === 'layout')).toBeTruthy();
      
      // Check that adaptations are stored
      const storedAdaptations = personalizationEngine.getUIAdaptations(testUserId);
      expect(storedAdaptations).toEqual(adaptations);
    });
    
    it('should return empty array for user without profile', async () => {
      const context = await personalizationEngine.generatePersonalizationContext('non-existent-user', 'dashboard');
      const adaptations = await personalizationEngine.generateUIAdaptations(context);
      
      expect(adaptations).toEqual([]);
    });
  });
  
  describe('Personalized Calendar', () => {
    it('should generate personalized calendar events', async () => {
      // Create a profile first
      await personalizationEngine.createOrUpdateProfile(testUserId, {
        preferredWorkoutTime: 'morning',
        colorScheme: '#ff0000'
      });
      
      // Generate context
      const context = await personalizationEngine.generatePersonalizationContext(testUserId, 'calendar');
      
      // Generate calendar events
      const events = await personalizationEngine.generatePersonalizedCalendar(context);
      
      expect(events.length).toBeGreaterThan(0);
      expect(events.some(e => e.type === 'workout')).toBeTruthy();
      expect(events.some(e => e.type === 'recovery')).toBeTruthy();
      expect(events.some(e => e.type === 'nutrition')).toBeTruthy();
    });
  });
  
  describe('Personalized Feedback', () => {
    it('should generate workout completion feedback', async () => {
      // Create a profile first
      await personalizationEngine.createOrUpdateProfile(testUserId, {
        terminologyStyle: 'motivational'
      });
      
      // Check that profile was created
      const profile = personalizationEngine.getProfile(testUserId);
      expect(profile).toBeDefined();
      expect(profile?.terminologyStyle).toBe('motivational');
      
      // Generate context
      const context = await personalizationEngine.generatePersonalizationContext(testUserId, 'workout');
      
      // Generate feedback
      const feedback = await personalizationEngine.generatePersonalizedFeedback(context, 'workout_completed');
      
      expect(feedback).toBeDefined();
      expect(feedback.length).toBeGreaterThan(0);
      expect(feedback[0].context).toBe('workout_completion');
      expect(feedback[0].tone).toBe('motivational');
    });
  });
  
  describe('Habit Consistency Calculation', () => {
    it('should calculate habit consistency correctly', async () => {
      // @ts-ignore - accessing private method for testing
      const consistency1 = personalizationEngine.calculateHabitConsistency([]);
      
      expect(consistency1).toBe(0.5); // Default consistency
      
      // @ts-ignore - accessing private method for testing
      const consistency2 = personalizationEngine.calculateHabitConsistency([
        { lastTrainingSessions: [1, 2, 3] } as any,
        { lastTrainingSessions: [] } as any
      ]);
      
      expect(consistency2).toBe(0.5); // 1 out of 2 habits have sessions
    });
  });
  
  describe('Storage Integration', () => {
    it('should save and load profiles from storage', async () => {
      // Create a profile
      const profile = await personalizationEngine.createOrUpdateProfile(testUserId, {
        theme: 'minimal',
        colorScheme: '#abcdef'
      });
      
      // Verify localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'extreme_personalization_profiles',
        expect.stringContaining(testUserId)
      );
      
      // Reset the instance to simulate app restart
      // @ts-ignore - accessing private property for testing
      ExtremePersonalizationEngine.instance = null;
      const newEngine = ExtremePersonalizationEngine.getInstance();
      
      // Set up mock to return stored profiles
      const profilesJson = JSON.stringify([profile]);
      localStorageMock.getItem.mockReturnValueOnce(profilesJson);
      
      // Check that profile is loaded
      const loadedProfile = newEngine.getProfile(testUserId);
      expect(loadedProfile).toEqual(profile);
    });
  });
  
  describe('System Event Handling', () => {
    it('should subscribe to system events on initialization', () => {
      expect(spartanNervousSystem.subscribe).toHaveBeenCalledWith('data_updated', expect.any(Function));
      expect(spartanNervousSystem.subscribe).toHaveBeenCalledWith('user_action', expect.any(Function));
      expect(spartanNervousSystem.subscribe).toHaveBeenCalledWith('chat_interaction', expect.any(Function));
    });
    
    it('should handle data update events', async () => {
      // @ts-ignore - accessing private method for testing
      await personalizationEngine.handleDataUpdate({ userId: testUserId });
      
      // Should emit UI adaptations
      expect(spartanNervousSystem.emitEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'system_proactive',
          userId: testUserId,
          payload: expect.objectContaining({
            type: 'ui_adaptations'
          })
        })
      );
    });
  });
});