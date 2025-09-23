/**
 * Long-Term Strategic Planning Types for Chat Maestro
 * Defines types for 6, 12, and 24-month strategic fitness plans
 */

import { UserData, WorkoutPlan, ProgressionPlan, DailyNutrition, RecoveryAnalysis } from './types';

// Strategic focus areas for long-term planning
export type StrategicFocusArea = 
  | 'hypertrophy'
  | 'strength'
  | 'endurance'
  | 'mobility'
  | 'injury_prevention';

// Plan phases for periodization
export type PlanPhase = 
  | 'accumulation'
  | 'intensification'
  | 'realization'
  | 'deload'
  | 'transition';

// Long-term plan structure
export type LongTermPlanStructure = {
  id: string;
  userId: string;
  name: string;
  duration: 6 | 12 | 24; // months
  startDate: Date;
  endDate: Date;
  strategicFocus: StrategicFocusArea;
  secondaryFocuses: StrategicFocusArea[];
  phases: PlanPhase[];
  createdAt: Date;
  updatedAt: Date;
};

// Strategic plan phase details
export type StrategicPlanPhase = {
  id: string;
  planId: string;
  phase: PlanPhase;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  keyMetrics: string[];
  expectedOutcomes: string[];
  durationWeeks: number;
};

// Strategic variation for different focus areas
export type StrategicVariation = {
  id: string;
  planId: string;
  focusArea: StrategicFocusArea;
  name: string;
  description: string;
  intensityProfile: 'low' | 'moderate' | 'high';
  volumeProfile: 'low' | 'moderate' | 'high';
  frequencyProfile: 'low' | 'moderate' | 'high';
  recommendedDurationWeeks: number[];
  progressionModel: 'linear' | 'undulating' | 'block' | 'conjugate';
  keyExercises: string[];
  adaptationTriggers: string[];
};

// Long-term strategic plan
export type LongTermStrategicPlan = {
  id: string;
  userId: string;
  name: string;
  description: string;
  durationMonths: 6 | 12 | 24;
  startDate: Date;
  endDate: Date;
  primaryFocus: StrategicFocusArea;
  secondaryFocuses: StrategicFocusArea[];
  currentPhase: StrategicPlanPhase | null;
  phases: StrategicPlanPhase[];
  variations: StrategicVariation[];
  progressTracking: StrategicProgress[];
  adaptations: StrategicAdaptation[];
  createdAt: Date;
  updatedAt: Date;
};

// Progress tracking for long-term plans
export type StrategicProgress = {
  id: string;
  planId: string;
  date: Date;
  phase: PlanPhase;
  metrics: {
    strength?: number;
    hypertrophy?: number;
    endurance?: number;
    mobility?: number;
    injuryRisk?: number;
    recovery?: number;
    adherence?: number;
  };
  notes: string;
  adjustmentsMade: boolean;
};

// Strategic adaptation based on user progress
export type StrategicAdaptation = {
  id: string;
  planId: string;
  date: Date;
  trigger: string; // What triggered the adaptation
  originalPlanElement: string; // What was changed
  adaptation: string; // What the change was
  rationale: string; // Why the change was made
  confidence: number; // 0-1 scale
  applied: boolean;
  impactAssessment?: {
    expectedPerformanceChange: number; // percentage
    expectedRecoveryChange: number; // percentage
    expectedAdherenceChange: number; // percentage
  };
};

// Physical evolution tracking
export type PhysicalEvolution = {
  id: string;
  userId: string;
  date: Date;
  measurements: {
    weight?: number;
    bodyFatPercentage?: number;
    muscleMass?: number;
    boneDensity?: number;
    restingHeartRate?: number;
    heartRateVariability?: number;
    vo2max?: number;
    flexibility?: number;
    strengthBenchmark?: number;
  };
  performanceMetrics: {
    strength?: Record<string, number>; // exercise: weight
    endurance?: Record<string, number>; // exercise: duration/reps
    mobility?: Record<string, number>; // test: score
  };
  healthMarkers: {
    sleepQuality?: number; // 1-10 scale
    stressLevel?: number; // 1-10 scale
    energyLevel?: number; // 1-10 scale
    motivation?: number; // 1-10 scale
  };
  notes: string;
};

// Long-term plan recommendation
export type LongTermPlanRecommendation = {
  id: string;
  userId: string;
  planDuration: 6 | 12 | 24;
  primaryFocus: StrategicFocusArea;
  secondaryFocuses: StrategicFocusArea[];
  confidence: number; // 0-1 scale
  rationale: string;
  expectedOutcomes: string[];
  timeline: string;
  successMetrics: string[];
};

// Plan adjustment recommendation
export type PlanAdjustmentRecommendation = {
  id: string;
  planId: string;
  type: 'phase_change' | 'focus_shift' | 'intensity_modification' | 'volume_modification' | 'deload';
  priority: 'low' | 'medium' | 'high' | 'critical';
  trigger: string;
  recommendation: string;
  rationale: string;
  confidence: number; // 0-1 scale
  implementationSteps: string[];
  expectedBenefits: string[];
  timeframe: string;
};