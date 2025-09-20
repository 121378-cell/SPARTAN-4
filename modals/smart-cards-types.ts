// Advanced Smart Cards Modal Types

export interface SmartCardConfiguration {
  userId: string;
  sessionId: string;
  exerciseId: string;
  customization: {
    displayMode: 'basic' | 'detailed' | 'minimal';
    timerVisibility: boolean;
    videoAutoplay: boolean;
    audioCues: boolean;
    hapticFeedback: boolean;
  };
  integrationSettings: {
    wearableSync: boolean;
    chatMaestroSync: boolean;
    calendarSync: boolean;
    socialSharing: boolean;
  };
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipmentRequired: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  movementPattern: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotation';
  videoUrls: {
    instruction: string;
    demonstration: string;
    commonMistakes: string;
  };
}

export interface ExerciseSet {
  setId: string;
  setNumber: number;
  targetReps: number | string; // e.g., 8, "8-10", "AMRAP"
  targetLoad?: number; // in kg or lbs
  targetRPE?: number; // Rate of Perceived Exertion 1-10
  targetTempo?: string; // e.g., "3010", "2121"
  restPeriod?: number; // in seconds
  completedReps?: number;
  completedLoad?: number;
  completedRPE?: number;
  actualTempo?: string;
  restTaken?: number; // actual rest period taken
  startTime?: Date;
  endTime?: Date;
}

export interface SmartCardData {
  cardId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  instructions: string[];
  formCues: string[];
  commonMistakes: string[];
  safetyTips: string[];
  recommendedVariations: Exercise[];
  progressHistory: ExercisePerformance[];
  currentRecommendations: AdaptiveRecommendation[];
}

export interface ExercisePerformance {
  date: Date;
  sessionId: string;
  sets: ExerciseSet[];
  perceivedEffort: number; // 1-10
  notes?: string;
  videoAnalysis?: {
    formScore: number; // 1-10
    keyObservations: string[];
  };
}

export interface TimerSettings {
  workTime: number; // in seconds
  restTime: number; // in seconds
  preparationTime: number; // in seconds
  warningTime: number; // in seconds before end
  autoTransition: boolean;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
}

// Updated TimerState interface to include 'rest' phase
export interface TimerState {
  currentPhase: 'preparation' | 'work' | 'rest' | 'completed';
  timeRemaining: number; // in seconds
  isRunning: boolean;
  currentSetIndex: number;
  totalSets: number;
}

export interface BiometricData {
  heartRate?: number;
  heartRateVariability?: number;
  breathingRate?: number;
  skinTemperature?: number;
  sweatRate?: number;
  muscleActivity?: number;
  timestamp: Date;
}

export interface RealTimeFeedback {
  type: 'form_correction' | 'motivation' | 'safety_warning' | 'performance_insight';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
  timestamp: Date;
}

export interface ProgressMetrics {
  strength: {
    oneRepMax?: number;
    volumeLoad: number;
    trend: 'improving' | 'declining' | 'stable' | 'plateau';
  };
  endurance: {
    maxReps: number;
    repRangeEfficiency: number; // 0-1
    trend: 'improving' | 'declining' | 'stable' | 'plateau';
  };
  technique: {
    formScore: number; // 1-10
    consistency: number; // 0-1
    trend: 'improving' | 'declining' | 'stable' | 'plateau';
  };
  recovery: {
    readinessScore: number; // 1-10
    fatigueLevel: number; // 1-10
    trend: 'improving' | 'declining' | 'stable' | 'plateau';
  };
}

export interface AdaptiveRecommendation {
  type: 'load' | 'volume' | 'intensity' | 'exercise' | 'tempo' | 'rest';
  description: string;
  value: any;
  confidence: number; // 0-100
  rationale: string;
  timestamp: Date;
}

export interface SmartCardEvent {
  type: 'card_opened' | 'set_started' | 'set_completed' | 'timer_ended' | 'feedback_provided' | 'variation_selected';
  cardId: string;
  payload: any;
  timestamp: Date;
  source: 'user' | 'system' | 'wearable' | 'chat_maestro';
}

export interface SmartCardAnalytics {
  cardId: string;
  usageStats: {
    views: number;
    completions: number;
    averageTimeSpent: number; // in seconds
    interactionRate: number; // 0-1
  };
  performanceStats: {
    averageFormScore: number; // 1-10
    averageRPE: number; // 1-10
    consistencyScore: number; // 0-1
  };
  feedbackStats: {
    positiveFeedback: number;
    negativeFeedback: number;
    suggestionsImplemented: number;
  };
  adaptationStats: {
    recommendationsGiven: number;
    recommendationsAccepted: number;
    performanceImprovement: number; // 0-1
  };
}

export interface UserPreferences {
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

export interface UserContext {
  currentEnergyLevel: number; // 1-10
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  nutritionStatus: 'poor' | 'fair' | 'good' | 'excellent';
  timeAvailable: number; // in minutes
  environment: 'gym' | 'home' | 'outdoor' | 'travel';
}