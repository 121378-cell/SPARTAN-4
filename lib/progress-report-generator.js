"use strict";
/**
 * Progress Report Generator for SPARTAN 4
 * Generates detailed user progress reports with training, nutrition, health and performance metrics
 */
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
exports.progressReportGenerator = exports.ProgressReportGenerator = void 0;
var supabase_1 = require("./supabase");
var ProgressReportGenerator = /** @class */ (function () {
    function ProgressReportGenerator() {
    }
    /**
     * Generate a comprehensive weekly progress report for a user
     */
    ProgressReportGenerator.prototype.generateWeeklyReport = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, workoutData, progressData, trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics, strengths, areasForImprovement, recommendations, trends, overallScore, report;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDCCA Generating weekly progress report for user ".concat(userId));
                        return [4 /*yield*/, this.fetchUserData(userId)];
                    case 1:
                        userData = _a.sent();
                        if (!userData) {
                            throw new Error('User data not found');
                        }
                        return [4 /*yield*/, this.fetchWorkoutData(userId)];
                    case 2:
                        workoutData = _a.sent();
                        return [4 /*yield*/, this.fetchProgressData(userId)];
                    case 3:
                        progressData = _a.sent();
                        trainingMetrics = this.calculateTrainingMetrics(workoutData, progressData);
                        nutritionalMetrics = this.calculateNutritionalMetrics(userId);
                        healthMetrics = this.calculateHealthMetrics(userId);
                        performanceMetrics = this.calculatePerformanceMetrics(userId, workoutData);
                        strengths = this.identifyStrengths(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
                        areasForImprovement = this.identifyAreasForImprovement(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
                        recommendations = this.generateRecommendations(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
                        trends = this.calculateTrends(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
                        overallScore = this.calculateOverallScore(trainingMetrics, nutritionalMetrics, healthMetrics, performanceMetrics);
                        report = {
                            reportId: "report_".concat(userId, "_").concat(Date.now()),
                            userId: userId,
                            startDate: this.getWeekStart(new Date()),
                            endDate: this.getWeekEnd(new Date()),
                            period: 'weekly',
                            training: trainingMetrics,
                            nutrition: nutritionalMetrics,
                            health: healthMetrics,
                            performance: performanceMetrics,
                            overallScore: overallScore,
                            strengths: strengths,
                            areasForImprovement: areasForImprovement,
                            recommendations: recommendations,
                            trends: trends
                        };
                        console.log("\u2705 Weekly progress report generated for user ".concat(userId));
                        return [2 /*return*/, report];
                }
            });
        });
    };
    /**
     * Fetch user data from Supabase
     */
    ProgressReportGenerator.prototype.fetchUserData = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.db.getUser(userId)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching user data:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Fetch workout plans for the user
     */
    ProgressReportGenerator.prototype.fetchWorkoutData = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.db.getUserWorkoutPlans(userId)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error fetching workout data:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                }
            });
        });
    };
    /**
     * Fetch progress data for the user
     */
    ProgressReportGenerator.prototype.fetchProgressData = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This would need to be implemented based on how progress data is stored
                // For now, we'll return an empty array
                return [2 /*return*/, []];
            });
        });
    };
    /**
     * Calculate training metrics
     */
    ProgressReportGenerator.prototype.calculateTrainingMetrics = function (workoutData, progressData) {
        var totalWorkouts = workoutData.length;
        var completedWorkouts = progressData.length;
        var workoutCompletionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
        // Calculate average workout duration
        var totalDuration = workoutData.reduce(function (sum, plan) { return sum + (plan.duration || 0); }, 0);
        var avgWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
        // Calculate consistency score (simplified)
        var consistencyScore = Math.min(100, workoutCompletionRate);
        // Calculate intensity score (simplified)
        var intensityScore = Math.min(100, avgWorkoutDuration / 60 * 100);
        // Extract exercise names
        var allExercises = [];
        workoutData.forEach(function (plan) {
            var _a;
            (_a = plan.days) === null || _a === void 0 ? void 0 : _a.forEach(function (day) {
                var _a;
                (_a = day.exercises) === null || _a === void 0 ? void 0 : _a.forEach(function (exercise) {
                    allExercises.push(exercise.name);
                });
            });
        });
        // Count exercise frequency
        var exerciseCount = {};
        allExercises.forEach(function (exercise) {
            exerciseCount[exercise] = (exerciseCount[exercise] || 0) + 1;
        });
        // Get top 5 favorite exercises
        var favoriteExercises = Object.entries(exerciseCount)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })
            .slice(0, 5)
            .map(function (_a) {
            var exercise = _a[0];
            return exercise;
        });
        return {
            totalWorkouts: totalWorkouts,
            completedWorkouts: completedWorkouts,
            workoutCompletionRate: workoutCompletionRate,
            avgWorkoutDuration: avgWorkoutDuration,
            totalVolume: 0, // Would need actual exercise data to calculate
            consistencyScore: consistencyScore,
            intensityScore: intensityScore,
            progressionRate: 0, // Would need historical data to calculate
            favoriteExercises: favoriteExercises,
            workoutDistribution: {
                strength: 40,
                calisthenics: 25,
                yoga: 15,
                cardio: 15,
                other: 5
            }
        };
    };
    /**
     * Calculate nutritional metrics (placeholder)
     */
    ProgressReportGenerator.prototype.calculateNutritionalMetrics = function (userId) {
        // In a real implementation, this would fetch data from nutrition tracking
        return {
            adherenceRate: 75,
            macroTargets: {
                calories: 2500,
                protein: 150,
                carbs: 300,
                fats: 80
            },
            actualIntake: {
                calories: 2300,
                protein: 140,
                carbs: 280,
                fats: 75
            },
            macroAdherence: {
                calories: 92,
                protein: 93,
                carbs: 93,
                fats: 94
            },
            mealFrequency: 3.5,
            hydrationLevel: 80,
            micronutrientScore: 70,
            supplementationAdherence: 60
        };
    };
    /**
     * Calculate health metrics (placeholder)
     */
    ProgressReportGenerator.prototype.calculateHealthMetrics = function (userId) {
        // In a real implementation, this would fetch data from wearable devices or health tracking
        return {
            avgHeartRate: 72,
            restingHeartRate: 52,
            heartRateVariability: 65,
            sleepQuality: 85,
            sleepDuration: 7.5,
            stepsPerDay: 8500,
            activeMinutes: 45,
            stressLevel: 30,
            bodyComposition: {
                weight: 75,
                bodyFatPercentage: 15,
                muscleMass: 60
            },
            bloodMarkers: {
                glucose: 95,
                cholesterol: 180,
                bloodPressure: {
                    systolic: 120,
                    diastolic: 80
                }
            }
        };
    };
    /**
     * Calculate performance metrics (placeholder)
     */
    ProgressReportGenerator.prototype.calculatePerformanceMetrics = function (userId, workoutData) {
        // In a real implementation, this would calculate actual performance improvements
        return {
            strengthImprovements: {
                squat: 5.2,
                deadlift: 3.8,
                benchPress: 4.1,
                pullUp: 7.3
            },
            enduranceImprovements: {
                vo2max: 3.5,
                lactateThreshold: 2.8
            },
            flexibilityImprovements: {
                shoulderFlexibility: 6.2,
                hipFlexibility: 4.5,
                spineMobility: 5.1
            },
            cognitiveMetrics: {
                focusScore: 82,
                reactionTime: 280,
                memoryScore: 78
            }
        };
    };
    /**
     * Identify user strengths
     */
    ProgressReportGenerator.prototype.identifyStrengths = function (training, nutrition, health, performance) {
        var strengths = [];
        if (training.consistencyScore >= 80) {
            strengths.push('Excelente consistencia en el entrenamiento');
        }
        if (training.workoutCompletionRate >= 85) {
            strengths.push('Alto índice de finalización de entrenamientos');
        }
        if (nutrition.adherenceRate >= 80) {
            strengths.push('Buena adherencia a los objetivos nutricionales');
        }
        if (health.sleepQuality >= 80) {
            strengths.push('Calidad de sueño óptima');
        }
        if (health.heartRateVariability >= 60) {
            strengths.push('Buen balance del sistema nervioso autónomo');
        }
        if (performance.strengthImprovements.squat > 5) {
            strengths.push('Excelente progreso en sentadillas');
        }
        return strengths;
    };
    /**
     * Identify areas for improvement
     */
    ProgressReportGenerator.prototype.identifyAreasForImprovement = function (training, nutrition, health, performance) {
        var areas = [];
        if (training.consistencyScore < 70) {
            areas.push('Necesitas mejorar la consistencia en el entrenamiento');
        }
        if (nutrition.adherenceRate < 70) {
            areas.push('Tu adherencia nutricional necesita atención');
        }
        if (health.sleepQuality < 70) {
            areas.push('Tu calidad de sueño puede mejorarse');
        }
        if (health.stressLevel > 50) {
            areas.push('Nivel de estrés elevado, considera técnicas de manejo');
        }
        if (nutrition.supplementationAdherence < 50) {
            areas.push('Baja adherencia a suplementación recomendada');
        }
        return areas;
    };
    /**
     * Generate personalized recommendations
     */
    ProgressReportGenerator.prototype.generateRecommendations = function (training, nutrition, health, performance) {
        var recommendations = [];
        // Training recommendations
        if (training.consistencyScore < 80) {
            recommendations.push({
                category: 'training',
                priority: 'high',
                title: 'Mejora tu consistencia de entrenamiento',
                description: 'Establece un horario fijo para entrenar y considera sesiones más cortas si el tiempo es limitado.',
                actionItems: [
                    'Planifica tus entrenamientos a la semana',
                    'Comienza con sesiones de 30 minutos si es necesario',
                    'Usa recordatorios para no saltarte sesiones'
                ],
                expectedImpact: 'Aumento del 20-30% en consistencia',
                timeframe: '2 semanas'
            });
        }
        // Nutrition recommendations
        if (nutrition.adherenceRate < 75) {
            recommendations.push({
                category: 'nutrition',
                priority: 'high',
                title: 'Optimiza tu adherencia nutricional',
                description: 'Implementa estrategias para seguir mejor tus objetivos nutricionales.',
                actionItems: [
                    'Prepara comidas con anticipación',
                    'Usa una aplicación para registrar tu comida',
                    'Mantén snacks saludables a mano'
                ],
                expectedImpact: 'Mejora del 15-25% en adherencia',
                timeframe: '2 semanas'
            });
        }
        // Health recommendations
        if (health.sleepQuality < 75) {
            recommendations.push({
                category: 'health',
                priority: 'medium',
                title: 'Mejora la calidad de tu sueño',
                description: 'Implementa una rutina de sueño consistente para optimizar la recuperación.',
                actionItems: [
                    'Establece una hora fija para dormir y levantarte',
                    'Evita pantallas 1 hora antes de dormir',
                    'Crea un ambiente oscuro y fresco en tu habitación'
                ],
                expectedImpact: 'Mejora de 10-15 puntos en calidad de sueño',
                timeframe: '1 mes'
            });
        }
        // Performance recommendations
        if (performance.cognitiveMetrics.focusScore < 75) {
            recommendations.push({
                category: 'performance',
                priority: 'medium',
                title: 'Potencia tu enfoque y concentración',
                description: 'Incorpora técnicas de mindfulness y ejercicios cognitivos.',
                actionItems: [
                    'Practica 10 minutos de meditación diaria',
                    'Haz ejercicios de respiración antes de entrenar',
                    'Limita multitasking durante actividades importantes'
                ],
                expectedImpact: 'Mejora del 15-20% en enfoque',
                timeframe: '3 semanas'
            });
        }
        return recommendations;
    };
    /**
     * Calculate trends
     */
    ProgressReportGenerator.prototype.calculateTrends = function (training, nutrition, health, performance) {
        // In a real implementation, this would compare with previous period data
        return {
            trainingTrend: 'improving',
            nutritionTrend: 'stable',
            healthTrend: 'improving',
            performanceTrend: 'improving'
        };
    };
    /**
     * Calculate overall score
     */
    ProgressReportGenerator.prototype.calculateOverallScore = function (training, nutrition, health, performance) {
        // Weighted average of all metrics
        var weights = {
            training: 0.3,
            nutrition: 0.25,
            health: 0.25,
            performance: 0.2
        };
        var score = (training.consistencyScore * weights.training +
            nutrition.adherenceRate * weights.nutrition +
            health.sleepQuality * weights.health +
            (performance.strengthImprovements.squat +
                performance.strengthImprovements.deadlift +
                performance.strengthImprovements.benchPress +
                performance.strengthImprovements.pullUp) / 4 * weights.performance);
        return Math.round(score);
    };
    /**
     * Helper functions
     */
    ProgressReportGenerator.prototype.getWeekStart = function (date) {
        var d = new Date(date);
        var day = d.getDay();
        var diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };
    ProgressReportGenerator.prototype.getWeekEnd = function (date) {
        var d = new Date(this.getWeekStart(date));
        d.setDate(d.getDate() + 6);
        return d;
    };
    return ProgressReportGenerator;
}());
exports.ProgressReportGenerator = ProgressReportGenerator;
// Export singleton instance
exports.progressReportGenerator = new ProgressReportGenerator();
