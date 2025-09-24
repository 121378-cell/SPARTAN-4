"use strict";
/**
* Spartan Coach Service - The Disciplined yet Empathetic Mentor
*
* This service defines the personality and functions of the Spartan Coach,
* who is disciplined but empathetic, motivational but technical, capable of
* adapting toughness based on the user's situation. Its role is to accompany,
* teach, and correct.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpartanCoachService = void 0;
var SpartanCoachService = /** @class */ (function () {
    function SpartanCoachService() {
        // Default Spartan personality: disciplined but empathetic, motivational but technical
        this.personality = {
            disciplineLevel: 'adaptive',
            empathyLevel: 'contextual',
            motivationStyle: 'balanced',
            technicalDepth: 'accessible',
            adaptability: 'high'
        };
    }
    /**
     * Generate a Spartan-style coaching message based on user context and situation
     */
    SpartanCoachService.prototype.generateCoachingMessage = function (userContext, userInput) {
        // Determine the appropriate communication style based on context
        var communicationStyle = this.determineCommunicationStyle(userContext);
        // Generate tone modifiers based on user state
        var toneModifiers = this.generateToneModifiers(userContext);
        // Create the core message content
        var messageContent = this.createMessageContent(userContext, communicationStyle, toneModifiers);
        // Add action items and recommendations
        var actionItems = this.generateActionItems(userContext, communicationStyle);
        var recommendations = this.generateRecommendations(userContext);
        return {
            response: messageContent,
            actionItems: actionItems,
            recommendations: recommendations
        };
    };
    /**
     * Determine the appropriate communication style based on user context
     */
    SpartanCoachService.prototype.determineCommunicationStyle = function (context) {
        // Check user's current state and situation
        var recoveryStatus = context.recoveryStatus;
        var wearableInsights = context.wearableInsights;
        var recentWorkouts = context.recentWorkouts;
        // If user is fatigued or stressed, be more mentor-like
        if ((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'high' || (recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'extreme' ||
            ((wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'poor' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.recoveryStatus) === 'critical')) {
            return 'mentor';
        }
        // If user is performing well and ready, be more warrior-like
        if (((recoveryStatus === null || recoveryStatus === void 0 ? void 0 : recoveryStatus.fatigueLevel) === 'low' || (wearableInsights === null || wearableInsights === void 0 ? void 0 : wearableInsights.trainingReadiness) === 'ready') &&
            recentWorkouts.length > 0) {
            // Check if they've been consistent
            var consistency = this.calculateWorkoutConsistency(recentWorkouts);
            if (consistency > 0.8) {
                return 'warrior'; // Challenge them to push further
            }
        }
        // If user is asking technical questions, be more scientist-like
        if (context.currentScreen === 'progression' || context.currentScreen === 'recovery' ||
            context.currentScreen === 'nutrition') {
            return 'scientist';
        }
        // If user seems to be struggling with motivation or goals, be more philosopher-like
        if (this.detectMotivationalStruggle(context)) {
            return 'philosopher';
        }
        // Default to adaptive style that adjusts based on context
        return 'adaptive';
    };
    /**
     * Generate tone modifiers based on user state
     */
    SpartanCoachService.prototype.generateToneModifiers = function (context) {
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
     * Create message content based on communication style and tone modifiers
     */
    SpartanCoachService.prototype.createMessageContent = function (context, style, tone) {
        var message = '';
        switch (style) {
            case 'disciplinarian':
                message = this.createDisciplinarianMessage(context, tone);
                break;
            case 'mentor':
                message = this.createMentorMessage(context, tone);
                break;
            case 'scientist':
                message = this.createScientistMessage(context, tone);
                break;
            case 'warrior':
                message = this.createWarriorMessage(context, tone);
                break;
            case 'philosopher':
                message = this.createPhilosopherMessage(context, tone);
                break;
            case 'adaptive':
            default:
                message = this.createAdaptiveMessage(context, tone);
                break;
        }
        return message;
    };
    /**
     * Create disciplinarian-style message
     */
    SpartanCoachService.prototype.createDisciplinarianMessage = function (context, tone) {
        var _a, _b;
        var baseMessages = [
            "La disciplina es la diferencia entre los campeones y los soñadores. Hoy, elige ser campeón.",
            "No busques excusas, busca soluciones. La grandeza se forja en los momentos difíciles.",
            "Cada repetición es una inversión en tu futuro. Hazlas contar."
        ];
        var message = this.selectRandomMessage(baseMessages);
        // Add recovery context if needed
        if (((_a = context.recoveryStatus) === null || _a === void 0 ? void 0 : _a.fatigueLevel) === 'high' || ((_b = context.recoveryStatus) === null || _b === void 0 ? void 0 : _b.fatigueLevel) === 'extreme') {
            message += " Pero incluso los guerreros necesitan recuperarse. Hoy, prioriza la recuperación.";
        }
        return message;
    };
    /**
     * Create mentor-style message
     */
    SpartanCoachService.prototype.createMentorMessage = function (context, tone) {
        var baseMessages = [
            "Entiendo que hoy no es un día fácil. Pero cada pequeño paso cuenta en tu journey.",
            "Tu cuerpo te está pidiendo descanso. Escúchalo, es tu mayor aliado.",
            "La verdadera fuerza también es saber cuándo recuperarse. Hoy, cuida de ti."
        ];
        var message = this.selectRandomMessage(baseMessages);
        // Add encouragement based on recent progress
        var recentWorkouts = context.recentWorkouts;
        if (recentWorkouts.length > 0) {
            var consistency = this.calculateWorkoutConsistency(recentWorkouts);
            if (consistency > 0.7) {
                message += " Has demostrado consistencia, eso ya es una victoria.";
            }
        }
        return message;
    };
    /**
     * Create scientist-style message
     */
    SpartanCoachService.prototype.createScientistMessage = function (context, tone) {
        var recoveryStatus = context.recoveryStatus;
        var wearableInsights = context.wearableInsights;
        if (context.currentScreen === 'recovery' && recoveryStatus) {
            return "Tus m\u00E9tricas de recuperaci\u00F3n muestran un puntaje de ".concat(recoveryStatus.recoveryScore, "/100. ") +
                "Basado en la fisiolog\u00EDa del entrenamiento, esto indica que tu capacidad de adaptaci\u00F3n es ".concat(this.interpretRecoveryScore(recoveryStatus.recoveryScore), ". ") +
                "Te recomiendo ajustar la intensidad en consecuencia para optimizar tus adaptaciones.";
        }
        if (context.currentScreen === 'progression' && context.progressionPlans.length > 0) {
            var plan = context.progressionPlans[0];
            return "Basado en tus datos de progresi\u00F3n, el ejercicio ".concat(plan.exerciseName, " muestra ") +
                "una tendencia ".concat(plan.adjustments.length > 0 ? 'positiva' : 'estable', ". ") +
                "La ciencia del entrenamiento sugiere ".concat(plan.adjustments.length > 0 ?
                    "un ajuste de ".concat(Math.abs(plan.adjustments[0].value), "% en ").concat(plan.adjustments[0].adjustmentType) :
                    'mantener la carga actual', " para optimizar las adaptaciones.");
        }
        if (context.currentScreen === 'nutrition' && context.nutritionData) {
            var nutrition = context.nutritionData;
            return "Tu ingesta nutricional actual muestra ".concat(nutrition.totalNutrients.calories, " calor\u00EDas. ") +
                "Basado en tus objetivos y actividad, esto representa ".concat(this.evaluateNutritionalAdequacy(nutrition), " ") +
                "en relaci\u00F3n con tus necesidades.";
        }
        // Default scientific message
        return "La ciencia del entrenamiento es clara: la consistencia y la recuperación adecuada " +
            "son los pilares del progreso. Tus datos actuales indican que estás en el camino correcto.";
    };
    /**
     * Create warrior-style message
     */
    SpartanCoachService.prototype.createWarriorMessage = function (context, tone) {
        var baseMessages = [
            "¡Hoy es el día para demostrar de qué estás hecho! La grandeza espera.",
            "Tu cuerpo está listo y tu mente está enfocada. ¡A conquistar nuevos límites!",
            "Cada entrenamiento es una batalla contra tu versión anterior. Hoy, ganas."
        ];
        var message = this.selectRandomMessage(baseMessages);
        // Add specific challenge based on recent performance
        var recentWorkouts = context.recentWorkouts;
        if (recentWorkouts.length > 0) {
            var lastWorkout = recentWorkouts[0];
            if (lastWorkout.exercises.length > 0) {
                var lastExercise = lastWorkout.exercises[0];
                if (lastExercise.sets.length > 0) {
                    var lastSet = lastExercise.sets[lastExercise.sets.length - 1];
                    if (lastSet.reps && lastSet.rpe) {
                        message += " Superando los ".concat(lastSet.reps, " reps al ").concat(lastSet.rpe, " RPE, ") +
                            "hoy puedes ir un paso m\u00E1s all\u00E1.";
                    }
                }
            }
        }
        return message;
    };
    /**
     * Create philosopher-style message
     */
    SpartanCoachService.prototype.createPhilosopherMessage = function (context, tone) {
        var baseMessages = [
            "El verdadero guerrero no se define por sus victorias, sino por cómo se levanta después de cada caída.",
            "La disciplina no es una restricción, es la libertad de convertirte en quien estás destinado a ser.",
            "Cada desafío es una oportunidad para descubrir una fuerza que no sabías que poseías."
        ];
        return this.selectRandomMessage(baseMessages);
    };
    /**
     * Create adaptive message that combines different elements
     */
    SpartanCoachService.prototype.createAdaptiveMessage = function (context, tone) {
        // Start with a balanced message
        var message = "Estoy aquí para guiarte en cada paso de tu journey. ";
        // Add context-specific elements
        var recoveryStatus = context.recoveryStatus;
        var wearableInsights = context.wearableInsights;
        var recentWorkouts = context.recentWorkouts;
        // Recovery context
        if (recoveryStatus) {
            if (recoveryStatus.fatigueLevel === 'low') {
                message += "Veo que estás bien recuperado. ";
            }
            else if (recoveryStatus.fatigueLevel === 'high' || recoveryStatus.fatigueLevel === 'extreme') {
                message += "Detecto que necesitas priorizar la recuperación. ";
            }
        }
        else if (wearableInsights) {
            if (wearableInsights.trainingReadiness === 'ready') {
                message += "Tus métricas indican que estás listo para entrenar. ";
            }
            else if (wearableInsights.trainingReadiness === 'rest') {
                message += "Tus datos biométricos sugieren un día de recuperación. ";
            }
        }
        // Performance context
        if (recentWorkouts.length > 0) {
            var consistency = this.calculateWorkoutConsistency(recentWorkouts);
            if (consistency > 0.8) {
                message += "Tu consistencia es admirable. ";
            }
            else if (consistency < 0.5) {
                message += "Cada nuevo día es una oportunidad para reconstruir el hábito. ";
            }
        }
        // Screen context
        switch (context.currentScreen) {
            case 'dashboard':
                message += "¿En qué puedo ayudarte hoy en tu entrenamiento?";
                break;
            case 'workoutDetail':
                message += "¿Necesitas orientación con tu rutina actual?";
                break;
            case 'recovery':
                message += "Hablemos de cómo optimizar tu recuperación.";
                break;
            case 'progression':
                message += "Veamos cómo podemos ajustar tu progresión.";
                break;
            default:
                message += "Estoy aquí para apoyarte en cada aspecto de tu desarrollo.";
        }
        return message;
    };
    /**
     * Generate action items based on context and communication style
     */
    SpartanCoachService.prototype.generateActionItems = function (context, style) {
        var actions = [];
        switch (style) {
            case 'disciplinarian':
                actions.push("Cumple con tu compromiso diario");
                actions.push("No busques atajos, sigue el plan");
                break;
            case 'mentor':
                actions.push("Prioriza la recuperación hoy");
                actions.push("Escucha a tu cuerpo");
                break;
            case 'scientist':
                actions.push("Registra tus métricas de rendimiento");
                actions.push("Analiza tus datos de recuperación");
                break;
            case 'warrior':
                actions.push("Supera tu último registro");
                actions.push("Enfócate en la intensidad");
                break;
            case 'philosopher':
                actions.push("Reflexiona sobre tu propósito");
                actions.push("Celebra tu progreso");
                break;
            case 'adaptive':
            default:
                // Context-aware actions
                if (context.currentScreen === 'workoutDetail' && context.activeWorkout) {
                    actions.push("Revisa tu rutina actual");
                    actions.push("Prepara tu próxima sesión");
                }
                else if (context.currentScreen === 'recovery') {
                    actions.push("Registra tus métricas de recuperación");
                    actions.push("Planifica tu descanso activo");
                }
                else if (context.currentScreen === 'progression') {
                    actions.push("Evalúa tus ajustes de progresión");
                    actions.push("Planifica tu próxima fase");
                }
                else {
                    actions.push("Define tu objetivo para hoy");
                    actions.push("Comprométete con una acción");
                }
        }
        return actions;
    };
    /**
     * Generate recommendations based on user context
     */
    SpartanCoachService.prototype.generateRecommendations = function (context) {
        var recommendations = [];
        // Recovery-based recommendations
        if (context.recoveryStatus) {
            var recovery = context.recoveryStatus;
            if (recovery.fatigueLevel === 'high' || recovery.fatigueLevel === 'extreme') {
                recommendations.push({
                    type: 'recovery',
                    title: 'Prioriza la recuperación',
                    description: 'Tus métricas indican necesidad de recuperación activa',
                    priority: 'high'
                });
            }
        }
        // Wearable-based recommendations
        if (context.wearableInsights) {
            var wearable = context.wearableInsights;
            if (wearable.trainingReadiness === 'rest') {
                recommendations.push({
                    type: 'recovery',
                    title: 'Día de descanso recomendado',
                    description: 'Tus datos biométricos sugieren un día de recuperación completa',
                    priority: 'high'
                });
            }
            else if (wearable.adjustments.length > 0) {
                recommendations.push({
                    type: 'adjustment',
                    title: 'Ajustes recomendados',
                    description: "Basado en tus m\u00E9tricas: ".concat(wearable.adjustments[0].reason),
                    priority: 'medium'
                });
            }
        }
        // Progression-based recommendations
        if (context.progressionPlans.length > 0) {
            var plan = context.progressionPlans[0];
            if (plan.adjustments.length > 0) {
                recommendations.push({
                    type: 'progression',
                    title: 'Ajuste de progresión',
                    description: "Recomendado para ".concat(plan.exerciseName, ": ").concat(plan.adjustments[0].reason),
                    priority: 'medium'
                });
            }
        }
        return recommendations;
    };
    /**
     * Calculate workout consistency from recent sessions
     */
    SpartanCoachService.prototype.calculateWorkoutConsistency = function (workouts) {
        if (workouts.length === 0)
            return 0;
        // For simplicity, we'll assume consistency based on workout frequency
        // In a real implementation, this would be more sophisticated
        return Math.min(1, workouts.length / 7); // Assuming 7-day period
    };
    /**
     * Detect if user is struggling with motivation
     */
    SpartanCoachService.prototype.detectMotivationalStruggle = function (context) {
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
    SpartanCoachService.prototype.getRecentRecoveryAnalyses = function (days) {
        // This would integrate with the recovery service in a real implementation
        // For now, we'll return an empty array
        return [];
    };
    /**
     * Interpret recovery score in human-readable terms
     */
    SpartanCoachService.prototype.interpretRecoveryScore = function (score) {
        if (score >= 80)
            return "óptima";
        if (score >= 60)
            return "buena";
        if (score >= 40)
            return "moderada";
        return "baja";
    };
    /**
     * Evaluate nutritional adequacy
     */
    SpartanCoachService.prototype.evaluateNutritionalAdequacy = function (nutritionData) {
        // This would be more sophisticated in a real implementation
        return "adecuada";
    };
    /**
     * Select a random message from an array
     */
    SpartanCoachService.prototype.selectRandomMessage = function (messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    };
    /**
     * Provide technical feedback with motivational elements
     */
    SpartanCoachService.prototype.provideTechnicalFeedback = function (exercise, performanceData, context) {
        var communicationStyle = this.determineCommunicationStyle(context);
        var toneModifiers = this.generateToneModifiers(context);
        var feedback = '';
        var actionItems = [];
        // Technical correction with motivational framing
        if (performanceData.formIssues && performanceData.formIssues.length > 0) {
            feedback = "Observo mejoras oportunas en tu t\u00E9cnica de ".concat(exercise, ". ");
            switch (communicationStyle) {
                case 'scientist':
                    feedback += "Desde una perspectiva biomec\u00E1nica, ajustar ".concat(performanceData.formIssues[0], " ") +
                        "optimizar\u00E1 la activaci\u00F3n muscular y reducir\u00E1 el riesgo de lesi\u00F3n.";
                    break;
                case 'disciplinarian':
                    feedback += "La excelencia t\u00E9cnica no es opcional. Corregir ".concat(performanceData.formIssues[0], " ") +
                        "es fundamental para tu progreso.";
                    break;
                case 'mentor':
                    feedback += "Peque\u00F1os ajustes en ".concat(performanceData.formIssues[0], " ") +
                        "har\u00E1n una gran diferencia. Lo est\u00E1s haciendo bien, solo refina tu t\u00E9cnica.";
                    break;
                default:
                    feedback += "Para mejorar tu t\u00E9cnica en ".concat(exercise, ", te sugiero enfocarte en ").concat(performanceData.formIssues[0], ". ") +
                        "Con pr\u00E1ctica y atenci\u00F3n a la forma, ver\u00E1s mejoras r\u00E1pidamente.";
            }
            actionItems = [
                "Practicar la técnica lentamente",
                "Grabar tu forma para auto-corrección",
                "Solicitar feedback adicional si es necesario"
            ];
        }
        else {
            // Positive feedback
            feedback = "Excelente t\u00E9cnica en ".concat(exercise, "! ");
            switch (communicationStyle) {
                case 'warrior':
                    feedback += "Tu forma demuestra el dominio que estás desarrollando. ¡Sigue así!";
                    break;
                case 'scientist':
                    feedback += "Tus patrones de movimiento son eficientes y biomecánicamente óptimos.";
                    break;
                case 'philosopher':
                    feedback += "La excelencia técnica refleja tu compromiso con la mejora continua.";
                    break;
                default:
                    feedback += "Mantén este nivel de ejecución y verás grandes resultados.";
            }
            actionItems = [
                "Mantener este estándar técnico",
                "Aplicar la misma atención a otros ejercicios",
                "Desafiar incrementando carga o complejidad"
            ];
        }
        return {
            response: feedback,
            actionItems: actionItems
        };
    };
    /**
     * Generate wearable data interpretation and practical adjustments
     */
    SpartanCoachService.prototype.interpretWearableData = function (wearableData, context) {
        var communicationStyle = this.determineCommunicationStyle(context);
        var toneModifiers = this.generateToneModifiers(context);
        var interpretation = '';
        var recommendations = [];
        var actionItems = [];
        // Interpret HRV data
        if (wearableData.hrv) {
            interpretation += "Tu HRV actual es ".concat(wearableData.hrv, " ms, lo que indica ");
            if (wearableData.hrv > 80) {
                interpretation += "un excelente estado de recuperación. ";
            }
            else if (wearableData.hrv > 50) {
                interpretation += "un buen estado de recuperación. ";
            }
            else if (wearableData.hrv > 30) {
                interpretation += "una recuperación moderada. ";
            }
            else {
                interpretation += "una recuperación comprometida. ";
            }
        }
        // Interpret sleep data
        if (wearableData.sleep) {
            interpretation += "Dormiste ".concat(wearableData.sleep.duration, " horas con una eficiencia del ").concat(wearableData.sleep.efficiency, "%. ");
            if (wearableData.sleep.efficiency > 85) {
                interpretation += "Excelente calidad de sueño. ";
            }
            else if (wearableData.sleep.efficiency > 70) {
                interpretation += "Buena calidad de sueño. ";
            }
            else {
                interpretation += "Calidad de sueño subóptima. ";
            }
        }
        // Interpret activity data
        if (wearableData.steps && wearableData.calories) {
            interpretation += "Hoy has caminado ".concat(wearableData.steps, " pasos y quemado ").concat(wearableData.calories, " calor\u00EDas. ");
            if (wearableData.steps > 10000) {
                interpretation += "Muy buen nivel de actividad. ";
            }
            else if (wearableData.steps > 7000) {
                interpretation += "Buen nivel de actividad. ";
            }
            else {
                interpretation += "Podrías aumentar tu actividad diaria. ";
            }
        }
        // Provide Spartan-style recommendations based on communication style
        switch (communicationStyle) {
            case 'disciplinarian':
                interpretation += "La disciplina no se negocia. ";
                actionItems = [
                    "Cumple con las recomendaciones sin excusas",
                    "Prioriza la recuperación si es necesario",
                    "Mantén la consistencia en todas las áreas"
                ];
                break;
            case 'mentor':
                interpretation += "Cuida de ti mismo, guerrero. ";
                actionItems = [
                    "Escucha a tu cuerpo hoy",
                    "Prioriza la recuperación si es necesario",
                    "Celebra tus logros diarios"
                ];
                break;
            case 'warrior':
                interpretation += "¡Aprovecha esta información para superarte! ";
                actionItems = [
                    "Usa estos datos para optimizar tu entrenamiento",
                    "Supera tus métricas anteriores",
                    "Enfócate en la excelencia total"
                ];
                break;
            case 'scientist':
                interpretation += "Los datos no mienten. ";
                recommendations = [
                    {
                        type: 'recovery',
                        title: 'Ajuste basado en HRV',
                        description: "Tu HRV de ".concat(wearableData.hrv, " ms sugiere ").concat(this.getHrvRecommendation(wearableData.hrv)),
                        priority: 'high'
                    },
                    {
                        type: 'sleep',
                        title: 'Optimización del sueño',
                        description: "Tu eficiencia de sue\u00F1o del ".concat(wearableData.sleep.efficiency, "% puede mejorarse con ").concat(this.getSleepRecommendation(wearableData.sleep.efficiency)),
                        priority: 'medium'
                    }
                ];
                actionItems = [
                    "Registrar métricas diariamente",
                    "Analizar tendencias a largo plazo",
                    "Ajustar rutinas basadas en datos"
                ];
                break;
            case 'philosopher':
                interpretation += "Cada número cuenta una historia. ";
                actionItems = [
                    "Reflexiona sobre tu progreso diario",
                    "Celebra las pequeñas mejoras",
                    "Encuentra equilibrio entre esfuerzo y recuperación"
                ];
                break;
            default:
                interpretation += "Estoy aquí para guiarte con base en estos datos. ";
                actionItems = [
                    "Revisar recomendaciones diariamente",
                    "Aplicar ajustes según sea necesario",
                    "Mantener consistencia en el seguimiento"
                ];
        }
        return {
            response: interpretation,
            actionItems: actionItems,
            recommendations: recommendations
        };
    };
    /**
     * Get HRV-based recommendation
     */
    SpartanCoachService.prototype.getHrvRecommendation = function (hrv) {
        if (hrv > 80)
            return "mantener la intensidad actual";
        if (hrv > 50)
            return "mantener carga moderada";
        if (hrv > 30)
            return "reducir intensidad en 10-15%";
        return "priorizar recuperación activa";
    };
    /**
     * Get sleep-based recommendation
     */
    SpartanCoachService.prototype.getSleepRecommendation = function (efficiency) {
        if (efficiency > 85)
            return "mantener rutinas actuales";
        if (efficiency > 70)
            return "optimizar horario de sueño";
        return "evaluar factores de interrupción";
    };
    /**
     * Balance science, motivation, and clarity in each interaction
     */
    SpartanCoachService.prototype.balanceCommunicationElements = function (context) {
        var scientificContent = this.generateScientificContent(context);
        var motivationalContent = this.generateMotivationalContent(context);
        var clarityContent = this.generateClarityContent(context);
        return {
            scientificContent: scientificContent,
            motivationalContent: motivationalContent,
            clarityContent: clarityContent
        };
    };
    /**
     * Generate scientific content based on available data
     */
    SpartanCoachService.prototype.generateScientificContent = function (context) {
        var content = '';
        // Add recovery science
        if (context.recoveryStatus) {
            content += "Fisiol\u00F3gicamente, tu cuerpo necesita ".concat(this.calculateRecoveryTime(context.recoveryStatus), " horas para recuperarse completamente. ");
        }
        // Add progression science
        if (context.progressionPlans.length > 0) {
            content += "La ciencia del entrenamiento sugiere aumentar la carga en 2.5-5% semanalmente para optimizar las adaptaciones. ";
        }
        // Add nutrition science
        if (context.nutritionData) {
            content += "Basado en tus necesidades metabólicas, tu ingesta óptima de proteínas es de 1.6-2.2g por kg de peso corporal. ";
        }
        return content;
    };
    /**
     * Generate motivational content based on user progress
     */
    SpartanCoachService.prototype.generateMotivationalContent = function (context) {
        var content = '';
        // Add progress-based motivation
        if (context.recentWorkouts.length > 0) {
            var consistency = this.calculateWorkoutConsistency(context.recentWorkouts);
            if (consistency > 0.8) {
                content += "Tu consistencia es admirable. Cada día que te mantienes fiel a tu compromiso te acerca más a la grandeza. ";
            }
            else if (consistency > 0.5) {
                content += "Cada nuevo día es una oportunidad para reconstruir el hábito. La grandeza no se logra de un día para otro. ";
            }
            else {
                content += "El verdadero guerrero no se define por sus victorias, sino por cómo se levanta después de cada caída. ";
            }
        }
        // Add achievement-based motivation
        if (context.recentWorkouts.length > 0) {
            content += "Has demostrado fuerza de voluntad al llegar hasta aquí. Eso ya es una victoria. ";
        }
        return content;
    };
    /**
     * Generate clarity content to ensure understanding
     */
    SpartanCoachService.prototype.generateClarityContent = function (context) {
        var content = '';
        // Add clear action items
        content += "Para avanzar, enfócate en estos pasos claros: ";
        // Add context-specific clarity
        switch (context.currentScreen) {
            case 'dashboard':
                content += "1. Define tu objetivo para hoy. 2. Comprométete con una acción. 3. Ejecuta con disciplina. ";
                break;
            case 'workoutDetail':
                content += "1. Revisa tu rutina actual. 2. Prepara tu próxima sesión. 3. Ejecuta con precisión técnica. ";
                break;
            case 'recovery':
                content += "1. Registra tus métricas de recuperación. 2. Planifica tu descanso activo. 3. Prioriza la calidad del sueño. ";
                break;
            case 'progression':
                content += "1. Evalúa tus ajustes de progresión. 2. Planifica tu próxima fase. 3. Mantén la consistencia. ";
                break;
            default:
                content += "1. Define tu objetivo para hoy. 2. Comprométete con una acción. 3. Ejecuta con disciplina. ";
        }
        return content;
    };
    /**
     * Calculate recovery time based on recovery status
     */
    SpartanCoachService.prototype.calculateRecoveryTime = function (recoveryStatus) {
        switch (recoveryStatus.fatigueLevel) {
            case 'low': return 24;
            case 'moderate': return 48;
            case 'high': return 72;
            case 'extreme': return 96;
            default: return 48;
        }
    };
    return SpartanCoachService;
}());
exports.SpartanCoachService = SpartanCoachService;
