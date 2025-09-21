// Tipos para el Modal de Historial y Progreso

export interface ProgressMetric {
  id: string;
  name: string;
  category: 'strength' | 'endurance' | 'body-composition' | 'adherence' | 'recovery';
  currentValue: number;
  previousValue?: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable' | 'plateau';
  targetValue?: number;
  progressPercentage?: number;
}

export interface ProgressHistoryPoint {
  date: Date;
  metrics: Record<string, number>;
  notes?: string;
  workoutId?: string;
  planPhase?: string;
}

export interface ProgressChartConfig {
  metricId: string;
  chartType: 'line' | 'bar' | 'area' | 'scatter';
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  showTrendLine: boolean;
  showTargetLine: boolean;
  showComparison: boolean;
  comparisonType?: 'personal-best' | 'community-average' | 'goal';
}

export interface ProgressVisualization {
  id: string;
  title: string;
  description: string;
  type: 'chart' | 'heatmap' | 'gauge' | 'progress-bar' | 'table';
  chartSubType?: 'line' | 'bar' | 'area' | 'scatter'; // Nuevo campo para especificar el tipo de gráfico
  config: ProgressChartConfig;
  data: ProgressHistoryPoint[];
}

export interface BodyCompositionData {
  date: Date;
  weight: number;
  bodyFatPercentage: number;
  muscleMass: number;
  waterPercentage: number;
  boneMass: number;
  visceralFat: number;
  bmi: number;
  bmr: number;
  metabolicAge: number;
  source: 'scale' | 'scanner' | 'manual' | 'estimate';
}

export interface StrengthMetrics {
  exerciseId: string;
  exerciseName: string;
  oneRepMax: number;
  volumeLoad: number;
  workCapacity: number;
  strengthCurve: {
    repRange: string;
    maxWeight: number;
  }[];
  lastRecorded: Date;
}

export interface EnduranceMetrics {
  vo2Max: number;
  lactateThreshold: number;
  restingHeartRate: number;
  heartRateVariability: number;
  recoveryRate: number;
  aerobicCapacity: number;
  anaerobicCapacity: number;
  lastRecorded: Date;
}

export interface AdherenceMetrics {
  planAdherence: number; // 0-100
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  streak: number;
  missedWorkouts: number;
  rescheduledWorkouts: number;
  onTimeCompletion: number; // 0-100
}

export interface RecoveryMetrics {
  sleepQuality: number; // 1-10
  stressLevel: number; // 1-10
  sorenessLevel: number; // 1-10
  energyLevel: number; // 1-10
  readinessScore: number; // 1-100
  lastRecorded: Date;
}

export interface TacticalCalendarIntegration {
  startDate: Date;
  endDate: Date;
  planId: string;
  milestones: {
    date: Date;
    description: string;
    achieved: boolean;
    metricsAtTime: Record<string, number>;
  }[];
  currentPhase: string;
  nextPhase: string;
  phaseEndDate: Date;
}

export interface ProgressProjection {
  metricId: string;
  currentValue: number;
  projectedValue: number;
  confidence: number; // 0-100
  timeframe: 'month' | 'quarter' | 'year';
  scenario: 'current-trend' | 'optimized' | 'conservative';
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    magnitude: number; // 0-100
  }[];
}

export interface ComparativeAnalysis {
  type: 'personal' | 'community' | 'standards';
  metricId: string;
  userValue: number;
  comparisonValue: number;
  percentile?: number;
  difference: number;
  significance: 'low' | 'medium' | 'high';
}

export interface ChatMaestroExplanation {
  id: string;
  metricId: string;
  explanation: string;
  keyInsights: string[];
  recommendations: string[];
  confidence: number; // 0-100
  timestamp: Date;
}

export interface ProgressAlert {
  id: string;
  type: 'plateau' | 'improvement' | 'decline' | 'milestone' | 'risk';
  metricId: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  triggeredAt: Date;
  resolved: boolean;
  resolutionNotes?: string;
}

export interface ProgressReportConfig {
  userId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  metricsToShow: string[];
  visualizationTypes: ProgressChartConfig[];
  includeProjections: boolean;
  includeComparisons: boolean;
  chatMaestroDepth: 'summary' | 'detailed' | 'comprehensive';
}

export interface ProgressReport {
  id: string;
  userId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    overallProgress: 'excellent' | 'good' | 'fair' | 'poor';
    keyImprovements: string[];
    areasOfConcern: string[];
    adherenceRate: number; // 0-100
  };
  detailedMetrics: ProgressMetric[];
  visualizations: ProgressVisualization[];
  projections: ProgressProjection[];
  comparisons: ComparativeAnalysis[];
  explanations: ChatMaestroExplanation[];
  alerts: ProgressAlert[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    rationale: string;
    timeframe: string;
  }[];
}