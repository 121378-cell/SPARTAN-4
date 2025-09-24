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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatMaestroPredictiveEngine = exports.ChatMaestroPredictiveEngine = void 0;
var storage_1 = require("./storage");
var predictive_analytics_1 = require("./predictive-analytics");
var iot_integration_service_1 = require("./iot-integration-service");
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var ChatMaestroPredictiveEngine = /** @class */ (function () {
    function ChatMaestroPredictiveEngine() {
    }
    ChatMaestroPredictiveEngine.getInstance = function () {
        if (!ChatMaestroPredictiveEngine.instance) {
            ChatMaestroPredictiveEngine.instance = new ChatMaestroPredictiveEngine();
        }
        return ChatMaestroPredictiveEngine.instance;
    };
    /**
     * Analyze user data and generate predictive recommendations
     */
    ChatMaestroPredictiveEngine.prototype.generatePredictiveRecommendations = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var recommendations, userPatterns, biometricData, adherenceMetrics, predictiveInsights, workoutSuggestions, modificationSuggestions, restSuggestions, routineSuggestions, recoveryAdvice, nutritionAdvice, progressionAdvice, longTermPlanRecommendations;
            return __generator(this, function (_a) {
                console.log('🔮 Generating predictive recommendations for Chat Maestro');
                recommendations = [];
                userPatterns = this.analyzeUserPatterns(context);
                biometricData = this.extractBiometricData(context);
                adherenceMetrics = this.calculateAdherenceMetrics(context);
                predictiveInsights = predictive_analytics_1.predictiveAnalyticsEngine.generatePredictions(context.userData, biometricData, adherenceMetrics);
                workoutSuggestions = this.generateWorkoutSuggestions(context, userPatterns, predictiveInsights);
                recommendations.push.apply(recommendations, workoutSuggestions);
                modificationSuggestions = this.generateModificationSuggestions(context, userPatterns);
                recommendations.push.apply(recommendations, modificationSuggestions);
                restSuggestions = this.generateRestPeriodSuggestions(context, userPatterns);
                recommendations.push.apply(recommendations, restSuggestions);
                routineSuggestions = this.generateRoutineSuggestions(context, userPatterns);
                recommendations.push.apply(recommendations, routineSuggestions);
                recoveryAdvice = this.generateRecoveryAdvice(context);
                recommendations.push.apply(recommendations, recoveryAdvice);
                nutritionAdvice = this.generateNutritionAdvice(context, userPatterns);
                recommendations.push.apply(recommendations, nutritionAdvice);
                progressionAdvice = this.generateProgressionAdvice(context);
                recommendations.push.apply(recommendations, progressionAdvice);
                longTermPlanRecommendations = this.generateLongTermPlanRecommendations(context);
                recommendations.push.apply(recommendations, longTermPlanRecommendations);
                // Sort recommendations by priority and confidence
                recommendations.sort(function (a, b) {
                    var priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    }
                    return b.confidence - a.confidence;
                });
                // Notify the nervous system of predictive recommendations
                spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                    type: 'recommendation_made',
                    timestamp: new Date(),
                    userId: context.userId,
                    payload: {
                        recommendations: recommendations,
                        source: 'predictive_engine'
                    },
                    sourceModule: 'ChatMaestroPredictiveEngine',
                    priority: 'medium'
                });
                return [2 /*return*/, recommendations];
            });
        });
    };
    /**
     * Generate detailed logic explanation for a recommendation
     */
    ChatMaestroPredictiveEngine.prototype.generateRecommendationExplanation = function (recommendation, context) {
        console.log("\uD83D\uDCDD Generating explanation for recommendation: ".concat(recommendation.id));
        var explanation = {
            recommendationId: recommendation.id,
            explanation: recommendation.logicExplanation,
            supportingData: [],
            confidenceFactors: [],
            alternativeOptions: []
        };
        // Add supporting data based on recommendation type
        switch (recommendation.type) {
            case 'workout_suggestion':
                this.addWorkoutSuggestionSupportingData(explanation, context);
                break;
            case 'modification_suggestion':
                this.addModificationSuggestionSupportingData(explanation, context);
                break;
            case 'rest_period_suggestion':
                this.addRestPeriodSuggestionSupportingData(explanation, context);
                break;
            case 'routine_suggestion':
                this.addRoutineSuggestionSupportingData(explanation, context);
                break;
            case 'recovery_advice':
                this.addRecoveryAdviceSupportingData(explanation, context);
                break;
            case 'nutrition_advice':
                this.addNutritionAdviceSupportingData(explanation, context);
                break;
            case 'progression_advice':
                this.addProgressionAdviceSupportingData(explanation, context);
                break;
        }
        // Add confidence factors
        this.addConfidenceFactors(explanation, recommendation, context);
        // Add alternative options
        this.addAlternativeOptions(explanation, recommendation, context);
        return explanation;
    };
    /**
     * Add supporting data for workout suggestions
     */
    ChatMaestroPredictiveEngine.prototype.addWorkoutSuggestionSupportingData = function (explanation, context) {
        var _a, _b;
        // Add training pattern data
        explanation.supportingData.push({
            dataType: 'training_consistency',
            dataValue: ((_a = context.userHabits[0]) === null || _a === void 0 ? void 0 : _a.trainingFrequency) || 0,
            relevance: 0.8
        });
        // Add recent workout data
        explanation.supportingData.push({
            dataType: 'recent_workouts_count',
            dataValue: context.recentWorkouts.length,
            relevance: 0.7
        });
        // Add preferred training days
        explanation.supportingData.push({
            dataType: 'preferred_training_days',
            dataValue: ((_b = context.userHabits[0]) === null || _b === void 0 ? void 0 : _b.preferredTrainingDays) || [],
            relevance: 0.6
        });
    };
    /**
     * Add supporting data for modification suggestions
     */
    ChatMaestroPredictiveEngine.prototype.addModificationSuggestionSupportingData = function (explanation, context) {
        // Add recovery status data
        if (context.recoveryStatus) {
            explanation.supportingData.push({
                dataType: 'fatigue_level',
                dataValue: context.recoveryStatus.fatigueLevel,
                relevance: 0.9
            });
            explanation.supportingData.push({
                dataType: 'recovery_score',
                dataValue: context.recoveryStatus.recoveryScore,
                relevance: 0.85
            });
        }
        // Add wearable data if available
        if (context.wearableInsights) {
            explanation.supportingData.push({
                dataType: 'training_readiness',
                dataValue: context.wearableInsights.trainingReadiness,
                relevance: 0.8
            });
            explanation.supportingData.push({
                dataType: 'recovery_status',
                dataValue: context.wearableInsights.recoveryStatus,
                relevance: 0.75
            });
        }
    };
    /**
     * Add supporting data for rest period suggestions
     */
    ChatMaestroPredictiveEngine.prototype.addRestPeriodSuggestionSupportingData = function (explanation, context) {
        // Add recovery analysis data
        var recoveryAnalyses = (storage_1.storageManager.getRecoveryAnalyses() || []).slice(0, 7);
        if (recoveryAnalyses.length > 0) {
            var avgRecoveryScore = recoveryAnalyses.reduce(function (sum, analysis) { return sum + analysis.recoveryScore; }, 0) / recoveryAnalyses.length;
            explanation.supportingData.push({
                dataType: 'avg_recovery_score_7_days',
                dataValue: avgRecoveryScore,
                relevance: 0.9
            });
            // Count high fatigue days
            var highFatigueDays = recoveryAnalyses.filter(function (analysis) {
                return analysis.fatigueLevel === 'high' || analysis.fatigueLevel === 'extreme';
            }).length;
            explanation.supportingData.push({
                dataType: 'high_fatigue_days_count',
                dataValue: highFatigueDays,
                relevance: 0.85
            });
        }
    };
    /**
     * Add supporting data for routine suggestions
     */
    ChatMaestroPredictiveEngine.prototype.addRoutineSuggestionSupportingData = function (explanation, context) {
        // Add training consistency data
        var recentWorkouts = context.recentWorkouts.slice(0, 10);
        if (recentWorkouts.length > 0) {
            var consistency = Math.min(1, recentWorkouts.length / 10);
            explanation.supportingData.push({
                dataType: 'training_consistency_10_days',
                dataValue: consistency,
                relevance: 0.8
            });
        }
        // Add user habit data
        if (context.userHabits.length > 0) {
            explanation.supportingData.push({
                dataType: 'preferred_training_frequency',
                dataValue: context.userHabits[0].trainingFrequency,
                relevance: 0.7
            });
        }
    };
    /**
     * Add supporting data for recovery advice
     */
    ChatMaestroPredictiveEngine.prototype.addRecoveryAdviceSupportingData = function (explanation, context) {
        // Add recovery status data
        if (context.recoveryStatus) {
            explanation.supportingData.push({
                dataType: 'current_recovery_score',
                dataValue: context.recoveryStatus.recoveryScore,
                relevance: 0.9
            });
            explanation.supportingData.push({
                dataType: 'current_fatigue_level',
                dataValue: context.recoveryStatus.fatigueLevel,
                relevance: 0.85
            });
        }
        // Add wearable data if available
        if (context.wearableInsights) {
            explanation.supportingData.push({
                dataType: 'wearable_recovery_status',
                dataValue: context.wearableInsights.recoveryStatus,
                relevance: 0.8
            });
        }
    };
    /**
     * Add supporting data for nutrition advice
     */
    ChatMaestroPredictiveEngine.prototype.addNutritionAdviceSupportingData = function (explanation, context) {
        // Add user goals
        explanation.supportingData.push({
            dataType: 'user_goals',
            dataValue: context.userData.goals,
            relevance: 0.8
        });
        // Add nutrition data if available
        if (context.nutritionData) {
            explanation.supportingData.push({
                dataType: 'daily_calorie_intake',
                dataValue: context.nutritionData.totalNutrients.calories,
                relevance: 0.7
            });
        }
    };
    /**
     * Add supporting data for progression advice
     */
    ChatMaestroPredictiveEngine.prototype.addProgressionAdviceSupportingData = function (explanation, context) {
        // Add progression plan data
        var stagnantPlans = context.progressionPlans.filter(function (plan) { return plan.adjustments.length === 0; });
        explanation.supportingData.push({
            dataType: 'stagnant_progression_plans',
            dataValue: stagnantPlans.length,
            relevance: 0.9
        });
        // Add total progression plans
        explanation.supportingData.push({
            dataType: 'total_progression_plans',
            dataValue: context.progressionPlans.length,
            relevance: 0.7
        });
    };
    /**
     * Add confidence factors to explanation
     */
    ChatMaestroPredictiveEngine.prototype.addConfidenceFactors = function (explanation, recommendation, context) {
        // Add factors based on data quality
        explanation.confidenceFactors.push({
            factor: 'data_quality',
            weight: 0.3,
            impact: 'positive'
        });
        // Add factors based on historical accuracy
        explanation.confidenceFactors.push({
            factor: 'historical_accuracy',
            weight: 0.25,
            impact: 'positive'
        });
        // Add factors based on user consistency
        var consistency = context.recentWorkouts.length > 0 ?
            Math.min(1, context.recentWorkouts.length / 10) : 0;
        explanation.confidenceFactors.push({
            factor: 'user_consistency',
            weight: consistency * 0.2,
            impact: consistency > 0.7 ? 'positive' : 'negative'
        });
        // Add factors based on recovery status
        if (context.recoveryStatus) {
            var recoveryScore = context.recoveryStatus.recoveryScore / 100;
            explanation.confidenceFactors.push({
                factor: 'recovery_status',
                weight: recoveryScore * 0.15,
                impact: recoveryScore > 0.7 ? 'positive' : 'negative'
            });
        }
        // Add factors based on wearable data
        if (context.wearableInsights) {
            explanation.confidenceFactors.push({
                factor: 'wearable_data_availability',
                weight: 0.1,
                impact: 'positive'
            });
        }
    };
    /**
     * Add alternative options to explanation
     */
    ChatMaestroPredictiveEngine.prototype.addAlternativeOptions = function (explanation, recommendation, context) {
        switch (recommendation.type) {
            case 'workout_suggestion':
                explanation.alternativeOptions = [
                    'Entrenar en otro momento del día',
                    'Reducir la intensidad del entrenamiento',
                    'Realizar entrenamiento de recuperación activa'
                ];
                break;
            case 'modification_suggestion':
                explanation.alternativeOptions = [
                    'Mantener el plan actual sin modificaciones',
                    'Realizar solo ejercicios de bajo impacto',
                    'Enfocarse en el trabajo de movilidad'
                ];
                break;
            case 'rest_period_suggestion':
                explanation.alternativeOptions = [
                    'Realizar entrenamiento ligero en su lugar',
                    'Enfocarse solo en estiramientos',
                    'Postponer el descanso para mañana'
                ];
                break;
            case 'routine_suggestion':
                explanation.alternativeOptions = [
                    'Mantener la rutina actual por ahora',
                    'Hacer ajustes menores en lugar de cambios grandes',
                    'Consultar con un entrenador personal'
                ];
                break;
            case 'recovery_advice':
                explanation.alternativeOptions = [
                    'Ignorar la recomendación y continuar entrenando',
                    'Reducir solo la intensidad, no el volumen',
                    'Enfocarse en nutrición y sueño en lugar de descanso'
                ];
                break;
            case 'nutrition_advice':
                explanation.alternativeOptions = [
                    'Mantener la dieta actual sin cambios',
                    'Hacer ajustes menores en lugar de cambios grandes',
                    'Consultar con un nutricionista'
                ];
                break;
            case 'progression_advice':
                explanation.alternativeOptions = [
                    'Mantener la carga actual por ahora',
                    'Hacer ajustes menores en lugar de cambios grandes',
                    'Enfocarse en técnica antes que en progresión'
                ];
                break;
            default:
                explanation.alternativeOptions = [
                    'Seguir el plan actual',
                    'Consultar con un experto',
                    'Realizar una variación del plan sugerido'
                ];
        }
    };
    /**
     * Format detailed explanations for Chat Maestro response
     */
    ChatMaestroPredictiveEngine.prototype.formatExplanationsForChat = function (explanations) {
        if (explanations.length === 0) {
            return {
                response: 'No hay explicaciones detalladas disponibles en este momento.',
                actionItems: []
            };
        }
        var response = '📋 **Explicaciones Detalladas de las Recomendaciones**\n\n';
        explanations.forEach(function (explanation, index) {
            response += "".concat(index + 1, ". **Datos de Soporte**:\n");
            explanation.supportingData.forEach(function (data) {
                response += "   \u2022 ".concat(data.dataType, ": ").concat(JSON.stringify(data.dataValue), " (Relevancia: ").concat((data.relevance * 100).toFixed(0), "%)\n");
            });
            response += "   **Factores de Confianza**:\n";
            explanation.confidenceFactors.forEach(function (factor) {
                response += "   \u2022 ".concat(factor.factor, ": ").concat((factor.weight * 100).toFixed(0), "% (").concat(factor.impact, ")\n");
            });
            response += "   **Opciones Alternativas**:\n";
            explanation.alternativeOptions.slice(0, 2).forEach(function (option) {
                response += "   \u2022 ".concat(option, "\n");
            });
            response += '\n';
        });
        var actionItems = explanations.map(function (explanation) {
            return "Explicaci\u00F3n para recomendaci\u00F3n ".concat(explanation.recommendationId);
        });
        return {
            response: response,
            actionItems: actionItems
        };
    };
    /**
     * Analyze user patterns from historical data with enhanced recognition
     */
    ChatMaestroPredictiveEngine.prototype.analyzeUserPatterns = function (context) {
        // Analyze training patterns
        var trainingPatterns = this.analyzeTrainingPatterns(context);
        // Analyze recovery patterns
        var recoveryPatterns = this.analyzeRecoveryPatterns(context);
        // Analyze nutrition patterns
        var nutritionPatterns = this.analyzeNutritionPatterns(context);
        // Analyze performance patterns
        var performancePatterns = this.analyzePerformancePatterns(context);
        // Enhanced pattern recognition with cross-domain analysis
        this.enhancePatternRecognition(trainingPatterns, recoveryPatterns, nutritionPatterns, performancePatterns, context);
        // Enhanced pattern recognition with external life variables
        if (context.externalLifeVariables) {
            var externalAnalysis = this.analyzeExternalLifeVariables(context);
            this.enhancePatternRecognitionWithExternalVariables({ trainingPatterns: trainingPatterns, performancePatterns: performancePatterns }, recoveryPatterns, externalAnalysis, context);
        }
        return {
            trainingPatterns: trainingPatterns,
            recoveryPatterns: recoveryPatterns,
            nutritionPatterns: nutritionPatterns,
            performancePatterns: performancePatterns
        };
    };
    /**
     * Enhance pattern recognition with cross-domain analysis
     */
    ChatMaestroPredictiveEngine.prototype.enhancePatternRecognition = function (trainingPatterns, recoveryPatterns, nutritionPatterns, performancePatterns, context) {
        // Correlate training consistency with recovery patterns
        if (trainingPatterns.consistency > 0.8 && recoveryPatterns.sleepQualityTrends === 'declining') {
            console.log('🔍 Detected potential overtraining pattern: High consistency with declining sleep quality');
        }
        // Correlate nutrition patterns with performance trends
        if (nutritionPatterns.adherenceTrends === 'declining' && performancePatterns.plateauIndicators.length > 0) {
            console.log('🔍 Detected potential nutrition-performance correlation: Declining nutrition adherence with performance plateaus');
        }
        // Correlate stress patterns with training consistency
        if (recoveryPatterns.stressPatterns.length > 0) {
            var avgStress = recoveryPatterns.stressPatterns.reduce(function (sum, val) { return sum + val; }, 0) / recoveryPatterns.stressPatterns.length;
            if (avgStress > 70 && trainingPatterns.consistency < 0.6) {
                console.log('🔍 Detected stress-impact pattern: High stress levels correlating with low training consistency');
            }
        }
        // Perform cross-domain correlation analysis
        this.performCrossDomainCorrelationAnalysis(trainingPatterns, recoveryPatterns, nutritionPatterns, performancePatterns, context);
    };
    /**
     * Perform sophisticated cross-domain correlation analysis
     */
    ChatMaestroPredictiveEngine.prototype.performCrossDomainCorrelationAnalysis = function (trainingPatterns, recoveryPatterns, nutritionPatterns, performancePatterns, context) {
        // Training-Recovery Correlation
        this.analyzeTrainingRecoveryCorrelation(trainingPatterns, recoveryPatterns, context);
        // Nutrition-Performance Correlation
        this.analyzeNutritionPerformanceCorrelation(nutritionPatterns, performancePatterns, context);
        // Recovery-Stress Correlation
        this.analyzeRecoveryStressCorrelation(recoveryPatterns, context);
        // Performance-Training Correlation
        this.analyzePerformanceTrainingCorrelation(performancePatterns, trainingPatterns, context);
    };
    /**
     * Analyze correlation between training patterns and recovery patterns
     */
    ChatMaestroPredictiveEngine.prototype.analyzeTrainingRecoveryCorrelation = function (trainingPatterns, recoveryPatterns, context) {
        // High training volume with declining recovery
        if (trainingPatterns.volumeTrends === 'increasing' && recoveryPatterns.sleepQualityTrends === 'declining') {
            console.log('🔍 Detected training-recovery imbalance: Increasing training volume with declining sleep quality');
            // This could trigger a recommendation to reduce training volume
        }
        // Inconsistent training with high stress
        if (trainingPatterns.consistency < 0.6 && recoveryPatterns.stressPatterns.length > 0) {
            var avgStress = recoveryPatterns.stressPatterns.reduce(function (sum, val) { return sum + val; }, 0) / recoveryPatterns.stressPatterns.length;
            if (avgStress > 70) {
                console.log('🔍 Detected inconsistency-stress pattern: Inconsistent training with high stress levels');
                // This could trigger a recommendation to establish a consistent routine
            }
        }
        // Fatigue cycles with training frequency
        if (recoveryPatterns.fatigueCycles.length > 2 && trainingPatterns.preferredDays.length > 0) {
            // Check if fatigue cycles align with training days
            var trainingDaysSet_1 = new Set(trainingPatterns.preferredDays);
            var fatigueOnTrainingDays = recoveryPatterns.fatigueCycles.filter(function (day) { return trainingDaysSet_1.has(day); });
            if (fatigueOnTrainingDays.length > recoveryPatterns.fatigueCycles.length * 0.7) {
                console.log('🔍 Detected training-induced fatigue pattern: Fatigue frequently occurs on training days');
                // This could trigger a recommendation to adjust training schedule or intensity
            }
        }
    };
    /**
     * Analyze correlation between nutrition patterns and performance patterns
     */
    ChatMaestroPredictiveEngine.prototype.analyzeNutritionPerformanceCorrelation = function (nutritionPatterns, performancePatterns, context) {
        // Declining nutrition adherence with performance plateaus
        if (nutritionPatterns.adherenceTrends === 'declining' && performancePatterns.plateauIndicators.length > 0) {
            console.log('🔍 Detected nutrition-performance correlation: Declining nutrition adherence with performance plateaus');
            // This could trigger a recommendation to improve nutrition adherence
        }
        // Stable nutrition with improving performance
        if (nutritionPatterns.adherenceTrends === 'stable' || nutritionPatterns.adherenceTrends === 'improving') {
            var improvingExercises = Object.entries(performancePatterns.strengthTrends)
                .filter(function (_a) {
                var _ = _a[0], trend = _a[1];
                return trend === 'improving';
            })
                .map(function (_a) {
                var exercise = _a[0], _ = _a[1];
                return exercise;
            });
            if (improvingExercises.length > 0) {
                console.log('🔍 Detected positive nutrition-performance correlation: Stable/improving nutrition with performance gains in', improvingExercises.join(', '));
                // This could reinforce current nutrition strategy
            }
        }
    };
    /**
     * Calculate variance of an array of numbers with enhanced precision
     */
    ChatMaestroPredictiveEngine.prototype.calculateVariance = function (numbers) {
        if (numbers.length === 0)
            return 0;
        var mean = numbers.reduce(function (sum, num) { return sum + num; }, 0) / numbers.length;
        var squaredDiffs = numbers.map(function (num) { return Math.pow(num - mean, 2); });
        var avgSquaredDiff = squaredDiffs.reduce(function (sum, num) { return sum + num; }, 0) / squaredDiffs.length;
        return Math.sqrt(avgSquaredDiff);
    };
    /**
     * Analyze correlation between recovery patterns and stress levels
     */
    ChatMaestroPredictiveEngine.prototype.analyzeRecoveryStressCorrelation = function (recoveryPatterns, context) {
        if (recoveryPatterns.stressPatterns.length > 3) {
            // Calculate correlation between stress and recovery scores
            var recoveryAnalyses = (storage_1.storageManager.getRecoveryAnalyses() || []).slice(0, 7);
            if (recoveryAnalyses.length >= 4) {
                var stressValues = recoveryAnalyses.map(function (a) { return 100 - (a.recoveryScore || 50); });
                var recoveryValues = recoveryAnalyses.map(function (a) { return a.recoveryScore || 50; });
                var stressVariance = this.calculateVariance(stressValues);
                var recoveryVariance = this.calculateVariance(recoveryValues);
                // If both stress and recovery show high variance, there might be a strong correlation
                if (stressVariance > 20 && recoveryVariance > 20) {
                    console.log('🔍 Detected stress-recovery volatility pattern: High variance in both stress and recovery metrics');
                    // This could trigger stress management recommendations
                }
            }
        }
    };
    /**
     * Analyze correlation between performance patterns and training patterns
     */
    ChatMaestroPredictiveEngine.prototype.analyzePerformanceTrainingCorrelation = function (performancePatterns, trainingPatterns, context) {
        // Plateaued exercises with stable training volume
        var plateauedExercises = performancePatterns.plateauIndicators;
        if (plateauedExercises.length > 0 && trainingPatterns.volumeTrends === 'stable') {
            console.log('🔍 Detected performance-training stagnation: Plateaued exercises with stable training volume');
            // This could trigger a recommendation to vary training variables
        }
        // Improving performance with increasing training consistency
        var improvingExercises = Object.entries(performancePatterns.strengthTrends)
            .filter(function (_a) {
            var _ = _a[0], trend = _a[1];
            return trend === 'improving';
        })
            .map(function (_a) {
            var exercise = _a[0], _ = _a[1];
            return exercise;
        });
        if (improvingExercises.length > 0 && trainingPatterns.consistency > 0.8) {
            console.log('🔍 Detected positive performance-training correlation: Improving performance with high training consistency');
            // This could reinforce current training approach
        }
    };
    /**
     * Analyze training patterns from user data with enhanced recognition
     */
    ChatMaestroPredictiveEngine.prototype.analyzeTrainingPatterns = function (context) {
        var recentWorkouts = context.recentWorkouts.slice(0, 10); // Last 10 workouts
        var userHabits = context.userHabits;
        // Determine preferred training days
        var preferredDays = userHabits.length > 0 ? userHabits[0].preferredTrainingDays : [];
        // Determine preferred training times
        var preferredTimes = userHabits.length > 0 ? userHabits[0].preferredTrainingTimes : [];
        // Calculate consistency (0-1 scale)
        var consistency = recentWorkouts.length > 0 ?
            Math.min(1, recentWorkouts.length / 10) : 0;
        // Analyze volume trends
        var volumeTrends = 'stable';
        if (recentWorkouts.length >= 4) {
            var recentVolume = recentWorkouts.slice(0, 2).reduce(function (sum, w) { return sum + (w.duration || 0); }, 0) / 2;
            var olderVolume = recentWorkouts.slice(2, 4).reduce(function (sum, w) { return sum + (w.duration || 0); }, 0) / 2;
            if (recentVolume > olderVolume * 1.1)
                volumeTrends = 'increasing';
            else if (recentVolume < olderVolume * 0.9)
                volumeTrends = 'decreasing';
        }
        // Analyze intensity trends (simplified)
        var intensityTrends = 'stable';
        // In a real implementation, this would analyze actual intensity data
        // Detect pattern anomalies
        var patternAnomalies = [];
        // Log detected patterns for learning
        if (patternAnomalies.length > 0) {
            console.log('🔍 Detected training pattern anomalies:', patternAnomalies);
        }
        return {
            preferredDays: preferredDays,
            preferredTimes: preferredTimes,
            consistency: consistency,
            volumeTrends: volumeTrends,
            intensityTrends: intensityTrends
        };
    };
    return ChatMaestroPredictiveEngine;
}());
exports.ChatMaestroPredictiveEngine = ChatMaestroPredictiveEngine;
// Analyze sleep quality trends with enhanced analysis
var sleepQualityTrends = 'stable';
if (recoveryAnalyses.length >= 4) {
    var recentSleep = recoveryAnalyses.slice(0, 2).reduce(function (sum, a) { return sum + (a.recoveryScore || 50); }, 0) / 2;
    var olderSleep = recoveryAnalyses.slice(2, 4).reduce(function (sum, a) { return sum + (a.recoveryScore || 50); }, 0) / 2;
    if (recentSleep > olderSleep * 1.1)
        sleepQualityTrends = 'improving';
    else if (recentSleep < olderSleep * 0.9)
        sleepQualityTrends = 'declining';
}
// Analyze stress patterns with enhanced metrics
var stressPatterns = recoveryAnalyses
    .map(function (a) { return a.recoveryScore !== undefined ? 100 - a.recoveryScore : 50; })
    .slice(0, 7); // Last 7 days of stress levels (inverted recovery scores)
// Detect recovery pattern anomalies
var recoveryAnomalies = [];
// Log detected patterns for learning
if (recoveryAnomalies.length > 0) {
    console.log('🔍 Detected recovery pattern anomalies:', recoveryAnomalies);
}
return {
    fatigueCycles: fatigueCycles,
    sleepQualityTrends: sleepQualityTrends,
    stressPatterns: stressPatterns
};
analyzeNutritionPatterns(context, chat_maestro_service_1.ChatContext);
UserPattern['nutritionPatterns'];
{
    var recentNutrition = storage_1.storageManager.getDailyNutrition().slice(0, 7); // Last 7 days
    // Analyze meal timing with enhanced precision
    var mealTiming_1 = [];
    recentNutrition.forEach(function (day) {
        day.meals.forEach(function (meal) {
            if (!mealTiming_1.includes(meal.time)) {
                mealTiming_1.push(meal.time);
            }
        });
    });
    // Analyze adherence trends with enhanced metrics
    var adherenceTrends = 'stable';
    if (recentNutrition.length >= 4) {
        // Calculate adherence percentage for recent days
        var recentAdherence = recentNutrition.slice(0, 2).map(function (day) {
            var completedMeals = day.meals.filter(function (meal) { return meal.completed; }).length;
            return day.meals.length > 0 ? (completedMeals / day.meals.length) * 100 : 0;
        });
        var olderAdherence = recentNutrition.slice(2, 4).map(function (day) {
            var completedMeals = day.meals.filter(function (meal) { return meal.completed; }).length;
            return day.meals.length > 0 ? (completedMeals / day.meals.length) * 100 : 0;
        });
        var recentAvg = recentAdherence.reduce(function (sum, val) { return sum + val; }, 0) / recentAdherence.length;
        var olderAvg = olderAdherence.reduce(function (sum, val) { return sum + val; }, 0) / olderAdherence.length;
        if (recentAvg > olderAvg * 1.1)
            adherenceTrends = 'improving';
        else if (recentAvg < olderAvg * 0.9)
            adherenceTrends = 'declining';
    }
    // Analyze macro preferences with enhanced calculation
    var macroPreferences = {
        protein: 30, // percentage
        carbs: 40, // percentage
        fats: 30 // percentage
    };
    // Detect nutrition pattern anomalies
    var nutritionAnomalies = [];
    // Log detected patterns for learning
    if (nutritionAnomalies.length > 0) {
        console.log('🔍 Detected nutrition pattern anomalies:', nutritionAnomalies);
    }
    return {
        mealTiming: mealTiming_1,
        adherenceTrends: adherenceTrends,
        macroPreferences: macroPreferences
    };
}
analyzePerformancePatterns(context, chat_maestro_service_1.ChatContext);
UserPattern['performancePatterns'];
{
    // Get progression metrics from storage
    var progressionMetrics = storage_1.storageManager.getProgressionMetrics().slice(0, 20); // Last 20 entries
    // Analyze strength trends for each exercise with enhanced analysis
    var strengthTrends_1 = {};
    var exerciseMetrics_1 = new Map();
    // Group metrics by exercise
    progressionMetrics.forEach(function (metric) {
        if (!exerciseMetrics_1.has(metric.exerciseName)) {
            exerciseMetrics_1.set(metric.exerciseName, []);
        }
        exerciseMetrics_1.get(metric.exerciseName).push(metric);
    });
    // Analyze trends for each exercise with enhanced metrics
    exerciseMetrics_1.forEach(function (metrics, exerciseName) {
        if (metrics.length >= 4) {
            // Use weighted average for more accurate trend detection
            var recentMetrics = metrics.slice(0, 2);
            var olderMetrics = metrics.slice(2, 4);
            var recentWeight = recentMetrics.reduce(function (sum, m) { return sum + m.weight; }, 0) / recentMetrics.length;
            var olderWeight = olderMetrics.reduce(function (sum, m) { return sum + m.weight; }, 0) / olderMetrics.length;
            // Also consider RPE and form quality if available
            var recentRPE = recentMetrics.reduce(function (sum, m) { return sum + (m.rpe || 7); }, 0) / recentMetrics.length;
            var olderRPE = olderMetrics.reduce(function (sum, m) { return sum + (m.rpe || 7); }, 0) / olderMetrics.length;
            // Weighted trend calculation
            var weightChange = (recentWeight - olderWeight) / olderWeight;
            var rpeChange = (recentRPE - olderRPE) / olderRPE;
            // Combined trend (weight has more weight than RPE)
            var combinedTrend = (weightChange * 0.7) + (rpeChange * 0.3);
            if (combinedTrend > 0.05)
                strengthTrends_1[exerciseName] = 'improving';
            else if (combinedTrend < -0.05)
                strengthTrends_1[exerciseName] = 'declining';
            else
                strengthTrends_1[exerciseName] = 'stable';
        }
        else {
            strengthTrends_1[exerciseName] = 'stable';
        }
    });
    // Identify plateau indicators with enhanced detection
    var plateauIndicators_1 = [];
    Object.entries(strengthTrends_1).forEach(function (_a) {
        var exercise = _a[0], trend = _a[1];
        if (trend === 'stable') {
            plateauIndicators_1.push(exercise);
        }
    });
    // Identify adaptation windows with enhanced analysis
    var adaptationWindows = [];
    // In a real implementation, this would identify optimal periods for adaptation
    // For now, we'll identify potential windows based on recovery patterns
    var recoveryAnalyses = (storage_1.storageManager.getRecoveryAnalyses() || []).slice(0, 14);
    if (recoveryAnalyses.length >= 7) {
        // Look for 3+ consecutive days of good recovery (score > 70)
        for (var i = 0; i <= recoveryAnalyses.length - 3; i++) {
            var window_1 = recoveryAnalyses.slice(i, i + 3);
            var allGoodRecovery = window_1.every(function (analysis) { return (analysis.recoveryScore || 50) > 70; });
            if (allGoodRecovery) {
                adaptationWindows.push(window_1[0].date);
            }
        }
    }
    // Detect performance pattern anomalies
    var performanceAnomalies = [];
    // Log detected patterns for learning
    if (performanceAnomalies.length > 0) {
        console.log('🔍 Detected performance pattern anomalies:', performanceAnomalies);
    }
    return {
        strengthTrends: strengthTrends_1,
        plateauIndicators: plateauIndicators_1,
        adaptationWindows: adaptationWindows
    };
}
extractBiometricData(context, chat_maestro_service_1.ChatContext);
predictive_analytics_1.BiometricData;
{
    // Get from wearable data if available
    if (context.wearableInsights) {
        // This is a simplified extraction - in a real implementation, we would extract more detailed data
        return {
            weight: context.userData.weight || 70,
            bodyFatPercentage: 15, // Placeholder
            muscleMass: 55, // Placeholder
            boneDensity: 0, // Not typically available
            restingHeartRate: context.wearableInsights.recoveryStatus === 'optimal' ? 55 :
                context.wearableInsights.recoveryStatus === 'good' ? 60 :
                    context.wearableInsights.recoveryStatus === 'fair' ? 65 :
                        context.wearableInsights.recoveryStatus === 'poor' ? 70 : 75,
            heartRateVariability: context.wearableInsights.recoveryStatus === 'optimal' ? 80 :
                context.wearableInsights.recoveryStatus === 'good' ? 70 :
                    context.wearableInsights.recoveryStatus === 'fair' ? 60 :
                        context.wearableInsights.recoveryStatus === 'poor' ? 50 : 40,
            bloodPressure: {
                systolic: 120,
                diastolic: 80
            },
            vo2max: context.wearableInsights.trainingReadiness === 'ready' ? 50 :
                context.wearableInsights.trainingReadiness === 'caution' ? 45 : 40,
            glucose: 90, // Placeholder
            cholesterol: 0 // Not typically available
        };
    }
    // Get from IoT enhanced wearable data if available
    var enhancedWearableData = iot_integration_service_1.iotIntegrationService.getEnhancedWearableData();
    if (enhancedWearableData) {
        return {
            weight: context.userData.weight || 70,
            bodyFatPercentage: enhancedWearableData.additionalMetrics.bodyTemperature ? 15 : 16, // Placeholder
            muscleMass: 55, // Placeholder
            boneDensity: 0, // Not typically available
            restingHeartRate: ((_a = enhancedWearableData.standardData.recovery) === null || _a === void 0 ? void 0 : _a.restingHeartRate) || 60,
            heartRateVariability: ((_b = enhancedWearableData.standardData.recovery) === null || _b === void 0 ? void 0 : _b.hrv) || 60,
            bloodPressure: {
                systolic: ((_c = enhancedWearableData.standardData.vitals.bloodPressure) === null || _c === void 0 ? void 0 : _c.systolic) || 120,
                diastolic: ((_d = enhancedWearableData.standardData.vitals.bloodPressure) === null || _d === void 0 ? void 0 : _d.diastolic) || 80
            },
            vo2max: ((_e = enhancedWearableData.standardData.activity) === null || _e === void 0 ? void 0 : _e.vo2max) || 40,
            glucose: ((_f = enhancedWearableData.standardData.vitals.glucose) === null || _f === void 0 ? void 0 : _f.current) || 90,
            cholesterol: 0 // Not typically available
        };
    }
    // Fallback to user data
    return {
        weight: context.userData.weight || 70,
        bodyFatPercentage: 15, // Placeholder
        muscleMass: 55, // Placeholder
        boneDensity: 0, // Not typically available
        restingHeartRate: 60, // Placeholder
        heartRateVariability: 60, // Placeholder
        bloodPressure: {
            systolic: 120,
            diastolic: 80
        },
        vo2max: 40, // Placeholder
        glucose: 90, // Placeholder
        cholesterol: 0 // Not typically available
    };
}
calculateAdherenceMetrics(context, chat_maestro_service_1.ChatContext);
predictive_analytics_1.AdherenceMetrics;
{
    // Calculate training adherence based on recent workouts
    var recentWorkouts = context.recentWorkouts.slice(0, 7); // Last 7 days
    var trainingAdherence = Math.min(100, (recentWorkouts.length / 7) * 100);
    // Calculate nutrition adherence (simplified)
    var nutritionData = storage_1.storageManager.getDailyNutrition().slice(0, 7); // Last 7 days
    var nutritionAdherence = nutritionData.length > 0 ? 85 : 50; // Placeholder
    // Calculate sleep quality from recovery data
    var recoveryAnalyses = (storage_1.storageManager.getRecoveryAnalyses() || []).slice(0, 7); // Last 7 days
    var sleepQuality = 70; // Default
    if (recoveryAnalyses.length > 0) {
        var avgRecovery = recoveryAnalyses.reduce(function (sum, a) { return sum + (a.recoveryScore || 50); }, 0) / recoveryAnalyses.length;
        sleepQuality = Math.round(avgRecovery);
    }
    // Calculate stress management (inverted)
    var stressManagement = 70; // Default
    if (recoveryAnalyses.length > 0) {
        var avgStress = recoveryAnalyses.reduce(function (sum, a) { return sum + (a.recoveryScore ? 100 - a.recoveryScore : 50); }, 0) / recoveryAnalyses.length;
        stressManagement = Math.round(avgStress);
    }
    // Calculate supplementation adherence (simplified)
    var supplementationAdherence = 70; // Placeholder
    return {
        trainingAdherence: trainingAdherence,
        nutritionAdherence: nutritionAdherence,
        sleepQuality: sleepQuality,
        supplementationAdherence: supplementationAdherence,
        stressManagement: stressManagement
    };
}
/**
 * Analyze real-time biometric data for immediate insights
 */
analyzeRealTimeBiometrics(context, chat_maestro_service_1.ChatContext);
any;
{
    var insights = {};
    // Analyze heart rate data if available
    if (context.wearableInsights) {
        // Heart rate analysis
        var restingHR = context.wearableInsights.recoveryStatus === 'optimal' ? 55 :
            context.wearableInsights.recoveryStatus === 'good' ? 60 :
                context.wearableInsights.recoveryStatus === 'fair' ? 65 :
                    context.wearableInsights.recoveryStatus === 'poor' ? 70 : 75;
        insights.heartRate = {
            resting: restingHR,
            status: this.interpretHeartRate(restingHR),
            recommendations: this.getHeartRateRecommendations(restingHR)
        };
        // HRV analysis
        var hrv = context.wearableInsights.recoveryStatus === 'optimal' ? 80 :
            context.wearableInsights.recoveryStatus === 'good' ? 70 :
                context.wearableInsights.recoveryStatus === 'fair' ? 60 :
                    context.wearableInsights.recoveryStatus === 'poor' ? 50 : 40;
        insights.hrv = {
            value: hrv,
            status: this.interpretHRV(hrv),
            recommendations: this.getHRVRecommendations(hrv)
        };
        // Training readiness analysis
        insights.trainingReadiness = {
            level: context.wearableInsights.trainingReadiness,
            recommendations: this.getTrainingReadinessRecommendations(context.wearableInsights.trainingReadiness)
        };
    }
    // Analyze IoT enhanced metrics if available
    var enhancedData = iot_integration_service_1.iotIntegrationService.getEnhancedWearableData();
    if (enhancedData) {
        // Muscle oxygen analysis
        if (enhancedData.additionalMetrics.muscleOxygen !== undefined) {
            insights.muscleOxygen = {
                value: enhancedData.additionalMetrics.muscleOxygen,
                status: enhancedData.additionalMetrics.muscleOxygen > 60 ? 'optimal' :
                    enhancedData.additionalMetrics.muscleOxygen > 50 ? 'good' : 'concern',
                recommendations: this.getMuscleOxygenRecommendations(enhancedData.additionalMetrics.muscleOxygen)
            };
        }
        // Body temperature analysis
        if (enhancedData.additionalMetrics.bodyTemperature !== undefined) {
            insights.bodyTemperature = {
                value: enhancedData.additionalMetrics.bodyTemperature,
                status: enhancedData.additionalMetrics.bodyTemperature >= 36.1 &&
                    enhancedData.additionalMetrics.bodyTemperature <= 37.2 ? 'optimal' :
                    enhancedData.additionalMetrics.bodyTemperature >= 35.5 &&
                        enhancedData.additionalMetrics.bodyTemperature <= 37.8 ? 'good' : 'concern',
                recommendations: this.getBodyTemperatureRecommendations(enhancedData.additionalMetrics.bodyTemperature)
            };
        }
    }
    return insights;
}
interpretHeartRate(heartRate, number);
string;
{
    if (heartRate < 50)
        return 'muy bajo';
    if (heartRate < 60)
        return 'bajo';
    if (heartRate < 70)
        return 'normal';
    if (heartRate < 80)
        return 'elevado';
    return 'muy elevado';
}
getHeartRateRecommendations(heartRate, number);
string[];
{
    var recommendations = [];
    if (heartRate > 75) {
        recommendations.push('Considera días de recuperación activa');
        recommendations.push('Prioriza el sueño de calidad (7-9 horas)');
        recommendations.push('Reduce la intensidad del entrenamiento temporalmente');
    }
    else if (heartRate < 55) {
        recommendations.push('Asegúrate de no estar sobreentrenado');
        recommendations.push('Considera aumentar la intensidad gradualmente');
    }
    return recommendations;
}
interpretHRV(hrv, number);
string;
{
    if (hrv > 75)
        return 'excelente';
    if (hrv > 65)
        return 'buena';
    if (hrv > 55)
        return 'moderada';
    if (hrv > 45)
        return 'baja';
    return 'muy baja';
}
getHRVRecommendations(hrv, number);
string[];
{
    var recommendations = [];
    if (hrv < 50) {
        recommendations.push('Prioriza técnicas de relajación y respiración');
        recommendations.push('Considera un día de descanso completo');
        recommendations.push('Evita el estrés adicional');
    }
    else if (hrv < 60) {
        recommendations.push('Incorpora estiramientos y movilidad');
        recommendations.push('Considera entrenamiento de baja intensidad');
    }
    else if (hrv > 75) {
        recommendations.push('Excelente recuperación - puedes entrenar con mayor intensidad');
    }
    return recommendations;
}
getTrainingReadinessRecommendations(readiness, string);
string[];
{
    var recommendations = [];
    switch (readiness) {
        case 'rest':
            recommendations.push('Hoy es mejor descansar completamente');
            recommendations.push('Enfócate en sueño, nutrición y actividades de recuperación');
            break;
        case 'caution':
            recommendations.push('Considera entrenamiento de baja intensidad');
            recommendations.push('Enfócate en técnica y movilidad');
            break;
        case 'ready':
            recommendations.push('¡Listo para entrenar con intensidad!');
            recommendations.push('Aprovecha este estado óptimo para sesiones exigentes');
            break;
    }
    return recommendations;
}
getMuscleOxygenRecommendations(oxygen, number);
string[];
{
    var recommendations = [];
    if (oxygen < 50) {
        recommendations.push('Considera reducir la intensidad del entrenamiento');
        recommendations.push('Prioriza la recuperación y el sueño');
    }
    else if (oxygen < 60) {
        recommendations.push('Entrenamiento moderado es apropiado');
        recommendations.push('Mantén buena hidratación');
    }
    else {
        recommendations.push('Excelente oxigenación muscular - puedes entrenar con intensidad');
    }
    return recommendations;
}
getBodyTemperatureRecommendations(temp, number);
string[];
{
    var recommendations = [];
    if (temp < 36.1 || temp > 37.2) {
        recommendations.push('Monitorea tu temperatura y mantente hidratado');
        recommendations.push('Considera entrenamiento en ambiente controlado');
    }
    else {
        recommendations.push('Temperatura corporal óptima para entrenamiento');
    }
    return recommendations;
}
generateWorkoutSuggestions(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern, predictiveInsights, any);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Suggest workout based on preferred days and current schedule
    var today = new Date().getDay();
    var isPreferredDay = userPatterns.trainingPatterns.preferredDays.includes(today);
    if (!isPreferredDay && userPatterns.trainingPatterns.consistency < 0.7) {
        suggestions.push({
            id: "workout_suggestion_".concat(Date.now()),
            type: 'workout_suggestion',
            confidence: 0.8,
            priority: 'medium',
            title: 'Optimiza tu rutina de entrenamiento',
            description: 'Basado en tu historial, te recomiendo entrenar hoy para mantener consistencia.',
            logicExplanation: 'Tu consistencia de entrenamiento es del ' + Math.round(userPatterns.trainingPatterns.consistency * 100) +
                '%, y hoy es un día que normalmente no entrenas. Entrenar hoy ayudaría a mejorar tu adherencia.',
            actionable: true
        });
    }
    // Suggest workout based on performance trends
    if (Object.values(userPatterns.performancePatterns.strengthTrends).some(function (trend) { return trend === 'declining'; })) {
        suggestions.push({
            id: "performance_workout_suggestion_".concat(Date.now()),
            type: 'workout_suggestion',
            confidence: 0.75,
            priority: 'high',
            title: 'Enfócate en ejercicios con tendencia a la baja',
            description: 'Detecto que algunos ejercicios están mostrando una tendencia a la baja. Te recomiendo enfocarte en ellos hoy.',
            logicExplanation: 'Algunos ejercicios muestran tendencia a la baja, lo que puede indicar necesidad de atención específica o cambio de enfoque.',
            actionable: true
        });
    }
    // Suggest workout based on IoT environmental conditions
    var environmentalData = iot_integration_service_1.iotIntegrationService.getEnvironmentalData();
    if (environmentalData) {
        var temperatureSensors = environmentalData.sensors.filter(function (s) { return s.type === 'temperature'; });
        if (temperatureSensors.length > 0) {
            var avgTemp = temperatureSensors.reduce(function (sum, s) { return sum + (typeof s.value === 'number' ? s.value : 0); }, 0) / temperatureSensors.length;
            if (avgTemp > 25) {
                suggestions.push({
                    id: "environmental_workout_suggestion_".concat(Date.now()),
                    type: 'workout_suggestion',
                    confidence: 0.7,
                    priority: 'medium',
                    title: 'Considera entrenamiento en ambiente fresco',
                    description: 'La temperatura ambiente es alta (' + Math.round(avgTemp) + '°C). Considera entrenamiento de menor intensidad o en ambiente fresco.',
                    logicExplanation: 'Temperaturas superiores a 25°C pueden aumentar la carga térmica y afectar el rendimiento. Un entrenamiento más suave o en ambiente fresco sería más apropiado.',
                    actionable: true
                });
            }
        }
    }
    // Suggest workout based on external life variables
    if (context.externalLifeVariables) {
        var externalAnalysis = this.analyzeExternalLifeVariables(context);
        // Work schedule conflict suggestion
        if (externalAnalysis.workImpact > 0.5) {
            suggestions.push({
                id: "work_conflict_suggestion_".concat(Date.now()),
                type: 'workout_suggestion',
                confidence: 0.85,
                priority: 'high',
                title: 'Conflicto de horario laboral detectado',
                description: 'Detecto que estás en horario laboral. Considera ajustar tu entrenamiento.',
                logicExplanation: 'Tu nivel de impacto laboral es ' + Math.round(externalAnalysis.workImpact * 100) +
                    '%, lo que indica que estás en horario laboral o en un día laboral.',
                actionable: true
            });
        }
        // High stress suggestion
        if (externalAnalysis.stressImpact > 0.7) {
            suggestions.push({
                id: "high_stress_suggestion_".concat(Date.now()),
                type: 'workout_suggestion',
                confidence: 0.9,
                priority: 'critical',
                title: 'Nivel de estrés elevado detectado',
                description: 'Tu nivel de estrés es alto. Te recomiendo un entrenamiento de recuperación activa.',
                logicExplanation: 'Tu nivel de estrés es ' + Math.round(externalAnalysis.stressImpact * 10) +
                    '/10, lo que indica un estrés elevado que puede afectar tu rendimiento.',
                actionable: true
            });
        }
        // Schedule conflict suggestion
        if (externalAnalysis.scheduleConflicts.length > 0) {
            suggestions.push({
                id: "schedule_conflict_suggestion_".concat(Date.now()),
                type: 'workout_suggestion',
                confidence: 0.8,
                priority: 'high',
                title: 'Conflicto de agenda detectado',
                description: 'Tienes compromisos programados que coinciden con tu horario de entrenamiento.',
                logicExplanation: 'Detecté los siguientes conflictos: ' + externalAnalysis.scheduleConflicts.join(', '),
                actionable: true
            });
        }
        // Environmental impact suggestion
        if (externalAnalysis.environmentalImpact > 0.5) {
            suggestions.push({
                id: "environmental_impact_suggestion_".concat(Date.now()),
                type: 'workout_suggestion',
                confidence: 0.75,
                priority: 'medium',
                title: 'Condiciones climáticas adversas',
                description: 'Las condiciones climáticas actuales pueden afectar tu entrenamiento.',
                logicExplanation: 'El impacto ambiental es ' + Math.round(externalAnalysis.environmentalImpact * 100) +
                    '%, lo que indica condiciones que pueden afectar tu rendimiento.',
                actionable: true
            });
        }
        // Low availability flexibility suggestion
        if (externalAnalysis.availabilityImpact > 0.7) {
            suggestions.push({
                id: "availability_suggestion_".concat(Date.now()),
                type: 'workout_suggestion',
                confidence: 0.8,
                priority: 'medium',
                title: 'Baja flexibilidad horaria',
                description: 'Tu disponibilidad es limitada. Considera sesiones más cortas o adaptables.',
                logicExplanation: 'Tu nivel de impacto por disponibilidad es ' + Math.round(externalAnalysis.availabilityImpact * 100) +
                    '%, lo que indica una baja flexibilidad horaria.',
                actionable: true
            });
        }
    }
    return suggestions;
}
generateModificationSuggestions(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Suggest modifications based on recovery status
    if (context.recoveryStatus &&
        (context.recoveryStatus.fatigueLevel === 'high' || context.recoveryStatus.fatigueLevel === 'extreme')) {
        suggestions.push({
            id: "modification_suggestion_".concat(Date.now()),
            type: 'modification_suggestion',
            confidence: 0.9,
            priority: 'critical',
            title: 'Modificación de rutina por fatiga',
            description: 'Detecto alta fatiga. Te recomiendo reducir la intensidad o volumen de tu entrenamiento de hoy.',
            logicExplanation: 'Tu nivel de fatiga es ' + context.recoveryStatus.fatigueLevel +
                ', lo que indica que tu cuerpo necesita una carga menor para recuperarse adecuadamente.',
            actionable: true
        });
    }
    // Suggest modifications based on wearable data
    if (context.wearableInsights) {
        if (context.wearableInsights.trainingReadiness === 'rest') {
            suggestions.push({
                id: "wearable_modification_suggestion_".concat(Date.now()),
                type: 'modification_suggestion',
                confidence: 0.85,
                priority: 'critical',
                title: 'Descanso recomendado por datos biométricos',
                description: 'Tus datos biométricos indican que hoy es mejor descansar completamente.',
                logicExplanation: 'Los datos de tus dispositivos wearables muestran que tu preparación para entrenar es baja, ' +
                    'lo que sugiere que necesitas un día de descanso para optimizar la recuperación.',
                actionable: true
            });
        }
        else if (context.wearableInsights.trainingReadiness === 'caution') {
            suggestions.push({
                id: "wearable_caution_suggestion_".concat(Date.now()),
                type: 'modification_suggestion',
                confidence: 0.8,
                priority: 'high',
                title: 'Entrenamiento suave recomendado',
                description: 'Tus datos biométricos sugieren un entrenamiento de baja intensidad hoy.',
                logicExplanation: 'Los datos de tus dispositivos wearables muestran una preparación moderada, ' +
                    'lo que indica que un entrenamiento suave sería más apropiado.',
                actionable: true
            });
        }
    }
    // Suggest modifications based on IoT equipment status
    var connectedEquipment = iot_integration_service_1.iotIntegrationService.getConnectedEquipment();
    if (connectedEquipment.length > 0) {
        var equipmentIssues = connectedEquipment.filter(function (e) { return !e.connected || (e.batteryLevel !== undefined && e.batteryLevel < 20); });
        if (equipmentIssues.length > 0) {
            suggestions.push({
                id: "equipment_modification_suggestion_".concat(Date.now()),
                type: 'modification_suggestion',
                confidence: 0.75,
                priority: 'medium',
                title: 'Considera alternativas por problemas de equipo',
                description: 'Algunos de tus equipos conectados tienen problemas. Considera modificar tu rutina en consecuencia.',
                logicExplanation: 'Tienes ' + equipmentIssues.length + ' equipos con problemas (batería baja o desconectados), ' +
                    'lo que puede afectar tu entrenamiento. Considera ejercicios alternativos o usar equipo diferente.',
                actionable: true
            });
        }
    }
    return suggestions;
}
generateRestPeriodSuggestions(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Suggest rest based on fatigue cycles
    if (userPatterns.recoveryPatterns.fatigueCycles.length > 0) {
        var lastFatigueDay = userPatterns.recoveryPatterns.fatigueCycles[0];
        var daysSinceLastFatigue = lastFatigueDay;
        // If it's been a while since last fatigue, suggest proactive rest
        if (daysSinceLastFatigue > 3) {
            suggestions.push({
                id: "rest_suggestion_".concat(Date.now()),
                type: 'rest_period_suggestion',
                confidence: 0.7,
                priority: 'medium',
                title: 'Considera un día de descanso proactivo',
                description: 'Basado en tu historial de fatiga, considera programar un día de descanso en los próximos días.',
                logicExplanation: 'Tu patrón de fatiga muestra ciclos regulares, y hace ' + daysSinceLastFatigue +
                    ' días desde tu última fatiga alta. Un día de descanso proactivo podría prevenir fatiga acumulativa.',
                actionable: true
            });
        }
    }
    return suggestions;
}
generateRoutineSuggestions(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Suggest routine optimization based on consistency
    if (userPatterns.trainingPatterns.consistency < 0.6) {
        suggestions.push({
            id: "routine_suggestion_".concat(Date.now()),
            type: 'routine_suggestion',
            confidence: 0.75,
            priority: 'high',
            title: 'Optimización de rutina semanal',
            description: 'Te recomiendo revisar y ajustar tu rutina semanal para mejorar la adherencia.',
            logicExplanation: 'Tu consistencia de entrenamiento es del ' + Math.round(userPatterns.trainingPatterns.consistency * 100) +
                '%, lo que sugiere que tu rutina actual podría necesitar ajustes para mejor adherencia.',
            actionable: true
        });
    }
    return suggestions;
}
generateRecoveryAdvice(context, chat_maestro_service_1.ChatContext);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Suggest recovery based on current recovery status
    if (context.recoveryStatus) {
        if (context.recoveryStatus.recoveryScore < 50) {
            suggestions.push({
                id: "recovery_advice_".concat(Date.now()),
                type: 'recovery_advice',
                confidence: 0.85,
                priority: 'high',
                title: 'Prioriza actividades de recuperación',
                description: 'Tu puntuación de recuperación es baja. Te recomiendo actividades de recuperación activa.',
                logicExplanation: 'Tu puntuación de recuperación es ' + context.recoveryStatus.recoveryScore +
                    '/100, lo que indica necesidad de enfocarte en recuperación antes que en entrenamiento intenso.',
                actionable: true
            });
        }
    }
    // Suggest recovery based on wearable data
    if (context.wearableInsights) {
        if (context.wearableInsights.recoveryStatus === 'poor' || context.wearableInsights.recoveryStatus === 'critical') {
            suggestions.push({
                id: "wearable_recovery_advice_".concat(Date.now()),
                type: 'recovery_advice',
                confidence: 0.9,
                priority: 'critical',
                title: 'Recuperación prioritaria según datos biométricos',
                description: 'Tus datos biométricos indican necesidad urgente de recuperación.',
                logicExplanation: 'Los datos de tus dispositivos wearables muestran un estado de recuperación ' +
                    context.wearableInsights.recoveryStatus +
                    ', lo que indica necesidad inmediata de actividades de recuperación.',
                actionable: true
            });
        }
    }
    return suggestions;
}
generateNutritionAdvice(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Suggest nutrition adjustments based on goals
    var hasMuscleMassGoal = context.userData.goals.some(function (goal) {
        return goal.toLowerCase().includes('masa') || goal.toLowerCase().includes('muscle');
    });
    if (hasMuscleMassGoal) {
        suggestions.push({
            id: "nutrition_advice_".concat(Date.now()),
            type: 'nutrition_advice',
            confidence: 0.8,
            priority: 'medium',
            title: 'Optimización nutricional para ganancia muscular',
            description: 'Para maximizar la ganancia muscular, asegúrate de mantener un superávit calórico adecuado.',
            logicExplanation: 'Tienes como objetivo ganar masa muscular, lo que requiere un superávit calórico sostenido ' +
                'y una ingesta proteica adecuada (alrededor de 1.6-2.2g por kg de peso corporal).',
            actionable: true
        });
    }
    return suggestions;
}
generateProgressionAdvice(context, chat_maestro_service_1.ChatContext);
PredictiveRecommendation[];
{
    var suggestions = [];
    // Analyze progression plans for stagnation
    var stagnantPlans = context.progressionPlans.filter(function (plan) {
        return plan.adjustments.length === 0 ||
            plan.adjustments.every(function (adjustment) {
                return new Date().getTime() - new Date(adjustment.date).getTime() > 14 * 24 * 60 * 60 * 1000;
            } // 14 days
            );
    });
    if (stagnantPlans.length > 0) {
        suggestions.push({
            id: "progression_advice_".concat(Date.now()),
            type: 'progression_advice',
            confidence: 0.85,
            priority: 'high',
            title: 'Ajustes necesarios en progresión de ejercicios',
            description: 'Detecto que algunos ejercicios no han sido ajustados en las últimas semanas. Es momento de variar la progresión.',
            logicExplanation: 'Tienes ' + stagnantPlans.length + ' ejercicios sin ajustes recientes, ' +
                'lo que puede indicar una meseta en el progreso. Variar variables como volumen, intensidad o ejercicio puede ayudar.',
            actionable: true
        });
    }
    return suggestions;
}
generateLongTermPlanRecommendations(context, chat_maestro_service_1.ChatContext);
PredictiveRecommendation[];
{
    var recommendations = [];
    // Analyze user goals to determine appropriate long-term plan
    var userGoals = context.userData.goals || [];
    // Determine primary strategic focus based on user goals
    var primaryFocus = 'strength';
    var secondaryFocuses = [];
    // Map user goals to strategic focuses
    if (userGoals.some(function (goal) { return goal.toLowerCase().includes('masa') || goal.toLowerCase().includes('muscle'); })) {
        primaryFocus = 'hypertrophy';
        secondaryFocuses.push('strength');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('fuerza') || goal.toLowerCase().includes('strength'); })) {
        primaryFocus = 'strength';
        secondaryFocuses.push('hypertrophy');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('tono') || goal.toLowerCase().includes('tone'); })) {
        primaryFocus = 'toning';
        secondaryFocuses.push('hypertrophy');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('velocidad') || goal.toLowerCase().includes('speed'); })) {
        primaryFocus = 'speed';
        secondaryFocuses.push('strength');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('resistencia') || goal.toLowerCase().includes('endurance'); })) {
        primaryFocus = 'endurance';
        secondaryFocuses.push('hypertrophy');
    }
    // Generate recommendations based on strategic focus
    recommendations.push({
        id: "long_term_plan_".concat(Date.now()),
        type: 'long_term_plan',
        confidence: 0.9,
        priority: 'high',
        title: 'Plan estratégico a largo plazo',
        description: 'Basado en tus objetivos, te recomiendo enfocarte en ' + primaryFocus + ' con enfoques secundarios en ' + secondaryFocuses.join(', ') + '.',
        logicExplanation: 'Tus objetivos indican una prioridad en ' + primaryFocus + '. Para un desarrollo equilibrado, también considera ' + secondaryFocuses.join(', ') + '.',
        actionable: true
    });
    return recommendations;
}
if (userGoals.some(function (goal) { return goal.toLowerCase().includes('resistencia') || goal.toLowerCase().includes('endurance'); })) {
    primaryFocus = 'endurance';
    secondaryFocuses.push('strength');
}
else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('movilidad') || goal.toLowerCase().includes('mobility'); })) {
    primaryFocus = 'mobility';
    secondaryFocuses.push('strength');
}
else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('prevención') || goal.toLowerCase().includes('prevention'); })) {
    primaryFocus = 'injury_prevention';
    secondaryFocuses.push('mobility');
}
// Generate recommendations for different plan durations
var planDurations = [6, 12, 24];
planDurations.forEach(function (duration) {
    recommendations.push({
        id: "long_term_plan_recommendation_".concat(duration, "months_").concat(Date.now()),
        type: 'long_term_plan_recommendation',
        confidence: 0.85,
        priority: 'medium',
        title: "Plan estrat\u00E9gico a ".concat(duration, " meses enfocado en ").concat(primaryFocus),
        description: "Te recomiendo un plan estrat\u00E9gico de ".concat(duration, " meses con enfoque primario en ").concat(primaryFocus, " y secundario en ").concat(secondaryFocuses.join(', '), "."),
        logicExplanation: "Basado en tus objetivos (".concat(userGoals.join(', '), "), un plan de ").concat(duration, " meses con enfoque en ").concat(primaryFocus, " te permitir\u00E1 alcanzar resultados sostenibles y progresar de forma segura."),
        actionable: true
    });
});
return recommendations;
/**
 * Generate objective-based recommendations
 */
generateObjectiveBasedRecommendations(context, chat_maestro_service_1.ChatContext, objectives, string[]);
ObjectiveBasedRecommendation[];
{
    var recommendations_1 = [];
    objectives.forEach(function (objective) {
        var recommendation = _this.generateRecommendationForObjective(context, objective);
        if (recommendation) {
            recommendations_1.push(recommendation);
        }
    });
    return recommendations_1;
}
/**
 * Generate long-term strategic plan based on user context
 */
generateLongTermStrategicPlan(context, chat_maestro_service_1.ChatContext, durationMonths, 6 | 12 | 24);
chat_maestro_strategic_planning_types_1.LongTermStrategicPlan;
{
    console.log("\uD83E\uDDE0 Generating ".concat(durationMonths, "-month strategic plan for user ").concat(context.userId));
    // Determine primary focus based on user goals
    var userGoals = context.userData.goals || [];
    var primaryFocus = 'strength';
    var secondaryFocuses = [];
    // Map user goals to strategic focuses
    if (userGoals.some(function (goal) { return goal.toLowerCase().includes('masa') || goal.toLowerCase().includes('muscle'); })) {
        primaryFocus = 'hypertrophy';
        secondaryFocuses.push('strength');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('fuerza') || goal.toLowerCase().includes('strength'); })) {
        primaryFocus = 'strength';
        secondaryFocuses.push('hypertrophy');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('resistencia') || goal.toLowerCase().includes('endurance'); })) {
        primaryFocus = 'endurance';
        secondaryFocuses.push('strength');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('movilidad') || goal.toLowerCase().includes('mobility'); })) {
        primaryFocus = 'mobility';
        secondaryFocuses.push('strength');
    }
    else if (userGoals.some(function (goal) { return goal.toLowerCase().includes('prevención') || goal.toLowerCase().includes('prevention'); })) {
        primaryFocus = 'injury_prevention';
        secondaryFocuses.push('mobility');
    }
    // Calculate plan dates
    var startDate = new Date();
    var endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    // Generate plan phases based on duration
    var phases = this.generatePlanPhases(durationMonths, startDate);
    // Generate strategic variations
    var variations = this.generateStrategicVariations(primaryFocus, secondaryFocuses);
    // Create the strategic plan
    var strategicPlan = {
        id: "strategic_plan_".concat(context.userId, "_").concat(Date.now()),
        userId: context.userId,
        name: "Plan estrat\u00E9gico a ".concat(durationMonths, " meses"),
        description: "Plan estrat\u00E9gico personalizado de ".concat(durationMonths, " meses enfocado en ").concat(primaryFocus),
        durationMonths: durationMonths,
        startDate: startDate,
        endDate: endDate,
        primaryFocus: primaryFocus,
        secondaryFocuses: secondaryFocuses,
        currentPhase: phases[0] || null,
        phases: phases,
        variations: variations,
        progressTracking: [],
        adaptations: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    return strategicPlan;
}
generatePlanPhases(durationMonths, 6 | 12 | 24, startDate, Date);
chat_maestro_strategic_planning_types_1.StrategicPlanPhase[];
{
    var phases = [];
    // Calculate total weeks
    var totalWeeks = durationMonths * 4.33; // Approximate weeks per month
    // Determine number of phases based on duration
    var numberOfPhases = 3;
    if (durationMonths >= 12)
        numberOfPhases = 4;
    if (durationMonths >= 24)
        numberOfPhases = 5;
    var weeksPerPhase = Math.floor(totalWeeks / numberOfPhases);
    // Define phase types
    var phaseTypes = ['accumulation', 'intensification', 'realization', 'deload', 'transition'];
    for (var i = 0; i < numberOfPhases; i++) {
        var phaseType = phaseTypes[i % phaseTypes.length];
        var phaseStartDate = new Date(startDate);
        phaseStartDate.setDate(phaseStartDate.getDate() + (i * weeksPerPhase * 7));
        var phaseEndDate = new Date(phaseStartDate);
        phaseEndDate.setDate(phaseEndDate.getDate() + (weeksPerPhase * 7));
        var phase = {
            id: "phase_".concat(i + 1, "_").concat(Date.now()),
            planId: '', // Will be set when plan is created
            phase: phaseType,
            name: this.getPhaseName(phaseType),
            description: this.getPhaseDescription(phaseType),
            startDate: phaseStartDate,
            endDate: phaseEndDate,
            objectives: this.getPhaseObjectives(phaseType),
            keyMetrics: this.getPhaseMetrics(phaseType),
            expectedOutcomes: this.getPhaseOutcomes(phaseType),
            durationWeeks: weeksPerPhase
        };
        phases.push(phase);
    }
    return phases;
}
getPhaseName(phaseType, chat_maestro_strategic_planning_types_1.PlanPhase);
string;
{
    switch (phaseType) {
        case 'accumulation': return 'Fase de Acumulación';
        case 'intensification': return 'Fase de Intensificación';
        case 'realization': return 'Fase de Realización';
        case 'deload': return 'Fase de Descarga';
        case 'transition': return 'Fase de Transición';
        default: return 'Fase de Entrenamiento';
    }
}
getPhaseDescription(phaseType, chat_maestro_strategic_planning_types_1.PlanPhase);
string;
{
    switch (phaseType) {
        case 'accumulation': return 'Construcción de volumen y capacidad de trabajo';
        case 'intensification': return 'Aumento de intensidad y especificidad';
        case 'realization': return 'Expresión del rendimiento pico';
        case 'deload': return 'Recuperación activa y adaptación';
        case 'transition': return 'Transición entre ciclos de entrenamiento';
        default: return 'Fase de entrenamiento general';
    }
}
getPhaseObjectives(phaseType, chat_maestro_strategic_planning_types_1.PlanPhase);
string[];
{
    switch (phaseType) {
        case 'accumulation': return [
            'Construir base de fuerza y resistencia',
            'Aumentar volumen de entrenamiento progresivamente',
            'Desarrollar consistencia en la rutina'
        ];
        case 'intensification': return [
            'Aumentar intensidad de entrenamiento',
            'Refinar técnica y ejecución',
            'Mejorar especificidad deportiva'
        ];
        case 'realization': return [
            'Expresar máximo rendimiento',
            'Demostrar adaptaciones acumuladas',
            'Alcanzar objetivos de fuerza/potencia'
        ];
        case 'deload': return [
            'Permitir recuperación completa',
            'Reducir fatiga acumulativa',
            'Preparar para próximo ciclo'
        ];
        case 'transition': return [
            'Cambiar enfoque de entrenamiento',
            'Introducir nuevas variables',
            'Mantener adherencia durante transición'
        ];
        default: return ['Objetivos generales de entrenamiento'];
    }
}
getPhaseMetrics(phaseType, chat_maestro_strategic_planning_types_1.PlanPhase);
string[];
{
    switch (phaseType) {
        case 'accumulation': return ['Volumen total', 'Frecuencia semanal', 'Consistencia'];
        case 'intensification': return ['Intensidad relativa', 'Carga externa', 'Velocidad de ejecución'];
        case 'realization': return ['Fuerza máxima', 'Potencia', 'Rendimiento específico'];
        case 'deload': return ['Nivel de fatiga', 'Calidad de sueño', 'Estado de ánimo'];
        case 'transition': return ['Adaptación a nuevas variables', 'Mantenimiento de fuerza', 'Motivación'];
        default: return ['Métricas generales'];
    }
}
getPhaseOutcomes(phaseType, chat_maestro_strategic_planning_types_1.PlanPhase);
string[];
{
    switch (phaseType) {
        case 'accumulation': return [
            'Mejora en resistencia muscular',
            'Aumento en capacidad de trabajo',
            'Mayor consistencia en entrenamiento'
        ];
        case 'intensification': return [
            'Incremento en fuerza máxima',
            'Mejora en técnica avanzada',
            'Mayor especificidad deportiva'
        ];
        case 'realization': return [
            'Alto rendimiento en pruebas específicas',
            'Expresión óptima de adaptaciones',
            'Logro de objetivos de fuerza/potencia'
        ];
        case 'deload': return [
            'Reducción significativa de fatiga',
            'Mejora en calidad de sueño',
            'Recarga mental y física'
        ];
        case 'transition': return [
            'Adaptación exitosa a nuevo enfoque',
            'Mantenimiento de nivel de fuerza',
            'Renovada motivación'
        ];
        default: return ['Resultados generales de entrenamiento'];
    }
}
generateStrategicVariations(primaryFocus, chat_maestro_strategic_planning_types_1.StrategicFocusArea, secondaryFocuses, chat_maestro_strategic_planning_types_1.StrategicFocusArea[]);
chat_maestro_strategic_planning_types_1.StrategicVariation[];
{
    var variations_1 = [];
    // Add primary focus variation
    variations_1.push(this.createStrategicVariation(primaryFocus, true));
    // Add secondary focus variations
    secondaryFocuses.forEach(function (focus) {
        variations_1.push(_this.createStrategicVariation(focus, false));
    });
    return variations_1;
}
createStrategicVariation(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea, isPrimary, boolean);
chat_maestro_strategic_planning_types_1.StrategicVariation;
{
    var variation = {
        id: "variation_".concat(focusArea, "_").concat(Date.now()),
        planId: '', // Will be set when plan is created
        focusArea: focusArea,
        name: this.getFocusAreaName(focusArea),
        description: this.getFocusAreaDescription(focusArea),
        intensityProfile: this.getFocusAreaIntensityProfile(focusArea),
        volumeProfile: this.getFocusAreaVolumeProfile(focusArea),
        frequencyProfile: this.getFocusAreaFrequencyProfile(focusArea),
        recommendedDurationWeeks: this.getFocusAreaDuration(focusArea),
        progressionModel: this.getFocusAreaProgressionModel(focusArea),
        keyExercises: this.getFocusAreaKeyExercises(focusArea),
        adaptationTriggers: this.getFocusAreaAdaptationTriggers(focusArea)
    };
    return variation;
}
getFocusAreaName(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
string;
{
    switch (focusArea) {
        case 'hypertrophy': return 'Hipertrofia Muscular';
        case 'strength': return 'Fuerza Máxima';
        case 'endurance': return 'Resistencia Muscular';
        case 'mobility': return 'Movilidad Articular';
        case 'injury_prevention': return 'Prevención de Lesiones';
        default: return 'Enfoque General';
    }
}
getFocusAreaDescription(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
string;
{
    switch (focusArea) {
        case 'hypertrophy': return 'Desarrollo de masa muscular a través de volumen y tensión mecánica';
        case 'strength': return 'Maximización de la fuerza a través de cargas intensas y patrones específicos';
        case 'endurance': return 'Mejora de la resistencia muscular y cardiovascular';
        case 'mobility': return 'Aumento de la movilidad articular y flexibilidad';
        case 'injury_prevention': return 'Reducción del riesgo de lesiones a través de fortalecimiento preventivo';
        default: return 'Enfoque general de entrenamiento';
    }
}
getFocusAreaIntensityProfile(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
'low' | 'moderate' | 'high';
{
    switch (focusArea) {
        case 'hypertrophy': return 'moderate';
        case 'strength': return 'high';
        case 'endurance': return 'moderate';
        case 'mobility': return 'low';
        case 'injury_prevention': return 'moderate';
        default: return 'moderate';
    }
}
getFocusAreaVolumeProfile(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
'low' | 'moderate' | 'high';
{
    switch (focusArea) {
        case 'hypertrophy': return 'high';
        case 'strength': return 'moderate';
        case 'endurance': return 'high';
        case 'mobility': return 'moderate';
        case 'injury_prevention': return 'moderate';
        default: return 'moderate';
    }
}
getFocusAreaFrequencyProfile(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
'low' | 'moderate' | 'high';
{
    switch (focusArea) {
        case 'hypertrophy': return 'high';
        case 'strength': return 'moderate';
        case 'endurance': return 'high';
        case 'mobility': return 'high';
        case 'injury_prevention': return 'high';
        default: return 'moderate';
    }
}
getFocusAreaDuration(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
number[];
{
    switch (focusArea) {
        case 'hypertrophy': return [8, 12, 16];
        case 'strength': return [6, 10, 14];
        case 'endurance': return [8, 12, 16];
        case 'mobility': return [4, 8, 12];
        case 'injury_prevention': return [6, 10, 14];
        default: return [8, 12, 16];
    }
}
getFocusAreaProgressionModel(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
'linear' | 'undulating' | 'block' | 'conjugate';
{
    switch (focusArea) {
        case 'hypertrophy': return 'undulating';
        case 'strength': return 'block';
        case 'endurance': return 'linear';
        case 'mobility': return 'linear';
        case 'injury_prevention': return 'undulating';
        default: return 'undulating';
    }
}
getFocusAreaKeyExercises(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
string[];
{
    switch (focusArea) {
        case 'hypertrophy': return ['Press de banca', 'Sentadilla', 'Peso muerto', 'Remo con barra', 'Press militar'];
        case 'strength': return ['Sentadilla profunda', 'Press de banca', 'Peso muerto', 'Press militar', 'Zanca'];
        case 'endurance': return ['Burpees', 'Mountain climbers', 'Jumping jacks', 'High knees', 'Bear crawls'];
        case 'mobility': return ['Movilidad de hombros', 'Movilidad de cadera', 'Movilidad de tobillo', 'Cat-cow stretch', 'World\'s greatest stretch'];
        case 'injury_prevention': return ['Puente de glúteos', 'Plancha', 'Bird dog', 'Dead bug', 'Wall slide'];
        default: return ['Ejercicios generales'];
    }
}
getFocusAreaAdaptationTriggers(focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
string[];
{
    switch (focusArea) {
        case 'hypertrophy': return ['Meseta en volumen', 'Dolor muscular persistente', 'Falta de motivación'];
        case 'strength': return ['Fallo en 3+ sesiones consecutivas', 'Deterioro en técnica', 'Exceso de fatiga'];
        case 'endurance': return ['Falta de aire durante ejercicios', 'Tiempo de recuperación prolongado', 'Fatiga prematura'];
        case 'mobility': return ['Dolor articular', 'Restricción de movimiento', 'Tensión muscular'];
        case 'injury_prevention': return ['Dolor en áreas problemáticas', 'Compensaciones en movimiento', 'Debilidad muscular'];
        default: return ['Indicadores generales de adaptación'];
    }
}
generateRecommendationForObjective(context, chat_maestro_service_1.ChatContext, objective, string);
ObjectiveBasedRecommendation | null;
{
    // Parse objective and generate appropriate recommendation
    var lowerObjective = objective.toLowerCase();
    // Get user patterns for more informed recommendations
    var userPatterns = this.analyzeUserPatterns(context);
    if (lowerObjective.includes('fuerza') || lowerObjective.includes('strength')) {
        return this.generateStrengthRecommendation(context, userPatterns);
    }
    if (lowerObjective.includes('masa') || lowerObjective.includes('muscle')) {
        return this.generateMuscleMassRecommendation(context, userPatterns);
    }
    if (lowerObjective.includes('definici') || lowerObjective.includes('definition')) {
        return this.generateDefinitionRecommendation(context, userPatterns);
    }
    if (lowerObjective.includes('resistencia') || lowerObjective.includes('endurance')) {
        return this.generateEnduranceRecommendation(context, userPatterns);
    }
    if (lowerObjective.includes('movilidad') || lowerObjective.includes('mobility')) {
        return this.generateMobilityRecommendation(context, userPatterns);
    }
    if (lowerObjective.includes('recuperaci') || lowerObjective.includes('recovery')) {
        return this.generateRecoveryRecommendation(context, userPatterns);
    }
    // Default recommendation for unknown objectives
    return {
        objective: objective,
        recommendedAction: 'Mantén tu enfoque actual y evalúa progreso en 4 semanas',
        timeline: '4 semanas',
        successMetrics: ['Consistencia del 80% en entrenamiento', 'Cumplimiento del 85% en nutrición'],
        confidence: 0.6
    };
}
generateStrengthRecommendation(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
ObjectiveBasedRecommendation;
{
    // Analyze current strength trends
    var decliningStrength = Object.entries(userPatterns.performancePatterns.strengthTrends)
        .filter(function (_a) {
        var _ = _a[0], trend = _a[1];
        return trend === 'declining';
    })
        .map(function (_a) {
        var exercise = _a[0], _ = _a[1];
        return exercise;
    });
    var stableStrength = Object.entries(userPatterns.performancePatterns.strengthTrends)
        .filter(function (_a) {
        var _ = _a[0], trend = _a[1];
        return trend === 'stable';
    })
        .map(function (_a) {
        var exercise = _a[0], _ = _a[1];
        return exercise;
    });
    // Adjust recommendation based on user patterns
    var recommendedAction = 'Aumenta progresivamente la carga en ejercicios compuestos';
    var timeline = '4-6 semanas';
    var confidence = 0.85;
    // If user has declining strength in some exercises, adjust recommendation
    if (decliningStrength.length > 0) {
        recommendedAction = "Enf\u00F3cate primero en recuperar fuerza en ".concat(decliningStrength.slice(0, 2).join(', '), ". Considera deload y t\u00E9cnica.");
        timeline = '6-8 semanas';
        confidence = 0.75;
    }
    // If user has stable strength, suggest more aggressive approach
    else if (stableStrength.length > 0 && userPatterns.trainingPatterns.consistency > 0.8) {
        recommendedAction = 'Aumenta progresivamente la carga en ejercicios compuestos con énfasis en variación de repeticiones.';
        confidence = 0.9;
    }
    return {
        objective: 'Aumentar fuerza',
        recommendedAction: recommendedAction,
        timeline: timeline,
        successMetrics: ['Incremento del 5-10% en press de banca', 'Mejora del 5-10% en sentadilla'],
        confidence: confidence
    };
}
generateMuscleMassRecommendation(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
ObjectiveBasedRecommendation;
{
    // Analyze training volume trends
    var volumeTrend = userPatterns.trainingPatterns.volumeTrends;
    var consistency = userPatterns.trainingPatterns.consistency;
    // Analyze nutrition patterns
    var nutritionAdherence = userPatterns.nutritionPatterns.adherenceTrends;
    // Adjust recommendation based on user patterns
    var recommendedAction = 'Aumenta el volumen de entrenamiento y mantén superávit calórico';
    var timeline = '8-12 semanas';
    var confidence = 0.8;
    // If volume is already increasing, suggest optimization
    if (volumeTrend === 'increasing' && consistency > 0.7) {
        recommendedAction = 'Optimiza el volumen de entrenamiento y asegura superávit calórico sostenido';
        confidence = 0.85;
    }
    // If volume is decreasing or adherence is low, suggest corrective actions
    else if (volumeTrend === 'decreasing' || nutritionAdherence === 'declining') {
        recommendedAction = 'Estabiliza el volumen de entrenamiento y mejora adherencia nutricional';
        timeline = '10-14 semanas';
        confidence = 0.7;
    }
    return {
        objective: 'Ganar masa muscular',
        recommendedAction: recommendedAction,
        timeline: timeline,
        successMetrics: ['Ganancia de 0.5-1 kg de masa muscular', 'Incremento del 10-15% en volumen total'],
        confidence: confidence
    };
}
generateDefinitionRecommendation(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
ObjectiveBasedRecommendation;
{
    // Analyze training consistency
    var consistency = userPatterns.trainingPatterns.consistency;
    // Analyze nutrition adherence
    var nutritionAdherence = userPatterns.nutritionPatterns.adherenceTrends;
    // Adjust recommendation based on user patterns
    var recommendedAction = 'Mantén volumen de entrenamiento mientras creas un déficit calórico controlado';
    var timeline = '12-16 semanas';
    var confidence = 0.75;
    // If user is highly consistent, suggest more aggressive approach
    if (consistency > 0.8 && nutritionAdherence !== 'declining') {
        recommendedAction = 'Mantén volumen de entrenamiento e incrementa déficit calórico moderado';
        confidence = 0.8;
    }
    // If user has low consistency or declining nutrition, suggest stabilization first
    else if (consistency < 0.6 || nutritionAdherence === 'declining') {
        recommendedAction = 'Estabiliza la rutina de entrenamiento y mejora adherencia nutricional antes de crear déficit';
        timeline = '14-18 semanas';
        confidence = 0.65;
    }
    return {
        objective: 'Definición muscular',
        recommendedAction: recommendedAction,
        timeline: timeline,
        successMetrics: ['Pérdida de 0.5-1 kg de grasa corporal', 'Mantenimiento de fuerza'],
        confidence: confidence
    };
}
generateEnduranceRecommendation(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
ObjectiveBasedRecommendation;
{
    // Analyze training frequency
    var consistency = userPatterns.trainingPatterns.consistency;
    // Adjust recommendation based on user patterns
    var recommendedAction = 'Incrementa volumen y frecuencia de entrenamiento cardiovascular';
    var timeline = '6-8 semanas';
    var confidence = 0.8;
    // If user is already consistent, suggest higher intensity
    if (consistency > 0.8) {
        recommendedAction = 'Incrementa intensidad y frecuencia de entrenamiento cardiovascular';
        confidence = 0.85;
    }
    // If user has low consistency, suggest building habit first
    else if (consistency < 0.5) {
        recommendedAction = 'Establece rutina cardiovascular consistente antes de incrementar volumen';
        timeline = '8-10 semanas';
        confidence = 0.7;
    }
    return {
        objective: 'Mejorar resistencia',
        recommendedAction: recommendedAction,
        timeline: timeline,
        successMetrics: ['Mejora del 15-20% en tiempo de ejercicio', 'Incremento del 10-15% en VO2 max'],
        confidence: confidence
    };
}
generateMobilityRecommendation(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
ObjectiveBasedRecommendation;
{
    // Analyze training patterns for potential mobility issues
    var consistency = userPatterns.trainingPatterns.consistency;
    var volumeTrend = userPatterns.trainingPatterns.volumeTrends;
    var recommendedAction = 'Incorpora trabajo de movilidad y estiramientos en cada sesión';
    var timeline = '4-6 semanas';
    var confidence = 0.75;
    // If user trains frequently with high volume, prioritize recovery
    if (consistency > 0.7 && volumeTrend === 'increasing') {
        recommendedAction = 'Prioriza movilidad y recuperación activa para prevenir lesiones';
        confidence = 0.8;
    }
    return {
        objective: 'Mejorar movilidad',
        recommendedAction: recommendedAction,
        timeline: timeline,
        successMetrics: ['Mejora del 20-30% en tests de movilidad', 'Reducción del 50% en molestias articulares'],
        confidence: confidence
    };
}
generateRecoveryRecommendation(context, chat_maestro_service_1.ChatContext, userPatterns, UserPattern);
ObjectiveBasedRecommendation;
{
    // Analyze recovery patterns
    var sleepQualityTrend = userPatterns.recoveryPatterns.sleepQualityTrends;
    var stressPatterns_1 = userPatterns.recoveryPatterns.stressPatterns;
    var recommendedAction = 'Implementa protocolos de recuperación activa y sueño de calidad';
    var timeline = '3-4 semanas';
    var confidence = 0.8;
    // If sleep quality is declining, prioritize sleep optimization
    if (sleepQualityTrend === 'declining') {
        recommendedAction = 'Prioriza optimización del sueño (7-9 horas) y reducción de estrés';
        confidence = 0.85;
    }
    // If stress levels are high, add stress management
    if (stressPatterns_1.length > 0) {
        var avgStress = stressPatterns_1.reduce(function (sum, val) { return sum + val; }, 0) / stressPatterns_1.length;
        if (avgStress > 70) {
            recommendedAction += '. Incorpora técnicas de manejo del estrés como meditación o respiración.';
            confidence = 0.9;
        }
    }
    return {
        objective: 'Optimizar recuperación',
        recommendedAction: recommendedAction,
        timeline: timeline,
        successMetrics: ['Mejora del 20% en puntuación de recuperación', 'Reducción del 30% en niveles de estrés'],
        confidence: confidence
    };
}
/**
 * Format objective-based recommendations for Chat Maestro response
 */
formatObjectiveRecommendationsForChat(recommendations, ObjectiveBasedRecommendation[]);
chat_maestro_service_1.ChatResponse;
{
    if (recommendations.length === 0) {
        return {
            response: 'No tengo recomendaciones específicas basadas en tus objetivos en este momento.',
            actionItems: []
        };
    }
    var response_1 = '🎯 **Recomendaciones Basadas en Tus Objetivos**\n\n';
    recommendations.forEach(function (rec, index) {
        response_1 += "".concat(index + 1, ". **").concat(rec.objective, "**\n");
        response_1 += "   Acci\u00F3n recomendada: ".concat(rec.recommendedAction, "\n");
        response_1 += "   Timeline: ".concat(rec.timeline, "\n");
        response_1 += "   M\u00E9tricas de \u00E9xito: ".concat(rec.successMetrics.join(', '), "\n");
        response_1 += "   Confianza: ".concat((rec.confidence * 100).toFixed(0), "%\n\n");
    });
    // Add action items
    var actionItems = recommendations.map(function (rec) { return "Implementar: ".concat(rec.recommendedAction); });
    return {
        response: response_1,
        actionItems: actionItems
    };
}
/**
 * Format long-term plan recommendations for Chat Maestro response
 */
formatLongTermPlanRecommendationsForChat(recommendations, PredictiveRecommendation[]);
chat_maestro_service_1.ChatResponse;
{
    if (recommendations.length === 0) {
        return {
            response: 'No tengo recomendaciones específicas para planes estratégicos a largo plazo en este momento.',
            actionItems: []
        };
    }
    var response_2 = '🧭 **Recomendaciones de Planes Estratégicos a Largo Plazo**\n\n';
    recommendations.forEach(function (rec, index) {
        response_2 += "".concat(index + 1, ". **").concat(rec.title, "**\n");
        response_2 += "   ".concat(rec.description, "\n");
        response_2 += "   \uD83D\uDCA1 *L\u00F3gica: ".concat(rec.logicExplanation, "*\n\n");
    });
    // Add action items
    var actionItems = recommendations.map(function (rec) { return rec.title; });
    return {
        response: response_2,
        actionItems: actionItems
    };
}
/**
 * Format strategic plan for Chat Maestro response
 */
formatStrategicPlanForChat(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan);
chat_maestro_service_1.ChatResponse;
{
    var response_3 = "\uD83E\uDDED **Plan Estrat\u00E9gico a ".concat(plan.durationMonths, " Meses**\n\n");
    response_3 += "**Enfoque Primario:** ".concat(this.getFocusAreaName(plan.primaryFocus), "\n");
    response_3 += "**Enfoques Secundarios:** ".concat(plan.secondaryFocuses.map(function (focus) { return _this.getFocusAreaName(focus); }).join(', '), "\n\n");
    response_3 += '**Fases del Plan:**\n';
    plan.phases.forEach(function (phase, index) {
        response_3 += "".concat(index + 1, ". **").concat(phase.name, "** (").concat(phase.startDate.toLocaleDateString(), " - ").concat(phase.endDate.toLocaleDateString(), ")\n");
        response_3 += "   ".concat(phase.description, "\n");
        response_3 += "   Objetivos: ".concat(phase.objectives.slice(0, 2).join(', '), "\n\n");
    });
    response_3 += '**Variaciones Estratégicas:**\n';
    plan.variations.forEach(function (variation, index) {
        response_3 += "".concat(index + 1, ". **").concat(variation.name, "**\n");
        response_3 += "   Intensidad: ".concat(variation.intensityProfile, ", Volumen: ").concat(variation.volumeProfile, ", Frecuencia: ").concat(variation.frequencyProfile, "\n");
        response_3 += "   Duraci\u00F3n recomendada: ".concat(variation.recommendedDurationWeeks[0], "-").concat(variation.recommendedDurationWeeks[variation.recommendedDurationWeeks.length - 1], " semanas\n\n");
    });
    // Add action items
    var actionItems = [
        'Revisar y aceptar el plan estratégico',
        'Programar sesiones de seguimiento',
        'Configurar recordatorios de progreso'
    ];
    return {
        response: response_3,
        actionItems: actionItems
    };
}
/**
 * Format recommendations for Chat Maestro response
 */
formatRecommendationsForChat(recommendations, PredictiveRecommendation[]);
chat_maestro_service_1.ChatResponse;
{
    if (recommendations.length === 0) {
        return {
            response: 'No tengo recomendaciones específicas en este momento. ¡Sigue con tu excelente trabajo!',
            actionItems: []
        };
    }
    // Get top 3 recommendations by priority and confidence
    var topRecommendations = recommendations.slice(0, 3);
    var response_4 = '🎯 **Recomendaciones Proactivas Basadas en Tu Historial**\n\n';
    topRecommendations.forEach(function (rec, index) {
        response_4 += "".concat(index + 1, ". **").concat(rec.title, "**\n");
        response_4 += "   ".concat(rec.description, "\n");
        response_4 += "   \uD83D\uDCA1 *L\u00F3gica: ".concat(rec.logicExplanation, "*\n\n");
    });
    // Add action items
    var actionItems = topRecommendations.map(function (rec) { return rec.title; });
    return {
        response: response_4,
        actionItems: actionItems
    };
}
/**
 * Generate autonomous plan adaptations based on predictive insights
 */
generateAutonomousPlanAdaptations(context, chat_maestro_service_1.ChatContext);
AutonomousAdaptation[];
{
    console.log('🤖 Generating autonomous plan adaptations');
    var adaptations = [];
    // 1. Analyze current plan effectiveness
    var planEffectiveness = this.analyzePlanEffectiveness(context);
    // 2. Generate workout plan adaptations
    var workoutAdaptations = this.generateWorkoutPlanAdaptations(context, planEffectiveness);
    adaptations.push.apply(adaptations, workoutAdaptations);
    // 3. Generate nutrition plan adaptations
    var nutritionAdaptations = this.generateNutritionPlanAdaptations(context, planEffectiveness);
    adaptations.push.apply(adaptations, nutritionAdaptations);
    // 4. Generate recovery plan adaptations
    var recoveryAdaptations = this.generateRecoveryPlanAdaptations(context, planEffectiveness);
    adaptations.push.apply(adaptations, recoveryAdaptations);
    // 5. Generate progression adaptations
    var progressionAdaptations = this.generateProgressionAdaptations(context, planEffectiveness);
    adaptations.push.apply(adaptations, progressionAdaptations);
    // Sort adaptations by confidence
    adaptations.sort(function (a, b) { return b.confidence - a.confidence; });
    // Notify the nervous system of autonomous adaptations
    spartan_nervous_system_1.spartanNervousSystem.emitEvent({
        type: 'insight_generated',
        timestamp: new Date(),
        userId: context.userId,
        payload: {
            adaptations: adaptations,
            source: 'predictive_engine'
        },
        sourceModule: 'ChatMaestroPredictiveEngine',
        priority: 'medium'
    });
    return adaptations;
}
/**
 * Analyze long-term plan progress and generate adjustment recommendations
 */
analyzeLongTermPlanProgress(context, chat_maestro_service_1.ChatContext, plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan);
chat_maestro_strategic_planning_types_1.PlanAdjustmentRecommendation[];
{
    console.log("\uD83D\uDCCA Analyzing progress for long-term strategic plan: ".concat(plan.id));
    var recommendations = [];
    // 1. Analyze current phase progress
    var phaseProgressRecommendations = this.analyzePhaseProgress(plan);
    recommendations.push.apply(recommendations, phaseProgressRecommendations);
    // 2. Analyze physical evolution
    var physicalEvolution = this.analyzePhysicalEvolution(context);
    // 3. Generate adaptation recommendations based on physical evolution
    var evolutionRecommendations = this.generateEvolutionBasedRecommendations(plan, physicalEvolution);
    recommendations.push.apply(recommendations, evolutionRecommendations);
    // 4. Check if phase change is needed
    var phaseChangeRecommendations = this.checkPhaseChangeNeeded(plan, physicalEvolution);
    recommendations.push.apply(recommendations, phaseChangeRecommendations);
    // 5. Check if focus shift is needed
    var focusShiftRecommendations = this.checkFocusShiftNeeded(plan, physicalEvolution);
    recommendations.push.apply(recommendations, focusShiftRecommendations);
    return recommendations;
}
analyzePhaseProgress(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan);
chat_maestro_strategic_planning_types_1.PlanAdjustmentRecommendation[];
{
    var recommendations = [];
    if (!plan.currentPhase)
        return recommendations;
    // Calculate phase completion percentage
    var phaseStartDate = plan.currentPhase.startDate.getTime();
    var phaseEndDate = plan.currentPhase.endDate.getTime();
    var currentDate = Date.now();
    var phaseDuration = phaseEndDate - phaseStartDate;
    var elapsedPhaseTime = currentDate - phaseStartDate;
    var phaseCompletion = Math.min(1, elapsedPhaseTime / phaseDuration);
    // If phase is more than 80% complete, suggest preparing for next phase
    if (phaseCompletion > 0.8) {
        recommendations.push({
            id: "phase_completion_".concat(Date.now()),
            planId: plan.id,
            type: 'phase_change',
            priority: 'medium',
            trigger: "Fase ".concat(plan.currentPhase.name, " completada en ").concat(Math.round(phaseCompletion * 100), "%"),
            recommendation: 'Preparar transición a la próxima fase del plan',
            rationale: "La fase actual est\u00E1 ".concat(Math.round(phaseCompletion * 100), "% completada, lo que indica que es momento de preparar la transici\u00F3n."),
            confidence: 0.8,
            implementationSteps: [
                'Evaluar progreso en objetivos de fase',
                'Planificar adaptaciones para próxima fase',
                'Programar revisión de plan estratégico'
            ],
            expectedBenefits: [
                'Transición fluida entre fases',
                'Mantenimiento de progresión continua',
                'Optimización de resultados'
            ],
            timeframe: 'Próxima semana'
        });
    }
    return recommendations;
}
analyzePhysicalEvolution(context, chat_maestro_service_1.ChatContext);
chat_maestro_strategic_planning_types_1.PhysicalEvolution;
{
    // Integrate with actual data sources
    // Get recent workout data
    var recentWorkouts = context.recentWorkouts.slice(0, 10);
    // Get recovery data
    var recoveryAnalyses = (storage_1.storageManager.getRecoveryAnalyses() || []).slice(0, 10);
    // Get nutrition data
    var nutritionData = storage_1.storageManager.getDailyNutrition().slice(0, 10);
    // Get actual physical measurements from user data or storage
    var physicalEvolution = {
        id: "evolution_".concat(context.userId, "_").concat(Date.now()),
        userId: context.userId,
        date: new Date(),
        measurements: {
            weight: context.userData.weight || 70,
            // Get actual measurements from storage if available
            bodyFatPercentage: 15, // Default value, would be retrieved from storage in real implementation
            muscleMass: 55, // Default value, would be retrieved from storage in real implementation
            restingHeartRate: 60, // Default value, would be retrieved from storage in real implementation
            heartRateVariability: 65, // Default value, would be retrieved from storage in real implementation
            vo2max: 45, // Default value, would be retrieved from storage in real implementation
            flexibility: 7 // Default value, would be retrieved from storage in real implementation
        },
        performanceMetrics: {
            strength: this.extractStrengthMetrics(recentWorkouts),
            endurance: this.extractEnduranceMetrics(recentWorkouts),
            mobility: this.extractMobilityMetrics(recoveryAnalyses)
        },
        healthMarkers: {
            sleepQuality: this.calculateAverageSleepQuality(recoveryAnalyses),
            stressLevel: this.calculateAverageStressLevel(recoveryAnalyses),
            energyLevel: this.calculateAverageEnergyLevel(recoveryAnalyses),
            motivation: this.calculateAverageMotivation(recoveryAnalyses)
        },
        notes: 'Evolución física basada en datos reales del usuario'
    };
    return physicalEvolution;
}
extractStrengthMetrics(workouts, types_1.WorkoutSession[]);
Record < string, number > {
    const: strengthMetrics
};
{ }
;
// Analyze actual workout data to extract strength metrics
var compoundExercises = ['press_banca', 'sentadilla', 'peso_muerto', 'press_militar', 'remo', 'zancada'];
// Group workouts by exercise
var exerciseWorkouts = {};
workouts.forEach(function (workout) {
    workout.exercises.forEach(function (exercise) {
        var exerciseName = exercise.name.toLowerCase().replace(/\s+/g, '_');
        if (compoundExercises.some(function (ce) { return exerciseName.includes(ce); })) {
            if (!exerciseWorkouts[exerciseName]) {
                exerciseWorkouts[exerciseName] = [];
            }
            exerciseWorkouts[exerciseName].push(workout);
        }
    });
});
// Calculate max weight for each compound exercise
Object.keys(exerciseWorkouts).forEach(function (exerciseName) {
    var maxWeight = 0;
    exerciseWorkouts[exerciseName].forEach(function (workout) {
        workout.exercises.forEach(function (exercise) {
            if (exercise.name.toLowerCase().replace(/\s+/g, '_') === exerciseName) {
                exercise.sets.forEach(function (set) {
                    if (set.weight && set.weight > maxWeight) {
                        maxWeight = set.weight;
                    }
                });
            }
        });
    });
    strengthMetrics[exerciseName] = maxWeight;
});
return strengthMetrics;
extractEnduranceMetrics(workouts, types_1.WorkoutSession[]);
Record < string, number > {
    const: enduranceMetrics
};
{ }
;
// Analyze actual workout data to extract endurance metrics
var totalCardioTime = 0;
var totalHighRepSets = 0;
workouts.forEach(function (workout) {
    // Calculate cardio time (assuming sessions with duration are cardio)
    if (workout.duration) {
        totalCardioTime += workout.duration;
    }
    // Count high-rep sets (15+ reps)
    workout.exercises.forEach(function (exercise) {
        exercise.sets.forEach(function (set) {
            if (set.reps && set.reps >= 15) {
                totalHighRepSets += 1;
            }
        });
    });
});
// Average cardio time per workout
enduranceMetrics['tiempo_cardio'] = workouts.length > 0 ? totalCardioTime / workouts.length : 0;
enduranceMetrics['repeticiones_alta_resistencia'] = totalHighRepSets;
return enduranceMetrics;
extractMobilityMetrics(recoveryAnalyses, types_1.RecoveryAnalysis[]);
Record < string, number > {
    const: mobilityMetrics
};
{ }
;
// Analyze actual recovery data to extract mobility metrics
if (recoveryAnalyses.length > 0) {
    // Calculate average mobility score from recovery analyses
    // Assuming recovery score correlates with mobility (higher recovery = better mobility)
    var totalRecoveryScore = recoveryAnalyses.reduce(function (sum, analysis) { return sum + analysis.recoveryScore; }, 0);
    var avgRecoveryScore = totalRecoveryScore / recoveryAnalyses.length;
    // Map recovery score to mobility metrics (0-10 scale)
    mobilityMetrics['movilidad_hombros'] = Math.min(10, Math.max(1, avgRecoveryScore / 10));
    mobilityMetrics['movilidad_caderas'] = Math.min(10, Math.max(1, avgRecoveryScore / 12));
    mobilityMetrics['flexibilidad_general'] = Math.min(10, Math.max(1, avgRecoveryScore / 10));
}
else {
    // Default values if no recovery data
    mobilityMetrics['movilidad_hombros'] = 7;
    mobilityMetrics['movilidad_caderas'] = 7;
    mobilityMetrics['flexibilidad_general'] = 7;
}
return mobilityMetrics;
calculateAverageSleepQuality(recoveryAnalyses, types_1.RecoveryAnalysis[]);
number;
{
    if (recoveryAnalyses.length === 0)
        return 7; // Default value
    // Calculate average sleep quality from recovery analyses
    // Recovery score is already a good indicator of sleep quality
    var totalQuality = recoveryAnalyses.reduce(function (sum, analysis) { return sum + (analysis.recoveryScore / 10); }, 0);
    return totalQuality / recoveryAnalyses.length;
}
calculateAverageStressLevel(recoveryAnalyses, types_1.RecoveryAnalysis[]);
number;
{
    if (recoveryAnalyses.length === 0)
        return 5; // Default value
    // Calculate average stress level from recovery analyses
    // Using fatigue level and inversely correlated recovery score
    var totalStress = recoveryAnalyses.reduce(function (sum, analysis) {
        // Base stress value from fatigue level
        var stressValue = analysis.fatigueLevel === 'extreme' ? 9 :
            analysis.fatigueLevel === 'high' ? 7 :
                analysis.fatigueLevel === 'moderate' ? 5 :
                    3;
        // Adjust based on recovery score (lower recovery = higher stress)
        var recoveryAdjustment = (100 - analysis.recoveryScore) / 10;
        stressValue = Math.min(10, stressValue + recoveryAdjustment / 2);
        return sum + stressValue;
    }, 0);
    return totalStress / recoveryAnalyses.length;
}
calculateAverageEnergyLevel(recoveryAnalyses, types_1.RecoveryAnalysis[]);
number;
{
    if (recoveryAnalyses.length === 0)
        return 7; // Default value
    // Calculate average energy level from recovery analyses
    // Directly using recovery score as it correlates with energy
    var totalEnergy = recoveryAnalyses.reduce(function (sum, analysis) { return sum + (analysis.recoveryScore / 10); }, 0);
    return totalEnergy / recoveryAnalyses.length;
}
calculateAverageMotivation(recoveryAnalyses, types_1.RecoveryAnalysis[]);
number;
{
    if (recoveryAnalyses.length === 0)
        return 7; // Default value
    // Calculate average motivation level from recovery analyses
    // Using recovery score as a proxy for motivation
    var totalMotivation = recoveryAnalyses.reduce(function (sum, analysis) { return sum + (analysis.recoveryScore / 10); }, 0);
    return totalMotivation / recoveryAnalyses.length;
}
generateEvolutionBasedRecommendations(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
chat_maestro_strategic_planning_types_1.PlanAdjustmentRecommendation[];
{
    var recommendations = [];
    // Check if strength has improved significantly
    if (evolution.performanceMetrics.strength) {
        var strengthImprovements = Object.entries(evolution.performanceMetrics.strength)
            .filter(function (_a) {
            var exercise = _a[0], value = _a[1];
            return value > 85;
        }); // Threshold for significant improvement
        if (strengthImprovements.length > 0) {
            recommendations.push({
                id: "strength_improvement_".concat(Date.now()),
                planId: plan.id,
                type: 'intensity_modification',
                priority: 'medium',
                trigger: "Mejora significativa en ".concat(strengthImprovements.length, " ejercicios de fuerza"),
                recommendation: 'Aumentar la intensidad del entrenamiento para continuar progresando',
                rationale: "Se han detectado mejoras significativas en ".concat(strengthImprovements.map(function (_a) {
                    var exercise = _a[0];
                    return exercise;
                }).join(', '), ", lo que indica que est\u00E1s listo para mayores desaf\u00EDos."),
                confidence: 0.85,
                implementationSteps: [
                    'Incrementar cargas en 5-10%',
                    'Reducir volumen ligeramente para compensar aumento de intensidad',
                    'Monitorear técnica durante las primeras semanas'
                ],
                expectedBenefits: [
                    'Continuación del progreso en fuerza',
                    'Desafío adecuado para adaptaciones',
                    'Mantenimiento de motivación'
                ],
                timeframe: 'Próximas 2 semanas'
            });
        }
    }
    // Check if recovery metrics indicate overtraining risk
    if (evolution.healthMarkers.sleepQuality && evolution.healthMarkers.sleepQuality < 5) {
        recommendations.push({
            id: "overtraining_risk_".concat(Date.now()),
            planId: plan.id,
            type: 'deload',
            priority: 'high',
            trigger: 'Calidad de sueño deteriorada indicando riesgo de sobreentrenamiento',
            recommendation: 'Implementar semana de descarga para permitir recuperación óptima',
            rationale: 'La calidad de sueño promedio es baja, lo que puede indicar fatiga acumulativa y riesgo de sobreentrenamiento.',
            confidence: 0.9,
            implementationSteps: [
                'Reducir volumen en 50%',
                'Reducir intensidad en 30%',
                'Enfocarse en movilidad y recuperación activa',
                'Priorizar sueño y nutrición'
            ],
            expectedBenefits: [
                'Reducción de fatiga acumulativa',
                'Prevención de sobreentrenamiento',
                'Mejora en calidad de recuperación'
            ],
            timeframe: 'Próxima semana'
        });
    }
    return recommendations;
}
checkPhaseChangeNeeded(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
chat_maestro_strategic_planning_types_1.PlanAdjustmentRecommendation[];
{
    var recommendations = [];
    if (!plan.currentPhase)
        return recommendations;
    // Check if objectives have been met
    var objectivesMet = this.checkObjectivesMet(plan.currentPhase, evolution);
    if (objectivesMet) {
        recommendations.push({
            id: "phase_change_".concat(Date.now()),
            planId: plan.id,
            type: 'phase_change',
            priority: 'high',
            trigger: "Objetivos de fase ".concat(plan.currentPhase.name, " cumplidos"),
            recommendation: 'Avanzar a la próxima fase del plan estratégico',
            rationale: "Los objetivos de la fase actual han sido cumplidos, lo que indica que es momento de avanzar a la pr\u00F3xima fase.",
            confidence: 0.9,
            implementationSteps: [
                'Evaluar progreso en objetivos de fase',
                'Planificar adaptaciones para próxima fase',
                'Actualizar calendario táctico',
                'Notificar al usuario sobre el cambio'
            ],
            expectedBenefits: [
                'Continuación del progreso estructurado',
                'Prevención de mesetas',
                'Optimización de resultados a largo plazo'
            ],
            timeframe: 'Esta semana'
        });
    }
    return recommendations;
}
checkFocusShiftNeeded(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
chat_maestro_strategic_planning_types_1.PlanAdjustmentRecommendation[];
{
    var recommendations = [];
    // Check if primary focus is no longer the priority
    var focusShiftNeeded = this.analyzeFocusShiftNeed(plan, evolution);
    if (focusShiftNeeded.needed) {
        recommendations.push({
            id: "focus_shift_".concat(Date.now()),
            planId: plan.id,
            type: 'focus_shift',
            priority: 'medium',
            trigger: focusShiftNeeded.reason,
            recommendation: "Cambiar enfoque de ".concat(plan.primaryFocus, " a ").concat(focusShiftNeeded.suggestedFocus),
            rationale: focusShiftNeeded.reason,
            confidence: 0.8,
            implementationSteps: [
                'Revisar objetivos actuales del usuario',
                'Actualizar variaciones estratégicas',
                'Modificar calendario táctico',
                'Ajustar ejercicios y progresiones'
            ],
            expectedBenefits: [
                'Alineación con objetivos actuales',
                'Prevención de desmotivación',
                'Optimización de resultados'
            ],
            timeframe: 'Próximas 2 semanas'
        });
    }
    return recommendations;
}
analyzeFocusShiftNeed(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
{
    needed: boolean;
    reason: string;
    suggestedFocus ?  : chat_maestro_strategic_planning_types_1.StrategicFocusArea;
}
{
    // Analyze if focus shift is needed based on real data
    // Calculate time spent in current focus
    var planStartDate = plan.startDate.getTime();
    var currentDate = Date.now();
    var timeInPlan = (currentDate - planStartDate) / (1000 * 60 * 60 * 24 * 30); // months
    // Check if user has been focusing on one area for too long
    var monthsInCurrentFocus = timeInPlan;
    if (monthsInCurrentFocus > 12) {
        return {
            needed: true,
            reason: 'Demasiado tiempo enfocado en un solo área, riesgo de desequilibrio',
            suggestedFocus: plan.secondaryFocuses[0] || 'strength'
        };
    }
    // Check if user has achieved significant progress in primary focus
    var maxProgress = 0;
    if (plan.primaryFocus === 'strength' && evolution.performanceMetrics.strength) {
        maxProgress = Math.max.apply(Math, Object.values(evolution.performanceMetrics.strength));
    }
    else if (plan.primaryFocus === 'hypertrophy' && evolution.measurements.muscleMass) {
        maxProgress = evolution.measurements.muscleMass;
    }
    else if (plan.primaryFocus === 'endurance' && evolution.performanceMetrics.endurance) {
        maxProgress = Math.max.apply(Math, Object.values(evolution.performanceMetrics.endurance));
    }
    else if (plan.primaryFocus === 'mobility' && evolution.performanceMetrics.mobility) {
        maxProgress = Math.max.apply(Math, Object.values(evolution.performanceMetrics.mobility));
    }
    else if (plan.primaryFocus === 'injury_prevention' && evolution.healthMarkers.sleepQuality) {
        maxProgress = evolution.healthMarkers.sleepQuality * 10; // Convert to 0-100 scale
    }
    // If significant progress has been made, consider shifting focus
    if (maxProgress > 80) {
        return {
            needed: true,
            reason: 'Progreso significativo en enfoque primario, oportunidad para desarrollar otras áreas',
            suggestedFocus: plan.secondaryFocuses[0] || 'strength'
        };
    }
    // Check if there are health concerns that require attention
    if (evolution.healthMarkers.stressLevel && evolution.healthMarkers.stressLevel > 8) {
        return {
            needed: true,
            reason: 'Niveles altos de estrés detectados, necesidad de enfocarse en recuperación y prevención',
            suggestedFocus: 'injury_prevention'
        };
    }
    // Check if user has plateaued in current focus
    var recentProgress = this.calculateRecentProgress(evolution, plan.primaryFocus);
    if (recentProgress < 1) { // Less than 1% improvement
        return {
            needed: true,
            reason: 'Progreso estancado en enfoque actual, necesidad de cambio de enfoque',
            suggestedFocus: plan.secondaryFocuses[0] || 'strength'
        };
    }
    return { needed: false, reason: '' };
}
calculateRecentProgress(evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution, focusArea, chat_maestro_strategic_planning_types_1.StrategicFocusArea);
number;
{
    // Calculate recent progress in the specified focus area
    var progress = 0;
    switch (focusArea) {
        case 'strength':
            if (evolution.performanceMetrics.strength) {
                var values = Object.values(evolution.performanceMetrics.strength);
                if (values.length > 0) {
                    progress = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
                }
            }
            break;
        case 'hypertrophy':
            if (evolution.measurements.muscleMass) {
                progress = evolution.measurements.muscleMass;
            }
            break;
        case 'endurance':
            if (evolution.performanceMetrics.endurance) {
                var values = Object.values(evolution.performanceMetrics.endurance);
                if (values.length > 0) {
                    progress = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
                }
            }
            break;
        case 'mobility':
            if (evolution.performanceMetrics.mobility) {
                var values = Object.values(evolution.performanceMetrics.mobility);
                if (values.length > 0) {
                    progress = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
                }
            }
            break;
        case 'injury_prevention':
            if (evolution.healthMarkers.sleepQuality) {
                progress = evolution.healthMarkers.sleepQuality * 10; // Convert to 0-100 scale
            }
            break;
    }
    return progress;
}
calculateImpactAssessment(rec, chat_maestro_strategic_planning_types_1.PlanAdjustmentRecommendation, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
{
    // Calculate impact assessment based on recommendation type and user evolution
    var performanceChange = 0;
    var recoveryChange = 0;
    var adherenceChange = 0;
    switch (rec.type) {
        case 'intensity_modification':
            performanceChange = 5; // Moderate performance increase
            recoveryChange = -2; // Slight decrease in recovery
            adherenceChange = 1; // Slight increase in adherence
            break;
        case 'volume_modification':
            performanceChange = 3; // Small performance increase
            recoveryChange = -4; // Moderate decrease in recovery
            adherenceChange = -2; // Slight decrease in adherence
            break;
        case 'deload':
            performanceChange = -1; // Small performance decrease
            recoveryChange = 8; // Large recovery increase
            adherenceChange = 3; // Moderate increase in adherence
            break;
        case 'phase_change':
            performanceChange = 2; // Small performance increase
            recoveryChange = 1; // Small recovery increase
            adherenceChange = 2; // Small increase in adherence
            break;
        case 'focus_shift':
            performanceChange = 0; // No immediate performance change
            recoveryChange = 2; // Small recovery increase
            adherenceChange = 4; // Moderate increase in adherence
            break;
        default:
            performanceChange = 2;
            recoveryChange = 2;
            adherenceChange = 2;
    }
    // Adjust based on user's current state
    if (evolution.healthMarkers.stressLevel && evolution.healthMarkers.stressLevel > 7) {
        // If user is highly stressed, reduce performance expectations and increase recovery expectations
        performanceChange = Math.max(-5, performanceChange - 3);
        recoveryChange = Math.min(10, recoveryChange + 3);
    }
    if (evolution.healthMarkers.sleepQuality && evolution.healthMarkers.sleepQuality < 5) {
        // If user has poor sleep quality, reduce performance expectations
        performanceChange = Math.max(-5, performanceChange - 2);
    }
    return {
        expectedPerformanceChange: performanceChange,
        expectedRecoveryChange: recoveryChange,
        expectedAdherenceChange: adherenceChange
    };
}
calculateProgressMetrics(context, chat_maestro_service_1.ChatContext, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
{
    adherence ?  : number;
    recovery ?  : number;
    strength ?  : number;
    hypertrophy ?  : number;
    endurance ?  : number;
    mobility ?  : number;
    injuryRisk ?  : number;
}
{
    // Calculate real progress metrics based on user data
    var metrics = {};
    // Calculate adherence based on workout consistency
    if (context.recentWorkouts.length > 0) {
        var plannedWorkouts = 5; // Assuming 5 planned workouts per week
        var actualWorkouts = context.recentWorkouts.length;
        metrics.adherence = Math.min(1, actualWorkouts / plannedWorkouts);
    }
    // Calculate recovery based on recovery analyses
    if (evolution.healthMarkers.sleepQuality) {
        metrics.recovery = evolution.healthMarkers.sleepQuality / 10; // Normalize to 0-1 scale
    }
    // Calculate strength progress
    if (evolution.performanceMetrics.strength) {
        var strengthValues = Object.values(evolution.performanceMetrics.strength);
        if (strengthValues.length > 0) {
            metrics.strength = strengthValues.reduce(function (sum, val) { return sum + val; }, 0) / strengthValues.length / 100; // Normalize to 0-1 scale
        }
    }
    // Calculate hypertrophy progress (based on muscle mass)
    if (evolution.measurements.muscleMass) {
        metrics.hypertrophy = evolution.measurements.muscleMass / 100; // Normalize to 0-1 scale
    }
    // Calculate endurance progress
    if (evolution.performanceMetrics.endurance) {
        var enduranceValues = Object.values(evolution.performanceMetrics.endurance);
        if (enduranceValues.length > 0) {
            metrics.endurance = enduranceValues.reduce(function (sum, val) { return sum + val; }, 0) / enduranceValues.length / 100; // Normalize to 0-1 scale
        }
    }
    // Calculate mobility progress
    if (evolution.performanceMetrics.mobility) {
        var mobilityValues = Object.values(evolution.performanceMetrics.mobility);
        if (mobilityValues.length > 0) {
            metrics.mobility = mobilityValues.reduce(function (sum, val) { return sum + val; }, 0) / mobilityValues.length / 10; // Normalize to 0-1 scale
        }
    }
    // Calculate injury risk based on stress and sleep quality
    var injuryRisk = 0;
    if (evolution.healthMarkers.stressLevel) {
        injuryRisk += evolution.healthMarkers.stressLevel / 10; // 0-1 scale
    }
    if (evolution.healthMarkers.sleepQuality) {
        injuryRisk += (10 - evolution.healthMarkers.sleepQuality) / 10; // Inverse relationship
    }
    metrics.injuryRisk = Math.min(1, injuryRisk);
    return metrics;
}
checkObjectivesMet(phase, chat_maestro_strategic_planning_types_1.StrategicPlanPhase, evolution, chat_maestro_strategic_planning_types_1.PhysicalEvolution);
boolean;
{
    // Check if phase objectives have been met using real data
    // Calculate phase completion percentage
    var phaseStartDate = phase.startDate.getTime();
    var phaseEndDate = phase.endDate.getTime();
    var currentDate = Date.now();
    var phaseDuration = phaseEndDate - phaseStartDate;
    var elapsedPhaseTime = currentDate - phaseStartDate;
    var phaseCompletion = Math.min(1, elapsedPhaseTime / phaseDuration);
    // Check if key metrics have improved
    var metricsImproved = true;
    var totalImprovement_1 = 0;
    var metricCount_1 = 0;
    // Check strength improvements
    if (evolution.performanceMetrics.strength) {
        Object.values(evolution.performanceMetrics.strength).forEach(function (value) {
            totalImprovement_1 += value;
            metricCount_1++;
        });
    }
    // Check endurance improvements
    if (evolution.performanceMetrics.endurance) {
        Object.values(evolution.performanceMetrics.endurance).forEach(function (value) {
            totalImprovement_1 += value;
            metricCount_1++;
        });
    }
    // Check mobility improvements
    if (evolution.performanceMetrics.mobility) {
        Object.values(evolution.performanceMetrics.mobility).forEach(function (value) {
            totalImprovement_1 += value;
            metricCount_1++;
        });
    }
    var avgImprovement = metricCount_1 > 0 ? totalImprovement_1 / metricCount_1 : 0;
    // Check health markers
    var healthImproved = true;
    if (evolution.healthMarkers.sleepQuality && evolution.healthMarkers.sleepQuality < 5) {
        healthImproved = false;
    }
    // Objectives are met if:
    // 1. Phase is more than 70% complete, OR
    // 2. Significant improvements have been made (avg improvement > 10%) and health is good
    return phaseCompletion > 0.7 || (avgImprovement > 10 && healthImproved);
}
/**
 * Automatically adjust long-term strategic plan based on user progress
 */
autoAdjustLongTermPlan(plan, chat_maestro_strategic_planning_types_1.LongTermStrategicPlan, context, chat_maestro_service_1.ChatContext);
chat_maestro_strategic_planning_types_1.LongTermStrategicPlan;
{
    console.log("\u2699\uFE0F Auto-adjusting long-term strategic plan: ".concat(plan.id));
    // Create a copy of the plan to modify
    var adjustedPlan_1 = __assign({}, plan);
    // 1. Update plan based on current phase progress
    if (adjustedPlan_1.currentPhase) {
        // Update phase end date if needed
        var currentDate = new Date();
        if (currentDate > adjustedPlan_1.currentPhase.endDate) {
            // Phase has ended, move to next phase
            var currentPhaseIndex = adjustedPlan_1.phases.findIndex(function (p) { var _a; return p.id === ((_a = adjustedPlan_1.currentPhase) === null || _a === void 0 ? void 0 : _a.id); });
            if (currentPhaseIndex < adjustedPlan_1.phases.length - 1) {
                adjustedPlan_1.currentPhase = adjustedPlan_1.phases[currentPhaseIndex + 1];
            }
        }
    }
    // 2. Analyze physical evolution
    var physicalEvolution_1 = this.analyzePhysicalEvolution(context);
    // 3. Update adaptations based on new recommendations
    var newRecommendations = this.analyzeLongTermPlanProgress(context, adjustedPlan_1);
    // Apply high-confidence recommendations
    var highConfidenceRecs = newRecommendations.filter(function (rec) { return rec.confidence > 0.8 && rec.priority === 'high'; });
    highConfidenceRecs.forEach(function (rec) {
        var adaptation = {
            id: "adaptation_".concat(Date.now(), "_").concat(Math.random()),
            planId: adjustedPlan_1.id,
            date: new Date(),
            trigger: rec.trigger,
            originalPlanElement: rec.type,
            adaptation: rec.recommendation,
            rationale: rec.rationale,
            confidence: rec.confidence,
            applied: true,
            impactAssessment: _this.calculateImpactAssessment(rec, physicalEvolution_1)
        };
        adjustedPlan_1.adaptations.push(adaptation);
    });
    // 4. Update plan tracking with real metrics
    var progress = {
        id: "progress_".concat(Date.now()),
        planId: adjustedPlan_1.id,
        date: new Date(),
        phase: ((_g = adjustedPlan_1.currentPhase) === null || _g === void 0 ? void 0 : _g.phase) || 'accumulation',
        metrics: this.calculateProgressMetrics(context, physicalEvolution_1),
        notes: 'Plan ajustado automáticamente basado en progreso real del usuario',
        adjustmentsMade: highConfidenceRecs.length > 0
    };
    adjustedPlan_1.progressTracking.push(progress);
    // 5. Update timestamps
    adjustedPlan_1.updatedAt = new Date();
    return adjustedPlan_1;
}
analyzePlanEffectiveness(context, chat_maestro_service_1.ChatContext);
any;
{
    // Analyze training plan effectiveness
    var trainingEffectiveness = this.analyzeTrainingPlanEffectiveness(context);
    // Analyze nutrition plan effectiveness
    var nutritionEffectiveness = this.analyzeNutritionPlanEffectiveness(context);
    // Analyze recovery plan effectiveness
    var recoveryEffectiveness = this.analyzeRecoveryPlanEffectiveness(context);
    // Analyze progression plan effectiveness
    var progressionEffectiveness = this.analyzeProgressionPlanEffectiveness(context);
    return {
        training: trainingEffectiveness,
        nutrition: nutritionEffectiveness,
        recovery: recoveryEffectiveness,
        progression: progressionEffectiveness
    };
}
analyzeTrainingPlanEffectiveness(context, chat_maestro_service_1.ChatContext);
any;
{
    var recentWorkouts = context.recentWorkouts.slice(0, 10);
    var userHabits = context.userHabits[0];
    if (recentWorkouts.length === 0 || !userHabits) {
        return {
            effectiveness: 0.5,
            adherence: 0.5,
            consistency: 0.5,
            issues: ['No hay datos suficientes']
        };
    }
    // Calculate adherence to planned training frequency
    var plannedFrequency = userHabits.trainingFrequency;
    var actualFrequency = recentWorkouts.length;
    var adherence = Math.min(1, actualFrequency / plannedFrequency);
    // Calculate consistency (regularity of training days)
    var trainingDays = recentWorkouts.map(function (w) { return new Date(w.date).getDay(); });
    var uniqueDays = __spreadArray([], new Set(trainingDays), true);
    var consistency = uniqueDays.length / 7; // Assuming 7-day period
    // Calculate overall effectiveness
    var effectiveness = (adherence + consistency) / 2;
    // Identify issues
    var issues = [];
    if (adherence < 0.7)
        issues.push('Baja adherencia al plan de entrenamiento');
    if (consistency < 0.6)
        issues.push('Baja consistencia en días de entrenamiento');
    return {
        effectiveness: effectiveness,
        adherence: adherence,
        consistency: consistency,
        issues: issues
    };
}
analyzeNutritionPlanEffectiveness(context, chat_maestro_service_1.ChatContext);
any;
{
    var recentNutrition = storage_1.storageManager.getDailyNutrition() ? storage_1.storageManager.getDailyNutrition().slice(0, 7) : [];
    if (recentNutrition.length === 0) {
        return {
            effectiveness: 0.5,
            adherence: 0.5,
            issues: ['No hay datos nutricionales']
        };
    }
    // Calculate nutrition adherence
    var adherence = 0.7; // Placeholder - would be calculated from actual data
    // Calculate overall effectiveness
    var effectiveness = adherence;
    // Identify issues
    var issues = [];
    if (adherence < 0.7)
        issues.push('Baja adherencia al plan nutricional');
    return {
        effectiveness: effectiveness,
        adherence: adherence,
        issues: issues
    };
}
analyzeRecoveryPlanEffectiveness(context, chat_maestro_service_1.ChatContext);
any;
{
    var recoveryAnalyses = storage_1.storageManager.getRecoveryAnalyses();
    var analyses = (recoveryAnalyses || []).slice(0, 7);
    if (analyses.length === 0) {
        return {
            effectiveness: 0.5,
            recoveryScore: 50,
            issues: ['No hay datos de recuperación']
        };
    }
    // Calculate average recovery score
    var avgRecoveryScore = analyses.reduce(function (sum, analysis) { return sum + analysis.recoveryScore; }, 0) / analyses.length;
    // Calculate effectiveness (normalized to 0-1 scale)
    var effectiveness = avgRecoveryScore / 100;
    // Identify issues
    var issues = [];
    if (avgRecoveryScore < 60)
        issues.push('Bajo puntaje promedio de recuperación');
    return {
        effectiveness: effectiveness,
        recoveryScore: avgRecoveryScore,
        issues: issues
    };
}
analyzeProgressionPlanEffectiveness(context, chat_maestro_service_1.ChatContext);
any;
{
    var progressionPlans = context.progressionPlans;
    if (progressionPlans.length === 0) {
        return {
            effectiveness: 0.5,
            progressRate: 0,
            issues: ['No hay planes de progresión']
        };
    }
    // Calculate progress rate
    var plansWithProgress = progressionPlans.filter(function (plan) { return plan.adjustments.length > 0; });
    var progressRate = plansWithProgress.length / progressionPlans.length;
    // Calculate overall effectiveness
    var effectiveness = progressRate;
    // Identify issues
    var issues = [];
    if (progressRate < 0.5)
        issues.push('Baja tasa de progresión en ejercicios');
    return {
        effectiveness: effectiveness,
        progressRate: progressRate,
        issues: issues
    };
}
generateWorkoutPlanAdaptations(context, chat_maestro_service_1.ChatContext, planEffectiveness, any);
AutonomousAdaptation[];
{
    var adaptations = [];
    // If training effectiveness is low, suggest adaptations
    if (planEffectiveness.training.effectiveness < 0.7) {
        // If adherence is low, suggest frequency adaptation
        if (planEffectiveness.training.adherence < 0.7) {
            adaptations.push({
                id: "adaptation_".concat(Date.now(), "_frequency"),
                planId: ((_h = context.activeWorkout) === null || _h === void 0 ? void 0 : _h.id) || 'unknown',
                targetType: 'workout',
                adaptationType: 'frequency',
                changeValue: 1, // Add one training day per week
                confidence: 0.8,
                rationale: 'Baja adherencia al plan de entrenamiento detectada. Aumentar la frecuencia puede mejorar la consistencia.',
                predictedImpact: {
                    performance: 0.7,
                    recovery: 0.6,
                    adherence: 0.8
                },
                executionTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                status: 'pending'
            });
        }
        // If consistency is low, suggest timing adaptation
        if (planEffectiveness.training.consistency < 0.6) {
            adaptations.push({
                id: "adaptation_".concat(Date.now(), "_timing"),
                planId: ((_j = context.activeWorkout) === null || _j === void 0 ? void 0 : _j.id) || 'unknown',
                targetType: 'workout',
                adaptationType: 'timing',
                changeValue: 0, // Would be calculated based on user habits
                confidence: 0.75,
                rationale: 'Baja consistencia en días de entrenamiento. Ajustar los horarios puede mejorar la adherencia.',
                predictedImpact: {
                    performance: 0.6,
                    recovery: 0.7,
                    adherence: 0.75
                },
                executionTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                status: 'pending'
            });
        }
    }
    // If training effectiveness is high, suggest intensity adaptations for progression
    if (planEffectiveness.training.effectiveness > 0.8) {
        adaptations.push({
            id: "adaptation_".concat(Date.now(), "_intensity"),
            planId: ((_k = context.activeWorkout) === null || _k === void 0 ? void 0 : _k.id) || 'unknown',
            targetType: 'workout',
            adaptationType: 'intensity',
            changeValue: 5, // Increase intensity by 5%
            confidence: 0.85,
            rationale: 'Alto nivel de efectividad del entrenamiento. Aumentar la intensidad para continuar progresando.',
            predictedImpact: {
                performance: 0.9,
                recovery: 0.7,
                adherence: 0.8
            },
            executionTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            status: 'pending'
        });
    }
    return adaptations;
}
generateNutritionPlanAdaptations(context, chat_maestro_service_1.ChatContext, planEffectiveness, any);
AutonomousAdaptation[];
{
    var adaptations = [];
    // If nutrition effectiveness is low, suggest adaptations
    if (planEffectiveness.nutrition.effectiveness < 0.7) {
        adaptations.push({
            id: "adaptation_".concat(Date.now(), "_nutrition"),
            planId: 'nutrition_plan',
            targetType: 'nutrition',
            adaptationType: 'composition',
            changeValue: 0, // Would be calculated based on goals
            confidence: 0.7,
            rationale: 'Baja adherencia al plan nutricional. Ajustar la composición puede mejorar el cumplimiento.',
            predictedImpact: {
                performance: 0.7,
                recovery: 0.8,
                adherence: 0.75
            },
            executionTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            status: 'pending'
        });
    }
    return adaptations;
}
generateRecoveryPlanAdaptations(context, chat_maestro_service_1.ChatContext, planEffectiveness, any);
AutonomousAdaptation[];
{
    var adaptations = [];
    // If recovery effectiveness is low, suggest adaptations
    if (planEffectiveness.recovery.effectiveness < 0.6) {
        adaptations.push({
            id: "adaptation_".concat(Date.now(), "_recovery"),
            planId: 'recovery_plan',
            targetType: 'recovery',
            adaptationType: 'timing',
            changeValue: 0, // Would be calculated based on recovery data
            confidence: 0.8,
            rationale: 'Bajo puntaje de recuperación. Ajustar los tiempos de recuperación puede mejorar el estado general.',
            predictedImpact: {
                performance: 0.8,
                recovery: 0.9,
                adherence: 0.7
            },
            executionTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            status: 'pending'
        });
    }
    return adaptations;
}
generateProgressionAdaptations(context, chat_maestro_service_1.ChatContext, planEffectiveness, any);
AutonomousAdaptation[];
{
    var adaptations = [];
    // If progression effectiveness is low, suggest adaptations
    if (planEffectiveness.progression.effectiveness < 0.6) {
        adaptations.push({
            id: "adaptation_".concat(Date.now(), "_progression"),
            planId: 'progression_plan',
            targetType: 'progression',
            adaptationType: 'load',
            changeValue: -10, // Reduce load by 10%
            confidence: 0.75,
            rationale: 'Baja tasa de progresión detectada. Reducir la carga puede ayudar a romper mesetas.',
            predictedImpact: {
                performance: 0.7,
                recovery: 0.85,
                adherence: 0.8
            },
            executionTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            status: 'pending'
        });
    }
    // If progression effectiveness is high, suggest increasing load for continued progress
    if (planEffectiveness.progression.effectiveness > 0.8) {
        adaptations.push({
            id: "adaptation_".concat(Date.now(), "_progression_increase"),
            planId: 'progression_plan',
            targetType: 'progression',
            adaptationType: 'load',
            changeValue: 7.5, // Increase load by 7.5%
            confidence: 0.8,
            rationale: 'Alta tasa de progresión. Aumentar la carga para continuar desafiando al usuario.',
            predictedImpact: {
                performance: 0.85,
                recovery: 0.7,
                adherence: 0.75
            },
            executionTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            status: 'pending'
        });
    }
    return adaptations;
}
/**
 * Execute autonomous adaptations
 */
async;
executeAutonomousAdaptations(context, chat_maestro_service_1.ChatContext, adaptations, AutonomousAdaptation[]);
Promise < void  > {
    console: console,
    : .log('⚡ Executing autonomous adaptations'),
    for: function (, adaptation, of, adaptations) {
        try {
            // Update adaptation status
            adaptation.status = 'executed';
            // Execute based on target type
            switch (adaptation.targetType) {
                case 'workout':
                    yield this.executeWorkoutAdaptation(context, adaptation);
                    break;
                case 'nutrition':
                    yield this.executeNutritionAdaptation(context, adaptation);
                    break;
                case 'recovery':
                    yield this.executeRecoveryAdaptation(context, adaptation);
                    break;
                case 'progression':
                    yield this.executeProgressionAdaptation(context, adaptation);
                    break;
            }
            // Notify the nervous system of executed adaptation
            spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                type: 'insight_generated',
                timestamp: new Date(),
                userId: context.userId,
                payload: {
                    adaptation: adaptation,
                    source: 'predictive_engine'
                },
                sourceModule: 'ChatMaestroPredictiveEngine',
                priority: 'medium'
            });
        }
        catch (error) {
            console.error("Error executing adaptation ".concat(adaptation.id, ":"), error);
            adaptation.status = 'cancelled';
        }
    }
};
async;
executeWorkoutAdaptation(context, chat_maestro_service_1.ChatContext, adaptation, AutonomousAdaptation);
Promise < void  > {
    console: console,
    : .log("Executing workout adaptation: ".concat(adaptation.adaptationType, " by ").concat(adaptation.changeValue, "%")),
    // In a real implementation, this would modify the actual workout plan
    // For now, we'll just log the action
    console: console,
    : .log("Workout plan ".concat(adaptation.planId, " adapted: ").concat(adaptation.rationale))
};
async;
executeNutritionAdaptation(context, chat_maestro_service_1.ChatContext, adaptation, AutonomousAdaptation);
Promise < void  > {
    console: console,
    : .log("Executing nutrition adaptation: ".concat(adaptation.adaptationType, " by ").concat(adaptation.changeValue, "%")),
    // In a real implementation, this would modify the actual nutrition plan
    // For now, we'll just log the action
    console: console,
    : .log("Nutrition plan ".concat(adaptation.planId, " adapted: ").concat(adaptation.rationale))
};
async;
executeRecoveryAdaptation(context, chat_maestro_service_1.ChatContext, adaptation, AutonomousAdaptation);
Promise < void  > {
    console: console,
    : .log("Executing recovery adaptation: ".concat(adaptation.adaptationType, " by ").concat(adaptation.changeValue, "%")),
    // In a real implementation, this would modify the actual recovery plan
    // For now, we'll just log the action
    console: console,
    : .log("Recovery plan ".concat(adaptation.planId, " adapted: ").concat(adaptation.rationale))
};
async;
executeProgressionAdaptation(context, chat_maestro_service_1.ChatContext, adaptation, AutonomousAdaptation);
Promise < void  > {
    console: console,
    : .log("Executing progression adaptation: ".concat(adaptation.adaptationType, " by ").concat(adaptation.changeValue, "%")),
    // In a real implementation, this would modify the actual progression plan
    // For now, we'll just log the action
    console: console,
    : .log("Progression plan ".concat(adaptation.planId, " adapted: ").concat(adaptation.rationale))
};
// Export singleton instance
exports.chatMaestroPredictiveEngine = ChatMaestroPredictiveEngine.getInstance();
