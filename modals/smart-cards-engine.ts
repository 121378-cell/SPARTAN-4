// Advanced Smart Cards Modal Engine

import {
  SmartCardConfiguration,
  Exercise,
  ExerciseSet,
  SmartCardData,
  ExercisePerformance,
  TimerSettings,
  TimerState,
  BiometricData,
  RealTimeFeedback,
  ProgressMetrics,
  AdaptiveRecommendation,
  SmartCardEvent,
  SmartCardAnalytics,
  UserPreferences,
  UserContext
} from './smart-cards-types';

// Explicitly re-export TimerState to ensure the correct type is used
export type { TimerState } from './smart-cards-types';

export class AdvancedSmartCardsEngine {
  private exercises: Map<string, Exercise> = new Map();
  private userPreferences: UserPreferences;
  private userContext: UserContext;
  private events: SmartCardEvent[] = [];
  private analytics: Map<string, SmartCardAnalytics> = new Map();
  private biometricHistory: BiometricData[] = [];

  constructor(userPreferences: UserPreferences, userContext: UserContext) {
    this.userPreferences = userPreferences;
    this.userContext = userContext;
    this.initializeExerciseDatabase();
  }

  private initializeExerciseDatabase(): void {
    // Initialize with a comprehensive set of exercises
    const exerciseDatabase: Exercise[] = [
      {
        id: 'barbell_back_squat',
        name: 'Barbell Back Squat',
        category: 'compound',
        primaryMuscles: ['quadriceps', 'glutes'],
        secondaryMuscles: ['hamstrings', 'core', 'calves'],
        equipmentRequired: ['barbell', 'squat_rack'],
        difficultyLevel: 'intermediate',
        movementPattern: 'squat',
        videoUrls: {
          instruction: 'https://example.com/exercises/squat/instruction.mp4',
          demonstration: 'https://example.com/exercises/squat/demonstration.mp4',
          commonMistakes: 'https://example.com/exercises/squat/mistakes.mp4'
        }
      },
      {
        id: 'conventional_deadlift',
        name: 'Conventional Deadlift',
        category: 'compound',
        primaryMuscles: ['hamstrings', 'glutes', 'erector_spinae'],
        secondaryMuscles: ['quadriceps', 'core', 'forearms'],
        equipmentRequired: ['barbell'],
        difficultyLevel: 'intermediate',
        movementPattern: 'hinge',
        videoUrls: {
          instruction: 'https://example.com/exercises/deadlift/instruction.mp4',
          demonstration: 'https://example.com/exercises/deadlift/demonstration.mp4',
          commonMistakes: 'https://example.com/exercises/deadlift/mistakes.mp4'
        }
      },
      {
        id: 'barbell_bench_press',
        name: 'Barbell Bench Press',
        category: 'compound',
        primaryMuscles: ['pectorals', 'anterior_deltoids', 'triceps'],
        secondaryMuscles: ['core', 'forearms'],
        equipmentRequired: ['barbell', 'bench'],
        difficultyLevel: 'intermediate',
        movementPattern: 'push',
        videoUrls: {
          instruction: 'https://example.com/exercises/bench_press/instruction.mp4',
          demonstration: 'https://example.com/exercises/bench_press/demonstration.mp4',
          commonMistakes: 'https://example.com/exercises/bench_press/mistakes.mp4'
        }
      },
      {
        id: 'standing_overhead_press',
        name: 'Standing Overhead Press',
        category: 'compound',
        primaryMuscles: ['anterior_deltoids', 'triceps', 'upper_chest'],
        secondaryMuscles: ['core', 'trapezius'],
        equipmentRequired: ['barbell'],
        difficultyLevel: 'intermediate',
        movementPattern: 'push',
        videoUrls: {
          instruction: 'https://example.com/exercises/overhead_press/instruction.mp4',
          demonstration: 'https://example.com/exercises/overhead_press/demonstration.mp4',
          commonMistakes: 'https://example.com/exercises/overhead_press/mistakes.mp4'
        }
      },
      {
        id: 'pull_up',
        name: 'Pull-Up',
        category: 'compound',
        primaryMuscles: ['latissimus_dorsi', 'rhomboids', 'middle_trapezius'],
        secondaryMuscles: ['biceps', 'forearms'],
        equipmentRequired: ['pull_up_bar'],
        difficultyLevel: 'intermediate',
        movementPattern: 'pull',
        videoUrls: {
          instruction: 'https://example.com/exercises/pull_up/instruction.mp4',
          demonstration: 'https://example.com/exercises/pull_up/demonstration.mp4',
          commonMistakes: 'https://example.com/exercises/pull_up/mistakes.mp4'
        }
      }
    ];

    exerciseDatabase.forEach(exercise => {
      this.exercises.set(exercise.id, exercise);
    });
  }

  public generateSmartCard(
    exerciseId: string,
    sets: ExerciseSet[],
    configuration: SmartCardConfiguration
  ): SmartCardData | null {
    const exercise = this.exercises.get(exerciseId);
    if (!exercise) {
      return null;
    }

    // Get progress history for this exercise
    const progressHistory = this.getExerciseProgressHistory(exerciseId);
    
    // Get current recommendations based on user data
    const currentRecommendations = this.generateAdaptiveRecommendations(exerciseId, progressHistory);
    
    // Get recommended variations
    const recommendedVariations = this.getRecommendedVariations(exerciseId);
    
    const smartCardData: SmartCardData = {
      cardId: `card_${exerciseId}_${Date.now()}`,
      exercise,
      sets,
      instructions: this.generateInstructions(exercise),
      formCues: this.generateFormCues(exercise),
      commonMistakes: this.generateCommonMistakes(exercise),
      safetyTips: this.generateSafetyTips(exercise),
      recommendedVariations,
      progressHistory,
      currentRecommendations
    };

    // Log card creation event
    this.logEvent({
      type: 'card_opened',
      cardId: smartCardData.cardId,
      payload: { exerciseId, configuration },
      timestamp: new Date(),
      source: 'system'
    });

    return smartCardData;
  }

  private generateInstructions(exercise: Exercise): string[] {
    const instructions: string[] = [];
    
    switch (exercise.id) {
      case 'barbell_back_squat':
        instructions.push(
          'Position the barbell on your upper back, just below the neck',
          'Feet shoulder-width apart, toes slightly turned out',
          'Take a deep breath and brace your core',
          'Descend by pushing your hips back and bending your knees',
          'Keep your chest up and back neutral throughout the movement',
          'Descend until thighs are parallel to the floor or lower',
          'Drive through your heels to return to the starting position',
          'Exhale at the top of the movement'
        );
        break;
        
      case 'conventional_deadlift':
        instructions.push(
          'Approach the bar with feet hip-width apart',
          'Grip the bar just outside your knees',
          'Bend at the hips and knees to lower your body',
          'Keep your back neutral and chest up',
          'Take a deep breath and brace your core',
          'Drive through your heels to lift the bar',
          'Extend your hips and knees simultaneously',
          'Stand tall at the top, squeezing your glutes',
          'Lower the bar by pushing your hips back and bending your knees'
        );
        break;
        
      default:
        instructions.push(
          'Follow proper form for this exercise',
          'Maintain good posture throughout',
          'Control the movement on both the concentric and eccentric phases',
          'Breathe appropriately for the movement'
        );
    }
    
    return instructions;
  }

  private generateFormCues(exercise: Exercise): string[] {
    const formCues: string[] = [];
    
    switch (exercise.movementPattern) {
      case 'squat':
        formCues.push(
          'Chest up, back neutral',
          'Knees tracking over toes',
          'Weight in heels',
          'Core braced',
          'Depth at or below parallel'
        );
        break;
        
      case 'hinge':
        formCues.push(
          'Hips back, knees slightly bent',
          'Back neutral, chest up',
          'Weight in heels',
          'Core braced',
          'Bar path close to body'
        );
        break;
        
      case 'push':
        formCues.push(
          'Shoulder blades retracted',
          'Core braced',
          'Elbows at appropriate angle',
          'Full range of motion',
          'Controlled movement'
        );
        break;
        
      case 'pull':
        formCues.push(
          'Shoulder blades retracted and depressed',
          'Core braced',
          'Elbows driving to sides or back',
          'Full range of motion',
          'Controlled movement'
        );
        break;
        
      default:
        formCues.push(
          'Maintain proper posture',
          'Control the movement',
          'Breathe appropriately',
          'Use full range of motion'
        );
    }
    
    return formCues;
  }

  private generateCommonMistakes(exercise: Exercise): string[] {
    const mistakes: string[] = [];
    
    switch (exercise.movementPattern) {
      case 'squat':
        mistakes.push(
          'Knees caving inward',
          'Leaning too far forward',
          'Not going deep enough',
          'Rising too quickly on the ascent',
          'Losing neutral spine position'
        );
        break;
        
      case 'hinge':
        mistakes.push(
          'Rounding the back',
          'Squatting instead of hinging',
          'Bar drifting away from body',
          'Not engaging posterior chain',
          'Hyperextending at the top'
        );
        break;
        
      default:
        mistakes.push(
          'Using momentum instead of control',
          'Incomplete range of motion',
          'Poor posture',
          'Holding breath too long',
          'Rushing through repetitions'
        );
    }
    
    return mistakes;
  }

  private generateSafetyTips(exercise: Exercise): string[] {
    const safetyTips: string[] = [];
    
    // General safety tips
    safetyTips.push(
      'Start with lighter weights to master form',
      'Use a spotter when lifting heavy weights',
      'Ensure equipment is properly secured',
      'Listen to your body and stop if you feel pain',
      'Warm up properly before starting'
    );
    
    // Exercise-specific safety tips
    switch (exercise.id) {
      case 'conventional_deadlift':
        safetyTips.push(
          'Never round your back during the lift',
          'Keep the bar close to your body throughout the movement',
          'Don\'t jerk the weight off the floor'
        );
        break;
        
      case 'barbell_bench_press':
        safetyTips.push(
          'Always use safety bars or a spotter',
          'Arch your back slightly but maintain control',
          'Don\'t bounce the bar off your chest'
        );
        break;
    }
    
    return safetyTips;
  }

  private getExerciseProgressHistory(exerciseId: string): ExercisePerformance[] {
    // In a real implementation, this would fetch from a database
    // For now, we'll return a mock history
    return [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        sessionId: 'session_1',
        sets: [
          {
            setId: 'set_1_1',
            setNumber: 1,
            targetReps: 8,
            targetLoad: 60,
            targetRPE: 7,
            completedReps: 8,
            completedLoad: 60,
            completedRPE: 7
          }
        ],
        perceivedEffort: 7
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        sessionId: 'session_2',
        sets: [
          {
            setId: 'set_2_1',
            setNumber: 1,
            targetReps: 8,
            targetLoad: 65,
            targetRPE: 7,
            completedReps: 8,
            completedLoad: 65,
            completedRPE: 7
          }
        ],
        perceivedEffort: 7
      }
    ];
  }

  private generateAdaptiveRecommendations(
    exerciseId: string,
    progressHistory: ExercisePerformance[]
  ): AdaptiveRecommendation[] {
    const recommendations: AdaptiveRecommendation[] = [];
    
    // Analyze progress history to generate recommendations
    if (progressHistory.length >= 2) {
      const recentPerformance = progressHistory[progressHistory.length - 1];
      const previousPerformance = progressHistory[progressHistory.length - 2];
      
      // Check if load should be increased
      if (recentPerformance.sets[0] && previousPerformance.sets[0] &&
          recentPerformance.sets[0].completedReps === recentPerformance.sets[0].targetReps &&
          recentPerformance.sets[0].completedRPE && recentPerformance.sets[0].targetRPE &&
          recentPerformance.sets[0].completedRPE <= recentPerformance.sets[0].targetRPE - 1) {
        recommendations.push({
          type: 'load',
          description: 'Increase load for continued progression',
          value: (recentPerformance.sets[0].completedLoad || 0) + 2.5,
          confidence: 85,
          rationale: 'Completed target reps with RPE below target, indicating capacity for increased load',
          timestamp: new Date()
        });
      }
      
      // Check if rest period should be adjusted
      const avgRest = progressHistory.reduce((sum, perf) => {
        const rest = perf.sets[0]?.restTaken || 0;
        return sum + rest;
      }, 0) / progressHistory.length;
      
      if (avgRest > 120) {
        recommendations.push({
          type: 'rest',
          description: 'Reduce rest period to increase training density',
          value: Math.max(90, avgRest - 15),
          confidence: 70,
          rationale: 'Extended rest periods may be reducing training intensity',
          timestamp: new Date()
        });
      }
    }
    
    // Consider user context for recommendations
    if (this.userContext.currentEnergyLevel < 5) {
      recommendations.push({
        type: 'intensity',
        description: 'Reduce intensity due to low energy levels',
        value: 'Decrease load by 10%',
        confidence: 90,
        rationale: 'User reports low energy level today',
        timestamp: new Date()
      });
    }
    
    if (this.userContext.stressLevel > 7) {
      recommendations.push({
        type: 'volume',
        description: 'Reduce volume due to high stress levels',
        value: 'Reduce sets by 1',
        confidence: 85,
        rationale: 'User reports high stress level today',
        timestamp: new Date()
      });
    }
    
    return recommendations;
  }

  private getRecommendedVariations(exerciseId: string): Exercise[] {
    const variations: Exercise[] = [];
    
    // Return exercise variations based on the current exercise
    switch (exerciseId) {
      case 'barbell_back_squat':
        variations.push(
          this.exercises.get('conventional_deadlift')!,
          this.exercises.get('standing_overhead_press')!
        );
        break;
        
      case 'conventional_deadlift':
        variations.push(
          this.exercises.get('barbell_back_squat')!,
          this.exercises.get('pull_up')!
        );
        break;
        
      default:
        // Return some general variations
        const exerciseIds = Array.from(this.exercises.keys());
        for (let i = 0; i < Math.min(2, exerciseIds.length); i++) {
          const randomId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)];
          const exercise = this.exercises.get(randomId);
          if (exercise && exercise.id !== exerciseId) {
            variations.push(exercise);
          }
        }
    }
    
    return variations;
  }

  public initializeTimer(settings: TimerSettings): TimerState {
    return {
      currentPhase: 'preparation',
      timeRemaining: settings.preparationTime,
      isRunning: false,
      currentSetIndex: 0,
      totalSets: 0
    };
  }

  public updateTimerState(
    currentState: TimerState,
    settings: TimerSettings,
    action: 'start' | 'pause' | 'reset' | 'next' | 'previous'
  ): TimerState {
    const newState = { ...currentState };
    
    switch (action) {
      case 'start':
        newState.isRunning = true;
        break;
        
      case 'pause':
        newState.isRunning = false;
        break;
        
      case 'reset':
        newState.currentPhase = 'preparation';
        newState.timeRemaining = settings.preparationTime;
        newState.isRunning = false;
        newState.currentSetIndex = 0;
        break;
        
      case 'next':
        if (newState.currentPhase === 'preparation') {
          newState.currentPhase = 'work';
          newState.timeRemaining = settings.workTime;
        } else if (newState.currentPhase === 'work') {
          newState.currentPhase = 'rest' as typeof newState.currentPhase;
          newState.timeRemaining = settings.restTime;
        } else if (newState.currentPhase === 'rest') {
          newState.currentSetIndex++;
          newState.currentPhase = 'work';
          newState.timeRemaining = settings.workTime;
        }
        break;
        
      case 'previous':
        if (newState.currentPhase === 'work' && newState.timeRemaining === settings.workTime) {
          if (newState.currentSetIndex > 0) {
            newState.currentSetIndex--;
            newState.currentPhase = 'rest' as typeof newState.currentPhase;
            newState.timeRemaining = settings.restTime;
          } else {
            newState.currentPhase = 'preparation';
            newState.timeRemaining = settings.preparationTime;
          }
        } else if (newState.currentPhase === 'rest') {
          newState.currentPhase = 'work';
          newState.timeRemaining = settings.workTime;
        } else if (newState.currentPhase === 'preparation' && newState.timeRemaining === settings.preparationTime) {
          // Already at the beginning
        } else {
          // Reset current phase time
          switch (newState.currentPhase) {
            case 'preparation':
              newState.timeRemaining = settings.preparationTime;
              break;
            case 'work':
              newState.timeRemaining = settings.workTime;
              break;
            case 'rest' as typeof newState.currentPhase:
              newState.timeRemaining = settings.restTime;
              break;
          }
        }
        break;
    }
    
    return newState;
  }

  public processBiometricData(data: BiometricData): RealTimeFeedback[] {
    const feedback: RealTimeFeedback[] = [];
    this.biometricHistory.push(data);
    
    // Limit history to last 100 data points
    if (this.biometricHistory.length > 100) {
      this.biometricHistory = this.biometricHistory.slice(-100);
    }
    
    // Generate feedback based on biometric data
    if (data.heartRate && data.heartRate > 180) {
      feedback.push({
        type: 'safety_warning',
        message: 'Heart rate is elevated. Consider reducing intensity or taking additional rest.',
        priority: 'high',
        suggestedAction: 'Reduce weight or take a longer rest period',
        timestamp: new Date()
      });
    }
    
    if (data.heartRateVariability && data.heartRateVariability < 20) {
      feedback.push({
        type: 'performance_insight',
        message: 'Heart rate variability is low, indicating possible fatigue or stress.',
        priority: 'medium',
        suggestedAction: 'Consider deloading or focusing on recovery',
        timestamp: new Date()
      });
    }
    
    return feedback;
  }

  public calculateProgressMetrics(exerciseId: string): ProgressMetrics {
    const progressHistory = this.getExerciseProgressHistory(exerciseId);
    
    // Calculate metrics based on progress history
    let strengthVolume = 0;
    let maxReps = 0;
    let formScores: number[] = [];
    
    progressHistory.forEach(performance => {
      performance.sets.forEach(set => {
        if (set.completedLoad && set.completedReps) {
          strengthVolume += set.completedLoad * set.completedReps;
        }
        maxReps = Math.max(maxReps, set.completedReps || 0);
        
        if (performance.videoAnalysis) {
          formScores.push(performance.videoAnalysis.formScore);
        }
      });
    });
    
    const avgFormScore = formScores.length > 0 
      ? formScores.reduce((a, b) => a + b, 0) / formScores.length 
      : 7;
    
    // Determine trends (simplified)
    const strengthTrend = progressHistory.length >= 2 ? 'improving' : 'stable';
    const enduranceTrend = maxReps > 8 ? 'improving' : 'stable';
    const techniqueTrend = avgFormScore > 7 ? 'improving' : 'stable';
    
    return {
      strength: {
        volumeLoad: strengthVolume,
        trend: strengthTrend
      },
      endurance: {
        maxReps,
        repRangeEfficiency: 0.8,
        trend: enduranceTrend
      },
      technique: {
        formScore: avgFormScore,
        consistency: 0.75,
        trend: techniqueTrend
      },
      recovery: {
        readinessScore: this.userContext.currentEnergyLevel,
        fatigueLevel: this.userContext.stressLevel,
        trend: this.userContext.currentEnergyLevel > 5 ? 'improving' : 'declining'
      }
    };
  }

  private logEvent(event: SmartCardEvent): void {
    this.events.push(event);
    
    // Limit event history
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  public getEvents(): SmartCardEvent[] {
    return [...this.events];
  }

  public updateAnalytics(cardId: string, update: Partial<SmartCardAnalytics['usageStats']>): void {
    if (!this.analytics.has(cardId)) {
      this.analytics.set(cardId, {
        cardId,
        usageStats: {
          views: 0,
          completions: 0,
          averageTimeSpent: 0,
          interactionRate: 0
        },
        performanceStats: {
          averageFormScore: 0,
          averageRPE: 0,
          consistencyScore: 0
        },
        feedbackStats: {
          positiveFeedback: 0,
          negativeFeedback: 0,
          suggestionsImplemented: 0
        },
        adaptationStats: {
          recommendationsGiven: 0,
          recommendationsAccepted: 0,
          performanceImprovement: 0
        }
      });
    }
    
    const current = this.analytics.get(cardId)!;
    
    if (update.views !== undefined) current.usageStats.views = update.views;
    if (update.completions !== undefined) current.usageStats.completions = update.completions;
    if (update.averageTimeSpent !== undefined) current.usageStats.averageTimeSpent = update.averageTimeSpent;
    if (update.interactionRate !== undefined) current.usageStats.interactionRate = update.interactionRate;
    
    this.analytics.set(cardId, current);
  }

  public getAnalytics(cardId?: string): SmartCardAnalytics | Map<string, SmartCardAnalytics> {
    if (cardId) {
      return this.analytics.get(cardId) || {
        cardId,
        usageStats: {
          views: 0,
          completions: 0,
          averageTimeSpent: 0,
          interactionRate: 0
        },
        performanceStats: {
          averageFormScore: 0,
          averageRPE: 0,
          consistencyScore: 0
        },
        feedbackStats: {
          positiveFeedback: 0,
          negativeFeedback: 0,
          suggestionsImplemented: 0
        },
        adaptationStats: {
          recommendationsGiven: 0,
          recommendationsAccepted: 0,
          performanceImprovement: 0
        }
      };
    }
    
    return new Map(this.analytics);
  }
}