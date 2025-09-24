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
exports.loadProgressionService = exports.LoadProgressionService = void 0;
var storage_1 = require("./storage");
var LoadProgressionService = /** @class */ (function () {
    function LoadProgressionService() {
    }
    LoadProgressionService.getInstance = function () {
        if (!LoadProgressionService.instance) {
            LoadProgressionService.instance = new LoadProgressionService();
        }
        return LoadProgressionService.instance;
    };
    /**
     * Records progression metrics from a workout session
     */
    LoadProgressionService.prototype.recordProgressionMetrics = function (session) {
        var _this = this;
        var metrics = [];
        session.exercises.forEach(function (exercise) {
            exercise.sets.forEach(function (set) {
                if (set.weight !== null && set.reps !== null && set.rpe !== null) {
                    var metric = {
                        exerciseName: exercise.name,
                        date: session.date,
                        weight: set.weight,
                        reps: set.reps,
                        rpe: set.rpe,
                        rir: _this.calculateRIR(set.reps, set.rpe),
                        completed: set.reps > 0 // Consider completed if reps > 0
                    };
                    metrics.push(metric);
                    storage_1.storageManager.addProgressionMetric(metric);
                }
            });
        });
        return metrics;
    };
    /**
     * Calculates Reps in Reserve (RIR) based on reps and RPE
     */
    LoadProgressionService.prototype.calculateRIR = function (reps, rpe) {
        // Simplified RIR calculation
        // RIR = 10 - RPE (approximate relationship)
        return Math.max(0, 10 - rpe);
    };
    /**
     * Analyzes progression metrics and generates adjustments
     */
    LoadProgressionService.prototype.analyzeProgression = function (userId, exerciseName) {
        var metrics = storage_1.storageManager.getProgressionMetrics()
            .filter(function (m) { return m.exerciseName === exerciseName; })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        if (metrics.length === 0) {
            return {
                exerciseName: exerciseName,
                currentWeight: 0,
                recommendedWeight: 0,
                nextPhase: 'accumulation',
                adjustments: [],
                notes: ['No hay datos suficientes para generar recomendaciones']
            };
        }
        var latestMetric = metrics[0];
        var currentWeight = latestMetric.weight;
        // Calculate progression factors
        var performanceTrend = this.calculatePerformanceTrend(metrics);
        var volumeTrend = this.calculateVolumeTrend(metrics);
        var intensityTrend = this.calculateIntensityTrend(metrics);
        // Generate adjustments based on analysis
        var adjustments = [];
        // If user successfully completed sets with low RPE and high RIR, increase load
        if (latestMetric.rpe < 7 && latestMetric.rir > 3) {
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'weight',
                value: 5, // 5% increase
                reason: 'RPE bajo y RIR alto indican capacidad para más carga',
                confidence: 0.85,
                applied: false
            });
        }
        // If user struggled (high RPE, low RIR), consider reducing load or deloading
        else if (latestMetric.rpe > 8 || latestMetric.rir < 1) {
            if (this.shouldDeload(metrics)) {
                adjustments.push({
                    exerciseName: exerciseName,
                    adjustmentType: 'deload',
                    value: -10, // 10% reduction
                    reason: 'Sobrecarga detectada - se recomienda semana de recuperación',
                    confidence: 0.90,
                    applied: false
                });
            }
            else {
                adjustments.push({
                    exerciseName: exerciseName,
                    adjustmentType: 'weight',
                    value: -2.5, // 2.5% reduction
                    reason: 'RPE alto o RIR bajo indican sobrecarga',
                    confidence: 0.80,
                    applied: false
                });
            }
        }
        // If user consistently fails to complete sets, reduce volume
        else if (!latestMetric.completed) {
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'volume',
                value: -15, // 15% reduction in volume
                reason: 'Fallo en completar repeticiones - reducir volumen',
                confidence: 0.85,
                applied: false
            });
        }
        // If user is progressing well, consider increasing intensity
        else if (performanceTrend > 0.7 && intensityTrend > 0.5) {
            adjustments.push({
                exerciseName: exerciseName,
                adjustmentType: 'intensity',
                value: 3, // 3% increase
                reason: 'Buen progreso detectado - aumentar intensidad',
                confidence: 0.75,
                applied: false
            });
        }
        // Determine next periodization phase
        var nextPhase = this.determineNextPhase(metrics, performanceTrend, volumeTrend);
        // Calculate recommended weight
        var recommendedWeight = currentWeight;
        var weightAdjustments = adjustments.filter(function (a) { return a.adjustmentType === 'weight'; });
        if (weightAdjustments.length > 0) {
            var totalAdjustment = weightAdjustments.reduce(function (sum, a) { return sum + a.value; }, 0);
            recommendedWeight = currentWeight * (1 + totalAdjustment / 100);
        }
        // Add notes based on analysis
        var notes = [];
        if (performanceTrend > 0.7) {
            notes.push('Progreso consistente detectado');
        }
        if (volumeTrend < 0.3) {
            notes.push('Volumen bajo - considerar aumentar');
        }
        if (intensityTrend > 0.8) {
            notes.push('Alta intensidad - monitorear fatiga');
        }
        var plan = {
            exerciseName: exerciseName,
            currentWeight: currentWeight,
            recommendedWeight: Math.round(recommendedWeight * 100) / 100, // Round to 2 decimal places
            nextPhase: nextPhase,
            adjustments: adjustments,
            notes: notes
        };
        storage_1.storageManager.addProgressionPlan(plan);
        return plan;
    };
    /**
     * Calculates performance trend (0-1 scale)
     */
    LoadProgressionService.prototype.calculatePerformanceTrend = function (metrics) {
        if (metrics.length < 2)
            return 0.5;
        // Compare recent performance with older performance
        var recentMetrics = metrics.slice(0, Math.min(3, metrics.length));
        var olderMetrics = metrics.slice(Math.min(3, metrics.length), Math.min(6, metrics.length));
        if (olderMetrics.length === 0)
            return 0.5;
        var recentAvgRPE = recentMetrics.reduce(function (sum, m) { return sum + m.rpe; }, 0) / recentMetrics.length;
        var olderAvgRPE = olderMetrics.reduce(function (sum, m) { return sum + m.rpe; }, 0) / olderMetrics.length;
        // Lower RPE indicates better performance
        var trend = (olderAvgRPE - recentAvgRPE) / 10;
        return Math.max(0, Math.min(1, (trend + 0.5)));
    };
    /**
     * Calculates volume trend (0-1 scale)
     */
    LoadProgressionService.prototype.calculateVolumeTrend = function (metrics) {
        if (metrics.length < 2)
            return 0.5;
        // Calculate volume for each metric (weight * reps)
        var volumes = metrics.map(function (m) { return m.weight * m.reps; });
        // Compare recent volume with older volume
        var recentVolumes = volumes.slice(0, Math.min(3, volumes.length));
        var olderVolumes = volumes.slice(Math.min(3, volumes.length), Math.min(6, volumes.length));
        if (olderVolumes.length === 0)
            return 0.5;
        var recentAvgVolume = recentVolumes.reduce(function (sum, v) { return sum + v; }, 0) / recentVolumes.length;
        var olderAvgVolume = olderVolumes.reduce(function (sum, v) { return sum + v; }, 0) / olderVolumes.length;
        var trend = (recentAvgVolume - olderAvgVolume) / recentAvgVolume;
        return Math.max(0, Math.min(1, (trend + 0.5)));
    };
    /**
     * Calculates intensity trend (0-1 scale)
     */
    LoadProgressionService.prototype.calculateIntensityTrend = function (metrics) {
        if (metrics.length < 2)
            return 0.5;
        // Calculate intensity as weight relative to estimated 1RM
        var intensities = metrics.map(function (m) {
            // Simplified 1RM estimation: weight * (1 + reps/30)
            var estimated1RM = m.weight * (1 + m.reps / 30);
            return m.weight / estimated1RM;
        });
        // Compare recent intensity with older intensity
        var recentIntensities = intensities.slice(0, Math.min(3, intensities.length));
        var olderIntensities = intensities.slice(Math.min(3, intensities.length), Math.min(6, intensities.length));
        if (olderIntensities.length === 0)
            return 0.5;
        var recentAvgIntensity = recentIntensities.reduce(function (sum, i) { return sum + i; }, 0) / recentIntensities.length;
        var olderAvgIntensity = olderIntensities.reduce(function (sum, i) { return sum + i; }, 0) / olderIntensities.length;
        var trend = (recentAvgIntensity - olderAvgIntensity) / recentAvgIntensity;
        return Math.max(0, Math.min(1, (trend + 0.5)));
    };
    /**
     * Determines if deload is needed
     */
    LoadProgressionService.prototype.shouldDeload = function (metrics) {
        if (metrics.length < 4)
            return false;
        // Check for signs of overreaching
        var recentMetrics = metrics.slice(0, 4);
        // High RPE consistently
        var highRPECount = recentMetrics.filter(function (m) { return m.rpe > 8; }).length;
        if (highRPECount >= 3)
            return true;
        // Failed sets consistently
        var failedCount = recentMetrics.filter(function (m) { return !m.completed; }).length;
        if (failedCount >= 2)
            return true;
        // High RIR consistently (indicates difficulty)
        var highRIRCount = recentMetrics.filter(function (m) { return m.rir < 1; }).length;
        if (highRIRCount >= 3)
            return true;
        return false;
    };
    /**
     * Determines next periodization phase
     */
    LoadProgressionService.prototype.determineNextPhase = function (metrics, performanceTrend, volumeTrend) {
        if (this.shouldDeload(metrics)) {
            return 'deload';
        }
        if (performanceTrend > 0.7 && volumeTrend > 0.6) {
            return 'intensification';
        }
        if (performanceTrend < 0.3 || volumeTrend < 0.2) {
            return 'accumulation';
        }
        return 'accumulation';
    };
    /**
     * Gets progression history for an exercise
     */
    LoadProgressionService.prototype.getProgressionHistory = function (exerciseName, days) {
        if (days === void 0) { days = 30; }
        var cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return storage_1.storageManager.getProgressionHistory()
            .filter(function (h) { return h.exerciseName === exerciseName && new Date(h.date) >= cutoffDate; })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
    };
    /**
     * Applies progression adjustments to workout plans
     */
    LoadProgressionService.prototype.applyProgressionAdjustments = function (workoutPlan, adjustments) {
        var adjustedPlan = JSON.parse(JSON.stringify(workoutPlan));
        // Apply adjustments to exercises in the plan
        if (adjustedPlan.days) {
            adjustedPlan.days.forEach(function (day) {
                if (day.exercises) {
                    day.exercises.forEach(function (exercise) {
                        var exerciseAdjustments = adjustments.filter(function (a) { return a.exerciseName === exercise.name; });
                        exerciseAdjustments.forEach(function (adjustment) {
                            if (adjustment.adjustmentType === 'weight' && exercise.sets) {
                                // Apply weight adjustment to all sets
                                exercise.sets = exercise.sets.map(function (set) {
                                    if (set.weight) {
                                        var newWeight = set.weight * (1 + adjustment.value / 100);
                                        return __assign(__assign({}, set), { weight: Math.round(newWeight * 100) / 100 });
                                    }
                                    return set;
                                });
                            }
                        });
                    });
                }
            });
        }
        // Mark adjustments as applied
        adjustments.forEach(function (adjustment) {
            adjustment.applied = true;
        });
        return adjustedPlan;
    };
    return LoadProgressionService;
}());
exports.LoadProgressionService = LoadProgressionService;
exports.loadProgressionService = LoadProgressionService.getInstance();
