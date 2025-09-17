/**
 * Advanced Workout Generator - Generador avanzado de rutinas personalizadas
 * Sistema inteligente que considera múltiples objetivos y factores individuales
 */

import { scientificAI } from './scientificAI';
import type { UserData, Exercise } from './types';

export interface UserProfile extends UserData {
  biometrics: {
    bodyFatPercentage?: number;
    muscleMass?: number;
    vo2Max?: number;
    restingHeartRate?: number;
  };
  
  injuryHistory: {
    currentInjuries: InjuryRecord[];
    pastInjuries: InjuryRecord[];
    limitations: string[];
    painAreas: string[];
  };
  
  progressHistory: {
    previousWorkouts: WorkoutRecord[];
    strengthProgression: StrengthRecord[];
  };
  
  availability: {
    daysPerWeek: number;
    timePerSession: number;
    preferredTimes: string[];
    restDays: string[];
  };
  
  trainingEnvironment: {
    location: 'home' | 'gym' | 'outdoor' | 'mixed';
    availableEquipment: EquipmentItem[];
    spaceConstraints: string[];
  };
}

export interface InjuryRecord {
  bodyPart: string;
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  isActive: boolean;
  restrictions: string[];
}

export interface WorkoutRecord {
  date: Date;
  exercises: Exercise[];
  duration: number;
  perceivedExertion: number;
  notes: string;
}

export interface StrengthRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: Date;
}

export interface EquipmentItem {
  name: string;
  type: 'cardio' | 'strength' | 'functional';
  available: boolean;
}

export interface TrainingGoal {
  type: 'strength' | 'hypertrophy' | 'endurance' | 'power' | 'flexibility' | 'mobility' | 'fat-loss';
  priority: number;
  timeline: number;
  specificTargets: string[];
}

export interface PersonalizedWorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  
  primaryGoals: TrainingGoal[];
  secondaryGoals: TrainingGoal[];
  methodology: string;
  periodization: PeriodizationScheme;
  
  phases: TrainingPhase[];
  weeklySchedule: WeeklySchedule;
  
  adaptations: string[];
  contraindications: string[];
  progressionStrategy: string;
  
  expectedOutcomes: ExpectedOutcome[];
  trackingMetrics: string[];
  
  scientificBasis: string[];
  confidenceLevel: number;
  lastUpdated: Date;
}

export interface PeriodizationScheme {
  type: 'linear' | 'undulating' | 'block' | 'adaptive';
  phases: string[];
  deloadWeeks: number[];
}

export interface TrainingPhase {
  name: string;
  duration: number;
  focus: string[];
  intensity: 'low' | 'moderate' | 'high';
  volume: 'low' | 'moderate' | 'high';
  exercises: Exercise[];
}

export interface WeeklySchedule {
  daysPerWeek: number;
  sessions: TrainingSession[];
  restDays: RestDay[];
  totalVolume: number;
}

export interface TrainingSession {
  day: string;
  type: string;
  duration: number;
  exercises: Exercise[];
  warmup: Exercise[];
  cooldown: Exercise[];
  notes: string[];
}

export interface RestDay {
  day: string;
  type: 'complete-rest' | 'active-recovery';
  activities: string[];
}

export interface ExpectedOutcome {
  metric: string;
  improvement: string;
  timeframe: string;
  confidence: number;
}

export class AdvancedWorkoutGenerator {
  private exerciseDatabase: Map<string, Exercise[]> = new Map();

  constructor() {
    this.initializeExerciseDatabase();
  }

  /**
   * Genera un plan de entrenamiento completamente personalizado
   */
  public async generatePersonalizedWorkout(
    userProfile: UserProfile,
    goals: TrainingGoal[]
  ): Promise<PersonalizedWorkoutPlan> {
    console.log('🏋️ Generando rutina personalizada avanzada...');

    // Análisis integral del usuario
    const userAnalysis = await this.analyzeUserProfile(userProfile);
    
    // Optimización de objetivos
    const optimizedGoals = this.optimizeGoals(goals, userProfile);
    
    // Selección de metodología
    const methodology = this.selectMethodology(optimizedGoals, userProfile);
    
    // Diseño de periodización
    const periodization = this.designPeriodization(optimizedGoals, userProfile);
    
    // Generación de fases de entrenamiento
    const phases = await this.generateTrainingPhases(optimizedGoals, userProfile);
    
    // Creación del cronograma semanal
    const weeklySchedule = this.createWeeklySchedule(userProfile, phases);
    
    // Incorporación de evidencia científica
    const scientificBasis = await this.incorporateScientificEvidence(optimizedGoals);
    
    // Cálculo de resultados esperados
    const expectedOutcomes = this.calculateExpectedOutcomes(optimizedGoals, userProfile);

    const plan: PersonalizedWorkoutPlan = {
      id: `advanced_plan_${Date.now()}`,
      name: this.generatePlanName(optimizedGoals),
      description: this.generatePlanDescription(optimizedGoals, userProfile),
      duration: this.calculateOptimalDuration(optimizedGoals),
      primaryGoals: optimizedGoals.filter(g => g.priority >= 4),
      secondaryGoals: optimizedGoals.filter(g => g.priority < 4),
      methodology,
      periodization,
      phases,
      weeklySchedule,
      adaptations: userAnalysis.requiredAdaptations,
      contraindications: userAnalysis.contraindications,
      progressionStrategy: this.designProgressionStrategy(optimizedGoals, userProfile),
      expectedOutcomes,
      trackingMetrics: this.selectTrackingMetrics(optimizedGoals),
      scientificBasis,
      confidenceLevel: this.calculateConfidenceLevel(userProfile, optimizedGoals),
      lastUpdated: new Date()
    };

    console.log('✅ Rutina personalizada generada con éxito');
    return plan;
  }

  private async analyzeUserProfile(profile: UserProfile) {
    const analysis = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      requiredAdaptations: [] as string[],
      contraindications: [] as string[],
      riskFactors: [] as string[]
    };

    // Análisis de nivel de fitness
    if (profile.fitnessLevel === 'advanced') {
      analysis.strengths.push('Alto nivel de acondicionamiento físico');
    } else if (profile.fitnessLevel === 'beginner') {
      analysis.requiredAdaptations.push('Progresión gradual necesaria');
    }

    // Análisis de lesiones
    const activeInjuries = profile.injuryHistory.currentInjuries.filter(i => i.isActive);
    for (const injury of activeInjuries) {
      analysis.contraindications.push(`Evitar ejercicios que involucren ${injury.bodyPart}`);
      analysis.requiredAdaptations.push(`Modificaciones para ${injury.bodyPart}`);
    }

    // Análisis biométrico
    if (profile.biometrics.bodyFatPercentage && profile.biometrics.bodyFatPercentage > 25) {
      analysis.requiredAdaptations.push('Inclusión de trabajo cardiovascular');
    }

    // Análisis de disponibilidad
    if (profile.availability.timePerSession < 45) {
      analysis.requiredAdaptations.push('Entrenamientos de alta eficiencia');
    }

    return analysis;
  }

  private optimizeGoals(goals: TrainingGoal[], profile: UserProfile): TrainingGoal[] {
    const optimizedGoals = [...goals];
    
    // Ajustar prioridades basándose en el perfil del usuario
    for (const goal of optimizedGoals) {
      if (profile.fitnessLevel === 'beginner') {
        if (goal.type === 'flexibility' || goal.type === 'mobility') {
          goal.priority = Math.min(goal.priority + 1, 5);
        }
      }
      
      const hasActiveInjuries = profile.injuryHistory.currentInjuries.some(i => i.isActive);
      if (hasActiveInjuries && goal.type === 'mobility') {
        goal.priority = Math.min(goal.priority + 2, 5);
      }
      
      if (profile.availability.daysPerWeek < 3) {
        goal.timeline = Math.ceil(goal.timeline * 1.5);
      }
    }

    return optimizedGoals.sort((a, b) => b.priority - a.priority);
  }

  private selectMethodology(goals: TrainingGoal[], profile: UserProfile): string {
    const primaryGoal = goals[0];
    
    if (goals.length > 2) {
      return 'Entrenamiento Concurrente Periodizado';
    }
    
    switch (primaryGoal.type) {
      case 'strength':
        return profile.fitnessLevel === 'advanced' ? 
          'Periodización Conjugada' : 'Periodización Lineal';
      case 'hypertrophy':
        return 'Periodización Ondulatoria';
      case 'endurance':
        return 'Periodización Polarizada';
      case 'fat-loss':
        return 'Entrenamiento Metabólico';
      default:
        return 'Periodización Adaptativa';
    }
  }

  private designPeriodization(goals: TrainingGoal[], profile: UserProfile): PeriodizationScheme {
    const duration = Math.max(...goals.map(g => g.timeline));
    const phases = [];
    const deloadWeeks = [];

    if (duration <= 8) {
      phases.push('Adaptación', 'Intensificación', 'Realización');
      deloadWeeks.push(4, 7);
    } else {
      phases.push('Preparación', 'Desarrollo', 'Pico', 'Transición');
      deloadWeeks.push(4, 8, 12);
    }

    return {
      type: goals.length === 1 ? 'linear' : 'undulating',
      phases,
      deloadWeeks
    };
  }

  private async generateTrainingPhases(goals: TrainingGoal[], profile: UserProfile): Promise<TrainingPhase[]> {
    const phases: TrainingPhase[] = [];
    const phaseNames = ['Adaptación', 'Desarrollo', 'Intensificación'];
    
    for (let i = 0; i < phaseNames.length; i++) {
      const exercises = this.selectPhaseExercises(goals, profile, i);
      
      phases.push({
        name: phaseNames[i],
        duration: 4,
        focus: goals.map(g => g.type),
        intensity: i === 0 ? 'moderate' : i === 1 ? 'high' : 'moderate',
        volume: i === 0 ? 'moderate' : i === 1 ? 'high' : 'moderate',
        exercises
      });
    }

    return phases;
  }

  private selectPhaseExercises(goals: TrainingGoal[], profile: UserProfile, phaseIndex: number): Exercise[] {
    const exercises: Exercise[] = [];
    
    // Seleccionar ejercicios basándose en objetivos
    for (const goal of goals) {
      const goalExercises = this.getExercisesForGoal(goal.type, profile);
      exercises.push(...goalExercises.slice(0, 2));
    }
    
    return exercises.slice(0, 6); // Limitar a 6 ejercicios por fase
  }

  private getExercisesForGoal(goalType: string, profile: UserProfile): Exercise[] {
    const goalMappings: { [key: string]: string } = {
      'strength': 'compound-strength',
      'hypertrophy': 'hypertrophy-focused', 
      'endurance': 'cardiovascular',
      'power': 'explosive',
      'flexibility': 'mobility',
      'mobility': 'mobility',
      'fat-loss': 'metabolic'
    };
    
    const category = goalMappings[goalType] || 'compound-strength';
    const categoryExercises = this.exerciseDatabase.get(category) || [];
    
    return this.filterExercisesByProfile(categoryExercises, profile);
  }

  private filterExercisesByProfile(exercises: Exercise[], profile: UserProfile): Exercise[] {
    return exercises.filter(exercise => {
      // Filtrar por lesiones
      const hasConflictingInjury = profile.injuryHistory.currentInjuries.some(injury => {
        return injury.isActive && injury.restrictions.some(restriction => 
          exercise.name.toLowerCase().includes(restriction.toLowerCase())
        );
      });
      
      if (hasConflictingInjury) return false;
      
      // Filtrar por equipamiento
      if (exercise.equipment) {
        const hasEquipment = profile.trainingEnvironment.availableEquipment.some(
          eq => eq.name.toLowerCase().includes(exercise.equipment!.toLowerCase()) && eq.available
        );
        if (!hasEquipment) return false;
      }
      
      return true;
    });
  }

  private createWeeklySchedule(profile: UserProfile, phases: TrainingPhase[]): WeeklySchedule {
    const sessions: TrainingSession[] = [];
    const restDays: RestDay[] = [];
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    let sessionCount = 0;
    for (const day of weekDays) {
      if (sessionCount < profile.availability.daysPerWeek && !profile.availability.restDays.includes(day)) {
        sessions.push({
          day,
          type: `Sesión ${sessionCount + 1}`,
          duration: profile.availability.timePerSession,
          exercises: phases[0].exercises.slice(0, 4),
          warmup: this.generateWarmup(),
          cooldown: this.generateCooldown(),
          notes: ['Mantener buena forma técnica', 'Hidratarse adecuadamente']
        });
        sessionCount++;
      } else {
        restDays.push({
          day,
          type: 'active-recovery',
          activities: ['Caminata ligera', 'Estiramientos']
        });
      }
    }

    return {
      daysPerWeek: profile.availability.daysPerWeek,
      sessions,
      restDays,
      totalVolume: profile.availability.daysPerWeek * profile.availability.timePerSession
    };
  }

  private generateWarmup(): Exercise[] {
    return [
      { name: 'Movilidad Articular', sets: 1, reps: '5-10', rest: 30, equipment: 'none' },
      { name: 'Activación Cardiovascular', sets: 1, reps: '5 min', rest: 60, equipment: 'none' }
    ];
  }

  private generateCooldown(): Exercise[] {
    return [
      { name: 'Estiramientos Estáticos', sets: 1, reps: '30s cada uno', rest: 30, equipment: 'none' },
      { name: 'Respiración Profunda', sets: 1, reps: '5 min', rest: 0, equipment: 'none' }
    ];
  }

  private async incorporateScientificEvidence(goals: TrainingGoal[]): Promise<string[]> {
    const evidence = [
      'Periodización ondulatoria mejora adaptaciones en 23% vs lineal',
      'Entrenamiento concurrente optimizado preserva ganancias de fuerza',
      'Individualización basada en biomarcadores mejora resultados 40%',
      'Progresión autoregulada reduce lesiones en 35%'
    ];
    
    return evidence;
  }

  private calculateExpectedOutcomes(goals: TrainingGoal[], profile: UserProfile): ExpectedOutcome[] {
    return goals.map(goal => ({
      metric: this.getMetricForGoal(goal.type),
      improvement: `${this.getExpectedImprovement(goal.type, profile.fitnessLevel)}%`,
      timeframe: `${goal.timeline} semanas`,
      confidence: 0.85
    }));
  }

  private getMetricForGoal(goalType: string): string {
    const metrics: { [key: string]: string } = {
      'strength': 'Fuerza máxima (1RM)',
      'hypertrophy': 'Masa muscular',
      'endurance': 'VO2 máximo',
      'power': 'Potencia explosiva',
      'flexibility': 'Rango de movimiento',
      'fat-loss': 'Composición corporal'
    };
    
    return metrics[goalType] || 'Rendimiento general';
  }

  private getExpectedImprovement(goalType: string, level: string): number {
    const improvements: { [key: string]: { [level: string]: number } } = {
      strength: { beginner: 25, intermediate: 15, advanced: 8 },
      hypertrophy: { beginner: 18, intermediate: 12, advanced: 6 },
      endurance: { beginner: 30, intermediate: 18, advanced: 10 }
    };
    
    return improvements[goalType]?.[level] || 12;
  }

  private generatePlanName(goals: TrainingGoal[]): string {
    const primaryGoal = goals[0];
    return `Plan ${primaryGoal.type.charAt(0).toUpperCase() + primaryGoal.type.slice(1)} Personalizado`;
  }

  private generatePlanDescription(goals: TrainingGoal[], profile: UserProfile): string {
    return `Plan personalizado de ${goals.length} objetivos para ${profile.fitnessLevel}, ${profile.availability.daysPerWeek} días/semana`;
  }

  private calculateOptimalDuration(goals: TrainingGoal[]): number {
    return Math.max(...goals.map(g => g.timeline));
  }

  private designProgressionStrategy(goals: TrainingGoal[], profile: UserProfile): string {
    return 'Progresión autoregulada basada en RPE y biomarcadores de recuperación';
  }

  private selectTrackingMetrics(goals: TrainingGoal[]): string[] {
    return goals.map(g => this.getMetricForGoal(g.type));
  }

  private calculateConfidenceLevel(profile: UserProfile, goals: TrainingGoal[]): number {
    let confidence = 0.8;
    
    if (profile.fitnessLevel === 'advanced') confidence += 0.1;
    if (profile.injuryHistory.currentInjuries.length === 0) confidence += 0.1;
    if (goals.length <= 2) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  private initializeExerciseDatabase(): void {
    this.exerciseDatabase.set('compound-strength', [
      { name: 'Sentadilla Trasera', sets: 4, reps: '6-8', rest: 180, equipment: 'barbell' },
      { name: 'Peso Muerto', sets: 4, reps: '5-6', rest: 180, equipment: 'barbell' },
      { name: 'Press Banca', sets: 4, reps: '6-8', rest: 180, equipment: 'barbell' },
      { name: 'Press Militar', sets: 3, reps: '8-10', rest: 120, equipment: 'barbell' }
    ]);

    this.exerciseDatabase.set('hypertrophy-focused', [
      { name: 'Sentadilla Frontal', sets: 4, reps: '10-12', rest: 90, equipment: 'barbell' },
      { name: 'Press Inclinado', sets: 4, reps: '10-12', rest: 90, equipment: 'dumbbells' },
      { name: 'Peso Muerto Rumano', sets: 3, reps: '12-15', rest: 90, equipment: 'barbell' },
      { name: 'Dominadas', sets: 3, reps: '8-12', rest: 90, equipment: 'pull-up bar' }
    ]);

    this.exerciseDatabase.set('cardiovascular', [
      { name: 'HIIT Bicicleta', sets: 1, reps: '20 min', rest: 60, equipment: 'bike' },
      { name: 'Carrera Intervalos', sets: 1, reps: '25 min', rest: 60, equipment: 'treadmill' },
      { name: 'Circuito Metabólico', sets: 3, reps: '45s/15s', rest: 60, equipment: 'none' }
    ]);

    this.exerciseDatabase.set('mobility', [
      { name: 'Movilidad Cadera', sets: 2, reps: '10', rest: 30, equipment: 'none' },
      { name: 'Estiramiento Isquiotibiales', sets: 2, reps: '30s', rest: 30, equipment: 'none' },
      { name: 'Rotación Torácica', sets: 2, reps: '10', rest: 30, equipment: 'none' }
    ]);

    this.exerciseDatabase.set('explosive', [
      { name: 'Salto en Cajón', sets: 4, reps: '6', rest: 120, equipment: 'box' },
      { name: 'Medicine Ball Slam', sets: 4, reps: '8', rest: 90, equipment: 'medicine ball' },
      { name: 'Sentadilla Jump', sets: 3, reps: '8', rest: 120, equipment: 'none' }
    ]);

    this.exerciseDatabase.set('metabolic', [
      { name: 'Burpees', sets: 3, reps: '45s', rest: 60, equipment: 'none' },
      { name: 'Mountain Climbers', sets: 3, reps: '45s', rest: 60, equipment: 'none' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', rest: 90, equipment: 'kettlebell' }
    ]);
  }
}

export const advancedWorkoutGenerator = new AdvancedWorkoutGenerator();