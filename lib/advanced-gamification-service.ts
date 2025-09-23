/**
 * Advanced Gamification Service - "Sistema de Gamificación Avanzada"
 * 
 * This service implements an advanced gamification system that motivates users through
 * achievements, medals, rankings, and personalized challenges based on real progress.
 * 
 * Features:
 * - Achievement System with dynamic unlock conditions
 * - Medal System with visual representations and rarity tiers
 * - Ranking System with multiple categories and timeframes
 * - Personalized Challenge Generator based on user progress
 * - Visual Feedback System without saturating the main experience
 * - Integration with Spartan Nervous System for real-time updates
 * - Integration with Chat Maestro for motivational feedback
 */

import { logger } from './logger';
import { spartanNervousSystem, NervousSystemEvent } from './spartan-nervous-system';
import { chatMaestroService } from './chat-maestro-service';
import { dataManagementService, DataManagementService } from './data-management-service';
import { storageManager } from './storage';
import { 
  UserData, 
  WorkoutSession, 
  RecoveryAnalysis, 
  ProgressionPlan 
} from './types';

// Types for Advanced Gamification System

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'skill' | 'consistency' | 'recovery' | 'nutrition' | 'community' | 'special';
  criteria: AchievementCriteria;
  reward: GamificationReward;
  unlocked: boolean;
  unlockedAt?: Date;
  unlockProgress: number; // 0-100
  isHidden: boolean;
  dependencies?: string[]; // IDs of other achievements required first
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  visualRepresentation: string; // URL or identifier for achievement image
  isAnimated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AchievementCriteria {
  type: 'workout-count' | 'streak-days' | 'personal-record' | 'challenge-completion' | 
        'social-interaction' | 'skill-demonstration' | 'time-based' | 'metric' | 'custom';
  targetValue: number;
  currentValue: number;
  unit?: string;
  relatedEntityId?: string; // ID of workout, exercise, etc.
  timeWindow?: {
    start: Date;
    end: Date;
  };
  conditions?: AchievementCondition[];
}

export interface AchievementCondition {
  type: 'energy-level' | 'recovery-status' | 'stress-level' | 'sleep-quality' | 'nutrition-status';
  operator: 'greater-than' | 'less-than' | 'equal' | 'greater-equal' | 'less-equal' | 'not-equal';
  value: number | string;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'consistency' | 'mastery' | 'community' | 'special';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'titanium';
  earnedAt: Date;
  visualRepresentation: string; // URL or identifier for medal image
  isAnimated: boolean;
  associatedAchievements: string[]; // IDs of achievements that contributed to this medal
}

export interface RankingEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  rank: number;
  progress?: number; // 0-100 for challenges
  lastUpdated: Date;
}

export interface Ranking {
  id: string;
  title: string;
  description: string;
  category: 'overall' | 'strength' | 'endurance' | 'skill' | 'consistency' | 'recovery' | 'community';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all-time';
  metric: string; // e.g., 'total-points', 'workouts-completed', 'challenge-success-rate'
  entries: RankingEntry[];
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'skill' | 'consistency' | 'recovery' | 'nutrition' | 'community' | 'special';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  duration: 'daily' | 'weekly' | 'monthly' | 'event';
  startDate: Date;
  endDate: Date;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0-100
  status: 'available' | 'active' | 'completed' | 'failed' | 'expired';
  reward: GamificationReward;
  requirements: ChallengeRequirement[];
  participants?: string[]; // For group challenges
  leaderboard?: RankingEntry[];
  personalizedForUser: boolean;
  basedOnUserProgress: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeRequirement {
  type: 'workout' | 'metric' | 'habit' | 'social' | 'completion' | 'energy-level' | 'recovery-status';
  targetId?: string; // ID of workout, habit, etc.
  minValue?: number;
  maxValue?: number;
  requiredCount?: number;
  completionText?: string;
  userContextCondition?: {
    type: 'energy-level' | 'recovery-status' | 'stress-level' | 'sleep-quality' | 'nutrition-status';
    operator: 'greater-than' | 'less-than' | 'equal' | 'greater-equal' | 'less-equal' | 'not-equal';
    value: number | string;
  };
}

export interface GamificationReward {
  type: 'points' | 'badge' | 'avatar-item' | 'discount' | 'achievement' | 'xp' | 'medal';
  value: number | string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  visualRepresentation?: string; // URL or identifier for visual asset
}

export interface UserGamificationProfile {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  achievements: Achievement[];
  medals: Medal[];
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  rankings: Ranking[];
  statistics: UserGamificationStatistics;
  preferences: GamificationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserGamificationStatistics {
  challengesCompleted: number;
  challengesFailed: number;
  achievementsUnlocked: number;
  totalPointsEarned: number;
  currentStreak: number;
  longestStreak: number;
  socialInteractions: number;
  skillMastery: Record<string, number>; // e.g., { 'squat-technique': 85 }
  categoryPerformance: Record<string, number>; // e.g., { 'strength': 75, 'endurance': 60 }
}

export interface GamificationPreferences {
  challengeDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  challengeFrequency: 'low' | 'medium' | 'high';
  notificationPreferences: {
    challengeStart: boolean;
    challengeProgress: boolean;
    challengeEnd: boolean;
    achievementUnlock: boolean;
    rankingUpdate: boolean;
    socialChallenge: boolean;
    medalEarned: boolean;
  };
  preferredChallengeTypes: string[]; // e.g., ['strength', 'endurance', 'community']
  socialFeatures: {
    rankingVisibility: 'public' | 'friends' | 'private';
    groupChallengeParticipation: boolean;
    achievementSharing: boolean;
  };
}

export interface GamificationNotification {
  id: string;
  userId: string;
  type: 'challenge-start' | 'challenge-progress' | 'challenge-end' | 
        'achievement-unlock' | 'ranking-update' | 'social-challenge' |
        'event-reminder' | 'level-up' | 'reward-earned' | 'medal-earned';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface GamificationEvent {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'tournament' | 'community-event' | 'seasonal' | 'achievement-milestone';
  startDate: Date;
  endDate: Date;
  challenges: string[]; // IDs of challenges included in the event
  rewards: GamificationReward[];
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
  rewards: GamificationReward[];
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

// Configuration interface
export interface AdvancedGamificationConfig {
  userId: string;
  enableGamification: boolean;
  enableNotifications: boolean;
  enableSocialFeatures: boolean;
  enableAvatarCustomization: boolean;
  enableRankings: boolean;
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

// Default configuration
const DEFAULT_CONFIG: AdvancedGamificationConfig = {
  userId: '',
  enableGamification: true,
  enableNotifications: true,
  enableSocialFeatures: true,
  enableAvatarCustomization: true,
  enableRankings: true,
  enableEvents: true,
  difficultySetting: 'adaptive',
  challengeCooldownPeriod: 24, // 24 hours
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
      difficulty: 2.0,
      rarity: 3.0
    }
  }
};

export class AdvancedGamificationService {
  private static instance: AdvancedGamificationService;
  private config: AdvancedGamificationConfig;
  private userProfiles: Map<string, UserGamificationProfile> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private medals: Map<string, Medal> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private rankings: Map<string, Ranking> = new Map();
  private events: GamificationEvent[] = [];
  private groupChallenges: GroupChallenge[] = [];
  private notifications: GamificationNotification[] = [];
  private isInitialized: boolean = false;

  static getInstance(): AdvancedGamificationService {
    if (!AdvancedGamificationService.instance) {
      AdvancedGamificationService.instance = new AdvancedGamificationService();
    }
    return AdvancedGamificationService.instance;
  }

  private constructor() {
    this.config = DEFAULT_CONFIG;
    this.initializeSystem();
  }

  /**
   * Initialize the Advanced Gamification System
   */
  private async initializeSystem(): Promise<void> {
    try {
      // Load achievements from storage
      await this.loadAchievements();
      
      // Load medals from storage
      await this.loadMedals();
      
      // Load challenges from storage
      await this.loadChallenges();
      
      // Load rankings from storage
      await this.loadRankings();
      
      // Subscribe to nervous system events for real-time updates
      this.subscribeToNervousSystemEvents();
      
      this.isInitialized = true;
      logger.info('AdvancedGamificationService: Initialized successfully');
    } catch (error) {
      logger.error('AdvancedGamificationService: Error during initialization', error);
    }
  }

  /**
   * Subscribe to nervous system events for real-time updates
   */
  private subscribeToNervousSystemEvents(): void {
    // Subscribe to data updated events
    spartanNervousSystem.subscribe('data_updated', (event) => {
      this.handleDataUpdatedEvent(event);
    });
    
    // Subscribe to user action events
    spartanNervousSystem.subscribe('user_action', (event) => {
      this.handleUserActionEvent(event);
    });
    
    // Subscribe to alert triggered events
    spartanNervousSystem.subscribe('alert_triggered', (event) => {
      this.handleAlertTriggeredEvent(event);
    });
  }

  /**
   * Handle data updated events from nervous system
   */
  private async handleDataUpdatedEvent(event: NervousSystemEvent): Promise<void> {
    try {
      const userId = event.userId;
      if (!userId) return;
      
      // Get user profile
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) return;
      
      // Update achievements based on new data
      await this.checkAndUnlockAchievements(userId);
      
      // Update challenge progress based on new data
      await this.updateChallengeProgress(userId);
      
      // Update rankings based on new data
      await this.updateRankings(userId);
      
      logger.info(`AdvancedGamificationService: Processed data updated event for user ${userId}`);
    } catch (error) {
      logger.error('AdvancedGamificationService: Error handling data updated event', error);
    }
  }

  /**
   * Handle user action events from nervous system
   */
  private async handleUserActionEvent(event: NervousSystemEvent): Promise<void> {
    try {
      const userId = event.userId;
      if (!userId) return;
      
      const actionType = event.payload?.actionType;
      if (!actionType) return;
      
      // Award XP for user actions
      await this.awardXPForAction(userId, actionType);
      
      // Check for achievements based on user actions
      await this.checkAndUnlockAchievements(userId);
      
      logger.info(`AdvancedGamificationService: Processed user action event: ${actionType} for user ${userId}`);
    } catch (error) {
      logger.error('AdvancedGamificationService: Error handling user action event', error);
    }
  }

  /**
   * Handle alert triggered events from nervous system
   */
  private async handleAlertTriggeredEvent(event: NervousSystemEvent): Promise<void> {
    try {
      const userId = event.userId;
      if (!userId) return;
      
      const alertType = event.payload?.type;
      if (!alertType) return;
      
      // Create special achievements or challenges based on alerts
      await this.createAlertBasedAchievements(userId, alertType);
      
      logger.info(`AdvancedGamificationService: Processed alert triggered event: ${alertType} for user ${userId}`);
    } catch (error) {
      logger.error('AdvancedGamificationService: Error handling alert triggered event', error);
    }
  }

  /**
   * Initialize user profile
   */
  private async initializeUserProfile(userId: string): Promise<UserGamificationProfile> {
    const defaultProfile: UserGamificationProfile = {
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
        preferredChallengeTypes: ['strength', 'endurance', 'consistency'],
        socialFeatures: {
          rankingVisibility: 'friends',
          groupChallengeParticipation: true,
          achievementSharing: true
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save to storage
    storageManager.setUserData(defaultProfile as any);
    this.userProfiles.set(userId, defaultProfile);
    
    return defaultProfile;
  }

  /**
   * Get user profile
   */
  public async getUserProfile(userId: string): Promise<UserGamificationProfile | null> {
    // Check if profile is already loaded in memory
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId) || null;
    }
    
    // Load from storage
    try {
      const profile = storageManager.getUserData() as any;
      if (profile) {
        this.userProfiles.set(userId, profile);
        return profile;
      }
    } catch (error) {
      logger.warn(`AdvancedGamificationService: Could not load profile for user ${userId}`, error);
    }
    
    // Initialize new profile if none exists
    return await this.initializeUserProfile(userId);
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(userId: string, profile: UserGamificationProfile): Promise<void> {
    profile.updatedAt = new Date();
    this.userProfiles.set(userId, profile);
    storageManager.setUserData(profile as any);
  }

  /**
   * Load achievements from storage
   */
  private async loadAchievements(): Promise<void> {
    try {
      // In a real implementation, this would load from a database or API
      // For now, we'll initialize with some sample achievements
      this.initializeSampleAchievements();
    } catch (error) {
      logger.error('AdvancedGamificationService: Error loading achievements', error);
    }
  }

  /**
   * Initialize sample achievements
   */
  private initializeSampleAchievements(): void {
    // First workout achievement
    const firstWorkout: Achievement = {
      id: 'achievement-first-workout',
      title: 'Primer Paso',
      description: 'Completa tu primer entrenamiento',
      category: 'consistency',
      criteria: {
        type: 'workout-count',
        targetValue: 1,
        currentValue: 0
      },
      reward: {
        type: 'points',
        value: 100,
        description: '100 puntos por tu primer entrenamiento',
        rarity: 'common'
      },
      unlocked: false,
      unlockProgress: 0,
      isHidden: false,
      rarity: 'common',
      visualRepresentation: 'first-workout-badge',
      isAnimated: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.achievements.set(firstWorkout.id, firstWorkout);
    
    // 7-day streak achievement
    const sevenDayStreak: Achievement = {
      id: 'achievement-7-day-streak',
      title: 'Consistencia Inquebrantable',
      description: 'Mantén una racha de 7 días de entrenamiento',
      category: 'consistency',
      criteria: {
        type: 'streak-days',
        targetValue: 7,
        currentValue: 0
      },
      reward: {
        type: 'medal',
        value: 'bronze-consistency',
        description: 'Medalla de Bronce por Consistencia',
        rarity: 'uncommon',
        visualRepresentation: 'bronze-consistency-medal'
      },
      unlocked: false,
      unlockProgress: 0,
      isHidden: false,
      rarity: 'uncommon',
      visualRepresentation: '7-day-streak-badge',
      isAnimated: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.achievements.set(sevenDayStreak.id, sevenDayStreak);
    
    // 100kg squat achievement
    const hundredKgSquat: Achievement = {
      id: 'achievement-100kg-squat',
      title: 'Fuerza de Titan',
      description: 'Alcanza 100kg en sentadilla',
      category: 'strength',
      criteria: {
        type: 'personal-record',
        targetValue: 100,
        currentValue: 0,
        unit: 'kg',
        relatedEntityId: 'squat'
      },
      reward: {
        type: 'medal',
        value: 'gold-strength',
        description: 'Medalla de Oro por Fuerza',
        rarity: 'rare',
        visualRepresentation: 'gold-strength-medal'
      },
      unlocked: false,
      unlockProgress: 0,
      isHidden: false,
      rarity: 'rare',
      visualRepresentation: '100kg-squat-badge',
      isAnimated: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.achievements.set(hundredKgSquat.id, hundredKgSquat);
  }

  /**
   * Load medals from storage
   */
  private async loadMedals(): Promise<void> {
    try {
      // In a real implementation, this would load from a database or API
      // For now, we'll initialize with some sample medals
      this.initializeSampleMedals();
    } catch (error) {
      logger.error('AdvancedGamificationService: Error loading medals', error);
    }
  }

  /**
   * Initialize sample medals
   */
  private initializeSampleMedals(): void {
    // Bronze consistency medal
    const bronzeConsistency: Medal = {
      id: 'medal-bronze-consistency',
      title: 'Consistencia de Bronce',
      description: 'Otorgada por mantener una racha consistente de entrenamiento',
      category: 'consistency',
      rarity: 'bronze',
      earnedAt: new Date(0), // Not earned yet
      visualRepresentation: 'bronze-consistency-medal',
      isAnimated: false,
      associatedAchievements: ['achievement-7-day-streak']
    };
    this.medals.set(bronzeConsistency.id, bronzeConsistency);
    
    // Gold strength medal
    const goldStrength: Medal = {
      id: 'medal-gold-strength',
      title: 'Fuerza de Oro',
      description: 'Otorgada por alcanzar un hito excepcional en fuerza',
      category: 'performance',
      rarity: 'gold',
      earnedAt: new Date(0), // Not earned yet
      visualRepresentation: 'gold-strength-medal',
      isAnimated: true,
      associatedAchievements: ['achievement-100kg-squat']
    };
    this.medals.set(goldStrength.id, goldStrength);
  }

  /**
   * Load challenges from storage
   */
  private async loadChallenges(): Promise<void> {
    try {
      // In a real implementation, this would load from a database or API
      // For now, we'll initialize with some sample challenges
      this.initializeSampleChallenges();
    } catch (error) {
      logger.error('AdvancedGamificationService: Error loading challenges', error);
    }
  }

  /**
   * Initialize sample challenges
   */
  private initializeSampleChallenges(): void {
    // Weekly strength challenge
    const weeklyStrength: Challenge = {
      id: 'challenge-weekly-strength',
      title: 'Fuerza Semanal',
      description: 'Completa 3 sesiones de entrenamiento de fuerza esta semana',
      category: 'strength',
      difficulty: 'intermediate',
      duration: 'weekly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      targetValue: 3,
      currentValue: 0,
      unit: 'sesiones',
      progress: 0,
      status: 'available',
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
          requiredCount: 3
        }
      ],
      personalizedForUser: false,
      basedOnUserProgress: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.challenges.set(weeklyStrength.id, weeklyStrength);
    
    // Monthly endurance challenge
    const monthlyEndurance: Challenge = {
      id: 'challenge-monthly-endurance',
      title: 'Resistencia Mensual',
      description: 'Completa 12 sesiones de entrenamiento de resistencia este mes',
      category: 'endurance',
      difficulty: 'advanced',
      duration: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      targetValue: 12,
      currentValue: 0,
      unit: 'sesiones',
      progress: 0,
      status: 'available',
      reward: {
        type: 'medal',
        value: 'silver-endurance',
        description: 'Medalla de Plata por Resistencia',
        rarity: 'rare',
        visualRepresentation: 'silver-endurance-medal'
      },
      requirements: [
        {
          type: 'workout',
          targetId: 'endurance-workout',
          requiredCount: 12
        }
      ],
      personalizedForUser: false,
      basedOnUserProgress: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.challenges.set(monthlyEndurance.id, monthlyEndurance);
  }

  /**
   * Load rankings from storage
   */
  private async loadRankings(): Promise<void> {
    try {
      // In a real implementation, this would load from a database or API
      // For now, we'll initialize with some sample rankings
      this.initializeSampleRankings();
    } catch (error) {
      logger.error('AdvancedGamificationService: Error loading rankings', error);
    }
  }

  /**
   * Initialize sample rankings
   */
  private initializeSampleRankings(): void {
    // Overall weekly ranking
    const weeklyRanking: Ranking = {
      id: 'ranking-weekly-overall',
      title: 'Ranking Semanal General',
      description: 'Usuarios con más puntos esta semana',
      category: 'overall',
      timeframe: 'weekly',
      metric: 'total-points',
      entries: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.rankings.set(weeklyRanking.id, weeklyRanking);
  }

  /**
   * Check and unlock achievements based on user progress
   */
  private async checkAndUnlockAchievements(userId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    // Get user data from data management service
    const integratedData = dataManagementService.getInstance().integratedData;
    const userData = integratedData?.userData || null;
    const workoutSessions = integratedData?.workoutSessions || [];
    const recoveryData = integratedData?.recoveryData || [];

    // Check each achievement
    for (const [achievementId, achievement] of this.achievements) {
      if (achievement.unlocked) continue;

      // Check if achievement criteria are met
      const isUnlocked = await this.checkAchievementCriteria(
        achievement, 
        userData, 
        workoutSessions, 
        recoveryData
      );

      if (isUnlocked) {
        await this.unlockAchievement(userId, achievementId);
      }
    }
  }

  /**
   * Check if achievement criteria are met
   */
  private async checkAchievementCriteria(
    achievement: Achievement,
    userData: UserData,
    workoutSessions: WorkoutSession[],
    recoveryData: RecoveryAnalysis[]
  ): Promise<boolean> {
    // Implementation would check various criteria based on achievement type
    // This is a simplified implementation
    switch (achievement.criteria.type) {
      case 'workout-count':
        return workoutSessions.length >= achievement.criteria.targetValue;
      
      case 'streak-days':
        // Check for consecutive workout days
        return this.calculateWorkoutStreak(workoutSessions) >= achievement.criteria.targetValue;
      
      case 'personal-record':
        // Check if user has achieved a personal record
        return this.checkPersonalRecord(
          workoutSessions, 
          achievement.criteria.relatedEntityId || '', 
          achievement.criteria.targetValue
        );
      
      default:
        return false;
    }
  }

  /**
   * Calculate workout streak
   */
  private calculateWorkoutStreak(workoutSessions: WorkoutSession[]): number {
    if (workoutSessions.length === 0) return 0;
    
    // Sort sessions by date
    const sortedSessions = [...workoutSessions].sort((a, b) => 
      (a.startTime ? new Date(a.startTime).getTime() : 0) - (b.startTime ? new Date(b.startTime).getTime() : 0)
    );
    
    let streak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < sortedSessions.length; i++) {
      const previousDate = sortedSessions[i-1].startTime ? new Date(sortedSessions[i-1].startTime!) : new Date();
      const currentDate = sortedSessions[i].startTime ? new Date(sortedSessions[i].startTime!) : new Date();
      
      // Check if sessions are consecutive days
      const timeDiff = currentDate.getTime() - previousDate.getTime();
      const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
      
      if (dayDiff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else if (dayDiff > 1) {
        streak = 1;
      }
    }
    
    return maxStreak;
  }

  /**
   * Check if user has achieved a personal record
   */
  private checkPersonalRecord(
    workoutSessions: WorkoutSession[], 
    exerciseId: string, 
    targetValue: number
  ): boolean {
    // Implementation would check if user has achieved a personal record
    // This is a simplified implementation
    return false;
  }

  /**
   * Unlock an achievement for a user
   */
  public async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return;

    // Mark achievement as unlocked
    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    achievement.updatedAt = new Date();

    // Update user profile
    userProfile.achievements.push(achievement);
    userProfile.statistics.achievementsUnlocked++;
    userProfile.updatedAt = new Date();

    // Award rewards
    await this.awardAchievementRewards(userId, achievement.reward);

    // Check for medal unlocks
    await this.checkMedalUnlocks(userId, achievementId);

    // Update profile
    await this.updateUserProfile(userId, userProfile);

    // Create notification
    await this.createNotification({
      userId,
      type: 'achievement-unlock',
      title: '¡Logro desbloqueado!',
      message: `Has desbloqueado: ${achievement.title}`,
      priority: 'high',
      read: false,
      actionUrl: `/achievements/${achievement.id}`
    });

    // Notify Chat Maestro
    await this.notifyChatMaestroOfAchievement(userId, achievement);

    logger.info(`AdvancedGamificationService: Achievement ${achievementId} unlocked for user ${userId}`);
  }

  /**
   * Award rewards for achievement
   */
  private async awardAchievementRewards(userId: string, reward: GamificationReward): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    switch (reward.type) {
      case 'points':
        userProfile.totalPoints += Number(reward.value);
        userProfile.statistics.totalPointsEarned += Number(reward.value);
        break;
      
      case 'xp':
        userProfile.xp += Number(reward.value);
        await this.checkLevelUp(userId);
        break;
      
      case 'medal':
        // Medals are handled separately in checkMedalUnlocks
        break;
      
      case 'badge':
        // Badges are part of achievements
        break;
    }

    await this.updateUserProfile(userId, userProfile);
  }

  /**
   * Check for medal unlocks based on achievements
   */
  private async checkMedalUnlocks(userId: string, achievementId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    // Check each medal to see if its requirements are met
    for (const [medalId, medal] of this.medals) {
      // Check if user already has this medal
      const hasMedal = userProfile.medals.some(m => m.id === medalId);
      if (hasMedal) continue;

      // Check if all associated achievements are unlocked
      const allAchievementsUnlocked = medal.associatedAchievements.every(achId => {
        return userProfile.achievements.some(a => a.id === achId && a.unlocked);
      });

      if (allAchievementsUnlocked) {
        await this.awardMedal(userId, medalId);
      }
    }
  }

  /**
   * Award a medal to a user
   */
  private async awardMedal(userId: string, medalId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    const medal = this.medals.get(medalId);
    if (!medal) return;

    // Update medal with earned date
    medal.earnedAt = new Date();

    // Add to user profile
    userProfile.medals.push(medal);
    userProfile.updatedAt = new Date();

    // Update profile
    await this.updateUserProfile(userId, userProfile);

    // Create notification
    await this.createNotification({
      userId,
      type: 'medal-earned',
      title: '¡Medalla obtenida!',
      message: `Has ganado la medalla: ${medal.title}`,
      priority: 'high',
      read: false,
      actionUrl: `/medals/${medal.id}`
    });

    logger.info(`AdvancedGamificationService: Medal ${medalId} awarded to user ${userId}`);
  }

  /**
   * Check level up
   */
  private async checkLevelUp(userId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    if (userProfile.xp >= userProfile.xpToNextLevel) {
      userProfile.level++;
      userProfile.xp -= userProfile.xpToNextLevel;
      userProfile.xpToNextLevel = Math.floor(userProfile.xpToNextLevel * 1.5);
      userProfile.updatedAt = new Date();

      // Update profile
      await this.updateUserProfile(userId, userProfile);

      // Create notification
      await this.createNotification({
        userId,
        type: 'level-up',
        title: '¡Subiste de nivel!',
        message: `¡Felicidades! Ahora eres nivel ${userProfile.level}`,
        priority: 'high',
        read: false
      });

      logger.info(`AdvancedGamificationService: User ${userId} leveled up to ${userProfile.level}`);
    }
  }

  /**
   * Notify Chat Maestro of achievement
   */
  private async notifyChatMaestroOfAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      // Get user context
      const context = await dataManagementService.getChatContext();
      
      // Send a motivational message through Chat Maestro
      const message = `¡Increíble trabajo! Has desbloqueado el logro "${achievement.title}". ${achievement.description}`;
      
      // In a real implementation, this would send a message through Chat Maestro
      logger.info(`AdvancedGamificationService: Notifying Chat Maestro of achievement: ${message}`);
    } catch (error) {
      logger.error('AdvancedGamificationService: Error notifying Chat Maestro of achievement', error);
    }
  }

  /**
   * Update challenge progress
   */
  private async updateChallengeProgress(userId: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    // Update progress for each active challenge
    for (const challenge of userProfile.activeChallenges) {
      // Update progress based on user data
      await this.updateSingleChallengeProgress(userId, challenge);
    }
  }

  /**
   * Update progress for a single challenge
   */
  private async updateSingleChallengeProgress(userId: string, challenge: Challenge): Promise<void> {
    // Implementation would update challenge progress based on user data
    // This is a simplified implementation
  }

  /**
   * Update rankings
   */
  private async updateRankings(userId: string): Promise<void> {
    // Implementation would update rankings based on user data
    // This is a simplified implementation
  }

  /**
   * Award XP for user action
   */
  private async awardXPForAction(userId: string, actionType: string): Promise<void> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return;

    let xpToAdd = 0;

    switch (actionType) {
      case 'workout_completed':
        xpToAdd = this.config.xpSystem.xpPerWorkout;
        break;
      case 'challenge_completed':
        xpToAdd = this.config.xpSystem.xpPerChallenge;
        break;
      case 'achievement_unlocked':
        xpToAdd = this.config.xpSystem.xpPerAchievement;
        break;
      case 'social_interaction':
        xpToAdd = this.config.xpSystem.xpPerSocialInteraction;
        break;
    }

    if (xpToAdd > 0) {
      userProfile.xp += xpToAdd;
      userProfile.updatedAt = new Date();
      await this.updateUserProfile(userId, userProfile);
      await this.checkLevelUp(userId);
    }
  }

  /**
   * Create alert-based achievements
   */
  private async createAlertBasedAchievements(userId: string, alertType: string): Promise<void> {
    // Implementation would create special achievements based on system alerts
    // This is a simplified implementation
  }

  /**
   * Create a notification
   */
  private async createNotification(notificationData: Omit<GamificationNotification, 'id' | 'createdAt' | 'updatedAt'>): Promise<GamificationNotification> {
    const notification: GamificationNotification = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notifications.push(notification);
    return notification;
  }

  /**
   * Generate personalized challenges based on user progress
   */
  public async generatePersonalizedChallenges(userId: string): Promise<Challenge[]> {
    const userProfile = await this.getUserProfile(userId);
    if (!userProfile) return [];

    // Get user data
    const integratedData = dataManagementService.getInstance().integratedData;
    const userData = integratedData?.userData || null;
    const workoutSessions = integratedData?.workoutSessions || [];
    const recoveryData = integratedData?.recoveryData || [];

    const challenges: Challenge[] = [];

    // Generate challenges based on user progress and preferences
    // This is a simplified implementation

    // Weekly consistency challenge
    const consistencyChallenge: Challenge = {
      id: `challenge-consistency-${userId}-${Date.now()}`,
      title: 'Racha de Consistencia',
      description: 'Mantén tu racha de entrenamiento esta semana',
      category: 'consistency',
      difficulty: 'intermediate',
      duration: 'weekly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      targetValue: 5,
      currentValue: 0,
      unit: 'días',
      progress: 0,
      status: 'available',
      reward: {
        type: 'points',
        value: 200,
        description: '200 puntos por mantener tu racha',
        rarity: 'uncommon'
      },
      requirements: [
        {
          type: 'workout',
          requiredCount: 5
        }
      ],
      personalizedForUser: true,
      basedOnUserProgress: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    challenges.push(consistencyChallenge);

    // Strength progression challenge
    const strengthChallenge: Challenge = {
      id: `challenge-strength-${userId}-${Date.now()}`,
      title: 'Progresión de Fuerza',
      description: 'Incrementa tu fuerza en un 10% esta semana',
      category: 'strength',
      difficulty: 'advanced',
      duration: 'weekly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      targetValue: 10,
      currentValue: 0,
      unit: 'porcentaje',
      progress: 0,
      status: 'available',
      reward: {
        type: 'medal',
        value: 'bronze-strength',
        description: 'Medalla de Bronce por Progresión de Fuerza',
        rarity: 'rare',
        visualRepresentation: 'bronze-strength-medal'
      },
      requirements: [
        {
          type: 'metric',
          targetId: 'strength-index',
          minValue: 10
        }
      ],
      personalizedForUser: true,
      basedOnUserProgress: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    challenges.push(strengthChallenge);

    return challenges;
  }

  /**
   * Get user achievements
   */
  public async getUserAchievements(userId: string): Promise<Achievement[]> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? userProfile.achievements : [];
  }

  /**
   * Get user medals
   */
  public async getUserMedals(userId: string): Promise<Medal[]> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? userProfile.medals : [];
  }

  /**
   * Get user rankings
   */
  public async getUserRankings(userId: string): Promise<Ranking[]> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? userProfile.rankings : [];
  }

  /**
   * Get active challenges
   */
  public async getActiveChallenges(userId: string): Promise<Challenge[]> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? userProfile.activeChallenges : [];
  }

  /**
   * Get completed challenges
   */
  public async getCompletedChallenges(userId: string): Promise<Challenge[]> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? userProfile.completedChallenges : [];
  }

  /**
   * Get user statistics
   */
  public async getUserStatistics(userId: string): Promise<UserGamificationStatistics> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? userProfile.statistics : {
      challengesCompleted: 0,
      challengesFailed: 0,
      achievementsUnlocked: 0,
      totalPointsEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      socialInteractions: 0,
      skillMastery: {},
      categoryPerformance: {}
    };
  }

  /**
   * Get user level information
   */
  public async getUserLevelInfo(userId: string): Promise<{ level: number; xp: number; xpToNextLevel: number }> {
    const userProfile = await this.getUserProfile(userId);
    return userProfile ? {
      level: userProfile.level,
      xp: userProfile.xp,
      xpToNextLevel: userProfile.xpToNextLevel
    } : {
      level: 1,
      xp: 0,
      xpToNextLevel: 100
    };
  }

  /**
   * Get unread notifications
   */
  public async getUnreadNotifications(userId: string): Promise<GamificationNotification[]> {
    return this.notifications.filter(n => n.userId === userId && !n.read);
  }

  /**
   * Mark notification as read
   */
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.updatedAt = new Date();
    }
  }

  /**
   * Get gamification configuration
   */
  public getConfig(): AdvancedGamificationConfig {
    return { ...this.config };
  }

  /**
   * Update gamification configuration
   */
  public async updateConfig(config: Partial<AdvancedGamificationConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    // Cleanup any resources if needed
    logger.info('AdvancedGamificationService: Cleanup completed');
  }
}

// Export singleton instance
export const advancedGamificationService = AdvancedGamificationService.getInstance();