// Advanced Plan Design Modal Types

export interface PlanObjective {
  id: string;
  name: string;
  description: string;
  primaryFocus: 'strength' | 'hypertrophy' | 'endurance' | 'fat_loss' | 'performance';
  secondaryFocuses: ('strength' | 'hypertrophy' | 'endurance' | 'fat_loss' | 'performance')[];
  recommendedDuration: number[]; // in weeks
  intensityProfile: 'low' | 'moderate' | 'high';
}

export interface UserPreferences {
  equipment: string[];
  timeAvailability: {
    weekdays: number[]; // hours per day (0-24)
    weekends: number[]; // hours per day (0-24)
  };
  trainingFrequency: number; // sessions per week
  preferredTrainingTimes: ('morning' | 'afternoon' | 'evening')[];
  recoveryPriority: 'low' | 'moderate' | 'high';
  nutritionPreferences: string[];
}

export interface UserBiometrics {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  bodyFatPercentage?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingExperience: number; // in years
  injuryHistory: string[];
  currentMedications?: string[];
}

export interface PlanConfiguration {
  objective: PlanObjective;
  duration: number; // in weeks
  startDate: Date;
  userPreferences: UserPreferences;
  userBiometrics: UserBiometrics;
  integrationSettings: {
    calendarSync: boolean;
    smartCardSync: boolean;
    chatMaestroSync: boolean;
    wearableSync: boolean;
  };
}

export interface TrainingBlock {
  id: string;
  name: string;
  description: string;
  weekRange: [number, number]; // start and end week (1-indexed)
  focus: 'accumulation' | 'intensification' | 'realization' | 'deload' | 'testing';
  volume: 'low' | 'moderate' | 'high';
  intensity: 'low' | 'moderate' | 'high';
  exercises: ExerciseAssignment[];
}

export interface ExerciseAssignment {
  id: string;
  exerciseId: string;
  name: string;
  category: string;
  sets: number;
  reps: string; // e.g., "8-10", "AMRAP", "3-5"
  rpe?: number; // Rate of Perceived Exertion 1-10
  tempo?: string; // e.g., "3010", "2121"
  restPeriod?: number; // in seconds
  load?: string; // e.g., "65% 1RM", "RPE 7", "bodyweight"
  alternatives?: string[]; // alternative exercise IDs
  videoUrl?: string;
  notes?: string[];
}

export interface TacticalCalendar {
  id: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  weeks: TacticalWeek[];
}

export interface TacticalWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: TacticalDay[];
  summary: {
    totalSessions: number;
    totalVolume: number; // in arbitrary units
    intensityDistribution: {
      low: number;
      moderate: number;
      high: number;
    };
  };
}

export interface TacticalDay {
  date: Date;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  sessions: TrainingSession[];
  notes?: string[];
}

export interface TrainingSession {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'recovery' | 'sports';
  duration: number; // in minutes
  exercises: ExerciseAssignment[];
  warmup?: ExerciseAssignment[];
  cooldown?: ExerciseAssignment[];
  notes?: string[];
}

export interface SmartCard {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  instructions: string[];
  formCues: string[];
  commonMistakes: string[];
  videoUrl?: string;
  timerSettings?: {
    workTime?: number; // in seconds
    restTime?: number; // in seconds
    rounds?: number;
  };
  performanceTracking: {
    setsCompleted: number;
    repsCompleted: number[];
    loadUsed: number[]; // in kg or lbs
    rpeReported: number[];
    notes?: string[];
  };
}

export interface PlanGenerationResult {
  success: boolean;
  plan?: TrainingPlan;
  tacticalCalendar?: TacticalCalendar;
  smartCards?: SmartCard[];
  errorMessage?: string;
  warnings?: string[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  configuration: PlanConfiguration;
  blocks: TrainingBlock[];
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface PlanUpdateRequest {
  planId: string;
  updates: Partial<TrainingPlan>;
  reason: string;
  source: 'user' | 'chat_maestro' | 'performance_data' | 'system';
}

export interface PlanSyncEvent {
  type: 'plan_created' | 'plan_updated' | 'plan_deleted' | 'session_completed' | 'performance_recorded';
  planId: string;
  payload: any;
  timestamp: Date;
  source: 'modal' | 'chat_maestro' | 'wearable' | 'user';
}

export interface PlanAnalytics {
  planId: string;
  adherenceRate: number; // 0-1
  performanceTrend: 'improving' | 'declining' | 'stable' | 'plateau';
  volumeLoad: number; // total volume over plan duration
  intensityDistribution: {
    low: number;
    moderate: number;
    high: number;
  };
  sessionCompletion: {
    completed: number;
    missed: number;
    rescheduled: number;
  };
  userFeedback: {
    satisfaction: number; // 1-5
    comments: string[];
  };
}

export interface AdaptiveAdjustment {
  id: string;
  planId: string;
  trigger: 'performance_plateau' | 'overreaching' | 'underreaching' | 'injury_risk' | 'user_feedback';
  description: string;
  adjustment: {
    type: 'volume' | 'intensity' | 'frequency' | 'exercise' | 'duration';
    value: any;
  };
  applied: boolean;
  timestamp: Date;
}