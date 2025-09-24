"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wearableDataInterpreter = exports.WearableDataInterpreter = void 0;
var real_time_modification_service_1 = require("./real-time-modification-service");
var WearableDataInterpreter = /** @class */ (function () {
    function WearableDataInterpreter() {
    }
    WearableDataInterpreter.getInstance = function () {
        if (!WearableDataInterpreter.instance) {
            WearableDataInterpreter.instance = new WearableDataInterpreter();
        }
        return WearableDataInterpreter.instance;
    };
    /**
     * Interprets wearable data and translates it into practical actions
     */
    WearableDataInterpreter.prototype.interpretWearableData = function (userId, wearableData, context) {
        // Analyze wearable data to generate insights
        var insights = this.analyzeWearableData(wearableData);
        // Generate recommendations based on insights
        var recommendations = this.generateRecommendations(insights, context);
        // Generate adjustments based on insights
        var adjustments = this.generateAdjustments(insights, context);
        // Assess risks based on insights
        var riskAssessment = this.assessRisks(insights);
        return {
            recommendations: recommendations,
            adjustments: adjustments,
            riskAssessment: riskAssessment
        };
    };
    /**
     * Analyzes wearable data to extract meaningful insights
     */
    WearableDataInterpreter.prototype.analyzeWearableData = function (wearableData) {
        var recovery = wearableData.recovery, sleep = wearableData.sleep, activity = wearableData.activity, performance = wearableData.performance;
        // Analyze HRV status
        var hrvStatus;
        if (recovery.hrv >= 70)
            hrvStatus = 'optimal';
        else if (recovery.hrv >= 60)
            hrvStatus = 'good';
        else if (recovery.hrv >= 50)
            hrvStatus = 'fair';
        else if (recovery.hrv >= 40)
            hrvStatus = 'poor';
        else
            hrvStatus = 'critical';
        // Analyze sleep quality
        var sleepQuality;
        if (sleep.quality >= 85)
            sleepQuality = 'optimal';
        else if (sleep.quality >= 75)
            sleepQuality = 'good';
        else if (sleep.quality >= 60)
            sleepQuality = 'fair';
        else if (sleep.quality >= 45)
            sleepQuality = 'poor';
        else
            sleepQuality = 'critical';
        // Analyze stress level
        var stressLevel;
        if (recovery.stress <= 30)
            stressLevel = 'low';
        else if (recovery.stress <= 50)
            stressLevel = 'moderate';
        else if (recovery.stress <= 75)
            stressLevel = 'high';
        else
            stressLevel = 'extreme';
        // Analyze recovery status
        var recoveryStatus;
        var recoveryScore = this.calculateRecoveryScore(wearableData);
        if (recoveryScore >= 85)
            recoveryStatus = 'optimal';
        else if (recoveryScore >= 70)
            recoveryStatus = 'good';
        else if (recoveryScore >= 50)
            recoveryStatus = 'fair';
        else if (recoveryScore >= 30)
            recoveryStatus = 'poor';
        else
            recoveryStatus = 'critical';
        // Analyze training readiness
        var trainingReadiness;
        if (recoveryScore >= 75 && stressLevel === 'low' && sleepQuality !== 'poor' && sleepQuality !== 'critical') {
            trainingReadiness = 'ready';
        }
        else if (recoveryScore >= 50 && stressLevel !== 'extreme') {
            trainingReadiness = 'caution';
        }
        else {
            trainingReadiness = 'rest';
        }
        // Analyze energy level
        var energyLevel;
        var avgRecoveryScore = (recoveryScore + sleep.quality + (100 - recovery.stress)) / 3;
        if (avgRecoveryScore >= 80)
            energyLevel = 'high';
        else if (avgRecoveryScore >= 65)
            energyLevel = 'moderate';
        else if (avgRecoveryScore >= 50)
            energyLevel = 'low';
        else
            energyLevel = 'veryLow';
        // Determine what adjustments are needed
        var rpeAdjustmentNeeded = recoveryScore < 60;
        var volumeAdjustmentNeeded = recoveryScore < 55;
        var intensityAdjustmentNeeded = recoveryScore < 65 || stressLevel === 'high' || stressLevel === 'extreme';
        var restAdjustmentNeeded = sleepQuality === 'poor' || sleepQuality === 'critical' || stressLevel === 'high' || stressLevel === 'extreme';
        var nutritionAdjustmentNeeded = wearableData.vitals.glucose.timeInRange < 70 || wearableData.vitals.hydration.level < 75;
        return {
            hrvStatus: hrvStatus,
            sleepQuality: sleepQuality,
            stressLevel: stressLevel,
            recoveryStatus: recoveryStatus,
            trainingReadiness: trainingReadiness,
            energyLevel: energyLevel,
            rpeAdjustmentNeeded: rpeAdjustmentNeeded,
            volumeAdjustmentNeeded: volumeAdjustmentNeeded,
            intensityAdjustmentNeeded: intensityAdjustmentNeeded,
            restAdjustmentNeeded: restAdjustmentNeeded,
            nutritionAdjustmentNeeded: nutritionAdjustmentNeeded
        };
    };
    /**
     * Calculates a comprehensive recovery score based on wearable metrics
     */
    WearableDataInterpreter.prototype.calculateRecoveryScore = function (wearableData) {
        var recovery = wearableData.recovery, sleep = wearableData.sleep, vitals = wearableData.vitals;
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
        return Math.round(hrvScore + rhrScore + sleepScore + stressScore + bpScore);
    };
    /**
     * Generates recommendations based on wearable insights
     */
    WearableDataInterpreter.prototype.generateRecommendations = function (insights, context) {
        var recommendations = {
            training: [],
            recovery: [],
            nutrition: [],
            lifestyle: []
        };
        // Training recommendations
        if (insights.trainingReadiness === 'rest') {
            recommendations.training.push('Programa un día completo de descanso para permitir la recuperación');
        }
        else if (insights.trainingReadiness === 'caution') {
            recommendations.training.push('Entrena con moderación y reduce la intensidad en un 15-20%');
        }
        if (insights.intensityAdjustmentNeeded) {
            recommendations.training.push('Considera reducir la intensidad del entrenamiento');
        }
        if (insights.volumeAdjustmentNeeded) {
            recommendations.training.push('Reduce el volumen de entrenamiento en un 20-25%');
        }
        if (insights.rpeAdjustmentNeeded) {
            recommendations.training.push('Ajusta tu RPE objetivo a 1-2 puntos por debajo de lo normal');
        }
        // Recovery recommendations
        if (insights.sleepQuality !== 'optimal' && insights.sleepQuality !== 'good') {
            recommendations.recovery.push('Prioriza dormir 7-9 horas para mejorar la recuperación');
        }
        if (insights.hrvStatus === 'poor' || insights.hrvStatus === 'critical') {
            recommendations.recovery.push('Practica respiración diafragmática para mejorar la variabilidad cardíaca');
        }
        if (insights.stressLevel === 'high' || insights.stressLevel === 'extreme') {
            recommendations.recovery.push('Incorpora técnicas de manejo del estrés como meditación o yoga');
        }
        // Nutrition recommendations
        if (insights.nutritionAdjustmentNeeded) {
            recommendations.nutrition.push('Optimiza la composición de comidas y el momento de las ingestas');
        }
        // Lifestyle recommendations
        if (insights.energyLevel === 'low' || insights.energyLevel === 'veryLow') {
            recommendations.lifestyle.push('Considera reducir las actividades no esenciales para conservar energía');
        }
        return recommendations;
    };
    /**
     * Generates adjustments based on wearable insights
     */
    WearableDataInterpreter.prototype.generateAdjustments = function (insights, context) {
        var adjustments = {};
        // Workout adjustments
        if (context.activeWorkout && (insights.intensityAdjustmentNeeded || insights.volumeAdjustmentNeeded || insights.restAdjustmentNeeded)) {
            // Create modification requests based on insights
            var modificationRequest = { type: 'none' };
            if (insights.intensityAdjustmentNeeded && insights.volumeAdjustmentNeeded) {
                modificationRequest = {
                    type: 'intensity_change',
                    value: -15, // Reduce intensity by 15%
                    details: 'Reducing intensity due to poor recovery metrics'
                };
            }
            else if (insights.intensityAdjustmentNeeded) {
                modificationRequest = {
                    type: 'intensity_change',
                    value: -10, // Reduce intensity by 10%
                    details: 'Reducing intensity due to elevated stress or poor HRV'
                };
            }
            else if (insights.volumeAdjustmentNeeded) {
                modificationRequest = {
                    type: 'volume_change',
                    value: -20, // Reduce volume by 20%
                    details: 'Reducing volume due to poor recovery metrics'
                };
            }
            // Apply modifications if needed
            if (modificationRequest.type !== 'none') {
                var modificationResult = real_time_modification_service_1.realTimeModificationService.modifyWorkoutPlan(context.activeWorkout, modificationRequest, context);
                adjustments.workout = modificationResult.modifiedPlan;
            }
        }
        // Nutrition adjustments
        if (context.nutritionData && insights.nutritionAdjustmentNeeded) {
            // In a real implementation, we would adjust nutrition based on wearable data
            // For now, we'll just note that adjustments are needed
            adjustments.nutrition = context.nutritionData;
        }
        // Progression adjustments
        if (context.progressionPlans.length > 0) {
            // In a real implementation, we would adjust progression based on wearable data
            // For now, we'll just note that adjustments might be needed
            adjustments.progression = context.progressionPlans;
        }
        return adjustments;
    };
    /**
     * Assesses risks based on wearable insights
     */
    WearableDataInterpreter.prototype.assessRisks = function (insights) {
        var risks = {
            immediate: [],
            shortTerm: [],
            longTerm: []
        };
        // Immediate risks (today/tomorrow)
        if (insights.trainingReadiness === 'rest') {
            risks.immediate.push('Riesgo de sobreentrenamiento si se entrena hoy');
        }
        if (insights.energyLevel === 'veryLow') {
            risks.immediate.push('Riesgo de lesiones por fatiga extrema');
        }
        // Short-term risks (next week)
        if (insights.hrvStatus === 'poor' || insights.hrvStatus === 'critical') {
            risks.shortTerm.push('Riesgo de sobreentrenamiento en los próximos días');
        }
        if (insights.sleepQuality === 'poor' || insights.sleepQuality === 'critical') {
            risks.shortTerm.push('Rendimiento comprometido en los próximos entrenamientos');
        }
        // Long-term risks (months)
        if (insights.stressLevel === 'high' || insights.stressLevel === 'extreme') {
            risks.longTerm.push('Riesgo de burnout o sobreentrenamiento crónico');
        }
        return risks;
    };
    /**
     * Translates wearable data into specific actionable items
     */
    WearableDataInterpreter.prototype.translateToActions = function (userId, wearableData, context) {
        var insights = this.analyzeWearableData(wearableData);
        // Rest recommendation
        var restRecommendation = {
            shouldRest: insights.trainingReadiness === 'rest',
            reason: this.getRestReason(insights),
            duration: insights.trainingReadiness === 'rest' ? 'day' : undefined
        };
        // Volume adjustment
        var volumeAdjustment = {
            shouldAdjust: insights.volumeAdjustmentNeeded,
            percentage: insights.volumeAdjustmentNeeded ? -20 : 0,
            reason: insights.volumeAdjustmentNeeded ?
                'Volumen reducido debido a métricas de recuperación insuficientes' :
                'No se requiere ajuste de volumen'
        };
        // Intensity adjustment
        var intensityAdjustment = {
            shouldAdjust: insights.intensityAdjustmentNeeded,
            percentage: insights.intensityAdjustmentNeeded ?
                (insights.stressLevel === 'high' || insights.stressLevel === 'extreme' ? -15 : -10) : 0,
            reason: insights.intensityAdjustmentNeeded ?
                'Intensidad reducida debido a estrés elevado o HRV bajo' :
                'No se requiere ajuste de intensidad'
        };
        // Nutrition adjustment
        var nutritionAdjustment = {
            shouldAdjust: insights.nutritionAdjustmentNeeded,
            carbs: wearableData.vitals.glucose.timeInRange < 70 ?
                { increase: true, reason: 'Optimizar disponibilidad de glucosa para entrenamiento' } :
                undefined,
            hydration: wearableData.vitals.hydration.level < 75 ?
                { increase: true, reason: 'Aumentar ingesta de agua para mejorar hidratación' } :
                undefined
        };
        // RPE modification
        var rpeModification = {
            shouldModify: insights.rpeAdjustmentNeeded,
            targetRPE: insights.rpeAdjustmentNeeded ? 6 : 7, // Target RPE 6 if adjustment needed, otherwise 7
            reason: insights.rpeAdjustmentNeeded ?
                'RPE reducido para aliviar carga fisiológica' :
                'RPE objetivo estándar'
        };
        return {
            restRecommendation: restRecommendation,
            volumeAdjustment: volumeAdjustment,
            intensityAdjustment: intensityAdjustment,
            nutritionAdjustment: nutritionAdjustment,
            rpeModification: rpeModification
        };
    };
    /**
     * Gets the reason for rest recommendation
     */
    WearableDataInterpreter.prototype.getRestReason = function (insights) {
        if (insights.energyLevel === 'veryLow') {
            return 'Nivel de energía extremadamente bajo';
        }
        if (insights.hrvStatus === 'critical') {
            return 'HRV críticamente bajo indicando estrés fisiológico elevado';
        }
        if (insights.stressLevel === 'extreme') {
            return 'Nivel de estrés extremo';
        }
        if (insights.sleepQuality === 'critical') {
            return 'Calidad de sueño críticamente baja';
        }
        return 'Recomendación de descanso basada en múltiples métricas';
    };
    return WearableDataInterpreter;
}());
exports.WearableDataInterpreter = WearableDataInterpreter;
exports.wearableDataInterpreter = WearableDataInterpreter.getInstance();
