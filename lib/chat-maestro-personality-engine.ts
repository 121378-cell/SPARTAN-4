// Chat Maestro Personality Engine Implementation

import { 
  CoachTone, 
  CoachingPhase, 
  CoachingContext, 
  UserState, 
  PersonalityWeights, 
  PhasePersonality,
  CoachingPrompt
} from './chat-maestro-types';

export class ChatMaestroPersonalityEngine {
  private phasePersonalities: PhasePersonality = {
    initiation: {
      disciplined: 30,
      motivational: 40,
      technical: 10,
      empathetic: 20
    },
    stagnation: {
      disciplined: 20,
      motivational: 15,
      technical: 40,
      empathetic: 25
    },
    achievement: {
      disciplined: 20,
      motivational: 40,
      technical: 25,
      empathetic: 15
    }
  };

  private contextToneMapping: Record<CoachingContext, CoachTone> = {
    'workout': 'disciplined',
    'nutrition': 'technical',
    'recovery': 'empathetic',
    'progress': 'motivational',
    'form-correction': 'technical',
    'goal-setting': 'motivational',
    'motivation': 'motivational',
    'education': 'technical'
  };

  private toneTriggers: Record<CoachTone, string[]> = {
    'disciplined': [
      'missed workout',
      'skipped nutrition',
      'inconsistent',
      'not following plan',
      'breaking commitment'
    ],
    'motivational': [
      'personal record',
      'milestone achieved',
      'challenging workout',
      'difficult moment',
      'need encouragement'
    ],
    'technical': [
      'form correction',
      'technique issue',
      'data analysis',
      'program explanation',
      'plateau investigation'
    ],
    'empathetic': [
      'feeling tired',
      'stressed',
      'demotivated',
      'fatigued',
      'personal challenge'
    ]
  };

  /**
   * Determine the primary coaching tone based on user state and context
   */
  determinePrimaryTone(userState: UserState, context: CoachingContext): CoachTone {
    // First check for contextual triggers
    const contextTone = this.contextToneMapping[context];
    
    // Check for specific user state triggers
    if (userState.energyLevel <= 3 && userState.motivationLevel <= 4) {
      return 'empathetic';
    }
    
    if (userState.consistency < 5) {
      return 'disciplined';
    }
    
    if (context === 'progress' && userState.progress >= 7) {
      return 'motivational';
    }
    
    // Default to context-based tone
    return contextTone;
  }

  /**
   * Get personality weights for the current phase
   */
  getPhasePersonalityWeights(phase: CoachingPhase): PersonalityWeights {
    return this.phasePersonalities[phase];
  }

  /**
   * Adjust tone based on user emotional state
   */
  adjustToneForEmotionalState(primaryTone: CoachTone, userState: UserState): CoachTone {
    // If user is very low energy or motivation, override with empathy
    if (userState.energyLevel <= 2 || userState.motivationLevel <= 2) {
      return 'empathetic';
    }
    
    // If user is inconsistent, emphasize discipline
    if (userState.consistency <= 3) {
      return 'disciplined';
    }
    
    return primaryTone;
  }

  /**
   * Generate a coaching prompt based on tone and context
   */
  generateCoachingPrompt(
    tone: CoachTone, 
    context: CoachingContext, 
    userState: UserState,
    customMessage?: string
  ): CoachingPrompt {
    const priority = this.calculatePromptPriority(tone, userState);
    
    return {
      tone,
      context,
      phase: userState.currentPhase,
      message: customMessage || this.getDefaultMessage(tone, context, userState),
      priority
    };
  }

  /**
   * Calculate priority of the coaching prompt
   */
  private calculatePromptPriority(tone: CoachTone, userState: UserState): number {
    let priority = 5; // Base priority
    
    // Increase priority for critical issues
    if (tone === 'disciplined' && userState.consistency <= 3) {
      priority += 3;
    }
    
    if (tone === 'empathetic' && (userState.energyLevel <= 2 || userState.stressLevel >= 8)) {
      priority += 3;
    }
    
    if (userState.currentPhase === 'stagnation') {
      priority += 2;
    }
    
    // Cap at 10
    return Math.min(priority, 10);
  }

  /**
   * Get default message based on tone and context
   */
  private getDefaultMessage(tone: CoachTone, context: CoachingContext, userState: UserState): string {
    const phase = userState.currentPhase;
    const templates: Record<CoachTone, Record<CoachingContext, string[]>> = {
      'disciplined': {
        'workout': [
          "Consistency is what transforms good intentions into real results. Honor your commitment to yourself.",
          "Champions are made through discipline, not just desire. Show up and do the work.",
          "Your future self is counting on the decisions you make today. Stay committed."
        ],
        'nutrition': [
          "Nutrition is 70% of your results. Stick to your plan with precision.",
          "Every meal is either working for you or against you. Choose wisely.",
          "Discipline in nutrition creates the foundation for all other progress."
        ],
        'recovery': [
          "Recovery is not optional - it's essential. Follow your recovery protocols.",
          "Your body needs structured rest to adapt and grow stronger.",
          "Disciplined recovery leads to better performance and fewer injuries."
        ],
        'progress': [
          "Sustainable progress requires consistent daily actions, not sporadic efforts.",
          "Measure your discipline in days, not feelings.",
          "True champions maintain their standards even when motivation fades."
        ],
        'form-correction': [
          "Precision in movement prevents injury and maximizes results.",
          "Correct form is non-negotiable for long-term success.",
          "Discipline in technique builds championship-level performance."
        ],
        'goal-setting': [
          "Set clear, measurable goals with specific deadlines.",
          "Break big goals into smaller, achievable milestones.",
          "Accountability starts with clear commitments to yourself."
        ],
        'motivation': [
          "Motivation is temporary, but discipline is eternal.",
          "Actions precede motivation - start first, feel later.",
          "Champions don't wait for motivation, they create it through action."
        ],
        'education': [
          "Understanding the science behind your program increases compliance.",
          "Knowledge empowers better decisions and consistent execution.",
          "Educated athletes make fewer mistakes and achieve better results."
        ]
      },
      'motivational': {
        'workout': [
          "You're crushing this! Push beyond your previous limits - that's how champions are made!",
          "Every rep is building the athlete you're becoming. Keep going!",
          "Your body is adapting faster than most people in 3 months. Amazing work!"
        ],
        'nutrition': [
          "Fueling your body properly is an act of self-love and respect.",
          "Each nutritious meal is an investment in your future success.",
          "You're nourishing your potential with every healthy choice."
        ],
        'recovery': [
          "Rest is not laziness - it's when your body rebuilds stronger.",
          "Champions prioritize recovery because they value long-term success.",
          "Taking care of your body shows respect for your goals."
        ],
        'progress': [
          "Look at this incredible progress! You've exceeded expectations by miles.",
          "This transformation proves your dedication and capability.",
          "Every small win is building momentum toward massive success."
        ],
        'form-correction': [
          "Improving your technique is unlocking new levels of performance!",
          "Each correction makes you a more efficient and powerful athlete.",
          "Attention to detail separates good athletes from great ones."
        ],
        'goal-setting': [
          "Your goals are ambitious and achievable - I believe in you!",
          "Setting bold targets creates the energy and focus needed for breakthrough.",
          "Vision without action remains a dream, but you're taking action!"
        ],
        'motivation': [
          "You have everything inside you to achieve greatness.",
          "Believe in your ability to overcome any challenge.",
          "Your potential is limitless when you commit to the process."
        ],
        'education': [
          "Understanding your body empowers you to optimize your performance.",
          "Knowledge is power - you're becoming a true student of your craft.",
          "The more you learn, the more confident and capable you become."
        ]
      },
      'technical': {
        'workout': [
          "Let's optimize your program based on your latest performance data.",
          "Analyzing your metrics reveals opportunities for targeted improvements.",
          "Evidence-based adjustments will accelerate your progress effectively."
        ],
        'nutrition': [
          "Macro timing and food quality directly impact your energy and recovery.",
          "Let's analyze your nutrition data to identify optimization opportunities.",
          "Scientific principles guide effective nutrition programming."
        ],
        'recovery': [
          "Recovery protocols should align with your training intensity and volume.",
          "Monitoring recovery metrics helps prevent overtraining and injuries.",
          "Evidence-based recovery methods maximize adaptation and performance."
        ],
        'progress': [
          "Data analysis reveals patterns that inform future programming decisions.",
          "Your progress metrics show specific strengths and areas for improvement.",
          "Objective measurements guide precise adjustments to your program."
        ],
        'form-correction': [
          "Biomechanical analysis identifies movement inefficiencies and risks.",
          "Proper technique maximizes force production while minimizing injury risk.",
          "Technical precision creates sustainable long-term performance gains."
        ],
        'goal-setting': [
          "SMART goals based on your data create realistic yet challenging targets.",
          "Evidence-based goal setting increases likelihood of successful outcomes.",
          "Historical performance data informs appropriate progression rates."
        ],
        'motivation': [
          "Understanding the science of motivation helps create sustainable habits.",
          "Behavioral psychology principles guide effective habit formation.",
          "Data-driven approaches to motivation produce consistent results."
        ],
        'education': [
          "Scientific principles explain why certain methods produce better results.",
          "Evidence-based practices separate effective methods from popular myths.",
          "Understanding the 'why' behind recommendations increases compliance."
        ]
      },
      'empathetic': {
        'workout': [
          "I can sense you're feeling drained today. That's completely normal during adaptation.",
          "Sometimes the most disciplined choice is knowing when to modify intensity.",
          "Listen to your body while maintaining forward momentum in your journey."
        ],
        'nutrition': [
          "Life happens, and it's okay to be flexible with your nutrition approach.",
          "Self-compassion during challenging times builds long-term success.",
          "Sustainable nutrition is about consistency over perfection."
        ],
        'recovery': [
          "Your body is working hard to adapt and improve - give it the rest it needs.",
          "Sometimes the best training is knowing when to step back and recover.",
          "Honoring your body's signals shows wisdom and maturity as an athlete."
        ],
        'progress': [
          "Progress isn't always linear - trust the process and the long-term plan.",
          "Plateaus are normal and often precede breakthrough moments.",
          "Your dedication during challenging phases builds true championship character."
        ],
        'form-correction': [
          "Learning new movement patterns takes time and patience.",
          "Be kind to yourself as you develop new neuromuscular connections.",
          "Mistakes are part of the learning process - they show you're growing."
        ],
        'goal-setting': [
          "Adjusting goals based on life circumstances shows wisdom and self-awareness.",
          "Flexible goal-setting maintains motivation during challenging periods.",
          "Realistic expectations during difficult times preserve long-term success."
        ],
        'motivation': [
          "It's normal to experience motivational dips - they're part of every journey.",
          "Be patient with yourself during challenging emotional periods.",
          "Self-compassion during difficult times builds resilience for future success."
        ],
        'education': [
          "Learning happens at different rates - be patient with your understanding.",
          "Asking questions shows engagement and commitment to improvement.",
          "Everyone learns differently - find approaches that work for you."
        ]
      }
    };

    const contextTemplates = templates[tone][context];
    const randomIndex = Math.floor(Math.random() * contextTemplates.length);
    return contextTemplates[randomIndex];
  }

  /**
   * Get tone triggers for debugging or analytics
   */
  getToneTriggers(): Record<CoachTone, string[]> {
    return { ...this.toneTriggers };
  }

  /**
   * Get phase personality weights for debugging or analytics
   */
  getPhasePersonalities(): PhasePersonality {
    return { ...this.phasePersonalities };
  }
}