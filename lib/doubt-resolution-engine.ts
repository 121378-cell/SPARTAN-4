import { ChatContext, ChatResponse } from './chat-maestro-service';
import { SpartanCoachService } from './spartan-coach-service';
import { KnowledgeBaseService, 
         ExerciseInfo, 
         NutritionInfo, 
         PreventionAdvice,
         SleepAdvice,
         StressAdvice,
         ProgramDesignInfo,
         MovementPatternInfo,
         MealTimingAdvice,
         SupplementAdvice,
         RecoveryAdvice } from './knowledge-base-service';
import { ConversationalCoach } from './conversationalCoach';
import type { UserData, WorkoutSession, DailyNutrition, RecoveryAnalysis } from './types';

// Enhanced interfaces for more sophisticated doubt resolution
export interface DoubtCategory {
  type: 'training' | 'nutrition' | 'biomechanics' | 'recovery' | 'program_design' | 'supplementation' | 'psychology' | 'general';
  confidence: number; // 0-1 scale
  keywords: string[];
}

export interface ResolvedDoubt {
  category: DoubtCategory;
  confidence: number; // 0-1 scale
  response: string;
  actionItems: string[];
  personalized: boolean;
  scientificBasis: string[];
}

export class DoubtResolutionEngine {
  private knowledgeBase: KnowledgeBaseService;
  private spartanCoach: SpartanCoachService;
  private conversationalCoach: ConversationalCoach;
  
  constructor() {
    this.knowledgeBase = new KnowledgeBaseService();
    this.spartanCoach = new SpartanCoachService();
    this.conversationalCoach = new ConversationalCoach();
  }
  
  /**
   * Enhanced doubt resolution with access to complete Spartan knowledge base
   * This method orchestrates access to all knowledge domains and provides 
   * reliable, practical, and personalized answers
   */
  resolveDoubt(input: string, context: ChatContext): ResolvedDoubt {
    console.log('🧠 Resolving doubt with full knowledge base access:', input);
    
    // 1. Categorize the doubt with confidence scoring
    const doubtCategory = this.categorizeDoubt(input, context);
    
    // 2. Extract specific entities (exercises, foods, body parts, etc.)
    const entities = this.extractEntities(input, doubtCategory);
    
    // 3. Generate response based on category and entities
    const responseDetails = this.generateResponseByCategory(input, context, doubtCategory, entities);
    
    // 4. Personalize based on user context
    const personalizedResponse = this.personalizeResponse(responseDetails.response, context, entities);
    
    // 5. Add scientific backing
    const scientificBasis = this.getScientificBasis(doubtCategory, entities);
    
    return {
      category: doubtCategory,
      confidence: responseDetails.confidence,
      response: personalizedResponse,
      actionItems: responseDetails.actionItems,
      personalized: true,
      scientificBasis
    };
  }
  
  /**
   * Resolve ambiguous questions by gathering more information and making educated assumptions
   */
  resolveAmbiguousQuestion(input: string, context: ChatContext): ChatResponse {
    console.log('🧠 Resolving ambiguous question:', input);
    
    // Analyze context to make educated assumptions
    const assumptions = this.makeContextualAssumptions(context);
    
    // Generate response with clarification request and possible interpretations
    let response = "Entiendo que tienes una pregunta, pero necesito un poco más de información para ayudarte de la mejor manera. ";
    
    // Add context-based assumptions
    if (assumptions.length > 0) {
      response += "Basado en tu actividad reciente, podrías estar preguntando sobre: \n\n";
      assumptions.forEach((assumption, index) => {
        response += `${index + 1}. ${assumption.question}: ${assumption.explanation}\n`;
      });
      response += "\n¿Alguna de estas interpretaciones es correcta? ¿O te refieres a algo diferente?";
    } else {
      // Generic clarification request
      response += "¿Podrías especificar un poco más? Por ejemplo:\n";
      response += "• ¿Tienes una duda sobre tu entrenamiento?\n";
      response += "• ¿Necesitas orientación nutricional?\n";
      response += "• ¿Tienes preguntas sobre tu recuperación?\n";
      response += "• ¿Necesitas motivación o ánimo?\n";
    }
    
    // Add action items for clarification
    const actionItems = assumptions.length > 0 
      ? assumptions.map(a => a.question)
      : ['Entrenamiento', 'Nutrición', 'Recuperación', 'Motivación'];
    
    return {
      response,
      actionItems
    };
  }
  
  /**
   * Provide technical answers with scientific backing and practical application
   */
  resolveTechnicalQuestion(input: string, context: ChatContext): ChatResponse {
    console.log('🔬 Resolving technical question:', input);
    
    // Use enhanced doubt resolution engine
    const resolvedDoubt = this.resolveDoubt(input, context);
    
    // Format response with scientific backing
    let response = resolvedDoubt.response;
    
    // Add scientific basis if available
    if (resolvedDoubt.scientificBasis.length > 0) {
      response += "\n\n🔬 **BASE CIENTÍFICA:**\n";
      resolvedDoubt.scientificBasis.forEach((basis, index) => {
        response += `${index + 1}. ${basis}\n`;
      });
    }
    
    return {
      response,
      actionItems: resolvedDoubt.actionItems
    };
  }
  
  /**
   * Provide motivational support tailored to user state with contextual guidance
   */
  resolveMotivationalQuestion(input: string, context: ChatContext): ChatResponse {
    console.log('🔥 Resolving motivational question:', input);
    
    // Analyze user psychology and recent performance
    const psychologyProfile = this.analyzeUserPsychology(context);
    
    // Generate personalized encouragement using Spartan Coach
    const spartanResponse = this.spartanCoach.generateCoachingMessage(context, input);
    
    // Enhance with specific motivational elements
    let response = spartanResponse.response;
    
    // Add progress highlights
    const progressHighlights = this.getProgressHighlights(context);
    if (progressHighlights) {
      response += `\n\n${progressHighlights}`;
    }
    
    // Add goal reinforcement
    const goalReinforcement = this.getGoalReinforcement(context);
    if (goalReinforcement) {
      response += `\n\n${goalReinforcement}`;
    }
    
    // Add actionable next steps
    const nextSteps = this.getActionableNextSteps(context);
    if (nextSteps) {
      response += `\n\n${nextSteps}`;
    }
    
    return {
      response,
      actionItems: spartanResponse.actionItems || ['Continuar entrenando', 'Revisar metas', 'Celebrar progreso']
    };
  }
  
  /**
   * Categorize doubt with confidence scoring based on keywords and context
   */
  private categorizeDoubt(input: string, context: ChatContext): DoubtCategory {
    const lowerInput = input.toLowerCase();
    
    // Define categories with keywords and confidence weights
    const categories: DoubtCategory[] = [
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
    categories.forEach(category => {
      const matches = category.keywords.filter(keyword => lowerInput.includes(keyword));
      category.confidence = matches.length / category.keywords.length;
    });
    
    // Boost confidence based on context clues
    if (context.currentScreen === 'workoutDetail' || context.currentScreen === 'dashboard') {
      const trainingCategory = categories.find(c => c.type === 'training');
      if (trainingCategory) trainingCategory.confidence += 0.2;
    }
    
    if (context.currentScreen === 'nutrition' || context.currentScreen === 'nutritionDashboard') {
      const nutritionCategory = categories.find(c => c.type === 'nutrition');
      if (nutritionCategory) nutritionCategory.confidence += 0.2;
    }
    
    if (context.currentScreen === 'recovery' || context.currentScreen === 'recoveryDashboard') {
      const recoveryCategory = categories.find(c => c.type === 'recovery');
      if (recoveryCategory) recoveryCategory.confidence += 0.2;
    }
    
    // Find the category with highest confidence
    const bestCategory = categories.reduce((prev, current) => 
      (prev.confidence > current.confidence) ? prev : current
    );
    
    // If no category has significant confidence, default to general
    if (bestCategory.confidence < 0.1) {
      return {
        type: 'general',
        confidence: 0.5,
        keywords: []
      };
    }
    
    return bestCategory;
  }
  
  /**
   * Extract specific entities from input based on category
   */
  private extractEntities(input: string, category: DoubtCategory): any {
    const lowerInput = input.toLowerCase();
    const entities: any = {};
    
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
  }
  
  /**
   * Generate response based on category and extracted entities
   */
  private generateResponseByCategory(
    input: string, 
    context: ChatContext, 
    category: DoubtCategory, 
    entities: any
  ): { response: string; actionItems: string[]; confidence: number } {
    let response = "";
    let actionItems: string[] = [];
    let confidence = category.confidence;
    
    switch (category.type) {
      case 'training':
        if (entities.exercise) {
          const exerciseInfo: ExerciseInfo = this.knowledgeBase.getExerciseInformation(entities.exercise);
          response = this.formatExerciseResponse(exerciseInfo, context);
          actionItems = ['Ver técnica detallada', 'Entender progresión', 'Evitar errores comunes'];
          confidence = 0.9; // High confidence when we have specific exercise info
        } else {
          response = "Para darte una respuesta técnica precisa sobre entrenamiento, necesito saber de qué ejercicio estás preguntando. " +
                     "¿Podrías especificar? Por ejemplo: '¿Cómo hago una sentadilla?' o '¿Cuántas series debo hacer de press de banca?'";
          actionItems = ['Especificar ejercicio', 'Ver rutina actual', 'Consultar técnica general'];
          confidence = 0.6; // Medium confidence for general training questions
        }
        break;
        
      case 'nutrition':
        if (entities.food) {
          const nutritionInfo: NutritionInfo = this.knowledgeBase.getNutritionalInformation(entities.food);
          response = this.formatNutritionResponse(nutritionInfo, context);
          actionItems = ['Plan nutricional', 'Timing de comidas', 'Suplementación'];
          confidence = 0.9;
        } else {
          response = "Para darte una respuesta nutricional precisa, necesito saber de qué alimento o aspecto de la nutrición estás preguntando. " +
                     "¿Podrías especificar? Por ejemplo: '¿Cuántas proteínas tiene el pollo?' o '¿Cuándo debo comer antes de entrenar?'";
          actionItems = ['Especificar alimento', 'Consultar macros', 'Timing nutricional'];
          confidence = 0.6;
        }
        break;
        
      case 'biomechanics':
        if (entities.bodyPart) {
          const preventionInfo: PreventionAdvice = this.knowledgeBase.getInjuryPreventionStrategies(entities.bodyPart);
          response = this.formatBiomechanicsResponse(preventionInfo, context);
          actionItems = ['Corrección de técnica', 'Prevención de lesiones', 'Ejercicios correctivos'];
          confidence = 0.9;
        } else {
          response = "Para darte una respuesta sobre biomecánica o prevención de lesiones, necesito saber qué parte del cuerpo te preocupa. " +
                     "¿Podrías especificar? Por ejemplo: '¿Cómo evitar lesiones en los hombros?' o '¿Qué puedo hacer por el dolor de espalda?'";
          actionItems = ['Especificar zona', 'Consultar prevención general', 'Ver ejercicios correctivos'];
          confidence = 0.6;
        }
        break;
        
      case 'recovery':
        const recoveryResponse = this.generateRecoveryResponse(input, context, entities);
        response = recoveryResponse.response;
        actionItems = recoveryResponse.actionItems;
        confidence = recoveryResponse.confidence;
        break;
        
      case 'program_design':
        const programInfo: ProgramDesignInfo = this.knowledgeBase.getProgramDesignPrinciples(
          context.userData.goals[0] || 'general fitness', 
          context.userData.fitnessLevel
        );
        response = this.formatProgramDesignResponse(programInfo, context);
        actionItems = ['Ver fases del programa', 'Entender periodización', 'Planificar deload'];
        confidence = 0.8;
        break;
        
      case 'supplementation':
        const supplementAdvice: SupplementAdvice = this.knowledgeBase.getSupplementGuidance(
          context.userData.goals[0] || 'general fitness', 
          [] // No restrictions for now
        );
        response = this.formatSupplementResponse(supplementAdvice, context);
        actionItems = ['Ver dosis recomendadas', 'Timing de suplementos', 'Precauciones'];
        confidence = 0.8;
        break;
        
      case 'psychology':
        // Use Spartan Coach for psychology/motivation
        const spartanResponse = this.spartanCoach.generateCoachingMessage(context, input);
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
    
    return { response, actionItems, confidence };
  }
  
  /**
   * Personalize response based on user context and extracted entities
   */
  private personalizeResponse(response: string, context: ChatContext, entities: any): string {
    // Add user's fitness level context
    const fitnessLevel = context.userData.fitnessLevel || 'intermediate';
    let personalizedResponse = response;
    
    // Add fitness level specific advice
    if (fitnessLevel === 'beginner') {
      personalizedResponse += "\n\n🎯 **PARA PRINCIPIANTES:** Recuerda enfocarte en la técnica antes que en la carga. Progresa gradualmente.";
    } else if (fitnessLevel === 'advanced') {
      personalizedResponse += "\n\n🎯 **PARA ATLETAS AVANZADOS:** Puedes enfocarte en variaciones más complejas y periodización avanzada.";
    }
    
    // Add recovery context if relevant
    if (context.recoveryStatus && context.recoveryStatus.fatigueLevel !== 'low') {
      personalizedResponse += `\n\n💡 **CONTEXTO DE RECUPERACIÓN:** Dado que tu nivel de fatiga es ${context.recoveryStatus.fatigueLevel}, considera ajustar la intensidad.`;
    }
    
    return personalizedResponse;
  }
  
  /**
   * Get scientific basis for the response
   */
  private getScientificBasis(category: DoubtCategory, entities: any): string[] {
    const scientificBasis: string[] = [];
    
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
  }
  
  /**
   * Make contextual assumptions based on user data
   */
  private makeContextualAssumptions(context: ChatContext): { question: string; explanation: string }[] {
    const assumptions: { question: string; explanation: string }[] = [];
    
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
        explanation: `Estás trabajando en "${context.activeWorkout.name}". ¿Necesitas ayuda con algún aspecto específico?`
      });
    }
    
    // Check recovery status
    if (context.recoveryStatus) {
      assumptions.push({
        question: "Sobre tu recuperación",
        explanation: `Tu nivel de fatiga es ${context.recoveryStatus.fatigueLevel}. ¿Tienes dudas sobre cómo recuperarte mejor?`
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
  }
  
  /**
   * Extract exercise name from input
   */
  private extractExerciseName(input: string): string | null {
    const lowerInput = input.toLowerCase();
    
    // Common exercise names
    const exercises = [
      'sentadilla', 'press de banca', 'peso muerto', 'dominadas', 'fondos', 
      'press militar', 'remo con barra', 'curl de bíceps', 'french press',
      'zancadas', 'hip thrust', 'plancha', 'burpees', 'mountain climbers'
    ];
    
    for (const exercise of exercises) {
      if (lowerInput.includes(exercise)) {
        return exercise;
      }
    }
    
    return null;
  }
  
  /**
   * Extract food name from input
   */
  private extractFoodName(input: string): string | null {
    const lowerInput = input.toLowerCase();
    
    // Common food names
    const foods = [
      'pollo', 'arroz', 'pasta', 'huevos', 'leche', 'yogur', 'avena', 'plátano',
      'manzana', 'naranja', 'atún', 'salmón', 'carne', 'verduras', 'frutas'
    ];
    
    for (const food of foods) {
      if (lowerInput.includes(food)) {
        return food;
      }
    }
    
    return null;
  }
  
  /**
   * Extract body part from input
   */
  private extractBodyPart(input: string): string | null {
    const lowerInput = input.toLowerCase();
    
    // Common body parts
    const bodyParts = [
      'hombros', 'espalda', 'cuello', 'caderas', 'rodillas', 'tobillos', 'codos', 'muñecas'
    ];
    
    for (const part of bodyParts) {
      if (lowerInput.includes(part)) {
        return part;
      }
    }
    
    return null;
  }
  
  /**
   * Extract number pattern from input
   */
  private extractNumberPattern(input: string, pattern: RegExp): number | null {
    const match = input.match(pattern);
    return match ? parseFloat(match[1]) : null;
  }
  
  /**
   * Extract pain level from input
   */
  private extractPainLevel(input: string): number | null {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('mucho') || lowerInput.includes('intenso') || lowerInput.includes('fuerte')) {
      return 8; // High pain level
    } else if (lowerInput.includes('moderado') || lowerInput.includes('medio')) {
      return 5; // Medium pain level
    } else if (lowerInput.includes('leve') || lowerInput.includes('ligero')) {
      return 2; // Low pain level
    }
    
    return null;
  }
  
  /**
   * Format exercise information response
   */
  private formatExerciseResponse(exerciseInfo: ExerciseInfo, context: ChatContext): string {
    let response = `**${exerciseInfo.name.toUpperCase()}**\n\n`;
    response += `${exerciseInfo.description}\n\n`;
    
    response += "**TÉCNICA CORRECTA:**\n";
    exerciseInfo.technique.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });
    
    response += "\n**ERRORES COMUNES A EVITAR:**\n";
    exerciseInfo.commonMistakes.forEach((mistake, index) => {
      response += `• ${mistake}\n`;
    });
    
    response += "\n**CONSEJOS DE SEGURIDAD:**\n";
    exerciseInfo.safetyTips.forEach((tip, index) => {
      response += `• ${tip}\n`;
    });
    
    // Personalize based on user level
    const userLevel = context.userData.fitnessLevel || 'intermediate';
    response += `\n**PARA TU NIVEL (${userLevel.toUpperCase()}):**\n`;
    response += this.getLevelSpecificAdvice(userLevel, exerciseInfo.difficultyLevel);
    
    return response;
  }
  
  /**
   * Format nutrition information response
   */
  private formatNutritionResponse(nutritionInfo: NutritionInfo, context: ChatContext): string {
    let response = `**INFORMACIÓN NUTRICIONAL: ${nutritionInfo.foodName.toUpperCase()}**\n\n`;
    
    response += `**VALOR NUTRICIONAL POR 100G:**\n`;
    response += `• Calorías: ${nutritionInfo.caloriesPer100g} kcal\n`;
    response += `• Proteína: ${nutritionInfo.proteinPer100g}g\n`;
    response += `• Carbohidratos: ${nutritionInfo.carbsPer100g}g\n`;
    response += `• Grasas: ${nutritionInfo.fatsPer100g}g\n\n`;
    
    response += `**BENEFICIOS:**\n`;
    nutritionInfo.benefits.forEach(benefit => {
      response += `• ${benefit}\n`;
    });
    
    response += `\n**RECOMENDACIONES DE TIMING:**\n`;
    nutritionInfo.timingRecommendations.forEach(timing => {
      response += `• ${timing}\n`;
    });
    
    return response;
  }
  
  /**
   * Format biomechanics information response
   */
  private formatBiomechanicsResponse(preventionInfo: PreventionAdvice, context: ChatContext): string {
    let response = `**PREVENCIÓN DE LESIONES: ${preventionInfo.bodyPart.toUpperCase()}**\n\n`;
    
    response += `**FACTORES DE RIESGO:**\n`;
    preventionInfo.riskFactors.forEach(factor => {
      response += `• ${factor}\n`;
    });
    
    response += `\n**ESTRATEGIAS DE PREVENCIÓN:**\n`;
    preventionInfo.preventionStrategies.forEach(strategy => {
      response += `• ${strategy}\n`;
    });
    
    response += `\n**SEÑALES DE ALERTA:**\n`;
    preventionInfo.warningSigns.forEach(sign => {
      response += `• ${sign}\n`;
    });
    
    return response;
  }
  
  /**
   * Generate recovery response
   */
  private generateRecoveryResponse(input: string, context: ChatContext, entities: any): { response: string; actionItems: string[]; confidence: number } {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('sueño') || lowerInput.includes('dormir')) {
      const sleepAdvice: SleepAdvice = this.knowledgeBase.getSleepOptimizationTechniques(context.userData);
      
      let response = `**OPTIMIZACIÓN DEL SUEÑO**\n\n`;
      
      response += `**DURACIÓN RECOMENDADA:** ${sleepAdvice.sleepDuration}\n\n`;
      
      response += `**FACTORES PARA MEJORAR LA CALIDAD DEL SUEÑO:**\n`;
      sleepAdvice.sleepQualityFactors.forEach(factor => {
        response += `• ${factor}\n`;
      });
      
      response += `\n**TÉCNICAS DE OPTIMIZACIÓN:**\n`;
      sleepAdvice.optimizationTechniques.forEach(technique => {
        response += `• ${technique}\n`;
      });
      
      response += `\n**SEÑALES DE ALERTA:**\n`;
      sleepAdvice.warningSigns.forEach(sign => {
        response += `• ${sign}\n`;
      });
      
      return {
        response,
        actionItems: ['Ver rutina de sueño', 'Optimizar ambiente', 'Técnicas de relajación'],
        confidence: 0.9
      };
    } else if (lowerInput.includes('estrés')) {
      // Use recovery status or default to moderate stress
      const stressLevel = context.recoveryStatus ? 
        this.convertFatigueToStressLevel(context.recoveryStatus.fatigueLevel) : 5;
      
      const stressAdvice: StressAdvice = this.knowledgeBase.getStressManagementStrategies(stressLevel);
      
      let response = `**MANEJO DEL ESTRÉS (NIVEL ${stressAdvice.stressLevel}/10)**\n\n`;
      
      response += `**TÉCNICAS DE MANEJO:**\n`;
      stressAdvice.managementTechniques.forEach(technique => {
        response += `• ${technique}\n`;
      });
      
      response += `\n**EJERCICIOS DE RESPIRACIÓN:**\n`;
      stressAdvice.breathingExercises.forEach(exercise => {
        response += `• ${exercise}\n`;
      });
      
      response += `\n**RECOMENDACIONES DE ESTILO DE VIDA:**\n`;
      stressAdvice.lifestyleRecommendations.forEach(recommendation => {
        response += `• ${recommendation}\n`;
      });
      
      return {
        response,
        actionItems: ['Técnicas de respiración', 'Gestión del tiempo', 'Actividades relajantes'],
        confidence: 0.9
      };
    } else {
      // General recovery response with personalized recommendations
      const fatigueLevel = context.recoveryStatus?.fatigueLevel || 'moderate';
      const recoveryAdvice: RecoveryAdvice = this.knowledgeBase.getRecoveryModalityRecommendations(fatigueLevel);
      
      let response = `**RECUPERACIÓN PERSONALIZADA (NIVEL: ${fatigueLevel.toUpperCase()})**\n\n`;
      
      response += `**MODALIDADES RECOMENDADAS:**\n`;
      recoveryAdvice.recommendedModalities.forEach(modality => {
        response += `• ${modality}\n`;
      });
      
      response += `\n**DURACIÓN:** ${recoveryAdvice.duration}\n`;
      response += `**FRECUENCIA:** ${recoveryAdvice.frequency}\n`;
      
      return {
        response,
        actionItems: ['Ver plan de recuperación', 'Registrar métricas', 'Evaluar progreso'],
        confidence: 0.8
      };
    }
  }
  
  /**
   * Format program design response
   */
  private formatProgramDesignResponse(programInfo: ProgramDesignInfo, context: ChatContext): string {
    let response = `**DISEÑO DE PROGRAMA: ${programInfo.programType.toUpperCase()}**\n\n`;
    response += `${programInfo.description}\n\n`;
    
    response += "**FASES DEL PROGRAMA:**\n";
    programInfo.phases.forEach((phase, index) => {
      response += `${index + 1}. ${phase.name} (${phase.duration})\n`;
      response += `   Enfoque: ${phase.focus}\n`;
      response += `   Objetivos: ${phase.goals.join(', ')}\n\n`;
    });
    
    response += `**MODELO DE PERIODIZACIÓN:** ${programInfo.periodizationModel}\n`;
    response += `**PROGRESIÓN DE CARGA:** ${programInfo.loadProgression}\n`;
    response += `**ESTRATEGIA DE DELOAD:** ${programInfo.deloadStrategy}\n`;
    
    return response;
  }
  
  /**
   * Format supplement response
   */
  private formatSupplementResponse(supplementAdvice: SupplementAdvice, context: ChatContext): string {
    let response = `**RECOMENDACIONES DE SUPLEMENTACIÓN PARA: ${supplementAdvice.goal.toUpperCase()}**\n\n`;
    
    supplementAdvice.recommendedSupplements.forEach((supplement, index) => {
      response += `${index + 1}. ${supplement.name.toUpperCase()}\n`;
      response += `   Dosificación: ${supplement.dosage}\n`;
      response += `   Timing: ${supplement.timing}\n`;
      response += `   Beneficios: ${supplement.benefits.join(', ')}\n`;
      response += `   Precauciones: ${supplement.precautions.join(', ')}\n\n`;
    });
    
    return response;
  }
  
  /**
   * Get level-specific advice
   */
  private getLevelSpecificAdvice(userLevel: string, exerciseLevel: string): string {
    if (userLevel === 'beginner' && exerciseLevel !== 'beginner') {
      return "Dado que eres principiante, te recomiendo dominar primero la versión más básica de este ejercicio con peso corporal o mancuernas ligeras antes de progresar.";
    } else if (userLevel === 'advanced' && exerciseLevel === 'beginner') {
      return "Como atleta avanzado, puedes enfocarte en variaciones más complejas de este ejercicio para continuar desafiando tus músculos.";
    } else {
      return "Sigue las instrucciones detalladas arriba y asegúrate de progresar gradualmente en peso e intensidad.";
    }
  }
  
  /**
   * Convert fatigue level to stress level
   */
  private convertFatigueToStressLevel(fatigueLevel: string): number {
    switch (fatigueLevel.toLowerCase()) {
      case 'low': return 3;
      case 'moderate': return 5;
      case 'high': return 7;
      case 'extreme': return 9;
      default: return 5;
    }
  }
  
  /**
   * Analyze user psychology based on context
   */
  private analyzeUserPsychology(context: ChatContext): any {
    // This would typically use the ConversationalCoach for detailed analysis
    // For now, we'll create a simplified analysis
    
    const recentWorkouts = context.recentWorkouts || [];
    const consistency = recentWorkouts.length > 0 ? 
      Math.min(1, recentWorkouts.length / 7) : 0; // Assuming 7-day period
    
    return {
      consistency,
      recentPerformance: recentWorkouts.length > 0 ? 'active' : 'inactive',
      recoveryStatus: context.recoveryStatus?.fatigueLevel || 'unknown'
    };
  }
  
  /**
   * Get progress highlights
   */
  private getProgressHighlights(context: ChatContext): string | null {
    const recentWorkouts = context.recentWorkouts || [];
    
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
  }
  
  /**
   * Get goal reinforcement
   */
  private getGoalReinforcement(context: ChatContext): string | null {
    const goals = context.userData.goals || [];
    
    if (goals.length > 0) {
      return "🎯 **REFORZAMIENTO DE METAS:**\n" +
             "Recuerda que estás trabajando hacia: " + goals.join(", ") + ". " +
             "Cada sesión te acerca más a alcanzar estos objetivos.";
    }
    
    return null;
  }
  
  /**
   * Get actionable next steps
   */
  private getActionableNextSteps(context: ChatContext): string | null {
    const recentWorkouts = context.recentWorkouts || [];
    
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
  }
  
  /**
   * Calculate workout consistency from recent sessions
   */
  private calculateWorkoutConsistency(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 0;
    
    // For simplicity, we'll assume consistency based on workout frequency
    // In a real implementation, this would be more sophisticated
    return Math.min(1, workouts.length / 7); // Assuming 7-day period
  }
  
  /**
   * Detect motivational struggle based on context
   */
  private detectMotivationalStruggle(context: ChatContext): boolean {
    // Check for low recovery scores
    if (context.recoveryStatus && context.recoveryStatus.recoveryScore < 40) {
      return true;
    }
    
    // Check for inconsistent training
    const consistency = this.calculateWorkoutConsistency(context.recentWorkouts);
    if (consistency < 0.3) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Select random message from array
   */
  private selectRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  /**
   * Interpret recovery score
   */
  private interpretRecoveryScore(score: number): string {
    if (score >= 80) return "excelente";
    if (score >= 60) return "buena";
    if (score >= 40) return "moderada";
    return "baja";
  }
  
  /**
   * Evaluate nutritional adequacy
   */
  private evaluateNutritionalAdequacy(nutrition: DailyNutrition): string {
    const calories = nutrition.totalNutrients.calories;
    if (calories > 2500) return "un exceso calórico";
    if (calories > 2000) return "una ingesta adecuada";
    if (calories > 1500) return "una ingesta moderada";
    return "una ingesta baja";
  }
}