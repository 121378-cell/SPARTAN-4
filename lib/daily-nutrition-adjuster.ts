import { nutritionService } from './nutrition-service';
import { wearableIntegrationService } from './wearable-integration-service';
import { biometricNutritionService } from './biometric-nutrition-service';
import { nutritionSynchronizationService } from './nutrition-synchronization-service';
import { storageManager } from './storage';
import type { DailyNutrition, UserHabit, WorkoutSession } from './types';
import type { WearableData } from './wearable-integration-service';

export class DailyNutritionAdjuster {
  private static instance: DailyNutritionAdjuster;

  static getInstance(): DailyNutritionAdjuster {
    if (!DailyNutritionAdjuster.instance) {
      DailyNutritionAdjuster.instance = new DailyNutritionAdjuster();
    }
    return DailyNutritionAdjuster.instance;
  }

  /**
   * Process daily adjustments based on performance and biomarker data
   */
  processDailyAdjustments(
    userId: string,
    date: Date,
    workoutSession: WorkoutSession | null,
    wearableData: WearableData | null
  ): DailyNutrition {
    // Start with base nutrition needs
    let nutritionData = nutritionService.getNutritionRecommendations(userId, date);
    
    // Apply adjustments based on available data
    if (workoutSession && wearableData) {
      // Synchronize nutrition with workout performance
      nutritionData = nutritionSynchronizationService.synchronizeNutritionWithWorkout(
        userId,
        workoutSession,
        wearableData
      );
      
      // Apply biometric-based personalization
      nutritionData = biometricNutritionService.generatePersonalizedNutrition(
        userId,
        date,
        wearableData
      );
    } else if (wearableData) {
      // Only biometric data available
      nutritionData = biometricNutritionService.generatePersonalizedNutrition(
        userId,
        date,
        wearableData
      );
    } else if (workoutSession) {
      // Only workout data available - use existing synchronization
      const mockWearableData = this.createMockWearableData();
      nutritionData = nutritionSynchronizationService.synchronizeNutritionWithWorkout(
        userId,
        workoutSession,
        mockWearableData
      );
    }
    
    // Apply final daily adjustments based on comprehensive analysis
    const adjustedNutrition = this.applyComprehensiveAdjustments(
      nutritionData,
      workoutSession,
      wearableData,
      userId
    );
    
    // Save final nutrition data
    storageManager.addDailyNutrition(adjustedNutrition);
    
    return adjustedNutrition;
  }

  /**
   * Apply comprehensive adjustments based on all available data
   */
  private applyComprehensiveAdjustments(
    nutritionData: DailyNutrition,
    workoutSession: WorkoutSession | null,
    wearableData: WearableData | null,
    userId: string
  ): DailyNutrition {
    const adjustedNutrients = { ...nutritionData.totalNutrients };
    const habit = nutritionService.initializeUserNutritionProfile(userId);
    
    // Comprehensive adjustment logic combining multiple factors
    if (workoutSession && wearableData) {
      // Both workout and biometric data available - perform integrated analysis
      const { recovery, vitals, sleep, performance } = wearableData;
      
      // Integrated macro adjustment based on workout type and recovery status
      const workoutVolume = this.calculateWorkoutVolume(workoutSession);
      const isStrengthTraining = workoutSession.notes?.includes('strength') ||
                                 workoutSession.notes?.includes('fuerza');
      const isEnduranceTraining = workoutSession.notes?.includes('endurance') ||
                                   workoutSession.notes?.includes('resistencia');
      
      // Recovery-status modulated macro adjustments
      if (recovery.hrv < 50) {
        // Poor recovery state
        if (isStrengthTraining) {
          // Prioritize protein for muscle repair despite high volume
          adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.3);
          adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 0.9);
          adjustedNutrients.fats = Math.round(adjustedNutrients.fats * 0.8);
        } else if (isEnduranceTraining) {
          // Reduce carbs to avoid overloading compromised system
          adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 0.8);
          adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.2);
        } else {
          // General training - conservative approach
          adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.2);
          adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 0.9);
          adjustedNutrients.fats = Math.round(adjustedNutrients.fats * 0.9);
        }
      } else if (recovery.hrv > 75) {
        // Excellent recovery state - can handle aggressive adjustments
        if (isStrengthTraining) {
          // Maximize muscle growth potential
          adjustedNutrients.calories = Math.round(adjustedNutrients.calories * 1.15);
          adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.1);
          adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 1.2);
        } else if (isEnduranceTraining) {
          // Optimize glycogen replenishment
          adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 1.25);
          adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.15);
        }
      }
      
      // Hydration strategy based on sweat rate estimation
      if (workoutSession.duration && workoutSession.duration > 60) {
        // Long duration workout - increase hydration focus
        const sweatRateModifier = workoutSession.duration / 60; // Per hour of exercise
        const baseHydrationBoost = 1.5;
        const totalHydrationBoost = baseHydrationBoost * sweatRateModifier;
        
        // Add hydration-focused ingredients to meals
        this.addHydrationIngredients(nutritionData.meals, totalHydrationBoost);
      }
      
      // Supplement recommendations based on combined data
      this.applySupplementRecommendations(
        nutritionData.meals,
        workoutSession,
        wearableData,
        habit
      );
    } else if (wearableData) {
      // Only biometric data available - focus on health optimization
      const { recovery, vitals, sleep, performance } = wearableData;
      
      // Preventive adjustments based on biomarkers
      if (vitals.glucose.timeInRange < 70) {
        // Prediabetes risk - implement preventive carbohydrate management
        adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 0.85);
        adjustedNutrients.fiber = Math.max(adjustedNutrients.fiber || 0, 40);
        
        // Add insulin-sensitizing ingredients
        this.addInsulinSensitizingIngredients(nutritionData.meals);
      }
      
      if (vitals.inflammation.score > 70) {
        // Chronic inflammation risk - anti-inflammatory protocol
        adjustedNutrients.micronutrients = {
          ...adjustedNutrients.micronutrients,
          omega3: 3000,
          curcumin: 1500,
          resveratrol: 200
        };
      }
      
      if (sleep.quality < 60) {
        // Insomnia risk - sleep optimization protocol
        adjustedNutrients.micronutrients = {
          ...adjustedNutrients.micronutrients,
          magnesium: 500,
          zinc: 40,
          vitaminB6: 15,
          ltryptophan: 1000
        };
      }
    } else if (workoutSession) {
      // Only workout data available - traditional sports nutrition approach
      const workoutVolume = this.calculateWorkoutVolume(workoutSession);
      const isHighVolume = workoutVolume > 6000;
      
      if (isHighVolume) {
        // High volume workout - prioritize recovery nutrition
        adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.2);
        adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 1.15);
      }
    }
    
    // Final adjustment: ensure minimum nutritional requirements
    this.ensureMinimumRequirements(adjustedNutrients);
    
    return {
      ...nutritionData,
      totalNutrients: adjustedNutrients,
      meals: nutritionData.meals,
      calorieExpenditure: nutritionData.calorieExpenditure,
      nutritionGoal: nutritionData.nutritionGoal
    };
  }
  
  /**
   * Calculate total workout volume (weight × reps across all sets)
   */
  private calculateWorkoutVolume(workoutSession: WorkoutSession): number {
    return workoutSession.exercises.reduce((totalVolume, exercise) => {
      const exerciseVolume = exercise.sets.reduce((exerciseVol, set) => {
        return exerciseVol + (set.weight || 0) * (set.reps || 0);
      }, 0);
      return totalVolume + exerciseVolume;
    }, 0);
  }
  
  /**
   * Add hydration-focused ingredients to meals based on hydration boost factor
   */
  private addHydrationIngredients(meals: any[], hydrationBoost: number): void {
    const baseIngredients = ['Agua', 'Agua de coco', 'Pepino', 'Sandía', 'Apio', 'Melón'];
    const ingredientsToAdd = [...baseIngredients];
    
    // Add additional hydrating ingredients based on boost factor
    if (hydrationBoost >= 2) {
      ingredientsToAdd.push('Naranja', 'Fresa', 'Toronja', 'Lechuga romana');
    }
    
    meals.forEach(meal => {
      if (meal.type === 'pre_workout' || meal.type === 'post_workout' || 
          meal.type === 'snack' || meal.type === 'lunch') {
        ingredientsToAdd.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Add supplement recommendations based on combined workout and biometric data
   */
  private applySupplementRecommendations(
    meals: any[],
    workoutSession: WorkoutSession,
    wearableData: WearableData,
    habit: UserHabit
  ): void {
    const { recovery, vitals, sleep, performance } = wearableData;
    const workoutVolume = this.calculateWorkoutVolume(workoutSession);
    const isStrengthTraining = workoutSession.notes?.includes('strength') ||
                               workoutSession.notes?.includes('fuerza');
    
    // Creatine recommendation for strength training with good recovery
    if (isStrengthTraining && recovery.hrv >= 50 && workoutVolume > 4000) {
      // Add creatine to post-workout meal
      const postWorkoutMeal = meals.find((meal: any) => meal.type === 'post_workout');
      if (postWorkoutMeal) {
        postWorkoutMeal.ingredients.push('Creatina monohidratada (5g)');
      }
    }
    
    // Beta-alanine recommendation for high-volume training
    if (workoutVolume > 7000) {
      // Add beta-alanine to pre-workout meal
      const preWorkoutMeal = meals.find((meal: any) => meal.type === 'pre_workout');
      if (preWorkoutMeal) {
        preWorkoutMeal.ingredients.push('Beta-alanina (3g)');
      }
    }
    
    // Omega-3 recommendation for high inflammation
    if (vitals.inflammation.score > 60) {
      // Add omega-3 to dinner
      const dinner = meals.find((meal: any) => meal.type === 'dinner');
      if (dinner) {
        dinner.ingredients.push('Aceite de pescado (1000mg EPA/DHA)');
      }
    }
    
    // Vitamin D recommendation for low sunlight exposure indicators
    if (performance.trainingReadiness < 70 && sleep.quality < 70) {
      // Likely low vitamin D - add to breakfast
      const breakfast = meals.find((meal: any) => meal.type === 'breakfast');
      if (breakfast) {
        breakfast.ingredients.push('Vitamina D3 (2000-5000 UI)');
      }
    }
    
    // Magnesium recommendation for poor sleep or high stress
    if (sleep.quality < 70 || recovery.stress > 60) {
      // Add magnesium to dinner or evening snack
      const targetMeal = meals.find((meal: any) => 
        meal.type === 'dinner' || (meal.type === 'snack' && meal.time > '18:00'));
      if (targetMeal) {
        targetMeal.ingredients.push('Magnesio (400mg)');
      }
    }
  }
  
  /**
   * Add insulin-sensitizing ingredients to meals
   */
  private addInsulinSensitizingIngredients(meals: any[]): void {
    const ingredients = ['Canela', 'Vinagre de manzana', 'Té verde', 'Espárragos', 'Brócoli'];
    
    meals.forEach(meal => {
      if (meal.type === 'breakfast' || meal.type === 'lunch' || meal.type === 'dinner') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Ensure minimum nutritional requirements are met
   */
  private ensureMinimumRequirements(nutrients: any): void {
    // Ensure minimum protein intake based on body weight
    // Assuming average user weight of 70kg if not available
    const minProtein = 140; // 2g/kg for 70kg person
    if (nutrients.protein < minProtein) {
      nutrients.protein = minProtein;
    }
    
    // Ensure minimum fiber intake
    if (!nutrients.fiber || nutrients.fiber < 25) {
      nutrients.fiber = 25;
    }
    
    // Ensure minimum omega-3 intake for general health
    if (!nutrients.micronutrients?.omega3 || nutrients.micronutrients.omega3 < 1000) {
      nutrients.micronutrients = {
        ...nutrients.micronutrients,
        omega3: 1000
      };
    }
  }
  
  /**
   * Create mock wearable data for cases where only workout data is available
   */
  private createMockWearableData(): any {
    return {
      recovery: {
        hrv: 60,
        restingHeartRate: 65,
        stress: 50,
        recoveryScore: 70
      },
      sleep: {
        quality: 75,
        duration: 480,
        deepSleep: 90,
        remSleep: 120
      },
      vitals: {
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
          pulse: 65
        },
        glucose: {
          current: 90,
          average24h: 95,
          timeInRange: 85,
          variability: 15
        },
        temperature: {
          body: 36.5,
          skin: 35.0,
          variance: 0.5
        },
        hydration: {
          level: 80,
          electrolytes: {
            sodium: 140,
            potassium: 4.5,
            magnesium: 2.5
          }
        },
        inflammation: {
          crp: 2.0,
          il6: 2.5,
          score: 40
        }
      },
      performance: {
        fitnessAge: 30,
        recoveryTime: 24,
        trainingReadiness: 75,
        metabolicEfficiency: 70,
        powerOutput: {
          ftp: 250,
          critical: 300,
          anaerobic: 500
        },
        cognitiveLoad: 50
      }
    };
  }
}

export const dailyNutritionAdjuster = DailyNutritionAdjuster.getInstance();