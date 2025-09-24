"use strict";
/**
 * Predictive Analytics Engine for SPARTAN 4
 * Projects strength, muscle mass, and body composition evolution using AI predictive models
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictiveAnalyticsEngine = exports.PredictiveAnalyticsEngine = void 0;
var PredictiveAnalyticsEngine = /** @class */ (function () {
    function PredictiveAnalyticsEngine() {
    }
    /**
     * Generate predictive insights based on current data and adherence metrics
     */
    PredictiveAnalyticsEngine.prototype.generatePredictions = function (userData, biometricData, adherence, progressReport) {
        console.log("\uD83D\uDD2E Generating predictive insights for user ".concat(userData.name));
        // Generate projections for different timeframes
        var projections = this.calculateProjections(biometricData, adherence, userData);
        // Identify risk factors
        var riskFactors = this.identifyRiskFactors(biometricData, adherence);
        // Find optimization opportunities
        var optimizationOpportunities = this.findOptimizationOpportunities(adherence, biometricData);
        // Generate personalized recommendations
        var personalizedRecommendations = this.generatePersonalizedRecommendations(adherence, biometricData, userData, progressReport);
        return {
            projections: projections,
            riskFactors: riskFactors,
            optimizationOpportunities: optimizationOpportunities,
            personalizedRecommendations: personalizedRecommendations
        };
    };
    /**
     * Calculate evolution projections for different timeframes
     */
    PredictiveAnalyticsEngine.prototype.calculateProjections = function (biometricData, adherence, userData) {
        // Base calculations using adherence and biometric data
        var baseTrainingEffect = this.calculateTrainingEffect(adherence.trainingAdherence, userData.fitnessLevel);
        var baseNutritionEffect = this.calculateNutritionEffect(adherence.nutritionAdherence, biometricData);
        var baseRecoveryEffect = this.calculateRecoveryEffect(adherence.sleepQuality, adherence.stressManagement);
        // Calculate composite effect (weighted average)
        var compositeEffect = (baseTrainingEffect * 0.5 +
            baseNutritionEffect * 0.3 +
            baseRecoveryEffect * 0.2);
        // Generate projections for different timeframes
        return [
            this.generateProjection('1_month', compositeEffect, biometricData, adherence, 1),
            this.generateProjection('3_months', compositeEffect, biometricData, adherence, 3),
            this.generateProjection('6_months', compositeEffect, biometricData, adherence, 6),
            this.generateProjection('1_year', compositeEffect, biometricData, adherence, 12)
        ];
    };
    /**
     * Generate a single projection for a specific timeframe
     */
    PredictiveAnalyticsEngine.prototype.generateProjection = function (timeframe, compositeEffect, biometricData, adherence, months) {
        // Calculate strength gains (in kg)
        var strengthMultiplier = compositeEffect * months * 0.1;
        var currentStrength = {
            squat: 100, // placeholder - would come from actual data
            deadlift: 120, // placeholder - would come from actual data
            benchPress: 80, // placeholder - would come from actual data
            pullUp: 60 // placeholder - would come from actual data
        };
        var projectedStrength = {
            squat: currentStrength.squat * (1 + strengthMultiplier * 0.05),
            deadlift: currentStrength.deadlift * (1 + strengthMultiplier * 0.05),
            benchPress: currentStrength.benchPress * (1 + strengthMultiplier * 0.05),
            pullUp: currentStrength.pullUp * (1 + strengthMultiplier * 0.05)
        };
        // Calculate muscle mass changes
        var muscleMassMultiplier = compositeEffect * months * 0.08;
        var currentMuscleMass = biometricData.muscleMass || 55; // kg
        var projectedMuscleMass = currentMuscleMass * (1 + muscleMassMultiplier * 0.02);
        // Calculate body composition changes
        var bodyFatMultiplier = compositeEffect * months * 0.06;
        var currentBodyFat = biometricData.bodyFatPercentage || 15; // percentage
        var projectedBodyFat = Math.max(5, currentBodyFat - (bodyFatMultiplier * 0.3));
        // Calculate confidence based on adherence consistency
        var confidence = Math.min(100, 70 +
            (adherence.trainingAdherence * 0.1) +
            (adherence.nutritionAdherence * 0.1) +
            (adherence.sleepQuality * 0.05) +
            (adherence.supplementationAdherence * 0.05));
        // Identify key factors influencing the projection
        var keyFactors = this.identifyKeyFactors(adherence, compositeEffect);
        return {
            timeframe: timeframe,
            strength: {
                squat: Math.round(projectedStrength.squat * 10) / 10,
                deadlift: Math.round(projectedStrength.deadlift * 10) / 10,
                benchPress: Math.round(projectedStrength.benchPress * 10) / 10,
                pullUp: Math.round(projectedStrength.pullUp * 10) / 10,
                projectedIncrease: Math.round(strengthMultiplier * 50) / 10
            },
            muscleMass: {
                totalMass: Math.round(projectedMuscleMass * 10) / 10,
                leanMass: Math.round(projectedMuscleMass * 0.95 * 10) / 10, // Assuming 95% lean mass
                projectedIncrease: Math.round(muscleMassMultiplier * 20) / 10
            },
            bodyComposition: {
                bodyFatPercentage: Math.round(projectedBodyFat * 10) / 10,
                visceralFat: Math.max(1, 5 - Math.round(bodyFatMultiplier * 0.5)), // Scale 1-10
                projectedDecrease: Math.round((currentBodyFat - projectedBodyFat) * 10) / 10
            },
            confidence: Math.round(confidence),
            keyFactors: keyFactors
        };
    };
    /**
     * Calculate training effect based on adherence and fitness level
     */
    PredictiveAnalyticsEngine.prototype.calculateTrainingEffect = function (trainingAdherence, fitnessLevel) {
        // Base effect based on adherence
        var baseEffect = trainingAdherence / 100;
        // Adjust for fitness level (beginners see faster initial gains)
        switch (fitnessLevel) {
            case 'beginner':
                baseEffect *= 1.5;
                break;
            case 'intermediate':
                baseEffect *= 1.2;
                break;
            case 'advanced':
                baseEffect *= 0.8;
                break;
        }
        // Cap at 1.0 for realistic projections
        return Math.min(1.0, baseEffect);
    };
    /**
     * Calculate nutrition effect based on adherence and biometric data
     */
    PredictiveAnalyticsEngine.prototype.calculateNutritionEffect = function (nutritionAdherence, biometricData) {
        // Base effect based on adherence
        var baseEffect = nutritionAdherence / 100;
        // Adjust based on current body composition
        if (biometricData.bodyFatPercentage > 20) {
            // Higher potential for improvement if starting with higher body fat
            baseEffect *= 1.2;
        }
        else if (biometricData.bodyFatPercentage < 10) {
            // Diminishing returns at very low body fat
            baseEffect *= 0.8;
        }
        return Math.min(1.0, baseEffect);
    };
    /**
     * Calculate recovery effect based on sleep quality and stress management
     */
    PredictiveAnalyticsEngine.prototype.calculateRecoveryEffect = function (sleepQuality, stressManagement) {
        // Combined effect of sleep and stress management
        var combinedRecovery = (sleepQuality * 0.7 + stressManagement * 0.3) / 100;
        return Math.min(1.0, combinedRecovery);
    };
    /**
     * Identify key factors influencing the projections
     */
    PredictiveAnalyticsEngine.prototype.identifyKeyFactors = function (adherence, compositeEffect) {
        var factors = [];
        if (adherence.trainingAdherence < 80) {
            factors.push('Aumentar adherencia al entrenamiento para maximizar ganancias');
        }
        if (adherence.nutritionAdherence < 75) {
            factors.push('Mejorar adherencia nutricional para optimizar composición corporal');
        }
        if (adherence.sleepQuality < 70) {
            factors.push('Optimizar calidad del sueño para mejorar recuperación');
        }
        if (compositeEffect > 0.8) {
            factors.push('Excelente progreso proyectado con adherencia actual');
        }
        else if (compositeEffect < 0.4) {
            factors.push('Progreso limitado - necesitas mejorar múltiples factores');
        }
        return factors;
    };
    /**
     * Identify risk factors that could impede progress
     */
    PredictiveAnalyticsEngine.prototype.identifyRiskFactors = function (biometricData, adherence) {
        var riskFactors = [];
        // High body fat percentage
        if (biometricData.bodyFatPercentage > 25) {
            riskFactors.push('Porcentaje de grasa corporal elevado - riesgo cardiovascular');
        }
        // Poor sleep quality
        if (adherence.sleepQuality < 60) {
            riskFactors.push('Calidad de sueño deficiente - afecta recuperación y crecimiento muscular');
        }
        // High stress levels
        if (adherence.stressManagement < 50) {
            riskFactors.push('Altos niveles de estrés - puede impedir progresos en fuerza y composición');
        }
        // Poor nutrition adherence
        if (adherence.nutritionAdherence < 60) {
            riskFactors.push('Baja adherencia nutricional - limita síntesis proteica y recuperación');
        }
        // Elevated blood pressure
        if (biometricData.bloodPressure.systolic > 140 || biometricData.bloodPressure.diastolic > 90) {
            riskFactors.push('Presión arterial elevada - consultar con profesional de la salud');
        }
        // Low HRV (Heart Rate Variability)
        if (biometricData.heartRateVariability < 40) {
            riskFactors.push('Baja variabilidad cardíaca - indicador de estrés y mala recuperación');
        }
        return riskFactors;
    };
    /**
     * Find optimization opportunities to accelerate progress
     */
    PredictiveAnalyticsEngine.prototype.findOptimizationOpportunities = function (adherence, biometricData) {
        var opportunities = [];
        // Training optimization
        if (adherence.trainingAdherence < 90) {
            opportunities.push('Aumentar adherencia al entrenamiento al 90%+ para maximizar ganancias');
        }
        // Nutrition optimization
        if (adherence.nutritionAdherence < 85) {
            opportunities.push('Mejorar adherencia nutricional al 85%+ para optimizar composición corporal');
        }
        // Sleep optimization
        if (adherence.sleepQuality < 80) {
            opportunities.push('Optimizar calidad del sueño al 80%+ para mejorar recuperación');
        }
        // Supplementation optimization
        if (adherence.supplementationAdherence < 70) {
            opportunities.push('Mejorar adherencia a suplementación recomendada');
        }
        // Body composition optimization
        if (biometricData.bodyFatPercentage > 15) {
            opportunities.push('Enfocar en reducción de grasa corporal para mejorar relación fuerza/peso');
        }
        return opportunities;
    };
    /**
     * Generate personalized recommendations based on current metrics
     */
    PredictiveAnalyticsEngine.prototype.generatePersonalizedRecommendations = function (adherence, biometricData, userData, progressReport) {
        var recommendations = [];
        // Training recommendations
        if (adherence.trainingAdherence < 85) {
            recommendations.push('Aumenta tu adherencia al entrenamiento al 85% o más para maximizar ganancias de fuerza');
        }
        else {
            recommendations.push('Mantén tu excelente adherencia al entrenamiento y considera aumentar la intensidad');
        }
        // Nutrition recommendations
        if (adherence.nutritionAdherence < 80) {
            recommendations.push('Mejora tu adherencia nutricional para optimizar la síntesis proteica y recuperación');
        }
        // Recovery recommendations
        if (adherence.sleepQuality < 75) {
            recommendations.push('Prioriza 7-9 horas de sueño de calidad para optimizar la recuperación hormonal');
        }
        // Body composition recommendations
        if (biometricData.bodyFatPercentage > 18) {
            recommendations.push("Enf\u00F3cate en una dieta ligeramente deficitaria para reducir grasa corporal del ".concat(biometricData.bodyFatPercentage, "% al 15%"));
        }
        else if (biometricData.bodyFatPercentage < 10) {
            recommendations.push('Considera un enfoque de mantenimiento para preservar masa muscular mientras mejoras fuerza');
        }
        // Supplementation recommendations
        if (adherence.supplementationAdherence < 70) {
            recommendations.push('Aumenta tu adherencia a suplementos como proteína, creatina y omega-3');
        }
        // Stress management recommendations
        if (adherence.stressManagement < 70) {
            recommendations.push('Incorpora técnicas de manejo del estrés como meditación o respiración diafragmática');
        }
        // Fitness level specific recommendations
        switch (userData.fitnessLevel) {
            case 'beginner':
                recommendations.push('Como principiante, enfócate en la técnica y la consistencia antes que en la intensidad');
                break;
            case 'intermediate':
                recommendations.push('Como nivel intermedio, considera periodización para romper mesetas');
                break;
            case 'advanced':
                recommendations.push('Como nivel avanzado, enfócate en micro-optimizaciones y recuperación');
                break;
        }
        return recommendations;
    };
    /**
     * Update projections based on new data
     */
    PredictiveAnalyticsEngine.prototype.updateProjections = function (currentProjections, newBiometricData, newAdherence, userData) {
        console.log('🔄 Updating projections with new data');
        return this.calculateProjections(newBiometricData, newAdherence, userData);
    };
    return PredictiveAnalyticsEngine;
}());
exports.PredictiveAnalyticsEngine = PredictiveAnalyticsEngine;
// Export singleton instance
exports.predictiveAnalyticsEngine = new PredictiveAnalyticsEngine();
