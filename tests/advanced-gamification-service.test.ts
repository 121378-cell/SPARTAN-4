/**
 * Test suite for Advanced Gamification Service
 */

import { advancedGamificationService, Achievement, Medal, Challenge } from '../lib/advanced-gamification-service';
import { dataManagementService } from '../lib/data-management-service';
import { storageManager } from '../lib/storage';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getUserData: jest.fn(),
    setUserData: jest.fn()
  }
}));

// Mock the data management service
jest.mock('../lib/data-management-service', () => ({
  dataManagementService: {
    getInstance: jest.fn().mockReturnValue({
      integratedData: {
        userData: {
          name: 'Test User',
          age: 30,
          weight: 70,
          height: 175,
          fitnessLevel: 'intermediate',
          goals: ['strength', 'endurance']
        },
        workoutSessions: [],
        recoveryData: []
      }
    })
  }
}));

describe('AdvancedGamificationService', () => {
  const userId = 'test-user-123';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getUserProfile', () => {
    it('should create a new profile if none exists', async () => {
      (storageManager.getUserData as jest.Mock).mockReturnValue(null);
      
      const profile = await advancedGamificationService.getUserProfile(userId);
      
      expect(profile).toBeDefined();
      expect(profile?.userId).toBe(userId);
      expect(profile?.level).toBe(1);
      expect(profile?.xp).toBe(0);
      expect(storageManager.setUserData).toHaveBeenCalled();
    });
    
    it('should return existing profile if it exists', async () => {
      const mockProfile = {
        userId,
        level: 5,
        xp: 500,
        xpToNextLevel: 200,
        totalPoints: 1000,
        achievements: [],
        medals: [],
        activeChallenges: [],
        completedChallenges: [],
        rankings: [],
        statistics: {
          challengesCompleted: 10,
          challengesFailed: 2,
          achievementsUnlocked: 5,
          totalPointsEarned: 1000,
          currentStreak: 3,
          longestStreak: 7,
          socialInteractions: 15,
          skillMastery: {},
          categoryPerformance: {}
        },
        preferences: {
          challengeDifficulty: 'adaptive',
          challengeFrequency: 'medium',
          notificationPreferences: {
            challengeStart: true,
            challengeProgress: true,
            challengeEnd: true,
            achievementUnlock: true,
            rankingUpdate: true,
            socialChallenge: true,
            medalEarned: true
          },
          preferredChallengeTypes: ['strength', 'endurance'],
          socialFeatures: {
            rankingVisibility: 'friends',
            groupChallengeParticipation: true,
            achievementSharing: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockProfile);
      
      const profile = await advancedGamificationService.getUserProfile(userId);
      
      expect(profile).toBeDefined();
      expect(profile?.level).toBe(5);
      expect(profile?.xp).toBe(500);
    });
  });
  
  describe('unlockAchievement', () => {
    it('should unlock an achievement and award rewards', async () => {
      // Setup mock profile
      const mockProfile = {
        userId,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        totalPoints: 0,
        achievements: [],
        medals: [],
        activeChallenges: [],
        completedChallenges: [],
        rankings: [],
        statistics: {
          challengesCompleted: 0,
          challengesFailed: 0,
          achievementsUnlocked: 0,
          totalPointsEarned: 0,
          currentStreak: 0,
          longestStreak: 0,
          socialInteractions: 0,
          skillMastery: {},
          categoryPerformance: {}
        },
        preferences: {
          challengeDifficulty: 'adaptive',
          challengeFrequency: 'medium',
          notificationPreferences: {
            challengeStart: true,
            challengeProgress: true,
            challengeEnd: true,
            achievementUnlock: true,
            rankingUpdate: true,
            socialChallenge: true,
            medalEarned: true
          },
          preferredChallengeTypes: ['strength', 'endurance'],
          socialFeatures: {
            rankingVisibility: 'friends',
            groupChallengeParticipation: true,
            achievementSharing: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockProfile);
      
      // Create a test achievement
      const testAchievement: Achievement = {
        id: 'test-achievement',
        title: 'Test Achievement',
        description: 'A test achievement for unit testing',
        category: 'consistency',
        criteria: {
          type: 'workout-count',
          targetValue: 1,
          currentValue: 0
        },
        reward: {
          type: 'points',
          value: 100,
          description: '100 points for testing',
          rarity: 'common'
        },
        unlocked: false,
        unlockProgress: 0,
        isHidden: false,
        rarity: 'common',
        visualRepresentation: 'test-badge',
        isAnimated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the achievement to the service
      (advancedGamificationService as any).achievements.set(testAchievement.id, testAchievement);
      
      // Unlock the achievement
      await advancedGamificationService.unlockAchievement(userId, testAchievement.id);
      
      // Verify the achievement was unlocked
      const updatedProfile = await advancedGamificationService.getUserProfile(userId);
      expect(updatedProfile?.achievements.length).toBe(1);
      expect(updatedProfile?.achievements[0].id).toBe(testAchievement.id);
      expect(updatedProfile?.achievements[0].unlocked).toBe(true);
      expect(updatedProfile?.totalPoints).toBe(100);
    });
  });
  
  describe('awardMedal', () => {
    it('should award a medal when all associated achievements are unlocked', async () => {
      // Setup mock profile
      const mockProfile = {
        userId,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        totalPoints: 0,
        achievements: [],
        medals: [],
        activeChallenges: [],
        completedChallenges: [],
        rankings: [],
        statistics: {
          challengesCompleted: 0,
          challengesFailed: 0,
          achievementsUnlocked: 0,
          totalPointsEarned: 0,
          currentStreak: 0,
          longestStreak: 0,
          socialInteractions: 0,
          skillMastery: {},
          categoryPerformance: {}
        },
        preferences: {
          challengeDifficulty: 'adaptive',
          challengeFrequency: 'medium',
          notificationPreferences: {
            challengeStart: true,
            challengeProgress: true,
            challengeEnd: true,
            achievementUnlock: true,
            rankingUpdate: true,
            socialChallenge: true,
            medalEarned: true
          },
          preferredChallengeTypes: ['strength', 'endurance'],
          socialFeatures: {
            rankingVisibility: 'friends',
            groupChallengeParticipation: true,
            achievementSharing: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockProfile);
      
      // Create test achievements
      const achievement1: Achievement = {
        id: 'achievement-1',
        title: 'First Achievement',
        description: 'First test achievement',
        category: 'consistency',
        criteria: {
          type: 'workout-count',
          targetValue: 1,
          currentValue: 0
        },
        reward: {
          type: 'points',
          value: 50,
          description: '50 points',
          rarity: 'common'
        },
        unlocked: true,
        unlockedAt: new Date(),
        unlockProgress: 100,
        isHidden: false,
        rarity: 'common',
        visualRepresentation: 'badge-1',
        isAnimated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const achievement2: Achievement = {
        id: 'achievement-2',
        title: 'Second Achievement',
        description: 'Second test achievement',
        category: 'consistency',
        criteria: {
          type: 'workout-count',
          targetValue: 1,
          currentValue: 0
        },
        reward: {
          type: 'points',
          value: 50,
          description: '50 points',
          rarity: 'common'
        },
        unlocked: true,
        unlockedAt: new Date(),
        unlockProgress: 100,
        isHidden: false,
        rarity: 'common',
        visualRepresentation: 'badge-2',
        isAnimated: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add achievements to the service
      (advancedGamificationService as any).achievements.set(achievement1.id, achievement1);
      (advancedGamificationService as any).achievements.set(achievement2.id, achievement2);
      
      // Update mock profile to include unlocked achievements
      // Update the mock to return the profile with achievements
      const mockProfileWithAchievements = {
        ...mockProfile,
        achievements: [achievement1, achievement2]
      };
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockProfileWithAchievements);
      
      // Create a test medal that requires both achievements
      const testMedal: Medal = {
        id: 'test-medal',
        title: 'Test Medal',
        description: 'A test medal for unit testing',
        category: 'consistency',
        rarity: 'bronze',
        earnedAt: new Date(0),
        visualRepresentation: 'test-medal',
        isAnimated: false,
        associatedAchievements: ['achievement-1', 'achievement-2']
      };
      
      // Add the medal to the service
      (advancedGamificationService as any).medals.set(testMedal.id, testMedal);
      
      // Check for medal unlocks (this should award the medal)
      await (advancedGamificationService as any).checkMedalUnlocks(userId, 'achievement-2');
      
      // Verify the medal was awarded
      const updatedProfile = await advancedGamificationService.getUserProfile(userId);
      expect(updatedProfile?.medals.length).toBe(1);
      expect(updatedProfile?.medals[0].id).toBe(testMedal.id);
    });
  });
  
  describe('generatePersonalizedChallenges', () => {
    it('should generate personalized challenges based on user data', async () => {
      // Setup mock profile
      const mockProfile = {
        userId,
        level: 5,
        xp: 500,
        xpToNextLevel: 200,
        totalPoints: 1000,
        achievements: [],
        medals: [],
        activeChallenges: [],
        completedChallenges: [],
        rankings: [],
        statistics: {
          challengesCompleted: 10,
          challengesFailed: 2,
          achievementsUnlocked: 5,
          totalPointsEarned: 1000,
          currentStreak: 3,
          longestStreak: 7,
          socialInteractions: 15,
          skillMastery: {
            'squat-technique': 75
          },
          categoryPerformance: {
            'strength': 80,
            'endurance': 65
          }
        },
        preferences: {
          challengeDifficulty: 'adaptive',
          challengeFrequency: 'medium',
          notificationPreferences: {
            challengeStart: true,
            challengeProgress: true,
            challengeEnd: true,
            achievementUnlock: true,
            rankingUpdate: true,
            socialChallenge: true,
            medalEarned: true
          },
          preferredChallengeTypes: ['strength', 'endurance'],
          socialFeatures: {
            rankingVisibility: 'friends',
            groupChallengeParticipation: true,
            achievementSharing: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockProfile);
      
      // Generate personalized challenges
      const challenges = await advancedGamificationService.generatePersonalizedChallenges(userId);
      
      // Verify challenges were generated
      expect(challenges.length).toBeGreaterThan(0);
      expect(challenges[0].personalizedForUser).toBe(true);
      expect(challenges[0].basedOnUserProgress).toBe(true);
    });
  });
  
  describe('getUserStatistics', () => {
    it('should return user statistics', async () => {
      // Setup mock profile
      const mockProfile = {
        userId,
        level: 5,
        xp: 500,
        xpToNextLevel: 200,
        totalPoints: 1000,
        achievements: [],
        medals: [],
        activeChallenges: [],
        completedChallenges: [],
        rankings: [],
        statistics: {
          challengesCompleted: 10,
          challengesFailed: 2,
          achievementsUnlocked: 5,
          totalPointsEarned: 1000,
          currentStreak: 3,
          longestStreak: 7,
          socialInteractions: 15,
          skillMastery: {
            'squat-technique': 75
          },
          categoryPerformance: {
            'strength': 80,
            'endurance': 65
          }
        },
        preferences: {
          challengeDifficulty: 'adaptive',
          challengeFrequency: 'medium',
          notificationPreferences: {
            challengeStart: true,
            challengeProgress: true,
            challengeEnd: true,
            achievementUnlock: true,
            rankingUpdate: true,
            socialChallenge: true,
            medalEarned: true
          },
          preferredChallengeTypes: ['strength', 'endurance'],
          socialFeatures: {
            rankingVisibility: 'friends',
            groupChallengeParticipation: true,
            achievementSharing: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (storageManager.getUserData as jest.Mock).mockReturnValue(mockProfile);
      
      // Get user statistics
      const stats = await advancedGamificationService.getUserStatistics(userId);
      
      // Verify statistics
      expect(stats.challengesCompleted).toBe(10);
      expect(stats.achievementsUnlocked).toBe(5);
      expect(stats.currentStreak).toBe(3);
      expect(stats.skillMastery['squat-technique']).toBe(75);
    });
  });
});