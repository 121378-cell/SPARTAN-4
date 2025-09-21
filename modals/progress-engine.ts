// Motor del Modal de Historial y Progreso

import {
  ProgressMetric,
  ProgressHistoryPoint,
  ProgressChartConfig,
  ProgressVisualization,
  BodyCompositionData,
  StrengthMetrics,
  EnduranceMetrics,
  AdherenceMetrics,
  RecoveryMetrics,
  TacticalCalendarIntegration,
  ProgressProjection,
  ComparativeAnalysis,
  ChatMaestroExplanation,
  ProgressAlert,
  ProgressReportConfig,
  ProgressReport
} from './progress-types';

// Definir interfaces locales ya que no están disponibles en ../lib/types
interface UserPreferences {
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

interface UserContext {
  currentEnergyLevel: number; // 1-10
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  nutritionStatus: 'poor' | 'fair' | 'good' | 'excellent';
  timeAvailable: number; // in minutes
  environment: 'gym' | 'home' | 'outdoor' | 'travel';
}

export class ProgressTrackingEngine {
  private userPreferences: UserPreferences;
  private userContext: UserContext;
  private progressHistory: ProgressHistoryPoint[] = [];
  private bodyCompositionHistory: BodyCompositionData[] = [];
  private strengthMetrics: Record<string, StrengthMetrics> = {};
  private enduranceMetrics: EnduranceMetrics[] = [];
  private adherenceMetrics: AdherenceMetrics[] = [];
  private recoveryMetrics: RecoveryMetrics[] = [];
  private calendarIntegration: TacticalCalendarIntegration | null = null;
  private alerts: ProgressAlert[] = [];

  constructor(userPreferences: UserPreferences, userContext: UserContext) {
    this.userPreferences = userPreferences;
    this.userContext = userContext;
    this.initializeProgressData();
  }

  private initializeProgressData(): void {
    // Initialize with mock data for demonstration
    // In a real implementation, this would fetch from a database
    this.progressHistory = [
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        metrics: {
          'strength-total-volume': 15000,
          'endurance-vo2max': 45,
          'body-weight': 75.5
        }
      },
      {
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        metrics: {
          'strength-total-volume': 16500,
          'endurance-vo2max': 47,
          'body-weight': 74.8
        }
      },
      {
        date: new Date(),
        metrics: {
          'strength-total-volume': 18000,
          'endurance-vo2max': 49,
          'body-weight': 74.2
        }
      }
    ];

    this.bodyCompositionHistory = [
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        weight: 75.5,
        bodyFatPercentage: 18.5,
        muscleMass: 32.0,
        waterPercentage: 60.0,
        boneMass: 3.5,
        visceralFat: 8,
        bmi: 24.5,
        bmr: 1800,
        metabolicAge: 28,
        source: 'scale'
      },
      {
        date: new Date(),
        weight: 74.2,
        bodyFatPercentage: 16.8,
        muscleMass: 33.2,
        waterPercentage: 61.2,
        boneMass: 3.5,
        visceralFat: 7,
        bmi: 24.1,
        bmr: 1820,
        metabolicAge: 27,
        source: 'scale'
      }
    ];

    // Initialize other metrics with mock data
    this.strengthMetrics = {
      'barbell-back-squat': {
        exerciseId: 'barbell-back-squat',
        exerciseName: 'Barbell Back Squat',
        oneRepMax: 120,
        volumeLoad: 18000,
        workCapacity: 85,
        strengthCurve: [
          { repRange: '1-3', maxWeight: 110 },
          { repRange: '4-6', maxWeight: 90 },
          { repRange: '7-10', maxWeight: 70 }
        ],
        lastRecorded: new Date()
      }
    };

    this.enduranceMetrics = [
      {
        vo2Max: 49,
        lactateThreshold: 85,
        restingHeartRate: 52,
        heartRateVariability: 65,
        recoveryRate: 75,
        aerobicCapacity: 80,
        anaerobicCapacity: 70,
        lastRecorded: new Date()
      }
    ];

    this.adherenceMetrics = [
      {
        planAdherence: 85,
        weeklyWorkouts: 4,
        monthlyWorkouts: 16,
        streak: 12,
        missedWorkouts: 3,
        rescheduledWorkouts: 2,
        onTimeCompletion: 92
      }
    ];

    this.recoveryMetrics = [
      {
        sleepQuality: 8,
        stressLevel: 3,
        sorenessLevel: 2,
        energyLevel: 8,
        readinessScore: 85,
        lastRecorded: new Date()
      }
    ];

    this.calendarIntegration = {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      planId: 'plan-123',
      milestones: [
        {
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          description: 'Complete Phase 1',
          achieved: true,
          metricsAtTime: {
            'strength-total-volume': 15000,
            'body-weight': 75.5
          }
        },
        {
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          description: 'Reach 125kg Squat',
          achieved: false,
          metricsAtTime: {}
        }
      ],
      currentPhase: 'Hypertrophy',
      nextPhase: 'Strength',
      phaseEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }

  public getProgressMetrics(): ProgressMetric[] {
    const metrics: ProgressMetric[] = [];

    // Strength metrics
    metrics.push({
      id: 'strength-total-volume',
      name: 'Volumen de Entrenamiento',
      category: 'strength',
      currentValue: 18000,
      previousValue: 15000,
      unit: 'kg',
      trend: 'improving',
      targetValue: 20000,
      progressPercentage: 85
    });

    // Endurance metrics
    metrics.push({
      id: 'endurance-vo2max',
      name: 'VO2 Max',
      category: 'endurance',
      currentValue: 49,
      previousValue: 45,
      unit: 'ml/kg/min',
      trend: 'improving',
      targetValue: 55,
      progressPercentage: 72
    });

    // Body composition metrics
    metrics.push({
      id: 'body-weight',
      name: 'Peso Corporal',
      category: 'body-composition',
      currentValue: 74.2,
      previousValue: 75.5,
      unit: 'kg',
      trend: 'improving',
      targetValue: 72,
      progressPercentage: 60
    });

    // Adherence metrics
    metrics.push({
      id: 'adherence-rate',
      name: 'Adherencia al Plan',
      category: 'adherence',
      currentValue: 85,
      unit: '%',
      trend: 'stable',
      targetValue: 90,
      progressPercentage: 94
    });

    return metrics;
  }

  public generateProgressVisualization(config: ProgressChartConfig): ProgressVisualization {
    const historyData = this.getFilteredHistory(config.timeRange);
    
    return {
      id: `viz-${config.metricId}-${Date.now()}`,
      title: this.getMetricName(config.metricId),
      description: `Progresión de ${this.getMetricName(config.metricId)} en el tiempo`,
      type: 'chart', // Tipo general de visualización
      chartSubType: config.chartType, // Tipo específico de gráfico
      config,
      data: historyData
    };
  }

  private getFilteredHistory(timeRange: ProgressChartConfig['timeRange']): ProgressHistoryPoint[] {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return this.progressHistory.filter(point => point.date >= startDate);
  }

  private getMetricName(metricId: string): string {
    const metricNames: Record<string, string> = {
      'strength-total-volume': 'Volumen de Entrenamiento',
      'endurance-vo2max': 'VO2 Max',
      'body-weight': 'Peso Corporal',
      'adherence-rate': 'Adherencia al Plan'
    };

    return metricNames[metricId] || metricId;
  }

  public getBodyCompositionHistory(): BodyCompositionData[] {
    return [...this.bodyCompositionHistory];
  }

  public getStrengthMetrics(): Record<string, StrengthMetrics> {
    return { ...this.strengthMetrics };
  }

  public getEnduranceMetrics(): EnduranceMetrics[] {
    return [...this.enduranceMetrics];
  }

  public getAdherenceMetrics(): AdherenceMetrics[] {
    return [...this.adherenceMetrics];
  }

  public getRecoveryMetrics(): RecoveryMetrics[] {
    return [...this.recoveryMetrics];
  }

  public getCalendarIntegration(): TacticalCalendarIntegration | null {
    return this.calendarIntegration ? { ...this.calendarIntegration } : null;
  }

  public generateProjections(): ProgressProjection[] {
    const projections: ProgressProjection[] = [];

    // Project strength volume
    projections.push({
      metricId: 'strength-total-volume',
      currentValue: 18000,
      projectedValue: 22000,
      confidence: 85,
      timeframe: 'quarter',
      scenario: 'current-trend',
      factors: [
        { name: 'Consistencia en entrenamiento', impact: 'positive', magnitude: 90 },
        { name: 'Calidad del sueño', impact: 'positive', magnitude: 75 },
        { name: 'Nutrición adecuada', impact: 'positive', magnitude: 80 }
      ]
    });

    // Project VO2 Max
    projections.push({
      metricId: 'endurance-vo2max',
      currentValue: 49,
      projectedValue: 52,
      confidence: 75,
      timeframe: 'quarter',
      scenario: 'current-trend',
      factors: [
        { name: 'Entrenamiento cardiovascular', impact: 'positive', magnitude: 85 },
        { name: 'Reducción de estrés', impact: 'positive', magnitude: 70 },
        { name: 'Calidad del sueño', impact: 'positive', magnitude: 75 }
      ]
    });

    return projections;
  }

  public generateComparativeAnalysis(): ComparativeAnalysis[] {
    const analysis: ComparativeAnalysis[] = [];

    // Compare with community average for strength volume
    analysis.push({
      type: 'community',
      metricId: 'strength-total-volume',
      userValue: 18000,
      comparisonValue: 15000,
      percentile: 75,
      difference: 3000,
      significance: 'high'
    });

    // Compare with personal best
    analysis.push({
      type: 'personal',
      metricId: 'endurance-vo2max',
      userValue: 49,
      comparisonValue: 42,
      difference: 7,
      significance: 'high'
    });

    return analysis;
  }

  public generateChatMaestroExplanation(metricId: string): ChatMaestroExplanation {
    const explanations: Record<string, ChatMaestroExplanation> = {
      'strength-total-volume': {
        id: 'exp-1',
        metricId: 'strength-total-volume',
        explanation: 'Tu volumen de entrenamiento ha mejorado un 20% en el último mes, lo que indica una excelente adherencia al plan y progresión adecuada en la fase de hipertrofia.',
        keyInsights: [
          'Incremento consistente en carga y volumen semanal',
          'Buena recuperación entre sesiones',
          'Progresión adecuada según el ciclo de entrenamiento'
        ],
        recommendations: [
          'Mantener la frecuencia actual de entrenamiento',
          'Considerar aumentar la intensidad en las próximas semanas',
          'Monitorear la calidad del sueño para optimizar la recuperación'
        ],
        confidence: 90,
        timestamp: new Date()
      },
      'endurance-vo2max': {
        id: 'exp-2',
        metricId: 'endurance-vo2max',
        explanation: 'Tu VO2 Max ha mejorado un 8.8% en el último mes, lo que indica una excelente adaptación cardiovascular al entrenamiento.',
        keyInsights: [
          'Mejora sostenida en capacidad aeróbica',
          'Reducción en la frecuencia cardíaca en reposo',
          'Mejor recuperación post-entrenamiento'
        ],
        recommendations: [
          'Incorporar sesiones de entrenamiento de umbral',
          'Mantener la frecuencia de entrenamiento cardiovascular',
          'Considerar evaluación de lactato para optimizar zonas'
        ],
        confidence: 85,
        timestamp: new Date()
      }
    };

    return explanations[metricId] || {
      id: `exp-${metricId}`,
      metricId,
      explanation: 'Análisis en progreso. Chat Maestro está evaluando tus datos para proporcionar una explicación personalizada.',
      keyInsights: [],
      recommendations: [],
      confidence: 50,
      timestamp: new Date()
    };
  }

  public checkForAlerts(): ProgressAlert[] {
    const newAlerts: ProgressAlert[] = [];

    // Check for plateau in strength volume
    if (this.isPlateauDetected('strength-total-volume')) {
      newAlerts.push({
        id: `alert-${Date.now()}-1`,
        type: 'plateau',
        metricId: 'strength-total-volume',
        severity: 'medium',
        message: 'Posible estancamiento en volumen de entrenamiento. Considera variar los ejercicios o ajustar la intensidad.',
        triggeredAt: new Date(),
        resolved: false
      });
    }

    // Check for improvement milestone
    if (this.isMilestoneAchieved('endurance-vo2max', 48)) {
      newAlerts.push({
        id: `alert-${Date.now()}-2`,
        type: 'milestone',
        metricId: 'endurance-vo2max',
        severity: 'high',
        message: '¡Felicidades! Has alcanzado un nuevo hito en tu VO2 Max. Este es un indicador excelente de mejora cardiovascular.',
        triggeredAt: new Date(),
        resolved: false
      });
    }

    // Add new alerts to the system
    this.alerts.push(...newAlerts);
    
    return [...this.alerts];
  }

  private isPlateauDetected(metricId: string): boolean {
    // Simplified plateau detection logic
    // In a real implementation, this would use more sophisticated algorithms
    const recentData = this.progressHistory.slice(-3);
    if (recentData.length < 3) return false;
    
    const values = recentData.map(point => point.metrics[metricId] || 0);
    const differences = values.slice(1).map((val, i) => Math.abs(val - values[i]));
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    
    // If average difference is less than 1% of the latest value, consider it a plateau
    return avgDifference < (values[values.length - 1] * 0.01);
  }

  private isMilestoneAchieved(metricId: string, threshold: number): boolean {
    const latestValue = this.progressHistory[this.progressHistory.length - 1]?.metrics[metricId] || 0;
    const previousValue = this.progressHistory[this.progressHistory.length - 2]?.metrics[metricId] || 0;
    
    // Check if we just crossed the threshold
    return latestValue >= threshold && previousValue < threshold;
  }

  public generateProgressReport(config: ProgressReportConfig): ProgressReport {
    const metrics = this.getProgressMetrics();
    const visualizations: ProgressVisualization[] = [];
    const projections = this.generateProjections();
    const comparisons = this.generateComparativeAnalysis();
    const explanations: ChatMaestroExplanation[] = [];
    const alerts = this.checkForAlerts();

    // Generate visualizations based on config
    config.visualizationTypes.forEach(vizConfig => {
      visualizations.push(this.generateProgressVisualization(vizConfig));
    });

    // Generate explanations for key metrics
    const keyMetrics = metrics.filter(m => ['strength-total-volume', 'endurance-vo2max'].includes(m.id));
    keyMetrics.forEach(metric => {
      explanations.push(this.generateChatMaestroExplanation(metric.id));
    });

    // Calculate overall progress
    const improvingMetrics = metrics.filter(m => m.trend === 'improving').length;
    const totalMetrics = metrics.length;
    const progressRatio = totalMetrics > 0 ? improvingMetrics / totalMetrics : 0;
    
    let overallProgress: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
    if (progressRatio >= 0.8) overallProgress = 'excellent';
    else if (progressRatio >= 0.6) overallProgress = 'good';
    else if (progressRatio >= 0.4) overallProgress = 'fair';
    else overallProgress = 'poor';

    return {
      id: `report-${Date.now()}`,
      userId: config.userId,
      generatedAt: new Date(),
      period: config.dateRange,
      summary: {
        overallProgress,
        keyImprovements: [
          'Mejora sostenida en volumen de entrenamiento',
          'Incremento en VO2 Max',
          'Reducción de peso corporal con mantenimiento de masa muscular'
        ],
        areasOfConcern: [
          'Ligera disminución en adherencia esta semana',
          'Necesidad de enfocarse en flexibilidad'
        ],
        adherenceRate: 85
      },
      detailedMetrics: metrics,
      visualizations,
      projections,
      comparisons,
      explanations,
      alerts,
      recommendations: [
        {
          priority: 'high',
          action: 'Aumentar la frecuencia de entrenamiento cardiovascular',
          rationale: 'Para mantener el progreso en VO2 Max',
          timeframe: 'Próximas 2 semanas'
        },
        {
          priority: 'medium',
          action: 'Incorporar ejercicios de movilidad',
          rationale: 'Para prevenir lesiones y mejorar la calidad de movimiento',
          timeframe: 'Próximo mes'
        }
      ]
    };
  }

  public resolveAlert(alertId: string, notes?: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolutionNotes = notes;
    }
  }
}