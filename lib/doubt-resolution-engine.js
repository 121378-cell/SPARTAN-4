"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubtResolutionEngine = void 0;
var spartan_coach_service_1 = require("./spartan-coach-service");
var knowledge_base_service_1 = require("./knowledge-base-service");
var conversationalCoach_1 = require("./conversationalCoach");
var DoubtResolutionEngine = /** @class */ (function () {
    function DoubtResolutionEngine() {
        this.knowledgeBase = new knowledge_base_service_1.KnowledgeBaseService();
        this.spartanCoach = new spartan_coach_service_1.SpartanCoachService();
        this.conversationalCoach = new conversationalCoach_1.ConversationalCoach();
    }
    /**
     * Enhanced doubt resolution with access to complete Spartan knowledge base
     * This method orchestrates access to all knowledge domains and provides
     * reliable, practical, and personalized answers
     */
    DoubtResolutionEngine.prototype.resolveDoubt = function (input, context) {
        console.log('🧠 Resolving doubt with full knowledge base access:', input);
        // 1. Categorize the doubt with confidence scoring
        var doubtCategory = this.categorizeDoubt(input, context);
        // 2. Extract specific entities (exercises, foods, body parts, etc.)
        var entities = this.extractEntities(input, doubtCategory);
        // 3. Generate response based on category and entities
        var responseDetails = this.generateResponseByCategory(input, context, doubtCategory, entities);
        // 4. Personalize based on user context
        var personalizedResponse = this.personalizeResponse(responseDetails.response, context, entities);
        // 5. Add scientific backing
        var scientificBasis = this.getScientificBasis(doubtCategory, entities);
        return {
            category: doubtCategory,
            confidence: responseDetails.confidence,
            response: personalizedResponse,
            actionItems: responseDetails.actionItems,
            personalized: true,
            scientificBasis: scientificBasis
        };
    };
    /**
     * Resolve ambiguous questions by gathering more information and making educated assumptions
     */
    DoubtResolutionEngine.prototype.resolveAmbiguousQuestion = function (input, context) {
        console.log('🧠 Resolving ambiguous question:', input);
        // Analyze context to make educated assumptions
        var assumptions = this.makeContextualAssumptions(context);
        // Generate response with clarification request and possible interpretations
        var response = "Entiendo que tienes una pregunta, pero necesito un poco más de información para ayudarte de la mejor manera. ";
        // Add context-based assumptions
        if (assumptions.length > 0) {
            response += "Basado en tu actividad reciente, podrías estar preguntando sobre: \n\n";
            assumptions.forEach(function (assumption, index) {
                response += "".concat(index + 1, ". ").concat(assumption.question, ": ").concat(assumption.explanation, "\n");
            });
            response += "\n¿Alguna de estas interpretaciones es correcta? ¿O te refieres a algo diferente?";
        }
        else {
            // Generic clarification request
            response += "¿Podrías especificar un poco más? Por ejemplo:\n";
            response += "• ¿Tienes una duda sobre tu entrenamiento?\n";
            response += "• ¿Necesitas orientación nutricional?\n";
            response += "• ¿Tienes preguntas sobre tu recuperación?\n";
            response += "• ¿Necesitas motivación o ánimo?\n";
        }
        // Add action items for clarification
        var actionItems = assumptions.length > 0
            ? assumptions.map(function (a) { return a.question; })
            : ['Entrenamiento', 'Nutrición', 'Recuperación', 'Motivación'];
        return {
            response: response,
            actionItems: actionItems
        };
    };
    /**
     * Provide technical answers with scientific backing and practical application
     */
    DoubtResolutionEngine.prototype.resolveTechnicalQuestion = function (input, context) {
        console.log('🔬 Resolving technical question:', input);
        // Use enhanced doubt resolution engine
        var resolvedDoubt = this.resolveDoubt(input, context);
        // Format response with scientific backing
        var response = resolvedDoubt.response;
        // Add scientific basis if available
        if (resolvedDoubt.scientificBasis.length > 0) {
            response += "\n\n🔬 **BASE CIENTÍFICA:**\n";
            resolvedDoubt.scientificBasis.forEach(function (basis, index) {
                response += "".concat(index + 1, ". ").concat(basis, "\n");
            });
        }
        return {
            response: response,
            actionItems: resolvedDoubt.actionItems
        };
    };
    /**
     * Provide motivational support tailored to user state with contextual guidance
     */
    DoubtResolutionEngine.prototype.resolveMotivationalQuestion = function (input, context) {
        console.log('🔥 Resolving motivational question:', input);
        // Analyze user psychology and recent performance
        var psychologyProfile = this.analyzeUserPsychology(context);
        // Generate personalized encouragement using Spartan Coach
        var spartanResponse = this.spartanCoach.generateCoachingMessage(context, input);
        // Enhance with specific motivational elements
        var response = spartanResponse.response;
        // Add progress highlights
        var progressHighlights = this.getProgressHighlights(context);
        if (progressHighlights) {
            response += "\n\n".concat(progressHighlights);
        }
        // Add goal reinforcement
        var goalReinforcement = this.getGoalReinforcement(context);
        if (goalReinforcement) {
            response += "\n\n".concat(goalReinforcement);
        }
        // Add actionable next steps
        var nextSteps = this.getActionableNextSteps(context);
        if (nextSteps) {
            response += "\n\n".concat(nextSteps);
        }
        return {
            response: response,
            actionItems: spartanResponse.actionItems || ['Continuar entrenando', 'Revisar metas', 'Celebrar progreso']
        };
    };
    /**
     * Categorize doubt with confidence scoring based on keywords and context
     */
    DoubtResolutionEngine.prototype.categorizeDoubt = function (input, context) {
        var lowerInput = input.toLowerCase();
        // Define categories with keywords and confidence weights
        var categories = [
            {
                type: 'training',
                confidence: 0,
                keywords: ['ejercicio', 'rutina', 'entrenamiento', 'series', 'repeticiones', 'peso', 'forma', 'técnica', 'movimiento', 'ejercitar', 'sentadilla', 'press de banca', 'peso muerto', 'dominadas', 'fondos', 'press militar', 'remo con barra', 'curl de bíceps', 'french press', 'zancadas', 'hip thrust', 'plancha', 'burpees', 'mountain climbers']
            },
            {
                type: 'nutrition',
                confidence: 0,
                keywords: ['comida', 'nutrición', 'calorías', 'proteína', 'carbohidratos', 'grasas', 'comer', 'dieta', 'alimento', 'macro', 'micronutriente', 'pollo', 'arroz', 'pasta', 'huevos', 'leche', 'yogur', 'avena', 'plátano', 'manzana', 'naranja', 'atún', 'salmón', 'carne', 'verduras', 'frutas']
            },
            {
                type: 'biomechanics',
                confidence: 0,
                keywords: ['movimiento', 'lesión', 'dolor', 'articulación', 'músculo', 'tensión', 'compensación', 'postura', 'mobilidad', 'flexibilidad', 'hombros', 'espalda', 'cuello', 'caderas', 'rodillas', 'tobillos', 'codos', 'muñecas']
            },
            {
                type: 'recovery',
                confidence: 0,
                keywords: ['descanso', 'recuperación', 'sueño', 'fatiga', 'cansado', 'energía', 'estrés', 'relajación', 'masaje', 'estiramiento', 'dormir']
            },
            {
                type: 'program_design',
                confidence: 0,
                keywords: ['plan', 'programa', 'fase', 'periodización', 'progresión', 'carga', 'volumen', 'intensidad', 'deload', 'mesociclo']
            },
            {
                type: 'supplementation',
                confidence: 0,
                keywords: ['suplemento', 'creatina', 'proteína', 'vitamina', 'mineral', 'aminoácido', 'pre-entreno', 'post-entreno']
            },
            {
                type: 'psychology',
                confidence: 0,
                keywords: ['motivación', 'ánimo', 'mental', 'confianza', 'enfoque', 'concentración', 'voluntad', 'disciplina', 'hábito']
            }
        ];
        // Score each category based on keyword matches
        categories.forEach(function (category) {
            var matches = category.keywords.filter(function (keyword) { return lowerInput.includes(keyword); });
            category.confidence = matches.length / category.keywords.length;
        });
        // Boost confidence based on context clues
        if (context.currentScreen === 'workoutDetail' || context.currentScreen === 'dashboard') {
            var trainingCategory = categories.find(function (c) { return c.type === 'training'; });
            if (trainingCategory)
                trainingCategory.confidence += 0.2;
        }
        if (context.currentScreen === 'nutrition' || context.currentScreen === 'nutritionDashboard') {
            var nutritionCategory = categories.find(function (c) { return c.type === 'nutrition'; });
            if (nutritionCategory)
                nutritionCategory.confidence += 0.2;
        }
        if (context.currentScreen === 'recovery' || context.currentScreen === 'recoveryDashboard') {
            var recoveryCategory = categories.find(function (c) { return c.type === 'recovery'; });
            if (recoveryCategory)
                recoveryCategory.confidence += 0.2;
        }
        // Find the category with highest confidence
        var bestCategory = categories.reduce(function (prev, current) {
            return (prev.confidence > current.confidence) ? prev : current;
        });
        // If no category has significant confidence, default to general
        if (bestCategory.confidence < 0.1) {
            return {
                type: 'general',
                confidence: 0.5,
                keywords: []
            };
        }
        return bestCategory;
    };
    /**
     * Extract specific entities from input based on category
     */
    DoubtResolutionEngine.prototype.extractEntities = function (input, category) {
        var lowerInput = input.toLowerCase();
        var entities = {};
        switch (category.type) {
            case 'training':
                // Extract exercise names
                entities.exercise = this.extractExerciseName(lowerInput);
                // Extract training parameters
                entities.sets = this.extractNumberPattern(lowerInput, /(\d+)\s*series/);
                entities.reps = this.extractNumberPattern(lowerInput, /(\d+)\s*repeticiones/);
                entities.weight = this.extractNumberPattern(lowerInput, /(\d+(?:\.\d+)?)\s*(?:kg|kilos)/);
                break;
            case 'nutrition':
                // Extract food names
                entities.food = this.extractFoodName(lowerInput);
                // Extract nutritional parameters
                entities.calories = this.extractNumberPattern(lowerInput, /(\d+)\s*(?:calorías|cal)/);
                entities.protein = this.extractNumberPattern(lowerInput, /(\d+)\s*(?:g\s*de\s*proteína|gramos\s*de\s*proteína)/);
                break;
            case 'biomechanics':
                // Extract body parts
                entities.bodyPart = this.extractBodyPart(lowerInput);
                // Extract pain/symptom descriptions
                entities.painLevel = this.extractPainLevel(lowerInput);
                break;
            case 'recovery':
                // Extract recovery aspects
                entities.aspect = lowerInput.includes('sueño') ? 'sleep' :
                    lowerInput.includes('estrés') ? 'stress' :
                        lowerInput.includes('masaje') ? 'massage' : 'general';
                break;
        }
        return entities;
    };
    /**
     * Generate response based on category and extracted entities
     */
    DoubtResolutionEngine.prototype.generateResponseByCategory = function (input, context, category, entities) {
        var response = "";
        var actionItems = [];
        var confidence = category.confidence;
        switch (category.type) {
            case 'training':
                if (entities.exercise) {
                    var exerciseInfo = this.knowledgeBase.getExerciseInformation(entities.exercise);
                    response = this.formatExerciseResponse(exerciseInfo, context);
                    actionItems = ['Ver técnica detallada', 'Entender progresión', 'Evitar errores comunes'];
                    confidence = 0.9; // High confidence when we have specific exercise info
                }
                else {
                    response = "Para darte una respuesta técnica precisa sobre entrenamiento, necesito saber de qué ejercicio estás preguntando. " +
                        "¿Podrías especificar? Por ejemplo: '¿Cómo hago una sentadilla?' o '¿Cuántas series debo hacer de press de banca?'";
                    actionItems = ['Especificar ejercicio', 'Ver rutina actual', 'Consultar técnica general'];
                    confidence = 0.6; // Medium confidence for general training questions
                }
                break;
            case 'nutrition':
                if (entities.food) {
                    var nutritionInfo = this.knowledgeBase.getNutritionalInformation(entities.food);
                    response = this.formatNutritionResponse(nutritionInfo, context);
                    actionItems = ['Plan nutricional', 'Timing de comidas', 'Suplementación'];
                    confidence = 0.9;
                }
                else {
                    response = "Para darte una respuesta nutricional precisa, necesito saber de qué alimento o aspecto de la nutrición estás preguntando. " +
                        "¿Podrías especificar? Por ejemplo: '¿Cuántas proteínas tiene el pollo?' o '¿Cuándo debo comer antes de entrenar?'";
                    actionItems = ['Especificar alimento', 'Consultar macros', 'Timing nutricional'];
                    confidence = 0.6;
                }
                break;
            case 'biomechanics':
                if (entities.bodyPart) {
                    var preventionInfo = this.knowledgeBase.getInjuryPreventionStrategies(entities.bodyPart);
                    response = this.formatBiomechanicsResponse(preventionInfo, context);
                    actionItems = ['Corrección de técnica', 'Prevención de lesiones', 'Ejercicios correctivos'];
                    confidence = 0.9;
                }
                else {
                    response = "Para darte una respuesta sobre biomecánica o prevención de lesiones, necesito saber qué parte del cuerpo te preocupa. " +
                        "¿Podrías especificar? Por ejemplo: '¿Cómo evitar lesiones en los hombros?' o '¿Qué puedo hacer por el dolor de espalda?'";
                    actionItems = ['Especificar zona', 'Consultar prevención general', 'Ver ejercicios correctivos'];
                    confidence = 0.6;
                }
                break;
            case 'recovery':
                var recoveryResponse = this.generateRecoveryResponse(input, context, entities);
                response = recoveryResponse.response;
                actionItems = recoveryResponse.actionItems;
                confidence = recoveryResponse.confidence;
                break;
            case 'program_design':
                var programInfo = this.knowledgeBase.getProgramDesignPrinciples(context.userData.goals[0] || 'general fitness', context.userData.fitnessLevel);
                response = this.formatProgramDesignResponse(programInfo, context);
                actionItems = ['Ver fases del programa', 'Entender periodización', 'Planificar deload'];
                confidence = 0.8;
                break;
            case 'supplementation':
                var supplementAdvice = this.knowledgeBase.getSupplementGuidance(context.userData.goals[0] || 'general fitness', [] // No restrictions for now
                );
                response = this.formatSupplementResponse(supplementAdvice, context);
                actionItems = ['Ver dosis recomendadas', 'Timing de suplementos', 'Precauciones'];
                confidence = 0.8;
                break;
            case 'psychology':
                // Use Spartan Coach for psychology/motivation
                var spartanResponse = this.spartanCoach.generateCoachingMessage(context, input);
                response = spartanResponse.response;
                actionItems = spartanResponse.actionItems || ['Continuar entrenando', 'Revisar metas', 'Celebrar progreso'];
                confidence = 0.7;
                break;
            case 'general':
            default:
                response = "Para darte una respuesta precisa, necesito saber más sobre tu pregunta. " +
                    "¿Te refieres a entrenamiento, nutrición, biomecánica, recuperación o algún otro aspecto? " +
                    "Por ejemplo: '¿Cómo hago una sentadilla?' o '¿Cuántas proteínas debo comer?'";
                actionItems = ['Entrenamiento', 'Nutrición', 'Recuperación', 'Técnica'];
                confidence = 0.5;
        }
        return { response: response, actionItems: actionItems, confidence: confidence };
    };
    /**
     * Personalize response based on user context and extracted entities
     */
    DoubtResolutionEngine.prototype.personalizeResponse = function (response, context, entities) {
        // Add user's fitness level context
        var fitnessLevel = context.userData.fitnessLevel || 'intermediate';
        var personalizedResponse = response;
        // Add fitness level specific advice
        if (fitnessLevel === 'beginner') {
            personalizedResponse += "\n\n🎯 **PARA PRINCIPIANTES:** Recuerda enfocarte en la técnica antes que en la carga. Progresa gradualmente.";
        }
        else if (fitnessLevel === 'advanced') {
            personalizedResponse += "\n\n🎯 **PARA ATLETAS AVANZADOS:** Puedes enfocarte en variaciones más complejas y periodización avanzada.";
        }
        // Add recovery context if relevant
        if (context.recoveryStatus && context.recoveryStatus.fatigueLevel !== 'low') {
            personalizedResponse += "\n\n\uD83D\uDCA1 **CONTEXTO DE RECUPERACI\u00D3N:** Dado que tu nivel de fatiga es ".concat(context.recoveryStatus.fatigueLevel, ", considera ajustar la intensidad.");
        }
        return personalizedResponse;
    };
    /**
     * Get scientific basis for the response
     */
    DoubtResolutionEngine.prototype.getScientificBasis = function (category, entities) {
        var scientificBasis = [];
        switch (category.type) {
            case 'training':
                scientificBasis.push("La técnica correcta reduce el riesgo de lesiones en un 50-70% según estudios biomecánicos");
                scientificBasis.push("La progresión de carga controlada optimiza las adaptaciones musculares (Zatsiorsky, 2006)");
                break;
            case 'nutrition':
                scientificBasis.push("La distribución de proteínas a lo largo del día maximiza la síntesis de proteínas musculares (Phillips, 2014)");
                scientificBasis.push("El timing nutricional post-entreno mejora la recuperación y adaptación (Ivy, 2008)");
                break;
            case 'biomechanics':
                scientificBasis.push("La prevención de lesiones reduce la incidencia en un 60-80% con intervención adecuada (Soligard, 2008)");
                scientificBasis.push("La movilidad articular es fundamental para el rendimiento óptimo (Page, 2012)");
                break;
            case 'recovery':
                scientificBasis.push("El sueño de calidad es esencial para la recuperación y el crecimiento muscular (Dattilo, 2011)");
                scientificBasis.push("La gestión del estrés mejora el rendimiento y reduce el riesgo de sobreentrenamiento (Kellmann, 2018)");
                break;
            case 'program_design':
                scientificBasis.push("La periodización optimiza el rendimiento y previene el estancamiento (Issurin, 2010)");
                scientificBasis.push("La sobrecarga progresiva es el principio fundamental de la adaptación fisiológica (Kraemer, 2004)");
                break;
            case 'supplementation':
                scientificBasis.push("La creatina monohidratada es uno de los suplementos más respaldados científicamente (Cooper, 2012)");
                scientificBasis.push("La proteína en polvo ayuda a alcanzar los requerimientos diarios de aminoácidos esenciales (Phillips, 2011)");
                break;
        }
        return scientificBasis;
    };
    /**
     * Make contextual assumptions based on user data
     */
    DoubtResolutionEngine.prototype.makeContextualAssumptions = function (context) {
        var assumptions = [];
        // Check for recent workouts
        if (context.recentWorkouts && context.recentWorkouts.length > 0) {
            assumptions.push({
                question: "Sobre tu entrenamiento reciente",
                explanation: "Vi que has estado entrenando recientemente. ¿Tienes dudas sobre algún ejercicio o rutina?"
            });
        }
        // Check for active workout
        if (context.activeWorkout) {
            assumptions.push({
                question: "Sobre tu rutina actual",
                explanation: "Est\u00E1s trabajando en \"".concat(context.activeWorkout.name, "\". \u00BFNecesitas ayuda con alg\u00FAn aspecto espec\u00EDfico?")
            });
        }
        // Check recovery status
        if (context.recoveryStatus) {
            assumptions.push({
                question: "Sobre tu recuperación",
                explanation: "Tu nivel de fatiga es ".concat(context.recoveryStatus.fatigueLevel, ". \u00BFTienes dudas sobre c\u00F3mo recuperarte mejor?")
            });
        }
        // Check nutrition data
        if (context.nutritionData) {
            assumptions.push({
                question: "Sobre tu nutrición",
                explanation: "Tienes datos nutricionales registrados. ¿Tienes preguntas sobre tu alimentación?"
            });
        }
        return assumptions;
    };
    /**
     * Extract exercise name from input
     */
    DoubtResolutionEngine.prototype.extractExerciseName = function (input) {
        var lowerInput = input.toLowerCase();
        // Common exercise names
        var exercises = [
            'sentadilla', 'press de banca', 'peso muerto', 'dominadas', 'fondos',
            'press militar', 'remo con barra', 'curl de bíceps', 'french press',
            'zancadas', 'hip thrust', 'plancha', 'burpees', 'mountain climbers'
        ];
        for (var _i = 0, exercises_1 = exercises; _i < exercises_1.length; _i++) {
            var exercise = exercises_1[_i];
            if (lowerInput.includes(exercise)) {
                return exercise;
            }
        }
        return null;
    };
    /**
     * Extract food name from input
     */
    DoubtResolutionEngine.prototype.extractFoodName = function (input) {
        var lowerInput = input.toLowerCase();
        // Common food names
        var foods = [
            'pollo', 'arroz', 'pasta', 'huevos', 'leche', 'yogur', 'avena', 'plátano',
            'manzana', 'naranja', 'atún', 'salmón', 'carne', 'verduras', 'frutas'
        ];
        for (var _i = 0, foods_1 = foods; _i < foods_1.length; _i++) {
            var food = foods_1[_i];
            if (lowerInput.includes(food)) {
                return food;
            }
        }
        return null;
    };
    /**
     * Extract body part from input
     */
    DoubtResolutionEngine.prototype.extractBodyPart = function (input) {
        var lowerInput = input.toLowerCase();
        // Common body parts
        var bodyParts = [
            'hombros', 'espalda', 'cuello', 'caderas', 'rodillas', 'tobillos', 'codos', 'muñecas'
        ];
        for (var _i = 0, bodyParts_1 = bodyParts; _i < bodyParts_1.length; _i++) {
            var part = bodyParts_1[_i];
            if (lowerInput.includes(part)) {
                return part;
            }
        }
        return null;
    };
    /**
     * Extract number pattern from input
     */
    DoubtResolutionEngine.prototype.extractNumberPattern = function (input, pattern) {
        var match = input.match(pattern);
        return match ? parseFloat(match[1]) : null;
    };
    /**
     * Extract pain level from input
     */
    DoubtResolutionEngine.prototype.extractPainLevel = function (input) {
        var lowerInput = input.toLowerCase();
        if (lowerInput.includes('mucho') || lowerInput.includes('intenso') || lowerInput.includes('fuerte')) {
            return 8; // High pain level
        }
        else if (lowerInput.includes('moderado') || lowerInput.includes('medio')) {
            return 5; // Medium pain level
        }
        else if (lowerInput.includes('leve') || lowerInput.includes('ligero')) {
            return 2; // Low pain level
        }
        return null;
    };
    /**
     * Format exercise information response
     */
    DoubtResolutionEngine.prototype.formatExerciseResponse = function (exerciseInfo, context) {
        var response = "**".concat(exerciseInfo.name.toUpperCase(), "**\n\n");
        response += "".concat(exerciseInfo.description, "\n\n");
        response += "**TÉCNICA CORRECTA:**\n";
        exerciseInfo.technique.forEach(function (step, index) {
            response += "".concat(index + 1, ". ").concat(step, "\n");
        });
        response += "\n**ERRORES COMUNES A EVITAR:**\n";
        exerciseInfo.commonMistakes.forEach(function (mistake, index) {
            response += "\u2022 ".concat(mistake, "\n");
        });
        response += "\n**CONSEJOS DE SEGURIDAD:**\n";
        exerciseInfo.safetyTips.forEach(function (tip, index) {
            response += "\u2022 ".concat(tip, "\n");
        });
        // Personalize based on user level
        var userLevel = context.userData.fitnessLevel || 'intermediate';
        response += "\n**PARA TU NIVEL (".concat(userLevel.toUpperCase(), "):**\n");
        response += this.getLevelSpecificAdvice(userLevel, exerciseInfo.difficultyLevel);
        return response;
    };
    /**
     * Format nutrition information response
     */
    DoubtResolutionEngine.prototype.formatNutritionResponse = function (nutritionInfo, context) {
        var response = "**INFORMACI\u00D3N NUTRICIONAL: ".concat(nutritionInfo.foodName.toUpperCase(), "**\n\n");
        response += "**VALOR NUTRICIONAL POR 100G:**\n";
        response += "\u2022 Calor\u00EDas: ".concat(nutritionInfo.caloriesPer100g, " kcal\n");
        response += "\u2022 Prote\u00EDna: ".concat(nutritionInfo.proteinPer100g, "g\n");
        response += "\u2022 Carbohidratos: ".concat(nutritionInfo.carbsPer100g, "g\n");
        response += "\u2022 Grasas: ".concat(nutritionInfo.fatsPer100g, "g\n\n");
        response += "**BENEFICIOS:**\n";
        nutritionInfo.benefits.forEach(function (benefit) {
            response += "\u2022 ".concat(benefit, "\n");
        });
        response += "\n**RECOMENDACIONES DE TIMING:**\n";
        nutritionInfo.timingRecommendations.forEach(function (timing) {
            response += "\u2022 ".concat(timing, "\n");
        });
        return response;
    };
    /**
     * Format biomechanics information response
     */
    DoubtResolutionEngine.prototype.formatBiomechanicsResponse = function (preventionInfo, context) {
        var response = "**PREVENCI\u00D3N DE LESIONES: ".concat(preventionInfo.bodyPart.toUpperCase(), "**\n\n");
        response += "**FACTORES DE RIESGO:**\n";
        preventionInfo.riskFactors.forEach(function (factor) {
            response += "\u2022 ".concat(factor, "\n");
        });
        response += "\n**ESTRATEGIAS DE PREVENCI\u00D3N:**\n";
        preventionInfo.preventionStrategies.forEach(function (strategy) {
            response += "\u2022 ".concat(strategy, "\n");
        });
        response += "\n**SE\u00D1ALES DE ALERTA:**\n";
        preventionInfo.warningSigns.forEach(function (sign) {
            response += "\u2022 ".concat(sign, "\n");
        });
        return response;
    };
    /**
     * Generate recovery response
     */
    DoubtResolutionEngine.prototype.generateRecoveryResponse = function (input, context, entities) {
        var _a;
        var lowerInput = input.toLowerCase();
        if (lowerInput.includes('sueño') || lowerInput.includes('dormir')) {
            var sleepAdvice = this.knowledgeBase.getSleepOptimizationTechniques(context.userData);
            var response_1 = "**OPTIMIZACI\u00D3N DEL SUE\u00D1O**\n\n";
            response_1 += "**DURACI\u00D3N RECOMENDADA:** ".concat(sleepAdvice.sleepDuration, "\n\n");
            response_1 += "**FACTORES PARA MEJORAR LA CALIDAD DEL SUE\u00D1O:**\n";
            sleepAdvice.sleepQualityFactors.forEach(function (factor) {
                response_1 += "\u2022 ".concat(factor, "\n");
            });
            response_1 += "\n**T\u00C9CNICAS DE OPTIMIZACI\u00D3N:**\n";
            sleepAdvice.optimizationTechniques.forEach(function (technique) {
                response_1 += "\u2022 ".concat(technique, "\n");
            });
            response_1 += "\n**SE\u00D1ALES DE ALERTA:**\n";
            sleepAdvice.warningSigns.forEach(function (sign) {
                response_1 += "\u2022 ".concat(sign, "\n");
            });
            return {
                response: response_1,
                actionItems: ['Ver rutina de sueño', 'Optimizar ambiente', 'Técnicas de relajación'],
                confidence: 0.9
            };
        }
        else if (lowerInput.includes('estrés')) {
            // Use recovery status or default to moderate stress
            var stressLevel = context.recoveryStatus ?
                this.convertFatigueToStressLevel(context.recoveryStatus.fatigueLevel) : 5;
            var stressAdvice = this.knowledgeBase.getStressManagementStrategies(stressLevel);
            var response_2 = "**MANEJO DEL ESTR\u00C9S (NIVEL ".concat(stressAdvice.stressLevel, "/10)**\n\n");
            response_2 += "**T\u00C9CNICAS DE MANEJO:**\n";
            stressAdvice.managementTechniques.forEach(function (technique) {
                response_2 += "\u2022 ".concat(technique, "\n");
            });
            response_2 += "\n**EJERCICIOS DE RESPIRACI\u00D3N:**\n";
            stressAdvice.breathingExercises.forEach(function (exercise) {
                response_2 += "\u2022 ".concat(exercise, "\n");
            });
            response_2 += "\n**RECOMENDACIONES DE ESTILO DE VIDA:**\n";
            stressAdvice.lifestyleRecommendations.forEach(function (recommendation) {
                response_2 += "\u2022 ".concat(recommendation, "\n");
            });
            return {
                response: response_2,
                actionItems: ['Técnicas de respiración', 'Gestión del tiempo', 'Actividades relajantes'],
                confidence: 0.9
            };
        }
        else {
            // General recovery response with personalized recommendations
            var fatigueLevel = ((_a = context.recoveryStatus) === null || _a === void 0 ? void 0 : _a.fatigueLevel) || 'moderate';
            var recoveryAdvice = this.knowledgeBase.getRecoveryModalityRecommendations(fatigueLevel);
            var response_3 = "**RECUPERACI\u00D3N PERSONALIZADA (NIVEL: ".concat(fatigueLevel.toUpperCase(), ")**\n\n");
            response_3 += "**MODALIDADES RECOMENDADAS:**\n";
            recoveryAdvice.recommendedModalities.forEach(function (modality) {
                response_3 += "\u2022 ".concat(modality, "\n");
            });
            response_3 += "\n**DURACI\u00D3N:** ".concat(recoveryAdvice.duration, "\n");
            response_3 += "**FRECUENCIA:** ".concat(recoveryAdvice.frequency, "\n");
            return {
                response: response_3,
                actionItems: ['Ver plan de recuperación', 'Registrar métricas', 'Evaluar progreso'],
                confidence: 0.8
            };
        }
    };
    /**
     * Format program design response
     */
    DoubtResolutionEngine.prototype.formatProgramDesignResponse = function (programInfo, context) {
        var response = "**DISE\u00D1O DE PROGRAMA: ".concat(programInfo.programType.toUpperCase(), "**\n\n");
        response += "".concat(programInfo.description, "\n\n");
        response += "**FASES DEL PROGRAMA:**\n";
        programInfo.phases.forEach(function (phase, index) {
            response += "".concat(index + 1, ". ").concat(phase.name, " (").concat(phase.duration, ")\n");
            response += "   Enfoque: ".concat(phase.focus, "\n");
            response += "   Objetivos: ".concat(phase.goals.join(', '), "\n\n");
        });
        response += "**MODELO DE PERIODIZACI\u00D3N:** ".concat(programInfo.periodizationModel, "\n");
        response += "**PROGRESI\u00D3N DE CARGA:** ".concat(programInfo.loadProgression, "\n");
        response += "**ESTRATEGIA DE DELOAD:** ".concat(programInfo.deloadStrategy, "\n");
        return response;
    };
    /**
     * Format supplement response
     */
    DoubtResolutionEngine.prototype.formatSupplementResponse = function (supplementAdvice, context) {
        var response = "**RECOMENDACIONES DE SUPLEMENTACI\u00D3N PARA: ".concat(supplementAdvice.goal.toUpperCase(), "**\n\n");
        supplementAdvice.recommendedSupplements.forEach(function (supplement, index) {
            response += "".concat(index + 1, ". ").concat(supplement.name.toUpperCase(), "\n");
            response += "   Dosificaci\u00F3n: ".concat(supplement.dosage, "\n");
            response += "   Timing: ".concat(supplement.timing, "\n");
            response += "   Beneficios: ".concat(supplement.benefits.join(', '), "\n");
            response += "   Precauciones: ".concat(supplement.precautions.join(', '), "\n\n");
        });
        return response;
    };
    /**
     * Get level-specific advice
     */
    DoubtResolutionEngine.prototype.getLevelSpecificAdvice = function (userLevel, exerciseLevel) {
        if (userLevel === 'beginner' && exerciseLevel !== 'beginner') {
            return "Dado que eres principiante, te recomiendo dominar primero la versión más básica de este ejercicio con peso corporal o mancuernas ligeras antes de progresar.";
        }
        else if (userLevel === 'advanced' && exerciseLevel === 'beginner') {
            return "Como atleta avanzado, puedes enfocarte en variaciones más complejas de este ejercicio para continuar desafiando tus músculos.";
        }
        else {
            return "Sigue las instrucciones detalladas arriba y asegúrate de progresar gradualmente en peso e intensidad.";
        }
    };
    /**
     * Convert fatigue level to stress level
     */
    DoubtResolutionEngine.prototype.convertFatigueToStressLevel = function (fatigueLevel) {
        switch (fatigueLevel.toLowerCase()) {
            case 'low': return 3;
            case 'moderate': return 5;
            case 'high': return 7;
            case 'extreme': return 9;
            default: return 5;
        }
    };
    /**
     * Analyze user psychology based on context
     */
    DoubtResolutionEngine.prototype.analyzeUserPsychology = function (context) {
        // This would typically use the ConversationalCoach for detailed analysis
        // For now, we'll create a simplified analysis
        var _a;
        var recentWorkouts = context.recentWorkouts || [];
        var consistency = recentWorkouts.length > 0 ?
            Math.min(1, recentWorkouts.length / 7) : 0; // Assuming 7-day period
        return {
            consistency: consistency,
            recentPerformance: recentWorkouts.length > 0 ? 'active' : 'inactive',
            recoveryStatus: ((_a = context.recoveryStatus) === null || _a === void 0 ? void 0 : _a.fatigueLevel) || 'unknown'
        };
    };
    /**
     * Get progress highlights
     */
    DoubtResolutionEngine.prototype.getProgressHighlights = function (context) {
        var recentWorkouts = context.recentWorkouts || [];
        if (recentWorkouts.length >= 3) {
            return "🌟 **PROGRESO DESTACADO:**\n" +
                "Has completado " + recentWorkouts.length + " sesiones esta semana. " +
                "¡Eso demuestra compromiso y determinación!";
        }
        if (context.recoveryStatus && context.recoveryStatus.recoveryScore > 80) {
            return "🌟 **PROGRESO DESTACADO:**\n" +
                "Tus métricas de recuperación muestran mejoras. " +
                "¡Tu cuerpo está respondiendo positivamente al entrenamiento!";
        }
        return null;
    };
    /**
     * Get goal reinforcement
     */
    DoubtResolutionEngine.prototype.getGoalReinforcement = function (context) {
        var goals = context.userData.goals || [];
        if (goals.length > 0) {
            return "🎯 **REFORZAMIENTO DE METAS:**\n" +
                "Recuerda que estás trabajando hacia: " + goals.join(", ") + ". " +
                "Cada sesión te acerca más a alcanzar estos objetivos.";
        }
        return null;
    };
    /**
     * Get actionable next steps
     */
    DoubtResolutionEngine.prototype.getActionableNextSteps = function (context) {
        var recentWorkouts = context.recentWorkouts || [];
        if (recentWorkouts.length === 0) {
            return "🚀 **PRÓXIMOS PASOS:**\n" +
                "• Programa tu próxima sesión de entrenamiento\n" +
                "• Prepara tu equipo y ropa deportiva\n" +
                "• Establece una hora específica para entrenar";
        }
        if (context.recoveryStatus && context.recoveryStatus.fatigueLevel === 'high') {
            return "🚀 **PRÓXIMOS PASOS:**\n" +
                "• Prioriza la recuperación hoy\n" +
                "• Considera un entrenamiento ligero o estiramiento\n" +
                "• Concéntrate en una buena noche de sueño";
        }
        return "🚀 **PRÓXIMOS PASOS:**\n" +
            "• Mantén tu rutina de entrenamiento\n" +
            "• Registra tus sesiones completadas\n" +
            "• Evalúa tu progreso al final de la semana";
    };
    /**
     * Calculate workout consistency from recent sessions
     */
    DoubtResolutionEngine.prototype.calculateWorkoutConsistency = function (workouts) {
        if (workouts.length === 0)
            return 0;
        // For simplicity, we'll assume consistency based on workout frequency
        // In a real implementation, this would be more sophisticated
        return Math.min(1, workouts.length / 7); // Assuming 7-day period
    };
    /**
     * Detect motivational struggle based on context
     */
    DoubtResolutionEngine.prototype.detectMotivationalStruggle = function (context) {
        // Check for low recovery scores
        if (context.recoveryStatus && context.recoveryStatus.recoveryScore < 40) {
            return true;
        }
        // Check for inconsistent training
        var consistency = this.calculateWorkoutConsistency(context.recentWorkouts);
        if (consistency < 0.3) {
            return true;
        }
        return false;
    };
    /**
     * Select random message from array
     */
    DoubtResolutionEngine.prototype.selectRandomMessage = function (messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    };
    /**
     * Interpret recovery score
     */
    DoubtResolutionEngine.prototype.interpretRecoveryScore = function (score) {
        if (score >= 80)
            return "excelente";
        if (score >= 60)
            return "buena";
        if (score >= 40)
            return "moderada";
        return "baja";
    };
    /**
     * Evaluate nutritional adequacy
     */
    DoubtResolutionEngine.prototype.evaluateNutritionalAdequacy = function (nutrition) {
        var calories = nutrition.totalNutrients.calories;
        if (calories > 2500)
            return "un exceso calórico";
        if (calories > 2000)
            return "una ingesta adecuada";
        if (calories > 1500)
            return "una ingesta moderada";
        return "una ingesta baja";
    };
    return DoubtResolutionEngine;
}());
exports.DoubtResolutionEngine = DoubtResolutionEngine;
