/**
 * Gamification System - Advanced Motivation & Engagement Engine
 * Sistema futurista de retos, niveles, recompensas y logros
 */

export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  levelName: string;
  levelTier: 'Initiate' | 'Warrior' | 'Elite' | 'Master' | 'Legend' | 'Quantum';
  prestigeLevel: number;
  biomolecularRank: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'endurance' | 'consistency' | 'nutrition' | 'recovery' | 'quantum' | 'biomolecular';
  type: 'milestone' | 'streak' | 'performance' | 'social' | 'exploration' | 'mastery';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'quantum';
  requirements: {
    metric: string;
    value: number;
    timeframe?: string;
    conditions?: string[];
  };
  rewards: Reward[];
  xpReward: number;
  isSecret: boolean;
  unlockDate?: Date;
  rarity: number; // 0-100, higher = more rare
  biomolecularImpact: {
    mitochondrialBoost: number;
    neuralPlasticity: number;
    cellularRegeneration: number;
  };
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'community' | 'quantum';
  category: 'fitness' | 'nutrition' | 'recovery' | 'mindset' | 'hybrid';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme' | 'quantum';
  objectives: ChallengeObjective[];
  startDate: Date;
  endDate: Date;
  maxParticipants?: number;
  currentParticipants: number;
  rewards: Reward[];
  xpReward: number;
  prestigeBonus: number;
  quantumMultiplier: number;
  isActive: boolean;
  requirements?: {
    minLevel: number;
    achievements: string[];
    equipment?: string[];
  };
}

export interface ChallengeObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  weight: number; // Contribution to overall challenge completion
  isCompleted: boolean;
  biomolecularReward: number;
}

export interface Reward {
  id: string;
  name: string;
  type: 'xp' | 'item' | 'currency' | 'cosmetic' | 'ability' | 'biomolecular' | 'quantum';
  category: 'consumable' | 'equipment' | 'enhancement' | 'avatar' | 'title' | 'unlock';
  value: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'quantum';
  icon: string;
  effects?: {
    duration: number; // minutes
    boosts: {
      [metric: string]: number; // percentage boost
    };
  };
  quantumProperties?: {
    coherenceLevel: number;
    entanglementBonus: number;
    dimensionalAccess: string[];
  };
}

export interface UserProgress {
  userId: string;
  level: UserLevel;
  achievements: {
    [achievementId: string]: {
      unlockedDate: Date;
      progress: number;
      isCompleted: boolean;
    };
  };
  activeChallenges: {
    [challengeId: string]: {
      joinedDate: Date;
      progress: ChallengeObjective[];
      isCompleted: boolean;
      rewards: Reward[];
    };
  };
  inventory: {
    [rewardId: string]: {
      quantity: number;
      acquiredDate: Date;
      isActive?: boolean;
    };
  };
  statistics: {
    totalWorkouts: number;
    totalXP: number;
    achievementsUnlocked: number;
    challengesCompleted: number;
    streaks: {
      current: number;
      best: number;
      type: string;
    }[];
    biomolecularEnhancements: {
      totalBoosts: number;
      activeEnhancements: string[];
      quantumCoherence: number;
    };
  };
  motivationProfile: {
    preferredChallengeTypes: string[];
    achievementHunter: boolean;
    competitiveLevel: number;
    explorationPreference: number;
  };
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  achievements: number;
  biomolecularRank: number;
  quantumCoherence: number;
  rank: number;
  tier: string;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  theme: string;
  description: string;
  startDate: Date;
  endDate: Date;
  specialChallenges: Challenge[];
  exclusiveRewards: Reward[];
  leaderboard: LeaderboardEntry[];
  biomolecularResearch: {
    topic: string;
    participants: number;
    discoveries: string[];
  };
}

export class GamificationEngine {
  private achievements: Map<string, Achievement> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private rewards: Map<string, Reward> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private activeCommunityEvents: SeasonalEvent[] = [];

  constructor() {
    this.initializeAchievements();
    this.initializeChallenges();
    this.initializeRewards();
    this.initializeSeasonalEvents();
  }

  /**
   * Calculate user level progression with quantum mechanics
   */
  public calculateLevelProgression(totalXP: number, quantumCoherence: number = 0): UserLevel {
    // Exponential XP curve with quantum bonuses
    const baseXP = 1000;
    const exponent = 1.5;
    const quantumMultiplier = 1 + (quantumCoherence * 0.1);
    
    let level = 1;
    let xpRequired = baseXP;
    let totalXPRequired = 0;
    
    while (totalXPRequired + xpRequired <= totalXP * quantumMultiplier) {
      totalXPRequired += xpRequired;
      level++;
      xpRequired = Math.floor(baseXP * Math.pow(level, exponent));
    }
    
    const currentXP = (totalXP * quantumMultiplier) - totalXPRequired;
    const xpToNextLevel = xpRequired - currentXP;
    
    return {
      currentLevel: level,
      currentXP,
      xpToNextLevel,
      totalXP,
      levelName: this.getLevelName(level),
      levelTier: this.getLevelTier(level),
      prestigeLevel: Math.floor(level / 100),
      biomolecularRank: this.calculateBiomolecularRank(level, quantumCoherence)
    };
  }

  /**
   * Process achievement unlock with biomolecular rewards
   */
  public checkAchievementProgress(
    userId: string,
    metric: string,
    value: number,
    context: any = {}
  ): { unlockedAchievements: Achievement[]; biomolecularBoosts: any[] } {
    const userProgress = this.getUserProgress(userId);
    const unlockedAchievements: Achievement[] = [];
    const biomolecularBoosts: any[] = [];

    for (const [achievementId, achievement] of this.achievements) {
      const progress = userProgress.achievements[achievementId];
      
      if (!progress || progress.isCompleted) continue;

      if (this.checkAchievementRequirement(achievement, metric, value, context, userProgress)) {
        achievement.unlockDate = new Date();
        progress.isCompleted = true;
        progress.progress = 100;
        
        unlockedAchievements.push(achievement);
        
        // Apply XP reward
        this.addXP(userId, achievement.xpReward);
        
        // Apply biomolecular enhancements
        const bioBoost = this.applyBiomolecularEnhancement(userId, achievement.biomolecularImpact);
        biomolecularBoosts.push(bioBoost);
        
        // Add rewards to inventory
        achievement.rewards.forEach(reward => {
          this.addRewardToInventory(userId, reward);
        });
      }
    }

    return { unlockedAchievements, biomolecularBoosts };
  }

  /**
   * Generate dynamic challenges based on user progress
   */
  public generateDynamicChallenges(userId: string): Challenge[] {
    const userProgress = this.getUserProgress(userId);
    const challenges: Challenge[] = [];
    
    // Personalized daily challenges
    const dailyChallenge = this.createPersonalizedChallenge(
      'daily',
      userProgress.level.currentLevel,
      userProgress.motivationProfile
    );
    challenges.push(dailyChallenge);
    
    // Weekly progression challenge
    const weeklyChallenge = this.createProgressionChallenge(
      'weekly',
      userProgress.statistics,
      userProgress.level.currentLevel
    );
    challenges.push(weeklyChallenge);
    
    // Quantum research challenge (for advanced users)
    if (userProgress.level.currentLevel >= 50) {
      const quantumChallenge = this.createQuantumChallenge(
        userProgress.statistics.biomolecularEnhancements.quantumCoherence
      );
      challenges.push(quantumChallenge);
    }

    return challenges;
  }

  /**
   * Process challenge completion with community rewards
   */
  public processChallengeCompletion(
    userId: string,
    challengeId: string
  ): {
    rewards: Reward[];
    xpGained: number;
    prestigeBonus: number;
    communityImpact: number;
  } {
    const challenge = this.challenges.get(challengeId);
    const userProgress = this.getUserProgress(userId);
    
    if (!challenge || !userProgress.activeChallenges[challengeId]) {
      throw new Error('Challenge not found or not active');
    }

    const challengeProgress = userProgress.activeChallenges[challengeId];
    const completionPercentage = this.calculateChallengeCompletion(challengeProgress.progress);
    
    if (completionPercentage < 100) {
      throw new Error('Challenge not completed');
    }

    // Calculate rewards with quantum multipliers
    const baseXP = challenge.xpReward;
    const quantumMultiplier = challenge.quantumMultiplier;
    const finalXP = Math.floor(baseXP * quantumMultiplier);
    
    // Add XP and prestige
    this.addXP(userId, finalXP);
    this.addPrestige(userId, challenge.prestigeBonus);
    
    // Add challenge rewards
    challenge.rewards.forEach(reward => {
      this.addRewardToInventory(userId, reward);
    });
    
    // Calculate community impact
    const communityImpact = this.calculateCommunityImpact(challenge, completionPercentage);
    
    challengeProgress.isCompleted = true;
    challengeProgress.rewards = challenge.rewards;
    
    return {
      rewards: challenge.rewards,
      xpGained: finalXP,
      prestigeBonus: challenge.prestigeBonus,
      communityImpact
    };
  }

  /**
   * Generate leaderboards with quantum rankings
   */
  public generateLeaderboards(
    timeframe: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'weekly',
    category: 'xp' | 'achievements' | 'biomolecular' | 'quantum' = 'xp'
  ): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = [];
    
    for (const [userId, progress] of this.userProgress) {
      const entry: LeaderboardEntry = {
        userId,
        username: `User_${userId.slice(-4)}`, // Simplified for demo
        avatar: 'default_avatar.png',
        level: progress.level.currentLevel,
        totalXP: progress.level.totalXP,
        weeklyXP: this.calculateWeeklyXP(progress),
        achievements: progress.statistics.achievementsUnlocked,
        biomolecularRank: progress.level.biomolecularRank,
        quantumCoherence: progress.statistics.biomolecularEnhancements.quantumCoherence,
        rank: 0, // Will be set after sorting
        tier: progress.level.levelTier
      };
      entries.push(entry);
    }
    
    // Sort based on category
    entries.sort((a, b) => {
      switch (category) {
        case 'xp':
          return timeframe === 'weekly' ? b.weeklyXP - a.weeklyXP : b.totalXP - a.totalXP;
        case 'achievements':
          return b.achievements - a.achievements;
        case 'biomolecular':
          return b.biomolecularRank - a.biomolecularRank;
        case 'quantum':
          return b.quantumCoherence - a.quantumCoherence;
        default:
          return b.totalXP - a.totalXP;
      }
    });
    
    // Set ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    return entries;
  }

  /**
   * Create seasonal events with biomolecular research themes
   */
  public createSeasonalEvent(theme: string): SeasonalEvent {
    const eventId = `event_${Date.now()}`;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    const specialChallenges = this.generateEventChallenges(theme);
    const exclusiveRewards = this.generateEventRewards(theme);
    
    return {
      id: eventId,
      name: `${theme} Research Initiative`,
      theme,
      description: `Collaborate in cutting-edge ${theme} research while achieving your fitness goals`,
      startDate,
      endDate,
      specialChallenges,
      exclusiveRewards,
      leaderboard: [],
      biomolecularResearch: {
        topic: `${theme} Performance Enhancement`,
        participants: 0,
        discoveries: []
      }
    };
  }

  private initializeAchievements(): void {
    // Strength Achievements
    this.achievements.set('first-workout', {
      id: 'first-workout',
      name: 'Genesis Protocol',
      description: 'Complete your first SPARTAN workout',
      category: 'strength',
      type: 'milestone',
      difficulty: 'bronze',
      requirements: { metric: 'workouts_completed', value: 1 },
      rewards: [this.createReward('Welcome Boost', 'enhancement', 50)],
      xpReward: 100,
      isSecret: false,
      rarity: 10,
      biomolecularImpact: {
        mitochondrialBoost: 5,
        neuralPlasticity: 3,
        cellularRegeneration: 2
      }
    });

    this.achievements.set('strength-milestone-100', {
      id: 'strength-milestone-100',
      name: 'Quantum Strength Ascension',
      description: 'Achieve 100% strength improvement from baseline',
      category: 'strength',
      type: 'performance',
      difficulty: 'quantum',
      requirements: { metric: 'strength_improvement', value: 100 },
      rewards: [
        this.createReward('Quantum Muscle Enhancer', 'biomolecular', 200),
        this.createReward('Strength Master Title', 'title', 0)
      ],
      xpReward: 2500,
      isSecret: false,
      rarity: 85,
      biomolecularImpact: {
        mitochondrialBoost: 25,
        neuralPlasticity: 15,
        cellularRegeneration: 20
      }
    });

    // Consistency Achievements
    this.achievements.set('week-streak', {
      id: 'week-streak',
      name: 'Neural Pathway Formation',
      description: 'Complete workouts for 7 consecutive days',
      category: 'consistency',
      type: 'streak',
      difficulty: 'silver',
      requirements: { metric: 'workout_streak', value: 7 },
      rewards: [this.createReward('Consistency Booster', 'enhancement', 75)],
      xpReward: 300,
      isSecret: false,
      rarity: 30,
      biomolecularImpact: {
        mitochondrialBoost: 8,
        neuralPlasticity: 12,
        cellularRegeneration: 5
      }
    });

    // Quantum Achievements (Secret/Rare)
    this.achievements.set('quantum-coherence', {
      id: 'quantum-coherence',
      name: 'Biomolecular Harmonization',
      description: 'Achieve perfect synchronization between mind, body, and quantum field',
      category: 'quantum',
      type: 'mastery',
      difficulty: 'quantum',
      requirements: { 
        metric: 'quantum_coherence', 
        value: 95,
        conditions: ['level_100_plus', 'perfect_form_score', 'meditation_master']
      },
      rewards: [
        this.createReward('Quantum Consciousness Expansion', 'quantum', 1000),
        this.createReward('Reality Shifter Title', 'title', 0)
      ],
      xpReward: 10000,
      isSecret: true,
      rarity: 99,
      biomolecularImpact: {
        mitochondrialBoost: 50,
        neuralPlasticity: 50,
        cellularRegeneration: 50
      }
    });
  }

  private initializeChallenges(): void {
    // Daily Challenges
    this.challenges.set('daily-movement', {
      id: 'daily-movement',
      name: 'Biomolecular Activation Protocol',
      description: 'Activate your cellular energy systems through targeted movement',
      type: 'daily',
      category: 'fitness',
      difficulty: 'easy',
      objectives: [{
        id: 'obj-1',
        description: 'Complete 30 minutes of movement',
        target: 30,
        current: 0,
        unit: 'minutes',
        weight: 1.0,
        isCompleted: false,
        biomolecularReward: 10
      }],
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      currentParticipants: 0,
      rewards: [this.createReward('Daily Energy Boost', 'enhancement', 25)],
      xpReward: 100,
      prestigeBonus: 1,
      quantumMultiplier: 1.0,
      isActive: true
    });

    // Community Challenges
    this.challenges.set('community-research', {
      id: 'community-research',
      name: 'Collective Biomolecular Research',
      description: 'Join the global SPARTAN community in advancing human performance',
      type: 'community',
      category: 'hybrid',
      difficulty: 'medium',
      objectives: [
        {
          id: 'obj-1',
          description: 'Contribute workout data to research',
          target: 10,
          current: 0,
          unit: 'workouts',
          weight: 0.4,
          isCompleted: false,
          biomolecularReward: 50
        },
        {
          id: 'obj-2',
          description: 'Participate in biometric monitoring',
          target: 7,
          current: 0,
          unit: 'days',
          weight: 0.6,
          isCompleted: false,
          biomolecularReward: 75
        }
      ],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxParticipants: 1000,
      currentParticipants: 0,
      rewards: [
        this.createReward('Research Contributor Badge', 'cosmetic', 0),
        this.createReward('Biomolecular Dataset Access', 'unlock', 0)
      ],
      xpReward: 500,
      prestigeBonus: 10,
      quantumMultiplier: 1.5,
      isActive: true,
      requirements: {
        minLevel: 5,
        achievements: ['first-workout']
      }
    });
  }

  private initializeRewards(): void {
    // XP Boosters
    this.rewards.set('xp-boost-small', this.createReward('Neural Accelerator', 'enhancement', 50));
    this.rewards.set('xp-boost-large', this.createReward('Quantum Learning Amplifier', 'enhancement', 200));
    
    // Biomolecular Enhancements
    this.rewards.set('mito-boost', {
      id: 'mito-boost',
      name: 'Mitochondrial Optimization Serum',
      type: 'biomolecular',
      category: 'enhancement',
      value: 25,
      description: 'Increases energy production efficiency by 25% for 2 hours',
      rarity: 'epic',
      icon: 'mitochondria.svg',
      effects: {
        duration: 120,
        boosts: {
          energy_efficiency: 25,
          recovery_rate: 15
        }
      }
    });

    // Quantum Rewards
    this.rewards.set('quantum-essence', {
      id: 'quantum-essence',
      name: 'Quantum Field Resonance Crystal',
      type: 'quantum',
      category: 'enhancement',
      value: 100,
      description: 'Harmonizes with quantum field for enhanced performance',
      rarity: 'quantum',
      icon: 'quantum-crystal.svg',
      quantumProperties: {
        coherenceLevel: 75,
        entanglementBonus: 20,
        dimensionalAccess: ['performance_dimension', 'recovery_dimension']
      }
    });
  }

  private initializeSeasonalEvents(): void {
    const springEvent = this.createSeasonalEvent('Cellular Regeneration');
    this.activeCommunityEvents.push(springEvent);
  }

  // Helper methods
  private getLevelName(level: number): string {
    if (level < 10) return `SPARTAN Initiate ${level}`;
    if (level < 25) return `SPARTAN Warrior ${level}`;
    if (level < 50) return `SPARTAN Elite ${level}`;
    if (level < 75) return `SPARTAN Master ${level}`;
    if (level < 100) return `SPARTAN Legend ${level}`;
    return `SPARTAN Quantum ${level}`;
  }

  private getLevelTier(level: number): UserLevel['levelTier'] {
    if (level < 10) return 'Initiate';
    if (level < 25) return 'Warrior';
    if (level < 50) return 'Elite';
    if (level < 75) return 'Master';
    if (level < 100) return 'Legend';
    return 'Quantum';
  }

  private calculateBiomolecularRank(level: number, quantumCoherence: number): number {
    return Math.floor((level * 10) + (quantumCoherence * 5));
  }

  private createReward(name: string, type: string, value: number): Reward {
    return {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: type as any,
      category: 'enhancement',
      value,
      description: `${name} enhancement`,
      rarity: 'common',
      icon: 'default.svg'
    };
  }

  private getUserProgress(userId: string): UserProgress {
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, this.createDefaultUserProgress(userId));
    }
    return this.userProgress.get(userId)!;
  }

  private createDefaultUserProgress(userId: string): UserProgress {
    return {
      userId,
      level: this.calculateLevelProgression(0),
      achievements: {},
      activeChallenges: {},
      inventory: {},
      statistics: {
        totalWorkouts: 0,
        totalXP: 0,
        achievementsUnlocked: 0,
        challengesCompleted: 0,
        streaks: [],
        biomolecularEnhancements: {
          totalBoosts: 0,
          activeEnhancements: [],
          quantumCoherence: 0
        }
      },
      motivationProfile: {
        preferredChallengeTypes: ['fitness', 'consistency'],
        achievementHunter: false,
        competitiveLevel: 5,
        explorationPreference: 5
      }
    };
  }

  private checkAchievementRequirement(
    achievement: Achievement,
    metric: string,
    value: number,
    context: any,
    userProgress: UserProgress
  ): boolean {
    if (achievement.requirements.metric !== metric) return false;
    
    // Check basic requirement
    if (value < achievement.requirements.value) return false;
    
    // Check additional conditions
    if (achievement.requirements.conditions) {
      for (const condition of achievement.requirements.conditions) {
        if (!this.checkCondition(condition, userProgress, context)) {
          return false;
        }
      }
    }
    
    return true;
  }

  private checkCondition(condition: string, userProgress: UserProgress, context: any): boolean {
    // Implement condition checking logic
    switch (condition) {
      case 'level_100_plus':
        return userProgress.level.currentLevel >= 100;
      case 'perfect_form_score':
        return context.formScore >= 95;
      case 'meditation_master':
        return userProgress.achievements['meditation-master']?.isCompleted || false;
      default:
        return true;
    }
  }

  private addXP(userId: string, xp: number): void {
    const userProgress = this.getUserProgress(userId);
    userProgress.statistics.totalXP += xp;
    userProgress.level = this.calculateLevelProgression(
      userProgress.statistics.totalXP,
      userProgress.statistics.biomolecularEnhancements.quantumCoherence
    );
  }

  private addPrestige(userId: string, prestige: number): void {
    // Implementation for prestige system
  }

  private addRewardToInventory(userId: string, reward: Reward): void {
    const userProgress = this.getUserProgress(userId);
    if (!userProgress.inventory[reward.id]) {
      userProgress.inventory[reward.id] = {
        quantity: 0,
        acquiredDate: new Date()
      };
    }
    userProgress.inventory[reward.id].quantity += 1;
  }

  private applyBiomolecularEnhancement(userId: string, impact: Achievement['biomolecularImpact']): any {
    const userProgress = this.getUserProgress(userId);
    userProgress.statistics.biomolecularEnhancements.totalBoosts += 1;
    
    return {
      mitochondrialBoost: impact.mitochondrialBoost,
      neuralPlasticity: impact.neuralPlasticity,
      cellularRegeneration: impact.cellularRegeneration,
      appliedAt: new Date()
    };
  }

  private createPersonalizedChallenge(type: string, level: number, profile: any): Challenge {
    // Implementation for personalized challenge creation
    return this.challenges.get('daily-movement')!; // Simplified
  }

  private createProgressionChallenge(type: string, stats: any, level: number): Challenge {
    // Implementation for progression challenge creation
    return this.challenges.get('community-research')!; // Simplified
  }

  private createQuantumChallenge(coherence: number): Challenge {
    // Implementation for quantum challenge creation
    return this.challenges.get('community-research')!; // Simplified
  }

  private calculateChallengeCompletion(objectives: ChallengeObjective[]): number {
    const totalWeight = objectives.reduce((sum, obj) => sum + obj.weight, 0);
    const completedWeight = objectives
      .filter(obj => obj.isCompleted)
      .reduce((sum, obj) => sum + obj.weight, 0);
    
    return (completedWeight / totalWeight) * 100;
  }

  private calculateCommunityImpact(challenge: Challenge, completion: number): number {
    return challenge.currentParticipants * (completion / 100) * challenge.quantumMultiplier;
  }

  private calculateWeeklyXP(progress: UserProgress): number {
    // Simplified calculation - would track XP gained in last 7 days
    return Math.floor(progress.level.totalXP * 0.1);
  }

  private generateEventChallenges(theme: string): Challenge[] {
    // Implementation for generating theme-based challenges
    return [this.challenges.get('community-research')!];
  }

  private generateEventRewards(theme: string): Reward[] {
    // Implementation for generating theme-based rewards
    return [this.rewards.get('quantum-essence')!];
  }
}