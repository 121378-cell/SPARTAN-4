import { GamificationEngine } from '../modals/gamification-engine';
import {
  GamificationChallenge,
  Achievement,
  Leaderboard,
  GamificationEvent,
  GroupChallenge,
  GamificationNotification,
  GamificationConfig
} from '../modals/gamification-types';

// Mock user preferences and context
const mockUserPreferences = {
  equipmentAvailable: ['barbell', 'dumbbells', 'bench'],
  preferredGripTypes: ['pronated', 'supinated'],
  injuryPrecautions: ['knee', 'shoulder'],
  motivationTriggers: ['progress-tracking', 'social-comparison'],
  feedbackPreferences: {
    formCorrection: 'encouraging' as const,
    motivation: 'competitive' as const,
    safety: 'balanced' as const
  }
};

const mockUserContext = {
  currentEnergyLevel: 8,
  stressLevel: 3,
  sleepQuality: 7, // 1-10 scale
  nutritionStatus: 'good' as const,
  timeAvailable: 90,
  environment: 'gym' as const
};

const mockConfig: GamificationConfig = {
  userId: 'user-123',
  enableGamification: true,
  enableNotifications: true,
  enableSocialFeatures: true,
  enableAvatarCustomization: true,
  enableLeaderboards: true,
  enableEvents: true,
  difficultySetting: 'adaptive',
  challengeCooldownPeriod: 24,
  achievementTracking: true,
  xpSystem: {
    enabled: true,
    xpPerChallenge: 50,
    xpPerAchievement: 100,
    xpPerWorkout: 25,
    xpPerSocialInteraction: 10
  },
  pointSystem: {
    enabled: true,
    pointsPerChallenge: 100,
    pointsPerAchievement: 200,
    pointsMultiplier: {
      streak: 1.5,
      difficulty: 1.2,
      rarity: 2.0
    }
  }
};

describe('GamificationEngine', () => {
  let engine: GamificationEngine;

  beforeEach(() => {
    engine = new GamificationEngine(mockUserPreferences, mockUserContext, mockConfig);
  });

  describe('Initialization', () => {
    test('should initialize user profile correctly', () => {
      const profile = engine.getUserProfile();
      expect(profile.userId).toBe('user-123');
      expect(profile.level).toBe(5);
      expect(profile.xp).toBe(1250);
      expect(profile.badges).toHaveLength(1);
    });

    test('should initialize with sample challenges', () => {
      const activeChallenges = engine.getActiveChallenges();
      expect(activeChallenges).toHaveLength(2);
      
      const availableChallenges = engine.getAvailableChallenges();
      expect(availableChallenges).toHaveLength(0);
    });

    test('should initialize with sample achievements', () => {
      const lockedAchievements = engine.getLockedAchievements();
      expect(lockedAchievements).toHaveLength(2);
      
      const unlockedAchievements = engine.getUnlockedAchievements();
      expect(unlockedAchievements).toHaveLength(0);
    });

    test('should initialize with sample leaderboards', () => {
      const activeLeaderboards = engine.getActiveLeaderboards();
      expect(activeLeaderboards).toHaveLength(1);
    });

    test('should initialize with sample events', () => {
      const activeEvents = engine.getActiveEvents();
      expect(activeEvents).toHaveLength(1);
    });

    test('should initialize with sample group challenges', () => {
      const activeGroupChallenges = engine.getActiveGroupChallenges();
      expect(activeGroupChallenges).toHaveLength(1);
    });

    test('should initialize with sample notifications', () => {
      const unreadNotifications = engine.getUnreadNotifications();
      expect(unreadNotifications).toHaveLength(1);
    });
  });

  describe('Challenge Management', () => {
    test('should create a new challenge', () => {
      const challengeData = {
        title: 'New Challenge',
        description: 'A new test challenge',
        category: 'strength' as const,
        difficulty: 'beginner' as const,
        duration: 'weekly' as const,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        targetValue: 5,
        currentValue: 0,
        unit: 'reps',
        progress: 0,
        status: 'available' as const,
        reward: {
          type: 'points' as const,
          value: 100,
          description: '100 points',
          rarity: 'common' as const
        },
        requirements: []
      };

      const challenge = engine.createChallenge(challengeData);
      expect(challenge.id).toBeDefined();
      expect(challenge.title).toBe('New Challenge');
      expect(challenge.status).toBe('available');
    });

    test('should update challenge progress', () => {
      const challenges = engine.getActiveChallenges();
      const challengeId = challenges[0].id;
      
      const updatedChallenge = engine.updateChallengeProgress(challengeId, 3);
      expect(updatedChallenge).not.toBeNull();
      if (updatedChallenge) {
        expect(updatedChallenge.currentValue).toBe(3);
        expect(updatedChallenge.progress).toBe(75); // 3/4 * 100
      }
    });

    test('should complete a challenge and reward user', () => {
      const challenges = engine.getActiveChallenges();
      const challengeId = challenges[0].id;
      const initialPoints = engine.getUserProfile().totalPoints;
      
      const updatedChallenge = engine.updateChallengeProgress(challengeId, 4);
      expect(updatedChallenge).not.toBeNull();
      if (updatedChallenge) {
        expect(updatedChallenge.status).toBe('completed');
      }
      
      const updatedPoints = engine.getUserProfile().totalPoints;
      expect(updatedPoints).toBeGreaterThan(initialPoints);
    });
  });

  describe('Achievement Management', () => {
    test('should unlock an achievement', () => {
      const achievements = engine.getLockedAchievements();
      const achievementId = achievements[0].id;
      const initialUnlockedCount = engine.getUnlockedAchievements().length;
      
      const unlockedAchievement = engine.unlockAchievement(achievementId);
      expect(unlockedAchievement).not.toBeNull();
      
      const newUnlockedCount = engine.getUnlockedAchievements().length;
      expect(newUnlockedCount).toBe(initialUnlockedCount + 1);
    });
  });

  describe('Group Challenge Management', () => {
    test('should join a group challenge', () => {
      const groupChallenges = engine.getActiveGroupChallenges();
      const groupId = groupChallenges[0].id;
      
      const updatedGroupChallenge = engine.joinGroupChallenge(groupId);
      expect(updatedGroupChallenge).not.toBeNull();
    });

    test('should update group challenge progress', () => {
      const groupChallenges = engine.getActiveGroupChallenges();
      const groupId = groupChallenges[0].id;
      
      const updatedGroupChallenge = engine.updateGroupChallengeProgress(groupId, 25);
      expect(updatedGroupChallenge).not.toBeNull();
      if (updatedGroupChallenge) {
        expect(updatedGroupChallenge.currentProgress['user-123']).toBe(25);
      }
    });
  });

  describe('Notification Management', () => {
    test('should mark notification as read', () => {
      const notifications = engine.getUnreadNotifications();
      const notificationId = notifications[0].id;
      
      engine.markNotificationAsRead(notificationId);
      
      const updatedNotifications = engine.getUnreadNotifications();
      const markedNotification = updatedNotifications.find(n => n.id === notificationId);
      expect(markedNotification).toBeUndefined();
    });
  });

  describe('User Profile Management', () => {
    test('should update user preferences', () => {
      engine.updateUserPreferences({
        challengeDifficulty: 'hard'
      });
      
      const profile = engine.getUserProfile();
      expect(profile.preferences.challengeDifficulty).toBe('hard');
    });

    test('should update avatar customization', () => {
      engine.updateAvatarCustomization({
        characterId: 'new-character'
      });
      
      const avatar = engine.getAvatarCustomization();
      expect(avatar.characterId).toBe('new-character');
    });
  });

  describe('Analytics', () => {
    test('should generate gamification analytics', () => {
      const analytics = engine.getGamificationAnalytics();
      expect(analytics.userId).toBe('user-123');
      expect(analytics.metrics.challengesStarted).toBeDefined();
      expect(analytics.metrics.challengesCompleted).toBeDefined();
      expect(analytics.trends.weeklyChallengeCompletion).toHaveLength(5);
    });
  });
});