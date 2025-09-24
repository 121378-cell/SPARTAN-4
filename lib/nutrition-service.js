"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionService = exports.NutritionService = void 0;
var storage_1 = require("./storage");
var habit_tracking_1 = require("./habit-tracking");
var NutritionService = /** @class */ (function () {
    function NutritionService() {
    }
    NutritionService.getInstance = function () {
        if (!NutritionService.instance) {
            NutritionService.instance = new NutritionService();
        }
        return NutritionService.instance;
    };
    // Initialize user nutrition profile
    NutritionService.prototype.initializeUserNutritionProfile = function (userId) {
        var habits = storage_1.storageManager.getUserHabits();
        var existingHabit = habits.find(function (habit) { return habit.userId === userId; });
        if (existingHabit) {
            return existingHabit;
        }
        // Extend existing habit with nutrition preferences
        var newUserHabit = {
            id: "habit_".concat(userId, "_").concat(Date.now()),
            userId: userId,
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
        storage_1.storageManager.addUserHabit(newUserHabit);
        return newUserHabit;
    };
    // Update user nutrition preferences
    NutritionService.prototype.updateUserNutritionPreferences = function (userId, preferences) {
        var habits = storage_1.storageManager.getUserHabits();
        var userHabit = habits.find(function (habit) { return habit.userId === userId; }) ||
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
        var updatedHabits = habits.map(function (habit) {
            return habit.userId === userId ? userHabit : habit;
        });
        storage_1.storageManager.setUserHabits(updatedHabits);
    };
    // Calculate daily nutrition needs based on user data and goals
    NutritionService.prototype.calculateDailyNutritionNeeds = function (userId, date) {
        var _a;
        var habit = habit_tracking_1.habitTrackingService.getUserHabits(userId);
        var workoutSessions = storage_1.storageManager.getWorkoutSessions();
        // Find workout session for the given date
        var dailyWorkout = workoutSessions.find(function (session) {
            return session.date.toDateString() === date.toDateString();
        });
        // Calculate estimated calorie expenditure if there's a workout
        var calorieExpenditure = 0;
        if (dailyWorkout) {
            // Base metabolic rate (simplified calculation)
            var userData = storage_1.storageManager.getUserData();
            if (userData) {
                var bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
                // Activity factor based on workout duration
                var activityFactor = dailyWorkout.duration ? (dailyWorkout.duration / 60) * 0.1 + 1.2 : 1.2;
                calorieExpenditure = Math.round(bmr * activityFactor);
            }
        }
        // Determine primary nutrition goal
        var primaryGoal = ((_a = habit === null || habit === void 0 ? void 0 : habit.nutritionGoals) === null || _a === void 0 ? void 0 : _a[0]) || 'maintenance';
        // Calculate base nutrients based on goal
        var baseNutrients = this.calculateBaseNutrients(userId, primaryGoal);
        // Adjust for workout if applicable
        if (dailyWorkout) {
            var workoutAdjustment = this.calculateWorkoutNutritionAdjustment(dailyWorkout, primaryGoal);
            baseNutrients.calories += workoutAdjustment.calories;
            baseNutrients.protein += workoutAdjustment.protein;
            baseNutrients.carbs += workoutAdjustment.carbs;
            baseNutrients.fats += workoutAdjustment.fats;
        }
        // Create meals based on preferences and workout schedule
        var meals = this.generateMealsForDay(userId, date, dailyWorkout, primaryGoal);
        return {
            date: date,
            totalNutrients: baseNutrients,
            meals: meals,
            calorieExpenditure: calorieExpenditure || undefined,
            nutritionGoal: primaryGoal
        };
    };
    // Generate meal recommendations for the day
    NutritionService.prototype.generateMealsForDay = function (userId, date, workoutSession, goal) {
        var _this = this;
        var habit = habit_tracking_1.habitTrackingService.getUserHabits(userId);
        var meals = [];
        // Base meal times
        var mealTimes = (habit === null || habit === void 0 ? void 0 : habit.preferredMealTimes) || ['08:00', '13:00', '19:00'];
        // Generate regular meals
        var regularMeals = ['breakfast', 'lunch', 'dinner'];
        regularMeals.forEach(function (mealType, index) {
            var time = mealTimes[index] || '08:00';
            var nutrients = _this.calculateMealNutrients(mealType, goal);
            meals.push({
                id: "meal_".concat(date.toISOString().split('T')[0], "_").concat(mealType),
                type: mealType,
                name: _this.getMealName(mealType, goal),
                time: time,
                nutrients: nutrients,
                ingredients: _this.getRecommendedIngredients(mealType, goal, habit),
                date: date
            });
        });
        // Add pre/post workout meals if there's a workout
        if (workoutSession && workoutSession.startTime) {
            var workoutTime = workoutSession.startTime;
            // Pre-workout meal (1 hour before)
            var preWorkoutTime = new Date(workoutTime);
            preWorkoutTime.setHours(preWorkoutTime.getHours() - 1);
            var preWorkoutTimeString = preWorkoutTime.toTimeString().substring(0, 5);
            meals.push({
                id: "meal_".concat(date.toISOString().split('T')[0], "_pre_workout"),
                type: 'pre_workout',
                name: this.getMealName('pre_workout', goal),
                time: preWorkoutTimeString,
                nutrients: this.calculateMealNutrients('pre_workout', goal),
                ingredients: this.getRecommendedIngredients('pre_workout', goal, habit),
                workoutRelated: true,
                workoutId: workoutSession.id,
                date: date
            });
            // Post-workout meal (30 minutes after)
            var postWorkoutTime = new Date(workoutTime);
            postWorkoutTime.setMinutes(postWorkoutTime.getMinutes() +
                (workoutSession.duration || 60) + 30);
            var postWorkoutTimeString = postWorkoutTime.toTimeString().substring(0, 5);
            meals.push({
                id: "meal_".concat(date.toISOString().split('T')[0], "_post_workout"),
                type: 'post_workout',
                name: this.getMealName('post_workout', goal),
                time: postWorkoutTimeString,
                nutrients: this.calculateMealNutrients('post_workout', goal),
                ingredients: this.getRecommendedIngredients('post_workout', goal, habit),
                workoutRelated: true,
                workoutId: workoutSession.id,
                date: date
            });
        }
        // Add snacks
        var snackTimes = mealTimes.length > 3 ? mealTimes.slice(3) : ['10:30', '15:30'];
        snackTimes.forEach(function (time, index) {
            var nutrients = _this.calculateMealNutrients('snack', goal);
            meals.push({
                id: "meal_".concat(date.toISOString().split('T')[0], "_snack_").concat(index + 1),
                type: 'snack',
                name: _this.getMealName('snack', goal),
                time: time,
                nutrients: nutrients,
                ingredients: _this.getRecommendedIngredients('snack', goal, habit),
                date: date
            });
        });
        return meals;
    };
    // Calculate base nutrients based on user goal
    NutritionService.prototype.calculateBaseNutrients = function (userId, goal) {
        var userData = storage_1.storageManager.getUserData();
        if (!userData) {
            return { calories: 2000, protein: 150, carbs: 250, fats: 70 };
        }
        // Base metabolic rate calculation
        var bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
        // Adjust based on goal
        var calories = bmr * 1.55; // Moderate activity level
        var protein, carbs, fats;
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
    };
    // Calculate nutrition adjustment for workout
    NutritionService.prototype.calculateWorkoutNutritionAdjustment = function (workoutSession, goal) {
        var duration = workoutSession.duration || 60;
        var caloriesAdjustment = duration * 8; // Roughly 8 calories per minute
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
    };
    // Calculate nutrients for a specific meal type
    NutritionService.prototype.calculateMealNutrients = function (mealType, goal) {
        // Base nutrients per meal type
        var baseNutrients = {
            breakfast: { calories: 400, protein: 25, carbs: 50, fats: 15 },
            lunch: { calories: 600, protein: 40, carbs: 60, fats: 20 },
            dinner: { calories: 500, protein: 35, carbs: 40, fats: 18 },
            snack: { calories: 200, protein: 10, carbs: 25, fats: 8 },
            pre_workout: { calories: 300, protein: 20, carbs: 40, fats: 5 },
            post_workout: { calories: 350, protein: 30, carbs: 35, fats: 8 }
        };
        var nutrients = __assign({}, baseNutrients[mealType]);
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
    };
    // Get recommended ingredients based on meal type, goal, and user preferences
    NutritionService.prototype.getRecommendedIngredients = function (mealType, goal, habit) {
        // Base ingredients by meal type and goal
        var baseIngredients = {
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
        var ingredients = __spreadArray([], baseIngredients[mealType][goal], true);
        // Add user preferred foods if they exist
        if ((habit === null || habit === void 0 ? void 0 : habit.preferredFoods) && habit.preferredFoods.length > 0) {
            // Add 1-2 preferred foods to the meal
            var preferred = habit.preferredFoods.slice(0, 2);
            ingredients = __spreadArray(__spreadArray([], ingredients, true), preferred, true);
        }
        // Filter out disliked foods
        if ((habit === null || habit === void 0 ? void 0 : habit.dislikedFoods) && habit.dislikedFoods.length > 0) {
            ingredients = ingredients.filter(function (ingredient) {
                return !habit.dislikedFoods.includes(ingredient);
            });
        }
        return ingredients;
    };
    // Get meal name based on type and goal
    NutritionService.prototype.getMealName = function (mealType, goal) {
        var mealNames = {
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
    };
    // Learn from user meal preferences
    NutritionService.prototype.learnFromMealPreferences = function (userId, meal) {
        var habits = storage_1.storageManager.getUserHabits();
        var userHabit = habits.find(function (habit) { return habit.userId === userId; }) ||
            this.initializeUserNutritionProfile(userId);
        // Add ingredients to preferred foods if not already there
        meal.ingredients.forEach(function (ingredient) {
            if (!userHabit.preferredFoods.includes(ingredient)) {
                userHabit.preferredFoods.push(ingredient);
            }
        });
        // Track meal preferences for better recommendations
        this.trackMealPreferences(userId, meal);
        // Save updated habits
        var updatedHabits = habits.map(function (habit) {
            return habit.userId === userId ? userHabit : habit;
        });
        storage_1.storageManager.setUserHabits(updatedHabits);
    };
    // Track meal preferences for better recommendations
    NutritionService.prototype.trackMealPreferences = function (userId, meal) {
        // Get existing meal preferences
        var mealPreferences = this.getMealPreferences(userId);
        // Update preferences based on meal selection
        if (!mealPreferences[meal.type]) {
            mealPreferences[meal.type] = {
                count: 1,
                ingredients: __spreadArray([], meal.ingredients, true),
                times: [meal.time]
            };
        }
        else {
            mealPreferences[meal.type].count += 1;
            // Add new ingredients
            meal.ingredients.forEach(function (ingredient) {
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
        storage_1.storageManager.setMealPreferences(userId, mealPreferences);
    };
    // Get meal preferences for a user
    NutritionService.prototype.getMealPreferences = function (userId) {
        return storage_1.storageManager.getMealPreferences(userId);
    };
    // Get recommended ingredients based on user preferences
    NutritionService.prototype.getPersonalizedIngredients = function (userId, mealType, goal) {
        var mealPreferences = this.getMealPreferences(userId);
        var habit = habit_tracking_1.habitTrackingService.getUserHabits(userId);
        // If we have preferences for this meal type, use them
        if (mealPreferences[mealType]) {
            // Combine preferred ingredients with goal-based ingredients
            var baseIngredients = this.getRecommendedIngredients(mealType, goal, habit);
            var preferredIngredients = mealPreferences[mealType].ingredients;
            // Mix preferred and base ingredients (70% preferred, 30% base)
            var mixedIngredients = [];
            var preferredCount = Math.ceil(preferredIngredients.length * 0.7);
            var baseCount = Math.ceil(baseIngredients.length * 0.3);
            mixedIngredients.push.apply(mixedIngredients, preferredIngredients.slice(0, preferredCount));
            mixedIngredients.push.apply(mixedIngredients, baseIngredients.slice(0, baseCount));
            return mixedIngredients;
        }
        // Fall back to base recommendations
        return this.getRecommendedIngredients(mealType, goal, habit);
    };
    // Get nutrition recommendations for a specific date
    NutritionService.prototype.getNutritionRecommendations = function (userId, date) {
        // Check if we already have nutrition data for this date
        var existingNutrition = storage_1.storageManager.getNutritionForDate(date);
        if (existingNutrition) {
            return existingNutrition;
        }
        // Calculate new nutrition data
        var nutritionData = this.calculateDailyNutritionNeeds(userId, date);
        // Save to storage
        storage_1.storageManager.addDailyNutrition(nutritionData);
        return nutritionData;
    };
    // Get workout-related meal recommendations
    NutritionService.prototype.getWorkoutMealRecommendations = function (userId, workoutSession) {
        var _a;
        var habit = habit_tracking_1.habitTrackingService.getUserHabits(userId);
        var goal = ((_a = habit === null || habit === void 0 ? void 0 : habit.nutritionGoals) === null || _a === void 0 ? void 0 : _a[0]) || 'maintenance';
        // Find existing nutrition data for the workout date
        var existingNutrition = storage_1.storageManager.getNutritionForDate(workoutSession.date);
        if (existingNutrition) {
            // Return workout-related meals from existing data
            return existingNutrition.meals.filter(function (meal) { return meal.workoutRelated; });
        }
        // Generate new workout meal recommendations
        var preWorkoutMeal = {
            id: "meal_".concat(workoutSession.date.toISOString().split('T')[0], "_pre_workout"),
            type: 'pre_workout',
            name: this.getMealName('pre_workout', goal),
            time: this.calculatePreWorkoutMealTime(workoutSession),
            nutrients: this.calculateMealNutrients('pre_workout', goal),
            ingredients: this.getRecommendedIngredients('pre_workout', goal, habit),
            workoutRelated: true,
            workoutId: workoutSession.id,
            date: workoutSession.date
        };
        var postWorkoutMeal = {
            id: "meal_".concat(workoutSession.date.toISOString().split('T')[0], "_post_workout"),
            type: 'post_workout',
            name: this.getMealName('post_workout', goal),
            time: this.calculatePostWorkoutMealTime(workoutSession),
            nutrients: this.calculateMealNutrients('post_workout', goal),
            ingredients: this.getRecommendedIngredients('post_workout', goal, habit),
            workoutRelated: true,
            workoutId: workoutSession.id,
            date: workoutSession.date
        };
        return [preWorkoutMeal, postWorkoutMeal];
    };
    // Calculate pre-workout meal time
    NutritionService.prototype.calculatePreWorkoutMealTime = function (workoutSession) {
        if (!workoutSession.startTime)
            return '01:00';
        var preWorkoutTime = new Date(workoutSession.startTime);
        preWorkoutTime.setHours(preWorkoutTime.getHours() - 1); // 1 hour before
        return preWorkoutTime.toTimeString().substring(0, 5);
    };
    // Calculate post-workout meal time
    NutritionService.prototype.calculatePostWorkoutMealTime = function (workoutSession) {
        if (!workoutSession.startTime)
            return '02:00';
        var postWorkoutTime = new Date(workoutSession.startTime);
        postWorkoutTime.setMinutes(postWorkoutTime.getMinutes() +
            (workoutSession.duration || 60) + 30); // 30 minutes after workout ends
        return postWorkoutTime.toTimeString().substring(0, 5);
    };
    return NutritionService;
}());
exports.NutritionService = NutritionService;
exports.nutritionService = NutritionService.getInstance();
