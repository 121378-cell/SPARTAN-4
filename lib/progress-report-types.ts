/**
 * Types for User Progress Report System
 */

export interface TrainingMetrics {
  totalWorkouts: number;
  completedWorkouts: number;
  workoutCompletionRate: number;
  avgWorkoutDuration: number;
  totalVolume: number; // Total weight lifted in kg
  consistencyScore: number; // 0-100
  intensityScore: number; // 0-100
  progressionRate: number; // % change in volume/weight over time
  favoriteExercises: string[];
  workoutDistribution: {
    strength: number;
    calisthenics: number;
    yoga: number;
    cardio: number;
    other: number;
  };
}

export interface NutritionalMetrics {
  adherenceRate: number; // 0-100
  macroTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  actualIntake: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  macroAdherence: {
    calories: number; // 0-100
    protein: number;
    carbs: number;
    fats: number;
  };
  mealFrequency: number; // meals per day
  hydrationLevel: number; // 0-100
  micronutrientScore: number; // 0-100
  supplementationAdherence: number; // 0-100
}

export interface HealthMetrics {
  avgHeartRate: number;
  restingHeartRate: number;
  heartRateVariability: number;
  sleepQuality: number; // 0-100
  sleepDuration: number; // hours
  stepsPerDay: number;
  activeMinutes: number;
  stressLevel: number; // 0-100
  bodyComposition: {
    weight: number;
    bodyFatPercentage: number;
    muscleMass: number;
  };
  bloodMarkers: {
    glucose: number;
    cholesterol: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
  };
}

export interface PerformanceMetrics {
  strengthImprovements: {
    squat: number; // % improvement
    deadlift: number;
    benchPress: number;
    pullUp: number;
  };
  enduranceImprovements: {
    vo2max: number; // % improvement
    lactateThreshold: number;
  };
  flexibilityImprovements: {
    shoulderFlexibility: number; // % improvement
    hipFlexibility: number;
    spineMobility: number;
  };
  cognitiveMetrics: {
    focusScore: number; // 0-100
    reactionTime: number; // ms
    memoryScore: number; // 0-100
  };
}

export interface WeeklyProgressReport {
  reportId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  period: 'weekly' | 'monthly' | 'quarterly';
  training: TrainingMetrics;
  nutrition: NutritionalMetrics;
  health: HealthMetrics;
  performance: PerformanceMetrics;
  overallScore: number; // 0-100
  strengths: string[];
  areasForImprovement: string[];
  recommendations: Recommendation[];
  trends: {
    trainingTrend: 'improving' | 'stable' | 'declining';
    nutritionTrend: 'improving' | 'stable' | 'declining';
    healthTrend: 'improving' | 'stable' | 'declining';
    performanceTrend: 'improving' | 'stable' | 'declining';
  };
}

export interface Recommendation {
  category: 'training' | 'nutrition' | 'health' | 'performance' | 'recovery';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  expectedImpact: string;
  timeframe: string; // e.g., "1-2 weeks", "1 month"
}

export interface ProgressHistory {
  weeklyReports: WeeklyProgressReport[];
  monthlyReports: WeeklyProgressReport[];
  quarterlyReports: WeeklyProgressReport[];
}

export interface UserGoals {
  primaryGoal: string;
  targetDate: Date;
  currentProgress: number; // 0-100
  milestones: {
    title: string;
    targetDate: Date;
    achieved: boolean;
  }[];
}