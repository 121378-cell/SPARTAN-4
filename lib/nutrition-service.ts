import { storageManager } from './storage';
import { habitTrackingService } from './habit-tracking';
import type { 
  UserHabit, 
  WorkoutSession, 
  NutritionGoal, 
  MealType, 
  Nutrient, 
  Meal, 
  DailyNutrition 
} from './types';

export class NutritionService {
  private static instance: NutritionService;
  
  static getInstance(): NutritionService {
    if (!NutritionService.instance) {
      NutritionService.instance = new NutritionService();
    }
    return NutritionService.instance;
  }
  
  // Initialize user nutrition profile
  initializeUserNutritionProfile(userId: string): UserHabit {
    const habits = storageManager.getUserHabits();
    const existingHabit = habits.find(habit => habit.userId === userId);
    
    if (existingHabit) {
      return existingHabit;
    }
    
    // Extend existing habit with nutrition preferences
    const newUserHabit: UserHabit = {
      id: `habit_${userId}_${Date.now()}`,
      userId,
      preferredTrainingTimes: [],
      trainingFrequency: 0,
      lastTrainingSessions: [],
      averageTrainingDuration: 0,
      preferredTrainingDays: [],
      preferredMealTimes: ['08:00', '13:00', '19:00'], // Default meal times
      preferredFoods: [],
      dislikedFoods: [],
      dietaryRestrictions: [],
      nutritionGoals: ['maintenance'] // Default goal
    };
    
    storageManager.addUserHabit(newUserHabit);
    return newUserHabit;
  }
  
  // Update user nutrition preferences
  updateUserNutritionPreferences(
    userId: string, 
    preferences: Partial<Pick<UserHabit, 'preferredFoods' | 'dislikedFoods' | 'dietaryRestrictions' | 'nutritionGoals' | 'preferredMealTimes'>>
  ): void {
    const habits = storageManager.getUserHabits();
    const userHabit = habits.find(habit => habit.userId === userId) || 
                     this.initializeUserNutritionProfile(userId);
    
    // Update preferences
    if (preferences.preferredFoods) {
      userHabit.preferredFoods = preferences.preferredFoods;
    }
    
    if (preferences.dislikedFoods) {
      userHabit.dislikedFoods = preferences.dislikedFoods;
    }
    
    if (preferences.dietaryRestrictions) {
      userHabit.dietaryRestrictions = preferences.dietaryRestrictions;
    }
    
    if (preferences.nutritionGoals) {
      userHabit.nutritionGoals = preferences.nutritionGoals;
    }
    
    if (preferences.preferredMealTimes) {
      userHabit.preferredMealTimes = preferences.preferredMealTimes;
    }
    
    // Save updated habits
    const updatedHabits = habits.map(habit => 
      habit.userId === userId ? userHabit : habit
    );
    storageManager.setUserHabits(updatedHabits);
  }
  
  // Calculate daily nutrition needs based on user data and goals
  calculateDailyNutritionNeeds(userId: string, date: Date): DailyNutrition {
    const habit = habitTrackingService.getUserHabits(userId);
    const workoutSessions = storageManager.getWorkoutSessions();
    
    // Find workout session for the given date
    const dailyWorkout = workoutSessions.find(session => 
      session.date.toDateString() === date.toDateString()
    );
    
    // Calculate estimated calorie expenditure if there's a workout
    let calorieExpenditure = 0;
    if (dailyWorkout) {
      // Base metabolic rate (simplified calculation)
      const userData = storageManager.getUserData();
      if (userData) {
        const bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
        // Activity factor based on workout duration
        const activityFactor = dailyWorkout.duration ? (dailyWorkout.duration / 60) * 0.1 + 1.2 : 1.2;
        calorieExpenditure = Math.round(bmr * activityFactor);
      }
    }
    
    // Determine primary nutrition goal
    const primaryGoal: NutritionGoal = (habit?.nutritionGoals?.[0] as NutritionGoal) || 'maintenance';
    
    // Calculate base nutrients based on goal
    const baseNutrients = this.calculateBaseNutrients(userId, primaryGoal);
    
    // Adjust for workout if applicable
    if (dailyWorkout) {
      const workoutAdjustment = this.calculateWorkoutNutritionAdjustment(dailyWorkout, primaryGoal);
      baseNutrients.calories += workoutAdjustment.calories;
      baseNutrients.protein += workoutAdjustment.protein;
      baseNutrients.carbs += workoutAdjustment.carbs;
      baseNutrients.fats += workoutAdjustment.fats;
    }
    
    // Create meals based on preferences and workout schedule
    const meals = this.generateMealsForDay(userId, date, dailyWorkout, primaryGoal);
    
    return {
      date,
      totalNutrients: baseNutrients,
      meals,
      calorieExpenditure: calorieExpenditure || undefined,
      nutritionGoal: primaryGoal
    };
  }
  
  // Generate meal recommendations for the day
  private generateMealsForDay(
    userId: string, 
    date: Date, 
    workoutSession: WorkoutSession | undefined, 
    goal: NutritionGoal
  ): Meal[] {
    const habit = habitTrackingService.getUserHabits(userId);
    const meals: Meal[] = [];
    
    // Base meal times
    const mealTimes = habit?.preferredMealTimes || ['08:00', '13:00', '19:00'];
    
    // Generate regular meals
    const regularMeals: MealType[] = ['breakfast', 'lunch', 'dinner'];
    regularMeals.forEach((mealType, index) => {
      const time = mealTimes[index] || '08:00';
      const nutrients = this.calculateMealNutrients(mealType, goal);
      
      meals.push({
        id: `meal_${date.toISOString().split('T')[0]}_${mealType}`,
        type: mealType,
        name: this.getMealName(mealType, goal),
        time,
        nutrients,
        ingredients: this.getRecommendedIngredients(mealType, goal, habit),
        date
      });
    });
    
    // Add pre/post workout meals if there's a workout
    if (workoutSession && workoutSession.startTime) {
      const workoutTime = workoutSession.startTime;
      
      // Pre-workout meal (1 hour before)
      const preWorkoutTime = new Date(workoutTime);
      preWorkoutTime.setHours(preWorkoutTime.getHours() - 1);
      const preWorkoutTimeString = preWorkoutTime.toTimeString().substring(0, 5);
      
      meals.push({
        id: `meal_${date.toISOString().split('T')[0]}_pre_workout`,
        type: 'pre_workout',
        name: this.getMealName('pre_workout', goal),
        time: preWorkoutTimeString,
        nutrients: this.calculateMealNutrients('pre_workout', goal),
        ingredients: this.getRecommendedIngredients('pre_workout', goal, habit),
        workoutRelated: true,
        workoutId: workoutSession.id,
        date
      });
      
      // Post-workout meal (30 minutes after)
      const postWorkoutTime = new Date(workoutTime);
      postWorkoutTime.setMinutes(postWorkoutTime.getMinutes() + 
        (workoutSession.duration || 60) + 30);
      const postWorkoutTimeString = postWorkoutTime.toTimeString().substring(0, 5);
      
      meals.push({
        id: `meal_${date.toISOString().split('T')[0]}_post_workout`,
        type: 'post_workout',
        name: this.getMealName('post_workout', goal),
        time: postWorkoutTimeString,
        nutrients: this.calculateMealNutrients('post_workout', goal),
        ingredients: this.getRecommendedIngredients('post_workout', goal, habit),
        workoutRelated: true,
        workoutId: workoutSession.id,
        date
      });
    }
    
    // Add snacks
    const snackTimes = mealTimes.length > 3 ? mealTimes.slice(3) : ['10:30', '15:30'];
    snackTimes.forEach((time, index) => {
      const nutrients = this.calculateMealNutrients('snack', goal);
      
      meals.push({
        id: `meal_${date.toISOString().split('T')[0]}_snack_${index + 1}`,
        type: 'snack',
        name: this.getMealName('snack', goal),
        time,
        nutrients,
        ingredients: this.getRecommendedIngredients('snack', goal, habit),
        date
      });
    });
    
    return meals;
  }
  
  // Calculate base nutrients based on user goal
  private calculateBaseNutrients(userId: string, goal: NutritionGoal): Nutrient {
    const userData = storageManager.getUserData();
    if (!userData) {
      return { calories: 2000, protein: 150, carbs: 250, fats: 70 };
    }
    
    // Base metabolic rate calculation
    const bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
    
    // Adjust based on goal
    let calories = bmr * 1.55; // Moderate activity level
    let protein, carbs, fats;
    
    switch (goal) {
      case 'definition':
        calories *= 0.85; // Caloric deficit
        protein = userData.weight * 2.2; // High protein for muscle preservation
        fats = calories * 0.25 / 9; // 25% from fats
        carbs = (calories - (protein * 4) - (fats * 9)) / 4; // Remaining from carbs
        break;
        
      case 'strength':
        calories *= 1.1; // Slight caloric surplus
        protein = userData.weight * 2.0; // High protein for muscle building
        fats = calories * 0.30 / 9; // 30% from fats
        carbs = (calories - (protein * 4) - (fats * 9)) / 4; // Remaining from carbs
        break;
        
      case 'muscle_mass':
        calories *= 1.2; // Caloric surplus
        protein = userData.weight * 2.5; // Very high protein
        fats = calories * 0.25 / 9; // 25% from fats
        carbs = (calories - (protein * 4) - (fats * 9)) / 4; // Remaining from carbs
        break;
        
      case 'endurance':
        calories *= 1.15; // Moderate surplus
        protein = userData.weight * 1.8; // Adequate protein
        fats = calories * 0.20 / 9; // 20% from fats
        carbs = (calories - (protein * 4) - (fats * 9)) / 4; // High carbs for endurance
        break;
        
      case 'maintenance':
      default:
        protein = userData.weight * 2.0;
        fats = calories * 0.25 / 9;
        carbs = (calories - (protein * 4) - (fats * 9)) / 4;
        break;
    }
    
    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    };
  }
  
  // Calculate nutrition adjustment for workout
  private calculateWorkoutNutritionAdjustment(
    workoutSession: WorkoutSession, 
    goal: NutritionGoal
  ): Nutrient {
    const duration = workoutSession.duration || 60;
    let caloriesAdjustment = duration * 8; // Roughly 8 calories per minute
    
    // Adjust based on goal
    switch (goal) {
      case 'definition':
        // For definition, we want to maintain protein but not add extra calories
        return { 
          calories: Math.round(caloriesAdjustment * 0.5), 
          protein: Math.round(duration * 0.3), 
          carbs: Math.round(duration * 0.2), 
          fats: Math.round(duration * 0.1) 
        };
        
      case 'strength':
      case 'muscle_mass':
        // For muscle building, we want extra protein and carbs
        return { 
          calories: Math.round(caloriesAdjustment * 1.5), 
          protein: Math.round(duration * 0.5), 
          carbs: Math.round(duration * 0.8), 
          fats: Math.round(duration * 0.2) 
        };
        
      case 'endurance':
        // For endurance, we want extra carbs
        return { 
          calories: Math.round(caloriesAdjustment * 1.3), 
          protein: Math.round(duration * 0.3), 
          carbs: Math.round(duration * 1.0), 
          fats: Math.round(duration * 0.2) 
        };
        
      case 'maintenance':
      default:
        return { 
          calories: Math.round(caloriesAdjustment), 
          protein: Math.round(duration * 0.4), 
          carbs: Math.round(duration * 0.5), 
          fats: Math.round(duration * 0.1) 
        };
    }
  }
  
  // Calculate nutrients for a specific meal type
  private calculateMealNutrients(mealType: MealType, goal: NutritionGoal): Nutrient {
    // Base nutrients per meal type
    const baseNutrients: Record<MealType, Nutrient> = {
      breakfast: { calories: 400, protein: 25, carbs: 50, fats: 15 },
      lunch: { calories: 600, protein: 40, carbs: 60, fats: 20 },
      dinner: { calories: 500, protein: 35, carbs: 40, fats: 18 },
      snack: { calories: 200, protein: 10, carbs: 25, fats: 8 },
      pre_workout: { calories: 300, protein: 20, carbs: 40, fats: 5 },
      post_workout: { calories: 350, protein: 30, carbs: 35, fats: 8 }
    };
    
    const nutrients = { ...baseNutrients[mealType] };
    
    // Adjust based on goal
    switch (goal) {
      case 'definition':
        nutrients.calories *= 0.9;
        nutrients.protein *= 1.2;
        nutrients.carbs *= 0.8;
        nutrients.fats *= 0.9;
        break;
        
      case 'strength':
        nutrients.calories *= 1.1;
        nutrients.protein *= 1.3;
        nutrients.carbs *= 1.1;
        nutrients.fats *= 1.1;
        break;
        
      case 'muscle_mass':
        nutrients.calories *= 1.2;
        nutrients.protein *= 1.5;
        nutrients.carbs *= 1.2;
        nutrients.fats *= 1.1;
        break;
        
      case 'endurance':
        nutrients.calories *= 1.1;
        nutrients.protein *= 1.1;
        nutrients.carbs *= 1.3;
        nutrients.fats *= 1.0;
        break;
        
      case 'maintenance':
      default:
        // No adjustment needed
        break;
    }
    
    return {
      calories: Math.round(nutrients.calories),
      protein: Math.round(nutrients.protein),
      carbs: Math.round(nutrients.carbs),
      fats: Math.round(nutrients.fats)
    };
  }
  
  // Get recommended ingredients based on meal type, goal, and user preferences
  private getRecommendedIngredients(
    mealType: MealType, 
    goal: NutritionGoal, 
    habit: UserHabit | undefined
  ): string[] {
    // Base ingredients by meal type and goal
    const baseIngredients: Record<MealType, Record<NutritionGoal, string[]>> = {
      breakfast: {
        definition: ['Avena', 'Claras de huevo', 'Bayas', 'Yogur griego'],
        strength: ['Avena', 'Huevo entero', 'Plátano', 'Mantequilla de maní'],
        muscle_mass: ['Avena', 'Huevo entero', 'Plátano', 'Leche'],
        endurance: ['Avena', 'Miel', 'Plátano', 'Nueces'],
        maintenance: ['Avena', 'Huevo', 'Frutas', 'Lácteos']
      },
      lunch: {
        definition: ['Pechuga de pollo', 'Quinoa', 'Verduras', 'Aguacate'],
        strength: ['Carne magra', 'Arroz integral', 'Verduras', 'Aceite de oliva'],
        muscle_mass: ['Carne roja magra', 'Arroz integral', 'Verduras', 'Aguacate'],
        endurance: ['Pescado', 'Pasta integral', 'Verduras', 'Aceite de oliva'],
        maintenance: ['Proteína magra', 'Carbohidratos complejos', 'Verduras', 'Grasas saludables']
      },
      dinner: {
        definition: ['Pescado', 'Verduras al vapor', 'Batata', 'Limón'],
        strength: ['Salmón', 'Brócoli', 'Arroz integral', 'Aceite de oliva'],
        muscle_mass: ['Filete', 'Verduras asadas', 'Quinoa', 'Aguacate'],
        endurance: ['Pescado blanco', 'Verduras', 'Pasta integral', 'Hierbas'],
        maintenance: ['Proteína magra', 'Verduras', 'Carbohidratos complejos', 'Grasas saludables']
      },
      snack: {
        definition: ['Frutos secos', 'Frutas', 'Yogur griego', 'Semillas'],
        strength: ['Frutos secos', 'Proteína en polvo', 'Frutas', 'Leche'],
        muscle_mass: ['Frutos secos', 'Proteína en polvo', 'Avena', 'Leche'],
        endurance: ['Dátiles', 'Mantequilla de almendra', 'Avena', 'Miel'],
        maintenance: ['Frutos secos', 'Frutas', 'Lácteos', 'Cereales']
      },
      pre_workout: {
        definition: ['Plátano', 'Avena', 'Miel', 'Café'],
        strength: ['Plátano', 'Avena', 'Miel', 'Café'],
        muscle_mass: ['Plátano', 'Avena', 'Miel', 'Café'],
        endurance: ['Plátano', 'Dátiles', 'Café', 'Agua'],
        maintenance: ['Fruta', 'Carbohidratos simples', 'Café', 'Agua']
      },
      post_workout: {
        definition: ['Proteína en polvo', 'Bayas', 'Leche de almendra', 'Semillas de chía'],
        strength: ['Proteína en polvo', 'Plátano', 'Leche', 'Mantequilla de maní'],
        muscle_mass: ['Proteína en polvo', 'Plátano', 'Leche', 'Avena'],
        endurance: ['Proteína en polvo', 'Dátiles', 'Agua', 'Sal'],
        maintenance: ['Proteína', 'Fruta', 'Lácteos', 'Carbohidratos simples']
      }
    };
    
    let ingredients = [...baseIngredients[mealType][goal]];
    
    // Add user preferred foods if they exist
    if (habit?.preferredFoods && habit.preferredFoods.length > 0) {
      // Add 1-2 preferred foods to the meal
      const preferred = habit.preferredFoods.slice(0, 2);
      ingredients = [...ingredients, ...preferred];
    }
    
    // Filter out disliked foods
    if (habit?.dislikedFoods && habit.dislikedFoods.length > 0) {
      ingredients = ingredients.filter(ingredient => 
        !habit.dislikedFoods.includes(ingredient)
      );
    }
    
    return ingredients;
  }
  
  // Get meal name based on type and goal
  private getMealName(mealType: MealType, goal: NutritionGoal): string {
    const mealNames: Record<MealType, Record<NutritionGoal, string>> = {
      breakfast: {
        definition: 'Desayuno Alto en Proteínas',
        strength: 'Desayuno Energético',
        muscle_mass: 'Desayuno Hipercalórico',
        endurance: 'Desayuno con Carbohidratos',
        maintenance: 'Desayuno Equilibrado'
      },
      lunch: {
        definition: 'Almuerzo Bajo en Grasas',
        strength: 'Almuerzo Rico en Proteínas',
        muscle_mass: 'Almuerzo Hipercalórico',
        endurance: 'Almuerzo con Carbohidratos',
        maintenance: 'Almuerzo Equilibrado'
      },
      dinner: {
        definition: 'Cena Ligera',
        strength: 'Cena Recuperativa',
        muscle_mass: 'Cena Hipercalórica',
        endurance: 'Cena Equilibrada',
        maintenance: 'Cena Equilibrada'
      },
      snack: {
        definition: 'Merienda Baja Caloría',
        strength: 'Merienda Proteica',
        muscle_mass: 'Merienda Hipercalórica',
        endurance: 'Merienda con Carbohidratos',
        maintenance: 'Merienda Equilibrada'
      },
      pre_workout: {
        definition: 'Comida Pre-Entreno Ligera',
        strength: 'Comida Pre-Entreno Energética',
        muscle_mass: 'Comida Pre-Entreno Hipercalórica',
        endurance: 'Comida Pre-Entreno con Carbohidratos',
        maintenance: 'Comida Pre-Entreno'
      },
      post_workout: {
        definition: 'Comida Post-Entreno Recuperativa',
        strength: 'Comida Post-Entreno con Proteínas',
        muscle_mass: 'Comida Post-Entreno Hipercalórica',
        endurance: 'Comida Post-Entreno con Carbohidratos',
        maintenance: 'Comida Post-Entreno'
      }
    };
    
    return mealNames[mealType][goal];
  }
  
  // Learn from user meal preferences
  learnFromMealPreferences(userId: string, meal: Meal): void {
    const habits = storageManager.getUserHabits();
    const userHabit = habits.find(habit => habit.userId === userId) || 
                     this.initializeUserNutritionProfile(userId);
    
    // Add ingredients to preferred foods if not already there
    meal.ingredients.forEach(ingredient => {
      if (!userHabit.preferredFoods.includes(ingredient)) {
        userHabit.preferredFoods.push(ingredient);
      }
    });
    
    // Track meal preferences for better recommendations
    this.trackMealPreferences(userId, meal);
    
    // Save updated habits
    const updatedHabits = habits.map(habit => 
      habit.userId === userId ? userHabit : habit
    );
    storageManager.setUserHabits(updatedHabits);
  }
  
  // Track meal preferences for better recommendations
  private trackMealPreferences(userId: string, meal: Meal): void {
    // Get existing meal preferences
    const mealPreferences = this.getMealPreferences(userId);
    
    // Update preferences based on meal selection
    if (!mealPreferences[meal.type]) {
      mealPreferences[meal.type] = {
        count: 1,
        ingredients: [...meal.ingredients],
        times: [meal.time]
      };
    } else {
      mealPreferences[meal.type].count += 1;
      
      // Add new ingredients
      meal.ingredients.forEach(ingredient => {
        if (!mealPreferences[meal.type].ingredients.includes(ingredient)) {
          mealPreferences[meal.type].ingredients.push(ingredient);
        }
      });
      
      // Add new times
      if (!mealPreferences[meal.type].times.includes(meal.time)) {
        mealPreferences[meal.type].times.push(meal.time);
      }
    }
    
    // Save updated preferences
    storageManager.setMealPreferences(userId, mealPreferences);
  }
  
  // Get meal preferences for a user
  private getMealPreferences(userId: string): Record<string, { count: number; ingredients: string[]; times: string[] }> {
    return storageManager.getMealPreferences(userId);
  }
  
  // Get recommended ingredients based on user preferences
  getPersonalizedIngredients(userId: string, mealType: MealType, goal: NutritionGoal): string[] {
    const mealPreferences = this.getMealPreferences(userId);
    const habit = habitTrackingService.getUserHabits(userId);
    
    // If we have preferences for this meal type, use them
    if (mealPreferences[mealType]) {
      // Combine preferred ingredients with goal-based ingredients
      const baseIngredients = this.getRecommendedIngredients(mealType, goal, habit);
      const preferredIngredients = mealPreferences[mealType].ingredients;
      
      // Mix preferred and base ingredients (70% preferred, 30% base)
      const mixedIngredients = [];
      const preferredCount = Math.ceil(preferredIngredients.length * 0.7);
      const baseCount = Math.ceil(baseIngredients.length * 0.3);
      
      mixedIngredients.push(...preferredIngredients.slice(0, preferredCount));
      mixedIngredients.push(...baseIngredients.slice(0, baseCount));
      
      return mixedIngredients;
    }
    
    // Fall back to base recommendations
    return this.getRecommendedIngredients(mealType, goal, habit);
  }
  
  // Get nutrition recommendations for a specific date
  getNutritionRecommendations(userId: string, date: Date): DailyNutrition {
    // Check if we already have nutrition data for this date
    const existingNutrition = storageManager.getNutritionForDate(date);
    if (existingNutrition) {
      return existingNutrition;
    }
    
    // Calculate new nutrition data
    const nutritionData = this.calculateDailyNutritionNeeds(userId, date);
    
    // Save to storage
    storageManager.addDailyNutrition(nutritionData);
    
    return nutritionData;
  }
  
  // Get workout-related meal recommendations
  getWorkoutMealRecommendations(userId: string, workoutSession: WorkoutSession): Meal[] {
    const habit = habitTrackingService.getUserHabits(userId);
    const goal = habit?.nutritionGoals?.[0] || 'maintenance';
    
    // Find existing nutrition data for the workout date
    const existingNutrition = storageManager.getNutritionForDate(workoutSession.date);
    
    if (existingNutrition) {
      // Return workout-related meals from existing data
      return existingNutrition.meals.filter(meal => meal.workoutRelated);
    }
    
    // Generate new workout meal recommendations
    const preWorkoutMeal: Meal = {
      id: `meal_${workoutSession.date.toISOString().split('T')[0]}_pre_workout`,
      type: 'pre_workout',
      name: this.getMealName('pre_workout', goal as NutritionGoal),
      time: this.calculatePreWorkoutMealTime(workoutSession),
      nutrients: this.calculateMealNutrients('pre_workout', goal as NutritionGoal),
      ingredients: this.getRecommendedIngredients('pre_workout', goal as NutritionGoal, habit),
      workoutRelated: true,
      workoutId: workoutSession.id,
      date: workoutSession.date
    };
    
    const postWorkoutMeal: Meal = {
      id: `meal_${workoutSession.date.toISOString().split('T')[0]}_post_workout`,
      type: 'post_workout',
      name: this.getMealName('post_workout', goal as NutritionGoal),
      time: this.calculatePostWorkoutMealTime(workoutSession),
      nutrients: this.calculateMealNutrients('post_workout', goal as NutritionGoal),
      ingredients: this.getRecommendedIngredients('post_workout', goal as NutritionGoal, habit),
      workoutRelated: true,
      workoutId: workoutSession.id,
      date: workoutSession.date
    };
    
    return [preWorkoutMeal, postWorkoutMeal];
  }
  
  // Calculate pre-workout meal time
  private calculatePreWorkoutMealTime(workoutSession: WorkoutSession): string {
    if (!workoutSession.startTime) return '01:00';
    
    const preWorkoutTime = new Date(workoutSession.startTime);
    preWorkoutTime.setHours(preWorkoutTime.getHours() - 1); // 1 hour before
    
    return preWorkoutTime.toTimeString().substring(0, 5);
  }
  
  // Calculate post-workout meal time
  private calculatePostWorkoutMealTime(workoutSession: WorkoutSession): string {
    if (!workoutSession.startTime) return '02:00';
    
    const postWorkoutTime = new Date(workoutSession.startTime);
    postWorkoutTime.setMinutes(postWorkoutTime.getMinutes() + 
      (workoutSession.duration || 60) + 30); // 30 minutes after workout ends
    
    return postWorkoutTime.toTimeString().substring(0, 5);
  }
}

export const nutritionService = NutritionService.getInstance();