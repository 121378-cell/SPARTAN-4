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
exports.wearableIntegrationService = exports.WearableIntegrationService = void 0;
var storage_1 = require("./storage");
var spartan_coach_service_1 = require("./spartan-coach-service");
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var WearableIntegrationService = /** @class */ (function () {
    function WearableIntegrationService() {
        this.spartanCoach = new spartan_coach_service_1.SpartanCoachService();
    }
    WearableIntegrationService.getInstance = function () {
        if (!WearableIntegrationService.instance) {
            WearableIntegrationService.instance = new WearableIntegrationService();
        }
        return WearableIntegrationService.instance;
    };
    /**
     * Process wearable data and generate insights for training adjustments
     */
    WearableIntegrationService.prototype.processWearableData = function (userId, wearableData) {
        console.log('🔍 Processing wearable data from:', wearableData.source);
        // Analyze recovery metrics from wearable data
        var recoveryAnalysis = this.analyzeRecoveryFromWearable(wearableData);
        // Analyze training readiness
        var trainingReadiness = this.analyzeTrainingReadiness(wearableData);
        // Generate training adjustments based on wearable metrics
        var adjustments = this.generateTrainingAdjustments(wearableData);
        // Generate recommendations
        var recommendations = this.generateRecommendations(wearableData);
        // Identify risk factors
        var riskFactors = this.identifyRiskFactors(wearableData);
        var insights = {
            recoveryStatus: recoveryAnalysis.status,
            trainingReadiness: trainingReadiness,
            adjustments: adjustments,
            recommendations: recommendations,
            riskFactors: riskFactors
        };
        // Store processed data
        // Store processed data in appropriate storage locations
        // For now, we'll store recovery metrics if they don't exist for today
        var today = new Date();
        var existingMetrics = storage_1.storageManager.getRecoveryMetricsForDate(today);
        if (!existingMetrics) {
            var recoveryMetric = {
                date: today,
                energyLevel: Math.round(wearableData.sleep.quality / 10),
                muscleSoreness: Math.round((100 - wearableData.recovery.hrv) / 10),
                sleepQuality: Math.round(wearableData.sleep.quality / 10),
                stressLevel: Math.round(wearableData.recovery.stress / 10),
                motivation: Math.round(wearableData.performance.trainingReadiness / 10)
            };
            storage_1.storageManager.addRecoveryMetric(recoveryMetric);
        }
        // Notify the nervous system of wearable data update
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'data_updated',
            timestamp: new Date(),
            userId: userId,
            payload: {
                wearableData: wearableData,
                insights: insights
            },
            sourceModule: 'WearableIntegrationService',
            priority: 'high'
        });
        return insights;
    };
    /**
     * Analyze recovery status based on wearable metrics
     */
    WearableIntegrationService.prototype.analyzeRecoveryFromWearable = function (wearableData) {
        var recovery = wearableData.recovery, sleep = wearableData.sleep, vitals = wearableData.vitals;
        // Calculate recovery score based on multiple metrics
        // HRV is a key indicator (30% weight)
        var hrvScore = Math.min(100, (recovery.hrv / 70) * 30);
        // Resting heart rate (20% weight)
        var rhrScore = Math.max(0, 20 - (Math.max(0, recovery.restingHeartRate - 60) * 0.5));
        // Sleep quality (25% weight)
        var sleepScore = (sleep.quality / 100) * 25;
        // Stress level (15% weight) - inverted as lower stress is better
        var stressScore = (15 - (recovery.stress / 100) * 15);
        // Blood pressure (10% weight)
        var bpScore = (vitals.bloodPressure.systolic < 120 && vitals.bloodPressure.diastolic < 80) ? 10 :
            (vitals.bloodPressure.systolic < 140 && vitals.bloodPressure.diastolic < 90) ? 5 : 0;
        var recoveryScore = Math.round(hrvScore + rhrScore + sleepScore + stressScore + bpScore);
        var status;
        if (recoveryScore >= 85)
            status = 'optimal';
        else if (recoveryScore >= 70)
            status = 'good';
        else if (recoveryScore >= 50)
            status = 'fair';
        else if (recoveryScore >= 30)
            status = 'poor';
        else
            status = 'critical';
        return { status: status, recoveryScore: recoveryScore };
    };
    /**
     * Analyze training readiness based on wearable metrics
     */
    WearableIntegrationService.prototype.analyzeTrainingReadiness = function (wearableData) {
        var recovery = wearableData.recovery, sleep = wearableData.sleep, activity = wearableData.activity, performance = wearableData.performance;
        // Check HRV - key indicator of readiness
        if (recovery.hrv < 40)
            return 'rest'; // Very low HRV indicates poor recovery
        if (recovery.hrv < 50)
            return 'caution'; // Low HRV indicates caution
        // Check sleep quality
        if (sleep.quality < 60)
            return 'caution'; // Poor sleep affects performance
        if (sleep.quality < 40)
            return 'rest'; // Very poor sleep requires rest
        // Check resting heart rate
        if (recovery.restingHeartRate > 70)
            return 'caution'; // Elevated RHR indicates stress
        if (recovery.restingHeartRate > 80)
            return 'rest'; // High RHR indicates need for rest
        // Check stress levels
        if (recovery.stress > 80)
            return 'rest'; // High stress requires recovery
        if (recovery.stress > 60)
            return 'caution'; // Moderate stress requires caution
        // Check training load vs recovery
        if (activity.trainingLoad > 80 && recovery.recoveryScore < 60)
            return 'caution';
        if (activity.trainingLoad > 90 && recovery.recoveryScore < 70)
            return 'rest';
        // Check readiness score if available
        if (recovery.readiness !== undefined && recovery.readiness < 50)
            return 'rest';
        if (recovery.readiness !== undefined && recovery.readiness < 70)
            return 'caution';
        // Check performance metrics
        if (performance.trainingReadiness < 50)
            return 'rest';
        if (performance.trainingReadiness < 70)
            return 'caution';
        return 'ready';
    };
    /**
     * Generate training adjustments based on wearable metrics
     */
    WearableIntegrationService.prototype.generateTrainingAdjustments = function (wearableData) {
        var adjustments = [];
        var recovery = wearableData.recovery, sleep = wearableData.sleep, activity = wearableData.activity, performance = wearableData.performance;
        // HRV-based adjustments
        if (recovery.hrv < 45) {
            adjustments.push({
                type: 'intensity',
                value: -20, // Reduce intensity by 20%
                reason: 'Bajo HRV indica estrés fisiológico elevado',
                confidence: 0.9,
                metrics: ['hrv']
            });
            adjustments.push({
                type: 'volume',
                value: -25, // Reduce volume by 25%
                reason: 'Bajo HRV indica necesidad de reducir carga de entrenamiento',
                confidence: 0.85,
                metrics: ['hrv']
            });
        }
        else if (recovery.hrv > 75) {
            adjustments.push({
                type: 'intensity',
                value: 10, // Increase intensity by 10%
                reason: 'Alto HRV indica buena recuperación y preparación',
                confidence: 0.8,
                metrics: ['hrv']
            });
        }
        // Sleep quality-based adjustments
        if (sleep.quality < 50) {
            adjustments.push({
                type: 'duration',
                value: -30, // Reduce workout duration by 30%
                reason: 'Mala calidad de sueño afecta rendimiento y recuperación',
                confidence: 0.85,
                metrics: ['sleepQuality']
            });
            adjustments.push({
                type: 'rest',
                value: 25, // Increase rest periods by 25%
                reason: 'Mala calidad de sueño requiere más tiempo de recuperación entre series',
                confidence: 0.8,
                metrics: ['sleepQuality']
            });
        }
        // Resting heart rate-based adjustments
        if (recovery.restingHeartRate > 75) {
            adjustments.push({
                type: 'intensity',
                value: -15, // Reduce intensity by 15%
                reason: 'Frecuencia cardíaca en reposo elevada indica fatiga',
                confidence: 0.8,
                metrics: ['restingHeartRate']
            });
        }
        // Stress-based adjustments
        if (recovery.stress > 75) {
            adjustments.push({
                type: 'frequency',
                value: -1, // Reduce training frequency by 1 session per week
                reason: 'Alto nivel de estrés requiere más días de recuperación',
                confidence: 0.75,
                metrics: ['stress']
            });
        }
        // Training load vs recovery balance
        if (activity.trainingLoad > 85 && recovery.recoveryScore < 65) {
            adjustments.push({
                type: 'volume',
                value: -20, // Reduce volume by 20%
                reason: 'Alta carga de entrenamiento con recuperación insuficiente',
                confidence: 0.9,
                metrics: ['trainingLoad', 'recoveryScore']
            });
        }
        // Readiness-based adjustments
        if (recovery.readiness !== undefined) {
            if (recovery.readiness < 40) {
                adjustments.push({
                    type: 'rest',
                    value: 1, // Recommend complete rest day
                    reason: 'Puntaje de preparación muy bajo indica necesidad de recuperación completa',
                    confidence: 0.95,
                    metrics: ['readiness']
                });
            }
            else if (recovery.readiness > 85) {
                adjustments.push({
                    type: 'intensity',
                    value: 15, // Increase intensity by 15%
                    reason: 'Alto puntaje de preparación indica óptima capacidad de entrenamiento',
                    confidence: 0.85,
                    metrics: ['readiness']
                });
            }
        }
        return adjustments;
    };
    /**
     * Generate recommendations based on wearable data
     */
    WearableIntegrationService.prototype.generateRecommendations = function (wearableData) {
        var recommendations = [];
        var recovery = wearableData.recovery, sleep = wearableData.sleep, activity = wearableData.activity, vitals = wearableData.vitals, performance = wearableData.performance;
        // Sleep recommendations
        if (sleep.quality < 70) {
            recommendations.push('Prioriza dormir 7-9 horas para mejorar la recuperación');
        }
        if (sleep.sleepLatency > 30) {
            recommendations.push('Establece una rutina de sueño consistente 1 hora antes de acostarte');
        }
        // HRV recommendations
        if (recovery.hrv < 50) {
            recommendations.push('Practica respiración diafragmática para mejorar la variabilidad cardíaca');
        }
        // Resting heart rate recommendations
        if (recovery.restingHeartRate > 70) {
            recommendations.push('Considera días de recuperación activa en lugar de entrenamiento intenso');
        }
        // Stress recommendations
        if (recovery.stress > 70) {
            recommendations.push('Incorpora técnicas de manejo del estrés como meditación o yoga');
        }
        // Blood pressure recommendations
        if (vitals.bloodPressure.systolic > 130 || vitals.bloodPressure.diastolic > 85) {
            recommendations.push('Reduce el consumo de sodio y aumenta la actividad aeróbica');
        }
        // Glucose recommendations
        if (vitals.glucose.timeInRange < 70) {
            recommendations.push('Optimiza la composición de comidas y el momento de las ingestas');
        }
        // Hydration recommendations
        if (vitals.hydration.level < 75) {
            recommendations.push('Aumenta la ingesta de agua, especialmente antes y después del entrenamiento');
        }
        // Training recommendations
        if (activity.vo2max < 45) {
            recommendations.push('Incorpora entrenamiento aeróbico de base en Zona 2');
        }
        if (performance.trainingReadiness < 60) {
            recommendations.push('Considera una semana de descarga para permitir la recuperación completa');
        }
        return recommendations;
    };
    /**
     * Identify risk factors from wearable data
     */
    WearableIntegrationService.prototype.identifyRiskFactors = function (wearableData) {
        var riskFactors = [];
        var recovery = wearableData.recovery, sleep = wearableData.sleep, vitals = wearableData.vitals, activity = wearableData.activity, performance = wearableData.performance;
        // Cardiovascular risks
        if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) {
            riskFactors.push('Presión arterial elevada');
        }
        if (recovery.restingHeartRate > 85) {
            riskFactors.push('Frecuencia cardíaca en reposo elevada');
        }
        // Recovery risks
        if (recovery.hrv < 40) {
            riskFactors.push('Baja variabilidad cardíaca (riesgo de sobreentrenamiento)');
        }
        if (sleep.quality < 50) {
            riskFactors.push('Mala calidad de sueño (afecta recuperación y rendimiento)');
        }
        // Metabolic risks
        if (vitals.glucose.timeInRange < 60) {
            riskFactors.push('Mala regulación glucémica');
        }
        if (vitals.inflammation.score < 70) {
            riskFactors.push('Niveles elevados de inflamación');
        }
        // Training risks
        if (activity.trainingLoad > 90 && recovery.recoveryScore < 50) {
            riskFactors.push('Sobreentrenamiento potencial (alta carga con baja recuperación)');
        }
        if (performance.cognitiveLoad > 85) {
            riskFactors.push('Sobrecarga cognitiva (afecta toma de decisiones y técnica)');
        }
        return riskFactors;
    };
    /**
     * Integrate wearable insights with Chat Maestro context
     */
    WearableIntegrationService.prototype.integrateWithChatContext = function (userId, wearableInsights) {
        console.log('🤖 Integrating wearable insights with Chat Maestro');
        // Get current context
        // This would typically be passed from the ChatMaestro component
        // For now, we'll return the insights in a format that ChatMaestro can use
        return {
            wearableInsights: wearableInsights,
            recommendations: wearableInsights.recommendations,
            riskFactors: wearableInsights.riskFactors,
            adjustments: wearableInsights.adjustments
        };
    };
    /**
     * Generate Spartan-style interpretation of wearable data
     */
    WearableIntegrationService.prototype.generateSpartanInterpretation = function (wearableData, context) {
        // Use Spartan Coach to interpret wearable data
        return this.spartanCoach.interpretWearableData(wearableData, context);
    };
    /**
     * Apply training adjustments to workout plans
     */
    WearableIntegrationService.prototype.applyTrainingAdjustments = function (workoutPlan, adjustments) {
        var adjustedPlan = JSON.parse(JSON.stringify(workoutPlan));
        // Apply adjustments to workout plan
        adjustments.forEach(function (adjustment) {
            switch (adjustment.type) {
                case 'intensity':
                    // Adjust weights or perceived exertion
                    if (adjustedPlan.days) {
                        adjustedPlan.days.forEach(function (day) {
                            if (day.exercises) {
                                day.exercises.forEach(function (exercise) {
                                    if (exercise.sets) {
                                        exercise.sets = exercise.sets.map(function (set) {
                                            if (set.weight) {
                                                var newWeight = set.weight * (1 + adjustment.value / 100);
                                                return __assign(__assign({}, set), { weight: Math.round(newWeight * 100) / 100 });
                                            }
                                            return set;
                                        });
                                    }
                                });
                            }
                        });
                    }
                    break;
                case 'volume':
                    // Adjust number of sets or exercises
                    if (adjustedPlan.days) {
                        adjustedPlan.days.forEach(function (day) {
                            if (day.exercises) {
                                day.exercises = day.exercises.map(function (exercise) {
                                    if (exercise.sets) {
                                        var newSetCount = Math.max(1, Math.round(exercise.sets.length * (1 + adjustment.value / 100)));
                                        // For simplicity, we'll just adjust the number of sets in the first exercise
                                        // In a real implementation, this would be more sophisticated
                                        return __assign(__assign({}, exercise), { sets: exercise.sets.slice(0, newSetCount) });
                                    }
                                    return exercise;
                                });
                            }
                        });
                    }
                    break;
                case 'duration':
                    // Adjust workout duration
                    if (adjustedPlan.duration) {
                        adjustedPlan.duration = Math.max(15, Math.round(adjustedPlan.duration * (1 + adjustment.value / 100)));
                    }
                    break;
                case 'rest':
                    // Adjust rest periods between sets
                    if (adjustedPlan.days) {
                        adjustedPlan.days.forEach(function (day) {
                            if (day.exercises) {
                                day.exercises.forEach(function (exercise) {
                                    if (exercise.sets) {
                                        exercise.sets = exercise.sets.map(function (set) {
                                            if (set.rest) {
                                                var newRest = Math.max(30, Math.round(set.rest * (1 + adjustment.value / 100)));
                                                return __assign(__assign({}, set), { rest: newRest });
                                            }
                                            return set;
                                        });
                                    }
                                });
                            }
                        });
                    }
                    break;
                case 'frequency':
                    // This would affect the overall training schedule, not a single workout
                    // For now, we'll just log this adjustment
                    console.log("Training frequency adjustment: ".concat(adjustment.value, " days per week"));
                    break;
            }
        });
        return adjustedPlan;
    };
    return WearableIntegrationService;
}());
exports.WearableIntegrationService = WearableIntegrationService;
exports.wearableIntegrationService = WearableIntegrationService.getInstance();
