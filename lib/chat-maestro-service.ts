/**
 * Chat Maestro - Central Intelligence System for SPARTAN 4
 * The brain that connects all modules, explains plans, resolves doubts, 
 * modifies routines in real-time, and serves as the strategic core of the system.
 */

import { storageManager } from './storage';
import { habitTrackingService } from './habit-tracking';
import { recoveryService } from './recovery-service';
import { loadProgressionService } from './load-progression-service';
import { nutritionService } from './nutrition-service';
import { predictiveAnalyticsEngine } from './predictive-analytics';
import { progressReportGenerator } from './progress-report-generator';
import { ConversationalCoach, UserPsychologyProfile } from './conversationalCoach';
import type { 
  UserData, 
  WorkoutPlan, 
  WorkoutSession, 
  RecoveryAnalysis, 
  ProgressionPlan, 
  DailyNutrition, 
  UserHabit 
} from './types';

// Types for Chat Maestro
export type ChatContext = {
  userId: string;
  currentScreen: string;
  activeWorkout?: WorkoutPlan;
  activeSession?: WorkoutSession;
  userData: UserData;
  userHabits: UserHabit[];
  recentWorkouts: WorkoutSession[];
  recoveryStatus?: RecoveryAnalysis;
  progressionPlans: ProgressionPlan[];
  nutritionData?: DailyNutrition;
};

export type ChatIntent = 
  | 'workout_inquiry'
  | 'recovery_advice'
  | 'progression_guidance'
  | 'nutrition_guidance'
  | 'routine_modification'
  | 'performance_analysis'
  | 'goal_setting'
  | 'motivation'
  | 'technical_support'
  | 'general';

export type ChatResponse = {
  response: string;
  actionItems?: string[];
  recommendations?: any[];
  contextUpdates?: Partial<ChatContext>;
};

export class ChatMaestroService {
  private static instance: ChatMaestroService;
  private conversationalCoach: ConversationalCoach;
  
  static getInstance(): ChatMaestroService {
    if (!ChatMaestroService.instance) {
      ChatMaestroService.instance = new ChatMaestroService();
    }
    return ChatMaestroService.instance;
  }
  
  constructor() {
    this.conversationalCoach = new ConversationalCoach();
  }
  
  /**
   * Process user input and generate intelligent response
   */
  async processUserInput(input: string, context: ChatContext): Promise<ChatResponse> {
    console.log('🧠 Chat Maestro processing user input:', input);
    
    // Determine user intent
    const intent = this.determineIntent(input, context);
    
    // Generate response based on intent and context
    const response = await this.generateResponse(input, intent, context);
    
    return response;
  }
  
  /**
   * Perform real-time data analysis and generate insights
   */
  async performRealTimeAnalysis(context: ChatContext): Promise<any> {
    console.log('🔍 Chat Maestro performing real-time analysis');
    
    const insights: any = {};
    
    // Analyze training patterns
    insights.trainingPatterns = this.analyzeTrainingPatterns(context);
    
    // Analyze recovery trends
    insights.recoveryTrends = this.analyzeRecoveryTrends(context);
    
    // Analyze progression trends
    insights.progressionTrends = this.analyzeProgressionTrends(context);
    
    // Analyze nutrition adherence
    insights.nutritionAdherence = this.analyzeNutritionAdherence(context);
    
    // Generate predictive insights
    insights.predictiveInsights = await this.generatePredictiveInsights(context);
    
    return insights;
  }
  
  /**
   * Analyze training patterns
   */
  private analyzeTrainingPatterns(context: ChatContext): any {
    const recentWorkouts = context.recentWorkouts;
    
    if (recentWorkouts.length === 0) {
      return { message: 'No hay datos de entrenamiento recientes' };
    }
    
    // Calculate frequency
    const frequency = recentWorkouts.length;
    
    // Calculate average duration
    const totalDuration = recentWorkouts.reduce((sum, workout) => 
      sum + (workout.duration || 0), 0);
    const avgDuration = totalDuration / recentWorkouts.length;
    
    // Identify most common exercises
    const exerciseCount: Record<string, number> = {};
    recentWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });
    
    const favoriteExercises = Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([exercise]) => exercise);
    
    return {
      frequency,
      avgDuration: Math.round(avgDuration),
      favoriteExercises,
      consistency: Math.min(100, (frequency / 7) * 100) // Assuming 7-day period
    };
  }
  
  /**
   * Analyze recovery trends
   */
  private analyzeRecoveryTrends(context: ChatContext): any {
    const recoveryAnalyses = recoveryService.getRecentRecoveryAnalyses(7);
    
    if (!recoveryAnalyses || recoveryAnalyses.length === 0) {
      return { message: 'No hay datos de recuperación recientes' };
    }
    
    // Calculate average recovery score
    const totalScore = recoveryAnalyses.reduce((sum, analysis) => 
      sum + analysis.recoveryScore, 0);
    const avgRecoveryScore = totalScore / recoveryAnalyses.length;
    
    // Identify most common fatigue levels
    const fatigueLevelCount: Record<string, number> = {};
    recoveryAnalyses.forEach(analysis => {
      fatigueLevelCount[analysis.fatigueLevel] = 
        (fatigueLevelCount[analysis.fatigueLevel] || 0) + 1;
    });
    
    const mostCommonFatigueLevel = Object.entries(fatigueLevelCount)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      avgRecoveryScore: Math.round(avgRecoveryScore),
      mostCommonFatigueLevel,
      trend: this.calculateRecoveryTrend(recoveryAnalyses)
    };
  }
  
  /**
   * Calculate recovery trend
   */
  private calculateRecoveryTrend(analyses: RecoveryAnalysis[]): 'improving' | 'declining' | 'stable' {
    if (analyses.length < 2) return 'stable';
    
    const recent = analyses[0].recoveryScore;
    const previous = analyses[analyses.length - 1].recoveryScore;
    
    const difference = recent - previous;
    
    if (difference > 10) return 'improving';
    if (difference < -10) return 'declining';
    return 'stable';
  }
  
  /**
   * Analyze progression trends
   */
  private analyzeProgressionTrends(context: ChatContext): any {
    const progressionPlans = context.progressionPlans;
    
    if (progressionPlans.length === 0) {
      return { message: 'No hay datos de progresión recientes' };
    }
    
    // Calculate average recommended adjustments
    const totalAdjustments = progressionPlans.reduce((sum, plan) => 
      sum + plan.adjustments.length, 0);
    const avgAdjustments = totalAdjustments / progressionPlans.length;
    
    // Identify most common adjustment types
    const adjustmentTypeCount: Record<string, number> = {};
    progressionPlans.forEach(plan => {
      plan.adjustments.forEach(adjustment => {
        adjustmentTypeCount[adjustment.adjustmentType] = 
          (adjustmentTypeCount[adjustment.adjustmentType] || 0) + 1;
      });
    });
    
    const mostCommonAdjustment = Object.entries(adjustmentTypeCount)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      avgAdjustments: Math.round(avgAdjustments * 10) / 10,
      mostCommonAdjustment,
      totalPlans: progressionPlans.length
    };
  }
  
  /**
   * Analyze nutrition adherence
   */
  private analyzeNutritionAdherence(context: ChatContext): any {
    // This would integrate with nutrition service in a real implementation
    return {
      adherenceRate: 75, // Placeholder value
      message: 'Análisis de adherencia nutricional disponible en la sección de nutrición'
    };
  }
  
  /**
   * Generate predictive insights using the predictive analytics engine
   */
  private async generatePredictiveInsights(context: ChatContext): Promise<any> {
    try {
      // This would integrate with the predictive analytics engine
      // For now, we'll return placeholder data
      return {
        projections: [
          {
            timeframe: '3_months',
            strength: {
              projectedIncrease: 15
            },
            muscleMass: {
              projectedIncrease: 8
            },
            bodyComposition: {
              projectedDecrease: 3
            },
            confidence: 85
          }
        ],
        riskFactors: ['Calidad de sueño deficiente', 'Alta intensidad de entrenamiento'],
        optimizationOpportunities: ['Mejorar calidad del sueño', 'Optimizar nutrición post-entreno'],
        personalizedRecommendations: ['Aumentar adherencia al 85% para maximizar ganancias']
      };
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return {
        message: 'No se pudieron generar insights predictivos en este momento'
      };
    }
  }
  
  /**
   * Generate personalized recommendations based on all data
   */
  generatePersonalizedRecommendations(context: ChatContext): any[] {
    const recommendations: any[] = [];
    
    // Get insights from all modules
    const trainingPatterns = this.analyzeTrainingPatterns(context);
    const recoveryTrends = this.analyzeRecoveryTrends(context);
    const progressionTrends = this.analyzeProgressionTrends(context);
    
    // Training recommendations
    if (trainingPatterns.consistency && trainingPatterns.consistency < 80) {
      recommendations.push({
        category: 'training',
        priority: 'high',
        title: 'Mejora tu consistencia de entrenamiento',
        description: `Tu consistencia actual es del ${trainingPatterns.consistency}%. Te recomiendo establecer un horario fijo para entrenar.`,
        actionItems: [
          'Planifica tus entrenamientos a la semana',
          'Usa recordatorios para no saltarte sesiones'
        ]
      });
    }
    
    // Recovery recommendations
    if (recoveryTrends.avgRecoveryScore && recoveryTrends.avgRecoveryScore < 60) {
      recommendations.push({
        category: 'recovery',
        priority: 'high',
        title: 'Prioriza tu recuperación',
        description: `Tu puntaje promedio de recuperación es de ${recoveryTrends.avgRecoveryScore}/100. Considera incluir días de recuperación activa.`,
        actionItems: [
          'Incluye sesiones de estiramiento',
          'Asegura 7-9 horas de sueño'
        ]
      });
    }
    
    // Progression recommendations
    if (progressionTrends.avgAdjustments && progressionTrends.avgAdjustments > 2) {
      recommendations.push({
        category: 'progression',
        priority: 'medium',
        title: 'Evalúa tu progresión',
        description: `Estás haciendo muchos ajustes (${progressionTrends.avgAdjustments} por plan). Considera periodos de estabilización.`,
        actionItems: [
          'Mantén cargas constantes por 2-3 semanas',
          'Enfócate en la técnica'
        ]
      });
    }
    
    return recommendations;
  }
  
  /**
   * Determine user intent from input and context
   */
  private determineIntent(input: string, context: ChatContext): ChatIntent {
    const lowerInput = input.toLowerCase();
    
    // Context-aware routing based on current screen
    if (context.currentScreen === 'workoutDetail' && context.activeWorkout) {
      if (lowerInput.includes('siguiente') || 
          lowerInput.includes('próximo') || 
          lowerInput.includes('ejercicio')) {
        return 'workout_inquiry';
      }
    }
    
    if (context.currentScreen === 'recovery' || context.currentScreen === 'recoveryDashboard') {
      if (lowerInput.includes('descanso') || 
          lowerInput.includes('recuperación') || 
          lowerInput.includes('cansado')) {
        return 'recovery_advice';
      }
    }
    
    if (context.currentScreen === 'progression' || context.currentScreen === 'loadProgression') {
      if (lowerInput.includes('progreso') || 
          lowerInput.includes('carga') || 
          lowerInput.includes('peso')) {
        return 'progression_guidance';
      }
    }
    
    if (context.currentScreen === 'nutrition' || context.currentScreen === 'nutritionDashboard') {
      if (lowerInput.includes('comida') || 
          lowerInput.includes('nutrición') || 
          lowerInput.includes('calorías') ||
          lowerInput.includes('proteína') ||
          lowerInput.includes('comer')) {
        return 'nutrition_guidance';
      }
    }
    
    // More specific intent detection to avoid conflicts
    // Nutrition-related inquiries (check first to avoid conflicts)
    if (lowerInput.includes('comida') || 
        lowerInput.includes('nutrición') || 
        lowerInput.includes('calorías') ||
        lowerInput.includes('proteína') ||
        lowerInput.includes('dieta') ||
        lowerInput.includes('comer')) {
      return 'nutrition_guidance';
    }
    
    // Routine modification requests
    if (lowerInput.includes('cambiar') || 
        lowerInput.includes('modificar') || 
        lowerInput.includes('ajustar') ||
        lowerInput.includes('adaptar') ||
        lowerInput.includes('rutina semanal')) {
      return 'routine_modification';
    }
    
    // Performance analysis requests
    if (lowerInput.includes('rendimiento') || 
        lowerInput.includes('análisis') || 
        lowerInput.includes('mejorar') ||
        lowerInput.includes('evaluación') ||
        lowerInput.includes('progreso últimamente')) {
      return 'performance_analysis';
    }
    
    // Workout-related inquiries
    if (lowerInput.includes('entrenamiento') || 
        lowerInput.includes('ejercicio') || 
        lowerInput.includes('rutina') ||
        lowerInput.includes('workout')) {
      return 'workout_inquiry';
    }
    
    // Recovery-related inquiries
    if (lowerInput.includes('descanso') || 
        lowerInput.includes('recuperación') || 
        lowerInput.includes('cansado') ||
        lowerInput.includes('fatiga') ||
        lowerInput.includes('dolor')) {
      return 'recovery_advice';
    }
    
    // Progression-related inquiries
    if (lowerInput.includes('progreso') || 
        lowerInput.includes('carga') || 
        lowerInput.includes('peso') ||
        lowerInput.includes('intensidad') ||
        lowerInput.includes('volumen')) {
      return 'progression_guidance';
    }
    
    // Goal setting discussions
    if (lowerInput.includes('meta') || 
        lowerInput.includes('objetivo') || 
        lowerInput.includes('plan') ||
        lowerInput.includes('estrategia')) {
      return 'goal_setting';
    }
    
    // Motivation requests
    if (lowerInput.includes('ánimo') || 
        lowerInput.includes('motivación') || 
        lowerInput.includes('ánimo') ||
        lowerInput.includes('fuerza')) {
      return 'motivation';
    }
    
    // Technical support requests
    if (lowerInput.includes('problema') || 
        lowerInput.includes('error') || 
        lowerInput.includes('ayuda') ||
        lowerInput.includes('funciona')) {
      return 'technical_support';
    }
    
    return 'general';
  }
  
  /**
   * Generate response based on intent and context
   */
  private async generateResponse(
    input: string, 
    intent: ChatIntent, 
    context: ChatContext
  ): Promise<ChatResponse> {
    switch (intent) {
      case 'workout_inquiry':
        return this.handleWorkoutInquiry(input, context);
      case 'recovery_advice':
        return this.handleRecoveryAdvice(input, context);
      case 'progression_guidance':
        return this.handleProgressionGuidance(input, context);
      case 'nutrition_guidance':
        return this.handleNutritionGuidance(input, context);
      case 'routine_modification':
        return this.handleRoutineModification(input, context);
      case 'performance_analysis':
        return this.handlePerformanceAnalysis(input, context);
      case 'goal_setting':
        return this.handleGoalSetting(input, context);
      case 'motivation':
        return this.handleMotivation(input, context);
      case 'technical_support':
        return this.handleTechnicalSupport(input, context);
      default:
        return this.handleGeneralInquiry(input, context);
    }
  }
  
  /**
   * Handle workout-related inquiries with context awareness
   */
  private async handleWorkoutInquiry(input: string, context: ChatContext): Promise<ChatResponse> {
    const lowerInput = input.toLowerCase();
    let response = '';
    const actionItems: string[] = [];
    
    // Context-aware responses based on current screen
    if (context.currentScreen === 'workoutDetail' && context.activeWorkout) {
      if (lowerInput.includes('siguiente') || lowerInput.includes('próximo')) {
        response = `Tu próximo ejercicio en la rutina "${context.activeWorkout.name}" es: `;
        // Add details about the next exercise
        if (context.activeWorkout.days.length > 0) {
          const firstDay = context.activeWorkout.days[0];
          if (firstDay.exercises.length > 0) {
            const nextExercise = firstDay.exercises[0];
            response += `${nextExercise.name} - ${nextExercise.sets} series de ${nextExercise.reps} repeticiones`;
          }
        }
      } else if (lowerInput.includes('duración') || lowerInput.includes('tiempo')) {
        response = `La duración estimada de tu rutina "${context.activeWorkout.name}" es de ${context.activeWorkout.duration} minutos.`;
      } else {
        response = `Estás trabajando en la rutina "${context.activeWorkout.name}". ¿Te gustaría que te explique algún ejercicio en particular o necesitas ayuda con algo específico de esta rutina?`;
      }
    } else if (context.currentScreen === 'dashboard') {
      // On dashboard, suggest based on habits
      const habits = habitTrackingService.getUserHabits(context.userId);
      if (habits) {
        const recommendedDays = habitTrackingService.getRecommendedTrainingDays(context.userId);
        response = `Basado en tu historial, te recomiendo entrenar los días: ${recommendedDays.join(', ')}. `;
        response += '¿Te gustaría generar una nueva rutina o revisar tus rutinas existentes?';
        actionItems.push('Generar nueva rutina', 'Ver rutinas existentes');
      } else {
        response = 'No he encontrado un entrenamiento activo. ¿Te gustaría que te ayude a crear una rutina personalizada?';
        actionItems.push('Crear nueva rutina');
      }
    } else {
      // General workout inquiry
      if (context.activeWorkout) {
        response = `Actualmente estás trabajando en la rutina "${context.activeWorkout.name}". `;
        response += '¿Necesitas ayuda con algo específico de esta rutina?';
      } else {
        response = 'No tienes una rutina activa en este momento. ';
        response += '¿Te gustaría que te ayude a crear una rutina personalizada?';
        actionItems.push('Crear nueva rutina');
      }
    }
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Handle recovery advice requests with context awareness
   */
  private async handleRecoveryAdvice(input: string, context: ChatContext): Promise<ChatResponse> {
    // Get current recovery status
    const today = new Date();
    const recoveryAnalysis = recoveryService.getRecoveryAnalysis(context.userId, today);
    
    let response = '';
    const recommendations: any[] = [];
    const actionItems: string[] = [];
    
    // Context-aware responses
    if (context.currentScreen === 'recovery' || context.currentScreen === 'recoveryDashboard') {
      response = 'Estás en la sección de recuperación. ';
    }
    
    if (recoveryAnalysis) {
      response += `Tu nivel de fatiga actual es ${recoveryAnalysis.fatigueLevel} con un puntaje de recuperación de ${recoveryAnalysis.recoveryScore}/100. `;
      
      if (recoveryAnalysis.fatigueLevel === 'extreme' || recoveryAnalysis.fatigueLevel === 'high') {
        response += 'Te recomiendo priorizar la recuperación hoy. ';
      } else if (recoveryAnalysis.fatigueLevel === 'moderate') {
        response += 'Tienes un nivel de fatiga moderado. ';
      } else {
        response += 'Te encuentras en buen estado de recuperación. ';
      }
      
      // Add specific recommendations
      if (recoveryAnalysis.recommendations.length > 0) {
        response += 'Recomendaciones específicas: ';
        recoveryAnalysis.recommendations.forEach((rec, index) => {
          response += `${index + 1}. ${rec.title}: ${rec.description}. `;
          recommendations.push(rec);
        });
      }
    } else {
      response += 'No tengo datos recientes sobre tu estado de recuperación. ';
      response += '¿Te gustaría registrar cómo te sientes hoy para que pueda darte recomendaciones personalizadas?';
      actionItems.push('Registrar métricas de recuperación');
    }
    
    return {
      response,
      recommendations,
      actionItems
    };
  }
  
  /**
   * Handle progression guidance requests with context awareness
   */
  private async handleProgressionGuidance(input: string, context: ChatContext): Promise<ChatResponse> {
    let response = '';
    const recommendations: any[] = [];
    const actionItems: string[] = [];
    
    // Context-aware responses
    if (context.currentScreen === 'progression' || context.currentScreen === 'loadProgression') {
      response = 'Estás en la sección de progresión de cargas. ';
    }
    
    // Get progression plans
    const progressionPlans = context.progressionPlans;
    
    if (progressionPlans.length > 0) {
      response += 'Basado en tu historial de entrenamiento, aquí tienes tus recomendaciones de progresión: ';
      
      progressionPlans.forEach((plan, index) => {
        response += `${index + 1}. ${plan.exerciseName}: `;
        if (plan.adjustments.length > 0) {
          const adjustment = plan.adjustments[0];
          response += `Recomiendo ${adjustment.adjustmentType === 'weight' ? 'ajustar el peso' : adjustment.adjustmentType} en ${Math.abs(adjustment.value)}%. `;
          response += `Razón: ${adjustment.reason}. `;
        } else {
          response += 'Tu progresión está en buen camino. ';
        }
        recommendations.push(plan);
      });
    } else {
      response += 'Aún no tengo suficientes datos para generar recomendaciones de progresión. ';
      response += 'Completa algunas sesiones de entrenamiento y registrar tus repeticiones y RPE para que pueda ayudarte mejor.';
      actionItems.push('Registrar sesión de entrenamiento');
    }
    
    return {
      response,
      recommendations,
      actionItems
    };
  }
  
  /**
   * Handle nutrition guidance requests
   */
  private async handleNutritionGuidance(input: string, context: ChatContext): Promise<ChatResponse> {
    const lowerInput = input.toLowerCase();
    let response = '';
    const actionItems: string[] = [];
    
    // Get nutrition data for today
    const today = new Date();
    const nutritionData = nutritionService.getNutritionRecommendations(context.userId, today);
    
    if (lowerInput.includes('calorías') || lowerInput.includes('caloría')) {
      response = `Tu objetivo calórico diario es de ${nutritionData.totalNutrients.calories} calorías. `;
      if (nutritionData.calorieExpenditure) {
        response += `Basado en tu entrenamiento, has quemado aproximadamente ${nutritionData.calorieExpenditure} calorías hoy. `;
      }
    } else if (lowerInput.includes('proteína')) {
      response = `Tu objetivo de proteína diaria es de ${nutritionData.totalNutrients.protein} gramos. `;
      response += 'Es importante distribuir esta cantidad a lo largo del día en tus comidas principales.';
    } else {
      response = `Hoy te recomiendo seguir esta distribución nutricional: `;
      response += `${nutritionData.totalNutrients.calories} calorías, `;
      response += `${nutritionData.totalNutrients.protein}g de proteína, `;
      response += `${nutritionData.totalNutrients.carbs}g de carbohidratos, `;
      response += `${nutritionData.totalNutrients.fats}g de grasas. `;
      
      if (nutritionData.meals.length > 0) {
        response += 'Tus comidas recomendadas incluyen: ';
        nutritionData.meals.slice(0, 3).forEach((meal, index) => {
          response += `${index + 1}. ${meal.name} (${meal.time}): ${meal.ingredients.join(', ')}. `;
        });
      }
    }
    
    actionItems.push('Ver plan nutricional completo', 'Registrar comida');
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Handle routine modification requests
   */
  private async handleRoutineModification(input: string, context: ChatContext): Promise<ChatResponse> {
    let response = '';
    const actionItems: string[] = [];
    const contextUpdates: Partial<ChatContext> = {};
    
    // Check recovery status first
    const today = new Date();
    const recoveryAnalysis = recoveryService.getRecoveryAnalysis(context.userId, today);
    
    if (recoveryAnalysis && (recoveryAnalysis.fatigueLevel === 'extreme' || recoveryAnalysis.fatigueLevel === 'high')) {
      response = 'Detecto que tu nivel de fatiga es alto. ';
      response += 'En lugar de aumentar la intensidad, te recomiendo modificar tu rutina hacia una sesión de recuperación activa. ';
      response += '¿Te gustaría que genere una rutina de recuperación en su lugar?';
      actionItems.push('Generar rutina de recuperación');
      contextUpdates.activeWorkout = undefined; // Clear active workout to allow new generation
    } else if (context.activeWorkout) {
      // Modify current workout based on progression data
      const progressionPlans = context.progressionPlans;
      if (progressionPlans.length > 0) {
        response = 'Puedo ajustar tu rutina actual basado en tu progreso: ';
        const adjustments: any[] = [];
        
        progressionPlans.forEach(plan => {
          if (plan.adjustments.length > 0) {
            const adjustment = plan.adjustments[0];
            response += `Para ${plan.exerciseName}, recomiendo ${adjustment.adjustmentType} en ${Math.abs(adjustment.value)}% porque ${adjustment.reason}. `;
            adjustments.push(adjustment);
          }
        });
        
        // Apply adjustments to workout
        const adjustedWorkout = loadProgressionService.applyProgressionAdjustments(
          context.activeWorkout, 
          adjustments
        );
        
        response += 'He aplicado estos ajustes a tu rutina actual. ';
        contextUpdates.activeWorkout = adjustedWorkout;
      } else {
        response = 'Tu rutina actual parece apropiada. ';
        response += '¿Hay algún ejercicio específico que te gustaría modificar o algún objetivo particular que quieras alcanzar?';
      }
    } else {
      response = 'No tienes una rutina activa actualmente. ';
      response += '¿Te gustaría que cree una nueva rutina personalizada basada en tus objetivos y estado actual?';
      actionItems.push('Crear nueva rutina');
    }
    
    return {
      response,
      actionItems,
      contextUpdates
    };
  }
  
  /**
   * Handle performance analysis requests
   */
  private async handlePerformanceAnalysis(input: string, context: ChatContext): Promise<ChatResponse> {
    let response = '';
    const actionItems: string[] = [];
    
    // Get recent workout data
    const recentWorkouts = context.recentWorkouts.slice(0, 5);
    
    if (recentWorkouts.length > 0) {
      response = 'Basado en tus últimas sesiones de entrenamiento: ';
      
      // Calculate consistency
      const consistency = Math.round((recentWorkouts.length / 5) * 100);
      response += `Tu consistencia es del ${consistency}%. `;
      
      // Analyze progression
      const progressionPlans = context.progressionPlans;
      if (progressionPlans.length > 0) {
        const improvements = progressionPlans.filter(plan => 
          plan.adjustments.some(adj => adj.value > 0)
        ).length;
        
        if (improvements > 0) {
          response += `Detecto progreso positivo en ${improvements} ejercicios. `;
        }
      }
      
      // Check recovery patterns
      const recoveryAnalyses = recoveryService.getRecentRecoveryAnalyses(7);
      if (recoveryAnalyses.length > 0) {
        const avgRecoveryScore = recoveryAnalyses.reduce((sum, analysis) => 
          sum + analysis.recoveryScore, 0) / recoveryAnalyses.length;
        
        if (avgRecoveryScore < 50) {
          response += 'Tu recuperación promedio ha sido baja, lo que podría afectar tu rendimiento. ';
        } else if (avgRecoveryScore > 80) {
          response += 'Tu recuperación es excelente, lo que favorece un buen rendimiento. ';
        }
      }
    } else {
      response = 'Aún no tienes suficientes datos de entrenamiento para un análisis detallado. ';
      response += 'Completa algunas sesiones y vuelve a consultarme para un análisis más completo.';
      actionItems.push('Registrar sesión de entrenamiento');
    }
    
    actionItems.push('Ver informe de progreso completo');
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Handle goal setting discussions
   */
  private async handleGoalSetting(input: string, context: ChatContext): Promise<ChatResponse> {
    let response = '';
    const actionItems: string[] = [];
    
    // Get user habits and goals
    const habits = habitTrackingService.getUserHabits(context.userId);
    const userData = context.userData;
    
    response = 'Para ayudarte a establecer metas efectivas, consideremos: ';
    
    // Analyze current training frequency
    if (habits) {
      response += `Actualmente entrenas ${habits.trainingFrequency} veces por semana. `;
      
      if (habits.trainingFrequency < 3) {
        response += 'Para progresar, te recomendaría aumentar la frecuencia a 3-4 veces por semana. ';
      } else if (habits.trainingFrequency > 5) {
        response += 'Entrenas con buena frecuencia, asegúrate de incluir días de recuperación. ';
      }
    }
    
    // Analyze fitness level
    response += `Tu nivel actual es ${userData.fitnessLevel}. `;
    
    // Suggest SMART goals
    response += 'Te sugiero establecer metas específicas, medibles, alcanzables, relevantes y con tiempo definido. ';
    response += 'Por ejemplo: "Aumentar mi press de banca en 10kg en 8 semanas" o "Reducir mi porcentaje de grasa corporal al 12% en 12 semanas". ';
    
    actionItems.push('Definir nueva meta', 'Revisar metas existentes');
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Handle motivation requests
   */
  private async handleMotivation(input: string, context: ChatContext): Promise<ChatResponse> {
    // Get user psychology profile
    const behaviorData = context.recentWorkouts;
    const performanceMetrics = {}; // Would be populated with real data
    const userFeedback: any[] = []; // Would be populated with real data
    
    const psychologyProfile = this.conversationalCoach.analyzeUserPsychology(
      behaviorData,
      performanceMetrics,
      userFeedback
    );
    
    // Generate motivational message based on psychology profile
    const contextForCoach = {
      sessionType: 'goal-setting' as const,
      timeOfDay: this.getCurrentTimeOfDay(),
      recentBehavior: {
        consistency: psychologyProfile.personalityTraits.resilience,
        adherence: 7,
        effort: 7
      }
    };
    
    const coachingMessage = this.conversationalCoach.generateCoachingMessage(
      psychologyProfile,
      contextForCoach
    );
    
    return {
      response: coachingMessage.content,
      actionItems: coachingMessage.actionItems
    };
  }
  
  /**
   * Handle technical support requests
   */
  private async handleTechnicalSupport(input: string, context: ChatContext): Promise<ChatResponse> {
    let response = '';
    const actionItems: string[] = [];
    
    response = 'Estoy aquí para ayudarte con cualquier problema técnico. ';
    response += 'Para poder asistirte mejor, por favor proporciona más detalles sobre el problema que estás experimentando. ';
    response += '¿La dificultad está relacionada con el registro de entrenamientos, la nutrición, los informes o alguna otra función?';
    
    actionItems.push('Reportar problema técnico', 'Ver guía de solución de problemas');
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Handle general inquiries
   */
  private async handleGeneralInquiry(input: string, context: ChatContext): Promise<ChatResponse> {
    let response = '';
    const actionItems: string[] = [];
    
    // Get contextual recommendations
    const recommendations = habitTrackingService.generateRecommendations(context.userId);
    
    response = 'Hola, soy tu Chat Maestro de SPARTAN. ';
    response += 'Estoy aquí para ayudarte a optimizar tu entrenamiento, nutrición y recuperación. ';
    
    if (recommendations.workoutReminders.length > 0) {
      response += `Recuerdo que tienes programado un entrenamiento para hoy. `;
    }
    
    response += '¿En qué puedo ayudarte hoy? Puedo: ';
    response += 'explicarte tus rutinas, ayudarte con la recuperación, ajustar tu progresión, ';
    response += 'guiarte en nutrición, analizar tu rendimiento o simplemente motivarte.';
    
    actionItems.push(
      'Explicar mi rutina actual',
      'Recomendaciones de recuperación',
      'Ajustar mi progresión',
      'Consejos nutricionales',
      'Análisis de rendimiento'
    );
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Get current time of day for contextual messaging
   */
  private getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
  
  /**
   * Build comprehensive context for Chat Maestro
   */
  async buildContext(userId: string, currentScreen: string, activeWorkout?: WorkoutPlan): Promise<ChatContext> {
    // Get user data
    const userData = storageManager.getUserData() || {
      name: "Usuario SPARTAN",
      age: 30,
      weight: 75,
      height: 180,
      fitnessLevel: "intermediate",
      goals: ["Mejorar fuerza", "Aumentar masa muscular"]
    };
    
    // Get user habits
    const userHabits = storageManager.getUserHabits();
    
    // Get recent workout sessions
    const recentWorkouts = storageManager.getWorkoutSessions()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    // Get recovery status
    const today = new Date();
    const recoveryStatus = recoveryService.getRecoveryAnalysis(userId, today) || undefined;
    
    // Get progression plans
    const progressionPlans = storageManager.getProgressionPlans();
    
    // Get nutrition data
    const nutritionData = nutritionService.getNutritionRecommendations(userId, today);
    
    return {
      userId,
      currentScreen,
      activeWorkout,
      userData,
      userHabits,
      recentWorkouts,
      recoveryStatus,
      progressionPlans,
      nutritionData
    };
  }
}

// Export singleton instance
export const chatMaestroService = ChatMaestroService.getInstance();