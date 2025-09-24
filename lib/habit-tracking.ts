import { storageManager } from './storage.ts';
import { recoveryService } from './recovery-service.ts';
import { loadProgressionService } from './load-progression-service.ts';
import type { UserHabit, WorkoutSession } from './types';

export class HabitTrackingService {
  private static instance: HabitTrackingService;
  
  static getInstance(): HabitTrackingService {
    if (!HabitTrackingService.instance) {
      HabitTrackingService.instance = new HabitTrackingService();
    }
    return HabitTrackingService.instance;
  }
  
  // Initialize user habit tracking
  initializeUserHabitTracking(userId: string): UserHabit {
    const habits = storageManager.getUserHabits();
    const existingHabit = habits.find(habit => habit.userId === userId);
    
    if (existingHabit) {
      return existingHabit;
    }
    
    const newUserHabit: UserHabit = {
      id: `habit_${userId}_${Date.now()}`,
      userId,
      preferredTrainingTimes: [],
      trainingFrequency: 0,
      lastTrainingSessions: [],
      averageTrainingDuration: 0,
      preferredTrainingDays: [],
      // Nutrition preferences
      preferredMealTimes: ['08:00', '13:00', '19:00'],
      preferredFoods: [],
      dislikedFoods: [],
      dietaryRestrictions: [],
      nutritionGoals: ['maintenance']
    };
    
    storageManager.addUserHabit(newUserHabit);
    return newUserHabit;
  }
  
  // Record a workout session
  recordWorkoutSession(session: WorkoutSession): void {
    storageManager.addWorkoutSession(session);
    this.updateUserHabits(session);
    
    // Record progression metrics
    loadProgressionService.recordProgressionMetrics(session);
  }
  
  // Update user habits based on workout session
  private updateUserHabits(session: WorkoutSession): void {
    const habits = storageManager.getUserHabits();
    const userId = 'default-user'; // In a real app, this would come from auth
    
    const userHabit = habits.find(habit => habit.userId === userId) || 
                     this.initializeUserHabitTracking(userId);
    
    // Update last training sessions (keep only last 10)
    userHabit.lastTrainingSessions.unshift(session.date);
    if (userHabit.lastTrainingSessions.length > 10) {
      userHabit.lastTrainingSessions = userHabit.lastTrainingSessions.slice(0, 10);
    }
    
    // Update training frequency
    userHabit.trainingFrequency = userHabit.lastTrainingSessions.length;
    
    // Update preferred training times
    if (session.startTime) {
      const time = session.startTime.toTimeString().substring(0, 5); // HH:MM format
      if (!userHabit.preferredTrainingTimes.includes(time)) {
        userHabit.preferredTrainingTimes.push(time);
      }
    }
    
    // Update preferred training days (0-6 for Sunday-Saturday)
    const day = session.date.getDay();
    if (!userHabit.preferredTrainingDays.includes(day)) {
      userHabit.preferredTrainingDays.push(day);
    }
    
    // Update average training duration
    if (session.duration) {
      const totalDuration = (userHabit.averageTrainingDuration * (userHabit.trainingFrequency - 1)) + session.duration;
      userHabit.averageTrainingDuration = totalDuration / userHabit.trainingFrequency;
    }
    
    // Save updated habits
    const updatedHabits = habits.map(habit => 
      habit.userId === userId ? userHabit : habit
    );
    storageManager.setUserHabits(updatedHabits);
  }
  
  // Get user habits
  getUserHabits(userId: string): UserHabit | undefined {
    const habits = storageManager.getUserHabits();
    return habits.find(habit => habit.userId === userId);
  }
  
  // Predict next training time based on habits
  predictNextTrainingTime(userId: string): Date | null {
    const habit = this.getUserHabits(userId);
    if (!habit || habit.preferredTrainingTimes.length === 0) {
      return null;
    }
    
    // Simple prediction: use the most common time
    const timeFrequency: Record<string, number> = {};
    habit.preferredTrainingTimes.forEach(time => {
      timeFrequency[time] = (timeFrequency[time] || 0) + 1;
    });
    
    const mostFrequentTime = Object.entries(timeFrequency)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    // Create a date for tomorrow with the predicted time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [hours, minutes] = mostFrequentTime.split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    return tomorrow;
  }
  
  // Get recommended training days
  getRecommendedTrainingDays(userId: string): number[] {
    const habit = this.getUserHabits(userId);
    return habit ? habit.preferredTrainingDays : [];
  }
  
  // Get average training duration
  getAverageTrainingDuration(userId: string): number {
    const habit = this.getUserHabits(userId);
    return habit ? habit.averageTrainingDuration : 0;
  }
  
  // Enhanced prediction with more sophisticated pattern recognition
  predictTrainingPatterns(userId: string): {
    nextLikelySession: Date | null;
    recommendedTimes: string[];
    recommendedDays: number[];
    averageDuration: number;
  } {
    const habit = this.getUserHabits(userId);
    
    if (!habit) {
      return {
        nextLikelySession: null,
        recommendedTimes: [],
        recommendedDays: [],
        averageDuration: 0
      };
    }
    
    // Analyze time patterns
    const timeFrequency: Record<string, number> = {};
    habit.preferredTrainingTimes.forEach(time => {
      timeFrequency[time] = (timeFrequency[time] || 0) + 1;
    });
    
    // Get top 3 most frequent times
    const recommendedTimes = Object.entries(timeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([time]) => time);
    
    // Analyze day patterns
    const dayFrequency: Record<number, number> = {};
    habit.preferredTrainingDays.forEach(day => {
      dayFrequency[day] = (dayFrequency[day] || 0) + 1;
    });
    
    // Get top 3 most frequent days
    const recommendedDays = Object.entries(dayFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => parseInt(day));
    
    // Predict next session based on most recent patterns
    let nextLikelySession: Date | null = null;
    if (recommendedTimes.length > 0 && recommendedDays.length > 0) {
      // Use the most frequent time and day
      const mostFrequentTime = recommendedTimes[0];
      const mostFrequentDay = recommendedDays[0];
      
      nextLikelySession = new Date();
      const today = nextLikelySession.getDay();
      
      // Calculate days until next occurrence of preferred day
      let daysUntil = mostFrequentDay - today;
      if (daysUntil <= 0) {
        daysUntil += 7; // Next week
      }
      
      nextLikelySession.setDate(nextLikelySession.getDate() + daysUntil);
      
      const [hours, minutes] = mostFrequentTime.split(':').map(Number);
      nextLikelySession.setHours(hours, minutes, 0, 0);
    }
    
    return {
      nextLikelySession,
      recommendedTimes,
      recommendedDays,
      averageDuration: habit.averageTrainingDuration
    };
  }
  
  // Generate personalized recommendations based on habits
  generateRecommendations(userId: string): {
    workoutReminders: string[];
    restRecommendations: string[];
    nutritionTips: string[];
  } {
    const habit = this.getUserHabits(userId);
    
    if (!habit) {
      return {
        workoutReminders: [],
        restRecommendations: [],
        nutritionTips: []
      };
    }
    
    const recommendations = {
      workoutReminders: [] as string[],
      restRecommendations: [] as string[],
      nutritionTips: [] as string[]
    };
    
    // Workout reminders based on preferred times
    habit.preferredTrainingTimes.forEach(time => {
      recommendations.workoutReminders.push(`Recordatorio: Entreno programado a las ${time}`);
    });
    
    // Rest recommendations based on training frequency
    if (habit.trainingFrequency >= 5) {
      recommendations.restRecommendations.push("Considera un día de descanso activo esta semana");
    } else if (habit.trainingFrequency <= 2) {
      recommendations.restRecommendations.push("Intenta aumentar la frecuencia de entrenamiento para mejores resultados");
    }
    
    // Add recovery-based rest recommendations
    const today = new Date();
    const recoveryAnalysis = recoveryService.getRecoveryAnalysis(userId, today);
    if (recoveryAnalysis) {
      if (recoveryAnalysis.fatigueLevel === 'extreme' || recoveryAnalysis.fatigueLevel === 'high') {
        recommendations.restRecommendations.push(`Nivel de fatiga: ${recoveryAnalysis.fatigueLevel}. Considera reducir la intensidad o tomar un día de descanso.`);
      }
      
      if (recoveryAnalysis.recoveryScore < 50) {
        recommendations.restRecommendations.push(`Puntaje de recuperación bajo (${recoveryAnalysis.recoveryScore}/100). Prioriza la recuperación.`);
      }
      
      // Add specific recovery recommendations
      recoveryAnalysis.recommendations.forEach(rec => {
        if (rec.priority === 'high') {
          recommendations.restRecommendations.push(rec.title + ": " + rec.description);
        }
      });
    }
    
    // Nutrition tips based on training times
    habit.preferredTrainingTimes.forEach(time => {
      const [hours] = time.split(':').map(Number);
      if (hours < 12) {
        recommendations.nutritionTips.push("Desayuna proteínas y carbohidratos complejos antes del entrenamiento matutino");
      } else if (hours >= 12 && hours < 17) {
        recommendations.nutritionTips.push("Come una comida ligera 1-2 horas antes del entrenamiento de tarde");
      } else {
        recommendations.nutritionTips.push("Evita entrenar con el estómago lleno por la noche");
      }
    });
    
    return recommendations;
  }
}

export const habitTrackingService = HabitTrackingService.getInstance();