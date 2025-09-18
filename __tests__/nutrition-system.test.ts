import { nutritionService } from '../lib/nutrition-service';
import { storageManager } from '../lib/storage';
import { habitTrackingService } from '../lib/habit-tracking';
import type { UserHabit, WorkoutSession, NutritionGoal, MealType, DailyNutrition } from '../lib/types';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Nutrition System', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Initialize user data
    storageManager.setUserData({
      name: 'Test User',
      age: 30,
      weight: 75,
      height: 180,
      fitnessLevel: 'intermediate',
      goals: ['Muscle Gain', 'Strength']
    });
  });

  afterEach(() => {
    // Clear all data after each test
    storageManager.clearAllData();
  });

  test('should initialize user nutrition profile', () => {
    const userId = 'test-user';
    const habit = nutritionService.initializeUserNutritionProfile(userId);
    
    expect(habit.userId).toBe(userId);
    expect(habit.preferredMealTimes).toEqual(['08:00', '13:00', '19:00']);
    expect(habit.nutritionGoals).toEqual(['maintenance']);
  });

  test('should update user nutrition preferences', () => {
    const userId = 'test-user';
    nutritionService.initializeUserNutritionProfile(userId);
    
    const preferences = {
      preferredFoods: ['Chicken', 'Rice'],
      dislikedFoods: ['Broccoli'],
      dietaryRestrictions: ['Gluten-free'],
      nutritionGoals: ['muscle_mass'],
      preferredMealTimes: ['07:00', '12:00', '18:00']
    };
    
    nutritionService.updateUserNutritionPreferences(userId, preferences);
    
    const updatedHabit = habitTrackingService.getUserHabits(userId);
    expect(updatedHabit?.preferredFoods).toEqual(['Chicken', 'Rice']);
    expect(updatedHabit?.dislikedFoods).toEqual(['Broccoli']);
    expect(updatedHabit?.dietaryRestrictions).toEqual(['Gluten-free']);
    expect(updatedHabit?.nutritionGoals).toEqual(['muscle_mass']);
    expect(updatedHabit?.preferredMealTimes).toEqual(['07:00', '12:00', '18:00']);
  });

  test('should calculate daily nutrition needs based on user data and goals', () => {
    const userId = 'test-user';
    const date = new Date();
    
    // Initialize and update user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    nutritionService.updateUserNutritionPreferences(userId, {
      nutritionGoals: ['muscle_mass']
    });
    
    const dailyNutrition = nutritionService.calculateDailyNutritionNeeds(userId, date);
    
    expect(dailyNutrition.date).toEqual(date);
    expect(dailyNutrition.totalNutrients.calories).toBeGreaterThan(0);
    expect(dailyNutrition.totalNutrients.protein).toBeGreaterThan(0);
    expect(dailyNutrition.totalNutrients.carbs).toBeGreaterThan(0);
    expect(dailyNutrition.totalNutrients.fats).toBeGreaterThan(0);
    expect(dailyNutrition.nutritionGoal).toBe('muscle_mass');
  });

  test('should generate meals for the day', () => {
    const userId = 'test-user';
    const date = new Date();
    
    // Initialize and update user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    nutritionService.updateUserNutritionPreferences(userId, {
      nutritionGoals: ['strength']
    });
    
    const dailyNutrition = nutritionService.calculateDailyNutritionNeeds(userId, date);
    
    expect(dailyNutrition.meals.length).toBeGreaterThan(0);
    
    // Check that we have regular meals
    const breakfast = dailyNutrition.meals.find(meal => meal.type === 'breakfast');
    const lunch = dailyNutrition.meals.find(meal => meal.type === 'lunch');
    const dinner = dailyNutrition.meals.find(meal => meal.type === 'dinner');
    
    expect(breakfast).toBeDefined();
    expect(lunch).toBeDefined();
    expect(dinner).toBeDefined();
    
    // Check that meals have proper nutrients
    expect(breakfast?.nutrients.calories).toBeGreaterThan(0);
    expect(breakfast?.nutrients.protein).toBeGreaterThan(0);
    expect(breakfast?.nutrients.carbs).toBeGreaterThan(0);
    expect(breakfast?.nutrients.fats).toBeGreaterThan(0);
  });

  test('should generate workout-related meals when there is a workout session', () => {
    const userId = 'test-user';
    const date = new Date();
    
    // Initialize and update user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    nutritionService.updateUserNutritionPreferences(userId, {
      nutritionGoals: ['endurance']
    });
    
    // Create a workout session
    const workoutSession: WorkoutSession = {
      id: 'test-session',
      workoutPlanId: 'test-plan',
      date: date,
      startTime: new Date(date.getTime() - 3600000), // 1 hour ago
      endTime: new Date(),
      duration: 60,
      exercises: [],
      notes: ''
    };
    
    // Record the workout session
    habitTrackingService.recordWorkoutSession(workoutSession);
    
    const dailyNutrition = nutritionService.calculateDailyNutritionNeeds(userId, date);
    
    // Check that we have workout-related meals
    const preWorkoutMeal = dailyNutrition.meals.find(meal => meal.type === 'pre_workout');
    const postWorkoutMeal = dailyNutrition.meals.find(meal => meal.type === 'post_workout');
    
    expect(preWorkoutMeal).toBeDefined();
    expect(postWorkoutMeal).toBeDefined();
    expect(preWorkoutMeal?.workoutRelated).toBe(true);
    expect(postWorkoutMeal?.workoutRelated).toBe(true);
  });

  test('should learn from meal preferences', () => {
    const userId = 'test-user';
    
    // Initialize user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    
    // Create a sample meal
    const meal = {
      id: 'test-meal',
      type: 'lunch' as MealType,
      name: 'Protein Bowl',
      time: '12:00',
      nutrients: {
        calories: 500,
        protein: 40,
        carbs: 30,
        fats: 15
      },
      ingredients: ['Chicken', 'Quinoa', 'Vegetables'],
      date: new Date()
    };
    
    // Learn from this meal
    nutritionService.learnFromMealPreferences(userId, meal);
    
    // Check that the ingredients were added to preferred foods
    const habit = habitTrackingService.getUserHabits(userId);
    expect(habit?.preferredFoods).toContain('Chicken');
    expect(habit?.preferredFoods).toContain('Quinoa');
    expect(habit?.preferredFoods).toContain('Vegetables');
  });

  test('should get personalized ingredients based on user preferences', () => {
    const userId = 'test-user';
    
    // Initialize and update user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    nutritionService.updateUserNutritionPreferences(userId, {
      preferredFoods: ['Salmon', 'Sweet Potato']
    });
    
    const ingredients = nutritionService.getPersonalizedIngredients(userId, 'dinner', 'muscle_mass');
    
    expect(ingredients.length).toBeGreaterThan(0);
    // Should include both preferred foods and goal-based ingredients
    expect(ingredients).toContain('Salmon');
  });

  test('should get nutrition recommendations for a specific date', () => {
    const userId = 'test-user';
    const date = new Date();
    
    // Initialize and update user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    nutritionService.updateUserNutritionPreferences(userId, {
      nutritionGoals: ['definition']
    });
    
    const nutritionData = nutritionService.getNutritionRecommendations(userId, date);
    
    expect(nutritionData.date).toEqual(date);
    expect(nutritionData.totalNutrients.calories).toBeGreaterThan(0);
    expect(nutritionData.meals.length).toBeGreaterThan(0);
    expect(nutritionData.nutritionGoal).toBe('definition');
  });

  test('should store and retrieve daily nutrition data', () => {
    const userId = 'test-user';
    const date = new Date();
    
    // Initialize and update user nutrition profile
    nutritionService.initializeUserNutritionProfile(userId);
    nutritionService.updateUserNutritionPreferences(userId, {
      nutritionGoals: ['strength']
    });
    
    const nutritionData = nutritionService.getNutritionRecommendations(userId, date);
    
    // Store the nutrition data
    storageManager.addDailyNutrition(nutritionData);
    
    // Retrieve the nutrition data
    const retrievedData = storageManager.getNutritionForDate(date);
    
    expect(retrievedData).toBeDefined();
    expect(retrievedData?.date).toEqual(date);
    expect(retrievedData?.totalNutrients.calories).toBe(nutritionData.totalNutrients.calories);
  });
});