"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseService = void 0;
var biomechanicalOverloadAI_1 = require("./biomechanicalOverloadAI");
var KnowledgeBaseService = /** @class */ (function () {
    function KnowledgeBaseService() {
        this.biomechanicalAI = new biomechanicalOverloadAI_1.BiomechanicalOverloadAI();
    }
    /**
     * Get exercise information from knowledge base
     */
    KnowledgeBaseService.prototype.getExerciseInformation = function (exerciseName) {
        // This would typically query a database of exercise information
        // For now, we'll return a sample structure
        var exerciseInfo = {
            'sentadilla': {
                name: 'Sentadilla',
                description: 'Ejercicio compuesto que trabaja principalmente los cuádriceps, glúteos y isquiotibiales',
                technique: [
                    'Ponte de pie con los pies a la anchura de los hombros',
                    'Mantén la espalda recta y el pecho hacia arriba',
                    'Baja controladamente doblando las rodillas y las caderas',
                    'Desciende hasta que los muslos estén paralelos al suelo',
                    'Empuja hacia arriba usando los talones'
                ],
                commonMistakes: [
                    'Rodillas colapsando hacia adentro',
                    'Elevación de talones',
                    'Redondeo de la espalda',
                    'No bajar lo suficiente'
                ],
                safetyTips: [
                    'Mantén el peso en los talones',
                    'No dejes que las rodillas se muevan hacia adentro',
                    'Controla el descenso',
                    'Mantén una respiración constante'
                ],
                equipmentNeeded: ['Barra', 'Mancuernas', 'Peso corporal'],
                difficultyLevel: 'beginner',
                muscleGroups: ['Cuádriceps', 'Glúteos', 'Isquiotibiales', 'Core']
            },
            'press de banca': {
                name: 'Press de banca',
                description: 'Ejercicio compuesto para el tren superior que enfatiza el pecho, hombros y tríceps',
                technique: [
                    'Acuéstate en el banco con los ojos bajo la barra',
                    'Planta los pies firmemente en el suelo',
                    'Retrae las escápulas y mantén la espalda arqueada',
                    'Desencaja la barra con los brazos extendidos',
                    'Baja la barra al centro del pecho',
                    'Empuja hacia arriba hasta la posición inicial'
                ],
                commonMistakes: [
                    'Arqueo excesivo de la espalda',
                    'Movimiento de la barra en arco',
                    'Rebotar la barra en el pecho',
                    'No mantener los pies en el suelo'
                ],
                safetyTips: [
                    'Siempre usa protectores de seguridad',
                    'Mantén los omóplatos retraídos',
                    'Controla todo el movimiento',
                    'Nunca bloquee los codos completamente'
                ],
                equipmentNeeded: ['Barra', 'Banco', 'Protectores de seguridad'],
                difficultyLevel: 'intermediate',
                muscleGroups: ['Pectoral mayor', 'Deltoides anterior', 'Tríceps', 'Serrato anterior']
            }
        };
        return exerciseInfo[exerciseName.toLowerCase()] || {
            name: exerciseName,
            description: 'Información no disponible para este ejercicio',
            technique: [],
            commonMistakes: [],
            safetyTips: [],
            equipmentNeeded: [],
            difficultyLevel: 'beginner',
            muscleGroups: []
        };
    };
    /**
     * Get program design principles based on user goals and level
     */
    KnowledgeBaseService.prototype.getProgramDesignPrinciples = function (goal, level) {
        // This would typically query a database of program design information
        // For now, we'll return a sample structure
        return {
            programType: "".concat(goal, " - ").concat(level),
            description: "Programa dise\u00F1ado para ".concat(goal, " en nivel ").concat(level),
            phases: [
                {
                    name: 'Fase de Adaptación',
                    duration: '2-4 semanas',
                    focus: 'Técnica y consistencia',
                    goals: ['Aprender movimientos básicos', 'Establecer rutina', 'Construir base']
                },
                {
                    name: 'Fase de Desarrollo',
                    duration: '4-8 semanas',
                    focus: 'Volumen e intensidad',
                    goals: ['Aumentar fuerza', 'Mejorar resistencia', 'Desarrollar masa muscular']
                },
                {
                    name: 'Fase de Especialización',
                    duration: '4-12 semanas',
                    focus: 'Máximo rendimiento',
                    goals: ['Alcanzar objetivos específicos', 'Superar mesetas', 'Optimizar recuperación']
                }
            ],
            periodizationModel: 'Periodización lineal',
            loadProgression: 'Aumento del 2.5-5% semanal',
            deloadStrategy: 'Reducción del 40-50% cada 4-6 semanas'
        };
    };
    /**
     * Get load progression guidelines based on performance metrics
     */
    KnowledgeBaseService.prototype.getLoadProgressionGuidelines = function (exercise, metrics) {
        // This would typically analyze actual performance data
        // For now, we'll return a sample structure
        return {
            exerciseName: exercise,
            currentLoad: 50, // kg
            recommendedLoad: 52.5, // kg
            progressionRate: '5%',
            注意事项: [
                'Asegúrate de mantener buena técnica',
                'Escucha a tu cuerpo',
                'Considera un deload si sientes fatiga acumulada'
            ]
        };
    };
    /**
     * Get nutritional information for foods
     */
    KnowledgeBaseService.prototype.getNutritionalInformation = function (food) {
        // This would typically query a nutritional database
        // For now, we'll return a sample structure
        var nutritionInfo = {
            'pollo': {
                foodName: 'Pechuga de pollo',
                caloriesPer100g: 165,
                proteinPer100g: 31,
                carbsPer100g: 0,
                fatsPer100g: 3.6,
                micronutrients: [
                    { name: 'Vitamina B6', amount: 0.6, unit: 'mg' },
                    { name: 'Niacina', amount: 14.8, unit: 'mg' },
                    { name: 'Fósforo', amount: 228, unit: 'mg' }
                ],
                benefits: [
                    'Excelente fuente de proteína magra',
                    'Bajo en grasas saturadas',
                    'Ayuda en la recuperación muscular'
                ],
                timingRecommendations: [
                    'Post-entreno para recuperación',
                    'Almuerzo para mantenimiento de masa muscular',
                    'Cena ligera para evitar sobrecarga digestiva'
                ]
            },
            'arroz': {
                foodName: 'Arroz blanco cocido',
                caloriesPer100g: 130,
                proteinPer100g: 2.7,
                carbsPer100g: 28.2,
                fatsPer100g: 0.3,
                micronutrients: [
                    { name: 'Manganeso', amount: 0.4, unit: 'mg' },
                    { name: 'Selenio', amount: 12.5, unit: 'mcg' },
                    { name: 'Fósforo', amount: 45, unit: 'mg' }
                ],
                benefits: [
                    'Excelente fuente de carbohidratos complejos',
                    'Fácil de digerir',
                    'Ideal para recargas de glucógeno muscular'
                ],
                timingRecommendations: [
                    'Pre-entreno para energía',
                    'Post-entreno para recarga de glucógeno',
                    'Almuerzo como fuente de energía sostenida'
                ]
            }
        };
        return nutritionInfo[food.toLowerCase()] || {
            foodName: food,
            caloriesPer100g: 0,
            proteinPer100g: 0,
            carbsPer100g: 0,
            fatsPer100g: 0,
            micronutrients: [],
            benefits: [],
            timingRecommendations: []
        };
    };
    /**
     * Get meal timing recommendations based on activity
     */
    KnowledgeBaseService.prototype.getMealTimingRecommendations = function (activity, goal) {
        return {
            activity: activity,
            preActivity: {
                timing: '1-2 horas antes',
                recommendedFoods: ['Avena', 'Plátano', 'Yogur griego'],
                nutrients: ['Carbohidratos complejos', 'Proteínas', 'Potasio']
            },
            postActivity: {
                timing: '30-60 minutos después',
                recommendedFoods: ['Pollo', 'Arroz', 'Batido de proteína'],
                nutrients: ['Proteínas', 'Carbohidratos', 'Aminoácidos']
            }
        };
    };
    /**
     * Get supplement guidance based on goals and restrictions
     */
    KnowledgeBaseService.prototype.getSupplementGuidance = function (goal, restrictions) {
        return {
            goal: goal,
            recommendedSupplements: [
                {
                    name: 'Proteína en polvo',
                    dosage: '25-30g post-entreno',
                    timing: 'Inmediatamente después del entrenamiento',
                    benefits: ['Recuperación muscular', 'Síntesis de proteínas', 'Satiación'],
                    precautions: ['Elegir productos de calidad', 'Verificar alergias']
                },
                {
                    name: 'Creatina monohidratada',
                    dosage: '3-5g diarios',
                    timing: 'En cualquier momento del día',
                    benefits: ['Aumento de fuerza', 'Mejora de potencia', 'Aumento de masa muscular'],
                    precautions: ['Mantener hidratación adecuada', 'Posible retención de agua']
                }
            ]
        };
    };
    /**
     * Get movement pattern analysis for exercises
     */
    KnowledgeBaseService.prototype.getMovementPatternAnalysis = function (exercise) {
        // This would typically query biomechanical analysis data
        // For now, we'll return a sample structure
        var movementInfo = {
            'sentadilla': {
                exerciseName: 'Sentadilla',
                primaryMovement: 'Flexión-extensión de cadera, rodilla y tobillo',
                jointActions: [
                    'Cadera: Flexión → Extensión',
                    'Rodilla: Flexión → Extensión',
                    'Tobillo: Dorsiflexión → Flexión plantar'
                ],
                muscleActivation: {
                    primary: ['Cuádriceps', 'Glúteos máximos'],
                    secondary: ['Isquiotibiales', 'Sóleo'],
                    stabilizers: ['Abdominales', 'Erectores espinales', 'Tensor de la fascia lata']
                },
                commonCompensations: [
                    'Elevación de talones',
                    'Rodillas colapsando hacia adentro',
                    'Excesiva inclinación pélvica anterior'
                ]
            }
        };
        return movementInfo[exercise.toLowerCase()] || {
            exerciseName: exercise,
            primaryMovement: 'Información no disponible',
            jointActions: [],
            muscleActivation: {
                primary: [],
                secondary: [],
                stabilizers: []
            },
            commonCompensations: []
        };
    };
    /**
     * Get injury prevention strategies for body parts
     */
    KnowledgeBaseService.prototype.getInjuryPreventionStrategies = function (bodyPart) {
        var preventionInfo = {
            'hombros': {
                bodyPart: 'Hombros',
                riskFactors: [
                    'Movilidad torácica limitada',
                    'Desbalance muscular',
                    'Sobreentrenamiento de press',
                    'Mala técnica en ejercicios sobre la cabeza'
                ],
                preventionStrategies: [
                    'Incluir ejercicios de retracción escapular',
                    'Mejorar la movilidad torácica',
                    'Equilibrar press con remo',
                    'Progresar gradualmente en ejercicios sobre la cabeza'
                ],
                warningSigns: [
                    'Dolor punzante en el hombro',
                    'Chasquidos o crujidos',
                    'Dolor al levantar el brazo',
                    'Debilidad en movimientos sobre la cabeza'
                ]
            },
            'espalda': {
                bodyPart: 'Espalda',
                riskFactors: [
                    'Mala postura',
                    'Desbalance entre flexores y extensores',
                    'Levantamiento con mala técnica',
                    'Falta de calentamiento'
                ],
                preventionStrategies: [
                    'Fortalecer el core',
                    'Mejorar la movilidad de cadera',
                    'Aprender técnica de peso muerto',
                    'Incluir ejercicios de estabilización'
                ],
                warningSigns: [
                    'Dolor lumbar persistente',
                    'Rigidez matutina',
                    'Dolor que se irradia a las piernas',
                    'Debilidad en los glúteos'
                ]
            }
        };
        return preventionInfo[bodyPart.toLowerCase()] || {
            bodyPart: bodyPart,
            riskFactors: [],
            preventionStrategies: [],
            warningSigns: []
        };
    };
    /**
     * Get corrective exercise protocols for overload risks
     */
    KnowledgeBaseService.prototype.getCorrectiveExerciseProtocols = function (overloadRisk) {
        return {
            bodyPart: overloadRisk.bodyPart,
            priority: overloadRisk.severity > 7 ? 'high' : overloadRisk.severity > 4 ? 'medium' : 'low',
            exercises: [
                {
                    name: 'Estiramiento de pectorales',
                    description: 'Estiramiento para contrarrestar la retracción del pecho',
                    duration: '30 segundos por lado',
                    equipment: 'ninguno',
                    targetArea: [overloadRisk.bodyPart]
                }
            ],
            frequency: '2-3 veces al día',
            duration: '2-4 semanas'
        };
    };
    /**
     * Get sleep optimization techniques
     */
    KnowledgeBaseService.prototype.getSleepOptimizationTechniques = function (userProfile) {
        return {
            sleepDuration: '7-9 horas para adultos',
            sleepQualityFactors: [
                'Temperatura ambiente fresca (18-22°C)',
                'Oscuridad completa',
                'Silencio o sonido blanco',
                'Rutina consistente de acostarse'
            ],
            optimizationTechniques: [
                'Evitar pantallas 1 hora antes de dormir',
                'Exposición a luz natural por la mañana',
                'Evitar cafeína 6 horas antes de dormir',
                'Crear un ambiente relajante'
            ],
            warningSigns: [
                'Dificultad para conciliar el sueño',
                'Despertares frecuentes',
                'Sensación de no haber descansado',
                'Somnolencia durante el día'
            ]
        };
    };
    /**
     * Get stress management strategies
     */
    KnowledgeBaseService.prototype.getStressManagementStrategies = function (stressLevel) {
        return {
            stressLevel: stressLevel,
            managementTechniques: [
                'Meditación guiada (10-15 minutos diarios)',
                'Ejercicio físico regular',
                'Técnicas de respiración profunda',
                'Organización del tiempo y prioridades'
            ],
            breathingExercises: [
                'Respiración 4-7-8: inhalar 4s, mantener 7s, exhalar 8s',
                'Respiración diafragmática: enfocarse en expandir el abdomen'
            ],
            lifestyleRecommendations: [
                'Mantener horarios regulares',
                'Reducir consumo de cafeína',
                'Conectar con otros (amigos, familia)',
                'Participar en actividades placenteras'
            ]
        };
    };
    /**
     * Get recovery modality recommendations
     */
    KnowledgeBaseService.prototype.getRecoveryModalityRecommendations = function (fatigueLevel) {
        var recommendations = {
            'low': {
                fatigueLevel: 'low',
                recommendedModalities: ['Estiramiento suave', 'Caminata ligera', 'Hidratación adecuada'],
                duration: '15-30 minutos',
                frequency: 'Según sea necesario'
            },
            'moderate': {
                fatigueLevel: 'moderate',
                recommendedModalities: ['Espuma de presión', 'Estiramiento dinámico', 'Baño de contraste'],
                duration: '20-45 minutos',
                frequency: '1-2 veces por día'
            },
            'high': {
                fatigueLevel: 'high',
                recommendedModalities: ['Masaje deportivo', 'Inmersión en agua fría', 'Descanso activo'],
                duration: '30-60 minutos',
                frequency: 'Diario hasta recuperación'
            },
            'extreme': {
                fatigueLevel: 'extreme',
                recommendedModalities: ['Descanso completo', 'Terapia física', 'Evaluación médica'],
                duration: '1-3 días',
                frequency: 'Diario con monitoreo'
            }
        };
        return recommendations[fatigueLevel.toLowerCase()] || recommendations['moderate'];
    };
    return KnowledgeBaseService;
}());
exports.KnowledgeBaseService = KnowledgeBaseService;
