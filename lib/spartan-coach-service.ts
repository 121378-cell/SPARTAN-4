  /**
 * Spartan Coach Service - The Disciplined yet Empathetic Mentor
 * 
 * This service defines the personality and functions of the Spartan Coach,
 * who is disciplined but empathetic, motivational but technical, capable of
 * adapting toughness based on the user's situation. Its role is to accompany,
 * teach, and correct.
 */

import { UserPsychologyProfile, CoachingContext, CoachingMessage } from './conversationalCoach';
import { ChatContext, ChatResponse } from './chat-maestro-service';
import { RecoveryAnalysis } from './types';

// Spartan Coach Personality Traits
export interface SpartanCoachPersonality {
  disciplineLevel: 'high' | 'moderate' | 'adaptive';
  empathyLevel: 'high' | 'moderate' | 'contextual';
  motivationStyle: 'intense' | 'balanced' | 'adaptive';
  technicalDepth: 'deep' | 'moderate' | 'accessible';
  adaptability: 'high' | 'moderate' | 'situation-based';
}

// Spartan Coach Communication Styles
export type SpartanCommunicationStyle = 
  | 'disciplinarian'     // Firm, direct, high expectations
  | 'mentor'             // Supportive, guiding, encouraging
  | 'scientist'          // Data-driven, analytical, evidence-based
  | 'warrior'            // Intense, challenging, performance-focused
  | 'philosopher'        // Reflective, wisdom-based, growth-oriented
  | 'adaptive';          // Context-aware, situation-dependent

// Spartan Coach Feedback Types
export type SpartanFeedbackType =
  | 'correction'         // Technical corrections
  | 'encouragement'      // Motivational support
  | 'challenge'          // Performance challenges
  | 'reflection'         // Self-awareness prompts
  | 'education'          // Scientific explanations
  | 'adaptation';        // Context-specific guidance

// Spartan Coach Tone Modifiers
export interface SpartanToneModifiers {
  intensity: 'low' | 'moderate' | 'high';
  firmness: 'gentle' | 'firm' | 'strict';
  enthusiasm: 'calm' | 'energetic' | 'intense';
  technicality: 'simple' | 'moderate' | 'complex';
}

export class SpartanCoachService {
  private personality: SpartanCoachPersonality;
  
  constructor() {
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
  public generateCoachingMessage(
    userContext: ChatContext,
    userInput?: string
  ): ChatResponse {
    // Determine the appropriate communication style based on context
    const communicationStyle = this.determineCommunicationStyle(userContext);
    
    // Generate tone modifiers based on user state
    const toneModifiers = this.generateToneModifiers(userContext);
    
    // Create the core message content
    const messageContent = this.createMessageContent(userContext, communicationStyle, toneModifiers);
    
    // Add action items and recommendations
    const actionItems = this.generateActionItems(userContext, communicationStyle);
    const recommendations = this.generateRecommendations(userContext);
    
    return {
      response: messageContent,
      actionItems,
      recommendations
    };
  }
  
  /**
   * Determine the appropriate communication style based on user context
   */
  private determineCommunicationStyle(context: ChatContext): SpartanCommunicationStyle {
    // Check user's current state and situation
    const recoveryStatus = context.recoveryStatus;
    const wearableInsights = context.wearableInsights;
    const recentWorkouts = context.recentWorkouts;
    
    // If user is fatigued or stressed, be more mentor-like
    if (recoveryStatus?.fatigueLevel === 'high' || recoveryStatus?.fatigueLevel === 'extreme' ||
        (wearableInsights?.recoveryStatus === 'poor' || wearableInsights?.recoveryStatus === 'critical')) {
      return 'mentor';
    }
    
    // If user is performing well and ready, be more warrior-like
    if ((recoveryStatus?.fatigueLevel === 'low' || wearableInsights?.trainingReadiness === 'ready') &&
        recentWorkouts.length > 0) {
      // Check if they've been consistent
      const consistency = this.calculateWorkoutConsistency(recentWorkouts);
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
  }
  
  /**
   * Generate tone modifiers based on user state
   */
  private generateToneModifiers(context: ChatContext): SpartanToneModifiers {
    const modifiers: SpartanToneModifiers = {
      intensity: 'moderate',
      firmness: 'firm',
      enthusiasm: 'energetic',
      technicality: 'moderate'
    };
    
    // Adjust based on recovery status
    const recoveryStatus = context.recoveryStatus;
    const wearableInsights = context.wearableInsights;
    
    if (recoveryStatus?.fatigueLevel === 'high' || recoveryStatus?.fatigueLevel === 'extreme' ||
        wearableInsights?.recoveryStatus === 'poor' || wearableInsights?.recoveryStatus === 'critical') {
      // Be less intense and firm when user is fatigued
      modifiers.intensity = 'low';
      modifiers.firmness = 'gentle';
      modifiers.enthusiasm = 'calm';
    } else if (recoveryStatus?.fatigueLevel === 'low' || wearableInsights?.trainingReadiness === 'ready') {
      // Be more intense when user is ready
      modifiers.intensity = 'high';
      modifiers.enthusiasm = 'intense';
    }
    
    // Adjust technicality based on screen context
    if (context.currentScreen === 'progression' || context.currentScreen === 'recovery' || 
        context.currentScreen === 'nutrition') {
      modifiers.technicality = 'complex';
    } else {
      modifiers.technicality = 'simple';
    }
    
    return modifiers;
  }
  
  /**
   * Create message content based on communication style and tone modifiers
   */
  private createMessageContent(
    context: ChatContext, 
    style: SpartanCommunicationStyle, 
    tone: SpartanToneModifiers
  ): string {
    let message = '';
    
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
  }
  
  /**
   * Create disciplinarian-style message
   */
  private createDisciplinarianMessage(context: ChatContext, tone: SpartanToneModifiers): string {
    const baseMessages = [
      "La disciplina es la diferencia entre los campeones y los soñadores. Hoy, elige ser campeón.",
      "No busques excusas, busca soluciones. La grandeza se forja en los momentos difíciles.",
      "Cada repetición es una inversión en tu futuro. Hazlas contar."
    ];
    
    let message = this.selectRandomMessage(baseMessages);
    
    // Add recovery context if needed
    if (context.recoveryStatus?.fatigueLevel === 'high' || context.recoveryStatus?.fatigueLevel === 'extreme') {
      message += " Pero incluso los guerreros necesitan recuperarse. Hoy, prioriza la recuperación.";
    }
    
    return message;
  }
  
  /**
   * Create mentor-style message
   */
  private createMentorMessage(context: ChatContext, tone: SpartanToneModifiers): string {
    const baseMessages = [
      "Entiendo que hoy no es un día fácil. Pero cada pequeño paso cuenta en tu journey.",
      "Tu cuerpo te está pidiendo descanso. Escúchalo, es tu mayor aliado.",
      "La verdadera fuerza también es saber cuándo recuperarse. Hoy, cuida de ti."
    ];
    
    let message = this.selectRandomMessage(baseMessages);
    
    // Add encouragement based on recent progress
    const recentWorkouts = context.recentWorkouts;
    if (recentWorkouts.length > 0) {
      const consistency = this.calculateWorkoutConsistency(recentWorkouts);
      if (consistency > 0.7) {
        message += " Has demostrado consistencia, eso ya es una victoria.";
      }
    }
    
    return message;
  }
  
  /**
   * Create scientist-style message
   */
  private createScientistMessage(context: ChatContext, tone: SpartanToneModifiers): string {
    const recoveryStatus = context.recoveryStatus;
    const wearableInsights = context.wearableInsights;
    
    if (context.currentScreen === 'recovery' && recoveryStatus) {
      return `Tus métricas de recuperación muestran un puntaje de ${recoveryStatus.recoveryScore}/100. ` +
             `Basado en la fisiología del entrenamiento, esto indica que tu capacidad de adaptación es ${this.interpretRecoveryScore(recoveryStatus.recoveryScore)}. ` +
             `Te recomiendo ajustar la intensidad en consecuencia para optimizar tus adaptaciones.`;
    }
    
    if (context.currentScreen === 'progression' && context.progressionPlans.length > 0) {
      const plan = context.progressionPlans[0];
      return `Basado en tus datos de progresión, el ejercicio ${plan.exerciseName} muestra ` +
             `una tendencia ${plan.adjustments.length > 0 ? 'positiva' : 'estable'}. ` +
             `La ciencia del entrenamiento sugiere ${plan.adjustments.length > 0 ? 
               `un ajuste de ${Math.abs(plan.adjustments[0].value)}% en ${plan.adjustments[0].adjustmentType}` : 
               'mantener la carga actual'} para optimizar las adaptaciones.`;
    }
    
    if (context.currentScreen === 'nutrition' && context.nutritionData) {
      const nutrition = context.nutritionData;
      return `Tu ingesta nutricional actual muestra ${nutrition.totalNutrients.calories} calorías. ` +
             `Basado en tus objetivos y actividad, esto representa ${this.evaluateNutritionalAdequacy(nutrition)} ` +
             `en relación con tus necesidades.`;
    }
    
    // Default scientific message
    return "La ciencia del entrenamiento es clara: la consistencia y la recuperación adecuada " +
           "son los pilares del progreso. Tus datos actuales indican que estás en el camino correcto.";
  }
  
  /**
   * Create warrior-style message
   */
  private createWarriorMessage(context: ChatContext, tone: SpartanToneModifiers): string {
    const baseMessages = [
      "¡Hoy es el día para demostrar de qué estás hecho! La grandeza espera.",
      "Tu cuerpo está listo y tu mente está enfocada. ¡A conquistar nuevos límites!",
      "Cada entrenamiento es una batalla contra tu versión anterior. Hoy, ganas."
    ];
    
    let message = this.selectRandomMessage(baseMessages);
    
    // Add specific challenge based on recent performance
    const recentWorkouts = context.recentWorkouts;
    if (recentWorkouts.length > 0) {
      const lastWorkout = recentWorkouts[0];
      if (lastWorkout.exercises.length > 0) {
        const lastExercise = lastWorkout.exercises[0];
        if (lastExercise.sets.length > 0) {
          const lastSet = lastExercise.sets[lastExercise.sets.length - 1];
          if (lastSet.reps && lastSet.rpe) {
            message += ` Superando los ${lastSet.reps} reps al ${lastSet.rpe} RPE, ` +
                      `hoy puedes ir un paso más allá.`;
          }
        }
      }
    }
    
    return message;
  }
  
  /**
   * Create philosopher-style message
   */
  private createPhilosopherMessage(context: ChatContext, tone: SpartanToneModifiers): string {
    const baseMessages = [
      "El verdadero guerrero no se define por sus victorias, sino por cómo se levanta después de cada caída.",
      "La disciplina no es una restricción, es la libertad de convertirte en quien estás destinado a ser.",
      "Cada desafío es una oportunidad para descubrir una fuerza que no sabías que poseías."
    ];
    
    return this.selectRandomMessage(baseMessages);
  }
  
  /**
   * Create adaptive message that combines different elements
   */
  private createAdaptiveMessage(context: ChatContext, tone: SpartanToneModifiers): string {
    // Start with a balanced message
    let message = "Estoy aquí para guiarte en cada paso de tu journey. ";
    
    // Add context-specific elements
    const recoveryStatus = context.recoveryStatus;
    const wearableInsights = context.wearableInsights;
    const recentWorkouts = context.recentWorkouts;
    
    // Recovery context
    if (recoveryStatus) {
      if (recoveryStatus.fatigueLevel === 'low') {
        message += "Veo que estás bien recuperado. ";
      } else if (recoveryStatus.fatigueLevel === 'high' || recoveryStatus.fatigueLevel === 'extreme') {
        message += "Detecto que necesitas priorizar la recuperación. ";
      }
    } else if (wearableInsights) {
      if (wearableInsights.trainingReadiness === 'ready') {
        message += "Tus métricas indican que estás listo para entrenar. ";
      } else if (wearableInsights.trainingReadiness === 'rest') {
        message += "Tus datos biométricos sugieren un día de recuperación. ";
      }
    }
    
    // Performance context
    if (recentWorkouts.length > 0) {
      const consistency = this.calculateWorkoutConsistency(recentWorkouts);
      if (consistency > 0.8) {
        message += "Tu consistencia es admirable. ";
      } else if (consistency < 0.5) {
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
  }
  
  /**
   * Generate action items based on context and communication style
   */
  private generateActionItems(context: ChatContext, style: SpartanCommunicationStyle): string[] {
    const actions: string[] = [];
    
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
        } else if (context.currentScreen === 'recovery') {
          actions.push("Registra tus métricas de recuperación");
          actions.push("Planifica tu descanso activo");
        } else if (context.currentScreen === 'progression') {
          actions.push("Evalúa tus ajustes de progresión");
          actions.push("Planifica tu próxima fase");
        } else {
          actions.push("Define tu objetivo para hoy");
          actions.push("Comprométete con una acción");
        }
    }
    
    return actions;
  }
  
  /**
   * Generate recommendations based on user context
   */
  private generateRecommendations(context: ChatContext): any[] {
    const recommendations: any[] = [];
    
    // Recovery-based recommendations
    if (context.recoveryStatus) {
      const recovery = context.recoveryStatus;
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
      const wearable = context.wearableInsights;
      if (wearable.trainingReadiness === 'rest') {
        recommendations.push({
          type: 'recovery',
          title: 'Día de descanso recomendado',
          description: 'Tus datos biométricos sugieren un día de recuperación completa',
          priority: 'high'
        });
      } else if (wearable.adjustments.length > 0) {
        recommendations.push({
          type: 'adjustment',
          title: 'Ajustes recomendados',
          description: `Basado en tus métricas: ${wearable.adjustments[0].reason}`,
          priority: 'medium'
        });
      }
    }
    
    // Progression-based recommendations
    if (context.progressionPlans.length > 0) {
      const plan = context.progressionPlans[0];
      if (plan.adjustments.length > 0) {
        recommendations.push({
          type: 'progression',
          title: 'Ajuste de progresión',
          description: `Recomendado para ${plan.exerciseName}: ${plan.adjustments[0].reason}`,
          priority: 'medium'
        });
      }
    }
    
    return recommendations;
  }
  
  /**
   * Calculate workout consistency from recent sessions
   */
  private calculateWorkoutConsistency(workouts: any[]): number {
    if (workouts.length === 0) return 0;
    
    // For simplicity, we'll assume consistency based on workout frequency
    // In a real implementation, this would be more sophisticated
    return Math.min(1, workouts.length / 7); // Assuming 7-day period
  }
  
  /**
   * Detect if user is struggling with motivation
   */
  private detectMotivationalStruggle(context: ChatContext): boolean {
    // Check for signs of motivational struggle
    const recentWorkouts = context.recentWorkouts;
    if (recentWorkouts.length < 3) return false; // Not enough data
    
    // Check consistency - if low, might indicate motivational struggle
    const consistency = this.calculateWorkoutConsistency(recentWorkouts);
    if (consistency < 0.5) return true;
    
    // Check recovery status - if consistently poor, might indicate struggle
    const recoveryAnalyses = this.getRecentRecoveryAnalyses(7);
    if (recoveryAnalyses.length > 0) {
      const avgRecoveryScore = recoveryAnalyses.reduce((sum, analysis) => 
        sum + analysis.recoveryScore, 0) / recoveryAnalyses.length;
      if (avgRecoveryScore < 50) return true;
    }
    
    return false;
  }
  
  /**
   * Get recent recovery analyses
   */
  private getRecentRecoveryAnalyses(days: number): RecoveryAnalysis[] {
    // This would integrate with the recovery service in a real implementation
    // For now, we'll return an empty array
    return [];
  }
  
  /**
   * Interpret recovery score in human-readable terms
   */
  private interpretRecoveryScore(score: number): string {
    if (score >= 80) return "óptima";
    if (score >= 60) return "buena";
    if (score >= 40) return "moderada";
    return "baja";
  }
  
  /**
   * Evaluate nutritional adequacy
   */
  private evaluateNutritionalAdequacy(nutritionData: any): string {
    // This would be more sophisticated in a real implementation
    return "adecuada";
  }
  
  /**
   * Select a random message from an array
   */
  private selectRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  /**
   * Provide technical feedback with motivational elements
   */
  public provideTechnicalFeedback(
    exercise: string,
    performanceData: any,
    context: ChatContext
  ): ChatResponse {
    const communicationStyle = this.determineCommunicationStyle(context);
    const toneModifiers = this.generateToneModifiers(context);
    
    let feedback = '';
    let actionItems: string[] = [];
    
    // Technical correction with motivational framing
    if (performanceData.formIssues && performanceData.formIssues.length > 0) {
      feedback = `Observo mejoras oportunas en tu técnica de ${exercise}. `;
      
      switch (communicationStyle) {
        case 'scientist':
          feedback += `Desde una perspectiva biomecánica, ajustar ${performanceData.formIssues[0]} ` +
                     `optimizará la activación muscular y reducirá el riesgo de lesión.`;
          break;
        case 'disciplinarian':
          feedback += `La excelencia técnica no es opcional. Corregir ${performanceData.formIssues[0]} ` +
                     `es fundamental para tu progreso.`;
          break;
        case 'mentor':
          feedback += `Pequeños ajustes en ${performanceData.formIssues[0]} ` +
                     `harán una gran diferencia. Lo estás haciendo bien, solo refina tu técnica.`;
          break;
        default:
          feedback += `Para mejorar tu técnica en ${exercise}, te sugiero enfocarte en ${performanceData.formIssues[0]}. ` +
                     `Con práctica y atención a la forma, verás mejoras rápidamente.`;
      }
      
      actionItems = [
        "Practicar la técnica lentamente",
        "Grabar tu forma para auto-corrección",
        "Solicitar feedback adicional si es necesario"
      ];
    } else {
      // Positive feedback
      feedback = `Excelente técnica en ${exercise}! `;
      
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
      actionItems
    };
  }
  
  /**
   * Generate wearable data interpretation and practical adjustments
   */
  public interpretWearableData(
    wearableData: any,
    context: ChatContext
  ): ChatResponse {
    const communicationStyle = this.determineCommunicationStyle(context);
    const toneModifiers = this.generateToneModifiers(context);
    
    let interpretation = '';
    let recommendations: any[] = [];
    let actionItems: string[] = [];
    
    // Interpret HRV data
    if (wearableData.hrv) {
      interpretation += `Tu HRV actual es ${wearableData.hrv} ms, lo que indica `;
      
      if (wearableData.hrv > 80) {
        interpretation += "un excelente estado de recuperación. ";
      } else if (wearableData.hrv > 50) {
        interpretation += "un buen estado de recuperación. ";
      } else if (wearableData.hrv > 30) {
        interpretation += "una recuperación moderada. ";
      } else {
        interpretation += "una recuperación comprometida. ";
      }
    }
    
    // Interpret sleep data
    if (wearableData.sleep) {
      interpretation += `Dormiste ${wearableData.sleep.duration} horas con una eficiencia del ${wearableData.sleep.efficiency}%. `;
      
      if (wearableData.sleep.efficiency > 85) {
        interpretation += "Excelente calidad de sueño. ";
      } else if (wearableData.sleep.efficiency > 70) {
        interpretation += "Buena calidad de sueño. ";
      } else {
        interpretation += "Calidad de sueño subóptima. ";
      }
    }
    
    // Interpret activity data
    if (wearableData.steps && wearableData.calories) {
      interpretation += `Hoy has caminado ${wearableData.steps} pasos y quemado ${wearableData.calories} calorías. `;
      
      if (wearableData.steps > 10000) {
        interpretation += "Muy buen nivel de actividad. ";
      } else if (wearableData.steps > 7000) {
        interpretation += "Buen nivel de actividad. ";
      } else {
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
            description: `Tu HRV de ${wearableData.hrv} ms sugiere ${this.getHrvRecommendation(wearableData.hrv)}`,
            priority: 'high'
          },
          {
            type: 'sleep',
            title: 'Optimización del sueño',
            description: `Tu eficiencia de sueño del ${wearableData.sleep.efficiency}% puede mejorarse con ${this.getSleepRecommendation(wearableData.sleep.efficiency)}`,
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
      actionItems,
      recommendations
    };
  }
  
  /**
   * Get HRV-based recommendation
   */
  private getHrvRecommendation(hrv: number): string {
    if (hrv > 80) return "mantener la intensidad actual";
    if (hrv > 50) return "mantener carga moderada";
    if (hrv > 30) return "reducir intensidad en 10-15%";
    return "priorizar recuperación activa";
  }
  
  /**
   * Get sleep-based recommendation
   */
  private getSleepRecommendation(efficiency: number): string {
    if (efficiency > 85) return "mantener rutinas actuales";
    if (efficiency > 70) return "optimizar horario de sueño";
    return "evaluar factores de interrupción";
  }
  
  /**
   * Balance science, motivation, and clarity in each interaction
   */
  public balanceCommunicationElements(context: ChatContext): {
    scientificContent: string;
    motivationalContent: string;
    clarityContent: string;
  } {
    const scientificContent = this.generateScientificContent(context);
    const motivationalContent = this.generateMotivationalContent(context);
    const clarityContent = this.generateClarityContent(context);
    
    return {
      scientificContent,
      motivationalContent,
      clarityContent
    };
  }
  
  /**
   * Generate scientific content based on available data
   */
  private generateScientificContent(context: ChatContext): string {
    let content = '';
    
    // Add recovery science
    if (context.recoveryStatus) {
      content += `Fisiológicamente, tu cuerpo necesita ${this.calculateRecoveryTime(context.recoveryStatus)} horas para recuperarse completamente. `;
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
  }
  
  /**
   * Generate motivational content based on user progress
   */
  private generateMotivationalContent(context: ChatContext): string {
    let content = '';
    
    // Add progress-based motivation
    if (context.recentWorkouts.length > 0) {
      const consistency = this.calculateWorkoutConsistency(context.recentWorkouts);
      if (consistency > 0.8) {
        content += "Tu consistencia es admirable. Cada día que te mantienes fiel a tu compromiso te acerca más a la grandeza. ";
      } else if (consistency > 0.5) {
        content += "Cada nuevo día es una oportunidad para reconstruir el hábito. La grandeza no se logra de un día para otro. ";
      } else {
        content += "El verdadero guerrero no se define por sus victorias, sino por cómo se levanta después de cada caída. ";
      }
    }
    
    // Add achievement-based motivation
    if (context.recentWorkouts.length > 0) {
      content += "Has demostrado fuerza de voluntad al llegar hasta aquí. Eso ya es una victoria. ";
    }
    
    return content;
  }
  
  /**
   * Generate clarity content to ensure understanding
   */
  private generateClarityContent(context: ChatContext): string {
    let content = '';
    
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
  }
  
  /**
   * Calculate recovery time based on recovery status
   */
  private calculateRecoveryTime(recoveryStatus: any): number {
    switch (recoveryStatus.fatigueLevel) {
      case 'low': return 24;
      case 'moderate': return 48;
      case 'high': return 72;
      case 'extreme': return 96;
      default: return 48;
    }
  }
}