import { storageManager } from './storage.ts';
import { habitTrackingService } from './habit-tracking.ts';
import type { 
  RecoveryMetric, 
  RecoveryAnalysis, 
  FatigueLevel, 
  RecoveryRecommendation,
  WorkoutSession,
  UserHabit
} from './types';

export class RecoveryService {
  private static instance: RecoveryService;
  
  static getInstance(): RecoveryService {
    if (!RecoveryService.instance) {
      RecoveryService.instance = new RecoveryService();
    }
    return RecoveryService.instance;
  }
  
  // Record subjective recovery metrics
  recordRecoveryMetrics(userId: string, metrics: Omit<RecoveryMetric, 'date'>): RecoveryMetric {
    const recoveryMetric: RecoveryMetric = {
      ...metrics,
      date: new Date()
    };
    
    storageManager.addRecoveryMetric(recoveryMetric);
    this.analyzeRecovery(userId, recoveryMetric.date);
    
    return recoveryMetric;
  }
  
  // Analyze recovery and fatigue levels
  analyzeRecovery(userId: string, date: Date): RecoveryAnalysis {
    // Get existing analysis for the date
    const existingAnalysis = storageManager.getRecoveryAnalysisForDate(date);
    if (existingAnalysis) {
      return existingAnalysis;
    }
    
    // Get recovery metrics for the past 7 days
    const recoveryMetrics = storageManager.getRecoveryMetrics();
    const recentMetrics = recoveryMetrics
      .filter(metric => {
        const metricDate = new Date(metric.date);
        const diffTime = Math.abs(date.getTime() - metricDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Get workout sessions for the past 7 days
    const workoutSessions = storageManager.getWorkoutSessions();
    const recentWorkouts = workoutSessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        const diffTime = Math.abs(date.getTime() - sessionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate fatigue level based on metrics and workouts
    const fatigueLevel = this.calculateFatigueLevel(recentMetrics, recentWorkouts);
    
    // Calculate recovery score (0-100)
    const recoveryScore = this.calculateRecoveryScore(recentMetrics, recentWorkouts);
    
    // Generate recommendations
    const recommendations = this.generateRecoveryRecommendations(fatigueLevel, recentMetrics, recentWorkouts);
    
    // Predict fatigue days
    const predictedFatigueDays = this.predictFatigueDays(userId, recentWorkouts, recentMetrics);
    
    // Suggest workout intensity
    const suggestedWorkoutIntensity = this.suggestWorkoutIntensity(fatigueLevel, recoveryScore);
    
    const analysis: RecoveryAnalysis = {
      date,
      fatigueLevel,
      recoveryScore,
      recommendations,
      predictedFatigueDays,
      suggestedWorkoutIntensity
    };
    
    storageManager.addRecoveryAnalysis(analysis);
    return analysis;
  }
  
  // Calculate fatigue level based on metrics and workouts
  private calculateFatigueLevel(
    metrics: RecoveryMetric[], 
    workouts: WorkoutSession[]
  ): FatigueLevel {
    if (metrics.length === 0 && workouts.length === 0) {
      return 'low';
    }
    
    // Calculate average metrics
    let totalEnergy = 0;
    let totalSoreness = 0;
    let totalSleep = 0;
    let totalStress = 0;
    let totalMotivation = 0;
    let metricCount = 0;
    
    metrics.forEach(metric => {
      totalEnergy += metric.energyLevel;
      totalSoreness += metric.muscleSoreness;
      totalSleep += metric.sleepQuality;
      totalStress += metric.stressLevel;
      totalMotivation += metric.motivation;
      metricCount++;
    });
    
    const avgEnergy = metricCount > 0 ? totalEnergy / metricCount : 7;
    const avgSoreness = metricCount > 0 ? totalSoreness / metricCount : 3;
    const avgSleep = metricCount > 0 ? totalSleep / metricCount : 7;
    const avgStress = metricCount > 0 ? totalStress / metricCount : 3;
    const avgMotivation = metricCount > 0 ? totalMotivation / metricCount : 7;
    
    // Calculate workout intensity factor
    let totalDuration = 0;
    let workoutCount = 0;
    
    workouts.forEach(workout => {
      if (workout.duration) {
        totalDuration += workout.duration;
        workoutCount++;
      }
    });
    
    const avgDuration = workoutCount > 0 ? totalDuration / workoutCount : 60;
    
    // Calculate fatigue score (0-10)
    // Lower energy, higher soreness, worse sleep, higher stress, lower motivation = higher fatigue
    const fatigueScore = (
      (10 - avgEnergy) + 
      avgSoreness + 
      (10 - avgSleep) + 
      avgStress + 
      (10 - avgMotivation) +
      (avgDuration > 90 ? 3 : avgDuration > 60 ? 2 : avgDuration > 30 ? 1 : 0)
    ) / (metricCount > 0 ? 6 : 4);
    
    if (fatigueScore >= 7) return 'extreme';
    if (fatigueScore >= 5) return 'high';
    if (fatigueScore >= 3) return 'moderate';
    return 'low';
  }
  
  // Calculate recovery score (0-100)
  private calculateRecoveryScore(
    metrics: RecoveryMetric[], 
    workouts: WorkoutSession[]
  ): number {
    if (metrics.length === 0) return 70; // Default score if no metrics
    
    // Calculate weighted average of metrics
    let totalScore = 0;
    let weightSum = 0;
    
    metrics.forEach(metric => {
      // Weight each metric (energy and sleep are more important)
      const energyWeight = 0.3;
      const sorenessWeight = 0.2;
      const sleepWeight = 0.3;
      const stressWeight = 0.1;
      const motivationWeight = 0.1;
      
      const metricScore = (
        metric.energyLevel * energyWeight * 10 + // Scale to 0-100
        (10 - metric.muscleSoreness) * sorenessWeight * 10 + // Invert soreness
        metric.sleepQuality * sleepWeight * 10 + // Scale to 0-100
        (10 - metric.stressLevel) * stressWeight * 10 + // Invert stress
        metric.motivation * motivationWeight * 10 // Scale to 0-100
      );
      
      totalScore += metricScore;
      weightSum += (energyWeight + sorenessWeight + sleepWeight + stressWeight + motivationWeight);
    });
    
    const avgScore = totalScore / metrics.length;
    
    // Adjust based on workout intensity
    const workoutAdjustment = this.calculateWorkoutAdjustment(workouts);
    
    const finalScore = Math.max(0, Math.min(100, avgScore + workoutAdjustment));
    return Math.round(finalScore);
  }
  
  // Calculate workout adjustment for recovery score
  private calculateWorkoutAdjustment(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 0;
    
    let totalDuration = 0;
    let highIntensityCount = 0;
    
    workouts.forEach(workout => {
      if (workout.duration) {
        totalDuration += workout.duration;
        // Consider workouts > 75 minutes as high intensity
        if (workout.duration > 75) {
          highIntensityCount++;
        }
      }
    });
    
    const avgDuration = totalDuration / workouts.length;
    
    // Negative adjustment for high intensity/duration
    let adjustment = 0;
    if (avgDuration > 90) adjustment = -15;
    else if (avgDuration > 75) adjustment = -10;
    else if (avgDuration > 60) adjustment = -5;
    
    adjustment -= highIntensityCount * 3; // Additional penalty for multiple high intensity sessions
    
    return adjustment;
  }
  
  // Generate recovery recommendations based on fatigue level
  private generateRecoveryRecommendations(
    fatigueLevel: FatigueLevel,
    metrics: RecoveryMetric[],
    workouts: WorkoutSession[]
  ): RecoveryRecommendation[] {
    const recommendations: RecoveryRecommendation[] = [];
    
    // Always add basic recommendations
    recommendations.push({
      type: 'stretching',
      title: 'Sesión de estiramientos',
      description: 'Dedica 10-15 minutos a estirar los grupos musculares principales',
      duration: '10-15 minutos',
      priority: 'medium'
    });
    
    recommendations.push({
      type: 'mobility',
      title: 'Trabajo de movilidad',
      description: 'Realiza ejercicios de movilidad articular para mejorar la flexibilidad',
      duration: '15-20 minutos',
      priority: 'medium'
    });
    
    // Add fatigue-specific recommendations
    switch (fatigueLevel) {
      case 'extreme':
        recommendations.push({
          type: 'rest',
          title: 'Día de descanso completo',
          description: 'Tu cuerpo necesita recuperarse completamente. Evita el entrenamiento intenso',
          priority: 'high'
        });
        
        recommendations.push({
          type: 'nap',
          title: 'Siesta rejuvenecedora',
          description: 'Una siesta de 20-30 minutos puede ayudar a restaurar tu energía',
          duration: '20-30 minutos',
          priority: 'high'
        });
        
        recommendations.push({
          type: 'sauna',
          title: 'Sesión de sauna',
          description: 'La sauna puede ayudar a relajar los músculos y mejorar la circulación',
          duration: '15-20 minutos',
          priority: 'medium'
        });
        break;
        
      case 'high':
        recommendations.push({
          type: 'active_recovery',
          title: 'Entrenamiento de recuperación activa',
          description: 'Realiza ejercicio de baja intensidad como caminar o nadar suavemente',
          intensity: 'low',
          priority: 'high'
        });
        
        recommendations.push({
          type: 'massage',
          title: 'Masaje relajante',
          description: 'Un masaje puede ayudar a aliviar la tensión muscular y mejorar la recuperación',
          priority: 'medium'
        });
        break;
        
      case 'moderate':
        recommendations.push({
          type: 'light_training',
          title: 'Entrenamiento ligero',
          description: 'Puedes entrenar pero reduce la intensidad y volumen',
          intensity: 'low',
          priority: 'medium'
        });
        break;
        
      case 'low':
        // No special recommendations needed
        break;
    }
    
    // Add sleep recommendations if sleep quality is poor
    const recentMetrics = metrics.slice(0, 3); // Last 3 metrics
    if (recentMetrics.length > 0) {
      const avgSleep = recentMetrics.reduce((sum, m) => sum + m.sleepQuality, 0) / recentMetrics.length;
      if (avgSleep < 6) {
        recommendations.push({
          type: 'rest',
          title: 'Prioriza el sueño',
          description: 'Intenta dormir 7-9 horas para una mejor recuperación',
          priority: 'high'
        });
      }
    }
    
    return recommendations;
  }
  
  // Predict days with accumulated fatigue
  private predictFatigueDays(
    userId: string,
    workouts: WorkoutSession[],
    metrics: RecoveryMetric[]
  ): Date[] {
    const fatigueDays: Date[] = [];
    
    // Get user habits for training patterns
    const userHabit = habitTrackingService.getUserHabits(userId);
    if (!userHabit) return fatigueDays;
    
    // Predict next 7 days
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      // Check if this is a typical training day
      const dayOfWeek = futureDate.getDay();
      if (userHabit.preferredTrainingDays.includes(dayOfWeek)) {
        // Check if there's been high training frequency recently
        const recentWorkoutsCount = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          const diffTime = Math.abs(futureDate.getTime() - workoutDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 3; // Last 3 days
        }).length;
        
        // If 3+ workouts in last 3 days, likely fatigue day
        if (recentWorkoutsCount >= 3) {
          fatigueDays.push(futureDate);
        }
      }
    }
    
    return fatigueDays;
  }
  
  // Suggest workout intensity based on fatigue level and recovery score
  private suggestWorkoutIntensity(
    fatigueLevel: FatigueLevel,
    recoveryScore: number
  ): 'low' | 'moderate' | 'high' | 'rest' {
    // If recovery score is very low, suggest rest regardless of fatigue level
    if (recoveryScore < 30) return 'rest';
    if (recoveryScore < 50) return 'low';
    if (recoveryScore < 70) return 'moderate';
    
    // Adjust based on fatigue level
    switch (fatigueLevel) {
      case 'extreme': return 'rest';
      case 'high': return 'low';
      case 'moderate': return 'moderate';
      case 'low': return 'high';
      default: return 'moderate';
    }
  }
  
  // Get recovery analysis for a specific date
  getRecoveryAnalysis(userId: string, date: Date): RecoveryAnalysis | null {
    const existingAnalysis = storageManager.getRecoveryAnalysisForDate(date);
    if (existingAnalysis) {
      return existingAnalysis;
    }
    
    // Generate new analysis
    return this.analyzeRecovery(userId, date);
  }
  
  // Get recent recovery analyses
  getRecentRecoveryAnalyses(days: number = 7): RecoveryAnalysis[] {
    const analyses = storageManager.getRecoveryAnalyses();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return analyses
      .filter(analysis => new Date(analysis.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const recoveryService = RecoveryService.getInstance();