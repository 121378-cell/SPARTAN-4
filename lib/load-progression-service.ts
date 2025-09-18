import { storageManager } from './storage';
import type { 
  WorkoutSession, 
  LoadProgressionMetric, 
  ProgressionAdjustment, 
  ProgressionHistory,
  ProgressionPlan,
  PeriodizationPhase
} from './types';

export class LoadProgressionService {
  private static instance: LoadProgressionService;
  
  static getInstance(): LoadProgressionService {
    if (!LoadProgressionService.instance) {
      LoadProgressionService.instance = new LoadProgressionService();
    }
    return LoadProgressionService.instance;
  }
  
  /**
   * Records progression metrics from a workout session
   */
  recordProgressionMetrics(session: WorkoutSession): LoadProgressionMetric[] {
    const metrics: LoadProgressionMetric[] = [];
    
    session.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.weight !== null && set.reps !== null && set.rpe !== null) {
          const metric: LoadProgressionMetric = {
            exerciseName: exercise.name,
            date: session.date,
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
            rir: this.calculateRIR(set.reps, set.rpe),
            completed: set.reps > 0 // Consider completed if reps > 0
          };
          
          metrics.push(metric);
          storageManager.addProgressionMetric(metric);
        }
      });
    });
    
    return metrics;
  }
  
  /**
   * Calculates Reps in Reserve (RIR) based on reps and RPE
   */
  private calculateRIR(reps: number, rpe: number): number {
    // Simplified RIR calculation
    // RIR = 10 - RPE (approximate relationship)
    return Math.max(0, 10 - rpe);
  }
  
  /**
   * Analyzes progression metrics and generates adjustments
   */
  analyzeProgression(userId: string, exerciseName: string): ProgressionPlan {
    const metrics = storageManager.getProgressionMetrics()
      .filter((m: LoadProgressionMetric) => m.exerciseName === exerciseName)
      .sort((a: LoadProgressionMetric, b: LoadProgressionMetric) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (metrics.length === 0) {
      return {
        exerciseName,
        currentWeight: 0,
        recommendedWeight: 0,
        nextPhase: 'accumulation',
        adjustments: [],
        notes: ['No hay datos suficientes para generar recomendaciones']
      };
    }
    
    const latestMetric = metrics[0];
    const currentWeight = latestMetric.weight;
    
    // Calculate progression factors
    const performanceTrend = this.calculatePerformanceTrend(metrics);
    const volumeTrend = this.calculateVolumeTrend(metrics);
    const intensityTrend = this.calculateIntensityTrend(metrics);
    
    // Generate adjustments based on analysis
    const adjustments: ProgressionAdjustment[] = [];
    
    // If user successfully completed sets with low RPE and high RIR, increase load
    if (latestMetric.rpe < 7 && latestMetric.rir > 3) {
      adjustments.push({
        exerciseName,
        adjustmentType: 'weight',
        value: 5, // 5% increase
        reason: 'RPE bajo y RIR alto indican capacidad para más carga',
        confidence: 0.85,
        applied: false
      });
    }
    // If user struggled (high RPE, low RIR), consider reducing load or deloading
    else if (latestMetric.rpe > 8 || latestMetric.rir < 1) {
      if (this.shouldDeload(metrics)) {
        adjustments.push({
          exerciseName,
          adjustmentType: 'deload',
          value: -10, // 10% reduction
          reason: 'Sobrecarga detectada - se recomienda semana de recuperación',
          confidence: 0.90,
          applied: false
        });
      } else {
        adjustments.push({
          exerciseName,
          adjustmentType: 'weight',
          value: -2.5, // 2.5% reduction
          reason: 'RPE alto o RIR bajo indican sobrecarga',
          confidence: 0.80,
          applied: false
        });
      }
    }
    // If user consistently fails to complete sets, reduce volume
    else if (!latestMetric.completed) {
      adjustments.push({
        exerciseName,
        adjustmentType: 'volume',
        value: -15, // 15% reduction in volume
        reason: 'Fallo en completar repeticiones - reducir volumen',
        confidence: 0.85,
        applied: false
      });
    }
    // If user is progressing well, consider increasing intensity
    else if (performanceTrend > 0.7 && intensityTrend > 0.5) {
      adjustments.push({
        exerciseName,
        adjustmentType: 'intensity',
        value: 3, // 3% increase
        reason: 'Buen progreso detectado - aumentar intensidad',
        confidence: 0.75,
        applied: false
      });
    }
    
    // Determine next periodization phase
    const nextPhase = this.determineNextPhase(metrics, performanceTrend, volumeTrend);
    
    // Calculate recommended weight
    let recommendedWeight = currentWeight;
    const weightAdjustments = adjustments.filter(a => a.adjustmentType === 'weight');
    if (weightAdjustments.length > 0) {
      const totalAdjustment = weightAdjustments.reduce((sum, a) => sum + a.value, 0);
      recommendedWeight = currentWeight * (1 + totalAdjustment / 100);
    }
    
    // Add notes based on analysis
    const notes: string[] = [];
    if (performanceTrend > 0.7) {
      notes.push('Progreso consistente detectado');
    }
    if (volumeTrend < 0.3) {
      notes.push('Volumen bajo - considerar aumentar');
    }
    if (intensityTrend > 0.8) {
      notes.push('Alta intensidad - monitorear fatiga');
    }
    
    const plan: ProgressionPlan = {
      exerciseName,
      currentWeight,
      recommendedWeight: Math.round(recommendedWeight * 100) / 100, // Round to 2 decimal places
      nextPhase,
      adjustments,
      notes
    };
    
    storageManager.addProgressionPlan(plan);
    return plan;
  }
  
  /**
   * Calculates performance trend (0-1 scale)
   */
  private calculatePerformanceTrend(metrics: LoadProgressionMetric[]): number {
    if (metrics.length < 2) return 0.5;
    
    // Compare recent performance with older performance
    const recentMetrics = metrics.slice(0, Math.min(3, metrics.length));
    const olderMetrics = metrics.slice(Math.min(3, metrics.length), Math.min(6, metrics.length));
    
    if (olderMetrics.length === 0) return 0.5;
    
    const recentAvgRPE = recentMetrics.reduce((sum, m) => sum + m.rpe, 0) / recentMetrics.length;
    const olderAvgRPE = olderMetrics.reduce((sum, m) => sum + m.rpe, 0) / olderMetrics.length;
    
    // Lower RPE indicates better performance
    const trend = (olderAvgRPE - recentAvgRPE) / 10;
    return Math.max(0, Math.min(1, (trend + 0.5)));
  }
  
  /**
   * Calculates volume trend (0-1 scale)
   */
  private calculateVolumeTrend(metrics: LoadProgressionMetric[]): number {
    if (metrics.length < 2) return 0.5;
    
    // Calculate volume for each metric (weight * reps)
    const volumes = metrics.map(m => m.weight * m.reps);
    
    // Compare recent volume with older volume
    const recentVolumes = volumes.slice(0, Math.min(3, volumes.length));
    const olderVolumes = volumes.slice(Math.min(3, volumes.length), Math.min(6, volumes.length));
    
    if (olderVolumes.length === 0) return 0.5;
    
    const recentAvgVolume = recentVolumes.reduce((sum, v) => sum + v, 0) / recentVolumes.length;
    const olderAvgVolume = olderVolumes.reduce((sum, v) => sum + v, 0) / olderVolumes.length;
    
    const trend = (recentAvgVolume - olderAvgVolume) / recentAvgVolume;
    return Math.max(0, Math.min(1, (trend + 0.5)));
  }
  
  /**
   * Calculates intensity trend (0-1 scale)
   */
  private calculateIntensityTrend(metrics: LoadProgressionMetric[]): number {
    if (metrics.length < 2) return 0.5;
    
    // Calculate intensity as weight relative to estimated 1RM
    const intensities = metrics.map(m => {
      // Simplified 1RM estimation: weight * (1 + reps/30)
      const estimated1RM = m.weight * (1 + m.reps / 30);
      return m.weight / estimated1RM;
    });
    
    // Compare recent intensity with older intensity
    const recentIntensities = intensities.slice(0, Math.min(3, intensities.length));
    const olderIntensities = intensities.slice(Math.min(3, intensities.length), Math.min(6, intensities.length));
    
    if (olderIntensities.length === 0) return 0.5;
    
    const recentAvgIntensity = recentIntensities.reduce((sum, i) => sum + i, 0) / recentIntensities.length;
    const olderAvgIntensity = olderIntensities.reduce((sum, i) => sum + i, 0) / olderIntensities.length;
    
    const trend = (recentAvgIntensity - olderAvgIntensity) / recentAvgIntensity;
    return Math.max(0, Math.min(1, (trend + 0.5)));
  }
  
  /**
   * Determines if deload is needed
   */
  private shouldDeload(metrics: LoadProgressionMetric[]): boolean {
    if (metrics.length < 4) return false;
    
    // Check for signs of overreaching
    const recentMetrics = metrics.slice(0, 4);
    
    // High RPE consistently
    const highRPECount = recentMetrics.filter(m => m.rpe > 8).length;
    if (highRPECount >= 3) return true;
    
    // Failed sets consistently
    const failedCount = recentMetrics.filter(m => !m.completed).length;
    if (failedCount >= 2) return true;
    
    // High RIR consistently (indicates difficulty)
    const highRIRCount = recentMetrics.filter(m => m.rir < 1).length;
    if (highRIRCount >= 3) return true;
    
    return false;
  }
  
  /**
   * Determines next periodization phase
   */
  private determineNextPhase(
    metrics: LoadProgressionMetric[], 
    performanceTrend: number, 
    volumeTrend: number
  ): PeriodizationPhase {
    if (this.shouldDeload(metrics)) {
      return 'deload';
    }
    
    if (performanceTrend > 0.7 && volumeTrend > 0.6) {
      return 'intensification';
    }
    
    if (performanceTrend < 0.3 || volumeTrend < 0.2) {
      return 'accumulation';
    }
    
    return 'accumulation';
  }
  
  /**
   * Gets progression history for an exercise
   */
  getProgressionHistory(exerciseName: string, days: number = 30): ProgressionHistory[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return storageManager.getProgressionHistory()
      .filter((h: ProgressionHistory) => h.exerciseName === exerciseName && new Date(h.date) >= cutoffDate)
      .sort((a: ProgressionHistory, b: ProgressionHistory) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  /**
   * Applies progression adjustments to workout plans
   */
  applyProgressionAdjustments(
    workoutPlan: any,
    adjustments: ProgressionAdjustment[]
  ): any {
    const adjustedPlan = JSON.parse(JSON.stringify(workoutPlan));
    
    // Apply adjustments to exercises in the plan
    if (adjustedPlan.days) {
      adjustedPlan.days.forEach((day: any) => {
        if (day.exercises) {
          day.exercises.forEach((exercise: any) => {
            const exerciseAdjustments = adjustments.filter(a => a.exerciseName === exercise.name);
            exerciseAdjustments.forEach(adjustment => {
              if (adjustment.adjustmentType === 'weight' && exercise.sets) {
                // Apply weight adjustment to all sets
                exercise.sets = exercise.sets.map((set: any) => {
                  if (set.weight) {
                    const newWeight = set.weight * (1 + adjustment.value / 100);
                    return { ...set, weight: Math.round(newWeight * 100) / 100 };
                  }
                  return set;
                });
              }
            });
          });
        }
      });
    }
    
    // Mark adjustments as applied
    adjustments.forEach(adjustment => {
      adjustment.applied = true;
    });
    
    return adjustedPlan;
  }
}

export const loadProgressionService = LoadProgressionService.getInstance();