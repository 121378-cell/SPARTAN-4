// Tipos para el Modal de Gamificación y Retos

export interface GamificationChallenge {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'skill' | 'consistency' | 'community' | 'special';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: 'daily' | 'weekly' | 'monthly' | 'event';
  startDate: Date;
  endDate: Date;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0-100
  status: 'available' | 'active' | 'completed' | 'failed' | 'expired';
  reward: ChallengeReward;
  requirements: ChallengeRequirement[];
  participants?: string[]; // For group challenges
  leaderboard?: LeaderboardEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeRequirement {
  type: 'workout' | 'metric' | 'habit' | 'social' | 'completion';
  targetId?: string; // ID of workout, habit, etc.
  minValue?: number;
  maxValue?: number;
  requiredCount?: number;
  completionText?: string;
}

export interface ChallengeReward {
  type: 'points' | 'badge' | 'avatar-item' | 'discount' | 'achievement' | 'xp';
  value: number | string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  visualRepresentation?: string; // URL or identifier for visual asset
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'milestone' | 'consistency' | 'mastery' | 'community' | 'hidden';
  criteria: AchievementCriteria;
  reward: ChallengeReward;
  unlocked: boolean;
  unlockedAt?: Date;
  unlockProgress: number; // 0-100
  isHidden: boolean;
  dependencies?: string[]; // IDs of other achievements required first
  createdAt: Date;
  updatedAt: Date;
}

export interface AchievementCriteria {
  type: 'workout-count' | 'streak-days' | 'personal-record' | 'challenge-completion' | 
        'social-interaction' | 'skill-demonstration' | 'time-based' | 'custom';
  targetValue: number;
  currentValue: number;
  unit?: string;
  relatedEntityId?: string; // ID of workout, exercise, etc.
  timeWindow?: {
    start: Date;
    end: Date;
  };
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  rank: number;
  progress?: number; // 0-100 for challenges
  lastUpdated: Date;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'group' | 'community' | 'event';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time' | 'event';
  metric: string; // e.g., 'total-points', 'workouts-completed', 'challenge-success-rate'
  entries: LeaderboardEntry[];
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  badges: Badge[];
  avatar: AvatarCustomization;
  statistics: UserStatistics;
  preferences: GamificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  visualRepresentation: string; // URL or identifier for badge image
  isAnimated: boolean;
}

export interface AvatarCustomization {
  characterId: string;
  accessories: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  unlockedItems: string[]; // IDs of avatar items that can be equipped
  equippedItems: string[]; // IDs of avatar items currently equipped
}

export interface UserStatistics {
  challengesCompleted: number;
  challengesFailed: number;
  achievementsUnlocked: number;
  totalPointsEarned: number;
  currentStreak: number;
  longestStreak: number;
  socialInteractions: number;
  skillMastery: Record<string, number>; // e.g., { 'squat-technique': 85 }
}

export interface GamificationPreferences {
  challengeDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  challengeFrequency: 'low' | 'medium' | 'high';
  notificationPreferences: {
    challengeStart: boolean;
    challengeProgress: boolean;
    challengeEnd: boolean;
    achievementUnlock: boolean;
    leaderboardUpdate: boolean;
    socialChallenge: boolean;
  };
  preferredChallengeTypes: string[]; // e.g., ['strength', 'endurance', 'community']
  socialFeatures: {
    leaderboardVisibility: 'public' | 'friends' | 'private';
    groupChallengeParticipation: boolean;
    achievementSharing: boolean;
  };
}

export interface GamificationEvent {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'tournament' | 'community-event' | 'seasonal';
  startDate: Date;
  endDate: Date;
  challenges: string[]; // IDs of challenges included in the event
  rewards: ChallengeReward[];
  participants: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  registrationRequired: boolean;
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  groupId: string;
  groupName: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  challengeType: 'cooperative' | 'competitive' | 'hybrid';
  targetMetric: string;
  targetValue: number;
  currentProgress: Record<string, number>; // userId: progressValue
  participants: GroupChallengeParticipant[];
  status: 'forming' | 'active' | 'completed' | 'cancelled';
  rewards: ChallengeReward[];
  rules: string[];
  chatChannelId?: string;
}

export interface GroupChallengeParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  joinedAt: Date;
  progress: number;
  isCreator: boolean;
  status: 'active' | 'completed' | 'dropped';
}

export interface GamificationNotification {
  id: string;
  userId: string;
  type: 'challenge-start' | 'challenge-progress' | 'challenge-end' | 
        'achievement-unlock' | 'leaderboard-update' | 'social-challenge' |
        'event-reminder' | 'level-up' | 'reward-earned';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface GamificationConfig {
  userId: string;
  enableGamification: boolean;
  enableNotifications: boolean;
  enableSocialFeatures: boolean;
  enableAvatarCustomization: boolean;
  enableLeaderboards: boolean;
  enableEvents: boolean;
  difficultySetting: 'adaptive' | 'fixed';
  fixedDifficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  challengeCooldownPeriod: number; // in hours
  achievementTracking: boolean;
  xpSystem: {
    enabled: boolean;
    xpPerChallenge: number;
    xpPerAchievement: number;
    xpPerWorkout: number;
    xpPerSocialInteraction: number;
  };
  pointSystem: {
    enabled: boolean;
    pointsPerChallenge: number;
    pointsPerAchievement: number;
    pointsMultiplier: {
      streak: number;
      difficulty: number;
      rarity: number;
    };
  };
}

export interface GamificationAnalytics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    challengesStarted: number;
    challengesCompleted: number;
    challengesCompletionRate: number;
    achievementsUnlocked: number;
    pointsEarned: number;
    xpGained: number;
    socialInteractions: number;
    leaderboardRank?: number;
    engagementScore: number; // 0-100
  };
  trends: {
    weeklyChallengeCompletion: number[];
    dailyActivity: number[];
    achievementProgression: number[];
  };
  insights: {
    bestPerformingChallengeTypes: string[];
    areasForImprovement: string[];
    motivationalTriggers: string[];
    engagementPatterns: string[];
  };
  recommendations: {
    suggestedChallenges: string[];
    skillDevelopmentAreas: string[];
    socialOpportunities: string[];
  };
}