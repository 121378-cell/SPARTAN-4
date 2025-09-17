/**
 * Progress Report Generator for SPARTAN 4
 * Generates detailed user progress reports with training, nutrition, health and performance metrics
 */

import { supabase, db } from './supabase';
import type { 
  WeeklyProgressReport, 
  TrainingMetrics, 
  NutritionalMetrics, 
  HealthMetrics, 
  PerformanceMetrics,
  Recommendation,
  UserGoals
} from './progress-report-types';
import type { UserData, WorkoutPlan, ProgressData } from './types';

export class ProgressReportGenerator {
  /**
   * Generate a comprehensive weekly progress report for a user
   */
  public async generateWeeklyReport(userId: string): Promise<WeeklyProgressReport> {
    console.log(`📊 Generating weekly progress report for user ${userId}`);
    
    // Fetch user data
    const userData = await this.fetchUserData(userId);
    if (!userData) {
      throw new Error('User data not found');
    }
    
    // Fetch workout data for the last week
    const workoutData = await this.fetchWorkoutData(userId);
    const progressData = await this.fetchProgressData(userId);
    
    // Calculate metrics
    const trainingMetrics = this.calculateTrainingMetrics(workoutData, progressData);
    const nutritionalMetrics = this.calculateNutritionalMetrics(userId);
    const healthMetrics = this.calculateHealthMetrics(userId);
    const performanceMetrics = this.calculatePerformanceMetrics(userId, workoutData);
    
    // Generate insights
    const strengths = this.identifyStrengths(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
    const areasForImprovement = this.identifyAreasForImprovement(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
    const recommendations = this.generateRecommendations(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
    
    // Calculate trends
    const trends = this.calculateTrends(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
    
    const report: WeeklyProgressReport = {
      reportId: `report_${userId}_${Date.now()}`,
      userId,
      startDate: this.getWeekStart(new Date()),
      endDate: this.getWeekEnd(new Date()),
      period: 'weekly',
      training: trainingMetrics,
      nutrition: nutritionalMetrics,
      health: healthMetrics,
      performance: performanceMetrics,
      overallScore,
      strengths,
      areasForImprovement,
      recommendations,
      trends
    };
    
    console.log(`✅ Weekly progress report generated for user ${userId}`);
    return report;
  }
  
  /**
   * Fetch user data from Supabase
   */
  private async fetchUserData(userId: string): Promise<UserData | null> {
    const { data, error } = await db.getUser(userId);
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
    return data as unknown as UserData;
  }
  
  /**
   * Fetch workout plans for the user
   */
  private async fetchWorkoutData(userId: string): Promise<WorkoutPlan[]> {
    const { data, error } = await db.getUserWorkoutPlans(userId);
    if (error) {
      console.error('Error fetching workout data:', error);
      return [];
    }
    return data || [];
  }
  
  /**
   * Fetch progress data for the user
   */
  private async fetchProgressData(userId: string): Promise<ProgressData[]> {
    // This would need to be implemented based on how progress data is stored
    // For now, we'll return an empty array
    return [];
  }
  
  /**
   * Calculate training metrics
   */
  private calculateTrainingMetrics(workoutData: WorkoutPlan[], progressData: ProgressData[]): TrainingMetrics {
    const totalWorkouts = workoutData.length;
    const completedWorkouts = progressData.length;
    const workoutCompletionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
    
    // Calculate average workout duration
    const totalDuration = workoutData.reduce((sum, plan) => sum + (plan.duration || 0), 0);
    const avgWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    
    // Calculate consistency score (simplified)
    const consistencyScore = Math.min(100, workoutCompletionRate);
    
    // Calculate intensity score (simplified)
    const intensityScore = Math.min(100, avgWorkoutDuration / 60 * 100);
    
    // Extract exercise names
    const allExercises: string[] = [];
    workoutData.forEach(plan => {
      plan.days?.forEach(day => {
        day.exercises?.forEach(exercise => {
          allExercises.push(exercise.name);
        });
      });
    });
    
    // Count exercise frequency
    const exerciseCount: Record<string, number> = {};
    allExercises.forEach(exercise => {
      exerciseCount[exercise] = (exerciseCount[exercise] || 0) + 1;
    });
    
    // Get top 5 favorite exercises
    const favoriteExercises = Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([exercise]) => exercise);
    
    return {
      totalWorkouts,
      completedWorkouts,
      workoutCompletionRate,
      avgWorkoutDuration,
      totalVolume: 0, // Would need actual exercise data to calculate
      consistencyScore,
      intensityScore,
      progressionRate: 0, // Would need historical data to calculate
      favoriteExercises,
      workoutDistribution: {
        strength: 40,
        calisthenics: 25,
        yoga: 15,
        cardio: 15,
        other: 5
      }
    };
  }
  
  /**
   * Calculate nutritional metrics (placeholder)
   */
  private calculateNutritionalMetrics(userId: string): NutritionalMetrics {
    // In a real implementation, this would fetch data from nutrition tracking
    return {
      adherenceRate: 75,
      macroTargets: {
        calories: 2500,
        protein: 150,
        carbs: 300,
        fats: 80
      },
      actualIntake: {
        calories: 2300,
        protein: 140,
        carbs: 280,
        fats: 75
      },
      macroAdherence: {
        calories: 92,
        protein: 93,
        carbs: 93,
        fats: 94
      },
      mealFrequency: 3.5,
      hydrationLevel: 80,
      micronutrientScore: 70,
      supplementationAdherence: 60
    };
  }
  
  /**
   * Calculate health metrics (placeholder)
   */
  private calculateHealthMetrics(userId: string): HealthMetrics {
    // In a real implementation, this would fetch data from wearable devices or health tracking
    return {
      avgHeartRate: 72,
      restingHeartRate: 52,
      heartRateVariability: 65,
      sleepQuality: 85,
      sleepDuration: 7.5,
      stepsPerDay: 8500,
      activeMinutes: 45,
      stressLevel: 30,
      bodyComposition: {
        weight: 75,
        bodyFatPercentage: 15,
        muscleMass: 60
      },
      bloodMarkers: {
        glucose: 95,
        cholesterol: 180,
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        }
      }
    };
  }
  
  /**
   * Calculate performance metrics (placeholder)
   */
  private calculatePerformanceMetrics(userId: string, workoutData: WorkoutPlan[]): PerformanceMetrics {
    // In a real implementation, this would calculate actual performance improvements
    return {
      strengthImprovements: {
        squat: 5.2,
        deadlift: 3.8,
        benchPress: 4.1,
        pullUp: 7.3
      },
      enduranceImprovements: {
        vo2max: 3.5,
        lactateThreshold: 2.8
      },
      flexibilityImprovements: {
        shoulderFlexibility: 6.2,
        hipFlexibility: 4.5,
        spineMobility: 5.1
      },
      cognitiveMetrics: {
        focusScore: 82,
        reactionTime: 280,
        memoryScore: 78
      }
    };
  }
  
  /**
   * Identify user strengths
   */
  private identifyStrengths(
    training: TrainingMetrics,
    nutrition: NutritionalMetrics,
    health: HealthMetrics,
    performance: PerformanceMetrics
  ): string[] {
    const strengths: string[] = [];
    
    if (training.consistencyScore >= 80) {
      strengths.push('Excelente consistencia en el entrenamiento');
    }
    
    if (training.workoutCompletionRate >= 85) {
      strengths.push('Alto índice de finalización de entrenamientos');
    }
    
    if (nutrition.adherenceRate >= 80) {
      strengths.push('Buena adherencia a los objetivos nutricionales');
    }
    
    if (health.sleepQuality >= 80) {
      strengths.push('Calidad de sueño óptima');
    }
    
    if (health.heartRateVariability >= 60) {
      strengths.push('Buen balance del sistema nervioso autónomo');
    }
    
    if (performance.strengthImprovements.squat > 5) {
      strengths.push('Excelente progreso en sentadillas');
    }
    
    return strengths;
  }
  
  /**
   * Identify areas for improvement
   */
  private identifyAreasForImprovement(
    training: TrainingMetrics,
    nutrition: NutritionalMetrics,
    health: HealthMetrics,
    performance: PerformanceMetrics
  ): string[] {
    const areas: string[] = [];
    
    if (training.consistencyScore < 70) {
      areas.push('Necesitas mejorar la consistencia en el entrenamiento');
    }
    
    if (nutrition.adherenceRate < 70) {
      areas.push('Tu adherencia nutricional necesita atención');
    }
    
    if (health.sleepQuality < 70) {
      areas.push('Tu calidad de sueño puede mejorarse');
    }
    
    if (health.stressLevel > 50) {
      areas.push('Nivel de estrés elevado, considera técnicas de manejo');
    }
    
    if (nutrition.supplementationAdherence < 50) {
      areas.push('Baja adherencia a suplementación recomendada');
    }
    
    return areas;
  }
  
  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    training: TrainingMetrics,
    nutrition: NutritionalMetrics,
    health: HealthMetrics,
    performance: PerformanceMetrics
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Training recommendations
    if (training.consistencyScore < 80) {
      recommendations.push({
        category: 'training',
        priority: 'high',
        title: 'Mejora tu consistencia de entrenamiento',
        description: 'Establece un horario fijo para entrenar y considera sesiones más cortas si el tiempo es limitado.',
        actionItems: [
          'Planifica tus entrenamientos a la semana',
          'Comienza con sesiones de 30 minutos si es necesario',
          'Usa recordatorios para no saltarte sesiones'
        ],
        expectedImpact: 'Aumento del 20-30% en consistencia',
        timeframe: '2 semanas'
      });
    }
    
    // Nutrition recommendations
    if (nutrition.adherenceRate < 75) {
      recommendations.push({
        category: 'nutrition',
        priority: 'high',
        title: 'Optimiza tu adherencia nutricional',
        description: 'Implementa estrategias para seguir mejor tus objetivos nutricionales.',
        actionItems: [
          'Prepara comidas con anticipación',
          'Usa una aplicación para registrar tu comida',
          'Mantén snacks saludables a mano'
        ],
        expectedImpact: 'Mejora del 15-25% en adherencia',
        timeframe: '2 semanas'
      });
    }
    
    // Health recommendations
    if (health.sleepQuality < 75) {
      recommendations.push({
        category: 'health',
        priority: 'medium',
        title: 'Mejora la calidad de tu sueño',
        description: 'Implementa una rutina de sueño consistente para optimizar la recuperación.',
        actionItems: [
          'Establece una hora fija para dormir y levantarte',
          'Evita pantallas 1 hora antes de dormir',
          'Crea un ambiente oscuro y fresco en tu habitación'
        ],
        expectedImpact: 'Mejora de 10-15 puntos en calidad de sueño',
        timeframe: '1 mes'
      });
    }
    
    // Performance recommendations
    if (performance.cognitiveMetrics.focusScore < 75) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        title: 'Potencia tu enfoque y concentración',
        description: 'Incorpora técnicas de mindfulness y ejercicios cognitivos.',
        actionItems: [
          'Practica 10 minutos de meditación diaria',
          'Haz ejercicios de respiración antes de entrenar',
          'Limita multitasking durante actividades importantes'
        ],
        expectedImpact: 'Mejora del 15-20% en enfoque',
        timeframe: '3 semanas'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Calculate trends
   */
  private calculateTrends(
    training: TrainingMetrics,
    nutrition: NutritionalMetrics,
    health: HealthMetrics,
    performance: PerformanceMetrics
  ) {
    // In a real implementation, this would compare with previous period data
    return {
      trainingTrend: 'improving' as const,
      nutritionTrend: 'stable' as const,
      healthTrend: 'improving' as const,
      performanceTrend: 'improving' as const
    };
  }
  
  /**
   * Calculate overall score
   */
  private calculateOverallScore(
    training: TrainingMetrics,
    nutrition: NutritionalMetrics,
    health: HealthMetrics,
    performance: PerformanceMetrics
  ): number {
    // Weighted average of all metrics
    const weights = {
      training: 0.3,
      nutrition: 0.25,
      health: 0.25,
      performance: 0.2
    };
    
    const score = (
      training.consistencyScore * weights.training +
      nutrition.adherenceRate * weights.nutrition +
      health.sleepQuality * weights.health +
      (performance.strengthImprovements.squat + 
       performance.strengthImprovements.deadlift + 
       performance.strengthImprovements.benchPress + 
       performance.strengthImprovements.pullUp) / 4 * weights.performance
    );
    
    return Math.round(score);
  }
  
  /**
   * Helper functions
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  
  private getWeekEnd(date: Date): Date {
    const d = new Date(this.getWeekStart(date));
    d.setDate(d.getDate() + 6);
    return d;
  }
}

// Export singleton instance
export const progressReportGenerator = new ProgressReportGenerator();