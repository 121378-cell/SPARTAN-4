/**
 * Adaptive Nutrition AI System
 * Real-time meal planning with dynamic macro adjustments
 */

export interface AdaptiveNutritionProfile {
  id: string;
  baseCalories: number;
  goals: NutritionGoal[];
  restrictions: string[];
  preferences: FoodPreference;
  mealTiming: MealTiming;
}

export interface NutritionGoal {
  type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
  priority: number;
  targetMacros: MacroTargets;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface FoodPreference {
  cuisine: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  mealComplexity: 'simple' | 'moderate' | 'complex';
  prepTime: number;
}

export interface MealTiming {
  mealsPerDay: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  preworkout: number; // minutes before
  postworkout: number; // minutes after
  chronotype: 'morning' | 'intermediate' | 'evening';
  sleepSchedule: {
    bedtime: string;
    wakeup: string;
    duration: number;
  };
  circadianProfile: {
    cortisolPeak: string;
    insulinSensitivityPeak: string;
    metabolicWindow: string;
    digestiveOptimal: string[];
  };
}

export interface CircadianMealPlan extends AdaptiveMealPlan {
  chronotype: 'morning' | 'intermediate' | 'evening';
  circadianOptimization: {
    cortisolSyncMeals: AdaptiveMeal[];
    insulinOptimizedMeals: AdaptiveMeal[];
    metabolicWindowMeals: AdaptiveMeal[];
    recoveryMeals: AdaptiveMeal[];
  };
  performanceMetrics: {
    energyAlignment: number; // 0-100
    recoveryOptimization: number; // 0-100
    metabolicEfficiency: number; // 0-100
  };
}

export interface AdaptiveMealPlan {
  id: string;
  date: Date;
  totalMacros: MacroTargets;
  meals: AdaptiveMeal[];
  shoppingList: ShoppingList;
  adaptations: PlanAdaptation[];
}

export interface AdaptiveMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  name: string;
  time: string;
  recipes: SmartRecipe[];
  macros: MacroTargets;
  alternatives: SmartRecipe[];
}

export interface SmartRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: SmartIngredient[];
  instructions: string[];
  macros: MacroTargets;
  prepTime: number;
  cookTime: number;
  servings: number;
  adaptable: boolean;
}

export interface SmartIngredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
  macrosPer100g: MacroTargets;
  available: boolean;
  cost: number;
  substitutes: string[];
}

export interface ShoppingList {
  items: ShoppingItem[];
  totalCost: number;
  categories: ShoppingCategory[];
  optimizedRoute: string[];
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  cost: number;
  substitutes: string[];
}

export interface ShoppingCategory {
  name: string;
  items: string[];
  estimatedTime: number;
}

export interface ActivityData {
  type: string;
  duration: number;
  intensity: 'low' | 'moderate' | 'high' | 'very_high';
  caloriesBurned: number;
  timestamp: Date;
}

export interface PlanAdaptation {
  timestamp: Date;
  trigger: string;
  type: 'macro_adjustment' | 'meal_substitution' | 'ingredient_swap';
  changes: any;
  reason: string;
}

export class AdaptiveNutritionAI {
  private profile: AdaptiveNutritionProfile | null = null;
  private currentPlan: AdaptiveMealPlan | null = null;
  private activityHistory: ActivityData[] = [];
  private foodDatabase: Map<string, SmartIngredient> = new Map();

  constructor() {
    this.initializeFoodDatabase();
  }

  /**
   * Create nutrition profile
   */
  public createProfile(userData: any, goals: NutritionGoal[]): AdaptiveNutritionProfile {
    const baseCalories = this.calculateBaseCalories(userData);
    
    const profile: AdaptiveNutritionProfile = {
      id: `profile_${Date.now()}`,
      baseCalories,
      goals,
      restrictions: [],
      preferences: {
        cuisine: ['mediterranean', 'healthy'],
        dietaryRestrictions: [],
        allergies: [],
        mealComplexity: 'moderate',
        prepTime: 30
      },
      mealTiming: {
        mealsPerDay: 4,
        breakfast: '08:00',
        lunch: '13:00',
        dinner: '19:00',
        preworkout: 60,
        postworkout: 30,
        chronotype: 'intermediate', // Default, will be updated
        sleepSchedule: {
          bedtime: '22:30',
          wakeup: '06:30',
          duration: 8
        },
        circadianProfile: {
          cortisolPeak: '07:00-09:00',
          insulinSensitivityPeak: '08:00-12:00',
          metabolicWindow: '07:00-15:00',
          digestiveOptimal: ['07:00-10:00', '13:00-16:00', '18:00-20:00']
        }
      }
    };

    this.profile = profile;
    return profile;
  }

  /**
   * Generate adaptive meal plan
   */
  public async generatePlan(date: Date = new Date()): Promise<AdaptiveMealPlan> {
    if (!this.profile) throw new Error('Profile not created');

    const macros = this.calculateDailyMacros();
    const meals = await this.generateMeals(macros);
    const shoppingList = this.generateShoppingList(meals);

    const plan: AdaptiveMealPlan = {
      id: `plan_${Date.now()}`,
      date,
      totalMacros: macros,
      meals,
      shoppingList,
      adaptations: []
    };

    this.currentPlan = plan;
    return plan;
  }

  /**
   * Adapt plan to activity
   */
  public adaptToActivity(activity: ActivityData): AdaptiveMealPlan {
    if (!this.currentPlan) throw new Error('No plan to adapt');

    this.activityHistory.push(activity);
    
    const additionalCalories = Math.round(activity.caloriesBurned * 0.5);
    const macroAdjustment = this.calculateMacroAdjustment(activity, additionalCalories);

    // Find post-workout meal to adjust
    const postWorkoutMeal = this.findPostWorkoutMeal(activity.timestamp);
    if (postWorkoutMeal) {
      postWorkoutMeal.macros.calories += additionalCalories;
      postWorkoutMeal.macros.protein += macroAdjustment.protein;
      postWorkoutMeal.macros.carbs += macroAdjustment.carbs;
    }

    const adaptation: PlanAdaptation = {
      timestamp: new Date(),
      trigger: `${activity.type} activity`,
      type: 'macro_adjustment',
      changes: { additionalCalories, macroAdjustment },
      reason: `Burned ${activity.caloriesBurned} calories`
    };

    this.currentPlan.adaptations.push(adaptation);
    this.currentPlan.totalMacros.calories += additionalCalories;

    return this.currentPlan;
  }

  /**
   * Adapt to ingredient availability
   */
  public adaptToAvailability(unavailableIngredients: string[]): AdaptiveMealPlan {
    if (!this.currentPlan) throw new Error('No plan to adapt');

    this.currentPlan.meals.forEach(meal => {
      meal.recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          if (unavailableIngredients.includes(ingredient.name)) {
            const substitute = this.findSubstitute(ingredient);
            if (substitute) {
              ingredient.name = substitute.name;
              ingredient.macrosPer100g = substitute.macrosPer100g;
            }
          }
        });
      });
    });

    const adaptation: PlanAdaptation = {
      timestamp: new Date(),
      trigger: 'Ingredient availability',
      type: 'ingredient_swap',
      changes: unavailableIngredients,
      reason: 'Ingredients not available'
    };

    this.currentPlan.adaptations.push(adaptation);
    this.currentPlan.shoppingList = this.generateShoppingList(this.currentPlan.meals);

    return this.currentPlan;
  }

  /**
   * Get real-time recommendations
   */
  public getRecommendations(): string[] {
    const recommendations: string[] = [];
    const now = new Date();
    
    if (this.currentPlan) {
      const nextMeal = this.getNextMeal();
      if (nextMeal) {
        recommendations.push(`⏰ Próxima comida: ${nextMeal.name} a las ${nextMeal.time}`);
      }
    }

    // Recent activity recommendations
    const recentActivity = this.activityHistory[this.activityHistory.length - 1];
    if (recentActivity && this.isRecent(recentActivity.timestamp, 120)) {
      recommendations.push('🏃‍♂️ Post-entreno: Consume proteína y carbohidratos en 30-60 minutos');
    }

    recommendations.push('💧 Mantente hidratado: 200ml cada hora');
    recommendations.push('🥗 Varía tus fuentes de proteína a lo largo del día');

    return recommendations;
  }

  private calculateBaseCalories(userData: any): number {
    // Harris-Benedict equation
    const { age, weight, height, fitnessLevel } = userData;
    let bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    
    const activityMultipliers = {
      'beginner': 1.375,
      'intermediate': 1.55,
      'advanced': 1.725
    };

    return Math.round(bmr * (activityMultipliers[fitnessLevel as keyof typeof activityMultipliers] || 1.375));
  }

  private calculateDailyMacros(): MacroTargets {
    if (!this.profile) throw new Error('Profile not set');

    const calories = this.profile.baseCalories;
    const primaryGoal = this.profile.goals[0];

    let proteinRatio = 0.25, carbRatio = 0.45, fatRatio = 0.30;

    switch (primaryGoal?.type) {
      case 'muscle_gain':
        proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30;
        break;
      case 'weight_loss':
        proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
        break;
      case 'performance':
        proteinRatio = 0.25; carbRatio = 0.50; fatRatio = 0.25;
        break;
    }

    return {
      calories,
      protein: Math.round((calories * proteinRatio) / 4),
      carbs: Math.round((calories * carbRatio) / 4),
      fats: Math.round((calories * fatRatio) / 9),
      fiber: Math.round(calories / 80)
    };
  }

  private async generateMeals(dailyMacros: MacroTargets): Promise<AdaptiveMeal[]> {
    const mealDistribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };

    const meals: AdaptiveMeal[] = [];

    for (const [type, ratio] of Object.entries(mealDistribution)) {
      const mealMacros: MacroTargets = {
        calories: Math.round(dailyMacros.calories * ratio),
        protein: Math.round(dailyMacros.protein * ratio),
        carbs: Math.round(dailyMacros.carbs * ratio),
        fats: Math.round(dailyMacros.fats * ratio),
        fiber: Math.round(dailyMacros.fiber * ratio)
      };

      const recipes = this.generateRecipesForMeal(type, mealMacros);
      
      meals.push({
        id: `meal_${type}_${Date.now()}`,
        type: type as any,
        name: this.getMealName(type),
        time: this.getMealTime(type),
        recipes,
        macros: mealMacros,
        alternatives: []
      });
    }

    return meals;
  }

  private generateRecipesForMeal(mealType: string, macros: MacroTargets): SmartRecipe[] {
    // Enhanced recipe database with quick, healthy, local and budget-friendly options
    const quickRecipeDatabase = {
      breakfast: [
        {
          name: 'Avena Express Proteica',
          description: 'Desayuno rápido y nutritivo en 5 minutos',
          ingredients: ['avena integral', 'leche', 'plátano', 'canela', 'miel'],
          instructions: [
            'Calentar 1 taza de leche en microondas (2 min)',
            'Agregar 1/2 taza de avena, mezclar',
            'Añadir plátano en rodajas y canela',
            'Endulzar con 1 cucharadita de miel'
          ],
          prepTime: 3,
          cookTime: 2,
          difficulty: 'easy',
          budget: 'low',
          local: true
        },
        {
          name: 'Tostadas de Aguacate y Huevo',
          description: 'Desayuno completo con grasas saludables',
          ingredients: ['pan integral', 'aguacate', 'huevo', 'tomate', 'sal', 'pimienta'],
          instructions: [
            'Tostar 2 rebanadas de pan integral',
            'Freír huevo a tu gusto (3 min)',
            'Machacar aguacate con sal y pimienta',
            'Untar aguacate en tostadas, agregar huevo y tomate'
          ],
          prepTime: 5,
          cookTime: 3,
          difficulty: 'easy',
          budget: 'medium',
          local: true
        },
        {
          name: 'Batido Verde Energético',
          description: 'Desayuno líquido lleno de nutrientes',
          ingredients: ['espinacas frescas', 'plátano', 'manzana', 'agua', 'limón'],
          instructions: [
            'Lavar bien las espinacas',
            'Pelar plátano y manzana, cortar en trozos',
            'Licuar todo con 1 taza de agua',
            'Agregar jugo de limón al gusto'
          ],
          prepTime: 4,
          cookTime: 0,
          difficulty: 'easy',
          budget: 'low',
          local: true
        }
      ],
      lunch: [
        {
          name: 'Bowl de Pollo y Verduras',
          description: 'Almuerzo balanceado y saciante',
          ingredients: ['pechuga de pollo', 'arroz integral', 'brócoli', 'zanahoria', 'aceite de oliva'],
          instructions: [
            'Cocinar arroz integral (seguir instrucciones del paquete)',
            'Saltear pollo cortado en tiras con aceite (8 min)',
            'Hervir brócoli y zanahoria al vapor (5 min)',
            'Servir todo en un bowl, condimentar al gusto'
          ],
          prepTime: 10,
          cookTime: 15,
          difficulty: 'medium',
          budget: 'medium',
          local: true
        },
        {
          name: 'Ensalada de Atún Mediterránea',
          description: 'Almuerzo fresco y rico en proteínas',
          ingredients: ['atún en agua', 'lechuga', 'tomate', 'pepino', 'aceitunas', 'aceite de oliva'],
          instructions: [
            'Lavar y cortar todas las verduras',
            'Escurrir el atún y desmenuzar',
            'Mezclar todos los ingredientes en un bowl',
            'Aliñar con aceite de oliva, sal y limón'
          ],
          prepTime: 8,
          cookTime: 0,
          difficulty: 'easy',
          budget: 'low',
          local: true
        },
        {
          name: 'Quesadillas de Frijoles',
          description: 'Opción económica rica en fibra y proteína vegetal',
          ingredients: ['tortillas de maíz', 'frijoles refritos', 'queso panela', 'cebolla', 'chile'],
          instructions: [
            'Calentar frijoles refritos en sartén',
            'Picar cebolla y chile finamente',
            'Rellenar tortillas con frijoles, queso y verduras',
            'Cocinar en sartén hasta dorar (3 min por lado)'
          ],
          prepTime: 5,
          cookTime: 8,
          difficulty: 'easy',
          budget: 'low',
          local: true
        }
      ],
      dinner: [
        {
          name: 'Salmón con Vegetales al Horno',
          description: 'Cena elegante y nutritiva',
          ingredients: ['filete de salmón', 'calabacín', 'pimiento', 'cebolla', 'aceite de oliva', 'hierbas'],
          instructions: [
            'Precalentar horno a 200°C',
            'Cortar vegetales en bastones',
            'Colocar salmón y vegetales en bandeja',
            'Rociar con aceite y hierbas, hornear 20 min'
          ],
          prepTime: 8,
          cookTime: 20,
          difficulty: 'medium',
          budget: 'high',
          local: false
        },
        {
          name: 'Tacos de Pescado Ligeros',
          description: 'Cena mexicana saludable y sabrosa',
          ingredients: ['pescado blanco', 'tortillas de maíz', 'repollo', 'lime', 'cilantro', 'yogur griego'],
          instructions: [
            'Sazonar pescado con sal, pimienta y comino',
            'Cocinar pescado en sartén (6 min)',
            'Calentar tortillas',
            'Armar tacos con pescado, repollo rallado y yogur'
          ],
          prepTime: 10,
          cookTime: 8,
          difficulty: 'medium',
          budget: 'medium',
          local: true
        },
        {
          name: 'Sopa de Lentejas Casera',
          description: 'Cena reconfortante y económica',
          ingredients: ['lentejas', 'cebolla', 'zanahoria', 'apio', 'ajo', 'caldo de verduras'],
          instructions: [
            'Sofreír cebolla, zanahoria, apio y ajo',
            'Agregar lentejas lavadas y caldo',
            'Cocinar a fuego medio 25 min',
            'Condimentar con sal, pimienta y hierbas'
          ],
          prepTime: 10,
          cookTime: 30,
          difficulty: 'easy',
          budget: 'low',
          local: true
        }
      ],
      snack: [
        {
          name: 'Yogur con Frutas de Temporada',
          description: 'Snack refrescante y probiótico',
          ingredients: ['yogur natural', 'frutas de temporada', 'granola casera', 'miel'],
          instructions: [
            'Cortar frutas en trozos pequeños',
            'Servir yogur en bowl',
            'Agregar frutas y granola',
            'Endulzar con miel al gusto'
          ],
          prepTime: 3,
          cookTime: 0,
          difficulty: 'easy',
          budget: 'low',
          local: true
        },
        {
          name: 'Hummus con Vegetales Crujientes',
          description: 'Snack mediterráneo rico en proteína vegetal',
          ingredients: ['garbanzos cocidos', 'tahini', 'limón', 'ajo', 'zanahoria', 'apio'],
          instructions: [
            'Procesar garbanzos con tahini, limón y ajo',
            'Agregar agua hasta obtener consistencia cremosa',
            'Cortar vegetales en bastones',
            'Servir hummus con vegetales para dipear'
          ],
          prepTime: 8,
          cookTime: 0,
          difficulty: 'easy',
          budget: 'low',
          local: true
        }
      ]
    };

    // Select best recipe based on user preferences and constraints
    const availableRecipes = quickRecipeDatabase[mealType as keyof typeof quickRecipeDatabase] || quickRecipeDatabase.snack;
    const selectedRecipe = this.selectOptimalRecipe(availableRecipes, macros);

    return [{
      id: `recipe_${mealType}_${Date.now()}`,
      name: selectedRecipe.name,
      description: selectedRecipe.description,
      ingredients: selectedRecipe.ingredients.map((name: string) => this.createSmartIngredient(name, macros, selectedRecipe.budget)),
      instructions: selectedRecipe.instructions,
      macros,
      prepTime: selectedRecipe.prepTime,
      cookTime: selectedRecipe.cookTime,
      servings: 1,
      adaptable: true
    }];
  }

  private selectOptimalRecipe(recipes: any[], macros: MacroTargets): any {
    // Prioritize by: budget (low first), prep time (quick first), local availability
    return recipes.sort((a, b) => {
      const budgetScore = this.getBudgetScore(a.budget) - this.getBudgetScore(b.budget);
      if (budgetScore !== 0) return budgetScore;
      
      const timeScore = (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
      if (timeScore !== 0) return timeScore;
      
      return a.local ? -1 : 1;
    })[0];
  }

  private getBudgetScore(budget: string): number {
    const scores = { 'low': 1, 'medium': 2, 'high': 3 };
    return scores[budget as keyof typeof scores] || 2;
  }

  private createSmartIngredient(name: string, targetMacros: MacroTargets, budget: string): SmartIngredient {
    // Enhanced ingredient creation with realistic nutritional data
    const ingredientNutrition = this.getIngredientNutrition(name);
    const budgetMultiplier = budget === 'low' ? 0.7 : budget === 'medium' ? 1.0 : 1.5;
    
    return {
      name,
      amount: this.calculateIngredientAmount(name, targetMacros),
      unit: this.getIngredientUnit(name),
      category: this.getIngredientCategory(name),
      macrosPer100g: ingredientNutrition,
      available: true,
      cost: Math.round(ingredientNutrition.calories * 0.01 * budgetMultiplier * 100) / 100,
      substitutes: this.getLocalSubstitutes(name)
    };
  }

  private getIngredientNutrition(name: string): MacroTargets {
    // Realistic nutritional database for common ingredients
    const nutritionDB: { [key: string]: MacroTargets } = {
      'avena integral': { calories: 389, protein: 16.9, carbs: 66.3, fats: 6.9, fiber: 10.6 },
      'leche': { calories: 42, protein: 3.4, carbs: 5.0, fats: 1.0, fiber: 0 },
      'plátano': { calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3, fiber: 2.6 },
      'aguacate': { calories: 160, protein: 2.0, carbs: 8.5, fats: 14.7, fiber: 6.7 },
      'huevo': { calories: 155, protein: 13.0, carbs: 1.1, fats: 11.0, fiber: 0 },
      'pan integral': { calories: 247, protein: 13.0, carbs: 41.0, fats: 4.2, fiber: 6.0 },
      'pechuga de pollo': { calories: 165, protein: 31.0, carbs: 0, fats: 3.6, fiber: 0 },
      'arroz integral': { calories: 123, protein: 2.6, carbs: 23.0, fats: 1.0, fiber: 1.8 },
      'brócoli': { calories: 34, protein: 2.8, carbs: 7.0, fats: 0.4, fiber: 2.6 },
      'atún en agua': { calories: 109, protein: 25.0, carbs: 0, fats: 0.8, fiber: 0 },
      'lentejas': { calories: 116, protein: 9.0, carbs: 20.0, fats: 0.4, fiber: 7.9 },
      'yogur natural': { calories: 59, protein: 10.0, carbs: 3.6, fats: 0.4, fiber: 0 },
      'garbanzos cocidos': { calories: 164, protein: 8.9, carbs: 27.4, fats: 2.6, fiber: 7.6 },
      'salmón': { calories: 208, protein: 25.4, carbs: 0, fats: 12.4, fiber: 0 },
      'pescado blanco': { calories: 82, protein: 17.8, carbs: 0, fats: 0.9, fiber: 0 }
    };

    return nutritionDB[name] || { calories: 100, protein: 5, carbs: 15, fats: 3, fiber: 2 };
  }

  private calculateIngredientAmount(name: string, targetMacros: MacroTargets): number {
    const nutrition = this.getIngredientNutrition(name);
    const targetCalories = targetMacros.calories / 4; // Divide total calories among 4 main ingredients
    return Math.round((targetCalories / nutrition.calories) * 100); // Amount in grams
  }

  private getIngredientUnit(name: string): string {
    const unitMap: { [key: string]: string } = {
      'leche': 'ml',
      'agua': 'ml',
      'aceite de oliva': 'ml',
      'huevo': 'unidad',
      'pan integral': 'rebanadas',
      'tortillas de maíz': 'unidades'
    };
    return unitMap[name] || 'g';
  }

  private getIngredientCategory(name: string): string {
    const categoryMap: { [key: string]: string } = {
      'pechuga de pollo': 'proteína',
      'salmón': 'proteína',
      'atún en agua': 'proteína',
      'huevo': 'proteína',
      'lentejas': 'proteína',
      'garbanzos cocidos': 'proteína',
      'yogur natural': 'lácteos',
      'leche': 'lácteos',
      'arroz integral': 'carbohidratos',
      'avena integral': 'carbohidratos',
      'pan integral': 'carbohidratos',
      'plátano': 'frutas',
      'manzana': 'frutas',
      'brócoli': 'verduras',
      'espinacas frescas': 'verduras',
      'lechuga': 'verduras',
      'aguacate': 'grasas saludables',
      'aceite de oliva': 'grasas saludables',
      'almendras': 'frutos secos'
    };
    return categoryMap[name] || 'otros';
  }

  private getLocalSubstitutes(ingredient: string): string[] {
    // Enhanced substitution system with local and budget-friendly alternatives
    const localSubstitutes: { [key: string]: string[] } = {
      'salmón': ['pescado blanco local', 'trucha', 'sardinas', 'atún fresco'],
      'quinoa': ['arroz integral', 'avena', 'amaranto', 'cebada'],
      'proteína en polvo': ['claras de huevo', 'yogur griego', 'requesón', 'leche en polvo'],
      'arándanos': ['fresas locales', 'moras', 'uvas', 'frutas de temporada'],
      'espinacas frescas': ['acelgas', 'lechuga', 'berros', 'verdolagas'],
      'aceite de coco': ['aceite de oliva', 'aceite de girasol', 'mantequilla'],
      'almendras': ['cacahuates', 'nueces de la región', 'semillas de girasol'],
      'tahini': ['mantequilla de cacahuate', 'crema de ajonjolí casera'],
      'yogur griego': ['yogur natural', 'jocoque', 'crema agria baja en grasa']
    };

    return localSubstitutes[ingredient] || this.getGenericSubstitutes(ingredient);
  }

  private getGenericSubstitutes(ingredient: string): string[] {
    const category = this.getIngredientCategory(ingredient);
    const genericSubs: { [key: string]: string[] } = {
      'proteína': ['pollo', 'pescado', 'huevo', 'frijoles', 'lentejas'],
      'carbohidratos': ['arroz', 'pasta', 'pan', 'avena', 'papa'],
      'verduras': ['brócoli', 'espinacas', 'lechuga', 'tomate', 'zanahoria'],
      'frutas': ['plátano', 'manzana', 'naranja', 'frutas de temporada'],
      'lácteos': ['leche', 'yogur', 'queso', 'requesón'],
      'grasas saludables': ['aceite de oliva', 'aguacate', 'nueces']
    };
    return genericSubs[category] || ['ingrediente similar'];
  }



  private generateShoppingList(meals: AdaptiveMeal[]): ShoppingList {
    const items = new Map<string, ShoppingItem>();

    meals.forEach(meal => {
      meal.recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          if (items.has(ingredient.name)) {
            const existing = items.get(ingredient.name)!;
            existing.quantity += ingredient.amount;
          } else {
            items.set(ingredient.name, {
              name: ingredient.name,
              quantity: ingredient.amount,
              unit: ingredient.unit,
              category: ingredient.category,
              priority: 'high',
              cost: ingredient.cost,
              substitutes: ingredient.substitutes
            });
          }
        });
      });
    });

    const itemList = Array.from(items.values());
    const categories = this.groupByCategory(itemList);

    return {
      items: itemList,
      totalCost: itemList.reduce((sum, item) => sum + item.cost, 0),
      categories,
      optimizedRoute: categories.map(cat => cat.name)
    };
  }

  private groupByCategory(items: ShoppingItem[]): ShoppingCategory[] {
    const categoryMap = new Map<string, ShoppingItem[]>();

    items.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, []);
      }
      categoryMap.get(item.category)!.push(item);
    });

    return Array.from(categoryMap.entries()).map(([name, items]) => ({
      name,
      items: items.map(item => item.name),
      estimatedTime: Math.min(15, items.length * 2)
    }));
  }

  private calculateMacroAdjustment(activity: ActivityData, additionalCalories: number) {
    if (activity.intensity === 'high' || activity.intensity === 'very_high') {
      return {
        protein: Math.round(additionalCalories * 0.3 / 4),
        carbs: Math.round(additionalCalories * 0.6 / 4),
        fats: Math.round(additionalCalories * 0.1 / 9)
      };
    }
    
    return {
      protein: Math.round(additionalCalories * 0.25 / 4),
      carbs: Math.round(additionalCalories * 0.45 / 4),
      fats: Math.round(additionalCalories * 0.30 / 9)
    };
  }

  private findPostWorkoutMeal(activityTime: Date): AdaptiveMeal | null {
    if (!this.currentPlan) return null;
    
    // Find meal within 2 hours after activity
    return this.currentPlan.meals.find(meal => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      const mealTime = new Date(activityTime);
      mealTime.setHours(hours, minutes);
      
      const diff = mealTime.getTime() - activityTime.getTime();
      return diff > 0 && diff <= 2 * 60 * 60 * 1000;
    }) || null;
  }

  private getNextMeal(): AdaptiveMeal | null {
    if (!this.currentPlan) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return this.currentPlan.meals.find(meal => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      const mealTime = hours * 60 + minutes;
      return mealTime > currentTime;
    }) || null;
  }

  private getMealTime(mealType: string): string {
    if (!this.profile) return '12:00';
    
    const times = {
      breakfast: this.profile.mealTiming.breakfast,
      lunch: this.profile.mealTiming.lunch,
      dinner: this.profile.mealTiming.dinner,
      snack: '16:00'
    };

    return times[mealType as keyof typeof times] || '12:00';
  }

  private getMealName(mealType: string): string {
    const names = {
      breakfast: 'Desayuno Energético',
      lunch: 'Almuerzo Completo',
      dinner: 'Cena Balanceada',
      snack: 'Snack Saludable'
    };

    return names[mealType as keyof typeof names] || 'Comida Saludable';
  }

  private getSubstitutes(ingredient: string): string[] {
    const substitutes: { [key: string]: string[] } = {
      'pollo': ['pavo', 'pescado', 'tofu'],
      'arroz': ['quinoa', 'pasta integral', 'batata'],
      'avena': ['granola', 'cereales integrales', 'quinoa'],
      'yogur': ['kefir', 'yogur vegetal', 'requesón']
    };

    return substitutes[ingredient] || [];
  }

  private findSubstitute(ingredient: SmartIngredient): SmartIngredient | null {
    const substituteName = ingredient.substitutes[0];
    if (!substituteName) return null;

    return {
      ...ingredient,
      name: substituteName,
      available: true
    };
  }

  private isRecent(timestamp: Date, minutes: number): boolean {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    return diff <= minutes * 60 * 1000;
  }

  private initializeFoodDatabase(): void {
    // Initialize with basic foods
    console.log('🍎 Food database initialized');
  }

  /**
   * Get current plan
   */
  public getCurrentPlan(): AdaptiveMealPlan | null {
    return this.currentPlan;
  }

  /**
   * Get nutrition profile
   */
  public getProfile(): AdaptiveNutritionProfile | null {
    return this.profile;
  }

  /**
   * Chronotype and Circadian Rhythm Optimization Methods
   */
  private determineChronotype(userData: any): 'morning' | 'intermediate' | 'evening' {
    // Simple chronotype determination based on user preferences or time patterns
    // In a real implementation, this could use MEQ (Morningness-Eveningness Questionnaire)
    const preferredWakeTime = userData.preferredWakeTime || '07:00';
    const hour = parseInt(preferredWakeTime.split(':')[0]);
    
    if (hour <= 6) return 'morning';
    if (hour <= 8) return 'intermediate';
    return 'evening';
  }

  private calculateOptimalBedtime(userData: any): string {
    const chronotype = this.determineChronotype(userData);
    const baseTime = {
      'morning': '21:30',
      'intermediate': '22:30', 
      'evening': '23:30'
    };
    return baseTime[chronotype];
  }

  private calculateOptimalWakeup(userData: any): string {
    const chronotype = this.determineChronotype(userData);
    const baseTime = {
      'morning': '05:30',
      'intermediate': '06:30',
      'evening': '07:30'
    };
    return baseTime[chronotype];
  }

  private generateCircadianProfile(userData: any): any {
    const chronotype = this.determineChronotype(userData);
    
    const profiles = {
      'morning': {
        cortisolPeak: '06:00-08:00',
        insulinSensitivityPeak: '07:00-11:00',
        metabolicWindow: '06:00-14:00',
        digestiveOptimal: ['06:00-09:00', '12:00-15:00', '17:00-19:00']
      },
      'intermediate': {
        cortisolPeak: '07:00-09:00',
        insulinSensitivityPeak: '08:00-12:00',
        metabolicWindow: '07:00-15:00',
        digestiveOptimal: ['07:00-10:00', '13:00-16:00', '18:00-20:00']
      },
      'evening': {
        cortisolPeak: '08:00-10:00',
        insulinSensitivityPeak: '09:00-13:00',
        metabolicWindow: '08:00-16:00',
        digestiveOptimal: ['08:00-11:00', '14:00-17:00', '19:00-21:00']
      }
    };
    
    return profiles[chronotype];
  }

  /**
   * Generate circadian-optimized meal plan
   */
  public async generateCircadianOptimizedPlan(date: Date = new Date()): Promise<CircadianMealPlan> {
    if (!this.profile) throw new Error('Profile not created');

    const chronotype = this.profile.mealTiming.chronotype;
    const circadianProfile = this.profile.mealTiming.circadianProfile;
    
    // Calculate macros with circadian timing
    const macros = this.calculateCircadianMacros(chronotype);
    const meals = await this.generateCircadianMeals(macros, chronotype, circadianProfile);
    const shoppingList = this.generateShoppingList(meals);

    const circadianPlan: CircadianMealPlan = {
      id: `circadian_plan_${Date.now()}`,
      date,
      totalMacros: macros,
      meals,
      shoppingList,
      adaptations: [],
      chronotype,
      circadianOptimization: this.categorizeCircadianMeals(meals, circadianProfile),
      performanceMetrics: this.calculatePerformanceMetrics(meals, chronotype)
    };

    this.currentPlan = circadianPlan;
    return circadianPlan;
  }

  private calculateCircadianMacros(chronotype: string): MacroTargets {
    if (!this.profile) throw new Error('Profile not set');

    const baseCalories = this.profile.baseCalories;
    const primaryGoal = this.profile.goals[0];

    // Adjust macro distribution based on chronotype and circadian rhythm
    let proteinRatio = 0.25, carbRatio = 0.45, fatRatio = 0.30;

    // Morning types benefit from higher carbs early, evening types later
    switch (chronotype) {
      case 'morning':
        proteinRatio = 0.28; carbRatio = 0.47; fatRatio = 0.25; // Higher carbs for morning energy
        break;
      case 'intermediate':
        proteinRatio = 0.26; carbRatio = 0.46; fatRatio = 0.28; // Balanced distribution
        break;
      case 'evening':
        proteinRatio = 0.30; carbRatio = 0.40; fatRatio = 0.30; // Higher protein for evening recovery
        break;
    }

    // Adjust based on primary goal
    switch (primaryGoal?.type) {
      case 'muscle_gain':
        proteinRatio += 0.05; carbRatio -= 0.03; fatRatio -= 0.02;
        break;
      case 'weight_loss':
        proteinRatio += 0.08; carbRatio -= 0.05; fatRatio -= 0.03;
        break;
      case 'performance':
        proteinRatio -= 0.02; carbRatio += 0.05; fatRatio -= 0.03;
        break;
    }

    return {
      calories: baseCalories,
      protein: Math.round((baseCalories * proteinRatio) / 4),
      carbs: Math.round((baseCalories * carbRatio) / 4),
      fats: Math.round((baseCalories * fatRatio) / 9),
      fiber: Math.round(baseCalories / 80)
    };
  }

  private async generateCircadianMeals(
    dailyMacros: MacroTargets, 
    chronotype: string, 
    circadianProfile: any
  ): Promise<AdaptiveMeal[]> {
    // Circadian-optimized meal distribution
    const chronotypeMealDistribution = {
      'morning': {
        breakfast: 0.35, // Larger breakfast for morning types
        lunch: 0.30,
        dinner: 0.25,
        snack: 0.10
      },
      'intermediate': {
        breakfast: 0.25,
        lunch: 0.35, // Larger lunch for intermediate types  
        dinner: 0.30,
        snack: 0.10
      },
      'evening': {
        breakfast: 0.20, // Smaller breakfast for evening types
        lunch: 0.30,
        dinner: 0.40, // Larger dinner for evening types
        snack: 0.10
      }
    };

    const distribution = chronotypeMealDistribution[chronotype as keyof typeof chronotypeMealDistribution];
    const meals: AdaptiveMeal[] = [];

    for (const [type, ratio] of Object.entries(distribution)) {
      const mealMacros: MacroTargets = {
        calories: Math.round(dailyMacros.calories * ratio),
        protein: Math.round(dailyMacros.protein * ratio),
        carbs: Math.round(dailyMacros.carbs * ratio),
        fats: Math.round(dailyMacros.fats * ratio),
        fiber: Math.round(dailyMacros.fiber * ratio)
      };

      // Adjust macros based on circadian timing
      const adjustedMacros = this.adjustMacrosForCircadianTiming(mealMacros, type, chronotype, circadianProfile);
      const optimalTime = this.getCircadianOptimalTime(type, chronotype, circadianProfile);
      const recipes = this.generateCircadianOptimizedRecipes(type, adjustedMacros, chronotype);
      
      meals.push({
        id: `circadian_meal_${type}_${Date.now()}`,
        type: type as any,
        name: this.getCircadianMealName(type, chronotype),
        time: optimalTime,
        recipes,
        macros: adjustedMacros,
        alternatives: []
      });
    }

    return meals;
  }

  private adjustMacrosForCircadianTiming(
    baseMacros: MacroTargets, 
    mealType: string, 
    chronotype: string, 
    circadianProfile: any
  ): MacroTargets {
    const adjusted = { ...baseMacros };
    
    // Optimize based on insulin sensitivity and metabolic windows
    if (mealType === 'breakfast') {
      // Higher carbs during morning insulin sensitivity peak
      if (chronotype === 'morning') {
        adjusted.carbs = Math.round(adjusted.carbs * 1.2);
        adjusted.fats = Math.round(adjusted.fats * 0.8);
      }
    } else if (mealType === 'lunch') {
      // Balanced macros during midday
      // No major adjustments needed
    } else if (mealType === 'dinner') {
      // Lower carbs, higher protein for evening recovery
      adjusted.carbs = Math.round(adjusted.carbs * 0.8);
      adjusted.protein = Math.round(adjusted.protein * 1.1);
      adjusted.fats = Math.round(adjusted.fats * 1.1);
    }

    // Recalculate calories to match macro adjustments
    adjusted.calories = (adjusted.protein * 4) + (adjusted.carbs * 4) + (adjusted.fats * 9);
    
    return adjusted;
  }

  private getCircadianOptimalTime(mealType: string, chronotype: string, circadianProfile: any): string {
    const chronotypeTimings = {
      'morning': {
        breakfast: '06:30',
        lunch: '12:00', 
        dinner: '18:00',
        snack: '15:30'
      },
      'intermediate': {
        breakfast: '07:30',
        lunch: '13:00',
        dinner: '19:00', 
        snack: '16:30'
      },
      'evening': {
        breakfast: '08:30',
        lunch: '14:00',
        dinner: '20:00',
        snack: '17:30'
      }
    };

    return chronotypeTimings[chronotype as keyof typeof chronotypeTimings][mealType as keyof typeof chronotypeTimings['morning']] || '12:00';
  }

  private generateCircadianOptimizedRecipes(mealType: string, macros: MacroTargets, chronotype: string): SmartRecipe[] {
    // Enhanced recipe generation with circadian optimization
    const circadianRecipeDatabase = {
      morning: {
        breakfast: [
          {
            name: 'Desayuno Energético Matutino',
            description: 'Optimizado para el pico de cortisol matutino',
            ingredients: ['avena integral', 'miel', 'plátano', 'café', 'yogur griego'],
            instructions: [
              'Preparar avena con agua caliente',
              'Agregar miel para energía rápida',
              'Incluir plátano para potasio',
              'Servir con café para aprovechar pico de cortisol',
              'Acompañar con yogur griego para proteína'
            ],
            prepTime: 8,
            cookTime: 5,
            circadianBenefit: 'Aprovecha pico natural de cortisol y sensibilidad a insulina'
          }
        ],
        lunch: [
          {
            name: 'Almuerzo de Alto Rendimiento',
            description: 'Maximiza energía para la tarde productiva',
            ingredients: ['quinoa', 'salmón', 'espinacas', 'aguacate', 'limón'],
            instructions: [
              'Cocinar quinoa como base energética',
              'Grillar salmón para omega-3',
              'Saltear espinacas con ajo',
              'Agregar aguacate para grasas saludables',
              'Aliñar con limón para absorción de hierro'
            ],
            prepTime: 15,
            cookTime: 20,
            circadianBenefit: 'Mantiene energía durante ventana metabólica óptima'
          }
        ],
        dinner: [
          {
            name: 'Cena de Recuperación Temprana',
            description: 'Optimizada para recuperación nocturna eficiente',
            ingredients: ['pollo orgánico', 'batata', 'brócoli', 'magnesio', 'cúrcuma'],
            instructions: [
              'Hornear pollo con hierbas relajantes',
              'Asar batata para carbohidratos complejos',
              'Cocinar brócoli al vapor',
              'Condimentar con cúrcuma antiinflamatoria',
              'Tomar suplemento de magnesio para relajación'
            ],
            prepTime: 10,
            cookTime: 25,
            circadianBenefit: 'Facilita transición a modo nocturno y recuperación'
          }
        ]
      },
      evening: {
        breakfast: [
          {
            name: 'Desayuno Suave Vespertino',
            description: 'Activación gradual para cronotipos tardíos',
            ingredients: ['té verde', 'tostada integral', 'aguacate', 'huevo', 'tomate'],
            instructions: [
              'Preparar té verde para cafeína suave',
              'Tostar pan integral',
              'Machacar aguacate con sal',
              'Preparar huevo pochado',
              'Agregar tomate para licopeno'
            ],
            prepTime: 12,
            cookTime: 8,
            circadianBenefit: 'Activación suave respetando ritmo circadiano tardío'
          }
        ],
        dinner: [
          {
            name: 'Cena Potente Nocturna',
            description: 'Comida principal para cronotipos vespertinos',
            ingredients: ['filete de res', 'quinoa roja', 'espárragos', 'champiñones', 'vino tinto'],
            instructions: [
              'Sellar filete a fuego alto',
              'Cocinar quinoa roja como acompañamiento',
              'Saltear espárragos y champiñones',
              'Desglasar con vino tinto',
              'Servir cuando el metabolismo está activo'
            ],
            prepTime: 15,
            cookTime: 18,
            circadianBenefit: 'Aprovecha pico metabólico nocturno de cronotipos vespertinos'
          }
        ]
      }
    };

    // Select appropriate recipes based on chronotype and meal type
    const chronotypeRecipes = circadianRecipeDatabase[chronotype as keyof typeof circadianRecipeDatabase];
    const mealRecipes = chronotypeRecipes?.[mealType as keyof typeof chronotypeRecipes] || [];
    
    if (mealRecipes.length === 0) {
      // Fallback to standard recipe generation
      return this.generateRecipesForMeal(mealType, macros);
    }

    const selectedRecipe = mealRecipes[0]; // For now, select the first recipe

    return [{
      id: `circadian_recipe_${mealType}_${Date.now()}`,
      name: selectedRecipe.name,
      description: selectedRecipe.description,
      ingredients: selectedRecipe.ingredients.map((name: string) => this.createSmartIngredient(name, macros, 'medium')),
      instructions: selectedRecipe.instructions,
      macros,
      prepTime: selectedRecipe.prepTime,
      cookTime: selectedRecipe.cookTime,
      servings: 1,
      adaptable: true
    }];
  }

  private categorizeCircadianMeals(meals: AdaptiveMeal[], circadianProfile: any): any {
    return {
      cortisolSyncMeals: meals.filter(meal => meal.type === 'breakfast'),
      insulinOptimizedMeals: meals.filter(meal => ['breakfast', 'lunch'].includes(meal.type)),
      metabolicWindowMeals: meals.filter(meal => ['breakfast', 'lunch', 'snack'].includes(meal.type)),
      recoveryMeals: meals.filter(meal => meal.type === 'dinner')
    };
  }

  private calculatePerformanceMetrics(meals: AdaptiveMeal[], chronotype: string): any {
    // Calculate performance metrics based on circadian optimization
    const energyAlignment = this.calculateEnergyAlignment(meals, chronotype);
    const recoveryOptimization = this.calculateRecoveryOptimization(meals, chronotype);
    const metabolicEfficiency = this.calculateMetabolicEfficiency(meals, chronotype);

    return {
      energyAlignment,
      recoveryOptimization,
      metabolicEfficiency
    };
  }

  private calculateEnergyAlignment(meals: AdaptiveMeal[], chronotype: string): number {
    // Score based on how well meal timing aligns with natural energy peaks
    let score = 0;
    
    meals.forEach(meal => {
      const mealHour = parseInt(meal.time.split(':')[0]);
      
      if (chronotype === 'morning' && meal.type === 'breakfast' && mealHour <= 7) score += 25;
      if (chronotype === 'evening' && meal.type === 'dinner' && mealHour >= 19) score += 25;
      if (meal.type === 'lunch' && mealHour >= 12 && mealHour <= 14) score += 25;
      if (meal.macros.carbs > meal.macros.fats && ['breakfast', 'lunch'].includes(meal.type)) score += 25;
    });
    
    return Math.min(100, score);
  }

  private calculateRecoveryOptimization(meals: AdaptiveMeal[], chronotype: string): number {
    // Score based on how well meals support recovery
    let score = 0;
    
    const dinnerMeal = meals.find(meal => meal.type === 'dinner');
    if (dinnerMeal) {
      const dinnerHour = parseInt(dinnerMeal.time.split(':')[0]);
      
      // Earlier dinner for better digestion and sleep
      if (dinnerHour <= 19) score += 30;
      
      // Higher protein ratio for muscle recovery
      const proteinRatio = dinnerMeal.macros.protein / (dinnerMeal.macros.protein + dinnerMeal.macros.carbs + dinnerMeal.macros.fats);
      if (proteinRatio > 0.3) score += 35;
      
      // Lower carbs for better sleep
      const carbRatio = dinnerMeal.macros.carbs / dinnerMeal.macros.calories * 4;
      if (carbRatio < 0.4) score += 35;
    }
    
    return Math.min(100, score);
  }

  private calculateMetabolicEfficiency(meals: AdaptiveMeal[], chronotype: string): number {
    // Score based on how well meals optimize metabolic processes
    let score = 0;
    
    const breakfastMeal = meals.find(meal => meal.type === 'breakfast');
    const lunchMeal = meals.find(meal => meal.type === 'lunch');
    
    // Higher carbs during insulin sensitivity peak (morning/early afternoon)
    if (breakfastMeal && lunchMeal) {
      const morningCarbs = breakfastMeal.macros.carbs + lunchMeal.macros.carbs;
      const totalCarbs = meals.reduce((sum, meal) => sum + meal.macros.carbs, 0);
      
      if (morningCarbs / totalCarbs > 0.6) score += 50; // 60% of carbs in first half of day
    }
    
    // Meal timing distribution score
    const mealTimes = meals.map(meal => parseInt(meal.time.split(':')[0])).sort();
    const timeGaps = [];
    for (let i = 1; i < mealTimes.length; i++) {
      timeGaps.push(mealTimes[i] - mealTimes[i-1]);
    }
    
    // Optimal gap is 4-6 hours between meals
    const optimalGaps = timeGaps.filter(gap => gap >= 4 && gap <= 6).length;
    score += (optimalGaps / timeGaps.length) * 50;
    
    return Math.min(100, score);
  }

  private getCircadianMealName(mealType: string, chronotype: string): string {
    const chronotypeNames = {
      'morning': {
        breakfast: 'Desayuno Energético Matutino',
        lunch: 'Almuerzo de Alto Rendimiento', 
        dinner: 'Cena de Recuperación Temprana',
        snack: 'Snack Energético'
      },
      'intermediate': {
        breakfast: 'Desayuno Balanceado',
        lunch: 'Almuerzo Equilibrado',
        dinner: 'Cena Nutritiva',
        snack: 'Snack Balanceado'
      },
      'evening': {
        breakfast: 'Desayuno Suave Vespertino',
        lunch: 'Almuerzo Gradual',
        dinner: 'Cena Potente Nocturna', 
        snack: 'Snack Nocturno'
      }
    };

    return chronotypeNames[chronotype as keyof typeof chronotypeNames][mealType as keyof typeof chronotypeNames['morning']] || 'Comida Saludable';
  }
}

export const adaptiveNutritionAI = new AdaptiveNutritionAI();