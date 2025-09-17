/**
 * Habit Formation System - Behavioral Psychology & Micro-Habits
 * Sistema avanzado para construcción de hábitos sostenibles
 */

export interface HabitPsychologyProfile {
  motivationalDrivers: {
    intrinsic: number; // 1-10
    extrinsic: number; // 1-10
    social: number; // 1-10
    achievement: number; // 1-10
  };
  behavioralTendencies: {
    consistency: number; // 1-10
    impulsiveness: number; // 1-10
    perfectionism: number; // 1-10
    flexibility: number; // 1-10
  };
  environmentalFactors: {
    timeAvailability: 'limited' | 'moderate' | 'flexible';
    socialSupport: 'low' | 'moderate' | 'high';
    stressLevel: 'low' | 'moderate' | 'high';
  };
  preferredHabitStyle: 'gradual' | 'intensive' | 'flexible' | 'structured';
}

export interface MicroHabit {
  id: string;
  name: string;
  category: 'fitness' | 'nutrition' | 'rest' | 'mindset';
  description: string;
  triggerCue: string;
  minimumAction: string;
  celebrationRitual: string;
  difficulty: 'effortless' | 'easy' | 'moderate';
  estimatedTime: number; // seconds
  frequency: 'daily' | 'weekly' | 'contextual';
  psychologicalPrinciples: string[];
  scienceEvidence: {
    confidence: number; // 0-100
    sources: string[];
    mechanismOfAction: string;
  };
}

export interface HabitStack {
  id: string;
  name: string;
  description: string;
  habits: MicroHabit[];
  sequenceType: 'simultaneous' | 'sequential' | 'flexible';
  totalDuration: number; // minutes
  expectedAdherence: number; // percentage
}

export interface HabitProgress {
  habitId: string;
  streakDays: number;
  completionRate: number; // last 30 days
  psychologicalMarkers: {
    automaticity: number; // 1-10
    enjoyment: number; // 1-10
    effort: number; // 1-10
    identity: number; // 1-10
  };
  contextualFactors: {
    successTriggers: string[];
    failureTriggers: string[];
  };
}

export interface BehavioralIntervention {
  id: string;
  name: string;
  type: 'environmental' | 'cognitive' | 'social' | 'technological';
  description: string;
  implementation: string[];
  psychologyPrinciple: string;
  expectedImpact: 'low' | 'moderate' | 'high';
  evidenceLevel: number; // 0-100
}

export interface HabitFormationPlan {
  planId: string;
  startDate: Date;
  duration: number; // weeks
  targetHabits: HabitStack[];
  behavioralInterventions: BehavioralIntervention[];
  progressMilestones: {
    week: number;
    expectedOutcomes: string[];
    assessmentMetrics: string[];
  }[];
}

export class HabitFormationEngine {
  private habitLibrary: Map<string, MicroHabit> = new Map();
  private interventionLibrary: Map<string, BehavioralIntervention> = new Map();

  constructor() {
    this.initializeHabitLibrary();
    this.initializeInterventionLibrary();
  }

  /**
   * Crear plan personalizado de formación de hábitos
   */
  public createHabitFormationPlan(
    userProfile: HabitPsychologyProfile,
    fitnessGoals: string[],
    constraints: any
  ): HabitFormationPlan {
    console.log('🧠 Creando plan de formación de hábitos personalizado...');

    const selectedHabits = this.selectOptimalHabits(userProfile, fitnessGoals, constraints);
    const habitStacks = this.createHabitStacks(selectedHabits, userProfile);
    const interventions = this.selectBehavioralInterventions(userProfile);
    const milestones = this.createProgressMilestones(userProfile);

    return {
      planId: 'plan_' + Date.now(),
      startDate: new Date(),
      duration: this.calculateOptimalDuration(userProfile),
      targetHabits: habitStacks,
      behavioralInterventions: interventions,
      progressMilestones: milestones
    };
  }

  /**
   * Generar micro-hábitos usando principios de psicología conductual
   */
  public generateMicroHabits(
    category: 'fitness' | 'nutrition' | 'rest' | 'mindset',
    userProfile: HabitPsychologyProfile
  ): MicroHabit[] {
    const categoryHabits = Array.from(this.habitLibrary.values())
      .filter(h => h.category === category);
    
    return this.filterHabitsByProfile(categoryHabits, userProfile);
  }

  /**
   * Rastrear progreso y proporcionar insights conductuales
   */
  public trackHabitProgress(
    habitId: string,
    completed: boolean,
    context: any
  ): {
    insights: string[];
    recommendations: string[];
  } {
    const insights = this.generateBehavioralInsights(completed, context);
    const recommendations = this.generateAdaptationRecommendations(completed, context);

    return { insights, recommendations };
  }

  /**
   * Aplicar intervenciones conductuales
   */
  public applyBehavioralIntervention(
    interventionType: 'motivation' | 'environment' | 'social' | 'cognitive'
  ): BehavioralIntervention[] {
    return Array.from(this.interventionLibrary.values())
      .filter(i => i.type === interventionType || i.type === 'environmental');
  }

  private initializeHabitLibrary(): void {
    // Fitness Micro-Habits
    this.habitLibrary.set('morning-activation', {
      id: 'morning-activation',
      name: 'Activación Matutina',
      category: 'fitness',
      description: 'Realizar 10 jumping jacks al levantarse',
      triggerCue: 'Al salir de la cama',
      minimumAction: '10 jumping jacks',
      celebrationRitual: 'Sonreír y decir "¡Energía activada!"',
      difficulty: 'effortless',
      estimatedTime: 30,
      frequency: 'daily',
      psychologicalPrinciples: ['habit stacking', 'minimum viable habit'],
      scienceEvidence: {
        confidence: 85,
        sources: ['Exercise Psychology Research'],
        mechanismOfAction: 'Activa sistema nervioso simpático y libera endorfinas'
      }
    });

    this.habitLibrary.set('strength-micro', {
      id: 'strength-micro',
      name: 'Micro-Fuerza',
      category: 'fitness',
      description: 'Hacer 5 flexiones después de cada descanso',
      triggerCue: 'Durante pausas o anuncios',
      minimumAction: '1 flexión',
      celebrationRitual: 'Flexionar músculos con orgullo',
      difficulty: 'easy',
      estimatedTime: 60,
      frequency: 'contextual',
      psychologicalPrinciples: ['habit stacking', 'opportunity-based exercise'],
      scienceEvidence: {
        confidence: 83,
        sources: ['Resistance Training Research'],
        mechanismOfAction: 'Estimulación muscular distribuida mejora adaptación'
      }
    });

    // Nutrition Micro-Habits
    this.habitLibrary.set('hydration-cue', {
      id: 'hydration-cue',
      name: 'Hidratación Inmediata',
      category: 'nutrition',
      description: 'Beber un vaso de agua antes de cada comida',
      triggerCue: 'Antes de sentarse a comer',
      minimumAction: 'Un sorbo de agua',
      celebrationRitual: 'Apreciar el sabor del agua',
      difficulty: 'effortless',
      estimatedTime: 15,
      frequency: 'daily',
      psychologicalPrinciples: ['implementation intention', 'environmental design'],
      scienceEvidence: {
        confidence: 90,
        sources: ['Hydration Research'],
        mechanismOfAction: 'Mejora saciedad y optimiza metabolismo'
      }
    });

    this.habitLibrary.set('veggie-first', {
      id: 'veggie-first',
      name: 'Vegetales Primero',
      category: 'nutrition',
      description: 'Comer vegetales antes que el plato principal',
      triggerCue: 'Al servir la comida',
      minimumAction: 'Un bocado de vegetales',
      celebrationRitual: 'Agradecer nutrición al cuerpo',
      difficulty: 'easy',
      estimatedTime: 45,
      frequency: 'daily',
      psychologicalPrinciples: ['sequencing', 'implementation intention'],
      scienceEvidence: {
        confidence: 89,
        sources: ['Nutrition Behavior Research'],
        mechanismOfAction: 'Mejora saciedad y reduce ingesta calórica'
      }
    });

    // Rest Micro-Habits
    this.habitLibrary.set('sleep-boundary', {
      id: 'sleep-boundary',
      name: 'Frontera Digital',
      category: 'rest',
      description: 'Poner teléfono en modo avión 1 hora antes de dormir',
      triggerCue: 'Cuando aparezca recordatorio de sueño',
      minimumAction: 'Activar modo avión',
      celebrationRitual: 'Respirar profundo y sonreír',
      difficulty: 'easy',
      estimatedTime: 10,
      frequency: 'daily',
      psychologicalPrinciples: ['environmental modification', 'digital wellness'],
      scienceEvidence: {
        confidence: 88,
        sources: ['Sleep Research'],
        mechanismOfAction: 'Reduce luz azul y mejora melatonina'
      }
    });

    this.habitLibrary.set('breath-transition', {
      id: 'breath-transition',
      name: 'Transición Respiratoria',
      category: 'rest',
      description: '3 respiraciones profundas al entrar al dormitorio',
      triggerCue: 'Al entrar al dormitorio por la noche',
      minimumAction: '1 respiración profunda',
      celebrationRitual: 'Sonreír con gratitud',
      difficulty: 'effortless',
      estimatedTime: 30,
      frequency: 'daily',
      psychologicalPrinciples: ['environmental cue', 'physiological relaxation'],
      scienceEvidence: {
        confidence: 91,
        sources: ['Sleep Research'],
        mechanismOfAction: 'Activa sistema nervioso parasimpático'
      }
    });

    // Mindset Micro-Habits
    this.habitLibrary.set('gratitude-moment', {
      id: 'gratitude-moment',
      name: 'Momento de Gratitud',
      category: 'mindset',
      description: 'Pensar en algo por lo que estás agradecido',
      triggerCue: 'Al terminar el entrenamiento',
      minimumAction: 'Identificar una cosa positiva',
      celebrationRitual: 'Sonrisa genuina',
      difficulty: 'effortless',
      estimatedTime: 20,
      frequency: 'daily',
      psychologicalPrinciples: ['positive psychology', 'habit stacking'],
      scienceEvidence: {
        confidence: 92,
        sources: ['Positive Psychology Research'],
        mechanismOfAction: 'Activa circuitos de recompensa y reduce cortisol'
      }
    });

    this.habitLibrary.set('identity-affirmation', {
      id: 'identity-affirmation',
      name: 'Afirmación de Identidad',
      category: 'mindset',
      description: 'Decir "Soy una persona que cuida su salud"',
      triggerCue: 'Al terminar actividad física',
      minimumAction: 'Pensar "soy saludable"',
      celebrationRitual: 'Sentir orgullo genuino',
      difficulty: 'effortless',
      estimatedTime: 15,
      frequency: 'contextual',
      psychologicalPrinciples: ['identity-based habits', 'self-concept reinforcement'],
      scienceEvidence: {
        confidence: 86,
        sources: ['Identity Psychology'],
        mechanismOfAction: 'Refuerza autoconcepto saludable'
      }
    });
  }

  private initializeInterventionLibrary(): void {
    this.interventionLibrary.set('environment-prep', {
      id: 'environment-prep',
      name: 'Preparación del Ambiente',
      type: 'environmental',
      description: 'Modificar entorno para facilitar conducta deseada',
      implementation: [
        'Dejar ropa de ejercicio visible',
        'Preparar equipamiento la noche anterior',
        'Eliminar barreras físicas'
      ],
      psychologyPrinciple: 'Environmental Design & Friction Reduction',
      expectedImpact: 'high',
      evidenceLevel: 87
    });

    this.interventionLibrary.set('social-accountability', {
      id: 'social-accountability',
      name: 'Responsabilidad Social',
      type: 'social',
      description: 'Utilizar presión social positiva',
      implementation: [
        'Compartir objetivos con persona de confianza',
        'Reportes semanales de progreso',
        'Celebrar logros en comunidad'
      ],
      psychologyPrinciple: 'Social Learning Theory & Accountability',
      expectedImpact: 'high',
      evidenceLevel: 82
    });

    this.interventionLibrary.set('cognitive-reframe', {
      id: 'cognitive-reframe',
      name: 'Reestructuración Cognitiva',
      type: 'cognitive',
      description: 'Cambiar patrones de pensamiento limitantes',
      implementation: [
        'Identificar pensamientos saboteadores',
        'Desarrollar mantras personalizados',
        'Práctica de autocompasión'
      ],
      psychologyPrinciple: 'Cognitive Behavioral Therapy',
      expectedImpact: 'moderate',
      evidenceLevel: 78
    });
  }

  private selectOptimalHabits(
    userProfile: HabitPsychologyProfile,
    goals: string[],
    constraints: any
  ): MicroHabit[] {
    const allHabits = Array.from(this.habitLibrary.values());
    return this.filterHabitsByProfile(allHabits, userProfile).slice(0, 6);
  }

  private filterHabitsByProfile(
    habits: MicroHabit[],
    userProfile: HabitPsychologyProfile
  ): MicroHabit[] {
    return habits.filter(habit => {
      if (userProfile.preferredHabitStyle === 'gradual' && habit.difficulty === 'moderate') {
        return false;
      }
      if (userProfile.environmentalFactors.timeAvailability === 'limited' && habit.estimatedTime > 60) {
        return false;
      }
      return true;
    });
  }

  private createHabitStacks(habits: MicroHabit[], userProfile: HabitPsychologyProfile): HabitStack[] {
    const morningHabits = habits.filter(h => 
      h.triggerCue.includes('levantarse') || h.triggerCue.includes('mañana')
    );

    const eveningHabits = habits.filter(h => 
      h.triggerCue.includes('dormir') || h.triggerCue.includes('noche')
    );

    const stacks: HabitStack[] = [];

    if (morningHabits.length > 0) {
      stacks.push({
        id: 'morning-stack',
        name: 'Rutina Matutina Poderosa',
        description: 'Secuencia de hábitos para empezar el día con energía',
        habits: morningHabits,
        sequenceType: 'sequential',
        totalDuration: morningHabits.reduce((sum, h) => sum + h.estimatedTime, 0) / 60,
        expectedAdherence: this.calculateExpectedAdherence(userProfile)
      });
    }

    if (eveningHabits.length > 0) {
      stacks.push({
        id: 'evening-stack',
        name: 'Ritual Nocturno Reparador',
        description: 'Secuencia para optimizar descanso',
        habits: eveningHabits,
        sequenceType: 'flexible',
        totalDuration: eveningHabits.reduce((sum, h) => sum + h.estimatedTime, 0) / 60,
        expectedAdherence: this.calculateExpectedAdherence(userProfile)
      });
    }

    return stacks;
  }

  private selectBehavioralInterventions(userProfile: HabitPsychologyProfile): BehavioralIntervention[] {
    const interventions: BehavioralIntervention[] = [];

    if (userProfile.behavioralTendencies.consistency < 6) {
      interventions.push(this.interventionLibrary.get('environment-prep')!);
    }

    if (userProfile.motivationalDrivers.social > 7) {
      interventions.push(this.interventionLibrary.get('social-accountability')!);
    }

    if (userProfile.behavioralTendencies.perfectionism > 7) {
      interventions.push(this.interventionLibrary.get('cognitive-reframe')!);
    }

    return interventions;
  }

  private createProgressMilestones(userProfile: HabitPsychologyProfile): HabitFormationPlan['progressMilestones'] {
    return [
      {
        week: 1,
        expectedOutcomes: ['Establecimiento de triggers iniciales', 'Familiarización con rutinas'],
        assessmentMetrics: ['completion_rate', 'trigger_recognition']
      },
      {
        week: 3,
        expectedOutcomes: ['Reducción de esfuerzo consciente', 'Mejora en consistencia'],
        assessmentMetrics: ['automaticity_score', 'adherence_pattern']
      },
      {
        week: 6,
        expectedOutcomes: ['Automatización parcial', 'Integración con identidad'],
        assessmentMetrics: ['habit_strength', 'identity_alignment']
      },
      {
        week: 12,
        expectedOutcomes: ['Automatización completa', 'Expansión sostenible'],
        assessmentMetrics: ['full_automaticity', 'long_term_sustainability']
      }
    ];
  }

  private calculateOptimalDuration(userProfile: HabitPsychologyProfile): number {
    let baseDuration = 12;
    if (userProfile.behavioralTendencies.consistency < 5) baseDuration += 4;
    return baseDuration;
  }

  private calculateExpectedAdherence(userProfile: HabitPsychologyProfile): number {
    let adherence = 70;
    if (userProfile.behavioralTendencies.consistency > 7) adherence += 15;
    if (userProfile.motivationalDrivers.intrinsic > 7) adherence += 10;
    return Math.max(30, Math.min(95, adherence));
  }

  private generateBehavioralInsights(completed: boolean, context: any): string[] {
    const insights: string[] = [];
    
    if (completed) {
      insights.push('¡Excelente! Cada repetición fortalece las conexiones neuronales del hábito.');
      insights.push('Tu consistencia está construyendo automaticidad neurológica.');
    } else {
      insights.push('Los lapsos son normales. Lo importante es retomar rápidamente.');
      insights.push('Considera simplificar la acción mínima para mañana.');
    }

    return insights;
  }

  private generateAdaptationRecommendations(completed: boolean, context: any): string[] {
    const recommendations: string[] = [];

    if (!completed) {
      recommendations.push('Reduce la acción a su mínima expresión viable');
      recommendations.push('Refuerza el trigger ambiental');
      recommendations.push('Aumenta la recompensa inmediata');
    } else {
      recommendations.push('Mantén la consistencia actual');
      recommendations.push('Considera agregar variación gradual');
    }

    return recommendations;
  }
}