export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingLocation = 'gym' | 'home' | 'outdoor';
export type Equipment = {
  dumbbells: boolean;
  barbell: boolean;
  kettlebells: boolean;
  resistanceBands: boolean;
  pullUpBar: boolean;
  bench: boolean;
  machine: boolean;
};
export type InjuryHistory = {
  hasInjuries: boolean;
  injuries: string;
};
export type TrainingDays = 1 | 2 | 3 | 4 | 5 | 6;

// Nuevos tipos para selección múltiple
export type MultipleTrainingLevels = TrainingLevel[];
export type MultipleTrainingLocations = TrainingLocation[];
export type FlexibleTrainingDays = {
  min: TrainingDays;
  max: TrainingDays;
  preferred: TrainingDays;
};

// FIX: Added UserData type based on usage in ProfileScreen.tsx.
export type UserData = {
  name: string;
  age: number;
  weight: number;
  height: number;
  fitnessLevel: TrainingLevel;
  goals: string[];
};

// FIX: Added ProgressData type based on usage in Dashboard.tsx.
export type ProgressData = {
  workoutId: string;
  date: Date;
  notes?: string;
};

export type Exercise = {
  name: string;
  sets: number;
  reps: string; // e.g., "8-12" or "15"
  rest: number; // in seconds
  equipment: string;
  notes?: string;
};

export type DayPlan = {
  day: number;
  focus: string;
  exercises: Exercise[];
};

export type WorkoutPlan = {
  id: string;
  name: string;
  description: string;
  focus: string[];
  days: DayPlan[];
  duration: number; // Duración en minutos - ahora requerida
  createdAt: Date;
  updatedAt: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  estimatedCalories?: number;
};

// Types for Recipe Generator
export type MacroGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type Ingredient = {
  name: string;
  amount: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  category: string;
  substitutes: string[];
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number;
  cookTime: number;
  ingredients: Ingredient[];
  instructions: string[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
};

export type ShoppingListItem = {
  ingredient: string;
  amount: string;
  category: string;
  purchased: boolean;
};

// Types for Blood Test Analyzer
export type AnalyzedMarker = {
  name: string;
  value: string;
  unit: string;
  optimalRange: string;
  status: 'Optimal' | 'Borderline' | 'High' | 'Low';
  interpretation: string;
};

export type Recommendations = {
  nutrition: string[];
  supplements: string[];
  lifestyle: string[];
};

export type BloodTestAnalysis = {
  summary: string;
  disclaimer: string;
  analyzedMarkers: AnalyzedMarker[];
  recommendations: Recommendations;
};

// Types for Overload Detection
export type BodyPart = 'hombros' | 'columna' | 'caderas' | 'rodillas' | 'tobillos' | 'cuello' | 'muñecas' | 'lumbar' | 'isquios' | 'gemelos';

export type OverloadData = {
  bodyPart: BodyPart;
  severity: number; // 1-10
  lastIncident?: string;
  frequency: 'ocasional' | 'frecuente' | 'constante';
  type: 'muscular' | 'articular' | 'tendinosa';
};

export type CorrectiveExercise = {
  name: string;
  description: string;
  duration: string;
  equipment: 'ninguno' | 'banda' | 'pelota' | 'rodillo';
  videoUrl?: string;
  targetArea: BodyPart[];
};

// Types for Workout Session Tracking
export type WorkoutSession = {
  id: string;
  workoutPlanId: string;
  date: Date;
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null; // in minutes
  exercises: {
    exerciseId: string;
    name: string;
    sets: {
      setNumber: number;
      weight: number | null;
      reps: number | null;
      rpe: number | null;
      tempo: string;
      rest: number;
      notes: string;
    }[];
  }[];
  notes: string;
};

// Types for Intelligent Load Progression
export type LoadProgressionMetric = {
  exerciseName: string;
  date: Date;
  weight: number;
  reps: number;
  rpe: number;
  rir: number; // Reps in Reserve
  completed: boolean; // Whether the set was completed successfully
};

export type ProgressionAdjustment = {
  exerciseName: string;
  adjustmentType: 'weight' | 'volume' | 'intensity' | 'deload';
  value: number; // Percentage change or absolute value
  reason: string;
  confidence: number; // 0-1 scale
  applied: boolean;
};

export type ProgressionHistory = {
  exerciseName: string;
  date: Date;
  weight: number;
  reps: number;
  rpe: number;
  rir: number;
  volume: number; // weight * reps
  intensity: number; // weight / 1RM estimate
};

export type PeriodizationPhase = 'accumulation' | 'intensification' | 'peak' | 'deload';

export type ProgressionPlan = {
  exerciseName: string;
  currentWeight: number;
  recommendedWeight: number;
  nextPhase: PeriodizationPhase;
  adjustments: ProgressionAdjustment[];
  notes: string[];
};

// Extend UserHabit type with progression preferences
export interface UserHabitWithProgression extends UserHabit {
  // Progression preferences
  preferredProgressionMethod: 'linear' | 'undulating' | 'auto-regulated';
  progressionFrequency: 'daily' | 'session' | 'weekly';
  deloadFrequency: number; // weeks between deloads
  // Progression history
  progressionMetrics: LoadProgressionMetric[];
  progressionHistory: ProgressionHistory[];
}

// Types for Habit Tracking
export type UserHabit = {
  id: string;
  userId: string;
  preferredTrainingTimes: string[]; // e.g., ["07:00", "18:00"]
  trainingFrequency: number; // days per week
  lastTrainingSessions: Date[]; // last 10 sessions
  averageTrainingDuration: number; // in minutes
  preferredTrainingDays: number[]; // 0-6 for Sunday-Saturday
  // Nutrition preferences
  preferredMealTimes: string[]; // e.g., ["08:00", "13:00", "19:00"]
  preferredFoods: string[]; // User's favorite foods
  dislikedFoods: string[]; // Foods user dislikes
  dietaryRestrictions: string[]; // Dietary restrictions
  nutritionGoals: string[]; // e.g., ["definition", "strength", "muscle_mass", "endurance"]
};

// Types for Nutrition Tracking
export type NutritionGoal = 'definition' | 'strength' | 'muscle_mass' | 'endurance' | 'maintenance';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';

export type Nutrient = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  micronutrients?: Record<string, number>; // e.g., { iron: 8, vitaminC: 60 }
};

export type Meal = {
  id: string;
  type: MealType;
  name: string;
  time: string; // HH:MM format
  nutrients: Nutrient;
  ingredients: string[];
  recipe?: string; // Optional recipe details
  workoutRelated?: boolean; // Whether this meal is related to a workout
  workoutId?: string; // Associated workout if workoutRelated is true
  date: Date;
};

export type DailyNutrition = {
  date: Date;
  totalNutrients: Nutrient;
  meals: Meal[];
  calorieExpenditure?: number; // Estimated calories burned
  nutritionGoal?: NutritionGoal;
};

// Types for Recovery and Fatigue Monitoring
export type RecoveryMetric = {
  date: Date;
  energyLevel: number; // 1-10 scale
  muscleSoreness: number; // 1-10 scale
  sleepQuality: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  motivation: number; // 1-10 scale
  notes?: string;
};

export type FatigueLevel = 'low' | 'moderate' | 'high' | 'extreme';

export type RecoveryRecommendation = {
  type: 'rest' | 'active_recovery' | 'mobility' | 'stretching' | 'sauna' | 'massage' | 'nap' | 'light_training';
  title: string;
  description: string;
  duration?: string; // e.g., "10-15 minutes"
  intensity?: 'low' | 'moderate' | 'high';
  priority: 'low' | 'medium' | 'high';
};

export type RecoveryAnalysis = {
  date: Date;
  fatigueLevel: FatigueLevel;
  recoveryScore: number; // 0-100 scale
  recommendations: RecoveryRecommendation[];
  predictedFatigueDays: Date[];
  suggestedWorkoutIntensity: 'low' | 'moderate' | 'high' | 'rest';
};

// Extend UserHabit type with recovery preferences
export interface UserHabitWithRecovery extends UserHabit {
  // Recovery preferences
  preferredRecoveryMethods: string[]; // e.g., ["stretching", "sauna", "massage"]
  recoveryTimePreference: 'morning' | 'afternoon' | 'evening' | 'any';
  // Subjective metrics history
  recoveryMetrics: RecoveryMetric[];
}

// Neural Interface Connectivity Types
export type NeuralSignalType = 
  | 'eeg_alpha'
  | 'eeg_beta'
  | 'eeg_theta'
  | 'eeg_delta'
  | 'emg'
  | 'ecg'
  | 'hrv'
  | 'gal'
  | 'pupillometry'
  | 'respiration';

export type MentalState = 
  | 'focused'
  | 'relaxed'
  | 'stressed'
  | 'fatigued'
  | 'alert'
  | 'drowsy'
  | 'anxious'
  | 'calm'
  | 'motivated'
  | 'distracted';

export type NeuralFeedbackType = 
  | 'cognitive_load'
  | 'attention_level'
  | 'stress_response'
  | 'fatigue_index'
  | 'readiness_score'
  | 'flow_state';

export interface NeuralSignalData {
  type: NeuralSignalType;
  value: number;
  timestamp: Date;
  quality: number; // 0-100 signal quality
  channel?: string; // For multi-channel data like EEG
}

export interface MentalStateData {
  state: MentalState;
  confidence: number; // 0-100 confidence in classification
  timestamp: Date;
  associatedSignals: NeuralSignalData[];
  context?: string; // e.g., 'workout', 'recovery', 'focus_session'
}

export interface NeuralFeedback {
  type: NeuralFeedbackType;
  value: number;
  timestamp: Date;
  targetRange?: [number, number]; // Optimal range for this metric
  recommendations?: string[];
}

export interface NeurofeedbackProtocol {
  id: string;
  name: string;
  description: string;
  targetMetrics: NeuralFeedbackType[];
  protocol: {
    duration: number; // in minutes
    frequency: 'daily' | 'weekly' | 'as_needed';
    intensity: 'low' | 'medium' | 'high';
    guidance: string[]; // Step-by-step instructions
  };
  progressTracking: {
    sessionsCompleted: number;
    averageImprovement: number; // percentage
    lastSessionDate?: Date;
  };
}

export interface NeuralInterfaceDevice {
  id: string;
  name: string;
  type: 'eeg_headset' | 'emg_sensor' | 'hrv_monitor' | 'multi_modal';
  connected: boolean;
  batteryLevel?: number; // 0-100
  signalQuality: number; // 0-100
  lastSync: Date;
  supportedSignals: NeuralSignalType[];
}
