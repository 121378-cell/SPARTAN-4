"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitTrackingService = exports.HabitTrackingService = void 0;
var storage_1 = require("./storage");
var recovery_service_1 = require("./recovery-service");
var load_progression_service_1 = require("./load-progression-service");
var HabitTrackingService = /** @class */ (function () {
    function HabitTrackingService() {
    }
    HabitTrackingService.getInstance = function () {
        if (!HabitTrackingService.instance) {
            HabitTrackingService.instance = new HabitTrackingService();
        }
        return HabitTrackingService.instance;
    };
    // Initialize user habit tracking
    HabitTrackingService.prototype.initializeUserHabitTracking = function (userId) {
        var habits = storage_1.storageManager.getUserHabits();
        var existingHabit = habits.find(function (habit) { return habit.userId === userId; });
        if (existingHabit) {
            return existingHabit;
        }
        var newUserHabit = {
            id: "habit_".concat(userId, "_").concat(Date.now()),
            userId: userId,
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
        storage_1.storageManager.addUserHabit(newUserHabit);
        return newUserHabit;
    };
    // Record a workout session
    HabitTrackingService.prototype.recordWorkoutSession = function (session) {
        storage_1.storageManager.addWorkoutSession(session);
        this.updateUserHabits(session);
        // Record progression metrics
        load_progression_service_1.loadProgressionService.recordProgressionMetrics(session);
    };
    // Update user habits based on workout session
    HabitTrackingService.prototype.updateUserHabits = function (session) {
        var habits = storage_1.storageManager.getUserHabits();
        var userId = 'default-user'; // In a real app, this would come from auth
        var userHabit = habits.find(function (habit) { return habit.userId === userId; }) ||
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
            var time = session.startTime.toTimeString().substring(0, 5); // HH:MM format
            if (!userHabit.preferredTrainingTimes.includes(time)) {
                userHabit.preferredTrainingTimes.push(time);
            }
        }
        // Update preferred training days (0-6 for Sunday-Saturday)
        var day = session.date.getDay();
        if (!userHabit.preferredTrainingDays.includes(day)) {
            userHabit.preferredTrainingDays.push(day);
        }
        // Update average training duration
        if (session.duration) {
            var totalDuration = (userHabit.averageTrainingDuration * (userHabit.trainingFrequency - 1)) + session.duration;
            userHabit.averageTrainingDuration = totalDuration / userHabit.trainingFrequency;
        }
        // Save updated habits
        var updatedHabits = habits.map(function (habit) {
            return habit.userId === userId ? userHabit : habit;
        });
        storage_1.storageManager.setUserHabits(updatedHabits);
    };
    // Get user habits
    HabitTrackingService.prototype.getUserHabits = function (userId) {
        var habits = storage_1.storageManager.getUserHabits();
        return habits.find(function (habit) { return habit.userId === userId; });
    };
    // Predict next training time based on habits
    HabitTrackingService.prototype.predictNextTrainingTime = function (userId) {
        var habit = this.getUserHabits(userId);
        if (!habit || habit.preferredTrainingTimes.length === 0) {
            return null;
        }
        // Simple prediction: use the most common time
        var timeFrequency = {};
        habit.preferredTrainingTimes.forEach(function (time) {
            timeFrequency[time] = (timeFrequency[time] || 0) + 1;
        });
        var mostFrequentTime = Object.entries(timeFrequency)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })[0][0];
        // Create a date for tomorrow with the predicted time
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var _a = mostFrequentTime.split(':').map(Number), hours = _a[0], minutes = _a[1];
        tomorrow.setHours(hours, minutes, 0, 0);
        return tomorrow;
    };
    // Get recommended training days
    HabitTrackingService.prototype.getRecommendedTrainingDays = function (userId) {
        var habit = this.getUserHabits(userId);
        return habit ? habit.preferredTrainingDays : [];
    };
    // Get average training duration
    HabitTrackingService.prototype.getAverageTrainingDuration = function (userId) {
        var habit = this.getUserHabits(userId);
        return habit ? habit.averageTrainingDuration : 0;
    };
    // Enhanced prediction with more sophisticated pattern recognition
    HabitTrackingService.prototype.predictTrainingPatterns = function (userId) {
        var habit = this.getUserHabits(userId);
        if (!habit) {
            return {
                nextLikelySession: null,
                recommendedTimes: [],
                recommendedDays: [],
                averageDuration: 0
            };
        }
        // Analyze time patterns
        var timeFrequency = {};
        habit.preferredTrainingTimes.forEach(function (time) {
            timeFrequency[time] = (timeFrequency[time] || 0) + 1;
        });
        // Get top 3 most frequent times
        var recommendedTimes = Object.entries(timeFrequency)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })
            .slice(0, 3)
            .map(function (_a) {
            var time = _a[0];
            return time;
        });
        // Analyze day patterns
        var dayFrequency = {};
        habit.preferredTrainingDays.forEach(function (day) {
            dayFrequency[day] = (dayFrequency[day] || 0) + 1;
        });
        // Get top 3 most frequent days
        var recommendedDays = Object.entries(dayFrequency)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })
            .slice(0, 3)
            .map(function (_a) {
            var day = _a[0];
            return parseInt(day);
        });
        // Predict next session based on most recent patterns
        var nextLikelySession = null;
        if (recommendedTimes.length > 0 && recommendedDays.length > 0) {
            // Use the most frequent time and day
            var mostFrequentTime = recommendedTimes[0];
            var mostFrequentDay = recommendedDays[0];
            nextLikelySession = new Date();
            var today = nextLikelySession.getDay();
            // Calculate days until next occurrence of preferred day
            var daysUntil = mostFrequentDay - today;
            if (daysUntil <= 0) {
                daysUntil += 7; // Next week
            }
            nextLikelySession.setDate(nextLikelySession.getDate() + daysUntil);
            var _a = mostFrequentTime.split(':').map(Number), hours = _a[0], minutes = _a[1];
            nextLikelySession.setHours(hours, minutes, 0, 0);
        }
        return {
            nextLikelySession: nextLikelySession,
            recommendedTimes: recommendedTimes,
            recommendedDays: recommendedDays,
            averageDuration: habit.averageTrainingDuration
        };
    };
    // Generate personalized recommendations based on habits
    HabitTrackingService.prototype.generateRecommendations = function (userId) {
        var habit = this.getUserHabits(userId);
        if (!habit) {
            return {
                workoutReminders: [],
                restRecommendations: [],
                nutritionTips: []
            };
        }
        var recommendations = {
            workoutReminders: [],
            restRecommendations: [],
            nutritionTips: []
        };
        // Workout reminders based on preferred times
        habit.preferredTrainingTimes.forEach(function (time) {
            recommendations.workoutReminders.push("Recordatorio: Entreno programado a las ".concat(time));
        });
        // Rest recommendations based on training frequency
        if (habit.trainingFrequency >= 5) {
            recommendations.restRecommendations.push("Considera un día de descanso activo esta semana");
        }
        else if (habit.trainingFrequency <= 2) {
            recommendations.restRecommendations.push("Intenta aumentar la frecuencia de entrenamiento para mejores resultados");
        }
        // Add recovery-based rest recommendations
        var today = new Date();
        var recoveryAnalysis = recovery_service_1.recoveryService.getRecoveryAnalysis(userId, today);
        if (recoveryAnalysis) {
            if (recoveryAnalysis.fatigueLevel === 'extreme' || recoveryAnalysis.fatigueLevel === 'high') {
                recommendations.restRecommendations.push("Nivel de fatiga: ".concat(recoveryAnalysis.fatigueLevel, ". Considera reducir la intensidad o tomar un d\u00EDa de descanso."));
            }
            if (recoveryAnalysis.recoveryScore < 50) {
                recommendations.restRecommendations.push("Puntaje de recuperaci\u00F3n bajo (".concat(recoveryAnalysis.recoveryScore, "/100). Prioriza la recuperaci\u00F3n."));
            }
            // Add specific recovery recommendations
            recoveryAnalysis.recommendations.forEach(function (rec) {
                if (rec.priority === 'high') {
                    recommendations.restRecommendations.push(rec.title + ": " + rec.description);
                }
            });
        }
        // Nutrition tips based on training times
        habit.preferredTrainingTimes.forEach(function (time) {
            var hours = time.split(':').map(Number)[0];
            if (hours < 12) {
                recommendations.nutritionTips.push("Desayuna proteínas y carbohidratos complejos antes del entrenamiento matutino");
            }
            else if (hours >= 12 && hours < 17) {
                recommendations.nutritionTips.push("Come una comida ligera 1-2 horas antes del entrenamiento de tarde");
            }
            else {
                recommendations.nutritionTips.push("Evita entrenar con el estómago lleno por la noche");
            }
        });
        return recommendations;
    };
    return HabitTrackingService;
}());
exports.HabitTrackingService = HabitTrackingService;
exports.habitTrackingService = HabitTrackingService.getInstance();
