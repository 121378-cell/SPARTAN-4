import { storageManager } from './storage';
import { nutritionService } from './nutrition-service';
import { realTimeModificationService } from './real-time-modification-service';
import { loadProgressionService } from './load-progression-service';
import type { 
  WorkoutPlan, 
  RecoveryAnalysis, 
  ProgressionPlan, 
  DailyNutrition,
  UserHabit
} from './types';
import type { 
  WearableInsights, 
  TrainingAdjustment,
  WearableData
} from './wearable-integration-service';

export class WearableDataInterpreter {
  private static instance: WearableDataInterpreter;
  
  static getInstance(): WearableDataInterpreter {
    if (!WearableDataInterpreter.instance) {
      WearableDataInterpreter.instance = new WearableDataInterpreter();
    }
    return WearableDataInterpreter.instance;
  }
  
  /**
   * Interprets wearable data and translates it into practical actions
   */
  interpretWearableData(
    userId: string,
    wearableData: WearableData,
    context: {
      activeWorkout?: WorkoutPlan;
      recoveryStatus?: RecoveryAnalysis;
      progressionPlans: ProgressionPlan[];
      nutritionData?: DailyNutrition;
      userHabits: UserHabit[];
    }
  ): {
    recommendations: {
      training: string[];
      recovery: string[];
      nutrition: string[];
      lifestyle: string[];
    };
    adjustments: {
      workout?: WorkoutPlan;
      nutrition?: DailyNutrition;
      progression?: ProgressionPlan[];
    };
    riskAssessment: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
  } {
    // Analyze wearable data to generate insights
    const insights = this.analyzeWearableData(wearableData);
    
    // Generate recommendations based on insights
    const recommendations = this.generateRecommendations(insights, context);
    
    // Generate adjustments based on insights
    const adjustments = this.generateAdjustments(insights, context);
    
    // Assess risks based on insights
    const riskAssessment = this.assessRisks(insights);
    
    return {
      recommendations,
      adjustments,
      riskAssessment
    };
  }
  
  /**
   * Analyzes wearable data to extract meaningful insights
   */
  private analyzeWearableData(wearableData: WearableData): {
    hrvStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
    sleepQuality: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
    stressLevel: 'low' | 'moderate' | 'high' | 'extreme';
    recoveryStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
    trainingReadiness: 'ready' | 'caution' | 'rest';
    energyLevel: 'high' | 'moderate' | 'low' | 'veryLow';
    rpeAdjustmentNeeded: boolean;
    volumeAdjustmentNeeded: boolean;
    intensityAdjustmentNeeded: boolean;
    restAdjustmentNeeded: boolean;
    nutritionAdjustmentNeeded: boolean;
  } {
    const { recovery, sleep, activity, performance } = wearableData;
    
    // Analyze HRV status
    let hrvStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
    if (recovery.hrv >= 70) hrvStatus = 'optimal';
    else if (recovery.hrv >= 60) hrvStatus = 'good';
    else if (recovery.hrv >= 50) hrvStatus = 'fair';
    else if (recovery.hrv >= 40) hrvStatus = 'poor';
    else hrvStatus = 'critical';
    
    // Analyze sleep quality
    let sleepQuality: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
    if (sleep.quality >= 85) sleepQuality = 'optimal';
    else if (sleep.quality >= 75) sleepQuality = 'good';
    else if (sleep.quality >= 60) sleepQuality = 'fair';
    else if (sleep.quality >= 45) sleepQuality = 'poor';
    else sleepQuality = 'critical';
    
    // Analyze stress level
    let stressLevel: 'low' | 'moderate' | 'high' | 'extreme';
    if (recovery.stress <= 30) stressLevel = 'low';
    else if (recovery.stress <= 50) stressLevel = 'moderate';
    else if (recovery.stress <= 75) stressLevel = 'high';
    else stressLevel = 'extreme';
    
    // Analyze recovery status
    let recoveryStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
    const recoveryScore = this.calculateRecoveryScore(wearableData);
    if (recoveryScore >= 85) recoveryStatus = 'optimal';
    else if (recoveryScore >= 70) recoveryStatus = 'good';
    else if (recoveryScore >= 50) recoveryStatus = 'fair';
    else if (recoveryScore >= 30) recoveryStatus = 'poor';
    else recoveryStatus = 'critical';
    
    // Analyze training readiness
    let trainingReadiness: 'ready' | 'caution' | 'rest';
    if (recoveryScore >= 75 && stressLevel === 'low' && sleepQuality !== 'poor' && sleepQuality !== 'critical') {
      trainingReadiness = 'ready';
    } else if (recoveryScore >= 50 && stressLevel !== 'extreme') {
      trainingReadiness = 'caution';
    } else {
      trainingReadiness = 'rest';
    }
    
    // Analyze energy level
    let energyLevel: 'high' | 'moderate' | 'low' | 'veryLow';
    const avgRecoveryScore = (recoveryScore + sleep.quality + (100 - recovery.stress)) / 3;
    if (avgRecoveryScore >= 80) energyLevel = 'high';
    else if (avgRecoveryScore >= 65) energyLevel = 'moderate';
    else if (avgRecoveryScore >= 50) energyLevel = 'low';
    else energyLevel = 'veryLow';
    
    // Determine what adjustments are needed
    const rpeAdjustmentNeeded = recoveryScore < 60;
    const volumeAdjustmentNeeded = recoveryScore < 55;
    const intensityAdjustmentNeeded = recoveryScore < 65 || stressLevel === 'high' || stressLevel === 'extreme';
    const restAdjustmentNeeded = sleepQuality === 'poor' || sleepQuality === 'critical' || stressLevel === 'high' || stressLevel === 'extreme';
    const nutritionAdjustmentNeeded = wearableData.vitals.glucose.timeInRange < 70 || wearableData.vitals.hydration.level < 75;
    
    return {
      hrvStatus,
      sleepQuality,
      stressLevel,
      recoveryStatus,
      trainingReadiness,
      energyLevel,
      rpeAdjustmentNeeded,
      volumeAdjustmentNeeded,
      intensityAdjustmentNeeded,
      restAdjustmentNeeded,
      nutritionAdjustmentNeeded
    };
  }
  
  /**
   * Calculates a comprehensive recovery score based on wearable metrics
   */
  private calculateRecoveryScore(wearableData: WearableData): number {
    const { recovery, sleep, vitals } = wearableData;
    
    // HRV is a key indicator (30% weight)
    const hrvScore = Math.min(100, (recovery.hrv / 70) * 30);
    
    // Resting heart rate (20% weight)
    const rhrScore = Math.max(0, 20 - (Math.max(0, recovery.restingHeartRate - 60) * 0.5));
    
    // Sleep quality (25% weight)
    const sleepScore = (sleep.quality / 100) * 25;
    
    // Stress level (15% weight) - inverted as lower stress is better
    const stressScore = (15 - (recovery.stress / 100) * 15);
    
    // Blood pressure (10% weight)
    const bpScore = (vitals.bloodPressure.systolic < 120 && vitals.bloodPressure.diastolic < 80) ? 10 : 
                   (vitals.bloodPressure.systolic < 140 && vitals.bloodPressure.diastolic < 90) ? 5 : 0;
    
    return Math.round(hrvScore + rhrScore + sleepScore + stressScore + bpScore);
  }
  
  /**
   * Generates recommendations based on wearable insights
   */
  private generateRecommendations(
    insights: any,
    context: any
  ): {
    training: string[];
    recovery: string[];
    nutrition: string[];
    lifestyle: string[];
  } {
    const recommendations = {
      training: [] as string[],
      recovery: [] as string[],
      nutrition: [] as string[],
      lifestyle: [] as string[]
    };
    
    // Training recommendations
    if (insights.trainingReadiness === 'rest') {
      recommendations.training.push('Programa un día completo de descanso para permitir la recuperación');
    } else if (insights.trainingReadiness === 'caution') {
      recommendations.training.push('Entrena con moderación y reduce la intensidad en un 15-20%');
    }
    
    if (insights.intensityAdjustmentNeeded) {
      recommendations.training.push('Considera reducir la intensidad del entrenamiento');
    }
    
    if (insights.volumeAdjustmentNeeded) {
      recommendations.training.push('Reduce el volumen de entrenamiento en un 20-25%');
    }
    
    if (insights.rpeAdjustmentNeeded) {
      recommendations.training.push('Ajusta tu RPE objetivo a 1-2 puntos por debajo de lo normal');
    }
    
    // Recovery recommendations
    if (insights.sleepQuality !== 'optimal' && insights.sleepQuality !== 'good') {
      recommendations.recovery.push('Prioriza dormir 7-9 horas para mejorar la recuperación');
    }
    
    if (insights.hrvStatus === 'poor' || insights.hrvStatus === 'critical') {
      recommendations.recovery.push('Practica respiración diafragmática para mejorar la variabilidad cardíaca');
    }
    
    if (insights.stressLevel === 'high' || insights.stressLevel === 'extreme') {
      recommendations.recovery.push('Incorpora técnicas de manejo del estrés como meditación o yoga');
    }
    
    // Nutrition recommendations
    if (insights.nutritionAdjustmentNeeded) {
      recommendations.nutrition.push('Optimiza la composición de comidas y el momento de las ingestas');
    }
    
    // Lifestyle recommendations
    if (insights.energyLevel === 'low' || insights.energyLevel === 'veryLow') {
      recommendations.lifestyle.push('Considera reducir las actividades no esenciales para conservar energía');
    }
    
    return recommendations;
  }
  
  /**
   * Generates adjustments based on wearable insights
   */
  private generateAdjustments(
    insights: any,
    context: any
  ): {
    workout?: WorkoutPlan;
    nutrition?: DailyNutrition;
    progression?: ProgressionPlan[];
  } {
    const adjustments: {
      workout?: WorkoutPlan;
      nutrition?: DailyNutrition;
      progression?: ProgressionPlan[];
    } = {};
    
    // Workout adjustments
    if (context.activeWorkout && (insights.intensityAdjustmentNeeded || insights.volumeAdjustmentNeeded || insights.restAdjustmentNeeded)) {
      // Create modification requests based on insights
      let modificationRequest: any = { type: 'none' };
      
      if (insights.intensityAdjustmentNeeded && insights.volumeAdjustmentNeeded) {
        modificationRequest = {
          type: 'intensity_change',
          value: -15, // Reduce intensity by 15%
          details: 'Reducing intensity due to poor recovery metrics'
        };
      } else if (insights.intensityAdjustmentNeeded) {
        modificationRequest = {
          type: 'intensity_change',
          value: -10, // Reduce intensity by 10%
          details: 'Reducing intensity due to elevated stress or poor HRV'
        };
      } else if (insights.volumeAdjustmentNeeded) {
        modificationRequest = {
          type: 'volume_change',
          value: -20, // Reduce volume by 20%
          details: 'Reducing volume due to poor recovery metrics'
        };
      }
      
      // Apply modifications if needed
      if (modificationRequest.type !== 'none') {
        const modificationResult = realTimeModificationService.modifyWorkoutPlan(
          context.activeWorkout,
          modificationRequest,
          context
        );
        adjustments.workout = modificationResult.modifiedPlan;
      }
    }
    
    // Nutrition adjustments
    if (context.nutritionData && insights.nutritionAdjustmentNeeded) {
      // In a real implementation, we would adjust nutrition based on wearable data
      // For now, we'll just note that adjustments are needed
      adjustments.nutrition = context.nutritionData;
    }
    
    // Progression adjustments
    if (context.progressionPlans.length > 0) {
      // In a real implementation, we would adjust progression based on wearable data
      // For now, we'll just note that adjustments might be needed
      adjustments.progression = context.progressionPlans;
    }
    
    return adjustments;
  }
  
  /**
   * Assesses risks based on wearable insights
   */
  private assessRisks(insights: any): {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  } {
    const risks = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };
    
    // Immediate risks (today/tomorrow)
    if (insights.trainingReadiness === 'rest') {
      risks.immediate.push('Riesgo de sobreentrenamiento si se entrena hoy');
    }
    
    if (insights.energyLevel === 'veryLow') {
      risks.immediate.push('Riesgo de lesiones por fatiga extrema');
    }
    
    // Short-term risks (next week)
    if (insights.hrvStatus === 'poor' || insights.hrvStatus === 'critical') {
      risks.shortTerm.push('Riesgo de sobreentrenamiento en los próximos días');
    }
    
    if (insights.sleepQuality === 'poor' || insights.sleepQuality === 'critical') {
      risks.shortTerm.push('Rendimiento comprometido en los próximos entrenamientos');
    }
    
    // Long-term risks (months)
    if (insights.stressLevel === 'high' || insights.stressLevel === 'extreme') {
      risks.longTerm.push('Riesgo de burnout o sobreentrenamiento crónico');
    }
    
    return risks;
  }
  
  /**
   * Translates wearable data into specific actionable items
   */
  translateToActions(
    userId: string,
    wearableData: WearableData,
    context: any
  ): {
    restRecommendation: {
      shouldRest: boolean;
      reason: string;
      duration?: 'day' | 'weekend' | 'week';
    };
    volumeAdjustment: {
      shouldAdjust: boolean;
      percentage: number;
      reason: string;
    };
    intensityAdjustment: {
      shouldAdjust: boolean;
      percentage: number;
      reason: string;
    };
    nutritionAdjustment: {
      shouldAdjust: boolean;
      carbs?: { increase: boolean; reason: string };
      protein?: { increase: boolean; reason: string };
      fats?: { increase: boolean; reason: string };
      hydration?: { increase: boolean; reason: string };
    };
    rpeModification: {
      shouldModify: boolean;
      targetRPE: number;
      reason: string;
    };
  } {
    const insights = this.analyzeWearableData(wearableData);
    
    // Rest recommendation
    const restRecommendation = {
      shouldRest: insights.trainingReadiness === 'rest',
      reason: this.getRestReason(insights),
      duration: insights.trainingReadiness === 'rest' ? 'day' as const : undefined
    };
    
    // Volume adjustment
    const volumeAdjustment = {
      shouldAdjust: insights.volumeAdjustmentNeeded,
      percentage: insights.volumeAdjustmentNeeded ? -20 : 0,
      reason: insights.volumeAdjustmentNeeded ? 
        'Volumen reducido debido a métricas de recuperación insuficientes' : 
        'No se requiere ajuste de volumen'
    };
    
    // Intensity adjustment
    const intensityAdjustment = {
      shouldAdjust: insights.intensityAdjustmentNeeded,
      percentage: insights.intensityAdjustmentNeeded ? 
        (insights.stressLevel === 'high' || insights.stressLevel === 'extreme' ? -15 : -10) : 0,
      reason: insights.intensityAdjustmentNeeded ? 
        'Intensidad reducida debido a estrés elevado o HRV bajo' : 
        'No se requiere ajuste de intensidad'
    };
    
    // Nutrition adjustment
    const nutritionAdjustment = {
      shouldAdjust: insights.nutritionAdjustmentNeeded,
      carbs: wearableData.vitals.glucose.timeInRange < 70 ? 
        { increase: true, reason: 'Optimizar disponibilidad de glucosa para entrenamiento' } : 
        undefined,
      hydration: wearableData.vitals.hydration.level < 75 ? 
        { increase: true, reason: 'Aumentar ingesta de agua para mejorar hidratación' } : 
        undefined
    };
    
    // RPE modification
    const rpeModification = {
      shouldModify: insights.rpeAdjustmentNeeded,
      targetRPE: insights.rpeAdjustmentNeeded ? 6 : 7, // Target RPE 6 if adjustment needed, otherwise 7
      reason: insights.rpeAdjustmentNeeded ? 
        'RPE reducido para aliviar carga fisiológica' : 
        'RPE objetivo estándar'
    };
    
    return {
      restRecommendation,
      volumeAdjustment,
      intensityAdjustment,
      nutritionAdjustment,
      rpeModification
    };
  }
  
  /**
   * Gets the reason for rest recommendation
   */
  private getRestReason(insights: any): string {
    if (insights.energyLevel === 'veryLow') {
      return 'Nivel de energía extremadamente bajo';
    }
    if (insights.hrvStatus === 'critical') {
      return 'HRV críticamente bajo indicando estrés fisiológico elevado';
    }
    if (insights.stressLevel === 'extreme') {
      return 'Nivel de estrés extremo';
    }
    if (insights.sleepQuality === 'critical') {
      return 'Calidad de sueño críticamente baja';
    }
    return 'Recomendación de descanso basada en múltiples métricas';
  }
}

export const wearableDataInterpreter = WearableDataInterpreter.getInstance();