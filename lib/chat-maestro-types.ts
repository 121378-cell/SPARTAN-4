// Types for Chat Maestro personality system

export type CoachTone = 'disciplined' | 'motivational' | 'technical' | 'empathetic';

export type CoachingPhase = 'initiation' | 'stagnation' | 'achievement';

export type CoachingContext = 
  | 'workout'
  | 'nutrition'
  | 'recovery'
  | 'progress'
  | 'form-correction'
  | 'goal-setting'
  | 'motivation'
  | 'education';

export interface UserState {
  energyLevel: number; // 1-10
  motivationLevel: number; // 1-10
  stressLevel: number; // 1-10
  consistency: number; // 1-10
  progress: number; // 1-10
  lastWorkoutDate?: Date;
  currentPhase: CoachingPhase;
  recentAchievements: string[];
  // Additional properties for personality adaptation
  disciplineLevel?: number; // 1-10
  empathyLevel?: number; // 1-10
}

export interface CoachingPrompt {
  tone: CoachTone;
  message: string;
  context: CoachingContext;
  phase: CoachingPhase;
  priority: number; // 1-10, higher means more urgent
}

export interface PersonalityWeights {
  disciplined: number;
  motivational: number;
  technical: number;
  empathetic: number;
}

export interface PhasePersonality {
  initiation: PersonalityWeights;
  stagnation: PersonalityWeights;
  achievement: PersonalityWeights;
}

export interface ChatMaestroPersonality {
  coreIdentity: {
    disciplined: boolean;
    motivational: boolean;
    technical: boolean;
    empathetic: boolean;
  };
  adaptiveToneSystem: {
    disciplineMode: {
      whenToUse: string[];
      toneCharacteristics: string[];
    };
    empathyMode: {
      whenToUse: string[];
      toneCharacteristics: string[];
    };
    technicalMode: {
      whenToUse: string[];
      toneCharacteristics: string[];
    };
    motivationMode: {
      whenToUse: string[];
      toneCharacteristics: string[];
    };
  };
  phaseBasedStyles: PhasePersonality;
  communicationPrinciples: string[];
  forbiddenPatterns: string[];
}

export interface CoachingSession {
  userId: string;
  userState: UserState;
  context: CoachingContext;
  previousInteractions: CoachingPrompt[];
  recommendedApproach: {
    primaryTone: CoachTone;
    secondaryTone?: CoachTone;
    messageTemplate: string;
  };
}