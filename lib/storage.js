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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageManager = exports.StorageManager = void 0;
exports.useStorage = useStorage;
// Claves para localStorage
var STORAGE_KEYS = {
    USER_DATA: 'spartan4_user_data',
    WORKOUT_PLANS: 'spartan4_workout_plans',
    PROGRESS_DATA: 'spartan4_progress_data',
    RECIPES: 'spartan4_recipes',
    BLOOD_ANALYSES: 'spartan4_blood_analyses',
    OVERLOAD_DATA: 'spartan4_overload_data',
    CORRECTIVE_EXERCISES: 'spartan4_corrective_exercises',
    WORKOUT_SESSIONS: 'spartan4_workout_sessions',
    USER_HABITS: 'spartan4_user_habits',
    SETTINGS: 'spartan4_settings',
    DAILY_NUTRITION: 'spartan4_daily_nutrition',
    MEAL_PREFERENCES: 'spartan4_meal_preferences',
    RECOVERY_METRICS: 'spartan4_recovery_metrics',
    RECOVERY_ANALYSES: 'spartan4_recovery_analyses',
    PROGRESSION_METRICS: 'spartan4_progression_metrics',
    PROGRESSION_HISTORY: 'spartan4_progression_history',
    PROGRESSION_PLANS: 'spartan4_progression_plans',
    NEUROFEEDBACK_PROTOCOLS: 'spartan4_neurofeedback_protocols',
    NEURAL_INTERFACE_DEVICES: 'spartan4_neural_interface_devices',
    ENVIRONMENTAL_DATA: 'spartan4_environmental_data',
    ENHANCED_WEARABLE_DATA: 'spartan4_enhanced_wearable_data',
    EXTERNAL_LIFE_VARIABLES: 'spartan4_external_life_variables'
};
// Clase para manejar el almacenamiento
var StorageManager = /** @class */ (function () {
    function StorageManager() {
    }
    StorageManager.getInstance = function () {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    };
    // Métodos genéricos para localStorage
    StorageManager.prototype.getItem = function (key, defaultValue) {
        try {
            var item = localStorage.getItem(key);
            if (!item)
                return defaultValue;
            // Custom reviver to convert date strings back to Date objects
            var reviver = function (key, value) {
                // Check if the value looks like an ISO date string
                if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
                    var date = new Date(value);
                    // Check if it's a valid date
                    if (!isNaN(date.getTime())) {
                        return date;
                    }
                }
                return value;
            };
            return JSON.parse(item, reviver);
        }
        catch (error) {
            console.error("Error reading from localStorage key ".concat(key, ":"), error);
            return defaultValue;
        }
    };
    StorageManager.prototype.setItem = function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error("Error writing to localStorage key ".concat(key, ":"), error);
        }
    };
    StorageManager.prototype.removeItem = function (key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error("Error removing localStorage key ".concat(key, ":"), error);
        }
    };
    // Métodos específicos para cada tipo de dato
    // UserData
    StorageManager.prototype.getUserData = function () {
        return this.getItem(STORAGE_KEYS.USER_DATA, null);
    };
    StorageManager.prototype.setUserData = function (userData) {
        this.setItem(STORAGE_KEYS.USER_DATA, userData);
    };
    StorageManager.prototype.clearUserData = function () {
        this.removeItem(STORAGE_KEYS.USER_DATA);
    };
    // WorkoutPlans
    StorageManager.prototype.getWorkoutPlans = function () {
        return this.getItem(STORAGE_KEYS.WORKOUT_PLANS, []);
    };
    StorageManager.prototype.setWorkoutPlans = function (plans) {
        this.setItem(STORAGE_KEYS.WORKOUT_PLANS, plans);
    };
    StorageManager.prototype.addWorkoutPlan = function (plan) {
        var plans = this.getWorkoutPlans();
        plans.unshift(plan); // Añadir al principio
        this.setWorkoutPlans(plans);
    };
    StorageManager.prototype.updateWorkoutPlan = function (id, updates) {
        var plans = this.getWorkoutPlans();
        var index = plans.findIndex(function (plan) { return plan.id === id; });
        if (index !== -1) {
            plans[index] = __assign(__assign(__assign({}, plans[index]), updates), { updatedAt: new Date() });
            this.setWorkoutPlans(plans);
        }
    };
    StorageManager.prototype.deleteWorkoutPlan = function (id) {
        var plans = this.getWorkoutPlans().filter(function (plan) { return plan.id !== id; });
        this.setWorkoutPlans(plans);
    };
    // ProgressData
    StorageManager.prototype.getProgressData = function () {
        return this.getItem(STORAGE_KEYS.PROGRESS_DATA, []);
    };
    StorageManager.prototype.setProgressData = function (progress) {
        this.setItem(STORAGE_KEYS.PROGRESS_DATA, progress);
    };
    StorageManager.prototype.addProgressData = function (progress) {
        var data = this.getProgressData();
        data.unshift(progress);
        this.setProgressData(data);
    };
    // Recipes
    StorageManager.prototype.getRecipes = function () {
        return this.getItem(STORAGE_KEYS.RECIPES, []);
    };
    StorageManager.prototype.setRecipes = function (recipes) {
        this.setItem(STORAGE_KEYS.RECIPES, recipes);
    };
    StorageManager.prototype.addRecipe = function (recipe) {
        var recipes = this.getRecipes();
        recipes.unshift(recipe);
        this.setRecipes(recipes);
    };
    // BloodTestAnalyses
    StorageManager.prototype.getBloodAnalyses = function () {
        return this.getItem(STORAGE_KEYS.BLOOD_ANALYSES, []);
    };
    StorageManager.prototype.setBloodAnalyses = function (analyses) {
        this.setItem(STORAGE_KEYS.BLOOD_ANALYSES, analyses);
    };
    StorageManager.prototype.addBloodAnalysis = function (analysis) {
        var analyses = this.getBloodAnalyses();
        analyses.unshift(analysis);
        this.setBloodAnalyses(analyses);
    };
    // OverloadData
    StorageManager.prototype.getOverloadData = function () {
        return this.getItem(STORAGE_KEYS.OVERLOAD_DATA, []);
    };
    StorageManager.prototype.setOverloadData = function (data) {
        this.setItem(STORAGE_KEYS.OVERLOAD_DATA, data);
    };
    StorageManager.prototype.addOverloadData = function (data) {
        var existing = this.getOverloadData();
        existing.push(data);
        this.setOverloadData(existing);
    };
    // CorrectiveExercises
    StorageManager.prototype.getCorrectiveExercises = function () {
        return this.getItem(STORAGE_KEYS.CORRECTIVE_EXERCISES, []);
    };
    StorageManager.prototype.setCorrectiveExercises = function (exercises) {
        this.setItem(STORAGE_KEYS.CORRECTIVE_EXERCISES, exercises);
    };
    StorageManager.prototype.addCorrectiveExercise = function (exercise) {
        var exercises = this.getCorrectiveExercises();
        exercises.push(exercise);
        this.setCorrectiveExercises(exercises);
    };
    // Workout Sessions
    StorageManager.prototype.getWorkoutSessions = function () {
        return this.getItem(STORAGE_KEYS.WORKOUT_SESSIONS, []);
    };
    StorageManager.prototype.setWorkoutSessions = function (sessions) {
        this.setItem(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
    };
    StorageManager.prototype.addWorkoutSession = function (session) {
        var sessions = this.getWorkoutSessions();
        sessions.unshift(session);
        this.setWorkoutSessions(sessions);
    };
    // User Habits
    StorageManager.prototype.getUserHabits = function () {
        return this.getItem(STORAGE_KEYS.USER_HABITS, []);
    };
    StorageManager.prototype.setUserHabits = function (habits) {
        this.setItem(STORAGE_KEYS.USER_HABITS, habits);
    };
    StorageManager.prototype.addUserHabit = function (habit) {
        var habits = this.getUserHabits();
        habits.push(habit);
        this.setUserHabits(habits);
    };
    // Daily Nutrition
    StorageManager.prototype.getDailyNutrition = function () {
        return this.getItem(STORAGE_KEYS.DAILY_NUTRITION, []);
    };
    StorageManager.prototype.setDailyNutrition = function (nutrition) {
        this.setItem(STORAGE_KEYS.DAILY_NUTRITION, nutrition);
    };
    StorageManager.prototype.addDailyNutrition = function (nutrition) {
        var dailyNutrition = this.getDailyNutrition();
        dailyNutrition.unshift(nutrition);
        this.setDailyNutrition(dailyNutrition);
    };
    // Get nutrition for a specific date
    StorageManager.prototype.getNutritionForDate = function (date) {
        var dailyNutrition = this.getDailyNutrition();
        var dateStr = date.toISOString().split('T')[0];
        return dailyNutrition.find(function (n) {
            // Handle both Date objects and date strings
            var nutritionDateStr = n.date instanceof Date
                ? n.date.toISOString().split('T')[0]
                : new Date(n.date).toISOString().split('T')[0];
            return nutritionDateStr === dateStr;
        });
    };
    // Settings
    StorageManager.prototype.getSettings = function () {
        return this.getItem(STORAGE_KEYS.SETTINGS, {
            theme: 'system',
            language: 'es',
            notifications: {
                workoutReminders: true,
                nutritionTips: true,
                progressUpdates: true
            },
            privacy: {
                dataSharing: false,
                analytics: true
            }
        });
    };
    // Meal Preferences
    StorageManager.prototype.getMealPreferences = function (userId) {
        return this.getItem("meal_preferences_".concat(userId), {});
    };
    StorageManager.prototype.setMealPreferences = function (userId, preferences) {
        this.setItem("meal_preferences_".concat(userId), preferences);
    };
    StorageManager.prototype.setSettings = function (settings) {
        this.setItem(STORAGE_KEYS.SETTINGS, settings);
    };
    StorageManager.prototype.updateSettings = function (updates) {
        var current = this.getSettings();
        this.setSettings(__assign(__assign({}, current), updates));
    };
    // Métodos de utilidad
    StorageManager.prototype.clearAllData = function () {
        var _this = this;
        Object.values(STORAGE_KEYS).forEach(function (key) {
            _this.removeItem(key);
        });
    };
    StorageManager.prototype.exportData = function () {
        var data = {
            userData: this.getUserData(),
            workoutPlans: this.getWorkoutPlans(),
            progressData: this.getProgressData(),
            recipes: this.getRecipes(),
            bloodAnalyses: this.getBloodAnalyses(),
            overloadData: this.getOverloadData(),
            correctiveExercises: this.getCorrectiveExercises(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        return JSON.stringify(data, null, 2);
    };
    StorageManager.prototype.importData = function (jsonData) {
        try {
            var data = JSON.parse(jsonData);
            if (data.userData)
                this.setUserData(data.userData);
            if (data.workoutPlans)
                this.setWorkoutPlans(data.workoutPlans);
            if (data.progressData)
                this.setProgressData(data.progressData);
            if (data.recipes)
                this.setRecipes(data.recipes);
            if (data.bloodAnalyses)
                this.setBloodAnalyses(data.bloodAnalyses);
            if (data.overloadData)
                this.setOverloadData(data.overloadData);
            if (data.correctiveExercises)
                this.setCorrectiveExercises(data.correctiveExercises);
            if (data.settings)
                this.setSettings(data.settings);
            return true;
        }
        catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    };
    // Métodos de sincronización (para futuras implementaciones con backend)
    StorageManager.prototype.syncWithBackend = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implementar sincronización con backend
                console.log('Sync with backend not implemented yet');
                return [2 /*return*/, false];
            });
        });
    };
    StorageManager.prototype.backupToCloud = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implementar backup a la nube
                console.log('Cloud backup not implemented yet');
                return [2 /*return*/, false];
            });
        });
    };
    // Recovery Metrics
    StorageManager.prototype.getRecoveryMetrics = function () {
        return this.getItem(STORAGE_KEYS.RECOVERY_METRICS, []);
    };
    StorageManager.prototype.setRecoveryMetrics = function (metrics) {
        this.setItem(STORAGE_KEYS.RECOVERY_METRICS, metrics);
    };
    StorageManager.prototype.addRecoveryMetric = function (metric) {
        var metrics = this.getRecoveryMetrics();
        metrics.unshift(metric);
        this.setRecoveryMetrics(metrics);
    };
    // Get recovery metrics for a specific date
    StorageManager.prototype.getRecoveryMetricsForDate = function (date) {
        var metrics = this.getRecoveryMetrics();
        var dateStr = date.toISOString().split('T')[0];
        return metrics.find(function (m) {
            // Handle both Date objects and date strings
            var metricDateStr = m.date instanceof Date
                ? m.date.toISOString().split('T')[0]
                : new Date(m.date).toISOString().split('T')[0];
            return metricDateStr === dateStr;
        });
    };
    // Recovery Analyses
    StorageManager.prototype.getRecoveryAnalyses = function () {
        return this.getItem(STORAGE_KEYS.RECOVERY_ANALYSES, []);
    };
    StorageManager.prototype.setRecoveryAnalyses = function (analyses) {
        this.setItem(STORAGE_KEYS.RECOVERY_ANALYSES, analyses);
    };
    StorageManager.prototype.addRecoveryAnalysis = function (analysis) {
        var analyses = this.getRecoveryAnalyses();
        analyses.unshift(analysis);
        this.setRecoveryAnalyses(analyses);
    };
    // Get recovery analysis for a specific date
    StorageManager.prototype.getRecoveryAnalysisForDate = function (date) {
        var analyses = this.getRecoveryAnalyses();
        var dateStr = date.toISOString().split('T')[0];
        return analyses.find(function (a) {
            // Handle both Date objects and date strings
            var analysisDateStr = a.date instanceof Date
                ? a.date.toISOString().split('T')[0]
                : new Date(a.date).toISOString().split('T')[0];
            return analysisDateStr === dateStr;
        });
    };
    // Load Progression Metrics
    StorageManager.prototype.getProgressionMetrics = function () {
        return this.getItem(STORAGE_KEYS.PROGRESSION_METRICS, []);
    };
    StorageManager.prototype.setProgressionMetrics = function (metrics) {
        this.setItem(STORAGE_KEYS.PROGRESSION_METRICS, metrics);
    };
    StorageManager.prototype.addProgressionMetric = function (metric) {
        var metrics = this.getProgressionMetrics();
        metrics.unshift(metric);
        this.setProgressionMetrics(metrics);
    };
    // Load Progression History
    StorageManager.prototype.getProgressionHistory = function () {
        return this.getItem(STORAGE_KEYS.PROGRESSION_HISTORY, []);
    };
    StorageManager.prototype.setProgressionHistory = function (history) {
        this.setItem(STORAGE_KEYS.PROGRESSION_HISTORY, history);
    };
    StorageManager.prototype.addProgressionHistory = function (history) {
        var historyItems = this.getProgressionHistory();
        historyItems.unshift(history);
        this.setProgressionHistory(historyItems);
    };
    // Load Progression Plans
    StorageManager.prototype.getProgressionPlans = function () {
        return this.getItem(STORAGE_KEYS.PROGRESSION_PLANS, []);
    };
    StorageManager.prototype.setProgressionPlans = function (plans) {
        this.setItem(STORAGE_KEYS.PROGRESSION_PLANS, plans);
    };
    StorageManager.prototype.addProgressionPlan = function (plan) {
        var plans = this.getProgressionPlans();
        plans.unshift(plan);
        this.setProgressionPlans(plans);
    };
    // Neurofeedback Protocols
    StorageManager.prototype.getNeurofeedbackProtocols = function () {
        return this.getItem(STORAGE_KEYS.NEUROFEEDBACK_PROTOCOLS, []);
    };
    StorageManager.prototype.setNeurofeedbackProtocols = function (protocols) {
        this.setItem(STORAGE_KEYS.NEUROFEEDBACK_PROTOCOLS, protocols);
    };
    StorageManager.prototype.addNeurofeedbackProtocol = function (protocol) {
        var protocols = this.getNeurofeedbackProtocols();
        protocols.unshift(protocol);
        this.setNeurofeedbackProtocols(protocols);
    };
    // Neural Interface Devices
    StorageManager.prototype.getNeuralInterfaceDevices = function () {
        return this.getItem(STORAGE_KEYS.NEURAL_INTERFACE_DEVICES, []);
    };
    StorageManager.prototype.setNeuralInterfaceDevices = function (devices) {
        this.setItem(STORAGE_KEYS.NEURAL_INTERFACE_DEVICES, devices);
    };
    StorageManager.prototype.addNeuralInterfaceDevice = function (device) {
        var devices = this.getNeuralInterfaceDevices();
        devices.unshift(device);
        this.setNeuralInterfaceDevices(devices);
    };
    // Environmental Data
    StorageManager.prototype.getEnvironmentalData = function () {
        return this.getItem(STORAGE_KEYS.ENVIRONMENTAL_DATA, null);
    };
    StorageManager.prototype.setEnvironmentalData = function (data) {
        this.setItem(STORAGE_KEYS.ENVIRONMENTAL_DATA, data);
    };
    // Enhanced Wearable Data
    StorageManager.prototype.getEnhancedWearableData = function () {
        return this.getItem(STORAGE_KEYS.ENHANCED_WEARABLE_DATA, null);
    };
    StorageManager.prototype.setEnhancedWearableData = function (data) {
        this.setItem(STORAGE_KEYS.ENHANCED_WEARABLE_DATA, data);
    };
    // External Life Variables
    StorageManager.prototype.getExternalLifeVariables = function () {
        return this.getItem(STORAGE_KEYS.EXTERNAL_LIFE_VARIABLES, null);
    };
    StorageManager.prototype.setExternalLifeVariables = function (data) {
        this.setItem(STORAGE_KEYS.EXTERNAL_LIFE_VARIABLES, data);
    };
    return StorageManager;
}());
exports.StorageManager = StorageManager;
// Exportar instancia singleton
exports.storageManager = StorageManager.getInstance();
// Hook personalizado para usar el storage en React
function useStorage() {
    return exports.storageManager;
}
