import { nutritionService } from './nutrition-service';
import { wearableIntegrationService } from './wearable-integration-service';
import { storageManager } from './storage';
import type { DailyNutrition, UserHabit, WearableData } from './types';

export class BiometricNutritionService {
  private static instance: BiometricNutritionService;

  static getInstance(): BiometricNutritionService {
    if (!BiometricNutritionService.instance) {
      BiometricNutritionService.instance = new BiometricNutritionService();
    }
    return BiometricNutritionService.instance;
  }

  /**
   * Generate personalized nutrition suggestions based on biometric data
   */
  generatePersonalizedNutrition(
    userId: string,
    date: Date,
    wearableData: WearableData
  ): DailyNutrition {
    // Get base nutrition needs
    let nutritionData = nutritionService.getNutritionRecommendations(userId, date);
    
    // Apply biometric-based adjustments
    const adjustedNutrition = this.applyBiometricAdjustments(
      nutritionData,
      wearableData,
      userId
    );
    
    // Save updated nutrition data
    storageManager.addDailyNutrition(adjustedNutrition);
    
    return adjustedNutrition;
  }

  /**
   * Apply adjustments to nutrition plan based on biometric data
   */
  private applyBiometricAdjustments(
    nutritionData: DailyNutrition,
    wearableData: WearableData,
    userId: string
  ): DailyNutrition {
    const { recovery, vitals, sleep, performance } = wearableData;
    const habit = nutritionService.initializeUserNutritionProfile(userId);
    const adjustedNutrients = { ...nutritionData.totalNutrients };
    
    // HRV-based adjustments (recovery status)
    if (recovery.hrv < 50) {
      // Poor recovery - increase protein for muscle repair and reduce fats for easier digestion
      adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.25); // 25% increase
      adjustedNutrients.fats = Math.round(adjustedNutrients.fats * 0.85); // 15% decrease
      
      // Add recovery-focused ingredients to meals
      this.addRecoveryIngredients(nutritionData.meals, ['Proteína en polvo', 'Omega-3', 'Cúrcuma']);
    } else if (recovery.hrv > 75) {
      // Excellent recovery - can handle higher volume, adjust for training goals
      const goal = habit.nutritionGoals[0];
      if (goal === 'muscle_mass') {
        adjustedNutrients.calories = Math.round(adjustedNutrients.calories * 1.1);
        adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 1.15);
      }
    }
    
    // Sleep quality adjustments
    if (sleep.quality < 60) {
      // Poor sleep - focus on sleep-supportive nutrients
      adjustedNutrients.micronutrients = {
        ...adjustedNutrients.micronutrients,
        magnesium: 400, // mg - supports sleep quality
        zinc: 30, // mg - supports immune function
        vitaminB6: 10 // mg - supports neurotransmitter production
      };
      
      // Add sleep-supportive ingredients
      this.addSleepSupportIngredients(nutritionData.meals, ['Leche caliente', 'Almendras', 'Plátano', 'Avena']);
    }
    
    // Glucose metabolism adjustments
    if (vitals.glucose.timeInRange < 70) {
      // Poor glucose control - adjust carb quality and timing
      adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 0.9); // Reduce total carbs
      adjustedNutrients.fiber = Math.max(adjustedNutrients.fiber || 0, 35); // Increase fiber
      
      // Focus on low-glycemic foods
      this.focusOnLowGlycemicFoods(nutritionData.meals);
    }
    
    // Hydration adjustments
    if (vitals.hydration.level < 75) {
      // Dehydration risk - increase water-rich foods and electrolytes
      adjustedNutrients.micronutrients = {
        ...adjustedNutrients.micronutrients,
        sodium: 2300, // mg - maintain electrolyte balance
        potassium: 4700 // mg - supports hydration
      };
      
      // Add hydrating ingredients
      this.addHydratingIngredients(nutritionData.meals, ['Agua de coco', 'Pepino', 'Sandía', 'Apio']);
    }
    
    // Inflammation adjustments
    if (vitals.inflammation.score > 70) {
      // High inflammation - anti-inflammatory focus
      adjustedNutrients.micronutrients = {
        ...adjustedNutrients.micronutrients,
        omega3: 2000, // mg - anti-inflammatory
        curcumin: 1000 // mg - anti-inflammatory
      };
      
      // Add anti-inflammatory ingredients
      this.addAntiInflammatoryIngredients(nutritionData.meals, ['Salmón', 'Nueces', 'Arándanos', 'Cúrcuma']);
    }
    
    // Stress level adjustments
    if (recovery.stress > 70) {
      // High stress - adaptogenic and calming nutrients
      adjustedNutrients.micronutrients = {
        ...adjustedNutrients.micronutrients,
        ashwagandha: 500, // mg - adaptogen
        rhodiola: 300, // mg - adaptogen
        ltheanine: 200 // mg - calming amino acid
      };
      
      // Add stress-reducing ingredients
      this.addStressReducingIngredients(nutritionData.meals, ['Té verde', 'Cacao negro', 'Semillas de chía', 'Frutos secos']);
    }
    
    // Training readiness adjustments
    if (performance.trainingReadiness < 60) {
      // Low readiness - focus on recovery and energy restoration
      adjustedNutrients.carbs = Math.round(adjustedNutrients.carbs * 1.1); // Increase carbs for energy
      adjustedNutrients.protein = Math.round(adjustedNutrients.protein * 1.1); // Increase protein for repair
      
      // Add energy-restoring ingredients
      this.addEnergyRestoringIngredients(nutritionData.meals, ['Dátiles', 'Miel', 'Frutas tropicales', 'Arroz integral']);
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
  
  /**
   * Add recovery-focused ingredients to meals
   */
  private addRecoveryIngredients(meals: any[], ingredients: string[]): void {
    meals.forEach(meal => {
      if (meal.type === 'post_workout' || meal.type === 'dinner' || meal.type === 'snack') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Add sleep-supportive ingredients to meals
   */
  private addSleepSupportIngredients(meals: any[], ingredients: string[]): void {
    meals.forEach(meal => {
      if (meal.type === 'dinner' || meal.type === 'snack') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Modify meals to focus on low-glycemic foods
   */
  private focusOnLowGlycemicFoods(meals: any[]): void {
    meals.forEach(meal => {
      // Replace high-glycemic ingredients with low-glycemic alternatives
      const replacements: Record<string, string> = {
        'Pan blanco': 'Pan de masa fermentada',
        'Arroz blanco': 'Quinoa',
        'Papas': 'Batata',
        'Maíz': 'Chirivía',
        'Melocotón enlatado': 'Manzana fresca'
      };
      
      meal.ingredients = meal.ingredients.map((ingredient: string) => 
        replacements[ingredient] || ingredient
      );
    });
  }
  
  /**
   * Add hydrating ingredients to meals
   */
  private addHydratingIngredients(meals: any[], ingredients: string[]): void {
    meals.forEach(meal => {
      if (meal.type === 'snack' || meal.type === 'lunch' || meal.type === 'pre_workout') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Add anti-inflammatory ingredients to meals
   */
  private addAntiInflammatoryIngredients(meals: any[], ingredients: string[]): void {
    meals.forEach(meal => {
      if (meal.type === 'lunch' || meal.type === 'dinner' || meal.type === 'snack') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Add stress-reducing ingredients to meals
   */
  private addStressReducingIngredients(meals: any[], ingredients: string[]): void {
    meals.forEach(meal => {
      if (meal.type === 'breakfast' || meal.type === 'snack' || meal.type === 'dinner') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
  
  /**
   * Add energy-restoring ingredients to meals
   */
  private addEnergyRestoringIngredients(meals: any[], ingredients: string[]): void {
    meals.forEach(meal => {
      if (meal.type === 'breakfast' || meal.type === 'lunch' || meal.type === 'snack') {
        ingredients.forEach(ingredient => {
          if (!meal.ingredients.includes(ingredient)) {
            meal.ingredients.push(ingredient);
          }
        });
      }
    });
  }
}

export const biometricNutritionService = BiometricNutritionService.getInstance();