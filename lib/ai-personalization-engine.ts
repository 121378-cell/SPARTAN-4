/**
 * AI-Powered Personalization Engine for SPARTAN 4
 * Implements adaptive workout recommendations, predictive analytics, and dynamic difficulty adjustment
 */

import { dataManagementService, DataInsights } from './data-management-service.ts';
import { spartanNervousSystem } from './spartan-nervous-system.ts';
import { wearableIntegrationService, WearableData, WearableInsights } from './wearable-integration-service.ts';
import { predictiveAnalyticsEngine, BiometricData, AdherenceMetrics, PredictiveInsights } from './predictive-analytics.ts';
import { adaptiveTrainingSystem, TrainingMetrics, ExercisePerformance, TrainingAdjustment } from './adaptiveTrainingSystem.ts';
import { storageManager } from './storage.ts';
import { logger } from './logger.ts';
import type { UserData, WorkoutPlan, Exercise } from './types.ts';

// Types for the personalization engine
export interface PersonalizationContext {
  userData: UserData;
  biometricData: BiometricData | null;
  wearableData: WearableData | null;
  adherenceMetrics: AdherenceMetrics | null;
  trainingMetrics: TrainingMetrics[];
  currentWorkoutPlan: WorkoutPlan | null;
  recentPerformance: ExercisePerformance[];
}

export interface InjuryRiskAssessment {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: string[];
  preventiveMeasures: string[];
  confidence: number; // 0-100
}

export interface DynamicAdjustment {
  exerciseId: string;
  parameter: 'weight' | 'reps' | 'sets' | 'rest' | 'tempo' | 'intensity';
  currentValue: number | string;
  newValue: number | string;
  reason: string;
  confidence: number; // 0-100
  urgency: 'low' | 'medium' | 'high';
}

export interface PersonalizedRecommendation {
  type: 'workout' | 'recovery' | 'nutrition' | 'progression';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  actionable: boolean;
  estimatedImpact: string;
}

export class AIPersonalizationEngine {
  private static instance: AIPersonalizationEngine;
  private userId: string | null = null;
  private personalizationContext: PersonalizationContext | null = null;
  private injuryRiskHistory: InjuryRiskAssessment[] = [];
  private adjustmentHistory: DynamicAdjustment[] = [];
  private recommendationHistory: PersonalizedRecommendation[] = [];

  static getInstance(): AIPersonalizationEngine {
    if (!AIPersonalizationEngine.instance) {
      AIPersonalizationEngine.instance = new AIPersonalizationEngine();
    }
    return AIPersonalizationEngine.instance;
  }

  /**
   * Initialize the personalization engine with user context
   */
  async initialize(userId: string): Promise<void> {
    this.userId = userId;
    await this.updatePersonalizationContext();
    
    // Subscribe to data updates from the nervous system
    spartanNervousSystem.subscribe('data_updated', async (event) => {
      if (event.userId === userId) {
        await this.handleDataUpdate(event);
      }
    });
    
    logger.info('AIPersonalizationEngine: Initialized successfully');
  }

  /**
   * Update the personalization context with latest data
   */
  private async updatePersonalizationContext(): Promise<void> {
    if (!this.userId) return;

    try {
      // Get integrated data from data management service
      const dataService = dataManagementService;
      const integratedData = (dataService as any).integratedData;
      
      if (!integratedData) {
        await dataService.syncAllData();
      }
      
      // Get user data
      const userData = integratedData?.userData || { name: 'User', age: 30, weight: 70, height: 170, fitnessLevel: 'intermediate' } as UserData;
      
      // Get biometric data
      const biometricData = integratedData?.biometricData || null;
      
      // Get wearable data
      const wearableData = integratedData?.wearableData || null;
      
      // Get adherence metrics
      const adherenceMetrics = integratedData?.adherenceMetrics || null;
      
      // Get training metrics (placeholder implementation)
      const trainingMetrics: TrainingMetrics[] = [];
      
      // Get current workout plan
      const workoutPlans = integratedData?.workoutPlans || [];
      const currentWorkoutPlan = workoutPlans.length > 0 ? workoutPlans[0] : null;
      
      // Get recent performance data
      const recentPerformance: ExercisePerformance[] = [];
      if (trainingMetrics.length > 0) {
        const recentSession = trainingMetrics[trainingMetrics.length - 1];
        recentPerformance.push(...recentSession.exerciseData);
      }
      
      this.personalizationContext = {
        userData,
        biometricData,
        wearableData,
        adherenceMetrics,
        trainingMetrics,
        currentWorkoutPlan,
        recentPerformance
      };
      
      logger.info('AIPersonalizationEngine: Context updated successfully');
    } catch (error) {
      logger.error('AIPersonalizationEngine: Error updating context', error);
    }
  }

  /**
   * Handle data updates from the nervous system
   */
  private async handleDataUpdate(event: any): Promise<void> {
    await this.updatePersonalizationContext();
    await this.generateAdaptiveRecommendations();
  }

  /**
   * Generate adaptive workout recommendations based on real-time biométric data
   */
  async generateAdaptiveRecommendations(): Promise<PersonalizedRecommendation[]> {
    if (!this.personalizationContext) {
      await this.updatePersonalizationContext();
    }
    
    if (!this.personalizationContext) {
      return [];
    }

    const recommendations: PersonalizedRecommendation[] = [];
    
    try {
      // Get insights from data management service
      const insights = await dataManagementService.generateInsights();
      
      // Get wearable insights if available
      let wearableInsights: WearableInsights | null = null;
      if (this.personalizationContext.wearableData) {
        wearableInsights = wearableIntegrationService.processWearableData(
          this.userId || 'default',
          this.personalizationContext.wearableData
        );
      }
      
      // Generate workout recommendations based on current status
      if (insights) {
        // Training readiness recommendations
        switch (insights.currentStatus.trainingReadiness) {
          case 'rest':
            recommendations.push({
              type: 'recovery',
              title: 'Día de Recuperación Activa Recomendado',
              description: 'Tus métricas indican que necesitas un día de recuperación activa para optimizar tu recuperación.',
              priority: 'high',
              confidence: 90,
              actionable: true,
              estimatedImpact: 'Mejora del 20% en recuperación'
            });
            break;
            
          case 'caution':
            recommendations.push({
              type: 'workout',
              title: 'Entrenamiento con Carga Reducida',
              description: 'Recomendamos reducir la intensidad del entrenamiento en un 15-20% para prevenir sobreentrenamiento.',
              priority: 'medium',
              confidence: 85,
              actionable: true,
              estimatedImpact: 'Mantenimiento de volumen con menor riesgo'
            });
            break;
            
          case 'ready':
            recommendations.push({
              type: 'workout',
              title: 'Entrenamiento Óptimo Programado',
              description: 'Tus métricas indican que estás listo para un entrenamiento de intensidad óptima.',
              priority: 'medium',
              confidence: 95,
              actionable: true,
              estimatedImpact: 'Máximo potencial de progreso'
            });
            break;
        }
        
        // Energy level recommendations
        if (insights.currentStatus.energyLevel === 'veryLow') {
          recommendations.push({
            type: 'recovery',
            title: 'Priorizar Recuperación',
            description: 'Tu nivel de energía es muy bajo. Recomendamos un día de descanso completo o recuperación muy ligera.',
            priority: 'high',
            confidence: 88,
            actionable: true,
            estimatedImpact: 'Prevención de sobreentrenamiento'
          });
        }
        
        // Recovery status recommendations
        if (insights.currentStatus.recoveryStatus === 'poor' || insights.currentStatus.recoveryStatus === 'critical') {
          recommendations.push({
            type: 'recovery',
            title: 'Enfoque en Recuperación',
            description: 'Tu estado de recuperación necesita atención. Considera técnicas de recuperación avanzadas.',
            priority: 'high',
            confidence: 92,
            actionable: true,
            estimatedImpact: 'Mejora del 30% en marcadores de recuperación'
          });
        }
      }
      
      // Add wearable-based recommendations if available
      if (wearableInsights) {
        wearableInsights.recommendations.forEach((rec, index) => {
          recommendations.push({
            type: 'recovery',
            title: 'Recomendación Basada en Wearable',
            description: rec,
            priority: 'medium',
            confidence: 80,
            actionable: true,
            estimatedImpact: 'Optimización basada en datos biométricos'
          });
        });
        
        // Add training adjustments based on wearable data
        wearableInsights.adjustments.forEach((adjustment, index) => {
          recommendations.push({
            type: 'workout',
            title: `Ajuste de ${adjustment.type}`,
            description: adjustment.reason,
            priority: adjustment.value < 0 ? 'high' : 'medium',
            confidence: Math.round(adjustment.confidence * 100),
            actionable: true,
            estimatedImpact: `Ajuste del ${Math.abs(adjustment.value)}% en ${adjustment.type}`
          });
        });
      }
      
      // Store recommendations in history
      this.recommendationHistory.push(...recommendations);
      
      // Emit recommendations to nervous system
      recommendations.forEach(rec => {
        spartanNervousSystem.emitEvent({
          type: 'recommendation_made',
          timestamp: new Date(),
          userId: this.userId || 'default',
          payload: rec,
          sourceModule: 'AIPersonalizationEngine',
          priority: rec.priority
        });
      });
      
      logger.info(`AIPersonalizationEngine: Generated ${recommendations.length} adaptive recommendations`);
      return recommendations;
    } catch (error) {
      logger.error('AIPersonalizationEngine: Error generating adaptive recommendations', error);
      return [];
    }
  }

  /**
   * Perform predictive analytics for injury prevention
   */
  async performInjuryPreventionAnalysis(): Promise<InjuryRiskAssessment> {
    if (!this.personalizationContext) {
      await this.updatePersonalizationContext();
    }
    
    if (!this.personalizationContext) {
      return {
        riskLevel: 'moderate',
        riskFactors: ['Datos insuficientes para análisis'],
        preventiveMeasures: ['Recopilar más datos biométricos'],
        confidence: 30
      };
    }

    try {
      const riskFactors: string[] = [];
      let riskScore = 0;
      
      // Analyze biometric data for injury risk
      if (this.personalizationContext.biometricData) {
        const bio = this.personalizationContext.biometricData;
        
        // Heart rate variability as stress indicator
        if (bio.heartRateVariability < 40) {
          riskFactors.push('Baja variabilidad cardíaca (estrés fisiológico elevado)');
          riskScore += 25;
        } else if (bio.heartRateVariability < 55) {
          riskFactors.push('Variabilidad cardíaca moderadamente baja');
          riskScore += 15;
        }
        
        // Resting heart rate as recovery indicator
        if (bio.restingHeartRate > 75) {
          riskFactors.push('Frecuencia cardíaca en reposo elevada (posible fatiga)');
          riskScore += 20;
        } else if (bio.restingHeartRate > 65) {
          riskFactors.push('Frecuencia cardíaca en reposo ligeramente elevada');
          riskScore += 10;
        }
        
        // Blood pressure
        if (bio.bloodPressure.systolic > 140 || bio.bloodPressure.diastolic > 90) {
          riskFactors.push('Presión arterial elevada');
          riskScore += 30;
        } else if (bio.bloodPressure.systolic > 130 || bio.bloodPressure.diastolic > 85) {
          riskFactors.push('Presión arterial moderadamente elevada');
          riskScore += 15;
        }
      }
      
      // Analyze adherence metrics
      if (this.personalizationContext.adherenceMetrics) {
        const adherence = this.personalizationContext.adherenceMetrics;
        
        // Training adherence
        if (adherence.trainingAdherence < 60) {
          riskFactors.push('Baja adherencia al entrenamiento (posible desentrenamiento)');
          riskScore += 20;
        }
        
        // Sleep quality
        if (adherence.sleepQuality < 60) {
          riskFactors.push('Mala calidad de sueño (afecta recuperación)');
          riskScore += 25;
        } else if (adherence.sleepQuality < 75) {
          riskFactors.push('Calidad de sueño moderadamente baja');
          riskScore += 15;
        }
        
        // Stress management
        if (adherence.stressManagement < 50) {
          riskFactors.push('Mala gestión del estrés (afecta recuperación y rendimiento)');
          riskScore += 25;
        } else if (adherence.stressManagement < 70) {
          riskFactors.push('Gestión de estrés moderadamente baja');
          riskScore += 15;
        }
      }
      
      // Analyze training metrics for overtraining signs
      if (this.personalizationContext.trainingMetrics.length > 0) {
        const recentMetrics = this.personalizationContext.trainingMetrics.slice(-4); // Last 4 sessions
        
        // Check for consistently high RPE
        const avgRPE = recentMetrics.reduce((sum, session) => sum + session.rpe, 0) / recentMetrics.length;
        if (avgRPE > 8.5) {
          riskFactors.push('RPE consistentemente alto (posible sobreentrenamiento)');
          riskScore += 20;
        }
        
        // Check for increasing muscle symptoms
        const recentSymptoms = recentMetrics.map(m => m.muscleSymptoms);
        if (recentSymptoms.length >= 2) {
          const trend = recentSymptoms[recentSymptoms.length - 1] - recentSymptoms[0];
          if (trend > 2) {
            riskFactors.push('Aumento progresivo de síntomas musculares');
            riskScore += 25;
          }
        }
      }
      
      // Determine risk level based on score
      let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
      if (riskScore >= 75) {
        riskLevel = 'critical';
      } else if (riskScore >= 50) {
        riskLevel = 'high';
      } else if (riskScore >= 25) {
        riskLevel = 'moderate';
      } else {
        riskLevel = 'low';
      }
      
      // Generate preventive measures based on risk factors
      const preventiveMeasures = this.generatePreventiveMeasures(riskFactors, riskLevel);
      
      const injuryRiskAssessment: InjuryRiskAssessment = {
        riskLevel,
        riskFactors,
        preventiveMeasures,
        confidence: Math.min(100, 70 + (riskFactors.length * 5))
      };
      
      // Store in history
      this.injuryRiskHistory.push(injuryRiskAssessment);
      
      // Emit risk assessment to nervous system for critical risks
      if (riskLevel === 'high' || riskLevel === 'critical') {
        spartanNervousSystem.emitEvent({
          type: 'alert_triggered',
          timestamp: new Date(),
          userId: this.userId || 'default',
          payload: {
            id: `injury_risk_${Date.now()}`,
            type: 'warning',
            title: 'Riesgo de Lesión Detectado',
            message: `Nivel de riesgo: ${riskLevel}. Factores: ${riskFactors.join(', ')}`,
            priority: riskLevel === 'critical' ? 'critical' : 'high',
            timestamp: new Date(),
            actions: ['Ver recomendaciones', 'Programar descanso'],
            dismissible: true
          },
          sourceModule: 'AIPersonalizationEngine',
          priority: riskLevel === 'critical' ? 'critical' : 'high'
        });
      }
      
      logger.info(`AIPersonalizationEngine: Injury prevention analysis completed - Risk Level: ${riskLevel}`);
      return injuryRiskAssessment;
    } catch (error) {
      logger.error('AIPersonalizationEngine: Error performing injury prevention analysis', error);
      return {
        riskLevel: 'moderate',
        riskFactors: ['Error en análisis - usando valores por defecto'],
        preventiveMeasures: ['Consultar con profesional de la salud'],
        confidence: 50
      };
    }
  }

  /**
   * Generate preventive measures based on identified risk factors
   */
  private generatePreventiveMeasures(riskFactors: string[], riskLevel: string): string[] {
    const measures: string[] = [];
    
    // General preventive measures
    measures.push('Realizar calentamiento completo antes de cada sesión');
    measures.push('Incluir ejercicios de movilidad y flexibilidad');
    
    // Specific measures based on risk factors
    if (riskFactors.some(f => f.includes('variabilidad cardíaca') || f.includes('frecuencia cardíaca'))) {
      measures.push('Incorporar técnicas de respiración diafragmática');
      measures.push('Reducir intensidad de entrenamiento en 10-15%');
    }
    
    if (riskFactors.some(f => f.includes('presión arterial'))) {
      measures.push('Reducir consumo de sodio');
      measures.push('Aumentar actividad aeróbica de baja intensidad');
    }
    
    if (riskFactors.some(f => f.includes('calidad de sueño'))) {
      measures.push('Establecer rutina de sueño consistente');
      measures.push('Evitar pantallas 1 hora antes de dormir');
    }
    
    if (riskFactors.some(f => f.includes('gestión del estrés'))) {
      measures.push('Practicar meditación o mindfulness');
      measures.push('Incluir días de recuperación activa');
    }
    
    if (riskFactors.some(f => f.includes('sobreentrenamiento') || f.includes('RPE'))) {
      measures.push('Programar semana de descarga esta semana');
      measures.push('Reducir volumen de entrenamiento en 25%');
    }
    
    if (riskFactors.some(f => f.includes('síntomas musculares'))) {
      measures.push('Aplicar técnicas de recuperación (espuma, masaje)');
      measures.push('Considerar modificación de ejercicios de alto impacto');
    }
    
    // Risk level specific measures
    if (riskLevel === 'high') {
      measures.push('Considerar consulta con fisioterapeuta');
    } else if (riskLevel === 'critical') {
      measures.push('Suspender entrenamiento intenso por 3-5 días');
      measures.push('Consultar con profesional de la salud de inmediato');
    }
    
    return measures;
  }

  /**
   * Generate dynamic difficulty adjustments for exercises
   */
  async generateDynamicAdjustments(): Promise<DynamicAdjustment[]> {
    if (!this.personalizationContext) {
      await this.updatePersonalizationContext();
    }
    
    if (!this.personalizationContext) {
      return [];
    }

    const adjustments: DynamicAdjustment[] = [];
    
    try {
      // Get recent training metrics
      const recentMetrics = this.personalizationContext.trainingMetrics.slice(-3); // Last 3 sessions
      
      if (recentMetrics.length === 0) {
        logger.info('AIPersonalizationEngine: No training metrics available for adjustments');
        return adjustments;
      }
      
      // Analyze each exercise in recent sessions
      const exerciseAnalysis = new Map<string, any>();
      
      recentMetrics.forEach(session => {
        session.exerciseData.forEach(exercise => {
          if (!exerciseAnalysis.has(exercise.exerciseName)) {
            exerciseAnalysis.set(exercise.exerciseName, {
              sessions: [],
              avgRPE: 0,
              avgRIR: 0,
              completionRate: 0
            });
          }
          
          const analysis = exerciseAnalysis.get(exercise.exerciseName);
          analysis.sessions.push(exercise);
        });
      });
      
      // Calculate metrics for each exercise
      for (const [exerciseName, data] of exerciseAnalysis) {
        const sessions = data.sessions;
        data.avgRPE = sessions.reduce((sum: number, s: any) => sum + s.rpe, 0) / sessions.length;
        data.avgRIR = sessions.reduce((sum: number, s: any) => sum + s.rir, 0) / sessions.length;
        data.completionRate = sessions.reduce((sum: number, s: any) => 
          sum + (s.completedSets / s.plannedSets), 0) / sessions.length * 100;
      }
      
      // Generate adjustments based on analysis
      for (const [exerciseName, analysis] of exerciseAnalysis) {
        const exerciseAdjustments = this.generateExerciseAdjustments(exerciseName, analysis);
        adjustments.push(...exerciseAdjustments);
      }
      
      // Store adjustments in history
      this.adjustmentHistory.push(...adjustments);
      
      logger.info(`AIPersonalizationEngine: Generated ${adjustments.length} dynamic adjustments`);
      return adjustments;
    } catch (error) {
      logger.error('AIPersonalizationEngine: Error generating dynamic adjustments', error);
      return [];
    }
  }

  /**
   * Generate exercise-specific adjustments
   */
  private generateExerciseAdjustments(exerciseName: string, analysis: any): DynamicAdjustment[] {
    const adjustments: DynamicAdjustment[] = [];
    
    // Weight adjustment based on RPE/RIR
    if (analysis.avgRPE < 7 && analysis.avgRIR > 3) {
      // Too easy - increase weight
      adjustments.push({
        exerciseId: exerciseName,
        parameter: 'weight',
        currentValue: analysis.sessions[analysis.sessions.length - 1].actualWeight,
        newValue: Math.round(analysis.sessions[analysis.sessions.length - 1].actualWeight * 1.05),
        reason: 'RPE bajo y RIR alto indican capacidad para más carga',
        confidence: 88,
        urgency: 'medium'
      });
    } else if (analysis.avgRPE > 9 || analysis.avgRIR < 1) {
      // Too difficult - decrease weight
      adjustments.push({
        exerciseId: exerciseName,
        parameter: 'weight',
        currentValue: analysis.sessions[analysis.sessions.length - 1].actualWeight,
        newValue: Math.round(analysis.sessions[analysis.sessions.length - 1].actualWeight * 0.95),
        reason: 'RPE alto o RIR bajo indican sobrecarga',
        confidence: 92,
        urgency: 'high'
      });
    }
    
    // Sets adjustment based on completion rate
    if (analysis.completionRate < 80) {
      adjustments.push({
        exerciseId: exerciseName,
        parameter: 'sets',
        currentValue: analysis.sessions[0].plannedSets,
        newValue: Math.max(1, analysis.sessions[0].plannedSets - 1),
        reason: 'Baja tasa de finalización de series',
        confidence: 75,
        urgency: 'medium'
      });
    }
    
    // Rest adjustment based on RPE
    if (analysis.avgRPE > 8) {
      adjustments.push({
        exerciseId: exerciseName,
        parameter: 'rest',
        currentValue: '120s',
        newValue: '150s',
        reason: 'RPE elevado requiere mayor recuperación entre series',
        confidence: 82,
        urgency: 'medium'
      });
    }
    
    return adjustments;
  }

  /**
   * Apply dynamic adjustments to current workout plan
   */
  async applyDynamicAdjustments(adjustments: DynamicAdjustment[]): Promise<WorkoutPlan | null> {
    if (!this.personalizationContext || !this.personalizationContext.currentWorkoutPlan) {
      logger.warn('AIPersonalizationEngine: No current workout plan to adjust');
      return null;
    }
    
    try {
      const adjustedPlan = JSON.parse(JSON.stringify(this.personalizationContext.currentWorkoutPlan));
      
      // Apply each adjustment to the workout plan
      adjustments.forEach(adjustment => {
        this.applyAdjustmentToPlan(adjustedPlan, adjustment);
      });
      
      // Update the plan in storage
      // This would typically involve saving to the database or storage manager
      logger.info('AIPersonalizationEngine: Dynamic adjustments applied to workout plan');
      
      return adjustedPlan;
    } catch (error) {
      logger.error('AIPersonalizationEngine: Error applying dynamic adjustments', error);
      return null;
    }
  }

  /**
   * Apply a single adjustment to a workout plan
   */
  private applyAdjustmentToPlan(plan: WorkoutPlan, adjustment: DynamicAdjustment): void {
    if (!plan.days) return;
    
    plan.days.forEach(day => {
      if (!day.exercises) return;
      
      day.exercises.forEach(exercise => {
        if (exercise.name === adjustment.exerciseId) {
          // Apply the adjustment based on parameter type
          switch (adjustment.parameter) {
            case 'weight':
              // For the Exercise type, we can't directly modify weight as it's not a property
              // We would need to store this information separately or modify the exercise structure
              logger.info(`Would adjust weight for ${exercise.name} from ${adjustment.currentValue} to ${adjustment.newValue}`);
              break;
              
            case 'sets':
              // Update number of sets
              if (typeof adjustment.newValue === 'number') {
                exercise.sets = adjustment.newValue;
              }
              break;
              
            case 'reps':
              // Update rep count
              if (typeof adjustment.newValue === 'string') {
                exercise.reps = adjustment.newValue;
              } else if (typeof adjustment.newValue === 'number') {
                exercise.reps = String(adjustment.newValue);
              }
              break;
              
            case 'rest':
              // Update rest periods
              if (typeof adjustment.newValue === 'string') {
                const restValue = parseInt(adjustment.newValue as string);
                exercise.rest = restValue;
              } else if (typeof adjustment.newValue === 'number') {
                exercise.rest = adjustment.newValue;
              }
              break;
          }
        }
      });
    });
    
    // Add adjustment to plan history (if the plan supports it)
    // For now, we'll just log it
    logger.info(`Applied adjustment to ${adjustment.exerciseId}: ${adjustment.parameter} from ${adjustment.currentValue} to ${adjustment.newValue}`);
  }

  /**
   * Get personalized recommendations for the user
   */
  async getPersonalizedRecommendations(): Promise<PersonalizedRecommendation[]> {
    // Get all types of recommendations
    const workoutRecommendations = await this.generateAdaptiveRecommendations();
    const injuryPrevention = await this.performInjuryPreventionAnalysis();
    
    // Combine all recommendations
    const allRecommendations: PersonalizedRecommendation[] = [...workoutRecommendations];
    
    // Add injury prevention recommendations
    injuryPrevention.preventiveMeasures.forEach((measure, index) => {
      allRecommendations.push({
        type: 'recovery',
        title: `Medida Preventiva #${index + 1}`,
        description: measure,
        priority: injuryPrevention.riskLevel === 'critical' ? 'critical' : 
                  injuryPrevention.riskLevel === 'high' ? 'high' : 'medium',
        confidence: injuryPrevention.confidence,
        actionable: true,
        estimatedImpact: 'Reducción del riesgo de lesión'
      });
    });
    
    return allRecommendations;
  }

  /**
   * Get injury risk history
   */
  getInjuryRiskHistory(): InjuryRiskAssessment[] {
    return [...this.injuryRiskHistory];
  }

  /**
   * Get adjustment history
   */
  getAdjustmentHistory(): DynamicAdjustment[] {
    return [...this.adjustmentHistory];
  }

  /**
   * Get recommendation history
   */
  getRecommendationHistory(): PersonalizedRecommendation[] {
    return [...this.recommendationHistory];
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    // Clean up any resources if needed
    logger.info('AIPersonalizationEngine: Cleanup completed');
  }
}

// Export singleton instance
export const aiPersonalizationEngine = AIPersonalizationEngine.getInstance();