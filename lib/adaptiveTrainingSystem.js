"use strict";
/**
 * Adaptive Training System - Sistema de Entrenamiento Adaptativo
 * Ajusta automáticamente parámetros de entrenamiento basado en métricas de rendimiento
 */
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
exports.adaptiveTrainingSystem = exports.AdaptiveTrainingSystem = void 0;
var AdaptiveTrainingSystem = /** @class */ (function () {
    function AdaptiveTrainingSystem() {
        this.metricsHistory = [];
        this.adjustmentHistory = [];
        this.baselineMetrics = new Map();
        this.initializeBaselines();
    }
    /**
     * Registra métricas de una sesión de entrenamiento
     */
    AdaptiveTrainingSystem.prototype.recordSessionMetrics = function (metrics) {
        this.metricsHistory.push(metrics);
        this.updateBaselines(metrics);
        console.log("\uD83D\uDCCA M\u00E9tricas registradas para sesi\u00F3n ".concat(metrics.sessionId));
    };
    /**
     * Realiza análisis semanal y genera ajustes automáticos
     */
    AdaptiveTrainingSystem.prototype.performWeeklyAnalysis = function (currentWorkoutPlan, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var lastWeekMetrics, performanceAnalysis, recoveryAnalysis, adherenceAnalysis, overallReadiness, adjustments, periodizationAction, assessment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('🔄 Iniciando análisis semanal adaptativo...');
                        lastWeekMetrics = this.getLastWeekMetrics();
                        performanceAnalysis = this.analyzePerformanceTrends(lastWeekMetrics);
                        recoveryAnalysis = this.analyzeRecoveryStatus(lastWeekMetrics);
                        adherenceAnalysis = this.analyzeAdherence(lastWeekMetrics);
                        overallReadiness = this.calculateReadiness(performanceAnalysis, recoveryAnalysis, adherenceAnalysis);
                        return [4 /*yield*/, this.generateAdjustments(lastWeekMetrics, currentWorkoutPlan, overallReadiness)];
                    case 1:
                        adjustments = _a.sent();
                        periodizationAction = this.evaluatePeriodization(performanceAnalysis, recoveryAnalysis);
                        assessment = {
                            weekNumber: Math.ceil(this.metricsHistory.length / 7),
                            overallReadiness: overallReadiness,
                            fatigueIndex: recoveryAnalysis.fatigueIndex,
                            performanceIndex: performanceAnalysis.trendScore,
                            adherenceRate: adherenceAnalysis.adherenceRate,
                            progressRate: performanceAnalysis.progressRate,
                            recommendedAdjustments: adjustments,
                            periodizationRecommendation: periodizationAction,
                            deloadRecommended: this.shouldDeload(recoveryAnalysis, performanceAnalysis),
                            intensificationReady: this.canIntensify(performanceAnalysis, recoveryAnalysis)
                        };
                        console.log("\u2705 An\u00E1lisis completado. Readiness: ".concat(overallReadiness, "%"));
                        return [2 /*return*/, assessment];
                }
            });
        });
    };
    /**
     * Aplica ajustes automáticos al plan de entrenamiento
     */
    AdaptiveTrainingSystem.prototype.applyAutomaticAdjustments = function (workoutPlan, adjustments) {
        var adjustedPlan = JSON.parse(JSON.stringify(workoutPlan));
        for (var _i = 0, adjustments_1 = adjustments; _i < adjustments_1.length; _i++) {
            var adjustment = adjustments_1[_i];
            this.applyAdjustmentToPlan(adjustedPlan, adjustment);
            this.adjustmentHistory.push(adjustment);
        }
        adjustedPlan.lastAdjusted = new Date();
        adjustedPlan.adjustmentCount = (adjustedPlan.adjustmentCount || 0) + adjustments.length;
        return adjustedPlan;
    };
    AdaptiveTrainingSystem.prototype.getLastWeekMetrics = function () {
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return this.metricsHistory.filter(function (metrics) { return metrics.date >= oneWeekAgo; });
    };
    AdaptiveTrainingSystem.prototype.analyzePerformanceTrends = function (metrics) {
        if (metrics.length === 0) {
            return { trendScore: 50, progressRate: 0, isImproving: false };
        }
        var avgRPE = metrics.reduce(function (sum, m) { return sum + m.rpe; }, 0) / metrics.length;
        var avgRIR = metrics.reduce(function (sum, m) { return sum + m.rir; }, 0) / metrics.length;
        // Analizar tendencia de peso/volumen
        var volumeTrend = this.calculateVolumeTrend(metrics);
        var intensityTrend = this.calculateIntensityTrend(metrics);
        var trendScore = Math.min(100, Math.max(0, (volumeTrend * 0.4) + (intensityTrend * 0.3) + ((10 - avgRPE) * 5) + (avgRIR * 5)));
        return {
            trendScore: trendScore,
            progressRate: volumeTrend > 0 ? volumeTrend * 10 : 0,
            isImproving: trendScore > 60,
            avgRPE: avgRPE,
            avgRIR: avgRIR,
            volumeTrend: volumeTrend,
            intensityTrend: intensityTrend
        };
    };
    AdaptiveTrainingSystem.prototype.analyzeRecoveryStatus = function (metrics) {
        if (metrics.length === 0) {
            return { fatigueIndex: 50, recoveryQuality: 50 };
        }
        var avgSleep = metrics.reduce(function (sum, m) { return sum + m.sleepQuality; }, 0) / metrics.length;
        var avgStress = metrics.reduce(function (sum, m) { return sum + m.stressLevel; }, 0) / metrics.length;
        var avgSymptoms = metrics.reduce(function (sum, m) { return sum + m.muscleSymptoms; }, 0) / metrics.length;
        var avgHRV = metrics.reduce(function (sum, m) { return sum + m.heartRateData.hrv; }, 0) / metrics.length;
        var fatigueIndex = Math.min(100, Math.max(0, (avgStress * 8) + (avgSymptoms * 6) + ((10 - avgSleep) * 6) + ((50 - avgHRV) * 0.8)));
        var recoveryQuality = 100 - fatigueIndex;
        return {
            fatigueIndex: fatigueIndex,
            recoveryQuality: recoveryQuality,
            avgSleep: avgSleep,
            avgStress: avgStress,
            avgSymptoms: avgSymptoms,
            avgHRV: avgHRV
        };
    };
    AdaptiveTrainingSystem.prototype.analyzeAdherence = function (metrics) {
        if (metrics.length === 0) {
            return { adherenceRate: 100, consistencyScore: 100 };
        }
        var adherenceRate = metrics.reduce(function (sum, m) { return sum + m.adherence; }, 0) / metrics.length;
        var motivationTrend = this.calculateMotivationTrend(metrics);
        var consistencyScore = Math.min(100, adherenceRate + motivationTrend);
        return {
            adherenceRate: adherenceRate,
            consistencyScore: consistencyScore,
            motivationTrend: motivationTrend
        };
    };
    AdaptiveTrainingSystem.prototype.calculateReadiness = function (performance, recovery, adherence) {
        return Math.round((performance.trendScore * 0.35) +
            (recovery.recoveryQuality * 0.40) +
            (adherence.consistencyScore * 0.25));
    };
    AdaptiveTrainingSystem.prototype.generateAdjustments = function (metrics, currentPlan, readiness) {
        return __awaiter(this, void 0, void 0, function () {
            var adjustments, exerciseAnalysis, _i, exerciseAnalysis_1, _a, exerciseName, analysis, exerciseAdjustments;
            return __generator(this, function (_b) {
                adjustments = [];
                if (metrics.length === 0)
                    return [2 /*return*/, adjustments];
                exerciseAnalysis = this.analyzeExercisePerformance(metrics);
                for (_i = 0, exerciseAnalysis_1 = exerciseAnalysis; _i < exerciseAnalysis_1.length; _i++) {
                    _a = exerciseAnalysis_1[_i], exerciseName = _a[0], analysis = _a[1];
                    exerciseAdjustments = this.generateExerciseAdjustments(exerciseName, analysis, readiness);
                    adjustments.push.apply(adjustments, exerciseAdjustments);
                }
                // Ajustes globales basados en readiness
                if (readiness < 70) {
                    adjustments.push({
                        exerciseName: 'GLOBAL',
                        adjustmentType: 'volume',
                        previousValue: '100%',
                        newValue: '85%',
                        adjustmentPercentage: -15,
                        reason: 'Reducción de volumen por baja readiness',
                        confidence: 0.85,
                        periodizationPhase: 'recovery'
                    });
                }
                else if (readiness > 85) {
                    adjustments.push({
                        exerciseName: 'GLOBAL',
                        adjustmentType: 'intensity',
                        previousValue: '100%',
                        newValue: '105%',
                        adjustmentPercentage: 5,
                        reason: 'Incremento de intensidad por alta readiness',
                        confidence: 0.78,
                        periodizationPhase: 'intensification'
                    });
                }
                return [2 /*return*/, adjustments];
            });
        });
    };
    AdaptiveTrainingSystem.prototype.analyzeExercisePerformance = function (metrics) {
        var exerciseAnalysis = new Map();
        for (var _i = 0, metrics_1 = metrics; _i < metrics_1.length; _i++) {
            var session = metrics_1[_i];
            for (var _a = 0, _b = session.exerciseData; _a < _b.length; _a++) {
                var exercise = _b[_a];
                if (!exerciseAnalysis.has(exercise.exerciseName)) {
                    exerciseAnalysis.set(exercise.exerciseName, {
                        sessions: [],
                        avgRPE: 0,
                        avgRIR: 0,
                        weightProgression: 0,
                        formQuality: 0,
                        completionRate: 0
                    });
                }
                var analysis = exerciseAnalysis.get(exercise.exerciseName);
                analysis.sessions.push(exercise);
            }
        }
        // Calcular métricas para cada ejercicio
        for (var _c = 0, exerciseAnalysis_2 = exerciseAnalysis; _c < exerciseAnalysis_2.length; _c++) {
            var _d = exerciseAnalysis_2[_c], exerciseName = _d[0], data = _d[1];
            var sessions = data.sessions;
            data.avgRPE = sessions.reduce(function (sum, s) { return sum + s.rpe; }, 0) / sessions.length;
            data.avgRIR = sessions.reduce(function (sum, s) { return sum + s.rir; }, 0) / sessions.length;
            data.formQuality = sessions.reduce(function (sum, s) { return sum + s.formQuality; }, 0) / sessions.length;
            data.completionRate = sessions.reduce(function (sum, s) {
                return sum + (s.completedSets / s.plannedSets);
            }, 0) / sessions.length * 100;
            // Calcular progresión de peso
            if (sessions.length > 1) {
                var firstWeight = sessions[0].actualWeight;
                var lastWeight = sessions[sessions.length - 1].actualWeight;
                data.weightProgression = ((lastWeight - firstWeight) / firstWeight) * 100;
            }
        }
        return exerciseAnalysis;
    };
    AdaptiveTrainingSystem.prototype.generateExerciseAdjustments = function (exerciseName, analysis, globalReadiness) {
        var adjustments = [];
        // Ajuste de peso basado en RPE/RIR
        if (analysis.avgRPE < 7 && analysis.avgRIR > 3) {
            // Muy fácil - incrementar peso
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'weight',
                previousValue: analysis.sessions[analysis.sessions.length - 1].actualWeight,
                newValue: Math.round(analysis.sessions[analysis.sessions.length - 1].actualWeight * 1.05),
                adjustmentPercentage: 5,
                reason: 'RPE bajo y RIR alto indican capacidad para más carga',
                confidence: 0.88,
                periodizationPhase: 'progression'
            });
        }
        else if (analysis.avgRPE > 9 || analysis.avgRIR < 1) {
            // Muy difícil - reducir peso
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'weight',
                previousValue: analysis.sessions[analysis.sessions.length - 1].actualWeight,
                newValue: Math.round(analysis.sessions[analysis.sessions.length - 1].actualWeight * 0.95),
                adjustmentPercentage: -5,
                reason: 'RPE alto o RIR bajo indican sobrecarga',
                confidence: 0.92,
                periodizationPhase: 'deload'
            });
        }
        // Ajuste de series basado en completion rate
        if (analysis.completionRate < 80) {
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'sets',
                previousValue: analysis.sessions[0].plannedSets,
                newValue: Math.max(1, analysis.sessions[0].plannedSets - 1),
                adjustmentPercentage: -20,
                reason: 'Baja tasa de finalización de series',
                confidence: 0.75,
                periodizationPhase: 'adjustment'
            });
        }
        // Ajuste de descanso basado en recuperación
        if (analysis.avgRPE > 8) {
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'rest',
                previousValue: '120s',
                newValue: '150s',
                adjustmentPercentage: 25,
                reason: 'RPE elevado requiere mayor recuperación entre series',
                confidence: 0.82,
                periodizationPhase: 'recovery'
            });
        }
        return adjustments;
    };
    AdaptiveTrainingSystem.prototype.evaluatePeriodization = function (performance, recovery) {
        var recommendedPhase = 'maintenance';
        var reason = '';
        if (recovery.fatigueIndex > 70) {
            recommendedPhase = 'deload';
            reason = 'Alta fatiga acumulada requiere recuperación activa';
        }
        else if (performance.isImproving && recovery.recoveryQuality > 75) {
            recommendedPhase = 'intensification';
            reason = 'Buena recuperación y progreso permiten intensificación';
        }
        else if (performance.trendScore < 50) {
            recommendedPhase = 'volume';
            reason = 'Estancamiento requiere incremento de volumen';
        }
        return {
            currentPhase: 'current',
            recommendedPhase: recommendedPhase,
            transitionReason: reason,
            transitionTimeline: '1-2 semanas',
            expectedOutcomes: this.getPhaseOutcomes(recommendedPhase)
        };
    };
    AdaptiveTrainingSystem.prototype.shouldDeload = function (recovery, performance) {
        return recovery.fatigueIndex > 70 ||
            (recovery.fatigueIndex > 60 && performance.trendScore < 40);
    };
    AdaptiveTrainingSystem.prototype.canIntensify = function (performance, recovery) {
        return performance.isImproving &&
            recovery.recoveryQuality > 75 &&
            performance.progressRate > 5;
    };
    AdaptiveTrainingSystem.prototype.applyAdjustmentToPlan = function (plan, adjustment) {
        // Implementar la aplicación de ajustes al plan
        if (!plan.adjustments)
            plan.adjustments = [];
        plan.adjustments.push(__assign(__assign({}, adjustment), { appliedAt: new Date() }));
    };
    AdaptiveTrainingSystem.prototype.calculateVolumeTrend = function (metrics) {
        if (metrics.length < 2)
            return 0;
        var totalVolumes = metrics.map(function (session) {
            return session.exerciseData.reduce(function (sum, ex) {
                return sum + (ex.actualWeight * ex.actualReps.reduce(function (s, r) { return s + r; }, 0));
            }, 0);
        });
        var firstHalf = totalVolumes.slice(0, Math.ceil(totalVolumes.length / 2));
        var secondHalf = totalVolumes.slice(Math.floor(totalVolumes.length / 2));
        var avgFirst = firstHalf.reduce(function (sum, v) { return sum + v; }, 0) / firstHalf.length;
        var avgSecond = secondHalf.reduce(function (sum, v) { return sum + v; }, 0) / secondHalf.length;
        return ((avgSecond - avgFirst) / avgFirst) * 100;
    };
    AdaptiveTrainingSystem.prototype.calculateIntensityTrend = function (metrics) {
        if (metrics.length < 2)
            return 0;
        var avgWeights = metrics.map(function (session) {
            var weights = session.exerciseData.map(function (ex) { return ex.actualWeight; });
            return weights.reduce(function (sum, w) { return sum + w; }, 0) / weights.length;
        });
        var trend = (avgWeights[avgWeights.length - 1] - avgWeights[0]) / avgWeights[0] * 100;
        return Math.max(-20, Math.min(20, trend));
    };
    AdaptiveTrainingSystem.prototype.calculateMotivationTrend = function (metrics) {
        if (metrics.length < 2)
            return 0;
        var motivationScores = metrics.map(function (m) { return m.motivation; });
        var trend = motivationScores[motivationScores.length - 1] - motivationScores[0];
        return trend * 5; // Scale to percentage
    };
    AdaptiveTrainingSystem.prototype.getPhaseOutcomes = function (phase) {
        var outcomes = {
            'deload': [
                'Reducción de fatiga acumulada',
                'Mejora de marcadores de recuperación',
                'Preparación para próxima fase de progresión'
            ],
            'intensification': [
                'Incremento de fuerza máxima',
                'Mejoras en rendimiento específico',
                'Adaptaciones neurales avanzadas'
            ],
            'volume': [
                'Incremento de capacidad de trabajo',
                'Hipertrofia muscular',
                'Mejora de base aeróbica'
            ],
            'maintenance': [
                'Preservación de adaptaciones actuales',
                'Estabilización de rendimiento',
                'Preparación para próximo ciclo'
            ]
        };
        return outcomes[phase] || outcomes['maintenance'];
    };
    AdaptiveTrainingSystem.prototype.initializeBaselines = function () {
        this.baselineMetrics.set('rpe', 7);
        this.baselineMetrics.set('rir', 2);
        this.baselineMetrics.set('adherence', 85);
        this.baselineMetrics.set('sleep', 7);
        this.baselineMetrics.set('hrv', 45);
    };
    AdaptiveTrainingSystem.prototype.updateBaselines = function (metrics) {
        // Actualizar líneas base con promedio móvil
        var weight = 0.1; // 10% de peso para nueva información
        var currentRPE = this.baselineMetrics.get('rpe') || 7;
        this.baselineMetrics.set('rpe', currentRPE * (1 - weight) + metrics.rpe * weight);
        var currentAdherence = this.baselineMetrics.get('adherence') || 85;
        this.baselineMetrics.set('adherence', currentAdherence * (1 - weight) + metrics.adherence * weight);
    };
    /**
     * Obtiene recomendaciones para la próxima sesión
     */
    AdaptiveTrainingSystem.prototype.getNextSessionRecommendations = function (exerciseName) {
        var recent = this.metricsHistory.slice(-3);
        var recommendations = [];
        if (recent.length === 0) {
            return ['Registra métricas de tus sesiones para obtener recomendaciones personalizadas'];
        }
        var avgRPE = recent.reduce(function (sum, m) { return sum + m.rpe; }, 0) / recent.length;
        var avgRecovery = recent.reduce(function (sum, m) { return sum + m.sleepQuality; }, 0) / recent.length;
        if (avgRPE > 8.5) {
            recommendations.push('Considera reducir la intensidad un 5-10% en la próxima sesión');
        }
        if (avgRecovery < 6) {
            recommendations.push('Prioriza el descanso - considera una sesión de recuperación activa');
        }
        if (recent.every(function (m) { return m.adherence > 90; })) {
            recommendations.push('Excelente adherencia! Podrías intentar un pequeño incremento de volumen');
        }
        return recommendations;
    };
    return AdaptiveTrainingSystem;
}());
exports.AdaptiveTrainingSystem = AdaptiveTrainingSystem;
exports.adaptiveTrainingSystem = new AdaptiveTrainingSystem();
