// Proactivity system types for Chat Maestro

export interface UserDataSnapshot {
  // Sleep data
  sleepHours: number[];
  sleepQuality: number[]; // 1-10
  bedtimeConsistency: number; // 1-10
  
  // Workout data
  workoutConsistency: number; // 1-10
  workoutIntensity: number[]; // 1-10
  formQuality: number[]; // 1-10
  painReports: string[];
  
  // Nutrition data
  nutritionAdherence: number; // 1-10
  hydrationLevel: number[]; // 1-10
  
  // Engagement data
  appUsageFrequency: number[]; // daily usage count
  responseRateToCoaching: number; // 1-10
  manualCheckIns: number; // count in period
  
  // Performance data
  performanceMetrics: {
    [key: string]: number[]; // exercise-specific progress
  };
  
  // Psychological data
  energyLevels: number[]; // 1-10
  motivationLevels: number[]; // 1-10
  stressLevels: number[]; // 1-10
  
  // Timestamp
  timestamp: Date;
}

export type ProactivityPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ProactiveTrigger {
  id: string;
  category: string;
  priority: ProactivityPriority;
  condition: (data: UserDataSnapshot) => boolean;
  confidence: number; // 0-100
  cooldownPeriod: number; // hours
  lastTriggered?: Date;
}

export interface ProactiveIntervention {
  triggerId: string;
  priority: ProactivityPriority;
  confidence: number;
  message: string;
  suggestedAction?: string;
  category: string;
}

export interface ProactivitySettings {
  quietHours: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  maxDailyInterventions: number;
  cooldownPeriods: {
    [triggerId: string]: number; // hours
  };
  userPreferences: {
    preferredCommunicationStyle: 'direct' | 'supportive' | 'analytical';
    notificationPreferences: {
      proactiveMessages: boolean;
      reminders: boolean;
      educational: boolean;
    };
  };
}

export interface ProactivityAnalytics {
  interventionsTriggered: number;
  userResponseRate: number;
  interventionSuccessRate: number;
  lastInterventionDate: Date;
  categoryBreakdown: {
    [category: string]: number;
  };
}