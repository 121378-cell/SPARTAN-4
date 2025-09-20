// Chat Maestro Personality Service Integration

import { 
  CoachTone, 
  CoachingPhase, 
  CoachingContext, 
  UserState, 
  CoachingPrompt,
  PersonalityWeights
} from './chat-maestro-types';
import { ChatMaestroPersonalityEngine } from './chat-maestro-personality-engine';

export class ChatMaestroPersonalityService {
  private personalityEngine: ChatMaestroPersonalityEngine;

  constructor() {
    this.personalityEngine = new ChatMaestroPersonalityEngine();
  }

  /**
   * Generate a personalized coaching response based on user state and context
   */
  async generatePersonalizedCoaching(
    userState: UserState,
    context: CoachingContext,
    customMessage?: string
  ): Promise<CoachingPrompt> {
    // Determine the primary tone based on user state and context
    let primaryTone = this.personalityEngine.determinePrimaryTone(userState, context);
    
    // Adjust tone based on emotional state
    primaryTone = this.personalityEngine.adjustToneForEmotionalState(primaryTone, userState);
    
    // Generate the coaching prompt
    const coachingPrompt = this.personalityEngine.generateCoachingPrompt(
      primaryTone,
      context,
      userState,
      customMessage
    );
    
    return coachingPrompt;
  }

  /**
   * Get personality weights for the current phase
   */
  getPhasePersonalityWeights(phase: CoachingPhase): PersonalityWeights {
    return this.personalityEngine.getPhasePersonalityWeights(phase);
  }

  /**
   * Analyze user input to determine appropriate coaching context
   */
  analyzeUserInput(input: string): CoachingContext {
    const lowerInput = input.toLowerCase();
    
    // Check for specific keywords to determine context
    if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('training')) {
      return 'workout';
    }
    
    if (lowerInput.includes('nutrition') || lowerInput.includes('food') || lowerInput.includes('meal') || lowerInput.includes('diet')) {
      return 'nutrition';
    }
    
    if (lowerInput.includes('tired') || lowerInput.includes('fatigue') || lowerInput.includes('sleep') || lowerInput.includes('rest')) {
      return 'recovery';
    }
    
    if (lowerInput.includes('progress') || lowerInput.includes('improve') || lowerInput.includes('better') || lowerInput.includes('result')) {
      return 'progress';
    }
    
    if (lowerInput.includes('form') || lowerInput.includes('technique') || lowerInput.includes('posture')) {
      return 'form-correction';
    }
    
    if (lowerInput.includes('goal') || lowerInput.includes('target') || lowerInput.includes('aim')) {
      return 'goal-setting';
    }
    
    if (lowerInput.includes('motivat') || lowerInput.includes('encourag') || lowerInput.includes('inspir')) {
      return 'motivation';
    }
    
    // Default to education if no specific context is detected
    return 'education';
  }

  /**
   * Adapt personality style based on conversation history
   */
  adaptToConversationHistory(
    previousPrompts: CoachingPrompt[],
    currentUserState: UserState
  ): UserState {
    // If user has received multiple disciplinary messages, increase empathy
    const disciplinaryCount = previousPrompts.filter(
      prompt => prompt.tone === 'disciplined'
    ).length;
    
    if (disciplinaryCount >= 3) {
      currentUserState.empathyLevel = Math.min(10, currentUserState.empathyLevel + 2);
    }
    
    // If user has received multiple empathetic messages, potentially increase discipline
    const empatheticCount = previousPrompts.filter(
      prompt => prompt.tone === 'empathetic'
    ).length;
    
    if (empatheticCount >= 3 && currentUserState.consistency <= 5) {
      currentUserState.disciplineLevel = Math.min(10, currentUserState.disciplineLevel + 1);
    }
    
    return currentUserState;
  }

  /**
   * Generate phase-specific messaging
   */
  generatePhaseSpecificMessage(
    phase: CoachingPhase,
    context: CoachingContext,
    userState: UserState
  ): string {
    const weights = this.getPhasePersonalityWeights(phase);
    
    // Create a message that reflects the phase personality
    switch (phase) {
      case 'initiation':
        return this.generateInitiationMessage(context, userState);
      case 'stagnation':
        return this.generateStagnationMessage(context, userState);
      case 'achievement':
        return this.generateAchievementMessage(context, userState);
      default:
        return this.generateDefaultMessage(context, userState);
    }
  }

  private generateInitiationMessage(context: CoachingContext, userState: UserState): string {
    const messages: Record<CoachingContext, string> = {
      'workout': "Welcome to your transformation journey! I'm excited you're taking this first step. We'll start with manageable, consistent habits that build momentum. Ready to begin?",
      'nutrition': "Great choice to focus on nutrition! We'll start with simple, sustainable changes that fit your lifestyle. Small adjustments create big changes over time.",
      'recovery': "Recovery is just as important as training! We'll establish good sleep and rest habits from day one to support your progress.",
      'progress': "Every champion starts somewhere. Focus on building consistent habits this week, and the results will follow naturally.",
      'form-correction': "Learning proper technique now will prevent injuries and maximize results later. Let's start with the fundamentals.",
      'goal-setting': "Setting clear, achievable goals creates the roadmap for your success. Let's define what you want to accomplish in the next 4 weeks.",
      'motivation': "Starting something new is exciting! Channel that energy into consistent daily actions, and you'll be amazed at what you can achieve.",
      'education': "Understanding the science behind your program increases compliance and results. Let's learn together!"
    };
    
    return messages[context];
  }

  private generateStagnationMessage(context: CoachingContext, userState: UserState): string {
    const messages: Record<CoachingContext, string> = {
      'workout': "Let's analyze what's happening with your progress. Plateaus are normal, and we'll identify the variables to adjust. Have your sleep, stress, or nutrition changed recently?",
      'nutrition': "Sometimes small changes in nutrition timing or quality can break through plateaus. Let's review your recent food logs to identify optimization opportunities.",
      'recovery': "Plateaus often indicate a need for better recovery. Let's assess your sleep quality, stress levels, and recovery protocols to identify improvement areas.",
      'progress': "Plateaus are part of every journey - they're actually signs that your body is adapting. Let's dig deeper into your data to find the next level of progress.",
      'form-correction': "Breaking through plateaus sometimes requires refining technique细节. Let's analyze your movement patterns to identify efficiency improvements.",
      'goal-setting': "When progress stalls, it's time to reassess and potentially adjust goals. Let's review your current targets and make necessary modifications.",
      'motivation': "Plateaus can be mentally challenging, but they're temporary. Champions use these moments to build mental toughness and refine their approach.",
      'education': "Plateaus are excellent opportunities to deepen your understanding. Let's explore the science behind adaptation and how to optimize your approach."
    };
    
    return messages[context];
  }

  private generateAchievementMessage(context: CoachingContext, userState: UserState): string {
    const messages: Record<CoachingContext, string> = {
      'workout': "Look at this incredible progress! You've exceeded your strength goals by 15%. This proves your dedication. Let's set an even more ambitious target for the next phase!",
      'nutrition': "Your nutrition consistency has created amazing results! With this foundation, we can explore more advanced strategies to accelerate your progress even further.",
      'recovery': "Your attention to recovery has paid off with improved performance and reduced injury risk. Let's build on this success with more sophisticated recovery protocols.",
      'progress': "These results validate your commitment and capability. Champions like you don't rest on laurels - they use success as a launchpad for even greater achievements!",
      'form-correction': "Your technique improvements have translated directly into better performance. Let's continue refining to unlock the next level of athletic ability.",
      'goal-setting': "With goals consistently exceeded, it's time to set even more ambitious targets. Your proven capability means we can aim higher with confidence.",
      'motivation': "This success validates your approach and builds momentum for even greater achievements. Champions use victories as fuel for bigger challenges.",
      'education': "Your dedication to learning has accelerated your results. With this foundation, we can explore more advanced concepts to continue your progress."
    };
    
    return messages[context];
  }

  private generateDefaultMessage(context: CoachingContext, userState: UserState): string {
    const messages: Record<CoachingContext, string> = {
      'workout': "Let's focus on consistent execution today. Every workout builds the athlete you're becoming.",
      'nutrition': "Nutrition is the foundation of your results. Let's ensure today's choices support your goals.",
      'recovery': "Recovery is essential for adaptation and performance. Let's prioritize what your body needs today.",
      'progress': "Progress happens through consistent daily actions. Let's focus on what moves the needle today.",
      'form-correction': "Attention to technique prevents injury and maximizes results. Let's refine your movements today.",
      'goal-setting': "Clear goals create focused action. Let's ensure your daily choices align with your objectives.",
      'motivation': "Motivation comes from taking action, not waiting for it. Let's start with one small step today.",
      'education': "Learning is the foundation of improvement. Let's explore what will help you succeed today."
    };
    
    return messages[context];
  }

  /**
   * Get the personality engine for direct access (if needed)
   */
  getPersonalityEngine(): ChatMaestroPersonalityEngine {
    return this.personalityEngine;
  }
}