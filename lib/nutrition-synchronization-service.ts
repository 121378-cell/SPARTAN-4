import { nutritionService } from './nutrition-service';
import { wearableIntegrationService } from './wearable-integration-service';
import { storageManager } from './storage';
import type { DailyNutrition, UserHabit, WorkoutSession } from './types';

export class NutritionSynchronizationService {
  private static instance: NutritionSynchronizationService;

  static getInstance(): NutritionSynchronizationService {
    if (!NutritionSynchronizationService.instance) {
      NutritionSynchronizationService.instance = new NutritionSynchronizationService();
    }
    return NutritionSynchronizationService.instance;
  }

  /**
   * Synchronize nutrition plan with workout routine based on performance metrics
   */
  synchronizeNutritionWithWorkout(
    userId: string,
    workoutSession: WorkoutSession,
    wearableData: any
  ): DailyNutrition {
    // Get existing nutrition data for the day
    const date = workoutSession.date;
    const existingNutrition = storageManager.getNutritionForDate(date);
    
    // If no existing nutrition data, create a new one
    let nutritionData = existingNutrition || nutritionService.calculateDailyNutritionNeeds(userId, date);
    
    // Adjust nutrition based on workout performance and biometric data
    const adjustedNutrition = this.adjustNutritionForWorkout(
      nutritionData,
      workoutSession,
      wearableData
    );
    
    // Save updated nutrition data
    storageManager.addDailyNutrition(adjustedNutrition);
    
    return adjustedNutrition;
  }

  /**
   * Adjust nutrition based on workout performance and biometric data
   */
  private adjustNutritionForWorkout(
    nutritionData: DailyNutrition,
    workoutSession: WorkoutSession,
    wearableData: any
  ): DailyNutrition {
    const { recovery, vitals } = wearableData;
    const adjustedNutrients = { ...nutritionData.totalNutrients };
    
    // Adjust macros based on workout intensity and volume
    if (workoutSession.exercises && workoutSession.exercises.length > 0) {
      const totalVolume = workoutSession.exercises.reduce((acc, exercise) => {
        const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
          return setAcc + (set.weight || 0) * (set.reps || 0);
        }, 0);
        return acc + exerciseVolume;
      }, 0);
      
      // Increase protein for high volume workouts
      if (totalVolume > 5000) { // Threshold for high volume
        adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.15); // 15% increase
      }
      
      // Increase carbs for endurance-focused workouts
      if (workoutSession.notes?.includes('endurance') || totalVolume > 7000) {
        adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 1.2); // 20% increase
      }
    }
    
    // Adjust based on HRV (recovery status)
    if (recovery.hrv < 50) {
      // Low HRV indicates poor recovery - increase protein for muscle repair
      adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.2);
      // Reduce fats slightly to improve digestion
      adjustedNutrients.fats = Math.round(adjustedNutrients.fats * 0.9);
    }
    
    // Adjust based on glucose levels
    if (vitals.glucose.timeInRange < 70) {
      // Poor glucose control - focus on complex carbs and fiber
      adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 0.8);
      // Add fiber information if not present
      if (!adjustedNutrients.fiber) {
        adjustedNutrients.fiber = 30; // grams
      }
    }
    
    // Adjust based on hydration levels
    if (vitals.hydration.level < 75) {
      // Dehydration risk - increase water-rich foods and electrolytes
      // Add hydration focus to meal ingredients
      nutritionData.meals.forEach(meal => {
        if (meal.type === 'post_workout' || meal.type === 'snack') {
          meal.ingredients.push('Agua', 'Cocos naturales', 'Verduras de hoja verde');
        }
      });
    }
    
    // Create updated nutrition data object
    return {
      ...nutritionData,
      totalNutrients: adjustedNutrients,
      meals: nutritionData.meals,
      calorieExpenditure: nutritionData.calorieExpenditure,
      nutritionGoal: nutritionData.nutritionGoal
    };
  }
}

export const nutritionSynchronizationService = NutritionSynchronizationService.getInstance();