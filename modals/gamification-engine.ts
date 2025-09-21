// Motor del Modal de Gamificación y Retos

import {
  GamificationChallenge,
  ChallengeRequirement,
  ChallengeReward,
  Achievement,
  AchievementCriteria,
  Leaderboard,
  LeaderboardEntry,
  UserProfile,
  Badge,
  AvatarCustomization,
  UserStatistics,
  GamificationPreferences,
  GamificationEvent,
  GroupChallenge,
  GroupChallengeParticipant,
  GamificationNotification,
  GamificationConfig,
  GamificationAnalytics
} from './gamification-types';

// Definir interfaces locales ya que no están disponibles en ../lib/types
interface UserContext {
  currentEnergyLevel: number; // 1-10
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  nutritionStatus: 'poor' | 'fair' | 'good' | 'excellent';
  timeAvailable: number; // in minutes
  environment: 'gym' | 'home' | 'outdoor' | 'travel';
}

interface UserPreferences {
  equipmentAvailable: string[];
  preferredGripTypes: string[];
  injuryPrecautions: string[];
  motivationTriggers: string[];
  feedbackPreferences: {
    formCorrection: 'subtle' | 'direct' | 'encouraging';
    motivation: 'competitive' | 'supportive' | 'neutral';
    safety: 'conservative' | 'balanced' | 'aggressive';
  };
}

export class GamificationEngine {
  private userPreferences: UserPreferences;
  private userContext: UserContext;
  private challenges: GamificationChallenge[] = [];
  private achievements: Achievement[] = [];
  private leaderboards: Leaderboard[] = [];
  private userProfile!: UserProfile;
  private events: GamificationEvent[] = [];
  private groupChallenges: GroupChallenge[] = [];
  private notifications: GamificationNotification[] = [];
  private config: GamificationConfig;

  constructor(userPreferences: UserPreferences, userContext: UserContext, config: GamificationConfig) {
    this.userPreferences = userPreferences;
    this.userContext = userContext;
    this.config = config;
    this.initializeUserProfile();
    this.initializeGamificationSystem();
  }

  private initializeUserProfile(): void {
    this.userProfile = {
      userId: 'user-123',
      level: 5,
      xp: 1250,
      xpToNextLevel: 250,
      totalPoints: 3500,
      badges: [
        {
          id: 'badge-1',
          title: 'Primer Reto Completado',
          description: 'Completa tu primer desafío',
          category: 'milestone',
          rarity: 'common',
          earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          visualRepresentation: 'first-challenge-badge',
          isAnimated: false
        }
      ],
      avatar: {
        characterId: 'character-1',
        accessories: ['hat-1', 'gloves-2'],
        colors: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#8b5cf6'
        },
        unlockedItems: ['hat-1', 'hat-2', 'gloves-1', 'gloves-2'],
        equippedItems: ['hat-1', 'gloves-2']
      },
      statistics: {
        challengesCompleted: 12,
        challengesFailed: 3,
        achievementsUnlocked: 8,
        totalPointsEarned: 3500,
        currentStreak: 5,
        longestStreak: 12,
        socialInteractions: 24,
        skillMastery: {
          'squat-technique': 75,
          'deadlift-form': 82,
          'cardio-endurance': 68
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
          leaderboardUpdate: true,
          socialChallenge: true
        },
        preferredChallengeTypes: ['strength', 'endurance'],
        socialFeatures: {
          leaderboardVisibility: 'friends',
          groupChallengeParticipation: true,
          achievementSharing: true
        }
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
  }

  private initializeGamificationSystem(): void {
    // Initialize with sample challenges
    this.challenges = [
      {
        id: 'challenge-1',
        title: 'Semana de Fuerza',
        description: 'Completa 4 sesiones de entrenamiento de fuerza esta semana',
        category: 'strength',
        difficulty: 'intermediate',
        duration: 'weekly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        targetValue: 4,
        currentValue: 2,
        unit: 'sesiones',
        progress: 50,
        status: 'active',
        reward: {
          type: 'points',
          value: 150,
          description: '150 puntos por completar el reto de fuerza',
          rarity: 'uncommon'
        },
        requirements: [
          {
            type: 'workout',
            targetId: 'strength-workout',
            requiredCount: 4
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'challenge-2',
        title: 'Racha de Consistencia',
        description: 'Entrena 7 días consecutivos',
        category: 'consistency',
        difficulty: 'beginner',
        duration: 'weekly',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        targetValue: 7,
        currentValue: 3,
        unit: 'días',
        progress: 43,
        status: 'active',
        reward: {
          type: 'badge',
          value: 'consistency-streak-badge',
          description: 'Insignia por mantener una racha de 7 días',
          rarity: 'common',
          visualRepresentation: 'consistency-streak-badge'
        },
        requirements: [
          {
            type: 'workout',
            requiredCount: 7
          }
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    // Initialize with sample achievements
    this.achievements = [
      {
        id: 'achievement-1',
        title: 'Dominio del Press de Banca',
        description: 'Alcanza un 1RM de 100kg en press de banca',
        category: 'mastery',
        criteria: {
          type: 'personal-record',
          targetValue: 100,
          currentValue: 85,
          unit: 'kg',
          relatedEntityId: 'barbell-bench-press'
        },
        reward: {
          type: 'badge',
          value: 'bench-press-master-badge',
          description: 'Insignia por dominar el press de banca',
          rarity: 'rare',
          visualRepresentation: 'bench-press-master-badge'
        },
        unlocked: false,
        unlockProgress: 85,
        isHidden: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'achievement-2',
        title: 'Mes de Hierro',
        description: 'Completa todos los entrenamientos planificados durante un mes',
        category: 'consistency',
        criteria: {
          type: 'workout-count',
          targetValue: 20,
          currentValue: 15,
          unit: 'workouts'
        },
        reward: {
          type: 'points',
          value: 500,
          description: '500 puntos por consistencia mensual',
          rarity: 'epic'
        },
        unlocked: false,
        unlockProgress: 75,
        isHidden: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize with sample leaderboards
    this.leaderboards = [
      {
        id: 'leaderboard-1',
        title: 'Retos Completados - Semanal',
        description: 'Usuarios que han completado más retos esta semana',
        type: 'individual',
        timeframe: 'weekly',
        metric: 'challenges-completed',
        entries: [
          {
            userId: 'user-123',
            userName: 'Usuario Actual',
            userAvatar: 'avatar-1',
            score: 5,
            rank: 3,
            lastUpdated: new Date()
          },
          {
            userId: 'user-456',
            userName: 'Competidor 1',
            userAvatar: 'avatar-2',
            score: 8,
            rank: 1,
            lastUpdated: new Date()
          },
          {
            userId: 'user-789',
            userName: 'Competidor 2',
            userAvatar: 'avatar-3',
            score: 6,
            rank: 2,
            lastUpdated: new Date()
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize with sample events
    this.events = [
      {
        id: 'event-1',
        title: 'Torneo de Verano',
        description: 'Torneo especial de verano con desafíos únicos y grandes recompensas',
        type: 'tournament',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        challenges: ['challenge-1', 'challenge-2'],
        rewards: [
          {
            type: 'badge',
            value: 'summer-champion-badge',
            description: 'Insignia de campeón del torneo de verano',
            rarity: 'legendary',
            visualRepresentation: 'summer-champion-badge'
          }
        ],
        participants: ['user-123', 'user-456', 'user-789'],
        status: 'upcoming',
        registrationRequired: true,
        maxParticipants: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Initialize with sample group challenges
    this.groupChallenges = [
      {
        id: 'group-challenge-1',
        title: 'Equipo Spartan - Fuerza Colectiva',
        description: 'Como equipo, completen 50 sesiones de fuerza en un mes',
        groupId: 'team-spartan',
        groupName: 'Equipo Spartan',
        createdBy: 'user-456',
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        challengeType: 'cooperative',
        targetMetric: 'strength-sessions',
        targetValue: 50,
        currentProgress: {
          'user-123': 12,
          'user-456': 15,
          'user-789': 10
        },
        participants: [
          {
            userId: 'user-123',
            userName: 'Usuario Actual',
            userAvatar: 'avatar-1',
            joinedAt: new Date(),
            progress: 12,
            isCreator: false,
            status: 'active'
          },
          {
            userId: 'user-456',
            userName: 'Líder de Equipo',
            userAvatar: 'avatar-2',
            joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            progress: 15,
            isCreator: true,
            status: 'active'
          }
        ],
        status: 'active',
        rewards: [
          {
            type: 'points',
            value: 1000,
            description: '1000 puntos para todo el equipo',
            rarity: 'epic'
          }
        ],
        rules: [
          'Cada miembro debe completar al menos 5 sesiones',
          'Las sesiones deben ser de fuerza',
          'Los progresos se suman al total del equipo'
        ]
      }
    ];

    // Initialize with sample notifications
    this.notifications = [
      {
        id: 'notification-1',
        userId: 'user-123',
        type: 'challenge-progress',
        title: '¡Vas bien en tu reto!',
        message: 'Has completado el 50% del reto "Semana de Fuerza"',
        priority: 'medium',
        read: false,
        actionUrl: '/challenges/challenge-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  public getUserProfile(): UserProfile {
    return { ...this.userProfile };
  }

  public getActiveChallenges(): GamificationChallenge[] {
    return this.challenges.filter(challenge => challenge.status === 'active');
  }

  public getAvailableChallenges(): GamificationChallenge[] {
    return this.challenges.filter(challenge => challenge.status === 'available');
  }

  public getCompletedChallenges(): GamificationChallenge[] {
    return this.challenges.filter(challenge => challenge.status === 'completed');
  }

  public getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(achievement => achievement.unlocked);
  }

  public getLockedAchievements(): Achievement[] {
    return this.achievements.filter(achievement => !achievement.unlocked);
  }

  public getActiveLeaderboards(): Leaderboard[] {
    return this.leaderboards.filter(leaderboard => leaderboard.isActive);
  }

  public getUserRankInLeaderboard(leaderboardId: string): LeaderboardEntry | null {
    const leaderboard = this.leaderboards.find(lb => lb.id === leaderboardId);
    if (!leaderboard) return null;
    
    const userEntry = leaderboard.entries.find(entry => entry.userId === this.userProfile.userId);
    return userEntry || null;
  }

  public getActiveEvents(): GamificationEvent[] {
    return this.events.filter(event => event.status === 'active' || event.status === 'upcoming');
  }

  public getActiveGroupChallenges(): GroupChallenge[] {
    return this.groupChallenges.filter(gc => gc.status === 'active');
  }

  public getUnreadNotifications(): GamificationNotification[] {
    return this.notifications.filter(notification => !notification.read);
  }

  public markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.updatedAt = new Date();
    }
  }

  public createChallenge(challenge: Omit<GamificationChallenge, 'id' | 'createdAt' | 'updatedAt'>): GamificationChallenge {
    const newChallenge: GamificationChallenge = {
      ...challenge,
      id: `challenge-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.challenges.push(newChallenge);
    return newChallenge;
  }

  public updateChallengeProgress(challengeId: string, progress: number): GamificationChallenge | null {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge) return null;
    
    challenge.currentValue = progress;
    challenge.progress = Math.min(100, Math.max(0, (progress / challenge.targetValue) * 100));
    challenge.updatedAt = new Date();
    
    // Check if challenge is completed
    if (challenge.progress >= 100) {
      challenge.status = 'completed';
      this.rewardUserForChallengeCompletion(challenge);
      this.createNotification({
        userId: this.userProfile.userId,
        type: 'challenge-end',
        title: '¡Reto completado!',
        message: `Has completado el reto "${challenge.title}"`,
        priority: 'high',
        read: false,
        actionUrl: `/challenges/${challenge.id}`
      });
    }
    
    return challenge;
  }

  private rewardUserForChallengeCompletion(challenge: GamificationChallenge): void {
    const reward = challenge.reward;
    
    switch (reward.type) {
      case 'points':
        this.userProfile.totalPoints += Number(reward.value);
        break;
      case 'xp':
        this.userProfile.xp += Number(reward.value);
        this.checkLevelUp();
        break;
      case 'badge':
        this.userProfile.badges.push({
          id: `badge-${Date.now()}`,
          title: reward.description,
          description: reward.description,
          category: 'challenge',
          rarity: reward.rarity,
          earnedAt: new Date(),
          visualRepresentation: reward.visualRepresentation || '',
          isAnimated: false
        });
        break;
    }
    
    this.userProfile.statistics.challengesCompleted++;
    this.userProfile.updatedAt = new Date();
  }

  private checkLevelUp(): void {
    if (this.userProfile.xp >= this.userProfile.xpToNextLevel) {
      this.userProfile.level++;
      this.userProfile.xp -= this.userProfile.xpToNextLevel;
      this.userProfile.xpToNextLevel = Math.floor(this.userProfile.xpToNextLevel * 1.5);
      
      this.createNotification({
        userId: this.userProfile.userId,
        type: 'level-up',
        title: '¡Subiste de nivel!',
        message: `¡Felicidades! Ahora eres nivel ${this.userProfile.level}`,
        priority: 'high',
        read: false
      });
    }
  }

  public unlockAchievement(achievementId: string): Achievement | null {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return null;
    
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    this.userProfile.statistics.achievementsUnlocked++;
    this.userProfile.updatedAt = new Date();
    
    // Reward user
    const reward = achievement.reward;
    switch (reward.type) {
      case 'points':
        this.userProfile.totalPoints += Number(reward.value);
        break;
      case 'xp':
        this.userProfile.xp += Number(reward.value);
        this.checkLevelUp();
        break;
      case 'badge':
        this.userProfile.badges.push({
          id: `badge-${Date.now()}`,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          rarity: reward.rarity,
          earnedAt: new Date(),
          visualRepresentation: reward.visualRepresentation || '',
          isAnimated: false
        });
        break;
    }
    
    this.createNotification({
      userId: this.userProfile.userId,
      type: 'achievement-unlock',
      title: '¡Logro desbloqueado!',
      message: `Has desbloqueado: ${achievement.title}`,
      priority: 'high',
      read: false,
      actionUrl: `/achievements/${achievement.id}`
    });
    
    return achievement;
  }

  public joinGroupChallenge(groupId: string): GroupChallenge | null {
    const groupChallenge = this.groupChallenges.find(gc => gc.id === groupId);
    if (!groupChallenge) return null;
    
    // Check if user is already in the challenge
    const isParticipant = groupChallenge.participants.some(p => p.userId === this.userProfile.userId);
    if (isParticipant) return groupChallenge;
    
    // Add user to participants
    groupChallenge.participants.push({
      userId: this.userProfile.userId,
      userName: 'Usuario Actual', // In a real implementation, this would come from user data
      userAvatar: 'default-avatar',
      joinedAt: new Date(),
      progress: 0,
      isCreator: false,
      status: 'active'
    });
    
    // Initialize progress for this user
    if (!groupChallenge.currentProgress[this.userProfile.userId]) {
      groupChallenge.currentProgress[this.userProfile.userId] = 0;
    }
    
    groupChallenge.updatedAt = new Date();
    
    this.createNotification({
      userId: this.userProfile.userId,
      type: 'social-challenge',
      title: 'Te uniste a un reto grupal',
      message: `Te uniste a "${groupChallenge.title}"`,
      priority: 'medium',
      read: false,
      actionUrl: `/group-challenges/${groupChallenge.id}`
    });
    
    return groupChallenge;
  }

  public updateGroupChallengeProgress(groupId: string, progress: number): GroupChallenge | null {
    const groupChallenge = this.groupChallenges.find(gc => gc.id === groupId);
    if (!groupChallenge) return null;
    
    // Update user's progress
    groupChallenge.currentProgress[this.userProfile.userId] = progress;
    
    // Update participant's progress
    const participant = groupChallenge.participants.find(p => p.userId === this.userProfile.userId);
    if (participant) {
      participant.progress = progress;
    }
    
    // Calculate total progress
    const totalProgress = Object.values(groupChallenge.currentProgress).reduce((sum, val) => sum + val, 0);
    const overallProgress = Math.min(100, Math.max(0, (totalProgress / groupChallenge.targetValue) * 100));
    
    // Update all participants with overall progress
    groupChallenge.participants.forEach(participant => {
      participant.progress = overallProgress;
    });
    
    groupChallenge.updatedAt = new Date();
    
    // Check if challenge is completed
    if (overallProgress >= 100) {
      groupChallenge.status = 'completed';
      
      // Reward all participants
      groupChallenge.participants.forEach(participant => {
        // In a real implementation, we would reward each user individually
        if (participant.userId === this.userProfile.userId) {
          this.rewardUserForGroupChallengeCompletion(groupChallenge);
        }
      });
      
      this.createNotification({
        userId: this.userProfile.userId,
        type: 'challenge-end',
        title: '¡Reto grupal completado!',
        message: `Tu equipo completó "${groupChallenge.title}"`,
        priority: 'high',
        read: false,
        actionUrl: `/group-challenges/${groupChallenge.id}`
      });
    }
    
    return groupChallenge;
  }

  private rewardUserForGroupChallengeCompletion(groupChallenge: GroupChallenge): void {
    groupChallenge.rewards.forEach(reward => {
      switch (reward.type) {
        case 'points':
          this.userProfile.totalPoints += Number(reward.value);
          break;
        case 'xp':
          this.userProfile.xp += Number(reward.value);
          this.checkLevelUp();
          break;
        case 'badge':
          this.userProfile.badges.push({
            id: `badge-${Date.now()}`,
            title: `Equipo: ${groupChallenge.title}`,
            description: reward.description,
            category: 'group',
            rarity: reward.rarity,
            earnedAt: new Date(),
            visualRepresentation: reward.visualRepresentation || '',
            isAnimated: false
          });
          break;
      }
    });
    
    this.userProfile.updatedAt = new Date();
  }

  public createNotification(notification: Omit<GamificationNotification, 'id' | 'createdAt' | 'updatedAt'>): GamificationNotification {
    const newNotification: GamificationNotification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.notifications.push(newNotification);
    return newNotification;
  }

  public getGamificationAnalytics(): GamificationAnalytics {
    const period = {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    };
    
    // Calculate metrics
    const challengesStarted = this.challenges.filter(c => 
      c.createdAt >= period.start && c.createdAt <= period.end
    ).length;
    
    const challengesCompleted = this.challenges.filter(c => 
      c.status === 'completed' && c.updatedAt >= period.start && c.updatedAt <= period.end
    ).length;
    
    const challengesCompletionRate = challengesStarted > 0 ? 
      Math.round((challengesCompleted / challengesStarted) * 100) : 0;
    
    const achievementsUnlocked = this.achievements.filter(a => 
      a.unlocked && a.unlockedAt && a.unlockedAt >= period.start && a.unlockedAt <= period.end
    ).length;
    
    // Generate trends (simplified for this example)
    const weeklyChallengeCompletion = [75, 80, 65, 90, 85];
    const dailyActivity = [4, 3, 5, 2, 6, 4, 3];
    const achievementProgression = [10, 15, 20, 25, 30, 35, 40];
    
    // Generate insights
    const bestPerformingChallengeTypes = ['strength', 'consistency'];
    const areasForImprovement = ['endurance', 'skill'];
    const motivationalTriggers = ['progress-tracking', 'social-comparison'];
    const engagementPatterns = ['weekday-morning', 'weekend-afternoon'];
    
    // Generate recommendations
    const suggestedChallenges = ['endurance-challenge', 'skill-challenge'];
    const skillDevelopmentAreas = ['cardio', 'flexibility'];
    const socialOpportunities = ['join-team', 'friend-challenge'];
    
    return {
      userId: this.userProfile.userId,
      period,
      metrics: {
        challengesStarted,
        challengesCompleted,
        challengesCompletionRate,
        achievementsUnlocked,
        pointsEarned: this.userProfile.totalPoints,
        xpGained: this.userProfile.xp,
        socialInteractions: this.userProfile.statistics.socialInteractions,
        leaderboardRank: this.getUserRankInLeaderboard('leaderboard-1')?.rank,
        engagementScore: 75 // Simplified calculation
      },
      trends: {
        weeklyChallengeCompletion,
        dailyActivity,
        achievementProgression
      },
      insights: {
        bestPerformingChallengeTypes,
        areasForImprovement,
        motivationalTriggers,
        engagementPatterns
      },
      recommendations: {
        suggestedChallenges,
        skillDevelopmentAreas,
        socialOpportunities
      }
    };
  }

  public updateUserPreferences(preferences: Partial<GamificationPreferences>): void {
    this.userProfile.preferences = {
      ...this.userProfile.preferences,
      ...preferences
    };
    this.userProfile.updatedAt = new Date();
  }

  public updateUserContext(context: Partial<UserContext>): void {
    this.userContext = {
      ...this.userContext,
      ...context
    };
  }

  public getConfig(): GamificationConfig {
    return { ...this.config };
  }

  public updateConfig(config: Partial<GamificationConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  public getAvatarCustomization(): AvatarCustomization {
    return { ...this.userProfile.avatar };
  }

  public updateAvatarCustomization(customization: Partial<AvatarCustomization>): void {
    this.userProfile.avatar = {
      ...this.userProfile.avatar,
      ...customization
    };
    this.userProfile.updatedAt = new Date();
  }

  public getBadges(): Badge[] {
    return [...this.userProfile.badges];
  }

  public getStatistics(): UserStatistics {
    return { ...this.userProfile.statistics };
  }

  public resetUserProgress(): void {
    this.userProfile.level = 1;
    this.userProfile.xp = 0;
    this.userProfile.xpToNextLevel = 100;
    this.userProfile.totalPoints = 0;
    this.userProfile.badges = [];
    this.userProfile.statistics = {
      challengesCompleted: 0,
      challengesFailed: 0,
      achievementsUnlocked: 0,
      totalPointsEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      socialInteractions: 0,
      skillMastery: {}
    };
    this.userProfile.updatedAt = new Date();
    
    // Reset challenges
    this.challenges.forEach(challenge => {
      challenge.status = 'available';
      challenge.currentValue = 0;
      challenge.progress = 0;
      challenge.updatedAt = new Date();
    });
    
    // Reset achievements
    this.achievements.forEach(achievement => {
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
      achievement.unlockProgress = 0;
      achievement.updatedAt = new Date();
    });
  }
}
