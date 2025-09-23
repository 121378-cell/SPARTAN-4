/**
 * Predictive Performance Engine for SPARTAN 4
 * Analyzes training, nutrition, and recovery trends to generate proactive alerts, 
 * performance predictions, and preventive recommendations
 */

import { ChatContext } from './chat-maestro-service';
import { predictiveAnalyticsEngine, BiometricData, AdherenceMetrics } from './predictive-analytics';
import { spartanNervousSystem } from './spartan-nervous-system';
import { storageManager } from './storage';
import { 
  UserData, 
  WorkoutSession, 
  RecoveryAnalysis, 
  DailyNutrition, 
  UserHabit 
} from './types';

// Types for predictive performance system
export type PerformanceTrend = {
  metric: string;
  currentValue: number;
  trend: 'improving' | 'declining' | 'stable';
  rateOfChange: number; // percentage change per week
  projectedValue: number; // projected value in 4 weeks
  confidence: number; // 0-1 scale
};

export type ProactiveAlert = {
  id: string;
  type: 'training_risk' | 'nutrition_risk' | 'recovery_risk' | 'performance_risk' | 'adherence_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  triggeredAt: Date;
  predictedImpact: string;
  recommendedActions: string[];
};

export type PerformancePrediction = {
  timeframe: '1_week' | '2_weeks' | '1_month' | '3_months';
  metrics: {
    strength: number; // percentage improvement
    endurance: number; // percentage improvement
    bodyComposition: number; // percentage improvement in body fat reduction
    recovery: number; // percentage improvement in recovery score
  };
  confidence: number; // 0-1 scale
  keyFactors: string[];
};

export type PreventiveRecommendation = {
  id: string;
  category: 'training' | 'nutrition' | 'recovery' | 'lifestyle';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementationSteps: string[];
  expectedBenefits: string[];
  timeframe: string; // e.g., "7 days", "2 weeks"
  confidence: number; // 0-1 scale
};

export class PredictivePerformanceEngine {
  private static instance: PredictivePerformanceEngine;
  
  static getInstance(): PredictivePerformanceEngine {
    if (!PredictivePerformanceEngine.instance) {
      PredictivePerformanceEngine.instance = new PredictivePerformanceEngine();
    }
    return PredictivePerformanceEngine.instance;
  }
  
  /**
   * Analyze performance trends across training, nutrition, and recovery
   */
  public analyzePerformanceTrends(context: ChatContext): PerformanceTrend[] {
    console.log('📈 Analyzing performance trends');
    
    const trends: PerformanceTrend[] = [];
    
    // Analyze training trends
    trends.push(...this.analyzeTrainingTrends(context.recentWorkouts));
    
    // Analyze nutrition trends
    trends.push(...this.analyzeNutritionTrends(context.nutritionData));
    
    // Analyze recovery trends
    trends.push(...this.analyzeRecoveryTrends(context.recoveryStatus));
    
    // Analyze adherence trends
    trends.push(...this.analyzeAdherenceTrends(context.userHabits, context.recentWorkouts));
    
    return trends;
  }
  
  /**
   * Generate proactive alerts based on risk analysis
   */
  public generateProactiveAlerts(context: ChatContext): ProactiveAlert[] {
    console.log('⚠️ Generating proactive alerts');
    
    const alerts: ProactiveAlert[] = [];
    
    // Generate training risk alerts
    alerts.push(...this.generateTrainingRiskAlerts(context.recentWorkouts, context.userHabits));
    
    // Generate nutrition risk alerts
    alerts.push(...this.generateNutritionRiskAlerts(context.nutritionData, context.userData));
    
    // Generate recovery risk alerts
    alerts.push(...this.generateRecoveryRiskAlerts(context.recoveryStatus, context.wearableInsights));
    
    // Generate performance risk alerts
    alerts.push(...this.generatePerformanceRiskAlerts(context.recentWorkouts));
    
    // Generate adherence risk alerts
    alerts.push(...this.generateAdherenceRiskAlerts(context.userHabits));
    
    // Notify nervous system of critical alerts
    const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
    if (criticalAlerts.length > 0) {
      spartanNervousSystem.emitEvent({
        type: 'alert_triggered',
        timestamp: new Date(),
        userId: context.userId,
        payload: {
          alerts: criticalAlerts,
          context
        },
        sourceModule: 'PredictivePerformanceEngine',
        priority: 'critical'
      });
    }
    
    return alerts;
  }
  
  /**
   * Generate performance predictions for different timeframes
   */
  public generatePerformancePredictions(context: ChatContext): PerformancePrediction[] {
    console.log('🔮 Generating performance predictions');
    
    // Extract biometric data
    const biometricData = this.extractBiometricData(context);
    
    // Calculate adherence metrics
    const adherenceMetrics = this.calculateAdherenceMetrics(context);
    
    // Generate predictions using existing predictive analytics engine
    const predictiveInsights = predictiveAnalyticsEngine.generatePredictions(
      context.userData,
      biometricData,
      adherenceMetrics
    );
    
    // Convert to our performance prediction format
    const predictions: PerformancePrediction[] = [];
    
    for (const projection of predictiveInsights.projections) {
      let timeframe: '1_week' | '2_weeks' | '1_month' | '3_months';
      
      switch (projection.timeframe) {
        case '1_month':
          timeframe = '1_month';
          break;
        case '3_months':
          timeframe = '3_months';
          break;
        default:
          // Skip other timeframes for now
          continue;
      }
      
      predictions.push({
        timeframe,
        metrics: {
          strength: projection.strength.projectedIncrease,
          endurance: projection.muscleMass.projectedIncrease * 0.7, // Estimate endurance from muscle mass
          bodyComposition: projection.bodyComposition.projectedDecrease * 2, // Emphasize body fat reduction
          recovery: adherenceMetrics.sleepQuality / 20 // Estimate recovery improvement from sleep quality
        },
        confidence: projection.confidence / 100,
        keyFactors: projection.keyFactors
      });
    }
    
    // Add short-term predictions
    predictions.unshift({
      timeframe: '1_week',
      metrics: {
        strength: this.calculateShortTermProjection(context.recentWorkouts, 'strength'),
        endurance: this.calculateShortTermProjection(context.recentWorkouts, 'endurance'),
        bodyComposition: this.calculateShortTermProjection(context.recentWorkouts, 'body_composition'),
        recovery: this.calculateShortTermProjection(context.recentWorkouts, 'recovery')
      },
      confidence: 0.85,
      keyFactors: ['Recent workout consistency', 'Nutrition adherence', 'Sleep quality']
    });
    
    predictions.unshift({
      timeframe: '2_weeks',
      metrics: {
        strength: this.calculateShortTermProjection(context.recentWorkouts, 'strength') * 1.8,
        endurance: this.calculateShortTermProjection(context.recentWorkouts, 'endurance') * 1.8,
        bodyComposition: this.calculateShortTermProjection(context.recentWorkouts, 'body_composition') * 1.5,
        recovery: this.calculateShortTermProjection(context.recentWorkouts, 'recovery') * 1.3
      },
      confidence: 0.8,
      keyFactors: ['Training progression', 'Nutrition consistency', 'Recovery optimization']
    });
    
    return predictions;
  }
  
  /**
   * Generate preventive recommendations to maximize results and minimize risks
   */
  public generatePreventiveRecommendations(context: ChatContext): PreventiveRecommendation[] {
    console.log('💡 Generating preventive recommendations');
    
    const recommendations: PreventiveRecommendation[] = [];
    
    // Generate training recommendations
    recommendations.push(...this.generateTrainingRecommendations(context.recentWorkouts, context.userHabits));
    
    // Generate nutrition recommendations
    recommendations.push(...this.generateNutritionRecommendations(context.nutritionData, context.userData));
    
    // Generate recovery recommendations
    recommendations.push(...this.generateRecoveryRecommendations(context.recoveryStatus, context.wearableInsights));
    
    // Generate lifestyle recommendations
    recommendations.push(...this.generateLifestyleRecommendations(context.userHabits));
    
    // Sort by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Notify nervous system of recommendations
    spartanNervousSystem.emitEvent({
      type: 'recommendation_made',
      timestamp: new Date(),
      userId: context.userId,
      payload: {
        recommendations,
        context
      },
      sourceModule: 'PredictivePerformanceEngine',
      priority: 'medium'
    });
    
    return recommendations;
  }
  
  /**
   * Analyze training trends from recent workouts
   */
  private analyzeTrainingTrends(recentWorkouts: WorkoutSession[]): PerformanceTrend[] {
    if (recentWorkouts.length < 2) {
      return [];
    }
    
    // Sort workouts by date (oldest first)
    const sortedWorkouts = [...recentWorkouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate volume trend (total sets * reps)
    const volumes = sortedWorkouts.map(workout => {
      return workout.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((setTotal, set) => {
          return setTotal + (set.reps || 0);
        }, 0);
      }, 0);
    });
    
    const volumeTrend = this.calculateTrend(volumes);
    
    // Calculate intensity trend (average weight lifted)
    const intensities = sortedWorkouts.map(workout => {
      const totalWeight = workout.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((setTotal, set) => {
          return setTotal + ((set.weight || 0) * (set.reps || 0));
        }, 0);
      }, 0);
      const totalReps = workout.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((setTotal, set) => {
          return setTotal + (set.reps || 0);
        }, 0);
      }, 0);
      return totalReps > 0 ? totalWeight / totalReps : 0;
    });
    
    const intensityTrend = this.calculateTrend(intensities);
    
    // Calculate frequency trend (workouts per week)
    const frequencyTrend = this.calculateFrequencyTrend(sortedWorkouts);
    
    return [
      {
        metric: 'training_volume',
        currentValue: volumes[volumes.length - 1],
        trend: volumeTrend.trend,
        rateOfChange: volumeTrend.rateOfChange,
        projectedValue: volumeTrend.projectedValue,
        confidence: volumeTrend.confidence
      },
      {
        metric: 'training_intensity',
        currentValue: intensities[intensities.length - 1],
        trend: intensityTrend.trend,
        rateOfChange: intensityTrend.rateOfChange,
        projectedValue: intensityTrend.projectedValue,
        confidence: intensityTrend.confidence
      },
      {
        metric: 'training_frequency',
        currentValue: frequencyTrend.currentValue,
        trend: frequencyTrend.trend,
        rateOfChange: frequencyTrend.rateOfChange,
        projectedValue: frequencyTrend.projectedValue,
        confidence: frequencyTrend.confidence
      }
    ];
  }
  
  /**
   * Analyze nutrition trends from nutrition data
   */
  private analyzeNutritionTrends(nutritionData: DailyNutrition | undefined): PerformanceTrend[] {
    if (!nutritionData) {
      return [];
    }
    
    // For now, we'll return an empty array as we don't have detailed nutrition data
    // In a real implementation, we would analyze macronutrient intake, calories, etc.
    return [];
  }
  
  /**
   * Analyze recovery trends from recovery analysis
   */
  private analyzeRecoveryTrends(recoveryStatus: RecoveryAnalysis | undefined): PerformanceTrend[] {
    if (!recoveryStatus) {
      return [];
    }
    
    // Get recent recovery analyses
    const recoveryAnalyses = (storageManager.getRecoveryAnalyses() || []).slice(0, 10);
    
    if (recoveryAnalyses.length < 2) {
      return [];
    }
    
    // Sort by date (oldest first)
    const sortedAnalyses = [...recoveryAnalyses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate recovery score trend
    const scores = sortedAnalyses.map(analysis => analysis.recoveryScore);
    const scoreTrend = this.calculateTrend(scores);
    
    // Calculate fatigue level trend (convert to numeric)
    const fatigueLevels = sortedAnalyses.map(analysis => {
      switch (analysis.fatigueLevel) {
        case 'low': return 1;
        case 'moderate': return 2;
        case 'high': return 3;
        case 'extreme': return 4;
        default: return 2;
      }
    });
    const fatigueTrend = this.calculateTrend(fatigueLevels);
    
    return [
      {
        metric: 'recovery_score',
        currentValue: scores[scores.length - 1],
        trend: scoreTrend.trend,
        rateOfChange: scoreTrend.rateOfChange,
        projectedValue: scoreTrend.projectedValue,
        confidence: scoreTrend.confidence
      },
      {
        metric: 'fatigue_level',
        currentValue: fatigueLevels[fatigueLevels.length - 1],
        trend: fatigueTrend.trend,
        rateOfChange: fatigueTrend.rateOfChange,
        projectedValue: fatigueTrend.projectedValue,
        confidence: fatigueTrend.confidence
      }
    ];
  }
  
  /**
   * Analyze adherence trends from user habits and workouts
   */
  private analyzeAdherenceTrends(userHabits: UserHabit[], recentWorkouts: WorkoutSession[]): PerformanceTrend[] {
    if (userHabits.length === 0 || recentWorkouts.length === 0) {
      return [];
    }
    
    // Calculate training adherence (actual vs planned workouts)
    const plannedWorkouts = userHabits[0].trainingFrequency || 3; // Assumed 3x per week
    const actualWorkouts = recentWorkouts.length;
    const adherencePercentage = Math.min(100, (actualWorkouts / (plannedWorkouts * 4)) * 100); // For a 4-week period
    
    return [
      {
        metric: 'training_adherence',
        currentValue: adherencePercentage,
        trend: adherencePercentage > 80 ? 'improving' : adherencePercentage > 60 ? 'stable' : 'declining',
        rateOfChange: 0, // Would need historical data to calculate
        projectedValue: adherencePercentage, // Would need historical data to project
        confidence: 0.7
      }
    ];
  }
  
  /**
   * Calculate trend from a series of values
   */
  private calculateTrend(values: number[]): { trend: 'improving' | 'declining' | 'stable', rateOfChange: number, projectedValue: number, confidence: number } {
    if (values.length < 2) {
      return { trend: 'stable', rateOfChange: 0, projectedValue: values[0] || 0, confidence: 0 };
    }
    
    // Calculate linear regression to determine trend
    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumXX += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate rate of change (percentage per data point)
    const rateOfChange = n > 1 ? (slope / values[0]) * 100 : 0;
    
    // Project next value (4 data points ahead)
    const projectedValue = slope * (n + 3) + intercept;
    
    // Determine trend based on slope
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (slope > 0.1) {
      trend = 'improving';
    } else if (slope < -0.1) {
      trend = 'declining';
    }
    
    // Calculate confidence based on R-squared value
    let ssTot = 0, ssRes = 0;
    const mean = sumY / n;
    for (let i = 0; i < n; i++) {
      ssTot += Math.pow(values[i] - mean, 2);
      ssRes += Math.pow(values[i] - (slope * i + intercept), 2);
    }
    const rSquared = 1 - (ssRes / ssTot);
    const confidence = Math.min(1, Math.max(0, rSquared));
    
    return { trend, rateOfChange, projectedValue, confidence };
  }
  
  /**
   * Calculate frequency trend from workout data
   */
  private calculateFrequencyTrend(workouts: WorkoutSession[]): PerformanceTrend {
    if (workouts.length < 2) {
      return {
        metric: 'training_frequency',
        currentValue: workouts.length,
        trend: 'stable',
        rateOfChange: 0,
        projectedValue: workouts.length,
        confidence: 0
      };
    }
    
    // Group workouts by week
    const workoutsByWeek: { [week: string]: number } = {};
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const week = `${date.getFullYear()}-${Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000))}`;
      workoutsByWeek[week] = (workoutsByWeek[week] || 0) + 1;
    });
    
    const weeklyFrequencies = Object.values(workoutsByWeek);
    const trend = this.calculateTrend(weeklyFrequencies);
    
    return {
      metric: 'training_frequency',
      currentValue: weeklyFrequencies[weeklyFrequencies.length - 1] || 0,
      trend: trend.trend,
      rateOfChange: trend.rateOfChange,
      projectedValue: trend.projectedValue,
      confidence: trend.confidence
    };
  }
  
  /**
   * Generate training risk alerts
   */
  private generateTrainingRiskAlerts(recentWorkouts: WorkoutSession[], userHabits: UserHabit[]): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = [];
    
    // Check for overtraining risk (too many workouts in short period)
    if (recentWorkouts.length >= 7) {
      // Check last 7 days
      const last7Days = recentWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return workoutDate >= sevenDaysAgo;
      });
      
      if (last7Days.length >= 5) {
        alerts.push({
          id: `overtraining_risk_${Date.now()}`,
          type: 'training_risk',
          severity: 'high',
          title: 'Riesgo de sobreentrenamiento',
          description: `Has realizado ${last7Days.length} entrenamientos en los últimos 7 días. Esto puede aumentar el riesgo de sobreentrenamiento.`,
          triggeredAt: new Date(),
          predictedImpact: 'Aumento del riesgo de lesiones y disminución del rendimiento',
          recommendedActions: [
            'Considera tomar un día de descanso',
            'Reduce la intensidad de los próximos entrenamientos',
            'Prioriza ejercicios de recuperación activa'
          ]
        });
      }
    }
    
    // Check for training consistency issues
    if (userHabits.length > 0 && recentWorkouts.length < 2) {
      const plannedFrequency = userHabits[0].trainingFrequency || 3;
      if (plannedFrequency > 2) {
        alerts.push({
          id: `consistency_risk_${Date.now()}`,
          type: 'training_risk',
          severity: 'medium',
          title: 'Riesgo de inconsistencia en el entrenamiento',
          description: 'No has realizado suficientes entrenamientos esta semana en comparación con tu frecuencia planificada.',
          triggeredAt: new Date(),
          predictedImpact: 'Desaceleración del progreso y posible pérdida de adaptaciones',
          recommendedActions: [
            'Programa tus entrenamientos con anticipación',
            'Prepara tu ropa y equipo de antemano',
            'Encuentra un compañero de entrenamiento para mayor motivación'
          ]
        });
      }
    }
    
    return alerts;
  }
  
  /**
   * Generate nutrition risk alerts
   */
  private generateNutritionRiskAlerts(nutritionData: DailyNutrition | undefined, userData: UserData): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = [];
    
    // Without detailed nutrition data, we can't generate specific alerts
    // In a real implementation, we would check for caloric deficits, macronutrient imbalances, etc.
    
    return alerts;
  }
  
  /**
   * Generate recovery risk alerts
   */
  private generateRecoveryRiskAlerts(recoveryStatus: RecoveryAnalysis | undefined, wearableInsights: any): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = [];
    
    if (recoveryStatus) {
      // Check for poor recovery
      if (recoveryStatus.recoveryScore < 40) {
        alerts.push({
          id: `poor_recovery_${Date.now()}`,
          type: 'recovery_risk',
          severity: 'high',
          title: 'Baja puntuación de recuperación',
          description: `Tu puntuación de recuperación es ${recoveryStatus.recoveryScore}/100, lo que indica una recuperación deficiente.`,
          triggeredAt: new Date(),
          predictedImpact: 'Aumento del riesgo de sobreentrenamiento y menor adaptación',
          recommendedActions: [
            'Prioriza el sueño (7-9 horas)',
            'Incorpora técnicas de relajación',
            'Considera una sesión de recuperación activa en lugar de entrenamiento intenso'
          ]
        });
      } else if (recoveryStatus.recoveryScore < 60) {
        alerts.push({
          id: `moderate_recovery_${Date.now()}`,
          type: 'recovery_risk',
          severity: 'medium',
          title: 'Recuperación subóptima',
          description: `Tu puntuación de recuperación es ${recoveryStatus.recoveryScore}/100.`,
          triggeredAt: new Date(),
          predictedImpact: 'Posible disminución en la calidad del entrenamiento',
          recommendedActions: [
            'Asegúrate de dormir al menos 7 horas',
            'Hidrátate adecuadamente',
            'Considera reducir la intensidad del próximo entrenamiento'
          ]
        });
      }
      
      // Check for high fatigue
      if (recoveryStatus.fatigueLevel === 'high' || recoveryStatus.fatigueLevel === 'extreme') {
        alerts.push({
          id: `high_fatigue_${Date.now()}`,
          type: 'recovery_risk',
          severity: 'high',
          title: 'Nivel alto de fatiga',
          description: `Tu nivel de fatiga es "${recoveryStatus.fatigueLevel}", lo que indica fatiga significativa.`,
          triggeredAt: new Date(),
          predictedImpact: 'Mayor riesgo de lesiones y menor rendimiento',
          recommendedActions: [
            'Prioriza actividades de recuperación',
            'Considera un día de descanso adicional',
            'Enfócate en técnicas de manejo del estrés'
          ]
        });
      }
    }
    
    return alerts;
  }
  
  /**
   * Generate performance risk alerts
   */
  private generatePerformanceRiskAlerts(recentWorkouts: WorkoutSession[]): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = [];
    
    if (recentWorkouts.length >= 4) {
      // Check for performance plateaus
      const sortedWorkouts = [...recentWorkouts].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const lastWorkouts = sortedWorkouts.slice(0, 4);
      
      // Calculate average performance (simplified as total volume)
      const performances = lastWorkouts.map(workout => {
        return workout.exercises.reduce((total, exercise) => {
          return total + exercise.sets.reduce((setTotal, set) => {
            return setTotal + ((set.weight || 0) * (set.reps || 0));
          }, 0);
        }, 0);
      });
      
      // Check if performance has plateaued (variance < 5%)
      const avgPerformance = performances.reduce((sum, p) => sum + p, 0) / performances.length;
      const performanceVariance = performances.reduce((sum, p) => sum + Math.pow(p - avgPerformance, 2), 0) / performances.length;
      const coefficientOfVariation = Math.sqrt(performanceVariance) / avgPerformance;
      
      if (coefficientOfVariation < 0.05) {
        alerts.push({
          id: `performance_plateau_${Date.now()}`,
          type: 'performance_risk',
          severity: 'medium',
          title: 'Meseta de rendimiento',
          description: 'Tu rendimiento se ha estancado en las últimas semanas, lo que indica una posible meseta.',
          triggeredAt: new Date(),
          predictedImpact: 'Desaceleración del progreso y frustración',
          recommendedActions: [
            'Cambia variables de entrenamiento (intensidad, volumen, ejercicios)',
            'Incorpora periodización no lineal',
            'Evalúa tu plan nutricional'
          ]
        });
      }
    }
    
    return alerts;
  }
  
  /**
   * Generate adherence risk alerts
   */
  private generateAdherenceRiskAlerts(userHabits: UserHabit[]): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = [];
    
    if (userHabits.length > 0) {
      const habit = userHabits[0];
      const adherenceRate = habit.trainingFrequency ? 
        (habit.lastTrainingSessions?.length || 0) / (habit.trainingFrequency * 4) : 0; // 4 weeks
      
      if (adherenceRate < 0.5) {
        alerts.push({
          id: `low_adherence_${Date.now()}`,
          type: 'adherence_risk',
          severity: 'high',
          title: 'Baja adherencia al plan',
          description: 'Tu adherencia al plan de entrenamiento es baja, lo que puede limitar tus resultados.',
          triggeredAt: new Date(),
          predictedImpact: 'Progreso limitado y posibles frustraciones',
          recommendedActions: [
            'Establece recordatorios para tus entrenamientos',
            'Encuentra un compañero de entrenamiento',
            'Empieza con objetivos más pequeños y alcanzables'
          ]
        });
      } else if (adherenceRate < 0.7) {
        alerts.push({
          id: `moderate_adherence_${Date.now()}`,
          type: 'adherence_risk',
          severity: 'medium',
          title: 'Adherencia moderada',
          description: 'Tu adherencia al plan de entrenamiento es moderada y puede mejorarse.',
          triggeredAt: new Date(),
          predictedImpact: 'Progreso subóptimo',
          recommendedActions: [
            'Identifica barreras para el entrenamiento',
            'Planifica tus entrenamientos con anticipación',
            'Celebra pequeños logros para mantener la motivación'
          ]
        });
      }
    }
    
    return alerts;
  }
  
  /**
   * Extract biometric data from context
   */
  private extractBiometricData(context: ChatContext): BiometricData {
    // In a real implementation, we would extract this from wearable data or user input
    return {
      weight: context.userData.weight || 70,
      bodyFatPercentage: 15, // Default value
      muscleMass: (context.userData.weight || 70) * 0.8, // Estimate
      boneDensity: 3.5, // Default value (scale 1-5)
      restingHeartRate: 60, // Default value
      heartRateVariability: 65, // Default value
      bloodPressure: {
        systolic: 120, // Default value
        diastolic: 80 // Default value
      },
      vo2max: 45, // Default value
      glucose: 90, // Default value
      cholesterol: 180 // Default value
    };
  }
  
  /**
   * Calculate adherence metrics from context
   */
  private calculateAdherenceMetrics(context: ChatContext): AdherenceMetrics {
    // Calculate training adherence
    let trainingAdherence = 80; // Default value
    if (context.userHabits.length > 0 && context.recentWorkouts.length > 0) {
      const plannedWorkouts = context.userHabits[0].trainingFrequency || 3;
      trainingAdherence = Math.min(100, (context.recentWorkouts.length / (plannedWorkouts * 4)) * 100); // 4 weeks
    }
    
    // For other metrics, we'll use default values
    // In a real implementation, we would calculate these from actual data
    return {
      trainingAdherence,
      nutritionAdherence: 75, // Default value
      sleepQuality: 70, // Default value
      supplementationAdherence: 60, // Default value
      stressManagement: 65 // Default value
    };
  }
  
  /**
   * Calculate short-term projections
   */
  private calculateShortTermProjection(recentWorkouts: WorkoutSession[], metric: string): number {
    if (recentWorkouts.length < 2) {
      return 0;
    }
    
    // Sort workouts by date (oldest first)
    const sortedWorkouts = [...recentWorkouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate the metric values for the last few workouts
    let values: number[] = [];
    
    switch (metric) {
      case 'strength':
        values = sortedWorkouts.map(workout => {
          // Simplified strength calculation as total weight lifted
          return workout.exercises.reduce((total, exercise) => {
            return total + exercise.sets.reduce((setTotal, set) => {
              return setTotal + ((set.weight || 0) * (set.reps || 0));
            }, 0);
          }, 0);
        });
        break;
        
      case 'endurance':
        values = sortedWorkouts.map(workout => {
          // Simplified endurance calculation as total reps
          return workout.exercises.reduce((total, exercise) => {
            return total + exercise.sets.reduce((setTotal, set) => {
              return setTotal + (set.reps || 0);
            }, 0);
          }, 0);
        });
        break;
        
      case 'body_composition':
        // For body composition, we'll return a default value
        // In a real implementation, we would use actual body fat measurements
        return 0.5;
        
      case 'recovery':
        // For recovery, we'll return a default value
        // In a real implementation, we would use actual recovery metrics
        return 1.2;
    }
    
    if (values.length < 2) {
      return 0;
    }
    
    // Calculate the average rate of change
    let totalChange = 0;
    for (let i = 1; i < values.length; i++) {
      totalChange += values[i] - values[i - 1];
    }
    const avgChange = totalChange / (values.length - 1);
    
    // Project the change over the next week (assuming similar rate)
    const currentValue = values[values.length - 1];
    const projectedValue = currentValue + avgChange;
    
    // Return as percentage improvement
    return currentValue > 0 ? ((projectedValue - currentValue) / currentValue) * 100 : 0;
  }
  
  /**
   * Generate training recommendations
   */
  private generateTrainingRecommendations(recentWorkouts: WorkoutSession[], userHabits: UserHabit[]): PreventiveRecommendation[] {
    const recommendations: PreventiveRecommendation[] = [];
    
    // Check for training consistency
    if (recentWorkouts.length < 3 && userHabits.length > 0) {
      const plannedFrequency = userHabits[0].trainingFrequency || 3;
      if (plannedFrequency > recentWorkouts.length) {
        recommendations.push({
          id: `training_consistency_${Date.now()}`,
          category: 'training',
          priority: 'high',
          title: 'Mejora la consistencia del entrenamiento',
          description: 'Aumentar la frecuencia de entrenamiento para maximizar adaptaciones.',
          implementationSteps: [
            'Programa tus entrenamientos con anticipación',
            'Prepara tu equipo y ropa de antemano',
            'Encuentra un compañero de entrenamiento para mayor responsabilidad'
          ],
          expectedBenefits: [
            'Mejor progresión de fuerza',
            'Mayor adherencia al plan',
            'Mejor condición física general'
          ],
          timeframe: '2 semanas',
          confidence: 0.85
        });
      }
    }
    
    // Check for training variety
    if (recentWorkouts.length >= 4) {
      // Check if the user is doing the same exercises repeatedly
      const exerciseCounts: { [key: string]: number } = {};
      recentWorkouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
        });
      });
      
      const frequentExercises = Object.entries(exerciseCounts)
        .filter(([, count]) => count >= 3)
        .map(([exercise]) => exercise);
      
      if (frequentExercises.length > 0) {
        recommendations.push({
          id: `training_variety_${Date.now()}`,
          category: 'training',
          priority: 'medium',
          title: 'Aumenta la variedad de ejercicios',
          description: 'Incorpora nuevos ejercicios para prevenir mesetas y mejorar el desarrollo muscular.',
          implementationSteps: [
            'Agrega 1-2 ejercicios nuevos por mes',
            'Varía el orden de los ejercicios en tus entrenamientos',
            'Prueba diferentes tipos de equipamiento'
          ],
          expectedBenefits: [
            'Prevención de mesetas',
            'Mejor desarrollo muscular equilibrado',
            'Reducción del riesgo de sobreuso'
          ],
          timeframe: '4 semanas',
          confidence: 0.8
        });
      }
    }
    
    return recommendations;
  }
  
  /**
   * Generate nutrition recommendations
   */
  private generateNutritionRecommendations(nutritionData: DailyNutrition | undefined, userData: UserData): PreventiveRecommendation[] {
    const recommendations: PreventiveRecommendation[] = [];
    
    // Generic nutrition recommendations based on user goals
    const goals = userData.goals || [];
    
    if (goals.includes('Aumentar masa muscular')) {
      recommendations.push({
        id: `muscle_growth_nutrition_${Date.now()}`,
        category: 'nutrition',
        priority: 'high',
        title: 'Optimiza tu ingesta proteica',
        description: 'Asegúrate de consumir suficiente proteína para maximizar la síntesis proteica.',
        implementationSteps: [
          'Consume 1.6-2.2g de proteína por kg de peso corporal',
          'Distribuye la ingesta de proteínas a lo largo del día',
          'Incluye fuentes de proteína de alta calidad en cada comida'
        ],
        expectedBenefits: [
          'Mejor recuperación muscular',
          'Mayor crecimiento muscular',
          'Mantenimiento de masa muscular durante períodos de déficit'
        ],
        timeframe: '4 semanas',
        confidence: 0.9
      });
    }
    
    if (goals.includes('Perder grasa')) {
      recommendations.push({
        id: `fat_loss_nutrition_${Date.now()}`,
        category: 'nutrition',
        priority: 'high',
        title: 'Controla tus porciones y calorías',
        description: 'Mantén un déficit calórico controlado para perder grasa sin perder masa muscular.',
        implementationSteps: [
          'Registra tu ingesta calórica durante 1 semana',
          'Crea un déficit del 15-20% en calorías',
          'Prioriza alimentos saciantes y nutritivos'
        ],
        expectedBenefits: [
          'Pérdida de grasa sostenible',
          'Mantenimiento de masa muscular',
          'Mejor composición corporal'
        ],
        timeframe: '6 semanas',
        confidence: 0.85
      });
    }
    
    return recommendations;
  }
  
  /**
   * Generate recovery recommendations
   */
  private generateRecoveryRecommendations(recoveryStatus: RecoveryAnalysis | undefined, wearableInsights: any): PreventiveRecommendation[] {
    const recommendations: PreventiveRecommendation[] = [];
    
    if (recoveryStatus) {
      // Recommendations based on recovery score
      if (recoveryStatus.recoveryScore < 60) {
        recommendations.push({
          id: `recovery_optimization_${Date.now()}`,
          category: 'recovery',
          priority: 'high',
          title: 'Prioriza actividades de recuperación',
          description: 'Incorpora técnicas activas de recuperación para mejorar tu puntuación de recuperación.',
          implementationSteps: [
            'Dedica 20-30 minutos diarios a estiramientos o yoga',
            'Usa una pistola de masaje 2-3 veces por semana',
            'Toma baños de contraste después del entrenamiento'
          ],
          expectedBenefits: [
            'Mejor recuperación muscular',
            'Reducción del riesgo de lesiones',
            'Mejor calidad del sueño'
          ],
          timeframe: '3 semanas',
          confidence: 0.8
        });
      }
      
      // Recommendations based on fatigue level
      if (recoveryStatus.fatigueLevel === 'high' || recoveryStatus.fatigueLevel === 'extreme') {
        recommendations.push({
          id: `fatigue_management_${Date.now()}`,
          category: 'recovery',
          priority: 'high',
          title: 'Gestiona tu fatiga acumulada',
          description: 'Implementa estrategias para reducir la fatiga acumulada y mejorar tu recuperación.',
          implementationSteps: [
            'Asegúrate de dormir 7-9 horas cada noche',
            'Practica técnicas de respiración y relajación',
            'Reduce temporalmente la intensidad del entrenamiento'
          ],
          expectedBenefits: [
            'Reducción de la fatiga acumulada',
            'Mejor rendimiento en el entrenamiento',
            'Menor riesgo de sobreentrenamiento'
          ],
          timeframe: '2 semanas',
          confidence: 0.85
        });
      }
    }
    
    return recommendations;
  }
  
  /**
   * Generate lifestyle recommendations
   */
  private generateLifestyleRecommendations(userHabits: UserHabit[]): PreventiveRecommendation[] {
    const recommendations: PreventiveRecommendation[] = [];
    
    if (userHabits.length > 0) {
      const habit = userHabits[0];
      
      // Check for sleep quality
      // In a real implementation, we would have actual sleep data
      recommendations.push({
        id: `sleep_optimization_${Date.now()}`,
        category: 'lifestyle',
        priority: 'medium',
        title: 'Optimiza tu sueño',
        description: 'Mejora la calidad y duración de tu sueño para una mejor recuperación.',
        implementationSteps: [
          'Mantén un horario de sueño consistente',
          'Evita pantallas 1 hora antes de dormir',
          'Crea un ambiente de sueño fresco y oscuro'
        ],
        expectedBenefits: [
          'Mejor recuperación hormonal',
          'Mejor estado de ánimo',
          'Mejor rendimiento cognitivo'
        ],
        timeframe: '3 semanas',
        confidence: 0.9
      });
      
      // Check for stress management
      // In a real implementation, we would have actual stress data
      recommendations.push({
        id: `stress_management_${Date.now()}`,
        category: 'lifestyle',
        priority: 'medium',
        title: 'Gestiona tu estrés',
        description: 'Implementa técnicas de manejo del estrés para mejorar tu recuperación y rendimiento.',
        implementationSteps: [
          'Practica meditación o mindfulness 10 minutos al día',
          'Incorpora actividades de ocio y relajación',
          'Identifica y minimiza fuentes de estrés'
        ],
        expectedBenefits: [
          'Mejor recuperación',
          'Mejor estado de ánimo',
          'Mejor calidad de sueño'
        ],
        timeframe: '4 semanas',
        confidence: 0.85
      });
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const predictivePerformanceEngine = PredictivePerformanceEngine.getInstance();
