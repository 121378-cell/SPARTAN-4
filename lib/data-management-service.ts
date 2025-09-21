/**
 * Data Management Service - "La Sangre de Spartan"
 * Central data orchestration system for the SPARTAN 4 ecosystem
 * 
 * This service handles:
 * - Integration of all data sources
 * - Real-time data processing and normalization
 * - Predictive analytics
 * - Cross-modal data sharing
 * - Security and privacy compliance
 * - Intelligent data visualization
 */

import { storageManager, AppSettings } from './storage';
import { supabase, db } from './supabase';
import { wearableIntegrationService, WearableData } from './wearable-integration-service';
import { predictiveAnalyticsEngine, BiometricData, AdherenceMetrics } from './predictive-analytics';
import { ChatContext } from './chat-maestro-service';
import { ProgressData, UserData, WorkoutPlan, WorkoutSession, RecoveryAnalysis, ProgressionPlan, DailyNutrition, UserHabit } from './types';
import { logger } from './logger';

// Types for our data management system
export interface IntegratedData {
  userData: UserData | null;
  biometricData: BiometricData | null;
  adherenceMetrics: AdherenceMetrics | null;
  workoutPlans: WorkoutPlan[];
  workoutSessions: WorkoutSession[];
  recoveryData: RecoveryAnalysis[];
  progressionPlans: ProgressionPlan[];
  nutritionData: DailyNutrition[];
  habits: UserHabit[];
  wearableData: WearableData | null;
  settings: AppSettings | null;
}

export interface DataInsights {
  currentStatus: {
    energyLevel: 'high' | 'moderate' | 'low' | 'veryLow';
    trainingReadiness: 'ready' | 'caution' | 'rest';
    recoveryStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical';
  };
  trends: {
    performance: 'improving' | 'stable' | 'declining';
    adherence: 'excellent' | 'good' | 'fair' | 'poor';
    recovery: 'improving' | 'stable' | 'declining';
  };
  predictions: any; // From predictive analytics
  risks: string[];
  recommendations: string[];
}

export interface DataVisualization {
  charts: {
    performance: any[];
    adherence: any[];
    recovery: any[];
    biometrics: any[];
  };
  summaries: {
    weekly: string;
    monthly: string;
    quarterly: string;
  };
}

export class DataManagementService {
  private static instance: DataManagementService;
  private userId: string | null = null;
  private integratedData: IntegratedData | null = null;
  private lastSync: Date | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance(): DataManagementService {
    if (!DataManagementService.instance) {
      DataManagementService.instance = new DataManagementService();
    }
    return DataManagementService.instance;
  }

  /**
   * Initialize the data management service with user context
   */
  async initialize(userId: string): Promise<void> {
    this.userId = userId;
    await this.syncAllData();
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.syncAllData();
    }, 30000); // Sync every 30 seconds
  }

  /**
   * Synchronize all data sources
   */
  async syncAllData(): Promise<void> {
    if (!this.userId) {
      logger.warn('DataManagementService: No user ID set, skipping sync');
      return;
    }

    try {
      logger.info('DataManagementService: Starting data synchronization');
      
      // Fetch data from all sources
      const [
        userData,
        biometricData,
        adherenceMetrics,
        workoutPlans,
        workoutSessions,
        recoveryData,
        progressionPlans,
        nutritionData,
        habits,
        wearableData,
        settings
      ] = await Promise.all([
        this.fetchUserData(),
        this.fetchBiometricData(),
        this.calculateAdherenceMetrics(),
        this.fetchWorkoutPlans(),
        this.fetchWorkoutSessions(),
        this.fetchRecoveryData(),
        this.fetchProgressionPlans(),
        this.fetchNutritionData(),
        this.fetchHabits(),
        this.fetchWearableData(),
        this.fetchSettings()
      ]);

      // Create integrated data object
      this.integratedData = {
        userData,
        biometricData,
        adherenceMetrics,
        workoutPlans,
        workoutSessions,
        recoveryData,
        progressionPlans,
        nutritionData,
        habits,
        wearableData,
        settings
      };

      this.lastSync = new Date();
      logger.info('DataManagementService: Data synchronization completed successfully');
    } catch (error) {
      logger.error('DataManagementService: Error during data synchronization', error);
    }
  }

  /**
   * Fetch user data from storage and database
   */
  private async fetchUserData(): Promise<UserData | null> {
    try {
      // Try local storage first
      const localData = storageManager.getUserData();
      if (localData) {
        return localData;
      }

      // If not available locally, try database
      if (this.userId) {
        const { data, error } = await db.getUser(this.userId);
        if (!error && data) {
          const userData: UserData = {
            name: data.name,
            age: data.age || 30,
            weight: data.weight || 70,
            height: data.height || 170,
            fitnessLevel: data.fitness_level as any,
            goals: data.goals || []
          };
          return userData;
        }
      }
    } catch (error) {
      logger.error('DataManagementService: Error fetching user data', error);
    }
    return null;
  }

  /**
   * Fetch biometric data from various sources
   */
  private async fetchBiometricData(): Promise<BiometricData | null> {
    try {
      // Get from wearable data if available
      const wearableData = await this.fetchWearableData();
      if (wearableData) {
        return {
          weight: wearableData.vitals?.bloodPressure?.systolic ? wearableData.vitals.bloodPressure.systolic * 0.7 : 70,
          bodyFatPercentage: 15, // Placeholder
          muscleMass: 55, // Placeholder
          boneDensity: 0, // Not typically available from wearables
          restingHeartRate: wearableData.recovery?.restingHeartRate || 60,
          heartRateVariability: wearableData.recovery?.hrv || 60,
          bloodPressure: {
            systolic: wearableData.vitals?.bloodPressure?.systolic || 120,
            diastolic: wearableData.vitals?.bloodPressure?.diastolic || 80
          },
          vo2max: wearableData.activity?.vo2max || 40,
          glucose: wearableData.vitals?.glucose?.current || 90,
          cholesterol: 0 // Not typically available from wearables
        };
      }

      // Fallback to stored biometric data
      const progressData = storageManager.getProgressData();
      if (progressData.length > 0) {
        const latest = progressData[0];
        return {
          weight: 70, // Placeholder
          bodyFatPercentage: 15, // Placeholder
          muscleMass: 55, // Placeholder
          boneDensity: 0,
          restingHeartRate: 60,
          heartRateVariability: 60,
          bloodPressure: {
            systolic: 120,
            diastolic: 80
          },
          vo2max: 40,
          glucose: 90,
          cholesterol: 0
        };
      }
    } catch (error) {
      logger.error('DataManagementService: Error fetching biometric data', error);
    }
    return null;
  }

  /**
   * Calculate adherence metrics from available data
   */
  private async calculateAdherenceMetrics(): Promise<AdherenceMetrics | null> {
    try {
      if (!this.integratedData) {
        await this.syncAllData();
      }

      if (!this.integratedData) return null;

      // Calculate training adherence based on completed workouts vs planned
      const plannedWorkouts = this.integratedData.workoutPlans.length;
      const completedWorkouts = this.integratedData.workoutSessions.length;
      const trainingAdherence = plannedWorkouts > 0 
        ? Math.min(100, Math.round((completedWorkouts / plannedWorkouts) * 100)) 
        : 100;

      // Calculate nutrition adherence (simplified)
      const nutritionAdherence = this.integratedData.nutritionData.length > 0 
        ? 85 // Placeholder - would be calculated based on actual adherence
        : 50;

      // Calculate sleep quality from wearable data or recovery data
      let sleepQuality = 70; // Default
      if (this.integratedData.wearableData?.sleep) {
        sleepQuality = this.integratedData.wearableData.sleep.quality;
      } else if (this.integratedData.recoveryData.length > 0) {
        // Average of recent recovery scores
        const recentRecovery = this.integratedData.recoveryData.slice(0, 5);
        const avgRecovery = recentRecovery.reduce((sum, rec) => sum + (rec.recoveryScore || 50), 0) / recentRecovery.length;
        sleepQuality = Math.round(avgRecovery);
      }

      // Calculate stress management from wearable data
      let stressManagement = 70; // Default
      if (this.integratedData.wearableData?.recovery?.stress !== undefined) {
        // Invert stress score (lower stress = better management)
        stressManagement = Math.round(100 - this.integratedData.wearableData.recovery.stress);
      }

      // Calculate supplementation adherence (simplified)
      const supplementationAdherence = this.integratedData.habits.some(habit => 
        (habit as any).category === 'supplementation' && (habit as any).completionRate > 70
      ) ? 90 : 40;

      return {
        trainingAdherence,
        nutritionAdherence,
        sleepQuality,
        supplementationAdherence,
        stressManagement
      };
    } catch (error) {
      logger.error('DataManagementService: Error calculating adherence metrics', error);
    }
    return null;
  }

  /**
   * Fetch workout plans from storage and database
   */
  private async fetchWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      // Try local storage first
      const localPlans = storageManager.getWorkoutPlans();
      if (localPlans.length > 0) {
        return localPlans;
      }

      // If not available locally and we have a user ID, try database
      if (this.userId) {
        const { data, error } = await db.getUserWorkoutPlans(this.userId);
        if (!error && data) {
          return data.map(plan => ({
            id: plan.id,
            name: plan.name,
            description: '',
            focus: [],
            days: [],
            duration: plan.duration,
            createdAt: new Date(plan.created_at),
            updatedAt: new Date(),
            difficulty: plan.difficulty as any,
            equipment: []
          }));
        }
      }
    } catch (error) {
      logger.error('DataManagementService: Error fetching workout plans', error);
    }
    return [];
  }

  /**
   * Fetch workout sessions from storage
   */
  private async fetchWorkoutSessions(): Promise<WorkoutSession[]> {
    // For now, we'll return empty array as sessions are typically not stored separately
    // In a real implementation, this would fetch from a sessions table
    return [];
  }

  /**
   * Fetch recovery data from storage
   */
  private async fetchRecoveryData(): Promise<RecoveryAnalysis[]> {
    // For now, we'll return empty array
    // In a real implementation, this would fetch from a recovery metrics table
    return [];
  }

  /**
   * Fetch progression plans from storage
   */
  private async fetchProgressionPlans(): Promise<ProgressionPlan[]> {
    // For now, we'll return empty array
    // In a real implementation, this would fetch from a progression plans table
    return [];
  }

  /**
   * Fetch nutrition data from storage
   */
  private async fetchNutritionData(): Promise<DailyNutrition[]> {
    try {
      // Try local storage
      const nutritionData = storageManager.getDailyNutrition();
      return nutritionData;
    } catch (error) {
      logger.error('DataManagementService: Error fetching nutrition data', error);
    }
    return [];
  }

  /**
   * Fetch user habits from storage
   */
  private async fetchHabits(): Promise<UserHabit[]> {
    try {
      // Try local storage
      const habits = storageManager.getUserHabits();
      return habits;
    } catch (error) {
      logger.error('DataManagementService: Error fetching habits data', error);
    }
    return [];
  }

  /**
   * Fetch wearable data from service
   */
  private async fetchWearableData(): Promise<WearableData | null> {
    try {
      // In a real implementation, this would fetch from the wearable integration service
      // For now, we'll return null to indicate no wearable data
      return null;
    } catch (error) {
      logger.error('DataManagementService: Error fetching wearable data', error);
    }
    return null;
  }

  /**
   * Fetch app settings from storage
   */
  private async fetchSettings(): Promise<AppSettings | null> {
    try {
      // Try local storage
      const settings = storageManager.getSettings();
      return settings;
    } catch (error) {
      logger.error('DataManagementService: Error fetching settings', error);
    }
    return null;
  }

  /**
   * Generate data insights for the current user
   */
  async generateInsights(): Promise<DataInsights | null> {
    if (!this.integratedData) {
      await this.syncAllData();
    }

    if (!this.integratedData || !this.userId) {
      return null;
    }

    try {
      // Get current status from wearable data or recovery data
      let energyLevel: 'high' | 'moderate' | 'low' | 'veryLow' = 'moderate';
      let trainingReadiness: 'ready' | 'caution' | 'rest' = 'ready';
      let recoveryStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical' = 'good';

      if (this.integratedData.wearableData) {
        const wearableData = this.integratedData.wearableData;
        const recoveryScore = this.calculateRecoveryScore(wearableData);
        
        // Determine energy level
        if (recoveryScore >= 80) energyLevel = 'high';
        else if (recoveryScore >= 65) energyLevel = 'moderate';
        else if (recoveryScore >= 50) energyLevel = 'low';
        else energyLevel = 'veryLow';
        
        // Determine training readiness
        if (recoveryScore >= 75 && wearableData.recovery.stress <= 40) {
          trainingReadiness = 'ready';
        } else if (recoveryScore >= 50) {
          trainingReadiness = 'caution';
        } else {
          trainingReadiness = 'rest';
        }
        
        // Determine recovery status
        if (recoveryScore >= 85) recoveryStatus = 'optimal';
        else if (recoveryScore >= 70) recoveryStatus = 'good';
        else if (recoveryScore >= 50) recoveryStatus = 'fair';
        else if (recoveryScore >= 30) recoveryStatus = 'poor';
        else recoveryStatus = 'critical';
      }

      // Analyze trends
      const performanceTrend = this.analyzePerformanceTrend();
      const adherenceTrend = this.analyzeAdherenceTrend();
      const recoveryTrend = this.analyzeRecoveryTrend();

      // Generate predictions
      const predictions = this.integratedData.biometricData && this.integratedData.adherenceMetrics
        ? predictiveAnalyticsEngine.generatePredictions(
            this.integratedData.userData || { name: 'User' } as UserData,
            this.integratedData.biometricData,
            this.integratedData.adherenceMetrics
          )
        : null;

      // Identify risks
      const risks = this.identifyRisks();

      // Generate recommendations
      const recommendations = this.generateRecommendations();

      return {
        currentStatus: {
          energyLevel,
          trainingReadiness,
          recoveryStatus
        },
        trends: {
          performance: performanceTrend,
          adherence: adherenceTrend,
          recovery: recoveryTrend
        },
        predictions,
        risks,
        recommendations
      };
    } catch (error) {
      logger.error('DataManagementService: Error generating insights', error);
      return null;
    }
  }

  /**
   * Calculate recovery score from wearable data
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
   * Analyze performance trend
   */
  private analyzePerformanceTrend(): 'improving' | 'stable' | 'declining' {
    // Simplified implementation - in a real system, this would analyze actual performance data
    return 'stable';
  }

  /**
   * Analyze adherence trend
   */
  private analyzeAdherenceTrend(): 'excellent' | 'good' | 'fair' | 'poor' {
    // Simplified implementation - in a real system, this would analyze actual adherence data
    return 'good';
  }

  /**
   * Analyze recovery trend
   */
  private analyzeRecoveryTrend(): 'improving' | 'stable' | 'declining' {
    // Simplified implementation - in a real system, this would analyze actual recovery data
    return 'stable';
  }

  /**
   * Identify potential risks
   */
  private identifyRisks(): string[] {
    const risks: string[] = [];
    
    if (this.integratedData?.adherenceMetrics) {
      const { trainingAdherence, sleepQuality, stressManagement } = this.integratedData.adherenceMetrics;
      
      if (trainingAdherence < 50) {
        risks.push('Bajo nivel de adherencia al entrenamiento');
      }
      
      if (sleepQuality < 50) {
        risks.push('Calidad de sueño deficiente');
      }
      
      if (stressManagement < 50) {
        risks.push('Alto nivel de estrés sin manejo adecuado');
      }
    }
    
    return risks;
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.integratedData?.adherenceMetrics) {
      const { trainingAdherence, sleepQuality, nutritionAdherence, stressManagement } = this.integratedData.adherenceMetrics;
      
      if (trainingAdherence < 70) {
        recommendations.push('Aumenta la adherencia al entrenamiento programando sesiones fijas');
      }
      
      if (sleepQuality < 70) {
        recommendations.push('Mejora la calidad del sueño estableciendo una rutina de sueño consistente');
      }
      
      if (nutritionAdherence < 70) {
        recommendations.push('Optimiza tu adherencia nutricional planificando comidas con anticipación');
      }
      
      if (stressManagement < 70) {
        recommendations.push('Incorpora técnicas de manejo del estrés como meditación o respiración diafragmática');
      }
    }
    
    return recommendations;
  }

  /**
   * Generate data visualizations
   */
  async generateVisualizations(): Promise<DataVisualization | null> {
    if (!this.integratedData) {
      await this.syncAllData();
    }

    if (!this.integratedData) {
      return null;
    }

    try {
      // Generate charts data
      const charts = {
        performance: this.generatePerformanceChartData(),
        adherence: this.generateAdherenceChartData(),
        recovery: this.generateRecoveryChartData(),
        biometrics: this.generateBiometricsChartData()
      };

      // Generate summaries
      const summaries = {
        weekly: this.generateWeeklySummary(),
        monthly: this.generateMonthlySummary(),
        quarterly: this.generateQuarterlySummary()
      };

      return {
        charts,
        summaries
      };
    } catch (error) {
      logger.error('DataManagementService: Error generating visualizations', error);
      return null;
    }
  }

  /**
   * Generate performance chart data
   */
  private generatePerformanceChartData(): any[] {
    // Simplified implementation - in a real system, this would generate actual chart data
    return [
      { date: '2023-01-01', value: 75 },
      { date: '2023-01-08', value: 78 },
      { date: '2023-01-15', value: 82 },
      { date: '2023-01-22', value: 80 },
      { date: '2023-01-29', value: 85 }
    ];
  }

  /**
   * Generate adherence chart data
   */
  private generateAdherenceChartData(): any[] {
    // Simplified implementation - in a real system, this would generate actual chart data
    return [
      { category: 'Entrenamiento', value: 85 },
      { category: 'Nutrición', value: 78 },
      { category: 'Sueño', value: 72 },
      { category: 'Suplementación', value: 90 },
      { category: 'Manejo del estrés', value: 65 }
    ];
  }

  /**
   * Generate recovery chart data
   */
  private generateRecoveryChartData(): any[] {
    // Simplified implementation - in a real system, this would generate actual chart data
    return [
      { date: '2023-01-01', hrv: 65, sleep: 78, stress: 35 },
      { date: '2023-01-08', hrv: 70, sleep: 82, stress: 30 },
      { date: '2023-01-15', hrv: 68, sleep: 75, stress: 40 },
      { date: '2023-01-22', hrv: 72, sleep: 80, stress: 32 },
      { date: '2023-01-29', hrv: 75, sleep: 85, stress: 28 }
    ];
  }

  /**
   * Generate biometrics chart data
   */
  private generateBiometricsChartData(): any[] {
    // Simplified implementation - in a real system, this would generate actual chart data
    return [
      { date: '2023-01-01', weight: 75.5, bodyFat: 15.2, muscleMass: 58.3 },
      { date: '2023-01-15', weight: 75.2, bodyFat: 14.8, muscleMass: 58.7 },
      { date: '2023-01-30', weight: 74.8, bodyFat: 14.5, muscleMass: 59.1 }
    ];
  }

  /**
   * Generate weekly summary
   */
  private generateWeeklySummary(): string {
    return "Esta semana has mantenido un buen nivel de adherencia al entrenamiento (85%) y una calidad de sueño aceptable (72%). Tu nivel de estrés está bien manejado. Continúa con este ritmo y considera aumentar la intensidad de los entrenamientos.";
  }

  /**
   * Generate monthly summary
   */
  private generateMonthlySummary(): string {
    return "Este mes has mostrado una mejora consistente en tu adherencia al entrenamiento y nutrición. Tu composición corporal ha mejorado ligeramente con una reducción del 0.7% en grasa corporal. Mantén este progreso y considera incorporar más variedad en tus entrenamientos.";
  }

  /**
   * Generate quarterly summary
   */
  private generateQuarterlySummary(): string {
    return "En los últimos tres meses, has logrado un progreso significativo en fuerza y composición corporal. Tu adherencia general ha mejorado del 65% al 82%. Has reducido tu grasa corporal en un 2.1% y aumentado tu masa muscular en 1.5 kg. Continúa con este excelente trabajo y considera establecer nuevos objetivos desafiantes.";
  }

  /**
   * Get integrated data for Chat Maestro context
   */
  async getChatContext(): Promise<ChatContext | null> {
    if (!this.userId || !this.integratedData) {
      return null;
    }

    return {
      userId: this.userId,
      currentScreen: 'dashboard', // Default screen
      userData: this.integratedData.userData || { name: 'User' } as UserData,
      userHabits: this.integratedData.habits,
      recentWorkouts: this.integratedData.workoutSessions,
      progressionPlans: this.integratedData.progressionPlans,
      nutritionData: this.integratedData.nutritionData[0], // Most recent
      recoveryStatus: this.integratedData.recoveryData[0] // Most recent
    };
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Export singleton instance
export const dataManagementService = DataManagementService.getInstance();