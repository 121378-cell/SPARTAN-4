"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.realTimeModificationService = exports.RealTimeModificationService = void 0;
var storage_1 = require("./storage");
var RealTimeModificationService = /** @class */ (function () {
    function RealTimeModificationService() {
    }
    RealTimeModificationService.getInstance = function () {
        if (!RealTimeModificationService.instance) {
            RealTimeModificationService.instance = new RealTimeModificationService();
        }
        return RealTimeModificationService.instance;
    };
    /**
     * Detects modification requests from user input
     */
    RealTimeModificationService.prototype.detectModificationRequest = function (input) {
        var lowerInput = input.toLowerCase();
        // Detect exercise change requests
        if (lowerInput.includes('cambiar') && lowerInput.includes('ejercicio')) {
            // Extract exercise name if possible
            var exerciseMatch = lowerInput.match(/(?:cambiar|reemplazar).*?ejercicio.*?(?:por|con)\s+([a-záéíóúüñ\s]+)/);
            return {
                type: 'exercise_change',
                exerciseName: exerciseMatch ? exerciseMatch[1].trim() : undefined,
                details: 'User requested to change an exercise'
            };
        }
        // Detect load reduction requests
        if (lowerInput.includes('reducir') && (lowerInput.includes('carga') || lowerInput.includes('peso'))) {
            var valueMatch = lowerInput.match(/(?:reducir|bajar|menos)\s+(\d+)(?:%|kg|kilos|libras)?/);
            return {
                type: 'load_reduction',
                value: valueMatch ? parseFloat(valueMatch[1]) : 10, // Default 10% reduction
                details: 'User requested to reduce load'
            };
        }
        // Detect load increase requests
        if (lowerInput.includes('aumentar') && (lowerInput.includes('carga') || lowerInput.includes('peso'))) {
            var valueMatch = lowerInput.match(/(?:aumentar|subir|mas|más)\s+(\d+)(?:%|kg|kilos|libras)?/);
            return {
                type: 'load_increase',
                value: valueMatch ? parseFloat(valueMatch[1]) : 5, // Default 5% increase
                details: 'User requested to increase load'
            };
        }
        // Detect intensity change requests
        if (lowerInput.includes('intensidad')) {
            if (lowerInput.includes('aumentar') || lowerInput.includes('más') || lowerInput.includes('subir')) {
                var valueMatch = lowerInput.match(/(?:aumentar|subir|mas|más)\s+(\d+)(?:%|kg|kilos|libras)?/);
                return {
                    type: 'intensity_change',
                    value: valueMatch ? parseFloat(valueMatch[1]) : 5, // Default 5% increase
                    details: 'User requested to increase intensity'
                };
            }
            else if (lowerInput.includes('reducir') || lowerInput.includes('bajar') || lowerInput.includes('menos')) {
                var valueMatch = lowerInput.match(/(?:reducir|bajar|menos)\s+(\d+)(?:%|kg|kilos|libras)?/);
                return {
                    type: 'intensity_change',
                    value: valueMatch ? -parseFloat(valueMatch[1]) : -10, // Default 10% reduction
                    details: 'User requested to reduce intensity'
                };
            }
        }
        // Detect volume change requests
        if (lowerInput.includes('volumen')) {
            if (lowerInput.includes('aumentar') || lowerInput.includes('más') || lowerInput.includes('subir')) {
                var valueMatch = lowerInput.match(/(?:aumentar|subir|mas|más)\s+(\d+)(?:%|kg|kilos|libras)?/);
                return {
                    type: 'volume_change',
                    value: valueMatch ? parseFloat(valueMatch[1]) : 10, // Default 10% increase
                    details: 'User requested to increase volume'
                };
            }
            else if (lowerInput.includes('reducir') || lowerInput.includes('bajar') || lowerInput.includes('menos')) {
                var valueMatch = lowerInput.match(/(?:reducir|bajar|menos)\s+(\d+)(?:%|kg|kilos|libras)?/);
                return {
                    type: 'volume_change',
                    value: valueMatch ? -parseFloat(valueMatch[1]) : -15, // Default 15% reduction
                    details: 'User requested to reduce volume'
                };
            }
        }
        // More flexible detection for intensity and volume changes
        // Detect intensity increase requests
        if ((lowerInput.includes('más') || lowerInput.includes('mas') || lowerInput.includes('aumentar') || lowerInput.includes('subir')) &&
            lowerInput.includes('intensidad')) {
            var valueMatch = lowerInput.match(/(?:más|mas|aumentar|subir).*?intensidad.*?(\d+)(?:%|kg|kilos|libras)?/);
            return {
                type: 'intensity_change',
                value: valueMatch ? parseFloat(valueMatch[1]) : 5, // Default 5% increase
                details: 'User requested to increase intensity'
            };
        }
        // Detect intensity decrease requests
        if ((lowerInput.includes('menos') || lowerInput.includes('reducir') || lowerInput.includes('bajar')) &&
            lowerInput.includes('intensidad')) {
            var valueMatch = lowerInput.match(/(?:menos|reducir|bajar).*?intensidad.*?(\d+)(?:%|kg|kilos|libras)?/);
            return {
                type: 'intensity_change',
                value: valueMatch ? -parseFloat(valueMatch[1]) : -10, // Default 10% reduction
                details: 'User requested to reduce intensity'
            };
        }
        // Detect volume increase requests
        if ((lowerInput.includes('más') || lowerInput.includes('mas') || lowerInput.includes('aumentar') || lowerInput.includes('subir')) &&
            lowerInput.includes('volumen')) {
            var valueMatch = lowerInput.match(/(?:más|mas|aumentar|subir).*?volumen.*?(\d+)(?:%|kg|kilos|libras)?/);
            return {
                type: 'volume_change',
                value: valueMatch ? parseFloat(valueMatch[1]) : 10, // Default 10% increase
                details: 'User requested to increase volume'
            };
        }
        // Detect volume decrease requests
        if ((lowerInput.includes('menos') || lowerInput.includes('reducir') || lowerInput.includes('bajar')) &&
            lowerInput.includes('volumen')) {
            var valueMatch = lowerInput.match(/(?:menos|reducir|bajar).*?volumen.*?(\d+)(?:%|kg|kilos|libras)?/);
            return {
                type: 'volume_change',
                value: valueMatch ? -parseFloat(valueMatch[1]) : -15, // Default 15% reduction
                details: 'User requested to reduce volume'
            };
        }
        return { type: 'none' };
    };
    /**
     * Modifies a workout plan in real-time while maintaining global coherence
     */
    RealTimeModificationService.prototype.modifyWorkoutPlan = function (workoutPlan, modificationRequest, context) {
        // Clone the workout plan to avoid mutating the original
        var modifiedPlan = JSON.parse(JSON.stringify(workoutPlan));
        var adjustments = [];
        var affectedExercises = [];
        var ecosystemImpact = [];
        // Apply modifications based on request type
        switch (modificationRequest.type) {
            case 'exercise_change':
                this.applyExerciseChange(modifiedPlan, modificationRequest, affectedExercises, adjustments);
                break;
            case 'load_reduction':
                this.applyLoadChange(modifiedPlan, -Math.abs(modificationRequest.value || 10), affectedExercises, adjustments);
                break;
            case 'load_increase':
                this.applyLoadChange(modifiedPlan, Math.abs(modificationRequest.value || 5), affectedExercises, adjustments);
                break;
            case 'intensity_change':
                this.applyIntensityChange(modifiedPlan, modificationRequest.value || 5, affectedExercises, adjustments);
                break;
            case 'volume_change':
                this.applyVolumeChange(modifiedPlan, modificationRequest.value || 10, affectedExercises, adjustments);
                break;
            default:
                // No modification needed
                break;
        }
        // Analyze ecosystem impact
        this.analyzeEcosystemImpact(modifiedPlan, modificationRequest, ecosystemImpact);
        // Ensure global coherence
        var coherenceMaintained = this.ensureGlobalCoherence(modifiedPlan, workoutPlan);
        // Update timestamps
        modifiedPlan.updatedAt = new Date();
        return {
            modifiedPlan: modifiedPlan,
            adjustments: adjustments,
            impactAnalysis: {
                affectedExercises: affectedExercises,
                ecosystemImpact: ecosystemImpact,
                coherenceMaintained: coherenceMaintained
            }
        };
    };
    /**
     * Applies exercise change modification
     */
    RealTimeModificationService.prototype.applyExerciseChange = function (plan, request, affectedExercises, adjustments) {
        // For now, we'll modify the first exercise as an example
        // In a real implementation, we would identify the specific exercise to change
        if (plan.days.length > 0 && plan.days[0].exercises.length > 0) {
            var firstExercise = plan.days[0].exercises[0];
            var originalName = firstExercise.name;
            // Change the exercise name (in a real implementation, we would replace with a suitable alternative)
            firstExercise.name = request.exerciseName || "Variaci\u00F3n de ".concat(originalName);
            firstExercise.notes = "Modificado en tiempo real: ".concat(request.details || 'Cambio de ejercicio solicitado');
            affectedExercises.push(originalName);
            adjustments.push({
                exerciseName: originalName,
                adjustmentType: 'volume',
                value: 0, // No numerical change in this case
                reason: "Ejercicio cambiado a ".concat(firstExercise.name),
                confidence: 0.9,
                applied: true
            });
        }
    };
    /**
     * Applies load change modification
     */
    RealTimeModificationService.prototype.applyLoadChange = function (plan, percentageChange, affectedExercises, adjustments) {
        plan.days.forEach(function (day) {
            day.exercises.forEach(function (exercise) {
                // For workout plans, we work with the sets as a number
                // We'll interpret this as a multiplier for load adjustments
                if (exercise.sets) {
                    // We can't directly modify sets since it's a number in workout plans
                    // Instead, we'll add a note about the adjustment
                    affectedExercises.push(exercise.name);
                    adjustments.push({
                        exerciseName: exercise.name,
                        adjustmentType: 'weight',
                        value: percentageChange,
                        reason: percentageChange > 0
                            ? "Aumento de carga solicitado (".concat(percentageChange, "%)")
                            : "Reducci\u00F3n de carga solicitada (".concat(Math.abs(percentageChange), "%)"),
                        confidence: 0.95,
                        applied: true
                    });
                    // Add a note to indicate the change
                    if (exercise.notes) {
                        exercise.notes += " | Carga ajustada en tiempo real: ".concat(percentageChange > 0 ? '+' : '').concat(percentageChange, "%");
                    }
                    else {
                        exercise.notes = "Carga ajustada en tiempo real: ".concat(percentageChange > 0 ? '+' : '').concat(percentageChange, "%");
                    }
                }
            });
        });
    };
    /**
     * Applies intensity change modification
     */
    RealTimeModificationService.prototype.applyIntensityChange = function (plan, percentageChange, affectedExercises, adjustments) {
        // Intensity can be modified by changing weight or reps
        plan.days.forEach(function (day) {
            day.exercises.forEach(function (exercise) {
                // For workout plans, we work with the sets as a number
                // We'll interpret this as a multiplier for intensity adjustments
                if (exercise.sets) {
                    affectedExercises.push(exercise.name);
                    adjustments.push({
                        exerciseName: exercise.name,
                        adjustmentType: 'intensity',
                        value: percentageChange,
                        reason: percentageChange > 0
                            ? "Aumento de intensidad solicitado (".concat(percentageChange, "%)")
                            : "Reducci\u00F3n de intensidad solicitada (".concat(Math.abs(percentageChange), "%)"),
                        confidence: 0.9,
                        applied: true
                    });
                    // Add a note to indicate the change
                    if (exercise.notes) {
                        exercise.notes += " | Intensidad ajustada en tiempo real: ".concat(percentageChange > 0 ? '+' : '').concat(percentageChange, "%");
                    }
                    else {
                        exercise.notes = "Intensidad ajustada en tiempo real: ".concat(percentageChange > 0 ? '+' : '').concat(percentageChange, "%");
                    }
                }
            });
        });
    };
    /**
     * Applies volume change modification
     */
    RealTimeModificationService.prototype.applyVolumeChange = function (plan, percentageChange, affectedExercises, adjustments) {
        // Volume can be modified by changing sets (number of sets)
        plan.days.forEach(function (day) {
            day.exercises.forEach(function (exercise) {
                if (exercise.sets) {
                    // Modify the number of sets
                    var currentSets = exercise.sets;
                    var newSets = Math.max(1, Math.round(currentSets * (1 + percentageChange / 100)));
                    // Update the sets count
                    exercise.sets = newSets;
                    affectedExercises.push(exercise.name);
                    adjustments.push({
                        exerciseName: exercise.name,
                        adjustmentType: 'volume',
                        value: percentageChange,
                        reason: percentageChange > 0
                            ? "Aumento de volumen solicitado (".concat(percentageChange, "%)")
                            : "Reducci\u00F3n de volumen solicitada (".concat(Math.abs(percentageChange), "%)"),
                        confidence: 0.85,
                        applied: true
                    });
                    // Add a note to indicate the change
                    if (exercise.notes) {
                        exercise.notes += " | Volumen ajustado en tiempo real: ".concat(percentageChange > 0 ? '+' : '').concat(percentageChange, "% (").concat(currentSets, " \u2192 ").concat(newSets, " sets)");
                    }
                    else {
                        exercise.notes = "Volumen ajustado en tiempo real: ".concat(percentageChange > 0 ? '+' : '').concat(percentageChange, "% (").concat(currentSets, " \u2192 ").concat(newSets, " sets)");
                    }
                }
            });
        });
    };
    /**
     * Analyzes the impact of modifications on the broader ecosystem
     */
    RealTimeModificationService.prototype.analyzeEcosystemImpact = function (modifiedPlan, modificationRequest, ecosystemImpact) {
        // Analyze impact on progression
        ecosystemImpact.push('Los ajustes de progresión se actualizarán automáticamente basados en las modificaciones.');
        // Analyze impact on recovery
        if (['load_increase', 'intensity_change', 'volume_change'].includes(modificationRequest.type) &&
            (modificationRequest.value || 0) > 0) {
            ecosystemImpact.push('El aumento de carga/intensidad/volumen puede requerir más tiempo de recuperación.');
        }
        else if (['load_reduction', 'intensity_change', 'volume_change'].includes(modificationRequest.type) &&
            (modificationRequest.value || 0) < 0) {
            ecosystemImpact.push('La reducción de carga/intensidad/volumen puede facilitar la recuperación.');
        }
        // Analyze impact on nutrition
        if (['load_increase', 'intensity_change', 'volume_change'].includes(modificationRequest.type) &&
            (modificationRequest.value || 0) > 0) {
            ecosystemImpact.push('El aumento de volumen/intensidad puede requerir un mayor aporte calórico.');
        }
        // Analyze impact on wearable data interpretation
        ecosystemImpact.push('Las métricas de wearables se reevaluarán en base a las nuevas exigencias.');
    };
    /**
     * Ensures global coherence of the modified plan
     */
    RealTimeModificationService.prototype.ensureGlobalCoherence = function (modifiedPlan, originalPlan) {
        // Check that the plan still has a logical structure
        if (!modifiedPlan.days || modifiedPlan.days.length === 0) {
            return false;
        }
        // Check that each day has exercises
        for (var _i = 0, _a = modifiedPlan.days; _i < _a.length; _i++) {
            var day = _a[_i];
            if (!day.exercises || day.exercises.length === 0) {
                return false;
            }
        }
        // Check that the plan focus is still coherent
        if (!modifiedPlan.focus || modifiedPlan.focus.length === 0) {
            modifiedPlan.focus = originalPlan.focus;
        }
        // Check that equipment requirements are still reasonable
        if (!modifiedPlan.equipment || modifiedPlan.equipment.length === 0) {
            modifiedPlan.equipment = originalPlan.equipment;
        }
        // Check that duration is still reasonable
        if (!modifiedPlan.duration || modifiedPlan.duration <= 0) {
            modifiedPlan.duration = originalPlan.duration;
        }
        return true;
    };
    /**
     * Saves the modified plan and updates related systems
     */
    RealTimeModificationService.prototype.saveModifiedPlan = function (userId, originalPlanId, modifiedPlan, adjustments) {
        // Save the modified plan
        storage_1.storageManager.updateWorkoutPlan(originalPlanId, modifiedPlan);
        // Save progression adjustments
        adjustments.forEach(function (adjustment) {
            storage_1.storageManager.addProgressionPlan({
                exerciseName: adjustment.exerciseName,
                currentWeight: 0, // Would be determined from actual data
                recommendedWeight: 0, // Would be determined from actual data
                nextPhase: 'accumulation', // Would be determined from actual data
                adjustments: [adjustment],
                notes: ["Ajuste en tiempo real aplicado: ".concat(adjustment.reason)]
            });
        });
        // Update any related analytics or tracking
        console.log("Plan ".concat(originalPlanId, " modified for user ").concat(userId));
    };
    return RealTimeModificationService;
}());
exports.RealTimeModificationService = RealTimeModificationService;
exports.realTimeModificationService = RealTimeModificationService.getInstance();
