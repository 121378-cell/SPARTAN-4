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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryService = exports.RecoveryService = void 0;
var storage_1 = require("./storage");
var habit_tracking_1 = require("./habit-tracking");
var RecoveryService = /** @class */ (function () {
    function RecoveryService() {
    }
    RecoveryService.getInstance = function () {
        if (!RecoveryService.instance) {
            RecoveryService.instance = new RecoveryService();
        }
        return RecoveryService.instance;
    };
    // Record subjective recovery metrics
    RecoveryService.prototype.recordRecoveryMetrics = function (userId, metrics) {
        var recoveryMetric = __assign(__assign({}, metrics), { date: new Date() });
        storage_1.storageManager.addRecoveryMetric(recoveryMetric);
        this.analyzeRecovery(userId, recoveryMetric.date);
        return recoveryMetric;
    };
    // Analyze recovery and fatigue levels
    RecoveryService.prototype.analyzeRecovery = function (userId, date) {
        // Get existing analysis for the date
        var existingAnalysis = storage_1.storageManager.getRecoveryAnalysisForDate(date);
        if (existingAnalysis) {
            return existingAnalysis;
        }
        // Get recovery metrics for the past 7 days
        var recoveryMetrics = storage_1.storageManager.getRecoveryMetrics();
        var recentMetrics = recoveryMetrics
            .filter(function (metric) {
            var metricDate = new Date(metric.date);
            var diffTime = Math.abs(date.getTime() - metricDate.getTime());
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        // Get workout sessions for the past 7 days
        var workoutSessions = storage_1.storageManager.getWorkoutSessions();
        var recentWorkouts = workoutSessions
            .filter(function (session) {
            var sessionDate = new Date(session.date);
            var diffTime = Math.abs(date.getTime() - sessionDate.getTime());
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        // Calculate fatigue level based on metrics and workouts
        var fatigueLevel = this.calculateFatigueLevel(recentMetrics, recentWorkouts);
        // Calculate recovery score (0-100)
        var recoveryScore = this.calculateRecoveryScore(recentMetrics, recentWorkouts);
        // Generate recommendations
        var recommendations = this.generateRecoveryRecommendations(fatigueLevel, recentMetrics, recentWorkouts);
        // Predict fatigue days
        var predictedFatigueDays = this.predictFatigueDays(userId, recentWorkouts, recentMetrics);
        // Suggest workout intensity
        var suggestedWorkoutIntensity = this.suggestWorkoutIntensity(fatigueLevel, recoveryScore);
        var analysis = {
            date: date,
            fatigueLevel: fatigueLevel,
            recoveryScore: recoveryScore,
            recommendations: recommendations,
            predictedFatigueDays: predictedFatigueDays,
            suggestedWorkoutIntensity: suggestedWorkoutIntensity
        };
        storage_1.storageManager.addRecoveryAnalysis(analysis);
        return analysis;
    };
    // Calculate fatigue level based on metrics and workouts
    RecoveryService.prototype.calculateFatigueLevel = function (metrics, workouts) {
        if (metrics.length === 0 && workouts.length === 0) {
            return 'low';
        }
        // Calculate average metrics
        var totalEnergy = 0;
        var totalSoreness = 0;
        var totalSleep = 0;
        var totalStress = 0;
        var totalMotivation = 0;
        var metricCount = 0;
        metrics.forEach(function (metric) {
            totalEnergy += metric.energyLevel;
            totalSoreness += metric.muscleSoreness;
            totalSleep += metric.sleepQuality;
            totalStress += metric.stressLevel;
            totalMotivation += metric.motivation;
            metricCount++;
        });
        var avgEnergy = metricCount > 0 ? totalEnergy / metricCount : 7;
        var avgSoreness = metricCount > 0 ? totalSoreness / metricCount : 3;
        var avgSleep = metricCount > 0 ? totalSleep / metricCount : 7;
        var avgStress = metricCount > 0 ? totalStress / metricCount : 3;
        var avgMotivation = metricCount > 0 ? totalMotivation / metricCount : 7;
        // Calculate workout intensity factor
        var totalDuration = 0;
        var workoutCount = 0;
        workouts.forEach(function (workout) {
            if (workout.duration) {
                totalDuration += workout.duration;
                workoutCount++;
            }
        });
        var avgDuration = workoutCount > 0 ? totalDuration / workoutCount : 60;
        // Calculate fatigue score (0-10)
        // Lower energy, higher soreness, worse sleep, higher stress, lower motivation = higher fatigue
        var fatigueScore = ((10 - avgEnergy) +
            avgSoreness +
            (10 - avgSleep) +
            avgStress +
            (10 - avgMotivation) +
            (avgDuration > 90 ? 3 : avgDuration > 60 ? 2 : avgDuration > 30 ? 1 : 0)) / (metricCount > 0 ? 6 : 4);
        if (fatigueScore >= 7)
            return 'extreme';
        if (fatigueScore >= 5)
            return 'high';
        if (fatigueScore >= 3)
            return 'moderate';
        return 'low';
    };
    // Calculate recovery score (0-100)
    RecoveryService.prototype.calculateRecoveryScore = function (metrics, workouts) {
        if (metrics.length === 0)
            return 70; // Default score if no metrics
        // Calculate weighted average of metrics
        var totalScore = 0;
        var weightSum = 0;
        metrics.forEach(function (metric) {
            // Weight each metric (energy and sleep are more important)
            var energyWeight = 0.3;
            var sorenessWeight = 0.2;
            var sleepWeight = 0.3;
            var stressWeight = 0.1;
            var motivationWeight = 0.1;
            var metricScore = (metric.energyLevel * energyWeight * 10 + // Scale to 0-100
                (10 - metric.muscleSoreness) * sorenessWeight * 10 + // Invert soreness
                metric.sleepQuality * sleepWeight * 10 + // Scale to 0-100
                (10 - metric.stressLevel) * stressWeight * 10 + // Invert stress
                metric.motivation * motivationWeight * 10 // Scale to 0-100
            );
            totalScore += metricScore;
            weightSum += (energyWeight + sorenessWeight + sleepWeight + stressWeight + motivationWeight);
        });
        var avgScore = totalScore / metrics.length;
        // Adjust based on workout intensity
        var workoutAdjustment = this.calculateWorkoutAdjustment(workouts);
        var finalScore = Math.max(0, Math.min(100, avgScore + workoutAdjustment));
        return Math.round(finalScore);
    };
    // Calculate workout adjustment for recovery score
    RecoveryService.prototype.calculateWorkoutAdjustment = function (workouts) {
        if (workouts.length === 0)
            return 0;
        var totalDuration = 0;
        var highIntensityCount = 0;
        workouts.forEach(function (workout) {
            if (workout.duration) {
                totalDuration += workout.duration;
                // Consider workouts > 75 minutes as high intensity
                if (workout.duration > 75) {
                    highIntensityCount++;
                }
            }
        });
        var avgDuration = totalDuration / workouts.length;
        // Negative adjustment for high intensity/duration
        var adjustment = 0;
        if (avgDuration > 90)
            adjustment = -15;
        else if (avgDuration > 75)
            adjustment = -10;
        else if (avgDuration > 60)
            adjustment = -5;
        adjustment -= highIntensityCount * 3; // Additional penalty for multiple high intensity sessions
        return adjustment;
    };
    // Generate recovery recommendations based on fatigue level
    RecoveryService.prototype.generateRecoveryRecommendations = function (fatigueLevel, metrics, workouts) {
        var recommendations = [];
        // Always add basic recommendations
        recommendations.push({
            type: 'stretching',
            title: 'Sesión de estiramientos',
            description: 'Dedica 10-15 minutos a estirar los grupos musculares principales',
            duration: '10-15 minutos',
            priority: 'medium'
        });
        recommendations.push({
            type: 'mobility',
            title: 'Trabajo de movilidad',
            description: 'Realiza ejercicios de movilidad articular para mejorar la flexibilidad',
            duration: '15-20 minutos',
            priority: 'medium'
        });
        // Add fatigue-specific recommendations
        switch (fatigueLevel) {
            case 'extreme':
                recommendations.push({
                    type: 'rest',
                    title: 'Día de descanso completo',
                    description: 'Tu cuerpo necesita recuperarse completamente. Evita el entrenamiento intenso',
                    priority: 'high'
                });
                recommendations.push({
                    type: 'nap',
                    title: 'Siesta rejuvenecedora',
                    description: 'Una siesta de 20-30 minutos puede ayudar a restaurar tu energía',
                    duration: '20-30 minutos',
                    priority: 'high'
                });
                recommendations.push({
                    type: 'sauna',
                    title: 'Sesión de sauna',
                    description: 'La sauna puede ayudar a relajar los músculos y mejorar la circulación',
                    duration: '15-20 minutos',
                    priority: 'medium'
                });
                break;
            case 'high':
                recommendations.push({
                    type: 'active_recovery',
                    title: 'Entrenamiento de recuperación activa',
                    description: 'Realiza ejercicio de baja intensidad como caminar o nadar suavemente',
                    intensity: 'low',
                    priority: 'high'
                });
                recommendations.push({
                    type: 'massage',
                    title: 'Masaje relajante',
                    description: 'Un masaje puede ayudar a aliviar la tensión muscular y mejorar la recuperación',
                    priority: 'medium'
                });
                break;
            case 'moderate':
                recommendations.push({
                    type: 'light_training',
                    title: 'Entrenamiento ligero',
                    description: 'Puedes entrenar pero reduce la intensidad y volumen',
                    intensity: 'low',
                    priority: 'medium'
                });
                break;
            case 'low':
                // No special recommendations needed
                break;
        }
        // Add sleep recommendations if sleep quality is poor
        var recentMetrics = metrics.slice(0, 3); // Last 3 metrics
        if (recentMetrics.length > 0) {
            var avgSleep = recentMetrics.reduce(function (sum, m) { return sum + m.sleepQuality; }, 0) / recentMetrics.length;
            if (avgSleep < 6) {
                recommendations.push({
                    type: 'rest',
                    title: 'Prioriza el sueño',
                    description: 'Intenta dormir 7-9 horas para una mejor recuperación',
                    priority: 'high'
                });
            }
        }
        return recommendations;
    };
    // Predict days with accumulated fatigue
    RecoveryService.prototype.predictFatigueDays = function (userId, workouts, metrics) {
        var fatigueDays = [];
        // Get user habits for training patterns
        var userHabit = habit_tracking_1.habitTrackingService.getUserHabits(userId);
        if (!userHabit)
            return fatigueDays;
        // Predict next 7 days
        var today = new Date();
        var _loop_1 = function (i) {
            var futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            // Check if this is a typical training day
            var dayOfWeek = futureDate.getDay();
            if (userHabit.preferredTrainingDays.includes(dayOfWeek)) {
                // Check if there's been high training frequency recently
                var recentWorkoutsCount = workouts.filter(function (workout) {
                    var workoutDate = new Date(workout.date);
                    var diffTime = Math.abs(futureDate.getTime() - workoutDate.getTime());
                    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 3; // Last 3 days
                }).length;
                // If 3+ workouts in last 3 days, likely fatigue day
                if (recentWorkoutsCount >= 3) {
                    fatigueDays.push(futureDate);
                }
            }
        };
        for (var i = 1; i <= 7; i++) {
            _loop_1(i);
        }
        return fatigueDays;
    };
    // Suggest workout intensity based on fatigue level and recovery score
    RecoveryService.prototype.suggestWorkoutIntensity = function (fatigueLevel, recoveryScore) {
        // If recovery score is very low, suggest rest regardless of fatigue level
        if (recoveryScore < 30)
            return 'rest';
        if (recoveryScore < 50)
            return 'low';
        if (recoveryScore < 70)
            return 'moderate';
        // Adjust based on fatigue level
        switch (fatigueLevel) {
            case 'extreme': return 'rest';
            case 'high': return 'low';
            case 'moderate': return 'moderate';
            case 'low': return 'high';
            default: return 'moderate';
        }
    };
    // Get recovery analysis for a specific date
    RecoveryService.prototype.getRecoveryAnalysis = function (userId, date) {
        var existingAnalysis = storage_1.storageManager.getRecoveryAnalysisForDate(date);
        if (existingAnalysis) {
            return existingAnalysis;
        }
        // Generate new analysis
        return this.analyzeRecovery(userId, date);
    };
    // Get recent recovery analyses
    RecoveryService.prototype.getRecentRecoveryAnalyses = function (days) {
        if (days === void 0) { days = 7; }
        var analyses = storage_1.storageManager.getRecoveryAnalyses();
        var cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return analyses
            .filter(function (analysis) { return new Date(analysis.date) >= cutoffDate; })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
    };
    return RecoveryService;
}());
exports.RecoveryService = RecoveryService;
exports.recoveryService = RecoveryService.getInstance();
