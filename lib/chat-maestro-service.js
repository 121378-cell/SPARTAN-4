"use strict";
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
exports.chatMaestroService = exports.ChatMaestroService = void 0;
/**
 * Chat Maestro - Central Intelligence System for SPARTAN 4
 * The brain that connects all modules, explains plans, resolves doubts,
 * modifies routines in real-time, and serves as the strategic core of the system.
 *
 * This service orchestrates all modules of the SPARTAN ecosystem:
 * - Training Module: Workout planning, execution, and modification
 * - Nutrition Module: Meal planning and nutritional guidance
 * - Progress Tracking: Performance analysis and trend monitoring
 * - Wearables Integration: Biometric data processing and health monitoring
 * - Recovery Module: Fatigue assessment and recovery optimization
 * - UI/UX Module: Adaptive interface and user experience optimization
 *
 * Personality System: Implements a hybrid digital coach personality that is
 * disciplined, motivational, technical, and empathetic, adapting communication
 * style based on user state, plan phase, and context.
 */
var storage_1 = require("./storage");
var habit_tracking_1 = require("./habit-tracking");
var recovery_service_1 = require("./recovery-service");
var load_progression_service_1 = require("./load-progression-service");
var nutrition_service_1 = require("./nutrition-service");
var chat_maestro_predictive_engine_1 = require("./chat-maestro-predictive-engine");
var conversationalCoach_1 = require("./conversationalCoach");
var spartan_coach_service_1 = require("./spartan-coach-service");
var doubt_resolution_engine_1 = require("./doubt-resolution-engine");
var real_time_modification_service_1 = require("./real-time-modification-service");
var chat_maestro_personality_1 = require("./chat-maestro-personality");
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var continuous_ecosystem_optimization_service_1 = require("./continuous-ecosystem-optimization-service");
/**
 * Central Intelligence System for SPARTAN 4 Ecosystem
 *
 * This service orchestrates all modules of the SPARTAN ecosystem:
 * 1. Training Module Integration
 * 2. Nutrition Module Integration
 * 3. Progress Tracking Integration
 * 4. Wearables Integration
 * 5. Recovery Module Integration
 * 6. UI/UX Module Integration
 *
 * It serves as the central conductor, coordinating data flow between modules,
 * making intelligent decisions based on comprehensive user context,
 * and providing personality-driven responses through the Spartan Coach.
 */
var ChatMaestroService = /** @class */ (function () {
    function ChatMaestroService() {
        this.conversationalCoach = new conversationalCoach_1.ConversationalCoach();
        this.spartanCoach = new spartan_coach_service_1.SpartanCoachService();
        this.doubtResolutionEngine = new doubt_resolution_engine_1.DoubtResolutionEngine(); // Initialize the doubt resolution engine
        this.personality = chat_maestro_personality_1.DEFAULT_CHAT_MAESTRO_PERSONALITY;
        this.adaptiveToneSystem = chat_maestro_personality_1.DEFAULT_ADAPTIVE_TONE_SYSTEM;
    }
    ChatMaestroService.getInstance = function () {
        if (!ChatMaestroService.instance) {
            ChatMaestroService.instance = new ChatMaestroService();
        }
        return ChatMaestroService.instance;
    };
    /**
     * Process user input and generate intelligent response
     * This is the primary entry point for all user interactions
     */
    ChatMaestroService.prototype.processUserInput = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var intent, resolvedDoubt, response_1, predictiveRecommendations, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🧠 Chat Maestro processing user input:', input);
                        intent = this.determineIntent(input, context);
                        // For ambiguous, technical, or motivational questions, use the enhanced doubt resolution engine
                        if (intent === 'ambiguous_question' || intent === 'technical_question' || intent === 'motivational_question') {
                            resolvedDoubt = this.doubtResolutionEngine.resolveDoubt(input, context);
                            response_1 = resolvedDoubt.response;
                            if (resolvedDoubt.scientificBasis.length > 0 && intent === 'technical_question') {
                                response_1 += "\n\n🔬 **BASE CIENTÍFICA:**\n";
                                resolvedDoubt.scientificBasis.forEach(function (basis, index) {
                                    response_1 += "".concat(index + 1, ". ").concat(basis, "\n");
                                });
                            }
                            return [2 /*return*/, {
                                    response: response_1,
                                    actionItems: resolvedDoubt.actionItems
                                }];
                        }
                        if (!(intent === 'general')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generatePredictiveRecommendations(context)];
                    case 1:
                        predictiveRecommendations = _a.sent();
                        if (predictiveRecommendations.length > 0) {
                            // Return proactive recommendations
                            return [2 /*return*/, chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().formatRecommendationsForChat(predictiveRecommendations)];
                        }
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.generateResponse(input, intent, context)];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Perform real-time data analysis and generate insights
     * This function orchestrates analysis across all integrated modules
     */
    ChatMaestroService.prototype.performRealTimeAnalysis = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var insights, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('🔍 Chat Maestro performing real-time analysis');
                        insights = {};
                        // Analyze training patterns
                        insights.trainingPatterns = this.analyzeTrainingPatterns(context);
                        // Analyze recovery trends
                        insights.recoveryTrends = this.analyzeRecoveryTrends(context);
                        // Analyze progression trends
                        insights.progressionTrends = this.analyzeProgressionTrends(context);
                        // Analyze nutrition adherence
                        insights.nutritionAdherence = this.analyzeNutritionAdherence(context);
                        // Generate predictive insights
                        _a = insights;
                        return [4 /*yield*/, this.generatePredictiveInsights(context)];
                    case 1:
                        // Generate predictive insights
                        _a.predictiveInsights = _c.sent();
                        // Generate predictive recommendations
                        _b = insights;
                        return [4 /*yield*/, this.generatePredictiveRecommendations(context)];
                    case 2:
                        // Generate predictive recommendations
                        _b.predictiveRecommendations = _c.sent();
                        // Generate autonomous plan adaptations
                        insights.autonomousAdaptations = chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().generateAutonomousPlanAdaptations(context);
                        // Generate recommendation explanations
                        if (insights.predictiveRecommendations) {
                            insights.recommendationExplanations = insights.predictiveRecommendations.map(function (rec) { return chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().generateRecommendationExplanation(rec, context); });
                        }
                        // Analyze wearable data if available
                        if (context.wearableInsights) {
                            insights.wearableAnalysis = this.analyzeWearableData(context.wearableInsights);
                        }
                        // Analyze real-time biometrics
                        insights.realTimeBiometrics = chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().analyzeRealTimeBiometrics(context);
                        return [2 /*return*/, insights];
                }
            });
        });
    };
    /**
     * Orchestrate cross-module coordination
     * This function ensures all modules work together harmoniously
     */
    ChatMaestroService.prototype.orchestrateModules = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('🎵 Chat Maestro orchestrating modules');
                // Ensure training aligns with recovery status
                if (context.recoveryStatus && context.activeWorkout) {
                    this.coordinateTrainingWithRecovery(context.recoveryStatus, context.activeWorkout);
                }
                // Ensure nutrition aligns with training schedule
                if (context.activeWorkout && context.nutritionData) {
                    this.coordinateNutritionWithTraining(context.activeWorkout, context.nutritionData);
                }
                // Ensure progression aligns with performance data
                if (context.recentWorkouts.length > 0 && context.progressionPlans.length > 0) {
                    this.coordinateProgressionWithPerformance(context.recentWorkouts, context.progressionPlans);
                }
                // Ensure wearables data informs all other modules
                if (context.wearableInsights) {
                    this.coordinateWearablesWithAllModules(context.wearableInsights, context);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Generate long-term strategic plan based on user context
     * Creates 6, 12, or 24-month plans with strategic variations
     */
    ChatMaestroService.prototype.generateLongTermStrategicPlan = function (context, durationMonths) {
        return __awaiter(this, void 0, void 0, function () {
            var strategicPlan;
            return __generator(this, function (_a) {
                console.log("\uD83E\uDDED Generating ".concat(durationMonths, "-month strategic plan for user ").concat(context.userId));
                strategicPlan = chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().generateLongTermStrategicPlan(context, durationMonths);
                return [2 /*return*/, strategicPlan];
            });
        });
    };
    /**
     * Analyze long-term plan progress and generate adjustment recommendations
     */
    ChatMaestroService.prototype.analyzeLongTermPlanProgress = function (context, plan) {
        return __awaiter(this, void 0, void 0, function () {
            var recommendations;
            return __generator(this, function (_a) {
                console.log("\uD83D\uDCCA Analyzing progress for long-term strategic plan: ".concat(plan.id));
                recommendations = chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().analyzeLongTermPlanProgress(context, plan);
                return [2 /*return*/, recommendations];
            });
        });
    };
    /**
     * Automatically adjust long-term strategic plan based on user progress
     */
    ChatMaestroService.prototype.autoAdjustLongTermPlan = function (plan, context) {
        return __awaiter(this, void 0, void 0, function () {
            var adjustedPlan;
            return __generator(this, function (_a) {
                console.log("\u2699\uFE0F Auto-adjusting long-term strategic plan: ".concat(plan.id));
                adjustedPlan = chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().autoAdjustLongTermPlan(plan, context);
                return [2 /*return*/, adjustedPlan];
            });
        });
    };
    /**
     * Coordinate training with recovery status
     */
    ChatMaestroService.prototype.coordinateTrainingWithRecovery = function (recovery, workout) {
        // This would adjust workout intensity based on recovery status
        console.log('协调训练与恢复状态');
    };
    /**
     * Coordinate nutrition with training schedule
     */
    ChatMaestroService.prototype.coordinateNutritionWithTraining = function (workout, nutrition) {
        // This would adjust nutrition timing based on workout schedule
        console.log('协调营养与训练计划');
    };
    /**
     * Coordinate progression with performance data
     */
    ChatMaestroService.prototype.coordinateProgressionWithPerformance = function (workouts, plans) {
        // This would adjust progression based on actual performance
        console.log('协调进展与表现数据');
    };
    /**
     * Coordinate wearables data with all modules
     */
    ChatMaestroService.prototype.coordinateWearablesWithAllModules = function (wearables, context) {
        // This would use wearable data to inform decisions across all modules
        console.log('协调可穿戴设备数据与所有模块');
    };
    /**
     * Analyze training patterns
     */
    ChatMaestroService.prototype.analyzeTrainingPatterns = function (context) {
        var recentWorkouts = context.recentWorkouts;
        if (recentWorkouts.length === 0) {
            return { message: 'No hay datos de entrenamiento recientes' };
        }
        // Calculate frequency
        var frequency = recentWorkouts.length;
        // Calculate average duration
        var totalDuration = recentWorkouts.reduce(function (sum, workout) {
            return sum + (workout.duration || 0);
        }, 0);
        var avgDuration = totalDuration / recentWorkouts.length;
        // Identify most common exercises
        var exerciseCount = {};
        recentWorkouts.forEach(function (workout) {
            workout.exercises.forEach(function (exercise) {
                exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
            });
        });
        var favoriteExercises = Object.entries(exerciseCount)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })
            .slice(0, 3)
            .map(function (_a) {
            var exercise = _a[0];
            return exercise;
        });
        return {
            frequency: frequency,
            avgDuration: Math.round(avgDuration),
            favoriteExercises: favoriteExercises,
            consistency: Math.min(100, (frequency / 7) * 100) // Assuming 7-day period
        };
    };
    /**
     * Analyze recovery trends
     */
    ChatMaestroService.prototype.analyzeRecoveryTrends = function (context) {
        var recoveryAnalyses = recovery_service_1.recoveryService.getRecentRecoveryAnalyses(7);
        if (!recoveryAnalyses || recoveryAnalyses.length === 0) {
            return { message: 'No hay datos de recuperación recientes' };
        }
        // Calculate average recovery score
        var totalScore = recoveryAnalyses.reduce(function (sum, analysis) {
            return sum + analysis.recoveryScore;
        }, 0);
        var avgRecoveryScore = totalScore / recoveryAnalyses.length;
        // Identify most common fatigue levels
        var fatigueLevelCount = {};
        recoveryAnalyses.forEach(function (analysis) {
            fatigueLevelCount[analysis.fatigueLevel] =
                (fatigueLevelCount[analysis.fatigueLevel] || 0) + 1;
        });
        var mostCommonFatigueLevel = Object.entries(fatigueLevelCount)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })[0][0];
        return {
            avgRecoveryScore: Math.round(avgRecoveryScore),
            mostCommonFatigueLevel: mostCommonFatigueLevel,
            trend: this.calculateRecoveryTrend(recoveryAnalyses)
        };
    };
    /**
     * Provide information about system optimization and performance to the user
     */
    ChatMaestroService.prototype.provideSystemOptimizationInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metrics, recommendations, response_2, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, continuous_ecosystem_optimization_service_1.continuousEcosystemOptimizationService.getCurrentMetrics()];
                    case 1:
                        metrics = _a.sent();
                        recommendations = continuous_ecosystem_optimization_service_1.continuousEcosystemOptimizationService.getCurrentRecommendations();
                        response_2 = "📊 **Informe de Optimización del Sistema SPARTAN**\n\n";
                        response_2 += "🔍 **Métricas Actuales del Sistema:**\n";
                        response_2 += "- Eficiencia del Flujo de Datos: ".concat(Math.round(metrics.dataFlowEfficiency * 100), "%\n");
                        response_2 += "- Rendimiento de Visualizaci\u00F3n: ".concat(Math.round(metrics.visualizationPerformance * 100), "%\n");
                        response_2 += "- Responsividad del Chat: ".concat(Math.round(metrics.chatMaestroResponsiveness * 100), "%\n");
                        response_2 += "- Velocidad de Activaci\u00F3n de Modales: ".concat(Math.round(metrics.modalActivationSpeed * 100), "%\n");
                        response_2 += "- Tasa de Acierto de Cach\u00E9: ".concat(Math.round(metrics.cacheHitRate * 100), "%\n");
                        response_2 += "- Uso de Memoria: ".concat(Math.round(metrics.memoryUsage * 100), "%\n");
                        response_2 += "- Uso de CPU: ".concat(Math.round(metrics.cpuUsage * 100), "%\n\n");
                        if (recommendations.length > 0) {
                            response_2 += "💡 **Recomendaciones de Optimización:**\n";
                            recommendations.slice(0, 3).forEach(function (rec, index) {
                                response_2 += "".concat(index + 1, ". ").concat(rec.description, " (").concat(rec.priority, ")\n");
                            });
                            if (recommendations.length > 3) {
                                response_2 += "...y ".concat(recommendations.length - 3, " m\u00E1s recomendaciones.\n\n");
                            }
                        }
                        else {
                            response_2 += "✅ El sistema está funcionando de manera óptima. ¡Buen trabajo!\n\n";
                        }
                        response_2 += "🤖 El sistema se optimiza automáticamente de forma continua para brindarte la mejor experiencia.";
                        return [2 /*return*/, response_2];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error providing system optimization info:', error_1);
                        return [2 /*return*/, "Lo siento, actualmente no puedo acceder a la información de optimización del sistema. Por favor, inténtalo de nuevo más tarde."];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate recovery trend
     */
    ChatMaestroService.prototype.calculateRecoveryTrend = function (analyses) {
        if (analyses.length < 2)
            return 'stable';
        var recent = analyses[0].recoveryScore;
        var previous = analyses[analyses.length - 1].recoveryScore;
        var difference = recent - previous;
        if (difference > 10)
            return 'improving';
        if (difference < -10)
            return 'declining';
        return 'stable';
    };
    /**
     * Analyze progression trends
     */
    ChatMaestroService.prototype.analyzeProgressionTrends = function (context) {
        var progressionPlans = context.progressionPlans;
        if (progressionPlans.length === 0) {
            return { message: 'No hay datos de progresión recientes' };
        }
        // Calculate average recommended adjustments
        var totalAdjustments = progressionPlans.reduce(function (sum, plan) {
            return sum + plan.adjustments.length;
        }, 0);
        var avgAdjustments = totalAdjustments / progressionPlans.length;
        // Identify most common adjustment types
        var adjustmentTypeCount = {};
        progressionPlans.forEach(function (plan) {
            plan.adjustments.forEach(function (adjustment) {
                adjustmentTypeCount[adjustment.adjustmentType] =
                    (adjustmentTypeCount[adjustment.adjustmentType] || 0) + 1;
            });
        });
        var mostCommonAdjustment = Object.entries(adjustmentTypeCount)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b - a;
        })[0][0];
        return {
            avgAdjustments: Math.round(avgAdjustments * 10) / 10,
            mostCommonAdjustment: mostCommonAdjustment,
            totalPlans: progressionPlans.length
        };
    };
    /**
     * Analyze nutrition adherence
     */
    ChatMaestroService.prototype.analyzeNutritionAdherence = function (context) {
        // This would integrate with nutrition service in a real implementation
        return {
            adherenceRate: 75, // Placeholder value
            message: 'Análisis de adherencia nutricional disponible en la sección de nutrición'
        };
    };
    /**
     * Analyze wearable data for insights
     */
    ChatMaestroService.prototype.analyzeWearableData = function (wearableInsights) {
        return {
            recoveryStatus: wearableInsights.recoveryStatus,
            trainingReadiness: wearableInsights.trainingReadiness,
            adjustmentCount: wearableInsights.adjustments.length,
            recommendationCount: wearableInsights.recommendations.length,
            riskFactorCount: wearableInsights.riskFactors.length
        };
    };
    /**
     * Generate predictive insights using the predictive analytics engine
     */
    ChatMaestroService.prototype.generatePredictiveInsights = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // This would integrate with the predictive analytics engine
                    // For now, we'll return placeholder data
                    return [2 /*return*/, {
                            projections: [
                                {
                                    timeframe: '3_months',
                                    strength: {
                                        projectedIncrease: 15
                                    },
                                    muscleMass: {
                                        projectedIncrease: 8
                                    },
                                    bodyComposition: {
                                        projectedDecrease: 3
                                    },
                                    confidence: 85
                                }
                            ],
                            riskFactors: ['Calidad de sueño deficiente', 'Alta intensidad de entrenamiento'],
                            optimizationOpportunities: ['Mejorar calidad del sueño', 'Optimizar nutrición post-entreno'],
                            personalizedRecommendations: ['Aumentar adherencia al 85% para maximizar ganancias']
                        }];
                }
                catch (error) {
                    console.error('Error generating predictive insights:', error);
                    return [2 /*return*/, {
                            message: 'No se pudieron generar insights predictivos en este momento'
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Generate predictive recommendations using the predictive engine
     */
    ChatMaestroService.prototype.generatePredictiveRecommendations = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, chat_maestro_predictive_engine_1.ChatMaestroPredictiveEngine.getInstance().generatePredictiveRecommendations(context)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error generating predictive recommendations:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate personalized recommendations based on all data
     */
    ChatMaestroService.prototype.generatePersonalizedRecommendations = function (context) {
        var recommendations = [];
        // Get insights from all modules
        var trainingPatterns = this.analyzeTrainingPatterns(context);
        var recoveryTrends = this.analyzeRecoveryTrends(context);
        var progressionTrends = this.analyzeProgressionTrends(context);
        // Training recommendations
        if (trainingPatterns.consistency && trainingPatterns.consistency < 80) {
            recommendations.push({
                category: 'training',
                priority: 'high',
                title: 'Mejora tu consistencia de entrenamiento',
                description: "Tu consistencia actual es del ".concat(trainingPatterns.consistency, "%. Te recomiendo establecer un horario fijo para entrenar."),
                actionItems: [
                    'Planifica tus entrenamientos a la semana',
                    'Usa recordatorios para no saltarte sesiones'
                ]
            });
        }
        // Recovery recommendations
        if (recoveryTrends.avgRecoveryScore && recoveryTrends.avgRecoveryScore < 60) {
            recommendations.push({
                category: 'recovery',
                priority: 'high',
                title: 'Prioriza tu recuperación',
                description: "Tu puntaje promedio de recuperaci\u00F3n es de ".concat(recoveryTrends.avgRecoveryScore, "/100. Considera incluir d\u00EDas de recuperaci\u00F3n activa."),
                actionItems: [
                    'Incluye sesiones de estiramiento',
                    'Asegura 7-9 horas de sueño'
                ]
            });
        }
        // Progression recommendations
        if (progressionTrends.avgAdjustments && progressionTrends.avgAdjustments > 2) {
            recommendations.push({
                category: 'progression',
                priority: 'medium',
                title: 'Evalúa tu progresión',
                description: "Est\u00E1s haciendo muchos ajustes (".concat(progressionTrends.avgAdjustments, " por plan). Considera periodos de estabilizaci\u00F3n."),
                actionItems: [
                    'Mantén cargas constantes por 2-3 semanas',
                    'Enfócate en la técnica'
                ]
            });
        }
        return recommendations;
    };
    /**
     * Generate personalized recommendations across all modules
     * This function creates a holistic view of user needs
     */
    ChatMaestroService.prototype.generateHolisticRecommendations = function (context) {
        var recommendations = [];
        // Training recommendations
        var trainingRecs = this.generateTrainingRecommendations(context);
        recommendations.push.apply(recommendations, trainingRecs);
        // Recovery recommendations
        var recoveryRecs = this.generateRecoveryRecommendations(context);
        recommendations.push.apply(recommendations, recoveryRecs);
        // Nutrition recommendations
        var nutritionRecs = this.generateNutritionRecommendations(context);
        recommendations.push.apply(recommendations, nutritionRecs);
        // Progression recommendations
        var progressionRecs = this.generateProgressionRecommendations(context);
        recommendations.push.apply(recommendations, progressionRecs);
        // Wearables-based recommendations
        if (context.wearableInsights) {
            var wearableRecs = this.generateWearableRecommendations(context.wearableInsights);
            recommendations.push.apply(recommendations, wearableRecs);
        }
        return recommendations;
    };
    /**
     * Generate training recommendations
     */
    ChatMaestroService.prototype.generateTrainingRecommendations = function (context) {
        var recommendations = [];
        // Consistency-based recommendations
        if (context.recentWorkouts.length > 0) {
            var consistency = this.calculateWorkoutConsistency(context.recentWorkouts);
            if (consistency < 0.8) {
                recommendations.push({
                    module: 'training',
                    type: 'consistency',
                    priority: 'high',
                    title: 'Improve Training Consistency',
                    description: "Your recent workout consistency is ".concat(Math.round(consistency * 100), "%. Consider establishing a more regular training schedule."),
                    actionItems: [
                        'Set specific training days each week',
                        'Use habit tracking to build consistency',
                        'Start with 3 days per week if needed'
                    ]
                });
            }
        }
        return recommendations;
    };
    /**
     * Generate recovery recommendations
     */
    ChatMaestroService.prototype.generateRecoveryRecommendations = function (context) {
        var recommendations = [];
        if (context.recoveryStatus) {
            // Fatigue-based recommendations
            if (context.recoveryStatus.fatigueLevel === 'high' || context.recoveryStatus.fatigueLevel === 'extreme') {
                recommendations.push({
                    module: 'recovery',
                    type: 'fatigue_management',
                    priority: 'high',
                    title: 'Prioritize Recovery',
                    description: "Your fatigue level is ".concat(context.recoveryStatus.fatigueLevel, ". Focus on recovery activities today."),
                    actionItems: [
                        'Schedule a rest day',
                        'Try active recovery (light stretching or walking)',
                        'Focus on sleep quality tonight'
                    ]
                });
            }
        }
        return recommendations;
    };
    /**
     * Generate nutrition recommendations
     */
    ChatMaestroService.prototype.generateNutritionRecommendations = function (context) {
        var recommendations = [];
        if (context.nutritionData) {
            // Calorie-based recommendations
            if (context.nutritionData.totalNutrients.calories < 1500) {
                recommendations.push({
                    module: 'nutrition',
                    type: 'calorie_intake',
                    priority: 'medium',
                    title: 'Increase Calorie Intake',
                    description: 'Your daily calorie intake is below recommended levels for your activity level.',
                    actionItems: [
                        'Add healthy snacks between meals',
                        'Increase portion sizes gradually',
                        'Focus on nutrient-dense foods'
                    ]
                });
            }
        }
        return recommendations;
    };
    /**
     * Generate progression recommendations
     */
    ChatMaestroService.prototype.generateProgressionRecommendations = function (context) {
        var recommendations = [];
        if (context.progressionPlans.length > 0) {
            // Stagnation-based recommendations
            var stagnantPlans = context.progressionPlans.filter(function (plan) {
                return plan.adjustments.length === 0;
            });
            if (stagnantPlans.length > 0) {
                recommendations.push({
                    module: 'progression',
                    type: 'progress_stagnation',
                    priority: 'medium',
                    title: 'Address Progress Stagnation',
                    description: "".concat(stagnantPlans.length, " of your progression plans show no recent adjustments. Consider evaluating these exercises."),
                    actionItems: [
                        'Review form and technique for stagnant exercises',
                        'Consider changing training variables (tempo, rest, etc.)',
                        'Consult with a coach for advanced techniques'
                    ]
                });
            }
        }
        return recommendations;
    };
    /**
     * Generate wearable-based recommendations
     */
    ChatMaestroService.prototype.generateWearableRecommendations = function (wearables) {
        var recommendations = [];
        // Recovery status-based recommendations
        if (wearables.recoveryStatus === 'poor' || wearables.recoveryStatus === 'critical') {
            recommendations.push({
                module: 'wearables',
                type: 'recovery_optimization',
                priority: 'high',
                title: 'Optimize Recovery Based on Biometrics',
                description: "Your wearable data indicates ".concat(wearables.recoveryStatus, " recovery status. Adjust your approach accordingly."),
                actionItems: [
                    'Prioritize sleep quality (7-9 hours)',
                    'Focus on stress reduction techniques',
                    'Consider active recovery instead of intense training'
                ]
            });
        }
        // Training readiness-based recommendations
        if (wearables.trainingReadiness === 'rest') {
            recommendations.push({
                module: 'wearables',
                type: 'training_modification',
                priority: 'high',
                title: 'Modify Training Based on Readiness',
                description: 'Your wearable data suggests today is better for rest than intense training.',
                actionItems: [
                    'Schedule a complete rest day',
                    'Focus on sleep and nutrition today',
                    'Plan more intensive sessions for when readiness improves'
                ]
            });
        }
        return recommendations;
    };
    /**
     * Calculate workout consistency from recent sessions
     */
    ChatMaestroService.prototype.calculateWorkoutConsistency = function (workouts) {
        if (workouts.length === 0)
            return 0;
        // For simplicity, we'll assume consistency based on workout frequency
        // In a real implementation, this would be more sophisticated
        return Math.min(1, workouts.length / 7); // Assuming 7-day period
    };
    /**
     * Adjust communication style based on plan phase and user progress
     * Integrates the personality system with plan progression
     */
    ChatMaestroService.prototype.adjustCommunicationStyleForPlanPhase = function (baseStyle, context) {
        // Determine the current plan phase
        var planPhaseStyle = this.determinePlanPhaseApproach(context);
        // If the plan phase suggests a different approach, consider it
        // but don't override critical state-based styles
        var recoveryStatus = context.recoveryStatus;
        var wearableInsights = context.wearableInsights;
        // Don't override empathetic responses (fatigue/stress)
        if (baseStyle === 'mentor' || baseStyle === 'philosopher') {
            // User is fatigued or stressed - maintain empathetic approach
            if ((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'high' || (recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'extreme' ||
                ((wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'poor' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'critical')) {
                return baseStyle;
            }
        }
        // Don't override technical responses when in technical contexts
        if (baseStyle === 'scientist' &&
            (context.currentScreen === 'progression' || context.currentScreen === 'recovery' ||
                context.currentScreen === 'nutrition')) {
            return baseStyle;
        }
        // For other cases, consider the plan phase approach
        return planPhaseStyle;
    };
    /**
     * Adaptive response generation based on user context
     * This function ensures responses are personalized and contextually appropriate
     */
    ChatMaestroService.prototype.generateAdaptiveResponse = function (context, intent, userInput) {
        // Use Spartan Coach for personality-driven responses
        return this.spartanCoach.generateCoachingMessage(context, userInput);
    };
    /**
     * Risk assessment across all modules
     * This function identifies potential issues before they become problems
     */
    ChatMaestroService.prototype.assessSystemRisks = function (context) {
        var risks = [];
        // Recovery risks
        if (context.recoveryStatus &&
            (context.recoveryStatus.fatigueLevel === 'high' || context.recoveryStatus.fatigueLevel === 'extreme')) {
            risks.push({
                module: 'recovery',
                type: 'overtraining_risk',
                severity: 'high',
                description: 'High fatigue levels indicate potential overtraining risk',
                recommendations: [
                    'Prioritize recovery activities',
                    'Consider reducing training intensity',
                    'Focus on sleep and nutrition'
                ]
            });
        }
        // Wearables-based risks
        if (context.wearableInsights) {
            if (context.wearableInsights.recoveryStatus === 'critical') {
                risks.push({
                    module: 'wearables',
                    type: 'health_risk',
                    severity: 'high',
                    description: 'Wearable data indicates critical recovery status',
                    recommendations: [
                        'Take a complete rest day',
                        'Consult with a healthcare professional if this persists',
                        'Focus on stress reduction'
                    ]
                });
            }
        }
        // Training consistency risks
        if (context.recentWorkouts.length > 0) {
            var consistency = this.calculateWorkoutConsistency(context.recentWorkouts);
            if (consistency < 0.5) {
                risks.push({
                    module: 'training',
                    type: 'consistency_risk',
                    severity: 'medium',
                    description: 'Low training consistency may impact progress',
                    recommendations: [
                        'Establish a regular training schedule',
                        'Start with fewer days per week and build up',
                        'Use habit tracking to improve adherence'
                    ]
                });
            }
        }
        return risks;
    };
    /**
     * Determine user intent from input and context
     */
    ChatMaestroService.prototype.determineIntent = function (input, context) {
        var lowerInput = input.toLowerCase();
        // First check for specific intent types
        // Technical questions - specific inquiries about how to do something
        if (this.isTechnicalQuestion(lowerInput)) {
            return 'technical_question';
        }
        // Motivational questions - requests for encouragement or emotional support
        if (this.isMotivationalQuestion(lowerInput)) {
            return 'motivational_question';
        }
        // Context-aware routing based on current screen
        if (context.currentScreen === 'workoutDetail' && context.activeWorkout) {
            if (lowerInput.includes('siguiente') ||
                lowerInput.includes('próximo') ||
                lowerInput.includes('ejercicio')) {
                return 'workout_inquiry';
            }
        }
        if (context.currentScreen === 'recovery' || context.currentScreen === 'recoveryDashboard') {
            if (lowerInput.includes('descanso') ||
                lowerInput.includes('recuperación') ||
                lowerInput.includes('cansado')) {
                return 'recovery_advice';
            }
        }
        if (context.currentScreen === 'progression' || context.currentScreen === 'loadProgression') {
            if (lowerInput.includes('progreso') ||
                lowerInput.includes('carga') ||
                lowerInput.includes('peso')) {
                return 'progression_guidance';
            }
        }
        if (context.currentScreen === 'nutrition' || context.currentScreen === 'nutritionDashboard') {
            if (lowerInput.includes('comida') ||
                lowerInput.includes('nutrición') ||
                lowerInput.includes('calorías') ||
                lowerInput.includes('proteína') ||
                lowerInput.includes('comer')) {
                return 'nutrition_guidance';
            }
        }
        // More specific intent detection to avoid conflicts
        // Nutrition-related inquiries (check first to avoid conflicts)
        if (lowerInput.includes('comida') ||
            lowerInput.includes('nutrición') ||
            lowerInput.includes('calorías') ||
            lowerInput.includes('proteína') ||
            lowerInput.includes('dieta') ||
            lowerInput.includes('comer')) {
            return 'nutrition_guidance';
        }
        // Routine modification requests
        if (lowerInput.includes('cambiar') ||
            lowerInput.includes('modificar') ||
            lowerInput.includes('ajustar') ||
            lowerInput.includes('adaptar') ||
            lowerInput.includes('rutina semanal')) {
            return 'routine_modification';
        }
        // Performance analysis requests
        if (lowerInput.includes('rendimiento') ||
            lowerInput.includes('análisis') ||
            lowerInput.includes('mejorar') ||
            lowerInput.includes('evaluación') ||
            lowerInput.includes('progreso últimamente')) {
            return 'performance_analysis';
        }
        // Workout-related inquiries
        if (lowerInput.includes('entrenamiento') ||
            lowerInput.includes('ejercicio') ||
            lowerInput.includes('rutina') ||
            lowerInput.includes('workout')) {
            return 'workout_inquiry';
        }
        // Recovery-related inquiries
        if (lowerInput.includes('descanso') ||
            lowerInput.includes('recuperación') ||
            lowerInput.includes('cansado') ||
            lowerInput.includes('fatiga') ||
            lowerInput.includes('dolor')) {
            return 'recovery_advice';
        }
        // Progression-related inquiries
        if (lowerInput.includes('progreso') ||
            lowerInput.includes('carga') ||
            lowerInput.includes('peso') ||
            lowerInput.includes('intensidad') ||
            lowerInput.includes('volumen')) {
            return 'progression_guidance';
        }
        // Goal setting discussions
        if (lowerInput.includes('meta') ||
            lowerInput.includes('objetivo') ||
            lowerInput.includes('plan') ||
            lowerInput.includes('estrategia')) {
            return 'goal_setting';
        }
        // Technical support requests
        if (lowerInput.includes('problema') ||
            lowerInput.includes('error') ||
            lowerInput.includes('ayuda') ||
            lowerInput.includes('funciona')) {
            return 'technical_support';
        }
        // If we can't determine a specific intent and the question is unclear, it's ambiguous
        if (this.isAmbiguousQuestion(lowerInput)) {
            return 'ambiguous_question';
        }
        // Check for system optimization queries
        if (lowerInput.includes('optimización') ||
            lowerInput.includes('optimizacion') ||
            lowerInput.includes('rendimiento del sistema') ||
            lowerInput.includes('performance del sistema') ||
            lowerInput.includes('eficiencia') ||
            lowerInput.includes('sistema')) {
            // If it's specifically about system optimization, return a special intent
            if (lowerInput.includes('optimización del sistema') ||
                lowerInput.includes('optimizacion del sistema') ||
                lowerInput.includes('rendimiento del sistema') ||
                lowerInput.includes('eficiencia del sistema')) {
                return 'system_optimization';
            }
        }
        return 'general';
    };
    /**
     * Check if a question is technical in nature
     */
    ChatMaestroService.prototype.isTechnicalQuestion = function (input) {
        var technicalKeywords = [
            'cómo', 'como', 'qué', 'que', 'cuál', 'cual', 'cuanto', 'cuánto',
            'instrucciones', 'técnicas', 'técnica', 'forma', 'manera',
            'pasos', 'procedimiento', 'proceso', 'método', 'modo'
        ];
        return technicalKeywords.some(function (keyword) { return input.includes(keyword); }) &&
            (input.includes('hacer') || input.includes('realizar') || input.includes('ejecutar'));
    };
    /**
     * Check if a question is motivational in nature
     */
    ChatMaestroService.prototype.isMotivationalQuestion = function (input) {
        var motivationalKeywords = [
            'ánimo', 'motivación', 'motivame', 'motívame', 'fuerza',
            'desánimo', 'desanimado', 'cansado', 'agotado', 'deprimido',
            'continuar', 'seguir', 'rendir', 'rindo', 'abandonar'
        ];
        return motivationalKeywords.some(function (keyword) { return input.includes(keyword); });
    };
    /**
     * Check if a question is ambiguous
     */
    ChatMaestroService.prototype.isAmbiguousQuestion = function (input) {
        var ambiguousKeywords = [
            'no sé', 'no se', 'no entiendo', 'confundido', 'confusión',
            'algo', 'algo mal', 'algo pasa', 'problema', 'duda',
            'ayuda', 'necesito', 'quiero', 'debo'
        ];
        // Very short or vague questions are likely ambiguous
        var isVague = input.length < 10 &&
            !input.includes('?') &&
            !this.isTechnicalQuestion(input) &&
            !this.isMotivationalQuestion(input);
        return isVague || ambiguousKeywords.some(function (keyword) { return input.includes(keyword); });
    };
    /**
     * Generate response based on intent and context
     * Integrates the Chat Maestro personality system for adaptive communication
     */
    ChatMaestroService.prototype.generateResponse = function (input, intent, context) {
        return __awaiter(this, void 0, void 0, function () {
            var baseCommunicationStyle, adjustedCommunicationStyle, toneModifiers, _a, optimizationInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Check if we should provide wearable-based recommendations
                        if (context.wearableInsights && this.shouldProvideWearableAdvice(input, intent)) {
                            return [2 /*return*/, this.handleWearableBasedAdvice(input, context)];
                        }
                        baseCommunicationStyle = this.determineCommunicationStyle(context);
                        adjustedCommunicationStyle = this.adjustCommunicationStyleForPlanPhase(baseCommunicationStyle, context);
                        toneModifiers = this.generateToneModifiers(context);
                        _a = intent;
                        switch (_a) {
                            case 'ambiguous_question': return [3 /*break*/, 1];
                            case 'technical_question': return [3 /*break*/, 2];
                            case 'motivational_question': return [3 /*break*/, 3];
                            case 'workout_inquiry': return [3 /*break*/, 4];
                            case 'recovery_advice': return [3 /*break*/, 5];
                            case 'progression_guidance': return [3 /*break*/, 6];
                            case 'nutrition_guidance': return [3 /*break*/, 7];
                            case 'routine_modification': return [3 /*break*/, 8];
                            case 'performance_analysis': return [3 /*break*/, 9];
                            case 'goal_setting': return [3 /*break*/, 10];
                            case 'motivation': return [3 /*break*/, 11];
                            case 'technical_support': return [3 /*break*/, 12];
                            case 'system_optimization': return [3 /*break*/, 13];
                            case 'general': return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 15];
                    case 1: return [2 /*return*/, this.doubtResolutionEngine.resolveAmbiguousQuestion(input, context)];
                    case 2: return [2 /*return*/, this.doubtResolutionEngine.resolveTechnicalQuestion(input, context)];
                    case 3: return [2 /*return*/, this.doubtResolutionEngine.resolveMotivationalQuestion(input, context)];
                    case 4: return [2 /*return*/, this.handleWorkoutInquiry(input, context)];
                    case 5: return [2 /*return*/, this.handleRecoveryAdvice(input, context)];
                    case 6: return [2 /*return*/, this.handleProgressionGuidance(input, context)];
                    case 7: return [2 /*return*/, this.handleNutritionGuidance(input, context)];
                    case 8: return [2 /*return*/, this.handleRoutineModification(input, context)];
                    case 9: return [2 /*return*/, this.handlePerformanceAnalysis(input, context)];
                    case 10: return [2 /*return*/, this.handleGoalSetting(input, context)];
                    case 11: return [2 /*return*/, this.handleMotivation(input, context)];
                    case 12: return [2 /*return*/, this.handleTechnicalSupport(input, context)];
                    case 13: return [4 /*yield*/, this.provideSystemOptimizationInfo()];
                    case 14:
                        optimizationInfo = _b.sent();
                        return [2 /*return*/, {
                                response: optimizationInfo
                            }];
                    case 15: 
                    // Use Spartan Coach for all other responses, passing communication style and tone modifiers
                    return [2 /*return*/, this.spartanCoach.generateCoachingMessage(context, input)];
                }
            });
        });
    };
    /**
     * Handle workout-related inquiries with context awareness
     */
    ChatMaestroService.prototype.handleWorkoutInquiry = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerInput, response, actionItems, firstDay, nextExercise, habits, recommendedDays;
            return __generator(this, function (_a) {
                lowerInput = input.toLowerCase();
                response = '';
                actionItems = [];
                // Check if user is asking for a detailed plan explanation
                if (lowerInput.includes('explica') || lowerInput.includes('detalla') ||
                    lowerInput.includes('estructura') || lowerInput.includes('lógica') ||
                    lowerInput.includes('objetivo') || lowerInput.includes('fase') ||
                    lowerInput.includes('progresión') || lowerInput.includes('nivel')) {
                    return [2 /*return*/, this.handleDetailedPlanExplanation(input, context)];
                }
                // Context-aware responses based on current screen
                if (context.currentScreen === 'workoutDetail' && context.activeWorkout) {
                    if (lowerInput.includes('siguiente') || lowerInput.includes('próximo')) {
                        response = "Tu pr\u00F3ximo ejercicio en la rutina \"".concat(context.activeWorkout.name, "\" es: ");
                        // Add details about the next exercise
                        if (context.activeWorkout.days.length > 0) {
                            firstDay = context.activeWorkout.days[0];
                            if (firstDay.exercises.length > 0) {
                                nextExercise = firstDay.exercises[0];
                                response += "".concat(nextExercise.name, " - ").concat(nextExercise.sets, " series de ").concat(nextExercise.reps, " repeticiones");
                            }
                        }
                    }
                    else if (lowerInput.includes('duración') || lowerInput.includes('tiempo')) {
                        response = "La duraci\u00F3n estimada de tu rutina \"".concat(context.activeWorkout.name, "\" es de ").concat(context.activeWorkout.duration, " minutos.");
                    }
                    else {
                        response = "Est\u00E1s trabajando en la rutina \"".concat(context.activeWorkout.name, "\". \u00BFTe gustar\u00EDa que te explique alg\u00FAn ejercicio en particular o necesitas ayuda con algo espec\u00EDfico de esta rutina?");
                    }
                }
                else if (context.currentScreen === 'dashboard') {
                    habits = habit_tracking_1.habitTrackingService.getUserHabits(context.userId);
                    if (habits) {
                        recommendedDays = habit_tracking_1.habitTrackingService.getRecommendedTrainingDays(context.userId);
                        response = "Basado en tu historial, te recomiendo entrenar los d\u00EDas: ".concat(recommendedDays.join(', '), ". ");
                        response += '¿Te gustaría generar una nueva rutina o revisar tus rutinas existentes?';
                        actionItems.push('Generar nueva rutina', 'Ver rutinas existentes');
                    }
                    else {
                        response = 'No he encontrado un entrenamiento activo. ¿Te gustaría que te ayude a crear una rutina personalizada?';
                        actionItems.push('Crear nueva rutina');
                    }
                }
                else {
                    // General workout inquiry
                    if (context.activeWorkout) {
                        response = "Actualmente est\u00E1s trabajando en la rutina \"".concat(context.activeWorkout.name, "\". ");
                        response += '¿Necesitas ayuda con algo específico de esta rutina?';
                    }
                    else {
                        response = 'No tienes una rutina activa en este momento. ';
                        response += '¿Te gustaría que te ayude a crear una rutina personalizada?';
                        actionItems.push('Crear nueva rutina');
                    }
                }
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle detailed plan explanation requests with structured, motivational content
     */
    ChatMaestroService.prototype.handleDetailedPlanExplanation = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var workout, userFitnessLevel, response, actionItems;
            return __generator(this, function (_a) {
                if (!context.activeWorkout) {
                    return [2 /*return*/, {
                            response: 'No tienes una rutina activa en este momento. ¿Te gustaría que te ayude a crear una rutina personalizada?',
                            actionItems: ['Crear nueva rutina']
                        }];
                }
                workout = context.activeWorkout;
                userFitnessLevel = context.userData.fitnessLevel || 'intermediate';
                response = "\uD83C\uDFAF **PLAN DETALLADO: ".concat(workout.name.toUpperCase(), "**\n\n");
                // Explain plan objectives based on user level
                response += this.explainPlanObjectives(workout, userFitnessLevel);
                // Explain plan phases
                response += this.explainPlanPhases(workout, userFitnessLevel);
                // Explain progression logic
                response += this.explainProgressionLogic(workout, userFitnessLevel);
                // Add motivational closing
                response += this.addMotivationalClosing(userFitnessLevel);
                actionItems = [
                    'Ver ejercicios detallados',
                    'Entender la técnica de cada movimiento',
                    'Consultar progresión semanal',
                    'Evaluar mi nivel actual'
                ];
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Explain plan objectives adapted to user level
     */
    ChatMaestroService.prototype.explainPlanObjectives = function (workout, userLevel) {
        var explanation = '📋 **OBJETIVOS DEL PLAN**\n';
        // General objective based on plan focus
        var focusAreas = workout.focus.join(', ');
        explanation += "\u2022 Desarrollar ".concat(focusAreas, " de manera equilibrada\n");
        // Level-specific objectives
        switch (userLevel) {
            case 'beginner':
                explanation += '• Establecer una base sólida de fuerza y resistencia\n';
                explanation += '• Aprender la técnica correcta de cada ejercicio\n';
                explanation += '• Crear el hábito del entrenamiento regular\n';
                break;
            case 'intermediate':
                explanation += '• Incrementar la fuerza y masa muscular\n';
                explanation += '• Mejorar la resistencia y capacidad metabólica\n';
                explanation += '• Refinar la técnica y aumentar la intensidad\n';
                break;
            case 'advanced':
                explanation += '• Maximizar la fuerza y potencia\n';
                explanation += '• Romper mesetas de progreso\n';
                explanation += 'Optimizar la recuperación y rendimiento\n';
                break;
            default:
                explanation += '• Mejorar tu condición física general\n';
                explanation += '• Aumentar tu resistencia y fuerza\n';
                explanation += '• Desarrollar hábitos saludables\n';
        }
        explanation += '\n';
        return explanation;
    };
    /**
     * Explain plan phases adapted to user level
     */
    ChatMaestroService.prototype.explainPlanPhases = function (workout, userLevel) {
        var explanation = '📊 **FASES DEL PLAN**\n';
        // Number of days in the plan
        var dayCount = workout.days.length;
        if (dayCount <= 3) {
            explanation += '• **Fase de Adaptación** (Semanas 1-2): Introducir ejercicios y establecer rutina\n';
            explanation += '• **Fase de Consolidación** (Semanas 3-6): Aumentar intensidad y volumen gradualmente\n';
            explanation += '• **Fase de Progresión** (Semanas 7+): Implementar cargas progresivas y variaciones\n';
        }
        else if (dayCount <= 5) {
            explanation += '• **Fase de Activación** (Semanas 1-2): Activar todos los grupos musculares\n';
            explanation += '• **Fase de Hipertrofia** (Semanas 3-6): Volumen moderado-alto para crecimiento muscular\n';
            explanation += '• **Fase de Fuerza** (Semanas 7-10): Mayor intensidad y cargas progresivas\n';
            explanation += '• **Fase de Potencia** (Semanas 11+): Velocidad y explosividad\n';
        }
        else {
            explanation += '• **Fase de Volumen** (Semanas 1-4): Alta frecuencia y volumen para hipertrofia\n';
            explanation += '• **Fase de Intensidad** (Semanas 5-8): Mayor carga y menor volumen para fuerza\n';
            explanation += '• **Fase de Potencia** (Semanas 9-12): Movimientos explosivos y complejos\n';
            explanation += '• **Fase de Recuperación** (Semana 13): Deload para recuperación óptima\n';
        }
        // Level-specific adaptations
        switch (userLevel) {
            case 'beginner':
                explanation += '• Enfoque en técnica y consistencia antes que intensidad\n';
                explanation += '• Progresión más lenta para evitar lesiones\n';
                break;
            case 'intermediate':
                explanation += '• Balance entre volumen e intensidad\n';
                explanation += '• Progresión controlada con ajustes semanales\n';
                break;
            case 'advanced':
                explanation += '• Periodización avanzada con microciclos\n';
                explanation += '• Estrategias de sobrecarga progresiva específicas\n';
                break;
        }
        explanation += '\n';
        return explanation;
    };
    /**
     * Explain progression logic adapted to user level
     */
    ChatMaestroService.prototype.explainProgressionLogic = function (workout, userLevel) {
        var explanation = '📈 **LÓGICA DE PROGRESIÓN**\n';
        // General progression principles
        explanation += '• **Progresión Continua**: Aumentar carga, volumen o intensidad cada 1-2 semanas\n';
        explanation += '• **Variación Sistemática**: Cambiar ejercicios y patrones de movimiento periódicamente\n';
        explanation += '• **Monitoreo del Rendimiento**: Registrar repeticiones, cargas y percepción de esfuerzo\n';
        // Level-specific progression
        switch (userLevel) {
            case 'beginner':
                explanation += '• **Progresión Lineal**: Aumentar 2.5-5% la carga semanalmente\n';
                explanation += '• **Enfoque en Forma**: Priorizar técnica sobre peso\n';
                explanation += '• **Frecuencia Alta**: 3-4 sesiones por grupo muscular\n';
                break;
            case 'intermediate':
                explanation += '• **Progresión Ondulada**: Variar intensidad y volumen dentro de la semana\n';
                explanation += '• **Periodización por Bloques**: Ciclos de 4-6 semanas con objetivos específicos\n';
                explanation += '• **Autoregulación**: Ajustar según RPE y sensación diaria\n';
                break;
            case 'advanced':
                explanation += '• **Progresión Concurrente**: Trabajar fuerza, hipertrofia y potencia simultáneamente\n';
                explanation += '• **Modelado de Frecuencia**: Ajustar frecuencia según ejercicio y grupo muscular\n';
                explanation += '• **Análisis Avanzado**: Usar métricas de rendimiento y recuperación\n';
                break;
        }
        // Rest and recovery
        explanation += '• **Recuperación Estratégica**: Días de descanso y recuperación activa\n';
        explanation += '• **Deload Semanal**: Reducción del 40-50% en volumen cada 4-6 semanas\n';
        explanation += '\n';
        return explanation;
    };
    /**
     * Add motivational closing based on user level
     */
    ChatMaestroService.prototype.addMotivationalClosing = function (userLevel) {
        var closing = '🔥 **CONSEJO MOTIVACIONAL**\n';
        switch (userLevel) {
            case 'beginner':
                closing += 'Recuerda que cada sesión cuenta. La consistencia es más importante que la perfección. ';
                closing += 'Celebra cada pequeño logro y confía en el proceso. ¡Estás construyendo tu base para el éxito!\n\n';
                break;
            case 'intermediate':
                closing += 'Has superado lo básico y ahora es momento de desafiar tus límites. ';
                closing += 'Confía en tu preparación y escucha a tu cuerpo. ¡Cada repetición te acerca a la grandeza!\n\n';
                break;
            case 'advanced':
                closing += 'Eres un guerrero experimentado. Ahora es momento de perfeccionar y dominar. ';
                closing += 'Cada sesión es una oportunidad para superar tu marca personal. ¡La excelencia es tu estándar!\n\n';
                break;
            default:
                closing += 'Cada día que entrenas, estás eligiendo convertirte en una mejor versión de ti mismo. ';
                closing += 'Mantén el foco, la disciplina y la pasión. ¡El éxito es una consecuencia de tu consistencia!\n\n';
        }
        return closing;
    };
    /**
     * Determine if we should provide wearable-based advice
     */
    ChatMaestroService.prototype.shouldProvideWearableAdvice = function (input, intent) {
        var lowerInput = input.toLowerCase();
        // Check for wearable-related keywords
        var wearableKeywords = [
            'hrv', 'variabilidad cardíaca', 'frecuencia cardíaca',
            'sueño', 'descanso', 'recuperación', 'pasos',
            'calorías', 'vo2', 'carga de entrenamiento'
        ];
        return wearableKeywords.some(function (keyword) { return lowerInput.includes(keyword); });
    };
    /**
     * Handle wearable-based advice requests using Spartan Coach
     */
    ChatMaestroService.prototype.handleWearableBasedAdvice = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!context.wearableInsights) {
                    return [2 /*return*/, {
                            response: 'No tengo datos de dispositivos wearables para analizar en este momento.'
                        }];
                }
                // Use Spartan Coach to interpret wearable data
                return [2 /*return*/, this.spartanCoach.interpretWearableData(context.wearableInsights, context)];
            });
        });
    };
    /**
     * Handle recovery advice requests with context awareness
     */
    ChatMaestroService.prototype.handleRecoveryAdvice = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var today, recoveryAnalysis, response, recommendations, actionItems;
            return __generator(this, function (_a) {
                today = new Date();
                recoveryAnalysis = recovery_service_1.recoveryService.getRecoveryAnalysis(context.userId, today);
                response = '';
                recommendations = [];
                actionItems = [];
                // Context-aware responses
                if (context.currentScreen === 'recovery' || context.currentScreen === 'recoveryDashboard') {
                    response = 'Estás en la sección de recuperación. ';
                }
                // Include wearable insights if available
                if (context.wearableInsights) {
                    response += "Tus m\u00E9tricas de recuperaci\u00F3n del dispositivo wearable indican un estado ".concat(context.wearableInsights.recoveryStatus, ". ");
                    if (context.wearableInsights.trainingReadiness === 'rest') {
                        response += 'Basado en tus datos, te recomiendo un día de descanso completo. ';
                    }
                    else if (context.wearableInsights.trainingReadiness === 'caution') {
                        response += 'Basado en tus datos, te recomiendo un entrenamiento ligero. ';
                    }
                }
                if (recoveryAnalysis) {
                    response += "Tu nivel de fatiga actual es ".concat(recoveryAnalysis.fatigueLevel, " con un puntaje de recuperaci\u00F3n de ").concat(recoveryAnalysis.recoveryScore, "/100. ");
                    if (recoveryAnalysis.fatigueLevel === 'extreme' || recoveryAnalysis.fatigueLevel === 'high') {
                        response += 'Te recomiendo priorizar la recuperación hoy. ';
                    }
                    else if (recoveryAnalysis.fatigueLevel === 'moderate') {
                        response += 'Tienes un nivel de fatiga moderado. ';
                    }
                    else {
                        response += 'Te encuentras en buen estado de recuperación. ';
                    }
                    // Add specific recommendations
                    if (recoveryAnalysis.recommendations.length > 0) {
                        response += 'Recomendaciones específicas: ';
                        recoveryAnalysis.recommendations.forEach(function (rec, index) {
                            response += "".concat(index + 1, ". ").concat(rec.title, ": ").concat(rec.description, ". ");
                            recommendations.push(rec);
                        });
                    }
                }
                else {
                    response += 'No tengo datos recientes sobre tu estado de recuperación. ';
                    response += '¿Te gustaría registrar cómo te sientes hoy para que pueda darte recomendaciones personalizadas?';
                    actionItems.push('Registrar métricas de recuperación');
                }
                return [2 /*return*/, {
                        response: response,
                        recommendations: recommendations,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle progression guidance requests with context awareness
     */
    ChatMaestroService.prototype.handleProgressionGuidance = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, recommendations, actionItems, intensityAdjustments, progressionPlans;
            return __generator(this, function (_a) {
                response = '';
                recommendations = [];
                actionItems = [];
                // Context-aware responses
                if (context.currentScreen === 'progression' || context.currentScreen === 'loadProgression') {
                    response = 'Estás en la sección de progresión de cargas. ';
                }
                // Include wearable insights if available
                if (context.wearableInsights) {
                    response += "Basado en tus m\u00E9tricas de entrenamiento del dispositivo wearable, ";
                    intensityAdjustments = context.wearableInsights.adjustments.filter(function (adj) { return adj.type === 'intensity' || adj.type === 'volume'; });
                    if (intensityAdjustments.length > 0) {
                        response += 'se recomiendan los siguientes ajustes: ';
                        intensityAdjustments.slice(0, 2).forEach(function (adjustment, index) {
                            var change = adjustment.value > 0 ? 'aumentar' : 'reducir';
                            response += "".concat(index + 1, ". ").concat(change, " ").concat(Math.abs(adjustment.value), "% porque ").concat(adjustment.reason, ". ");
                        });
                    }
                    else {
                        response += 'tu progresión actual parece apropiada. ';
                    }
                }
                progressionPlans = context.progressionPlans;
                if (progressionPlans.length > 0) {
                    response += 'Basado en tu historial de entrenamiento, aquí tienes tus recomendaciones de progresión: ';
                    progressionPlans.forEach(function (plan, index) {
                        response += "".concat(index + 1, ". ").concat(plan.exerciseName, ": ");
                        if (plan.adjustments.length > 0) {
                            var adjustment = plan.adjustments[0];
                            response += "Recomiendo ".concat(adjustment.adjustmentType === 'weight' ? 'ajustar el peso' : adjustment.adjustmentType, " en ").concat(Math.abs(adjustment.value), "%. ");
                            response += "Raz\u00F3n: ".concat(adjustment.reason, ". ");
                        }
                        else {
                            response += 'Tu progresión está en buen camino. ';
                        }
                        recommendations.push(plan);
                    });
                }
                else {
                    response += 'Aún no tengo suficientes datos para generar recomendaciones de progresión. ';
                    response += 'Completa algunas sesiones de entrenamiento y registrar tus repeticiones y RPE para que pueda ayudarte mejor.';
                    actionItems.push('Registrar sesión de entrenamiento');
                }
                return [2 /*return*/, {
                        response: response,
                        recommendations: recommendations,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle nutrition guidance requests
     */
    ChatMaestroService.prototype.handleNutritionGuidance = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerInput, response, actionItems, today, nutritionData;
            return __generator(this, function (_a) {
                lowerInput = input.toLowerCase();
                response = '';
                actionItems = [];
                today = new Date();
                nutritionData = nutrition_service_1.nutritionService.getNutritionRecommendations(context.userId, today);
                if (lowerInput.includes('calorías') || lowerInput.includes('caloría')) {
                    response = "Tu objetivo cal\u00F3rico diario es de ".concat(nutritionData.totalNutrients.calories, " calor\u00EDas. ");
                    if (nutritionData.calorieExpenditure) {
                        response += "Basado en tu entrenamiento, has quemado aproximadamente ".concat(nutritionData.calorieExpenditure, " calor\u00EDas hoy. ");
                    }
                }
                else if (lowerInput.includes('proteína')) {
                    response = "Tu objetivo de prote\u00EDna diaria es de ".concat(nutritionData.totalNutrients.protein, " gramos. ");
                    response += 'Es importante distribuir esta cantidad a lo largo del día en tus comidas principales.';
                }
                else {
                    response = "Hoy te recomiendo seguir esta distribuci\u00F3n nutricional: ";
                    response += "".concat(nutritionData.totalNutrients.calories, " calor\u00EDas, ");
                    response += "".concat(nutritionData.totalNutrients.protein, "g de prote\u00EDna, ");
                    response += "".concat(nutritionData.totalNutrients.carbs, "g de carbohidratos, ");
                    response += "".concat(nutritionData.totalNutrients.fats, "g de grasas. ");
                    if (nutritionData.meals.length > 0) {
                        response += 'Tus comidas recomendadas incluyen: ';
                        nutritionData.meals.slice(0, 3).forEach(function (meal, index) {
                            response += "".concat(index + 1, ". ").concat(meal.name, " (").concat(meal.time, "): ").concat(meal.ingredients.join(', '), ". ");
                        });
                    }
                }
                actionItems.push('Ver plan nutricional completo', 'Registrar comida');
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle routine modification requests
     */
    ChatMaestroService.prototype.handleRoutineModification = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, actionItems, contextUpdates, modificationRequest, today, recoveryAnalysis, progressionPlans, adjustments_1, adjustedWorkout, modificationResult;
            return __generator(this, function (_a) {
                response = '';
                actionItems = [];
                contextUpdates = {};
                modificationRequest = real_time_modification_service_1.realTimeModificationService.detectModificationRequest(input);
                // If no specific modification detected, fall back to original logic
                if (modificationRequest.type === 'none') {
                    today = new Date();
                    recoveryAnalysis = recovery_service_1.recoveryService.getRecoveryAnalysis(context.userId, today);
                    if (recoveryAnalysis && (recoveryAnalysis.fatigueLevel === 'extreme' || recoveryAnalysis.fatigueLevel === 'high')) {
                        response = 'Detecto que tu nivel de fatiga es alto. ';
                        response += 'En lugar de aumentar la intensidad, te recomiendo modificar tu rutina hacia una sesión de recuperación activa. ';
                        response += '¿Te gustaría que genere una rutina de recuperación en su lugar?';
                        actionItems.push('Generar rutina de recuperación');
                        contextUpdates.activeWorkout = undefined; // Clear active workout to allow new generation
                    }
                    else if (context.activeWorkout) {
                        progressionPlans = context.progressionPlans;
                        if (progressionPlans.length > 0) {
                            response = 'Puedo ajustar tu rutina actual basado en tu progreso: ';
                            adjustments_1 = [];
                            progressionPlans.forEach(function (plan) {
                                if (plan.adjustments.length > 0) {
                                    var adjustment = plan.adjustments[0];
                                    response += "Para ".concat(plan.exerciseName, ", recomiendo ").concat(adjustment.adjustmentType, " en ").concat(Math.abs(adjustment.value), "% porque ").concat(adjustment.reason, ". ");
                                    adjustments_1.push(adjustment);
                                }
                            });
                            adjustedWorkout = load_progression_service_1.loadProgressionService.applyProgressionAdjustments(context.activeWorkout, adjustments_1);
                            response += 'He aplicado estos ajustes a tu rutina actual. ';
                            contextUpdates.activeWorkout = adjustedWorkout;
                        }
                        else {
                            response = 'Tu rutina actual parece apropiada. ';
                            response += '¿Hay algún ejercicio específico que te gustaría modificar o algún objetivo particular que quieras alcanzar?';
                        }
                    }
                    else {
                        response = 'No tienes una rutina activa actualmente. ';
                        response += '¿Te gustaría que cree una nueva rutina personalizada basada en tus objetivos y estado actual?';
                        actionItems.push('Crear nueva rutina');
                    }
                }
                // Handle detected modification requests with our new real-time service
                else {
                    if (context.activeWorkout) {
                        modificationResult = real_time_modification_service_1.realTimeModificationService.modifyWorkoutPlan(context.activeWorkout, modificationRequest, context);
                        // Update the active workout with the modified plan
                        contextUpdates.activeWorkout = modificationResult.modifiedPlan;
                        // Generate response based on the modification
                        response = 'He modificado tu rutina en tiempo real:\n\n';
                        if (modificationResult.impactAnalysis.affectedExercises.length > 0) {
                            response += "\u2022 Ejercicios afectados: ".concat(modificationResult.impactAnalysis.affectedExercises.join(', '), "\n");
                        }
                        // Add details about the adjustments made
                        modificationResult.adjustments.forEach(function (adjustment) {
                            response += "\u2022 ".concat(adjustment.reason, "\n");
                        });
                        // Explain the ecosystem impact
                        response += '\n📋 **Impacto en el ecosistema**:\n';
                        modificationResult.impactAnalysis.ecosystemImpact.forEach(function (impact) {
                            response += "\u2022 ".concat(impact, "\n");
                        });
                        // Mention if global coherence was maintained
                        if (modificationResult.impactAnalysis.coherenceMaintained) {
                            response += '\n✅ La coherencia global del plan se ha mantenido.\n';
                        }
                        else {
                            response += '\n⚠️ Se han realizado ajustes para mantener la coherencia del plan.\n';
                        }
                        // Save the modified plan
                        real_time_modification_service_1.realTimeModificationService.saveModifiedPlan(context.userId, context.activeWorkout.id, modificationResult.modifiedPlan, modificationResult.adjustments);
                        response += '\n¿Hay algo más que te gustaría ajustar en tu rutina?';
                    }
                    else {
                        response = 'No tienes una rutina activa actualmente. ';
                        response += '¿Te gustaría que cree una nueva rutina personalizada basada en tus objetivos y estado actual?';
                        actionItems.push('Crear nueva rutina');
                    }
                }
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems,
                        contextUpdates: contextUpdates
                    }];
            });
        });
    };
    /**
     * Handle performance analysis requests
     */
    ChatMaestroService.prototype.handlePerformanceAnalysis = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, actionItems, recentWorkouts, consistency, progressionPlans, improvements, recoveryAnalyses, avgRecoveryScore;
            return __generator(this, function (_a) {
                response = '';
                actionItems = [];
                recentWorkouts = context.recentWorkouts.slice(0, 5);
                if (recentWorkouts.length > 0) {
                    response = 'Basado en tus últimas sesiones de entrenamiento: ';
                    consistency = Math.round((recentWorkouts.length / 5) * 100);
                    response += "Tu consistencia es del ".concat(consistency, "%. ");
                    progressionPlans = context.progressionPlans;
                    if (progressionPlans.length > 0) {
                        improvements = progressionPlans.filter(function (plan) {
                            return plan.adjustments.some(function (adj) { return adj.value > 0; });
                        }).length;
                        if (improvements > 0) {
                            response += "Detecto progreso positivo en ".concat(improvements, " ejercicios. ");
                        }
                    }
                    recoveryAnalyses = recovery_service_1.recoveryService.getRecentRecoveryAnalyses(7);
                    if (recoveryAnalyses.length > 0) {
                        avgRecoveryScore = recoveryAnalyses.reduce(function (sum, analysis) {
                            return sum + analysis.recoveryScore;
                        }, 0) / recoveryAnalyses.length;
                        if (avgRecoveryScore < 50) {
                            response += 'Tu recuperación promedio ha sido baja, lo que podría afectar tu rendimiento. ';
                        }
                        else if (avgRecoveryScore > 80) {
                            response += 'Tu recuperación es excelente, lo que favorece un buen rendimiento. ';
                        }
                    }
                }
                else {
                    response = 'Aún no tienes suficientes datos de entrenamiento para un análisis detallado. ';
                    response += 'Completa algunas sesiones y vuelve a consultarme para un análisis más completo.';
                    actionItems.push('Registrar sesión de entrenamiento');
                }
                actionItems.push('Ver informe de progreso completo');
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle goal setting discussions
     */
    ChatMaestroService.prototype.handleGoalSetting = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, actionItems, habits, userData;
            return __generator(this, function (_a) {
                response = '';
                actionItems = [];
                habits = habit_tracking_1.habitTrackingService.getUserHabits(context.userId);
                userData = context.userData;
                response = 'Para ayudarte a establecer metas efectivas, consideremos: ';
                // Analyze current training frequency
                if (habits) {
                    response += "Actualmente entrenas ".concat(habits.trainingFrequency, " veces por semana. ");
                    if (habits.trainingFrequency < 3) {
                        response += 'Para progresar, te recomendaría aumentar la frecuencia a 3-4 veces por semana. ';
                    }
                    else if (habits.trainingFrequency > 5) {
                        response += 'Entrenas con buena frecuencia, asegúrate de incluir días de recuperación. ';
                    }
                }
                // Analyze fitness level
                response += "Tu nivel actual es ".concat(userData.fitnessLevel, ". ");
                // Suggest SMART goals
                response += 'Te sugiero establecer metas específicas, medibles, alcanzables, relevantes y con tiempo definido. ';
                response += 'Por ejemplo: "Aumentar mi press de banca en 10kg en 8 semanas" o "Reducir mi porcentaje de grasa corporal al 12% en 12 semanas". ';
                actionItems.push('Definir nueva meta', 'Revisar metas existentes');
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle motivation requests
     */
    ChatMaestroService.prototype.handleMotivation = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var behaviorData, performanceMetrics, userFeedback, psychologyProfile, contextForCoach, coachingMessage;
            return __generator(this, function (_a) {
                behaviorData = context.recentWorkouts;
                performanceMetrics = {};
                userFeedback = [];
                psychologyProfile = this.conversationalCoach.analyzeUserPsychology(behaviorData, performanceMetrics, userFeedback);
                contextForCoach = {
                    sessionType: 'goal-setting',
                    timeOfDay: this.getCurrentTimeOfDay(),
                    recentBehavior: {
                        consistency: psychologyProfile.personalityTraits.resilience,
                        adherence: 7,
                        effort: 7
                    }
                };
                coachingMessage = this.conversationalCoach.generateCoachingMessage(psychologyProfile, contextForCoach);
                return [2 /*return*/, {
                        response: coachingMessage.content,
                        actionItems: coachingMessage.actionItems
                    }];
            });
        });
    };
    /**
     * Handle technical support requests
     */
    ChatMaestroService.prototype.handleTechnicalSupport = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, actionItems;
            return __generator(this, function (_a) {
                response = '';
                actionItems = [];
                response = 'Estoy aquí para ayudarte con cualquier problema técnico. ';
                response += 'Para poder asistirte mejor, por favor proporciona más detalles sobre el problema que estás experimentando. ';
                response += '¿La dificultad está relacionada con el registro de entrenamientos, la nutrición, los informes o alguna otra función?';
                actionItems.push('Reportar problema técnico', 'Ver guía de solución de problemas');
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Handle general inquiries
     */
    ChatMaestroService.prototype.handleGeneralInquiry = function (input, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response, actionItems, recommendations;
            return __generator(this, function (_a) {
                response = '';
                actionItems = [];
                recommendations = habit_tracking_1.habitTrackingService.generateRecommendations(context.userId);
                response = 'Hola, soy tu Chat Maestro de SPARTAN. ';
                response += 'Estoy aquí para ayudarte a optimizar tu entrenamiento, nutrición y recuperación. ';
                if (recommendations.workoutReminders.length > 0) {
                    response += "Recuerdo que tienes programado un entrenamiento para hoy. ";
                }
                response += '¿En qué puedo ayudarte hoy? Puedo: ';
                response += 'explicarte tus rutinas, ayudarte con la recuperación, ajustar tu progresión, ';
                response += 'guiarte en nutrición, analizar tu rendimiento o simplemente motivarte.';
                actionItems.push('Explicar mi rutina actual', 'Recomendaciones de recuperación', 'Ajustar mi progresión', 'Consejos nutricionales', 'Análisis de rendimiento');
                return [2 /*return*/, {
                        response: response,
                        actionItems: actionItems
                    }];
            });
        });
    };
    /**
     * Get current time of day for contextual messaging
     */
    ChatMaestroService.prototype.getCurrentTimeOfDay = function () {
        var hour = new Date().getHours();
        if (hour < 12)
            return 'morning';
        if (hour < 18)
            return 'afternoon';
        return 'evening';
    };
    /**
     * Detect if user is struggling with motivation
     */
    ChatMaestroService.prototype.detectMotivationalStruggle = function (context) {
        // Check for signs of motivational struggle
        var recentWorkouts = context.recentWorkouts;
        if (recentWorkouts.length < 3)
            return false; // Not enough data
        // Check consistency - if low, might indicate motivational struggle
        var consistency = this.calculateWorkoutConsistency(recentWorkouts);
        if (consistency < 0.5)
            return true;
        // Check recovery status - if consistently poor, might indicate struggle
        var recoveryAnalyses = this.getRecentRecoveryAnalyses(7);
        if (recoveryAnalyses.length > 0) {
            var avgRecoveryScore = recoveryAnalyses.reduce(function (sum, analysis) {
                return sum + analysis.recoveryScore;
            }, 0) / recoveryAnalyses.length;
            if (avgRecoveryScore < 50)
                return true;
        }
        return false;
    };
    /**
     * Get recent recovery analyses
     */
    ChatMaestroService.prototype.getRecentRecoveryAnalyses = function (days) {
        // This would integrate with the recovery service in a real implementation
        // For now, we'll return an empty array
        return [];
    };
    /**
     * Determine communication style based on user context and emotional state
     * Implements the hybrid personality system: disciplined, motivator, technical, empathetic
     */
    ChatMaestroService.prototype.determineCommunicationStyle = function (context) {
        // Check user's current emotional/physical state
        var recoveryStatus = context.recoveryStatus;
        var wearableInsights = context.wearableInsights;
        var recentWorkouts = context.recentWorkouts;
        // If user is fatigued or stressed, be more empathetic (mentor/philosopher)
        if ((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'high' || (recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'extreme' ||
            ((wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'poor' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'critical')) {
            return 'mentor';
        }
        // If user is performing well and ready, be more motivational (warrior)
        if (((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'low' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.trainingReadiness) === 'ready') &&
            recentWorkouts.length > 0) {
            // Check if they've been consistent
            var consistency = this.calculateWorkoutConsistency(recentWorkouts);
            if (consistency > 0.8) {
                return 'warrior'; // Challenge them to push further
            }
        }
        // If user is asking technical questions, be more scientific
        if (context.currentScreen === 'progression' || context.currentScreen === 'recovery' ||
            context.currentScreen === 'nutrition') {
            return 'scientist';
        }
        // If user seems to be struggling with motivation or goals, be more philosophical
        if (this.detectMotivationalStruggle(context)) {
            return 'philosopher';
        }
        // Default to adaptive style that adjusts based on context
        return 'adaptive';
    };
    /**
     * Generate tone modifiers based on user state and context
     * Adapts intensity, firmness, enthusiasm, and technicality based on situation
     */
    ChatMaestroService.prototype.generateToneModifiers = function (context) {
        var modifiers = {
            intensity: 'moderate',
            firmness: 'firm',
            enthusiasm: 'energetic',
            technicality: 'moderate'
        };
        // Adjust based on recovery status
        var recoveryStatus = context.recoveryStatus;
        var wearableInsights = context.wearableInsights;
        if ((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'high' || (recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'extreme' ||
            (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'poor' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'critical') {
            // Be less intense and firm when user is fatigued
            modifiers.intensity = 'low';
            modifiers.firmness = 'gentle';
            modifiers.enthusiasm = 'calm';
        }
        else if ((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'low' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.trainingReadiness) === 'ready') {
            // Be more intense when user is ready
            modifiers.intensity = 'high';
            modifiers.enthusiasm = 'intense';
        }
        // Adjust technicality based on screen context
        if (context.currentScreen === 'progression' || context.currentScreen === 'recovery' ||
            context.currentScreen === 'nutrition') {
            modifiers.technicality = 'complex';
        }
        else {
            modifiers.technicality = 'simple';
        }
        return modifiers;
    };
    /**
     * Determine the appropriate communication approach based on plan phase
     * Adapts style according to initiation, stagnation, or achievement phases
     */
    ChatMaestroService.prototype.determinePlanPhaseApproach = function (context) {
        // Determine plan phase based on user progress and consistency
        var recentWorkouts = context.recentWorkouts;
        var progressionPlans = context.progressionPlans;
        if (recentWorkouts.length === 0) {
            // Beginning phase - establishing routine
            return this.adaptiveToneSystem.planPhaseAdaptation.initiationPhase.style;
        }
        // Check consistency to determine phase
        var consistency = this.calculateWorkoutConsistency(recentWorkouts);
        if (consistency < 0.5) {
            // Stagnation phase - overcoming plateaus
            return this.adaptiveToneSystem.planPhaseAdaptation.stagnationPhase.style;
        }
        else if (consistency > 0.8) {
            // Achievement phase - peak performance
            return this.adaptiveToneSystem.planPhaseAdaptation.achievementPhase.style;
        }
        // Default to initiation phase for building consistency
        return this.adaptiveToneSystem.planPhaseAdaptation.initiationPhase.style;
    };
    /**
     * Build comprehensive context for Chat Maestro
     */
    ChatMaestroService.prototype.buildContext = function (userId, currentScreen, activeWorkout) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, userHabits, recentWorkouts, today, recoveryStatus, progressionPlans, nutritionData, wearableInsights;
            return __generator(this, function (_a) {
                userData = storage_1.storageManager.getUserData() || {
                    name: "Usuario SPARTAN",
                    age: 30,
                    weight: 75,
                    height: 180,
                    fitnessLevel: "intermediate",
                    goals: ["Mejorar fuerza", "Aumentar masa muscular"]
                };
                userHabits = storage_1.storageManager.getUserHabits();
                recentWorkouts = storage_1.storageManager.getWorkoutSessions()
                    .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })
                    .slice(0, 10);
                today = new Date();
                recoveryStatus = recovery_service_1.recoveryService.getRecoveryAnalysis(userId, today) || undefined;
                progressionPlans = storage_1.storageManager.getProgressionPlans();
                nutritionData = nutrition_service_1.nutritionService.getNutritionRecommendations(userId, today);
                // Simulate wearable insights based on available data
                if (recoveryStatus) {
                    wearableInsights = this.simulateWearableInsights(recoveryStatus, recentWorkouts);
                }
                // Notify the nervous system of context update
                spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                    type: 'data_updated',
                    timestamp: new Date(),
                    userId: userId,
                    payload: {
                        userData: userData,
                        userHabits: userHabits,
                        recentWorkouts: recentWorkouts,
                        recoveryStatus: recoveryStatus,
                        progressionPlans: progressionPlans,
                        nutritionData: nutritionData,
                        wearableInsights: wearableInsights
                    },
                    sourceModule: 'ChatMaestroService',
                    priority: 'medium'
                });
                return [2 /*return*/, {
                        userId: userId,
                        currentScreen: currentScreen,
                        activeWorkout: activeWorkout,
                        userData: userData,
                        userHabits: userHabits,
                        recentWorkouts: recentWorkouts,
                        recoveryStatus: recoveryStatus,
                        progressionPlans: progressionPlans,
                        nutritionData: nutritionData,
                        wearableInsights: wearableInsights
                    }];
            });
        });
    };
    /**
     * Simulate wearable insights based on recovery status and recent workouts
     * In a real implementation, this would come from actual wearable data
     */
    ChatMaestroService.prototype.simulateWearableInsights = function (recoveryStatus, recentWorkouts) {
        // Simulate wearable data based on recovery status
        var recoveryScore = recoveryStatus.recoveryScore;
        // Determine recovery status based on recovery score
        var recoveryStatusValue;
        if (recoveryScore >= 85)
            recoveryStatusValue = 'optimal';
        else if (recoveryScore >= 70)
            recoveryStatusValue = 'good';
        else if (recoveryScore >= 50)
            recoveryStatusValue = 'fair';
        else if (recoveryScore >= 30)
            recoveryStatusValue = 'poor';
        else
            recoveryStatusValue = 'critical';
        // Determine training readiness
        var trainingReadiness;
        if (recoveryScore >= 75)
            trainingReadiness = 'ready';
        else if (recoveryScore >= 50)
            trainingReadiness = 'caution';
        else
            trainingReadiness = 'rest';
        // Generate adjustments based on recovery status
        var adjustments = [];
        if (recoveryScore < 50) {
            adjustments.push({
                type: 'intensity',
                value: -20,
                reason: 'Bajo HRV y recuperación insuficiente indican necesidad de reducir intensidad',
                confidence: 0.9,
                metrics: ['hrv', 'recoveryScore']
            });
            adjustments.push({
                type: 'volume',
                value: -25,
                reason: 'Recuperación insuficiente requiere reducción de volumen',
                confidence: 0.85,
                metrics: ['recoveryScore']
            });
            adjustments.push({
                type: 'rest',
                value: 1,
                reason: 'Necesitas un día completo de descanso para recuperación',
                confidence: 0.95,
                metrics: ['recoveryScore']
            });
        }
        else if (recoveryScore > 85) {
            adjustments.push({
                type: 'intensity',
                value: 10,
                reason: 'Excelente recuperación indica preparación para mayor intensidad',
                confidence: 0.8,
                metrics: ['recoveryScore']
            });
        }
        // Generate recommendations
        var recommendations = [];
        if (recoveryScore < 60) {
            recommendations.push('Prioriza dormir 7-9 horas para mejorar la recuperación');
            recommendations.push('Practica respiración diafragmática para mejorar la variabilidad cardíaca');
        }
        if (recoveryScore < 40) {
            recommendations.push('Considera una semana de descarga para permitir recuperación completa');
        }
        // Generate risk factors
        var riskFactors = [];
        if (recoveryScore < 40) {
            riskFactors.push('Riesgo de sobreentrenamiento');
        }
        if (recoveryStatus.fatigueLevel === 'extreme' || recoveryStatus.fatigueLevel === 'high') {
            riskFactors.push('Alto nivel de fatiga muscular');
        }
        return {
            recoveryStatus: recoveryStatusValue,
            trainingReadiness: trainingReadiness,
            adjustments: adjustments,
            recommendations: recommendations,
            riskFactors: riskFactors
        };
    };
    return ChatMaestroService;
}());
exports.ChatMaestroService = ChatMaestroService;
// Export singleton instance
exports.chatMaestroService = ChatMaestroService.getInstance();
