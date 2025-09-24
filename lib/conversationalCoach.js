"use strict";
/**
 * Conversational Coach AI - Psychology & Motivation System
 * Adaptive personal training coach that adjusts communication style based on user psychology
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationalCoach = void 0;
var ConversationalCoach = /** @class */ (function () {
    function ConversationalCoach() {
        this.strategies = new Map();
        this.userHistory = new Map();
        this.initializeCoachingStrategies();
    }
    /**
     * Generate personalized coaching message based on user psychology and context
     */
    ConversationalCoach.prototype.generateCoachingMessage = function (userProfile, context, additionalData) {
        console.log('🧠 Generando mensaje de coaching personalizado...');
        var strategy = this.selectOptimalStrategy(userProfile, context);
        var baseMessage = this.craftBaseMessage(userProfile, context, strategy);
        var personalizedMessage = this.personalizeMessage(baseMessage, userProfile, context);
        var adaptedMessage = this.adaptToEmotionalState(personalizedMessage, userProfile);
        return {
            messageId: "coach_".concat(Date.now()),
            type: this.determineMessageType(context, userProfile),
            content: adaptedMessage,
            tone: this.selectOptimalTone(userProfile, context),
            personalizedElements: this.extractPersonalizedElements(userProfile, context),
            actionItems: this.generateActionItems(userProfile, context),
            followUpQuestions: this.generateFollowUpQuestions(userProfile, context),
            estimatedImpact: this.estimateMessageImpact(userProfile, context)
        };
    };
    /**
     * Analyze user psychology from behavior patterns
     */
    ConversationalCoach.prototype.analyzeUserPsychology = function (behaviorData, performanceMetrics, userFeedback) {
        var consistency = this.calculateConsistency(behaviorData);
        var motivationPattern = this.detectMotivationPattern(behaviorData, userFeedback);
        var emotionalPattern = this.analyzeEmotionalPatterns(userFeedback);
        return {
            motivationType: motivationPattern.type,
            disciplineLevel: this.assessDisciplineLevel(consistency, behaviorData),
            emotionalState: this.detectCurrentEmotionalState(emotionalPattern),
            communicationPreference: this.detectCommunicationPreference(userFeedback),
            personalityTraits: this.assessPersonalityTraits(behaviorData, userFeedback),
            currentGoals: this.extractCurrentGoals(userFeedback),
            recentSetbacks: this.identifyRecentSetbacks(behaviorData, performanceMetrics),
            achievements: this.identifyRecentAchievements(performanceMetrics)
        };
    };
    /**
     * Provide real-time coaching during workouts
     */
    ConversationalCoach.prototype.provideRealTimeCoaching = function (userProfile, currentExercise, performanceData) {
        var context = {
            sessionType: 'during-workout',
            timeOfDay: this.getCurrentTimeOfDay(),
            workoutIntensity: performanceData.intensity,
            performanceMetrics: {
                completionRate: performanceData.completionRate,
                intensityLevel: performanceData.intensityLevel,
                progressTrend: performanceData.trend
            },
            recentBehavior: {
                consistency: userProfile.personalityTraits.resilience,
                adherence: performanceData.adherence || 8,
                effort: performanceData.effort || 7
            }
        };
        if (performanceData.struggling) {
            return this.generateEncouragementMessage(userProfile, context);
        }
        else if (performanceData.excelling) {
            return this.generateChallengeMessage(userProfile, context);
        }
        else {
            return this.generateProgressMessage(userProfile, context);
        }
    };
    /**
     * Handle setbacks and provide recovery coaching
     */
    ConversationalCoach.prototype.handleSetback = function (userProfile, setbackType, setbackDetails) {
        var context = {
            sessionType: 'setback',
            timeOfDay: this.getCurrentTimeOfDay(),
            recentBehavior: {
                consistency: Math.max(1, userProfile.personalityTraits.resilience - 2),
                adherence: Math.max(1, setbackDetails.adherence || 5),
                effort: setbackDetails.effort || 6
            }
        };
        var strategy = this.getSetbackStrategy(setbackType, userProfile);
        return this.generateRecoveryMessage(userProfile, context, strategy, setbackDetails);
    };
    /**
     * Generate goal-setting and planning coaching
     */
    ConversationalCoach.prototype.generateGoalCoaching = function (userProfile, currentGoals, progressData) {
        var context = {
            sessionType: 'goal-setting',
            timeOfDay: this.getCurrentTimeOfDay(),
            recentBehavior: {
                consistency: this.calculateGoalConsistency(progressData),
                adherence: this.calculateGoalAdherence(currentGoals, progressData),
                effort: userProfile.personalityTraits.resilience
            }
        };
        return this.generateGoalSettingMessage(userProfile, context, currentGoals, progressData);
    };
    ConversationalCoach.prototype.initializeCoachingStrategies = function () {
        // High Discipline, Intrinsic Motivation Strategy
        this.strategies.set('high-discipline-intrinsic', {
            name: 'Autonomous Achiever',
            description: 'For self-motivated, disciplined individuals',
            triggerConditions: ['disciplineLevel: high', 'motivationType: intrinsic'],
            messages: [
                {
                    messageId: 'hdi_1',
                    type: 'challenge',
                    content: 'Tu consistencia es impresionante. ¿Listo para elevar el listón hoy?',
                    tone: 'challenging',
                    personalizedElements: ['consistency_recognition'],
                    estimatedImpact: 'high'
                }
            ],
            adaptations: {
                'emotional_state_stressed': 'Enfoque en recuperación y mindfulness',
                'emotional_state_confident': 'Intensificar desafíos'
            }
        });
        // Low Discipline, Extrinsic Motivation Strategy
        this.strategies.set('low-discipline-extrinsic', {
            name: 'Supportive Guide',
            description: 'For individuals needing external motivation and structure',
            triggerConditions: ['disciplineLevel: low', 'motivationType: extrinsic'],
            messages: [
                {
                    messageId: 'lde_1',
                    type: 'encouragement',
                    content: 'Cada pequeño paso cuenta. Vamos a hacer esto juntos, un día a la vez.',
                    tone: 'supportive',
                    personalizedElements: ['small_wins_focus'],
                    estimatedImpact: 'moderate'
                }
            ],
            adaptations: {
                'emotional_state_frustrated': 'Enfoque en logros pasados y apoyo emocional',
                'emotional_state_energized': 'Aprovechar la energía positiva'
            }
        });
        // Add more strategies for different combinations...
    };
    ConversationalCoach.prototype.selectOptimalStrategy = function (userProfile, context) {
        var key = "".concat(userProfile.disciplineLevel, "-discipline-").concat(userProfile.motivationType);
        var strategy = this.strategies.get(key);
        if (strategy) {
            return strategy;
        }
        // Fallback to adaptive strategy
        return this.createAdaptiveStrategy(userProfile, context);
    };
    ConversationalCoach.prototype.createAdaptiveStrategy = function (userProfile, context) {
        return {
            name: 'Adaptive Coach',
            description: 'Dynamically adapted to user profile',
            triggerConditions: ['adaptive'],
            messages: [
                {
                    messageId: 'adaptive_1',
                    type: this.determineMessageType(context, userProfile),
                    content: this.generateAdaptiveContent(userProfile, context),
                    tone: this.selectOptimalTone(userProfile, context),
                    personalizedElements: ['adaptive_messaging'],
                    estimatedImpact: 'moderate'
                }
            ],
            adaptations: {}
        };
    };
    ConversationalCoach.prototype.craftBaseMessage = function (userProfile, context, strategy) {
        var templates = this.getMessageTemplates(userProfile, context);
        var selectedTemplate = this.selectTemplate(templates, userProfile, context);
        return this.populateTemplate(selectedTemplate, userProfile, context);
    };
    ConversationalCoach.prototype.getMessageTemplates = function (userProfile, context) {
        var templates = [];
        // Pre-workout templates
        if (context.sessionType === 'pre-workout') {
            if (userProfile.emotionalState === 'energized') {
                templates.push('¡Perfecto! Veo esa energía. Vamos a canalizarla hacia un entrenamiento épico.');
                templates.push('Tu energía es contagiosa. Hoy es el día perfecto para superar tus límites.');
            }
            else if (userProfile.emotionalState === 'stressed') {
                templates.push('Entiendo que has tenido un día difícil. El ejercicio será tu válvula de escape.');
                templates.push('Transformemos ese estrés en fuerza. Tu entrenamiento será tu momento de paz.');
            }
        }
        // During workout templates
        if (context.sessionType === 'during-workout') {
            if (userProfile.personalityTraits.competitiveness > 7) {
                templates.push('¡Vamos! Sabes que puedes dar más. Tu yo del pasado estaría orgulloso.');
                templates.push('Este es tu momento. Demuéstrate de qué estás hecho.');
            }
            else {
                templates.push('Vas perfecto. Escucha a tu cuerpo y mantén el ritmo.');
                templates.push('Excelente forma. Cada repetición te acerca a tu mejor versión.');
            }
        }
        // Post-workout templates
        if (context.sessionType === 'post-workout') {
            templates.push('¡Increíble sesión! Tu dedicación está dando frutos.');
            templates.push('Cada entrenamiento es una inversión en tu futuro. Hoy invertiste bien.');
        }
        // Setback templates
        if (context.sessionType === 'setback') {
            templates.push('Los obstáculos son oportunidades disfrazadas. Vamos a crear un plan juntos.');
            templates.push('Tu determinación me inspira. Este contratiempo es temporal.');
        }
        return templates;
    };
    ConversationalCoach.prototype.selectTemplate = function (templates, userProfile, context) {
        if (templates.length === 0) {
            return 'Estoy aquí para apoyarte en tu journey. ¿Cómo te sientes hoy?';
        }
        // Select based on personality traits and context
        var selectedIndex = 0;
        if (userProfile.personalityTraits.competitiveness > 7 && context.sessionType === 'during-workout') {
            selectedIndex = Math.min(1, templates.length - 1);
        }
        else if (userProfile.emotionalState === 'stressed') {
            selectedIndex = 0; // More supportive option
        }
        return templates[selectedIndex] || templates[0];
    };
    ConversationalCoach.prototype.populateTemplate = function (template, userProfile, context) {
        var _a;
        var message = template;
        // Add personalized elements based on user data
        if (userProfile.achievements.length > 0) {
            var recentAchievement = userProfile.achievements[0];
            message = message.replace(/tu mejor versión/g, "la versi\u00F3n que logr\u00F3 ".concat(recentAchievement));
        }
        if (((_a = context.performanceMetrics) === null || _a === void 0 ? void 0 : _a.progressTrend) === 'improving') {
            message += ' Tu progreso constante es admirable.';
        }
        return message;
    };
    ConversationalCoach.prototype.personalizeMessage = function (message, userProfile, context) {
        var personalizedMessage = message;
        // Add name if available
        // personalizedMessage = personalizedMessage.replace(/Vamos/g, `Vamos, ${userProfile.name || 'campeón'}`);
        // Adjust based on time of day
        if (context.timeOfDay === 'morning') {
            personalizedMessage += ' ¡Qué mejor manera de empezar el día!';
        }
        else if (context.timeOfDay === 'evening') {
            personalizedMessage += ' Termina el día con fuerza.';
        }
        // Add motivation type specific elements
        if (userProfile.motivationType === 'extrinsic') {
            personalizedMessage += ' Cada paso te acerca a tus objetivos.';
        }
        else if (userProfile.motivationType === 'intrinsic') {
            personalizedMessage += ' Disfruta el proceso y celebra tu crecimiento.';
        }
        return personalizedMessage;
    };
    ConversationalCoach.prototype.adaptToEmotionalState = function (message, userProfile) {
        var adaptedMessage = message;
        switch (userProfile.emotionalState) {
            case 'frustrated':
                adaptedMessage = "".concat(adaptedMessage, " Es normal sentir frustraci\u00F3n; es parte del crecimiento.");
                break;
            case 'confident':
                adaptedMessage = "".concat(adaptedMessage, " Tu confianza es tu superpoder.");
                break;
            case 'stressed':
                adaptedMessage = "".concat(adaptedMessage, " Respira profundo, est\u00E1s exactamente donde necesitas estar.");
                break;
            case 'energized':
                adaptedMessage = "".concat(adaptedMessage, " \u00A1Esa energ\u00EDa es oro puro!");
                break;
        }
        return adaptedMessage;
    };
    ConversationalCoach.prototype.determineMessageType = function (context, userProfile) {
        if (context.sessionType === 'setback')
            return 'encouragement';
        if (context.sessionType === 'goal-setting')
            return 'reflection';
        if (userProfile.personalityTraits.competitiveness > 7)
            return 'challenge';
        if (userProfile.disciplineLevel === 'low')
            return 'motivation';
        return 'feedback';
    };
    ConversationalCoach.prototype.selectOptimalTone = function (userProfile, context) {
        if (userProfile.emotionalState === 'stressed')
            return 'understanding';
        if (userProfile.emotionalState === 'frustrated')
            return 'calm';
        if (userProfile.personalityTraits.competitiveness > 7)
            return 'challenging';
        if (userProfile.disciplineLevel === 'high')
            return 'firm';
        return 'supportive';
    };
    ConversationalCoach.prototype.generateActionItems = function (userProfile, context) {
        var actions = [];
        if (context.sessionType === 'pre-workout') {
            actions.push('Realiza 5 minutos de calentamiento dinámico');
            actions.push('Visualiza tu mejor ejecución en cada ejercicio');
        }
        else if (context.sessionType === 'post-workout') {
            actions.push('Dedica 10 minutos al estiramiento');
            actions.push('Registra tu progreso en el diario de entrenamientos');
        }
        else if (context.sessionType === 'setback') {
            actions.push('Identifica una pequeña acción que puedas hacer hoy');
            actions.push('Recuerda tres logros pasados que te enorgullecen');
        }
        return actions;
    };
    ConversationalCoach.prototype.generateFollowUpQuestions = function (userProfile, context) {
        var questions = [];
        if (userProfile.emotionalState === 'stressed') {
            questions.push('¿Qué te está generando más tensión últimamente?');
            questions.push('¿Cómo podemos ajustar tu rutina para reducir el estrés?');
        }
        else if (context.sessionType === 'goal-setting') {
            questions.push('¿Qué objetivo te emociona más trabajar esta semana?');
            questions.push('¿Qué obstáculo prevés y cómo podemos prepararnos?');
        }
        else if (userProfile.personalityTraits.selfConfidence < 5) {
            questions.push('¿Qué logro reciente te hace sentir más orgulloso?');
            questions.push('¿En qué área sientes que has mejorado más?');
        }
        return questions;
    };
    ConversationalCoach.prototype.estimateMessageImpact = function (userProfile, context) {
        var impactScore = 0;
        // Context factors
        if (context.sessionType === 'setback')
            impactScore += 3;
        if (context.sessionType === 'goal-setting')
            impactScore += 2;
        // User personality factors
        if (userProfile.motivationType === 'extrinsic')
            impactScore += 2;
        if (userProfile.disciplineLevel === 'low')
            impactScore += 2;
        if (userProfile.emotionalState === 'frustrated')
            impactScore += 3;
        if (impactScore >= 5)
            return 'high';
        if (impactScore >= 3)
            return 'moderate';
        return 'low';
    };
    // Helper methods for psychology analysis
    ConversationalCoach.prototype.calculateConsistency = function (behaviorData) {
        if (!behaviorData || behaviorData.length === 0)
            return 5;
        var completedSessions = behaviorData.filter(function (session) { return session.completed; }).length;
        return Math.round((completedSessions / behaviorData.length) * 10);
    };
    ConversationalCoach.prototype.detectMotivationPattern = function (behaviorData, userFeedback) {
        // Analyze patterns to determine if user is more intrinsically or extrinsically motivated
        var externalFactors = userFeedback.filter(function (feedback) {
            var _a, _b, _c;
            return ((_a = feedback.content) === null || _a === void 0 ? void 0 : _a.includes('objetivo')) ||
                ((_b = feedback.content) === null || _b === void 0 ? void 0 : _b.includes('meta')) ||
                ((_c = feedback.content) === null || _c === void 0 ? void 0 : _c.includes('resultado'));
        }).length;
        var internalFactors = userFeedback.filter(function (feedback) {
            var _a, _b, _c;
            return ((_a = feedback.content) === null || _a === void 0 ? void 0 : _a.includes('disfruto')) ||
                ((_b = feedback.content) === null || _b === void 0 ? void 0 : _b.includes('me gusta')) ||
                ((_c = feedback.content) === null || _c === void 0 ? void 0 : _c.includes('me siento'));
        }).length;
        if (externalFactors > internalFactors * 1.5)
            return { type: 'extrinsic' };
        if (internalFactors > externalFactors * 1.5)
            return { type: 'intrinsic' };
        return { type: 'mixed' };
    };
    ConversationalCoach.prototype.analyzeEmotionalPatterns = function (userFeedback) {
        // Analyze emotional keywords and patterns in user feedback
        return {
            dominant: 'neutral',
            trends: ['stable'],
            triggers: []
        };
    };
    ConversationalCoach.prototype.detectCurrentEmotionalState = function (emotionalPattern) {
        return emotionalPattern.dominant || 'neutral';
    };
    ConversationalCoach.prototype.assessDisciplineLevel = function (consistency, behaviorData) {
        if (consistency >= 8)
            return 'high';
        if (consistency >= 5)
            return 'moderate';
        return 'low';
    };
    ConversationalCoach.prototype.detectCommunicationPreference = function (userFeedback) {
        // Analyze user's response patterns to determine preferred communication style
        return 'supportive'; // Default, could be enhanced with more analysis
    };
    ConversationalCoach.prototype.assessPersonalityTraits = function (behaviorData, userFeedback) {
        return {
            competitiveness: 6,
            perfectionism: 5,
            resilience: 7,
            selfConfidence: 6,
            socialMotivation: 5
        };
    };
    ConversationalCoach.prototype.extractCurrentGoals = function (userFeedback) {
        return ['Mejorar fuerza', 'Consistencia en entrenamientos', 'Reducir estrés'];
    };
    ConversationalCoach.prototype.identifyRecentSetbacks = function (behaviorData, performanceMetrics) {
        return [];
    };
    ConversationalCoach.prototype.identifyRecentAchievements = function (performanceMetrics) {
        return ['Completó semana de entrenamientos', 'Mejoró tiempo de recuperación'];
    };
    ConversationalCoach.prototype.getCurrentTimeOfDay = function () {
        var hour = new Date().getHours();
        if (hour < 12)
            return 'morning';
        if (hour < 18)
            return 'afternoon';
        return 'evening';
    };
    ConversationalCoach.prototype.generateEncouragementMessage = function (userProfile, context) {
        return {
            messageId: "encourage_".concat(Date.now()),
            type: 'encouragement',
            content: 'Lo estás haciendo genial. A veces el cuerpo necesita tiempo para adaptarse. Sigue adelante.',
            tone: 'supportive',
            personalizedElements: ['struggle_support'],
            actionItems: ['Reduce la intensidad si es necesario', 'Enfócate en la técnica'],
            estimatedImpact: 'high'
        };
    };
    ConversationalCoach.prototype.generateChallengeMessage = function (userProfile, context) {
        return {
            messageId: "challenge_".concat(Date.now()),
            type: 'challenge',
            content: '¡Increíble! Estás en tu zona. ¿Puedes dar un 10% más en la próxima serie?',
            tone: 'challenging',
            personalizedElements: ['performance_recognition'],
            actionItems: ['Aumenta peso o repeticiones', 'Mantén la concentración'],
            estimatedImpact: 'high'
        };
    };
    ConversationalCoach.prototype.generateProgressMessage = function (userProfile, context) {
        return {
            messageId: "progress_".concat(Date.now()),
            type: 'feedback',
            content: 'Perfecto ritmo. Tu consistencia está dando frutos. Sigue así.',
            tone: 'calm',
            personalizedElements: ['steady_progress'],
            actionItems: ['Mantén la técnica', 'Controla la respiración'],
            estimatedImpact: 'moderate'
        };
    };
    ConversationalCoach.prototype.getSetbackStrategy = function (setbackType, userProfile) {
        return {
            name: "".concat(setbackType, "_recovery"),
            approach: userProfile.disciplineLevel === 'high' ? 'analytical' : 'supportive'
        };
    };
    ConversationalCoach.prototype.generateRecoveryMessage = function (userProfile, context, strategy, setbackDetails) {
        return {
            messageId: "recovery_".concat(Date.now()),
            type: 'encouragement',
            content: 'Todo campeón enfrenta obstáculos. La diferencia está en cómo nos levantamos. Vamos a crear un plan juntos.',
            tone: 'understanding',
            personalizedElements: ['setback_normalization'],
            actionItems: ['Identifica qué aprendiste', 'Define el próximo paso pequeño'],
            followUpQuestions: ['¿Qué crees que causó esta situación?', '¿Cómo te gustaría que te apoye?'],
            estimatedImpact: 'high'
        };
    };
    ConversationalCoach.prototype.generateGoalSettingMessage = function (userProfile, context, currentGoals, progressData) {
        return {
            messageId: "goal_".concat(Date.now()),
            type: 'reflection',
            content: 'Tus objetivos son el mapa de tu journey. Vamos a asegurarnos de que sean específicos, medibles y emocionantes.',
            tone: 'calm',
            personalizedElements: ['goal_clarity'],
            actionItems: ['Define métricas específicas', 'Establece fecha límite realista'],
            followUpQuestions: ['¿Qué objetivo te emociona más?', '¿Qué recursos necesitas para lograrlo?'],
            estimatedImpact: 'high'
        };
    };
    ConversationalCoach.prototype.calculateGoalConsistency = function (progressData) {
        return (progressData === null || progressData === void 0 ? void 0 : progressData.consistency) || 7;
    };
    ConversationalCoach.prototype.calculateGoalAdherence = function (currentGoals, progressData) {
        return (progressData === null || progressData === void 0 ? void 0 : progressData.adherence) || 6;
    };
    ConversationalCoach.prototype.generateAdaptiveContent = function (userProfile, context) {
        var baseMessages = [
            'Estoy aquí para apoyarte en cada paso de tu journey.',
            'Tu dedicación es inspiradora. Vamos a seguir construyendo sobre tus fortalezas.',
            'Cada día es una nueva oportunidad para crecer. ¿Cómo te sientes hoy?'
        ];
        return baseMessages[Math.floor(Math.random() * baseMessages.length)];
    };
    ConversationalCoach.prototype.extractPersonalizedElements = function (userProfile, context) {
        var _a;
        var elements = [];
        if (userProfile.disciplineLevel === 'high')
            elements.push('discipline_recognition');
        if (userProfile.emotionalState === 'confident')
            elements.push('confidence_boost');
        if (((_a = context.performanceMetrics) === null || _a === void 0 ? void 0 : _a.progressTrend) === 'improving')
            elements.push('progress_acknowledgment');
        return elements;
    };
    return ConversationalCoach;
}());
exports.ConversationalCoach = ConversationalCoach;
