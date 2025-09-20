// Feedback and motivation types for Chat Maestro

export interface WorkoutData {
  exercise: string;
  sets: number;
  reps: number[];
  weight?: number[];
  rpe?: number[]; // Rate of Perceived Exertion 1-10
  tempo?: string[];
  restTime?: number[]; // in seconds
  formNotes?: string[];
  timestamp: Date;
}

export interface ProgressData {
  metric: string; // e.g., 'squat_1rm', 'body_weight', 'body_fat'
  values: number[];
  dates: Date[];
  goal?: number;
  unit: string; // e.g., 'kg', 'lbs', 'percent'
}

export interface UserData {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  goals: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    communicationStyle: 'direct' | 'supportive' | 'analytical' | 'motivational';
    feedbackFrequency: 'high' | 'medium' | 'low';
    motivationTriggers: string[]; // e.g., 'competition', 'health', 'strength'
  };
  currentMetrics: {
    [key: string]: number; // e.g., { 'strength_score': 7.5, 'consistency_score': 8.2 }
  };
  psychologicalState: {
    energy: number; // 1-10
    motivation: number; // 1-10
    stress: number; // 1-10
    confidence: number; // 1-10
  };
}

export interface FeedbackContext {
  userData: UserData;
  recentWorkouts: WorkoutData[];
  progressData: ProgressData[];
  currentProgramPhase: 'initiation' | 'plateau' | 'breakthrough' | 'maintenance';
  recentFeedbackHistory: FeedbackItem[];
}

export interface FeedbackRule {
  id: string;
  category: 'technical' | 'progress' | 'motivational';
  condition: (context: FeedbackContext) => boolean;
  priority: 'high' | 'medium' | 'low';
  generateMessage: (context: FeedbackContext) => string;
  generateAction?: (context: FeedbackContext) => string;
}

export interface FeedbackItem {
  id: string;
  category: 'technical' | 'progress' | 'motivational';
  message: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  dataReferences: string[]; // IDs of data points used to generate feedback
}

export interface FeedbackSettings {
  enableTechnicalFeedback: boolean;
  enableProgressFeedback: boolean;
  enableMotivationalFeedback: boolean;
  maxFeedbackPerDay: number;
  preferredTiming: 'immediate' | 'post_session' | 'daily_summary';
  tonePreferences: {
    technical: 'scientific' | 'conversational' | 'balanced';
    motivational: 'enthusiastic' | 'calm' | 'challenging';
    progress: 'analytical' | 'celebratory' | 'encouraging';
  };
}

export interface FeedbackAnalytics {
  totalFeedbackItems: number;
  feedbackByCategory: {
    technical: number;
    progress: number;
    motivational: number;
  };
  userResponseRate: number;
  feedbackEffectiveness: {
    [feedbackId: string]: {
      viewed: boolean;
      actedUpon: boolean;
      userRating: number; // 1-5
    };
  };
  commonFeedbackTriggers: {
    [triggerId: string]: number;
  };
}