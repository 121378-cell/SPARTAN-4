import { habitTrackingService } from './habit-tracking';
import type { UserHabit } from './types';

export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  // Schedule workout reminders based on user habits
  scheduleWorkoutReminders(userId: string): void {
    const habit = habitTrackingService.getUserHabits(userId);
    if (!habit) return;
    
    // In a real implementation, this would integrate with the browser's Notification API
    // or a backend notification service
    console.log('Scheduling workout reminders for user:', userId);
    
    // For demo purposes, we'll just log the reminders
    habit.preferredTrainingTimes.forEach(time => {
      console.log(`Scheduled reminder for ${time}`);
    });
  }
  
  // Generate contextual notifications
  generateContextualNotifications(userId: string): string[] {
    const habit = habitTrackingService.getUserHabits(userId);
    if (!habit) return [];
    
    const notifications: string[] = [];
    
    // Check if user hasn't trained in a while
    if (habit.lastTrainingSessions.length > 0) {
      const lastSession = new Date(Math.max(...habit.lastTrainingSessions.map(date => new Date(date).getTime())));
      const daysSinceLastSession = Math.floor((Date.now() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastSession > 3) {
        notifications.push('¡Hace varios días que no entrenas! ¿Listo para volver a la acción?');
      }
    }
    
    // Check training frequency
    if (habit.trainingFrequency < 3) {
      notifications.push('Intenta aumentar tu frecuencia de entrenamiento para mejores resultados');
    } else if (habit.trainingFrequency > 5) {
      notifications.push('¡Excelente frecuencia de entrenamiento! Recuerda incluir días de descanso');
    }
    
    // Check training duration consistency
    if (habit.averageTrainingDuration > 0) {
      // This would compare with planned durations
      notifications.push(`Duración promedio de entrenamiento: ${Math.round(habit.averageTrainingDuration)} minutos`);
    }
    
    return notifications;
  }
  
  // Send nutrition recommendations based on training schedule
  sendNutritionRecommendations(userId: string): void {
    const habit = habitTrackingService.getUserHabits(userId);
    if (!habit) return;
    
    // In a real implementation, this would send notifications or update the UI
    console.log('Sending nutrition recommendations based on training schedule');
    
    habit.preferredTrainingTimes.forEach(time => {
      const [hours] = time.split(':').map(Number);
      
      if (hours < 12) {
        console.log('Recommendation: Consume protein and complex carbs before morning training');
      } else if (hours >= 12 && hours < 17) {
        console.log('Recommendation: Eat a light meal 1-2 hours before afternoon training');
      } else {
        console.log('Recommendation: Avoid training on a full stomach in the evening');
      }
    });
  }
  
  // Send rest and recovery recommendations
  sendRecoveryRecommendations(userId: string): void {
    const habit = habitTrackingService.getUserHabits(userId);
    if (!habit) return;
    
    console.log('Sending recovery recommendations');
    
    // Based on training frequency
    if (habit.trainingFrequency >= 5) {
      console.log('Recommendation: Consider an active rest day this week');
    }
    
    // Based on training duration
    if (habit.averageTrainingDuration > 90) {
      console.log('Recommendation: Ensure adequate sleep and hydration for long training sessions');
    }
  }
}

export const notificationService = NotificationService.getInstance();