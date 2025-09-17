/**
 * Predictive Analytics Engine for SPARTAN 4
 * Projects strength, muscle mass, and body composition evolution using AI predictive models
 */

import type { UserData } from './types';
import type { WeeklyProgressReport } from './progress-report-types';

export interface BiometricData {
  weight: number;
  bodyFatPercentage: number;
  muscleMass: number;
  boneDensity: number;
  restingHeartRate: number;
  heartRateVariability: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  vo2max: number;
  glucose: number;
  cholesterol: number;
}

export interface AdherenceMetrics {
  trainingAdherence: number; // 0-100
  nutritionAdherence: number; // 0-100
  sleepQuality: number; // 0-100
  supplementationAdherence: number; // 0-100
  stressManagement: number; // 0-100
}

export interface EvolutionProjection {
  timeframe: '1_month' | '3_months' | '6_months' | '1_year';
  strength: {
    squat: number; // kg
    deadlift: number; // kg
    benchPress: number; // kg
    pullUp: number; // kg
    projectedIncrease: number; // percentage
  };
  muscleMass: {
    totalMass: number; // kg
    leanMass: number; // kg
    projectedIncrease: number; // percentage
  };
  bodyComposition: {
    bodyFatPercentage: number; // percentage
    visceralFat: number; // level 1-10
    projectedDecrease: number; // percentage points
  };
  confidence: number; // 0-100
  keyFactors: string[];
}

export interface PredictiveInsights {
  projections: EvolutionProjection[];
  riskFactors: string[];
  optimizationOpportunities: string[];
  personalizedRecommendations: string[];
}

export class PredictiveAnalyticsEngine {
  /**
   * Generate predictive insights based on current data and adherence metrics
   */
  public generatePredictions(
    userData: UserData,
    biometricData: BiometricData,
    adherence: AdherenceMetrics,
    progressReport?: WeeklyProgressReport
  ): PredictiveInsights {
    console.log(`🔮 Generating predictive insights for user ${userData.name}`);
    
    // Generate projections for different timeframes
    const projections = this.calculateProjections(biometricData, adherence, userData);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(biometricData, adherence);
    
    // Find optimization opportunities
    const optimizationOpportunities = this.findOptimizationOpportunities(adherence, biometricData);
    
    // Generate personalized recommendations
    const personalizedRecommendations = this.generatePersonalizedRecommendations(
      adherence, 
      biometricData, 
      userData,
      progressReport
    );
    
    return {
      projections,
      riskFactors,
      optimizationOpportunities,
      personalizedRecommendations
    };
  }
  
  /**
   * Calculate evolution projections for different timeframes
   */
  private calculateProjections(
    biometricData: BiometricData,
    adherence: AdherenceMetrics,
    userData: UserData
  ): EvolutionProjection[] {
    // Base calculations using adherence and biometric data
    const baseTrainingEffect = this.calculateTrainingEffect(adherence.trainingAdherence, userData.fitnessLevel);
    const baseNutritionEffect = this.calculateNutritionEffect(adherence.nutritionAdherence, biometricData);
    const baseRecoveryEffect = this.calculateRecoveryEffect(adherence.sleepQuality, adherence.stressManagement);
    
    // Calculate composite effect (weighted average)
    const compositeEffect = (
      baseTrainingEffect * 0.5 +
      baseNutritionEffect * 0.3 +
      baseRecoveryEffect * 0.2
    );
    
    // Generate projections for different timeframes
    return [
      this.generateProjection('1_month', compositeEffect, biometricData, adherence, 1),
      this.generateProjection('3_months', compositeEffect, biometricData, adherence, 3),
      this.generateProjection('6_months', compositeEffect, biometricData, adherence, 6),
      this.generateProjection('1_year', compositeEffect, biometricData, adherence, 12)
    ];
  }
  
  /**
   * Generate a single projection for a specific timeframe
   */
  private generateProjection(
    timeframe: '1_month' | '3_months' | '6_months' | '1_year',
    compositeEffect: number,
    biometricData: BiometricData,
    adherence: AdherenceMetrics,
    months: number
  ): EvolutionProjection {
    // Calculate strength gains (in kg)
    const strengthMultiplier = compositeEffect * months * 0.1;
    const currentStrength = {
      squat: 100, // placeholder - would come from actual data
      deadlift: 120, // placeholder - would come from actual data
      benchPress: 80, // placeholder - would come from actual data
      pullUp: 60 // placeholder - would come from actual data
    };
    
    const projectedStrength = {
      squat: currentStrength.squat * (1 + strengthMultiplier * 0.05),
      deadlift: currentStrength.deadlift * (1 + strengthMultiplier * 0.05),
      benchPress: currentStrength.benchPress * (1 + strengthMultiplier * 0.05),
      pullUp: currentStrength.pullUp * (1 + strengthMultiplier * 0.05)
    };
    
    // Calculate muscle mass changes
    const muscleMassMultiplier = compositeEffect * months * 0.08;
    const currentMuscleMass = biometricData.muscleMass || 55; // kg
    const projectedMuscleMass = currentMuscleMass * (1 + muscleMassMultiplier * 0.02);
    
    // Calculate body composition changes
    const bodyFatMultiplier = compositeEffect * months * 0.06;
    const currentBodyFat = biometricData.bodyFatPercentage || 15; // percentage
    const projectedBodyFat = Math.max(5, currentBodyFat - (bodyFatMultiplier * 0.3));
    
    // Calculate confidence based on adherence consistency
    const confidence = Math.min(100, 70 + 
      (adherence.trainingAdherence * 0.1) +
      (adherence.nutritionAdherence * 0.1) +
      (adherence.sleepQuality * 0.05) +
      (adherence.supplementationAdherence * 0.05)
    );
    
    // Identify key factors influencing the projection
    const keyFactors = this.identifyKeyFactors(adherence, compositeEffect);
    
    return {
      timeframe,
      strength: {
        squat: Math.round(projectedStrength.squat * 10) / 10,
        deadlift: Math.round(projectedStrength.deadlift * 10) / 10,
        benchPress: Math.round(projectedStrength.benchPress * 10) / 10,
        pullUp: Math.round(projectedStrength.pullUp * 10) / 10,
        projectedIncrease: Math.round(strengthMultiplier * 50) / 10
      },
      muscleMass: {
        totalMass: Math.round(projectedMuscleMass * 10) / 10,
        leanMass: Math.round(projectedMuscleMass * 0.95 * 10) / 10, // Assuming 95% lean mass
        projectedIncrease: Math.round(muscleMassMultiplier * 20) / 10
      },
      bodyComposition: {
        bodyFatPercentage: Math.round(projectedBodyFat * 10) / 10,
        visceralFat: Math.max(1, 5 - Math.round(bodyFatMultiplier * 0.5)), // Scale 1-10
        projectedDecrease: Math.round((currentBodyFat - projectedBodyFat) * 10) / 10
      },
      confidence: Math.round(confidence),
      keyFactors
    };
  }
  
  /**
   * Calculate training effect based on adherence and fitness level
   */
  private calculateTrainingEffect(trainingAdherence: number, fitnessLevel: string): number {
    // Base effect based on adherence
    let baseEffect = trainingAdherence / 100;
    
    // Adjust for fitness level (beginners see faster initial gains)
    switch (fitnessLevel) {
      case 'beginner':
        baseEffect *= 1.5;
        break;
      case 'intermediate':
        baseEffect *= 1.2;
        break;
      case 'advanced':
        baseEffect *= 0.8;
        break;
    }
    
    // Cap at 1.0 for realistic projections
    return Math.min(1.0, baseEffect);
  }
  
  /**
   * Calculate nutrition effect based on adherence and biometric data
   */
  private calculateNutritionEffect(nutritionAdherence: number, biometricData: BiometricData): number {
    // Base effect based on adherence
    let baseEffect = nutritionAdherence / 100;
    
    // Adjust based on current body composition
    if (biometricData.bodyFatPercentage > 20) {
      // Higher potential for improvement if starting with higher body fat
      baseEffect *= 1.2;
    } else if (biometricData.bodyFatPercentage < 10) {
      // Diminishing returns at very low body fat
      baseEffect *= 0.8;
    }
    
    return Math.min(1.0, baseEffect);
  }
  
  /**
   * Calculate recovery effect based on sleep quality and stress management
   */
  private calculateRecoveryEffect(sleepQuality: number, stressManagement: number): number {
    // Combined effect of sleep and stress management
    const combinedRecovery = (sleepQuality * 0.7 + stressManagement * 0.3) / 100;
    return Math.min(1.0, combinedRecovery);
  }
  
  /**
   * Identify key factors influencing the projections
   */
  private identifyKeyFactors(adherence: AdherenceMetrics, compositeEffect: number): string[] {
    const factors: string[] = [];
    
    if (adherence.trainingAdherence < 80) {
      factors.push('Aumentar adherencia al entrenamiento para maximizar ganancias');
    }
    
    if (adherence.nutritionAdherence < 75) {
      factors.push('Mejorar adherencia nutricional para optimizar composición corporal');
    }
    
    if (adherence.sleepQuality < 70) {
      factors.push('Optimizar calidad del sueño para mejorar recuperación');
    }
    
    if (compositeEffect > 0.8) {
      factors.push('Excelente progreso proyectado con adherencia actual');
    } else if (compositeEffect < 0.4) {
      factors.push('Progreso limitado - necesitas mejorar múltiples factores');
    }
    
    return factors;
  }
  
  /**
   * Identify risk factors that could impede progress
   */
  private identifyRiskFactors(biometricData: BiometricData, adherence: AdherenceMetrics): string[] {
    const riskFactors: string[] = [];
    
    // High body fat percentage
    if (biometricData.bodyFatPercentage > 25) {
      riskFactors.push('Porcentaje de grasa corporal elevado - riesgo cardiovascular');
    }
    
    // Poor sleep quality
    if (adherence.sleepQuality < 60) {
      riskFactors.push('Calidad de sueño deficiente - afecta recuperación y crecimiento muscular');
    }
    
    // High stress levels
    if (adherence.stressManagement < 50) {
      riskFactors.push('Altos niveles de estrés - puede impedir progresos en fuerza y composición');
    }
    
    // Poor nutrition adherence
    if (adherence.nutritionAdherence < 60) {
      riskFactors.push('Baja adherencia nutricional - limita síntesis proteica y recuperación');
    }
    
    // Elevated blood pressure
    if (biometricData.bloodPressure.systolic > 140 || biometricData.bloodPressure.diastolic > 90) {
      riskFactors.push('Presión arterial elevada - consultar con profesional de la salud');
    }
    
    // Low HRV (Heart Rate Variability)
    if (biometricData.heartRateVariability < 40) {
      riskFactors.push('Baja variabilidad cardíaca - indicador de estrés y mala recuperación');
    }
    
    return riskFactors;
  }
  
  /**
   * Find optimization opportunities to accelerate progress
   */
  private findOptimizationOpportunities(adherence: AdherenceMetrics, biometricData: BiometricData): string[] {
    const opportunities: string[] = [];
    
    // Training optimization
    if (adherence.trainingAdherence < 90) {
      opportunities.push('Aumentar adherencia al entrenamiento al 90%+ para maximizar ganancias');
    }
    
    // Nutrition optimization
    if (adherence.nutritionAdherence < 85) {
      opportunities.push('Mejorar adherencia nutricional al 85%+ para optimizar composición corporal');
    }
    
    // Sleep optimization
    if (adherence.sleepQuality < 80) {
      opportunities.push('Optimizar calidad del sueño al 80%+ para mejorar recuperación');
    }
    
    // Supplementation optimization
    if (adherence.supplementationAdherence < 70) {
      opportunities.push('Mejorar adherencia a suplementación recomendada');
    }
    
    // Body composition optimization
    if (biometricData.bodyFatPercentage > 15) {
      opportunities.push('Enfocar en reducción de grasa corporal para mejorar relación fuerza/peso');
    }
    
    return opportunities;
  }
  
  /**
   * Generate personalized recommendations based on current metrics
   */
  private generatePersonalizedRecommendations(
    adherence: AdherenceMetrics,
    biometricData: BiometricData,
    userData: UserData,
    progressReport?: WeeklyProgressReport
  ): string[] {
    const recommendations: string[] = [];
    
    // Training recommendations
    if (adherence.trainingAdherence < 85) {
      recommendations.push('Aumenta tu adherencia al entrenamiento al 85% o más para maximizar ganancias de fuerza');
    } else {
      recommendations.push('Mantén tu excelente adherencia al entrenamiento y considera aumentar la intensidad');
    }
    
    // Nutrition recommendations
    if (adherence.nutritionAdherence < 80) {
      recommendations.push('Mejora tu adherencia nutricional para optimizar la síntesis proteica y recuperación');
    }
    
    // Recovery recommendations
    if (adherence.sleepQuality < 75) {
      recommendations.push('Prioriza 7-9 horas de sueño de calidad para optimizar la recuperación hormonal');
    }
    
    // Body composition recommendations
    if (biometricData.bodyFatPercentage > 18) {
      recommendations.push(`Enfócate en una dieta ligeramente deficitaria para reducir grasa corporal del ${biometricData.bodyFatPercentage}% al 15%`);
    } else if (biometricData.bodyFatPercentage < 10) {
      recommendations.push('Considera un enfoque de mantenimiento para preservar masa muscular mientras mejoras fuerza');
    }
    
    // Supplementation recommendations
    if (adherence.supplementationAdherence < 70) {
      recommendations.push('Aumenta tu adherencia a suplementos como proteína, creatina y omega-3');
    }
    
    // Stress management recommendations
    if (adherence.stressManagement < 70) {
      recommendations.push('Incorpora técnicas de manejo del estrés como meditación o respiración diafragmática');
    }
    
    // Fitness level specific recommendations
    switch (userData.fitnessLevel) {
      case 'beginner':
        recommendations.push('Como principiante, enfócate en la técnica y la consistencia antes que en la intensidad');
        break;
      case 'intermediate':
        recommendations.push('Como nivel intermedio, considera periodización para romper mesetas');
        break;
      case 'advanced':
        recommendations.push('Como nivel avanzado, enfócate en micro-optimizaciones y recuperación');
        break;
    }
    
    return recommendations;
  }
  
  /**
   * Update projections based on new data
   */
  public updateProjections(
    currentProjections: EvolutionProjection[],
    newBiometricData: BiometricData,
    newAdherence: AdherenceMetrics,
    userData: UserData
  ): EvolutionProjection[] {
    console.log('🔄 Updating projections with new data');
    return this.calculateProjections(newBiometricData, newAdherence, userData);
  }
}

// Export singleton instance
export const predictiveAnalyticsEngine = new PredictiveAnalyticsEngine();