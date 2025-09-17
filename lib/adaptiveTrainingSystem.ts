/**
 * Adaptive Training System - Sistema de Entrenamiento Adaptativo
 * Ajusta automáticamente parámetros de entrenamiento basado en métricas de rendimiento
 */

import { scientificAI } from './scientificAI';
import { recoveryAnalyticsAI } from './recoveryAnalyticsAI';
import type { UserData, Exercise } from './types';

export interface TrainingMetrics {
  sessionId: string;
  date: Date;
  rpe: number; // 1-10 scale (Rate of Perceived Exertion)
  rir: number; // 0-5 scale (Reps in Reserve)
  heartRateData: {
    avgHR: number;
    maxHR: number;
    hrv: number; // Heart Rate Variability
    recoveryHR: number; // HR 1min post-exercise
  };
  adherence: number; // 0-100% completion rate
  sleepQuality: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  muscleSymptoms: number; // 1-10 scale (1=no soreness, 10=extreme)
  motivation: number; // 1-10 scale
  exerciseData: ExercisePerformance[];
}

export interface ExercisePerformance {
  exerciseName: string;
  plannedWeight: number;
  actualWeight: number;
  plannedSets: number;
  completedSets: number;
  plannedReps: number | string;
  actualReps: number[];
  restTime: number[];
  rpe: number;
  rir: number;
  formQuality: number; // 1-10 scale
  notes?: string;
}

export interface TrainingAdjustment {
  exerciseName: string;
  adjustmentType: 'weight' | 'sets' | 'reps' | 'rest' | 'intensity' | 'volume';
  previousValue: number | string;
  newValue: number | string;
  adjustmentPercentage: number;
  reason: string;
  confidence: number;
  periodizationPhase: string;
}

export interface WeeklyAssessment {
  weekNumber: number;
  overallReadiness: number; // 0-100 scale
  fatigueIndex: number; // 0-100 scale
  performanceIndex: number; // 0-100 scale
  adherenceRate: number; // 0-100%
  progressRate: number; // 0-100%
  recommendedAdjustments: TrainingAdjustment[];
  periodizationRecommendation: PeriodizationAction;
  deloadRecommended: boolean;
  intensificationReady: boolean;
}

export interface PeriodizationAction {
  currentPhase: string;
  recommendedPhase: string;
  transitionReason: string;
  transitionTimeline: string;
  expectedOutcomes: string[];
}

export class AdaptiveTrainingSystem {
  private metricsHistory: TrainingMetrics[] = [];
  private adjustmentHistory: TrainingAdjustment[] = [];
  private baselineMetrics: Map<string, number> = new Map();
  
  constructor() {
    this.initializeBaselines();
  }

  /**
   * Registra métricas de una sesión de entrenamiento
   */
  public recordSessionMetrics(metrics: TrainingMetrics): void {
    this.metricsHistory.push(metrics);
    this.updateBaselines(metrics);
    console.log(`📊 Métricas registradas para sesión ${metrics.sessionId}`);
  }

  /**
   * Realiza análisis semanal y genera ajustes automáticos
   */
  public async performWeeklyAnalysis(
    currentWorkoutPlan: any,
    userData: UserData
  ): Promise<WeeklyAssessment> {
    console.log('🔄 Iniciando análisis semanal adaptativo...');

    const lastWeekMetrics = this.getLastWeekMetrics();
    const performanceAnalysis = this.analyzePerformanceTrends(lastWeekMetrics);
    const recoveryAnalysis = this.analyzeRecoveryStatus(lastWeekMetrics);
    const adherenceAnalysis = this.analyzeAdherence(lastWeekMetrics);
    
    const overallReadiness = this.calculateReadiness(performanceAnalysis, recoveryAnalysis, adherenceAnalysis);
    const adjustments = await this.generateAdjustments(lastWeekMetrics, currentWorkoutPlan, overallReadiness);
    const periodizationAction = this.evaluatePeriodization(performanceAnalysis, recoveryAnalysis);

    const assessment: WeeklyAssessment = {
      weekNumber: Math.ceil(this.metricsHistory.length / 7),
      overallReadiness,
      fatigueIndex: recoveryAnalysis.fatigueIndex,
      performanceIndex: performanceAnalysis.trendScore,
      adherenceRate: adherenceAnalysis.adherenceRate,
      progressRate: performanceAnalysis.progressRate,
      recommendedAdjustments: adjustments,
      periodizationRecommendation: periodizationAction,
      deloadRecommended: this.shouldDeload(recoveryAnalysis, performanceAnalysis),
      intensificationReady: this.canIntensify(performanceAnalysis, recoveryAnalysis)
    };

    console.log(`✅ Análisis completado. Readiness: ${overallReadiness}%`);
    return assessment;
  }

  /**
   * Aplica ajustes automáticos al plan de entrenamiento
   */
  public applyAutomaticAdjustments(
    workoutPlan: any,
    adjustments: TrainingAdjustment[]
  ): any {
    const adjustedPlan = JSON.parse(JSON.stringify(workoutPlan));
    
    for (const adjustment of adjustments) {
      this.applyAdjustmentToPlan(adjustedPlan, adjustment);
      this.adjustmentHistory.push(adjustment);
    }

    adjustedPlan.lastAdjusted = new Date();
    adjustedPlan.adjustmentCount = (adjustedPlan.adjustmentCount || 0) + adjustments.length;
    
    return adjustedPlan;
  }

  private getLastWeekMetrics(): TrainingMetrics[] {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.metricsHistory.filter(metrics => metrics.date >= oneWeekAgo);
  }

  private analyzePerformanceTrends(metrics: TrainingMetrics[]): any {
    if (metrics.length === 0) {
      return { trendScore: 50, progressRate: 0, isImproving: false };
    }

    const avgRPE = metrics.reduce((sum, m) => sum + m.rpe, 0) / metrics.length;
    const avgRIR = metrics.reduce((sum, m) => sum + m.rir, 0) / metrics.length;
    
    // Analizar tendencia de peso/volumen
    const volumeTrend = this.calculateVolumeTrend(metrics);
    const intensityTrend = this.calculateIntensityTrend(metrics);
    
    const trendScore = Math.min(100, Math.max(0, 
      (volumeTrend * 0.4) + (intensityTrend * 0.3) + ((10 - avgRPE) * 5) + (avgRIR * 5)
    ));

    return {
      trendScore,
      progressRate: volumeTrend > 0 ? volumeTrend * 10 : 0,
      isImproving: trendScore > 60,
      avgRPE,
      avgRIR,
      volumeTrend,
      intensityTrend
    };
  }

  private analyzeRecoveryStatus(metrics: TrainingMetrics[]): any {
    if (metrics.length === 0) {
      return { fatigueIndex: 50, recoveryQuality: 50 };
    }

    const avgSleep = metrics.reduce((sum, m) => sum + m.sleepQuality, 0) / metrics.length;
    const avgStress = metrics.reduce((sum, m) => sum + m.stressLevel, 0) / metrics.length;
    const avgSymptoms = metrics.reduce((sum, m) => sum + m.muscleSymptoms, 0) / metrics.length;
    const avgHRV = metrics.reduce((sum, m) => sum + m.heartRateData.hrv, 0) / metrics.length;

    const fatigueIndex = Math.min(100, Math.max(0,
      (avgStress * 8) + (avgSymptoms * 6) + ((10 - avgSleep) * 6) + ((50 - avgHRV) * 0.8)
    ));

    const recoveryQuality = 100 - fatigueIndex;

    return {
      fatigueIndex,
      recoveryQuality,
      avgSleep,
      avgStress,
      avgSymptoms,
      avgHRV
    };
  }

  private analyzeAdherence(metrics: TrainingMetrics[]): any {
    if (metrics.length === 0) {
      return { adherenceRate: 100, consistencyScore: 100 };
    }

    const adherenceRate = metrics.reduce((sum, m) => sum + m.adherence, 0) / metrics.length;
    const motivationTrend = this.calculateMotivationTrend(metrics);
    const consistencyScore = Math.min(100, adherenceRate + motivationTrend);

    return {
      adherenceRate,
      consistencyScore,
      motivationTrend
    };
  }

  private calculateReadiness(performance: any, recovery: any, adherence: any): number {
    return Math.round(
      (performance.trendScore * 0.35) +
      (recovery.recoveryQuality * 0.40) +
      (adherence.consistencyScore * 0.25)
    );
  }

  private async generateAdjustments(
    metrics: TrainingMetrics[],
    currentPlan: any,
    readiness: number
  ): Promise<TrainingAdjustment[]> {
    const adjustments: TrainingAdjustment[] = [];

    if (metrics.length === 0) return adjustments;

    // Analizar cada ejercicio individualmente
    const exerciseAnalysis = this.analyzeExercisePerformance(metrics);
    
    for (const [exerciseName, analysis] of exerciseAnalysis) {
      const exerciseAdjustments = this.generateExerciseAdjustments(
        exerciseName,
        analysis,
        readiness
      );
      adjustments.push(...exerciseAdjustments);
    }

    // Ajustes globales basados en readiness
    if (readiness < 70) {
      adjustments.push({
        exerciseName: 'GLOBAL',
        adjustmentType: 'volume',
        previousValue: '100%',
        newValue: '85%',
        adjustmentPercentage: -15,
        reason: 'Reducción de volumen por baja readiness',
        confidence: 0.85,
        periodizationPhase: 'recovery'
      });
    } else if (readiness > 85) {
      adjustments.push({
        exerciseName: 'GLOBAL',
        adjustmentType: 'intensity',
        previousValue: '100%',
        newValue: '105%',
        adjustmentPercentage: 5,
        reason: 'Incremento de intensidad por alta readiness',
        confidence: 0.78,
        periodizationPhase: 'intensification'
      });
    }

    return adjustments;
  }

  private analyzeExercisePerformance(metrics: TrainingMetrics[]): Map<string, any> {
    const exerciseAnalysis = new Map();

    for (const session of metrics) {
      for (const exercise of session.exerciseData) {
        if (!exerciseAnalysis.has(exercise.exerciseName)) {
          exerciseAnalysis.set(exercise.exerciseName, {
            sessions: [],
            avgRPE: 0,
            avgRIR: 0,
            weightProgression: 0,
            formQuality: 0,
            completionRate: 0
          });
        }

        const analysis = exerciseAnalysis.get(exercise.exerciseName);
        analysis.sessions.push(exercise);
      }
    }

    // Calcular métricas para cada ejercicio
    for (const [exerciseName, data] of exerciseAnalysis) {
      const sessions = data.sessions;
      data.avgRPE = sessions.reduce((sum: number, s: any) => sum + s.rpe, 0) / sessions.length;
      data.avgRIR = sessions.reduce((sum: number, s: any) => sum + s.rir, 0) / sessions.length;
      data.formQuality = sessions.reduce((sum: number, s: any) => sum + s.formQuality, 0) / sessions.length;
      data.completionRate = sessions.reduce((sum: number, s: any) => 
        sum + (s.completedSets / s.plannedSets), 0) / sessions.length * 100;
      
      // Calcular progresión de peso
      if (sessions.length > 1) {
        const firstWeight = sessions[0].actualWeight;
        const lastWeight = sessions[sessions.length - 1].actualWeight;
        data.weightProgression = ((lastWeight - firstWeight) / firstWeight) * 100;
      }
    }

    return exerciseAnalysis;
  }

  private generateExerciseAdjustments(
    exerciseName: string,
    analysis: any,
    globalReadiness: number
  ): TrainingAdjustment[] {
    const adjustments: TrainingAdjustment[] = [];

    // Ajuste de peso basado en RPE/RIR
    if (analysis.avgRPE < 7 && analysis.avgRIR > 3) {
      // Muy fácil - incrementar peso
      adjustments.push({
        exerciseName,
        adjustmentType: 'weight',
        previousValue: analysis.sessions[analysis.sessions.length - 1].actualWeight,
        newValue: Math.round(analysis.sessions[analysis.sessions.length - 1].actualWeight * 1.05),
        adjustmentPercentage: 5,
        reason: 'RPE bajo y RIR alto indican capacidad para más carga',
        confidence: 0.88,
        periodizationPhase: 'progression'
      });
    } else if (analysis.avgRPE > 9 || analysis.avgRIR < 1) {
      // Muy difícil - reducir peso
      adjustments.push({
        exerciseName,
        adjustmentType: 'weight',
        previousValue: analysis.sessions[analysis.sessions.length - 1].actualWeight,
        newValue: Math.round(analysis.sessions[analysis.sessions.length - 1].actualWeight * 0.95),
        adjustmentPercentage: -5,
        reason: 'RPE alto o RIR bajo indican sobrecarga',
        confidence: 0.92,
        periodizationPhase: 'deload'
      });
    }

    // Ajuste de series basado en completion rate
    if (analysis.completionRate < 80) {
      adjustments.push({
        exerciseName,
        adjustmentType: 'sets',
        previousValue: analysis.sessions[0].plannedSets,
        newValue: Math.max(1, analysis.sessions[0].plannedSets - 1),
        adjustmentPercentage: -20,
        reason: 'Baja tasa de finalización de series',
        confidence: 0.75,
        periodizationPhase: 'adjustment'
      });
    }

    // Ajuste de descanso basado en recuperación
    if (analysis.avgRPE > 8) {
      adjustments.push({
        exerciseName,
        adjustmentType: 'rest',
        previousValue: '120s',
        newValue: '150s',
        adjustmentPercentage: 25,
        reason: 'RPE elevado requiere mayor recuperación entre series',
        confidence: 0.82,
        periodizationPhase: 'recovery'
      });
    }

    return adjustments;
  }

  private evaluatePeriodization(performance: any, recovery: any): PeriodizationAction {
    let recommendedPhase = 'maintenance';
    let reason = '';

    if (recovery.fatigueIndex > 70) {
      recommendedPhase = 'deload';
      reason = 'Alta fatiga acumulada requiere recuperación activa';
    } else if (performance.isImproving && recovery.recoveryQuality > 75) {
      recommendedPhase = 'intensification';
      reason = 'Buena recuperación y progreso permiten intensificación';
    } else if (performance.trendScore < 50) {
      recommendedPhase = 'volume';
      reason = 'Estancamiento requiere incremento de volumen';
    }

    return {
      currentPhase: 'current',
      recommendedPhase,
      transitionReason: reason,
      transitionTimeline: '1-2 semanas',
      expectedOutcomes: this.getPhaseOutcomes(recommendedPhase)
    };
  }

  private shouldDeload(recovery: any, performance: any): boolean {
    return recovery.fatigueIndex > 70 || 
           (recovery.fatigueIndex > 60 && performance.trendScore < 40);
  }

  private canIntensify(performance: any, recovery: any): boolean {
    return performance.isImproving && 
           recovery.recoveryQuality > 75 && 
           performance.progressRate > 5;
  }

  private applyAdjustmentToPlan(plan: any, adjustment: TrainingAdjustment): void {
    // Implementar la aplicación de ajustes al plan
    if (!plan.adjustments) plan.adjustments = [];
    plan.adjustments.push({
      ...adjustment,
      appliedAt: new Date()
    });
  }

  private calculateVolumeTrend(metrics: TrainingMetrics[]): number {
    if (metrics.length < 2) return 0;
    
    const totalVolumes = metrics.map(session => 
      session.exerciseData.reduce((sum, ex) => 
        sum + (ex.actualWeight * ex.actualReps.reduce((s, r) => s + r, 0)), 0
      )
    );

    const firstHalf = totalVolumes.slice(0, Math.ceil(totalVolumes.length / 2));
    const secondHalf = totalVolumes.slice(Math.floor(totalVolumes.length / 2));

    const avgFirst = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

    return ((avgSecond - avgFirst) / avgFirst) * 100;
  }

  private calculateIntensityTrend(metrics: TrainingMetrics[]): number {
    if (metrics.length < 2) return 0;

    const avgWeights = metrics.map(session => {
      const weights = session.exerciseData.map(ex => ex.actualWeight);
      return weights.reduce((sum, w) => sum + w, 0) / weights.length;
    });

    const trend = (avgWeights[avgWeights.length - 1] - avgWeights[0]) / avgWeights[0] * 100;
    return Math.max(-20, Math.min(20, trend));
  }

  private calculateMotivationTrend(metrics: TrainingMetrics[]): number {
    if (metrics.length < 2) return 0;

    const motivationScores = metrics.map(m => m.motivation);
    const trend = motivationScores[motivationScores.length - 1] - motivationScores[0];
    return trend * 5; // Scale to percentage
  }

  private getPhaseOutcomes(phase: string): string[] {
    const outcomes: { [key: string]: string[] } = {
      'deload': [
        'Reducción de fatiga acumulada',
        'Mejora de marcadores de recuperación',
        'Preparación para próxima fase de progresión'
      ],
      'intensification': [
        'Incremento de fuerza máxima',
        'Mejoras en rendimiento específico',
        'Adaptaciones neurales avanzadas'
      ],
      'volume': [
        'Incremento de capacidad de trabajo',
        'Hipertrofia muscular',
        'Mejora de base aeróbica'
      ],
      'maintenance': [
        'Preservación de adaptaciones actuales',
        'Estabilización de rendimiento',
        'Preparación para próximo ciclo'
      ]
    };

    return outcomes[phase] || outcomes['maintenance'];
  }

  private initializeBaselines(): void {
    this.baselineMetrics.set('rpe', 7);
    this.baselineMetrics.set('rir', 2);
    this.baselineMetrics.set('adherence', 85);
    this.baselineMetrics.set('sleep', 7);
    this.baselineMetrics.set('hrv', 45);
  }

  private updateBaselines(metrics: TrainingMetrics): void {
    // Actualizar líneas base con promedio móvil
    const weight = 0.1; // 10% de peso para nueva información
    
    const currentRPE = this.baselineMetrics.get('rpe') || 7;
    this.baselineMetrics.set('rpe', currentRPE * (1 - weight) + metrics.rpe * weight);
    
    const currentAdherence = this.baselineMetrics.get('adherence') || 85;
    this.baselineMetrics.set('adherence', currentAdherence * (1 - weight) + metrics.adherence * weight);
  }

  /**
   * Obtiene recomendaciones para la próxima sesión
   */
  public getNextSessionRecommendations(exerciseName?: string): string[] {
    const recent = this.metricsHistory.slice(-3);
    const recommendations: string[] = [];

    if (recent.length === 0) {
      return ['Registra métricas de tus sesiones para obtener recomendaciones personalizadas'];
    }

    const avgRPE = recent.reduce((sum, m) => sum + m.rpe, 0) / recent.length;
    const avgRecovery = recent.reduce((sum, m) => sum + m.sleepQuality, 0) / recent.length;

    if (avgRPE > 8.5) {
      recommendations.push('Considera reducir la intensidad un 5-10% en la próxima sesión');
    }

    if (avgRecovery < 6) {
      recommendations.push('Prioriza el descanso - considera una sesión de recuperación activa');
    }

    if (recent.every(m => m.adherence > 90)) {
      recommendations.push('Excelente adherencia! Podrías intentar un pequeño incremento de volumen');
    }

    return recommendations;
  }
}

export const adaptiveTrainingSystem = new AdaptiveTrainingSystem();