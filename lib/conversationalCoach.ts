/**
 * Conversational Coach AI - Psychology & Motivation System
 * Adaptive personal training coach that adjusts communication style based on user psychology
 */

export interface UserPsychologyProfile {
  motivationType: 'intrinsic' | 'extrinsic' | 'mixed';
  disciplineLevel: 'low' | 'moderate' | 'high';
  emotionalState: 'stressed' | 'neutral' | 'energized' | 'frustrated' | 'confident';
  communicationPreference: 'supportive' | 'challenging' | 'analytical' | 'casual';
  personalityTraits: {
    competitiveness: number; // 1-10
    perfectionism: number; // 1-10
    resilience: number; // 1-10
    selfConfidence: number; // 1-10
    socialMotivation: number; // 1-10
  };
  currentGoals: string[];
  recentSetbacks: string[];
  achievements: string[];
}

export interface CoachingContext {
  sessionType: 'pre-workout' | 'during-workout' | 'post-workout' | 'rest-day' | 'setback' | 'goal-setting';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  workoutIntensity?: 'low' | 'moderate' | 'high' | 'max';
  performanceMetrics?: {
    completionRate: number;
    intensityLevel: number;
    progressTrend: 'improving' | 'plateau' | 'declining';
  };
  recentBehavior: {
    consistency: number; // 1-10
    adherence: number; // 1-10
    effort: number; // 1-10
  };
}

export interface CoachingMessage {
  messageId: string;
  type: 'motivation' | 'instruction' | 'feedback' | 'encouragement' | 'challenge' | 'reflection';
  content: string;
  tone: 'supportive' | 'firm' | 'enthusiastic' | 'calm' | 'challenging' | 'understanding';
  personalizedElements: string[];
  actionItems?: string[];
  followUpQuestions?: string[];
  estimatedImpact: 'low' | 'moderate' | 'high';
}

export interface CoachingStrategy {
  name: string;
  description: string;
  triggerConditions: string[];
  messages: CoachingMessage[];
  adaptations: {
    [key: string]: string;
  };
}

export class ConversationalCoach {
  private strategies: Map<string, CoachingStrategy> = new Map();
  private userHistory: Map<string, any[]> = new Map();

  constructor() {
    this.initializeCoachingStrategies();
  }

  /**
   * Generate personalized coaching message based on user psychology and context
   */
  public generateCoachingMessage(
    userProfile: UserPsychologyProfile,
    context: CoachingContext,
    additionalData?: any
  ): CoachingMessage {
    console.log('🧠 Generando mensaje de coaching personalizado...');

    const strategy = this.selectOptimalStrategy(userProfile, context);
    const baseMessage = this.craftBaseMessage(userProfile, context, strategy);
    const personalizedMessage = this.personalizeMessage(baseMessage, userProfile, context);
    const adaptedMessage = this.adaptToEmotionalState(personalizedMessage, userProfile);

    return {
      messageId: `coach_${Date.now()}`,
      type: this.determineMessageType(context, userProfile),
      content: adaptedMessage,
      tone: this.selectOptimalTone(userProfile, context),
      personalizedElements: this.extractPersonalizedElements(userProfile, context),
      actionItems: this.generateActionItems(userProfile, context),
      followUpQuestions: this.generateFollowUpQuestions(userProfile, context),
      estimatedImpact: this.estimateMessageImpact(userProfile, context)
    };
  }

  /**
   * Analyze user psychology from behavior patterns
   */
  public analyzeUserPsychology(
    behaviorData: any[],
    performanceMetrics: any,
    userFeedback: any[]
  ): UserPsychologyProfile {
    const consistency = this.calculateConsistency(behaviorData);
    const motivationPattern = this.detectMotivationPattern(behaviorData, userFeedback);
    const emotionalPattern = this.analyzeEmotionalPatterns(userFeedback);
    
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
  }

  /**
   * Provide real-time coaching during workouts
   */
  public provideRealTimeCoaching(
    userProfile: UserPsychologyProfile,
    currentExercise: any,
    performanceData: any
  ): CoachingMessage {
    const context: CoachingContext = {
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
    } else if (performanceData.excelling) {
      return this.generateChallengeMessage(userProfile, context);
    } else {
      return this.generateProgressMessage(userProfile, context);
    }
  }

  /**
   * Handle setbacks and provide recovery coaching
   */
  public handleSetback(
    userProfile: UserPsychologyProfile,
    setbackType: 'injury' | 'motivation' | 'time' | 'plateau' | 'life-stress',
    setbackDetails: any
  ): CoachingMessage {
    const context: CoachingContext = {
      sessionType: 'setback',
      timeOfDay: this.getCurrentTimeOfDay(),
      recentBehavior: {
        consistency: Math.max(1, userProfile.personalityTraits.resilience - 2),
        adherence: Math.max(1, setbackDetails.adherence || 5),
        effort: setbackDetails.effort || 6
      }
    };

    const strategy = this.getSetbackStrategy(setbackType, userProfile);
    return this.generateRecoveryMessage(userProfile, context, strategy, setbackDetails);
  }

  /**
   * Generate goal-setting and planning coaching
   */
  public generateGoalCoaching(
    userProfile: UserPsychologyProfile,
    currentGoals: any[],
    progressData: any
  ): CoachingMessage {
    const context: CoachingContext = {
      sessionType: 'goal-setting',
      timeOfDay: this.getCurrentTimeOfDay(),
      recentBehavior: {
        consistency: this.calculateGoalConsistency(progressData),
        adherence: this.calculateGoalAdherence(currentGoals, progressData),
        effort: userProfile.personalityTraits.resilience
      }
    };

    return this.generateGoalSettingMessage(userProfile, context, currentGoals, progressData);
  }

  private initializeCoachingStrategies(): void {
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
  }

  private selectOptimalStrategy(userProfile: UserPsychologyProfile, context: CoachingContext): CoachingStrategy {
    const key = `${userProfile.disciplineLevel}-discipline-${userProfile.motivationType}`;
    const strategy = this.strategies.get(key);
    
    if (strategy) {
      return strategy;
    }

    // Fallback to adaptive strategy
    return this.createAdaptiveStrategy(userProfile, context);
  }

  private createAdaptiveStrategy(userProfile: UserPsychologyProfile, context: CoachingContext): CoachingStrategy {
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
  }

  private craftBaseMessage(userProfile: UserPsychologyProfile, context: CoachingContext, strategy: CoachingStrategy): string {
    const templates = this.getMessageTemplates(userProfile, context);
    const selectedTemplate = this.selectTemplate(templates, userProfile, context);
    return this.populateTemplate(selectedTemplate, userProfile, context);
  }

  private getMessageTemplates(userProfile: UserPsychologyProfile, context: CoachingContext): string[] {
    const templates: string[] = [];

    // Pre-workout templates
    if (context.sessionType === 'pre-workout') {
      if (userProfile.emotionalState === 'energized') {
        templates.push('¡Perfecto! Veo esa energía. Vamos a canalizarla hacia un entrenamiento épico.');
        templates.push('Tu energía es contagiosa. Hoy es el día perfecto para superar tus límites.');
      } else if (userProfile.emotionalState === 'stressed') {
        templates.push('Entiendo que has tenido un día difícil. El ejercicio será tu válvula de escape.');
        templates.push('Transformemos ese estrés en fuerza. Tu entrenamiento será tu momento de paz.');
      }
    }

    // During workout templates
    if (context.sessionType === 'during-workout') {
      if (userProfile.personalityTraits.competitiveness > 7) {
        templates.push('¡Vamos! Sabes que puedes dar más. Tu yo del pasado estaría orgulloso.');
        templates.push('Este es tu momento. Demuéstrate de qué estás hecho.');
      } else {
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
  }

  private selectTemplate(templates: string[], userProfile: UserPsychologyProfile, context: CoachingContext): string {
    if (templates.length === 0) {
      return 'Estoy aquí para apoyarte en tu journey. ¿Cómo te sientes hoy?';
    }

    // Select based on personality traits and context
    let selectedIndex = 0;
    
    if (userProfile.personalityTraits.competitiveness > 7 && context.sessionType === 'during-workout') {
      selectedIndex = Math.min(1, templates.length - 1);
    } else if (userProfile.emotionalState === 'stressed') {
      selectedIndex = 0; // More supportive option
    }

    return templates[selectedIndex] || templates[0];
  }

  private populateTemplate(template: string, userProfile: UserPsychologyProfile, context: CoachingContext): string {
    let message = template;

    // Add personalized elements based on user data
    if (userProfile.achievements.length > 0) {
      const recentAchievement = userProfile.achievements[0];
      message = message.replace(/tu mejor versión/g, `la versión que logró ${recentAchievement}`);
    }

    if (context.performanceMetrics?.progressTrend === 'improving') {
      message += ' Tu progreso constante es admirable.';
    }

    return message;
  }

  private personalizeMessage(message: string, userProfile: UserPsychologyProfile, context: CoachingContext): string {
    let personalizedMessage = message;

    // Add name if available
    // personalizedMessage = personalizedMessage.replace(/Vamos/g, `Vamos, ${userProfile.name || 'campeón'}`);

    // Adjust based on time of day
    if (context.timeOfDay === 'morning') {
      personalizedMessage += ' ¡Qué mejor manera de empezar el día!';
    } else if (context.timeOfDay === 'evening') {
      personalizedMessage += ' Termina el día con fuerza.';
    }

    // Add motivation type specific elements
    if (userProfile.motivationType === 'extrinsic') {
      personalizedMessage += ' Cada paso te acerca a tus objetivos.';
    } else if (userProfile.motivationType === 'intrinsic') {
      personalizedMessage += ' Disfruta el proceso y celebra tu crecimiento.';
    }

    return personalizedMessage;
  }

  private adaptToEmotionalState(message: string, userProfile: UserPsychologyProfile): string {
    let adaptedMessage = message;

    switch (userProfile.emotionalState) {
      case 'frustrated':
        adaptedMessage = `${adaptedMessage} Es normal sentir frustración; es parte del crecimiento.`;
        break;
      case 'confident':
        adaptedMessage = `${adaptedMessage} Tu confianza es tu superpoder.`;
        break;
      case 'stressed':
        adaptedMessage = `${adaptedMessage} Respira profundo, estás exactamente donde necesitas estar.`;
        break;
      case 'energized':
        adaptedMessage = `${adaptedMessage} ¡Esa energía es oro puro!`;
        break;
    }

    return adaptedMessage;
  }

  private determineMessageType(context: CoachingContext, userProfile: UserPsychologyProfile): CoachingMessage['type'] {
    if (context.sessionType === 'setback') return 'encouragement';
    if (context.sessionType === 'goal-setting') return 'reflection';
    if (userProfile.personalityTraits.competitiveness > 7) return 'challenge';
    if (userProfile.disciplineLevel === 'low') return 'motivation';
    return 'feedback';
  }

  private selectOptimalTone(userProfile: UserPsychologyProfile, context: CoachingContext): CoachingMessage['tone'] {
    if (userProfile.emotionalState === 'stressed') return 'understanding';
    if (userProfile.emotionalState === 'frustrated') return 'calm';
    if (userProfile.personalityTraits.competitiveness > 7) return 'challenging';
    if (userProfile.disciplineLevel === 'high') return 'firm';
    return 'supportive';
  }

  private generateActionItems(userProfile: UserPsychologyProfile, context: CoachingContext): string[] {
    const actions: string[] = [];

    if (context.sessionType === 'pre-workout') {
      actions.push('Realiza 5 minutos de calentamiento dinámico');
      actions.push('Visualiza tu mejor ejecución en cada ejercicio');
    } else if (context.sessionType === 'post-workout') {
      actions.push('Dedica 10 minutos al estiramiento');
      actions.push('Registra tu progreso en el diario de entrenamientos');
    } else if (context.sessionType === 'setback') {
      actions.push('Identifica una pequeña acción que puedas hacer hoy');
      actions.push('Recuerda tres logros pasados que te enorgullecen');
    }

    return actions;
  }

  private generateFollowUpQuestions(userProfile: UserPsychologyProfile, context: CoachingContext): string[] {
    const questions: string[] = [];

    if (userProfile.emotionalState === 'stressed') {
      questions.push('¿Qué te está generando más tensión últimamente?');
      questions.push('¿Cómo podemos ajustar tu rutina para reducir el estrés?');
    } else if (context.sessionType === 'goal-setting') {
      questions.push('¿Qué objetivo te emociona más trabajar esta semana?');
      questions.push('¿Qué obstáculo prevés y cómo podemos prepararnos?');
    } else if (userProfile.personalityTraits.selfConfidence < 5) {
      questions.push('¿Qué logro reciente te hace sentir más orgulloso?');
      questions.push('¿En qué área sientes que has mejorado más?');
    }

    return questions;
  }

  private estimateMessageImpact(userProfile: UserPsychologyProfile, context: CoachingContext): 'low' | 'moderate' | 'high' {
    let impactScore = 0;

    // Context factors
    if (context.sessionType === 'setback') impactScore += 3;
    if (context.sessionType === 'goal-setting') impactScore += 2;

    // User personality factors
    if (userProfile.motivationType === 'extrinsic') impactScore += 2;
    if (userProfile.disciplineLevel === 'low') impactScore += 2;
    if (userProfile.emotionalState === 'frustrated') impactScore += 3;

    if (impactScore >= 5) return 'high';
    if (impactScore >= 3) return 'moderate';
    return 'low';
  }

  // Helper methods for psychology analysis
  private calculateConsistency(behaviorData: any[]): number {
    if (!behaviorData || behaviorData.length === 0) return 5;
    
    const completedSessions = behaviorData.filter(session => session.completed).length;
    return Math.round((completedSessions / behaviorData.length) * 10);
  }

  private detectMotivationPattern(behaviorData: any[], userFeedback: any[]): { type: UserPsychologyProfile['motivationType'] } {
    // Analyze patterns to determine if user is more intrinsically or extrinsically motivated
    const externalFactors = userFeedback.filter(feedback => 
      feedback.content?.includes('objetivo') || 
      feedback.content?.includes('meta') ||
      feedback.content?.includes('resultado')
    ).length;

    const internalFactors = userFeedback.filter(feedback =>
      feedback.content?.includes('disfruto') ||
      feedback.content?.includes('me gusta') ||
      feedback.content?.includes('me siento')
    ).length;

    if (externalFactors > internalFactors * 1.5) return { type: 'extrinsic' };
    if (internalFactors > externalFactors * 1.5) return { type: 'intrinsic' };
    return { type: 'mixed' };
  }

  private analyzeEmotionalPatterns(userFeedback: any[]): any {
    // Analyze emotional keywords and patterns in user feedback
    return {
      dominant: 'neutral',
      trends: ['stable'],
      triggers: []
    };
  }

  private detectCurrentEmotionalState(emotionalPattern: any): UserPsychologyProfile['emotionalState'] {
    return emotionalPattern.dominant || 'neutral';
  }

  private assessDisciplineLevel(consistency: number, behaviorData: any[]): UserPsychologyProfile['disciplineLevel'] {
    if (consistency >= 8) return 'high';
    if (consistency >= 5) return 'moderate';
    return 'low';
  }

  private detectCommunicationPreference(userFeedback: any[]): UserPsychologyProfile['communicationPreference'] {
    // Analyze user's response patterns to determine preferred communication style
    return 'supportive'; // Default, could be enhanced with more analysis
  }

  private assessPersonalityTraits(behaviorData: any[], userFeedback: any[]): UserPsychologyProfile['personalityTraits'] {
    return {
      competitiveness: 6,
      perfectionism: 5,
      resilience: 7,
      selfConfidence: 6,
      socialMotivation: 5
    };
  }

  private extractCurrentGoals(userFeedback: any[]): string[] {
    return ['Mejorar fuerza', 'Consistencia en entrenamientos', 'Reducir estrés'];
  }

  private identifyRecentSetbacks(behaviorData: any[], performanceMetrics: any): string[] {
    return [];
  }

  private identifyRecentAchievements(performanceMetrics: any): string[] {
    return ['Completó semana de entrenamientos', 'Mejoró tiempo de recuperación'];
  }

  private getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private generateEncouragementMessage(userProfile: UserPsychologyProfile, context: CoachingContext): CoachingMessage {
    return {
      messageId: `encourage_${Date.now()}`,
      type: 'encouragement',
      content: 'Lo estás haciendo genial. A veces el cuerpo necesita tiempo para adaptarse. Sigue adelante.',
      tone: 'supportive',
      personalizedElements: ['struggle_support'],
      actionItems: ['Reduce la intensidad si es necesario', 'Enfócate en la técnica'],
      estimatedImpact: 'high'
    };
  }

  private generateChallengeMessage(userProfile: UserPsychologyProfile, context: CoachingContext): CoachingMessage {
    return {
      messageId: `challenge_${Date.now()}`,
      type: 'challenge',
      content: '¡Increíble! Estás en tu zona. ¿Puedes dar un 10% más en la próxima serie?',
      tone: 'challenging',
      personalizedElements: ['performance_recognition'],
      actionItems: ['Aumenta peso o repeticiones', 'Mantén la concentración'],
      estimatedImpact: 'high'
    };
  }

  private generateProgressMessage(userProfile: UserPsychologyProfile, context: CoachingContext): CoachingMessage {
    return {
      messageId: `progress_${Date.now()}`,
      type: 'feedback',
      content: 'Perfecto ritmo. Tu consistencia está dando frutos. Sigue así.',
      tone: 'calm',
      personalizedElements: ['steady_progress'],
      actionItems: ['Mantén la técnica', 'Controla la respiración'],
      estimatedImpact: 'moderate'
    };
  }

  private getSetbackStrategy(setbackType: string, userProfile: UserPsychologyProfile): any {
    return {
      name: `${setbackType}_recovery`,
      approach: userProfile.disciplineLevel === 'high' ? 'analytical' : 'supportive'
    };
  }

  private generateRecoveryMessage(userProfile: UserPsychologyProfile, context: CoachingContext, strategy: any, setbackDetails: any): CoachingMessage {
    return {
      messageId: `recovery_${Date.now()}`,
      type: 'encouragement',
      content: 'Todo campeón enfrenta obstáculos. La diferencia está en cómo nos levantamos. Vamos a crear un plan juntos.',
      tone: 'understanding',
      personalizedElements: ['setback_normalization'],
      actionItems: ['Identifica qué aprendiste', 'Define el próximo paso pequeño'],
      followUpQuestions: ['¿Qué crees que causó esta situación?', '¿Cómo te gustaría que te apoye?'],
      estimatedImpact: 'high'
    };
  }

  private generateGoalSettingMessage(userProfile: UserPsychologyProfile, context: CoachingContext, currentGoals: any[], progressData: any): CoachingMessage {
    return {
      messageId: `goal_${Date.now()}`,
      type: 'reflection',
      content: 'Tus objetivos son el mapa de tu journey. Vamos a asegurarnos de que sean específicos, medibles y emocionantes.',
      tone: 'calm',
      personalizedElements: ['goal_clarity'],
      actionItems: ['Define métricas específicas', 'Establece fecha límite realista'],
      followUpQuestions: ['¿Qué objetivo te emociona más?', '¿Qué recursos necesitas para lograrlo?'],
      estimatedImpact: 'high'
    };
  }

  private calculateGoalConsistency(progressData: any): number {
    return progressData?.consistency || 7;
  }

  private calculateGoalAdherence(currentGoals: any[], progressData: any): number {
    return progressData?.adherence || 6;
  }

  private generateAdaptiveContent(userProfile: UserPsychologyProfile, context: CoachingContext): string {
    const baseMessages = [
      'Estoy aquí para apoyarte en cada paso de tu journey.',
      'Tu dedicación es inspiradora. Vamos a seguir construyendo sobre tus fortalezas.',
      'Cada día es una nueva oportunidad para crecer. ¿Cómo te sientes hoy?'
    ];

    return baseMessages[Math.floor(Math.random() * baseMessages.length)];
  }

  private extractPersonalizedElements(userProfile: UserPsychologyProfile, context: CoachingContext): string[] {
    const elements: string[] = [];
    
    if (userProfile.disciplineLevel === 'high') elements.push('discipline_recognition');
    if (userProfile.emotionalState === 'confident') elements.push('confidence_boost');
    if (context.performanceMetrics?.progressTrend === 'improving') elements.push('progress_acknowledgment');
    
    return elements;
  }
}