// Advanced Plan Design Modal Engine

import {
  PlanObjective,
  PlanConfiguration,
  TrainingBlock,
  ExerciseAssignment,
  TacticalCalendar,
  TacticalWeek,
  TacticalDay,
  TrainingSession,
  SmartCard,
  PlanGenerationResult,
  TrainingPlan,
  PlanUpdateRequest,
  PlanSyncEvent,
  PlanAnalytics,
  AdaptiveAdjustment,
  UserPreferences,
  UserBiometrics
} from './plan-design-types';

export class AdvancedPlanDesignEngine {
  private objectives: PlanObjective[] = [];
  private exercises: Map<string, any> = new Map(); // Exercise database
  private syncEvents: PlanSyncEvent[] = [];
  private analytics: Map<string, PlanAnalytics> = new Map();
  private adaptiveAdjustments: AdaptiveAdjustment[] = [];

  constructor() {
    this.initializeObjectives();
    this.initializeExerciseDatabase();
  }

  private initializeObjectives(): void {
    this.objectives = [
      {
        id: 'strength_primary',
        name: 'Strength Development',
        description: 'Maximize muscular strength through progressive overload',
        primaryFocus: 'strength',
        secondaryFocuses: ['hypertrophy'],
        recommendedDuration: [8, 12, 16],
        intensityProfile: 'high'
      },
      {
        id: 'hypertrophy_primary',
        name: 'Muscle Growth',
        description: 'Optimize muscle hypertrophy through volume and tension',
        primaryFocus: 'hypertrophy',
        secondaryFocuses: ['strength'],
        recommendedDuration: [8, 12, 16, 20],
        intensityProfile: 'moderate'
      },
      {
        id: 'endurance_primary',
        name: 'Endurance Improvement',
        description: 'Enhance muscular and cardiovascular endurance',
        primaryFocus: 'endurance',
        secondaryFocuses: ['fat_loss'],
        recommendedDuration: [6, 8, 12],
        intensityProfile: 'moderate'
      },
      {
        id: 'fat_loss_primary',
        name: 'Body Composition',
        description: 'Reduce body fat while preserving lean mass',
        primaryFocus: 'fat_loss',
        secondaryFocuses: ['endurance', 'strength'],
        recommendedDuration: [8, 12, 16],
        intensityProfile: 'high'
      },
      {
        id: 'performance_primary',
        name: 'Athletic Performance',
        description: 'Enhance overall athletic performance and movement quality',
        primaryFocus: 'performance',
        secondaryFocuses: ['strength', 'endurance'],
        recommendedDuration: [12, 16, 20],
        intensityProfile: 'high'
      }
    ];
  }

  private initializeExerciseDatabase(): void {
    // Initialize with a basic set of exercises
    // In a real implementation, this would connect to a comprehensive exercise database
    const basicExercises = [
      { id: 'squat', name: 'Barbell Back Squat', category: 'compound', primaryMuscles: ['quadriceps', 'glutes'] },
      { id: 'deadlift', name: 'Conventional Deadlift', category: 'compound', primaryMuscles: ['hamstrings', 'glutes', 'erector_spinae'] },
      { id: 'bench_press', name: 'Barbell Bench Press', category: 'compound', primaryMuscles: ['pectorals', 'anterior_deltoids', 'triceps'] },
      { id: 'overhead_press', name: 'Standing Overhead Press', category: 'compound', primaryMuscles: ['anterior_deltoids', 'triceps', 'upper_chest'] },
      { id: 'pull_up', name: 'Pull-Up', category: 'compound', primaryMuscles: ['latissimus_dorsi', 'rhomboids', 'middle_trapezius'] },
      { id: 'barbell_row', name: 'Barbell Row', category: 'compound', primaryMuscles: ['latissimus_dorsi', 'rhomboids', 'middle_trapezius'] }
    ];

    basicExercises.forEach(exercise => {
      this.exercises.set(exercise.id, exercise);
    });
  }

  public generatePlan(configuration: PlanConfiguration): PlanGenerationResult {
    try {
      // Validate configuration
      if (!this.validateConfiguration(configuration)) {
        return {
          success: false,
          errorMessage: 'Invalid plan configuration'
        };
      }

      // Create training blocks
      const blocks = this.createTrainingBlocks(configuration);
      
      // Create tactical calendar
      const tacticalCalendar = this.createTacticalCalendar(configuration, blocks);
      
      // Create smart cards
      const smartCards = this.createSmartCards(tacticalCalendar);
      
      // Create the training plan
      const plan: TrainingPlan = {
        id: `plan_${Date.now()}`,
        name: `${configuration.objective.name} Plan - ${configuration.duration} Weeks`,
        description: `Personalized ${configuration.duration}-week plan focused on ${configuration.objective.primaryFocus}`,
        configuration,
        blocks,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0'
      };

      // Log sync event
      this.logSyncEvent({
        type: 'plan_created',
        planId: plan.id,
        payload: { plan, tacticalCalendar, smartCards },
        timestamp: new Date(),
        source: 'modal'
      });

      return {
        success: true,
        plan,
        tacticalCalendar,
        smartCards
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error during plan generation'
      };
    }
  }

  private validateConfiguration(configuration: PlanConfiguration): boolean {
    // Check if objective exists
    if (!this.objectives.some(obj => obj.id === configuration.objective.id)) {
      return false;
    }

    // Check duration is within recommended range
    if (!configuration.objective.recommendedDuration.includes(configuration.duration)) {
      // For testing purposes, we'll consider this an error
      // In a real implementation, this might just be a warning
      return false;
    }

    // Validate biometrics
    if (configuration.userBiometrics.age < 13 || configuration.userBiometrics.age > 100) {
      return false;
    }

    // Validate training frequency
    if (configuration.userPreferences.trainingFrequency < 1 || configuration.userPreferences.trainingFrequency > 7) {
      return false;
    }

    return true;
  }

  private createTrainingBlocks(configuration: PlanConfiguration): TrainingBlock[] {
    const blocks: TrainingBlock[] = [];
    const totalWeeks = configuration.duration;
    
    // Create periodization blocks based on duration
    if (totalWeeks <= 4) {
      // Simple linear periodization
      blocks.push({
        id: 'block_1',
        name: 'Accumulation Phase',
        description: 'Building volume and work capacity',
        weekRange: [1, totalWeeks],
        focus: 'accumulation',
        volume: 'high',
        intensity: 'moderate',
        exercises: this.assignExercises(configuration, 'accumulation')
      });
    } else if (totalWeeks <= 8) {
      // Two-block periodization
      blocks.push({
        id: 'block_1',
        name: 'Accumulation Phase',
        description: 'Building volume and work capacity',
        weekRange: [1, Math.floor(totalWeeks / 2)],
        focus: 'accumulation',
        volume: 'high',
        intensity: 'moderate',
        exercises: this.assignExercises(configuration, 'accumulation')
      });
      
      blocks.push({
        id: 'block_2',
        name: 'Intensification Phase',
        description: 'Increasing intensity and specificity',
        weekRange: [Math.floor(totalWeeks / 2) + 1, totalWeeks],
        focus: 'intensification',
        volume: 'moderate',
        intensity: 'high',
        exercises: this.assignExercises(configuration, 'intensification')
      });
    } else {
      // Four-block periodization for longer programs
      const blockLength = Math.floor(totalWeeks / 4);
      
      blocks.push({
        id: 'block_1',
        name: 'Accumulation Phase',
        description: 'Building volume and work capacity',
        weekRange: [1, blockLength],
        focus: 'accumulation',
        volume: 'high',
        intensity: 'moderate',
        exercises: this.assignExercises(configuration, 'accumulation')
      });
      
      blocks.push({
        id: 'block_2',
        name: 'Intensification Phase',
        description: 'Increasing intensity and specificity',
        weekRange: [blockLength + 1, blockLength * 2],
        focus: 'intensification',
        volume: 'moderate',
        intensity: 'high',
        exercises: this.assignExercises(configuration, 'intensification')
      });
      
      blocks.push({
        id: 'block_3',
        name: 'Realization Phase',
        description: 'Peak performance expression',
        weekRange: [blockLength * 2 + 1, blockLength * 3],
        focus: 'realization',
        volume: 'low',
        intensity: 'high',
        exercises: this.assignExercises(configuration, 'realization')
      });
      
      blocks.push({
        id: 'block_4',
        name: 'Deload/Testing Phase',
        description: 'Recovery and assessment',
        weekRange: [blockLength * 3 + 1, totalWeeks],
        focus: 'deload',
        volume: 'low',
        intensity: 'low',
        exercises: this.assignExercises(configuration, 'deload')
      });
    }
    
    return blocks;
  }

  private assignExercises(configuration: PlanConfiguration, phase: string): ExerciseAssignment[] {
    const exercises: ExerciseAssignment[] = [];
    const objective = configuration.objective;
    
    // Select exercises based on objective and phase
    switch (objective.primaryFocus) {
      case 'strength':
        exercises.push(
          this.createExerciseAssignment('squat', phase),
          this.createExerciseAssignment('deadlift', phase),
          this.createExerciseAssignment('bench_press', phase),
          this.createExerciseAssignment('overhead_press', phase),
          this.createExerciseAssignment('pull_up', phase),
          this.createExerciseAssignment('barbell_row', phase)
        );
        break;
        
      case 'hypertrophy':
        exercises.push(
          this.createExerciseAssignment('squat', phase),
          this.createExerciseAssignment('deadlift', phase),
          this.createExerciseAssignment('bench_press', phase),
          this.createExerciseAssignment('overhead_press', phase),
          this.createExerciseAssignment('pull_up', phase),
          this.createExerciseAssignment('barbell_row', phase)
        );
        break;
        
      case 'endurance':
        // For endurance, we might include more accessory and circuit work
        exercises.push(
          this.createExerciseAssignment('squat', phase),
          this.createExerciseAssignment('pull_up', phase),
          this.createExerciseAssignment('overhead_press', phase)
        );
        break;
        
      case 'fat_loss':
        // For fat loss, we might include more compound and circuit work
        exercises.push(
          this.createExerciseAssignment('squat', phase),
          this.createExerciseAssignment('deadlift', phase),
          this.createExerciseAssignment('pull_up', phase)
        );
        break;
        
      case 'performance':
        // For performance, we might include more varied movement patterns
        exercises.push(
          this.createExerciseAssignment('squat', phase),
          this.createExerciseAssignment('deadlift', phase),
          this.createExerciseAssignment('bench_press', phase),
          this.createExerciseAssignment('pull_up', phase),
          this.createExerciseAssignment('overhead_press', phase),
          this.createExerciseAssignment('barbell_row', phase)
        );
        break;
    }
    
    return exercises;
  }

  private createExerciseAssignment(exerciseId: string, phase: string): ExerciseAssignment {
    // Get exercise from database
    const exercise = this.exercises.get(exerciseId);
    if (!exercise) {
      throw new Error(`Exercise ${exerciseId} not found in database`);
    }
    
    // Create exercise assignment based on phase
    let sets, reps, rpe, tempo, restPeriod;
    
    switch (phase) {
      case 'accumulation':
        sets = 3;
        reps = '8-12';
        rpe = 7;
        tempo = '3010';
        restPeriod = 90;
        break;
        
      case 'intensification':
        sets = 4;
        reps = '3-6';
        rpe = 8;
        tempo = '2010';
        restPeriod = 180;
        break;
        
      case 'realization':
        sets = 2;
        reps = '1-3';
        rpe = 9;
        tempo = '1010';
        restPeriod = 240;
        break;
        
      case 'deload':
        sets = 2;
        reps = '8-10';
        rpe = 6;
        tempo = '3010';
        restPeriod = 90;
        break;
        
      default:
        sets = 3;
        reps = '6-10';
        rpe = 7;
        tempo = '2010';
        restPeriod = 120;
    }
    
    return {
      id: `${exerciseId}_${phase}_${Date.now()}`,
      exerciseId,
      name: exercise.name,
      category: exercise.category,
      sets,
      reps,
      rpe,
      tempo,
      restPeriod
    };
  }

  private createTacticalCalendar(configuration: PlanConfiguration, blocks: TrainingBlock[]): TacticalCalendar {
    const startDate = configuration.startDate;
    const totalWeeks = configuration.duration;
    const weeks: TacticalWeek[] = [];
    
    // Create weeks
    for (let weekNumber = 1; weekNumber <= totalWeeks; weekNumber++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
      
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      
      // Create days for this week
      const days: TacticalDay[] = [];
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const dayDate = new Date(weekStartDate);
        dayDate.setDate(weekStartDate.getDate() + dayOffset);
        
        // Determine day of week
        const dayOfWeekMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayOfWeek = dayOfWeekMap[dayDate.getDay()] as any;
        
        // Create sessions for this day (simplified)
        const sessions: TrainingSession[] = [];
        
        // Only create sessions for training days based on frequency
        const trainingDays = this.getTrainingDays(configuration.userPreferences.trainingFrequency);
        if (trainingDays.includes(dayOfWeek)) {
          sessions.push(this.createTrainingSession(weekNumber, dayOffset, configuration, blocks));
        }
        
        days.push({
          date: dayDate,
          dayOfWeek,
          sessions
        });
      }
      
      // Calculate week summary (simplified)
      const totalSessions = days.reduce((sum, day) => sum + day.sessions.length, 0);
      
      weeks.push({
        weekNumber,
        startDate: weekStartDate,
        endDate: weekEndDate,
        days,
        summary: {
          totalSessions,
          totalVolume: totalSessions * 100, // Simplified volume calculation
          intensityDistribution: {
            low: 0,
            moderate: totalSessions > 0 ? Math.floor(totalSessions / 2) : 0,
            high: totalSessions > 0 ? Math.ceil(totalSessions / 2) : 0
          }
        }
      });
    }
    
    return {
      id: `calendar_${Date.now()}`,
      planId: `plan_${Date.now()}`,
      startDate,
      endDate: new Date(startDate.getTime() + (totalWeeks * 7 - 1) * 24 * 60 * 60 * 1000),
      weeks
    };
  }

  private getTrainingDays(frequency: number): string[] {
    // Simplified mapping of training frequency to days
    const trainingDayMap: { [key: number]: string[] } = {
      1: ['monday'],
      2: ['monday', 'thursday'],
      3: ['monday', 'wednesday', 'friday'],
      4: ['monday', 'tuesday', 'thursday', 'friday'],
      5: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      6: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      7: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    };
    
    return trainingDayMap[frequency] || ['monday', 'wednesday', 'friday'];
  }

  private createTrainingSession(weekNumber: number, dayOffset: number, configuration: PlanConfiguration, blocks: TrainingBlock[]): TrainingSession {
    // Determine which block we're in
    const currentBlock = blocks.find(block => 
      weekNumber >= block.weekRange[0] && weekNumber <= block.weekRange[1]
    ) || blocks[0];
    
    // Create a simplified session
    return {
      id: `session_${weekNumber}_${dayOffset}_${Date.now()}`,
      name: `${currentBlock.name} Session`,
      type: 'strength',
      duration: 60, // 1 hour default
      exercises: currentBlock.exercises,
      warmup: [
        {
          id: `warmup_${weekNumber}_${dayOffset}`,
          exerciseId: 'general_warmup',
          name: 'General Warm-Up',
          category: 'warmup',
          sets: 1,
          reps: '5-10 minutes',
          notes: ['Dynamic stretching', 'Light cardio', 'Mobility work']
        }
      ]
    };
  }

  private createSmartCards(tacticalCalendar: TacticalCalendar): SmartCard[] {
    const smartCards: SmartCard[] = [];
    
    // Create smart cards for each exercise in each session
    tacticalCalendar.weeks.forEach(week => {
      week.days.forEach(day => {
        day.sessions.forEach(session => {
          session.exercises.forEach(exercise => {
            smartCards.push(this.createSmartCard(session.id, exercise));
          });
        });
      });
    });
    
    return smartCards;
  }

  private createSmartCard(sessionId: string, exercise: ExerciseAssignment): SmartCard {
    return {
      id: `card_${sessionId}_${exercise.id}`,
      sessionId,
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.name,
      instructions: [
        `Perform ${exercise.sets} sets of ${exercise.reps} reps`,
        `Use an RPE of ${exercise.rpe || 'as prescribed'}`,
        `Rest for ${exercise.restPeriod || 120} seconds between sets`
      ],
      formCues: [
        'Maintain proper posture throughout the movement',
        'Control the eccentric (lowering) phase',
        'Focus on muscle activation'
      ],
      commonMistakes: [
        'Using momentum instead of control',
        'Incomplete range of motion',
        'Rushing through repetitions'
      ],
      videoUrl: exercise.videoUrl || `https://example.com/exercises/${exercise.exerciseId}.mp4`,
      timerSettings: {
        workTime: 0, // Will be set by user
        restTime: exercise.restPeriod || 120,
        rounds: exercise.sets
      },
      performanceTracking: {
        setsCompleted: 0,
        repsCompleted: [],
        loadUsed: [],
        rpeReported: [],
        notes: []
      }
    };
  }

  private logSyncEvent(event: PlanSyncEvent): void {
    this.syncEvents.push(event);
    
    // Limit event history
    if (this.syncEvents.length > 1000) {
      this.syncEvents = this.syncEvents.slice(-1000);
    }
  }

  public getSyncEvents(): PlanSyncEvent[] {
    return [...this.syncEvents];
  }
}