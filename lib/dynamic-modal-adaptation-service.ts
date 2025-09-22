// Dynamic Modal Adaptation Service for Spartan 4
// Automatically adapts modals based on context, results, and user preferences

import { SpartanModalService } from './spartan-modal-service';
import { wearableIntegrationService, WearableInsights } from './wearable-integration-service';
import { chatMaestroService } from './chat-maestro-service';
import { spartanNervousSystem } from './spartan-nervous-system';
import { storageManager } from './storage';
import {
  ModalContext,
  ModalActivationRequest,
  ModalActivationResponse
} from './spartan-modal-types';
import type { 
  RecoveryAnalysis, 
  WorkoutSession, 
  UserHabit,
  UserData
} from './types';

// Types for dynamic modal adaptation
export type ModalAdaptationStrategy = 'energy_based' | 'performance_based' | 'schedule_based' | 'context_aware';

export type ModalAdaptationRule = {
  id: string;
  name: string;
  description: string;
  strategy: ModalAdaptationStrategy;
  conditions: ModalAdaptationCondition[];
  actions: ModalAdaptationAction[];
  priority: number;
  enabled: boolean;
};

export type ModalAdaptationCondition = {
  type: 'energy_level' | 'recovery_score' | 'training_delay' | 'performance_plateau' | 'user_preference' | 'context';
  operator: 'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'neq';
  value: number | string | boolean;
  contextField?: string; // For context-based conditions
};

export type ModalAdaptationAction = {
  type: 'adjust_intensity' | 'reschedule_session' | 'modify_series' | 'change_duration' | 'suggest_alternative' | 'provide_explanation';
  value: number | string; // Percentage change or specific value
  targetModal?: string; // Specific modal to target, if applicable
  explanationTemplate?: string; // Template for Chat Maestro explanation
};

export type ModalAdaptationContext = {
  userId: string;
  currentEnergyLevel?: number;
  recoveryStatus?: RecoveryAnalysis;
  wearableInsights?: WearableInsights;
  recentWorkouts: WorkoutSession[];
  userHabits: UserHabit[];
  userData: UserData;
  currentScreen: string;
  systemContext: ModalContext;
};

export type AdaptedModal = {
  originalModalId: string;
  adaptedModalId: string;
  adaptationsApplied: ModalAdaptation[];
  explanation: string;
};

export type ModalAdaptation = {
  ruleId: string;
  action: ModalAdaptationAction;
  oldValue: any;
  newValue: any;
  confidence: number; // 0-1 scale
};

export class DynamicModalAdaptationService {
  private static instance: DynamicModalAdaptationService;
  private modalService: SpartanModalService;
  private adaptationRules: ModalAdaptationRule[];
  private adaptationHistory: Map<string, AdaptedModal[]> = new Map();
  
  static getInstance(): DynamicModalAdaptationService {
    if (!DynamicModalAdaptationService.instance) {
      DynamicModalAdaptationService.instance = new DynamicModalAdaptationService();
    }
    return DynamicModalAdaptationService.instance;
  }
  
  constructor() {
    this.modalService = new SpartanModalService();
    this.adaptationRules = this.initializeAdaptationRules();
  }
  
  /**
   * Initialize default adaptation rules
   */
  private initializeAdaptationRules(): ModalAdaptationRule[] {
    return [
      // Energy-based adaptations
      {
        id: 'low.energy_reduce_intensity',
        name: 'Reduce Intensity for Low Energy',
        description: 'Reduce workout intensity when user energy is low',
        strategy: 'energy_based',
        conditions: [
          { type: 'energy_level', operator: 'lt', value: 4 }
        ],
        actions: [
          { 
            type: 'adjust_intensity', 
            value: -25, 
            explanationTemplate: 'He detectado que tu energía está baja hoy. He reducido la intensidad del entrenamiento en un 25% para que puedas completarlo sin sobreexigirte.' 
          }
        ],
        priority: 10,
        enabled: true
      },
      {
        id: 'very_low.energy_reschedule',
        name: 'Reschedule for Very Low Energy',
        description: 'Suggest rescheduling when user energy is very low',
        strategy: 'energy_based',
        conditions: [
          { type: 'energy_level', operator: 'lt', value: 2 }
        ],
        actions: [
          { 
            type: 'suggest_alternative', 
            value: 'recovery_session', 
            explanationTemplate: 'Tu energía está muy baja para entrenar hoy. Te sugiero hacer una sesión de recuperación activa en su lugar.' 
          }
        ],
        priority: 15,
        enabled: true
      },
      
      // Recovery-based adaptations
      {
        id: 'poor_recovery_reduce_volume',
        name: 'Reduce Volume for Poor Recovery',
        description: 'Reduce workout volume when recovery is poor',
        strategy: 'performance_based',
        conditions: [
          { type: 'recovery_score', operator: 'lt', value: 50 }
        ],
        actions: [
          { 
            type: 'modify_series', 
            value: -30, 
            explanationTemplate: 'Tu puntuación de recuperación es baja. He reducido el volumen del entrenamiento en un 30% para proteger tu recuperación.' 
          }
        ],
        priority: 8,
        enabled: true
      },
      
      // Schedule-based adaptations
      {
        id: 'training_delay_reschedule',
        name: 'Reschedule for Training Delays',
        description: 'Reschedule and adjust series when training is delayed',
        strategy: 'schedule_based',
        conditions: [
          { type: 'training_delay', operator: 'gt', value: 2 }
        ],
        actions: [
          { 
            type: 'reschedule_session', 
            value: 'next_available_slot', 
            explanationTemplate: 'Has retrasado tu entrenamiento por más de 2 días. He reprogramado la sesión y ajustado las series para mantenerte en el camino correcto.' 
          },
          { 
            type: 'modify_series', 
            value: -20, 
            explanationTemplate: 'Para compensar el retraso, he reducido las series en un 20% para evitar sobrecargar tu cuerpo.' 
          }
        ],
        priority: 7,
        enabled: true
      },
      
      // Performance-based adaptations
      {
        id: 'performance_plateau_adjust',
        name: 'Adjust for Performance Plateau',
        description: 'Modify training when performance plateaus are detected',
        strategy: 'performance_based',
        conditions: [
          { type: 'performance_plateau', operator: 'eq', value: true }
        ],
        actions: [
          { 
            type: 'adjust_intensity', 
            value: 10, 
            explanationTemplate: 'He detectado un estancamiento en tu progreso. He ajustado la intensidad para romper esta meseta.' 
          },
          { 
            type: 'change_duration', 
            value: 15, 
            explanationTemplate: 'Para estimular nuevas adaptaciones, he aumentado la duración del entrenamiento en 15 minutos.' 
          }
        ],
        priority: 5,
        enabled: true
      },
      
      // Context-aware adaptations
      {
        id: 'context_evening_training',
        name: 'Evening Training Adaptation',
        description: 'Adjust training for evening sessions',
        strategy: 'context_aware',
        conditions: [
          { type: 'context', operator: 'eq', value: 'evening', contextField: 'time_of_day' }
        ],
        actions: [
          { 
            type: 'adjust_intensity', 
            value: -15, 
            explanationTemplate: 'Como estás entrenando en la tarde, he reducido la intensidad para evitar afectar tu sueño.' 
          },
          { 
            type: 'change_duration', 
            value: -20, 
            explanationTemplate: 'Para no interferir con tu descanso nocturno, he reducido la duración del entrenamiento en 20 minutos.' 
          }
        ],
        priority: 3,
        enabled: true
      }
    ];
  }
  
  /**
   * Adapt modals based on current context and user state
   */
  async adaptModalsForContext(context: ModalAdaptationContext): Promise<AdaptedModal[]> {
    console.log('🤖 Adapting modals for context:', context.userId);
    
    const adaptedModals: AdaptedModal[] = [];
    
    // Get compatible modals for current context
    const compatibleModals = this.modalService.getCompatibleModals(context.systemContext);
    
    // Apply adaptation rules to each compatible modal
    for (const modalId of compatibleModals) {
      const adaptations = await this.applyAdaptationRules(modalId, context);
      
      if (adaptations.length > 0) {
        // Create adapted modal
        const adaptedModal: AdaptedModal = {
          originalModalId: modalId,
          adaptedModalId: `${modalId}_adapted_${Date.now()}`,
          adaptationsApplied: adaptations,
          explanation: this.generateAdaptationExplanation(adaptations)
        };
        
        adaptedModals.push(adaptedModal);
        
        // Store adaptation history
        this.storeAdaptationHistory(context.userId, adaptedModal);
        
        // Notify the nervous system of modal adaptation
        spartanNervousSystem.emitEvent({
          type: 'modal_activated', // Using existing event type
          timestamp: new Date(),
          userId: context.userId,
          payload: {
            adaptedModal,
            context
          },
          sourceModule: 'DynamicModalAdaptationService',
          priority: 'medium'
        });
      }
    }
    
    return adaptedModals;
  }
  
  /**
   * Apply adaptation rules to a specific modal
   */
  private async applyAdaptationRules(modalId: string, context: ModalAdaptationContext): Promise<ModalAdaptation[]> {
    const adaptations: ModalAdaptation[] = [];
    
    // Sort rules by priority
    const sortedRules = [...this.adaptationRules]
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority);
    
    // Apply each rule
    for (const rule of sortedRules) {
      if (await this.evaluateRuleConditions(rule, context)) {
        for (const action of rule.actions) {
          const adaptation = await this.executeAdaptationAction(modalId, action, context);
          if (adaptation) {
            // Set the rule ID for tracking
            adaptation.ruleId = rule.id;
            adaptations.push(adaptation);
          }
        }
      }
    }
    
    return adaptations;
  }
  
  /**
   * Evaluate if rule conditions are met
   */
  private async evaluateRuleConditions(rule: ModalAdaptationRule, context: ModalAdaptationContext): Promise<boolean> {
    for (const condition of rule.conditions) {
      let conditionMet = false;
      
      switch (condition.type) {
        case 'energy_level':
          if (context.currentEnergyLevel !== undefined) {
            conditionMet = this.evaluateCondition(context.currentEnergyLevel, condition.operator, condition.value);
          }
          break;
          
        case 'recovery_score':
          if (context.recoveryStatus?.recoveryScore !== undefined) {
            conditionMet = this.evaluateCondition(context.recoveryStatus.recoveryScore, condition.operator, condition.value);
          }
          break;
          
        case 'training_delay':
          const delayDays = this.calculateTrainingDelay(context.recentWorkouts);
          conditionMet = this.evaluateCondition(delayDays, condition.operator, condition.value);
          break;
          
        case 'performance_plateau':
          const hasPlateau = this.detectPerformancePlateau(context.recentWorkouts);
          conditionMet = this.evaluateCondition(hasPlateau, condition.operator, condition.value);
          break;
          
        case 'user_preference':
          // This would check user preferences from storage
          conditionMet = true; // Placeholder
          break;
          
        case 'context':
          if (condition.contextField) {
            const contextValue = (context.systemContext as any)[condition.contextField];
            conditionMet = this.evaluateCondition(contextValue, condition.operator, condition.value);
          }
          break;
      }
      
      if (!conditionMet) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate a condition
   */
  private evaluateCondition(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'lt': return actual < expected;
      case 'lte': return actual <= expected;
      case 'gt': return actual > expected;
      case 'gte': return actual >= expected;
      case 'eq': return actual === expected;
      case 'neq': return actual !== expected;
      default: return false;
    }
  }
  
  /**
   * Execute an adaptation action
   */
  private async executeAdaptationAction(
    modalId: string, 
    action: ModalAdaptationAction, 
    context: ModalAdaptationContext
  ): Promise<ModalAdaptation | null> {
    // Get the original modal
    const modalRegistry = this.modalService.getRegistry();
    const originalModal = modalRegistry[modalId];
    
    if (!originalModal) {
      console.warn(`Modal ${modalId} not found in registry`);
      return null;
    }
    
    // Clone the modal to avoid mutating the original
    const adaptedModal = JSON.parse(JSON.stringify(originalModal));
    
    let oldValue: any = null;
    let newValue: any = null;
    let ruleId = 'unknown_rule';
    
    // Apply the adaptation based on action type
    switch (action.type) {
      case 'adjust_intensity':
        oldValue = adaptedModal.metadata.intensity || 'medium';
        // Adjust intensity based on percentage value
        adaptedModal.metadata.intensity = this.adjustIntensity(oldValue, action.value as number);
        newValue = adaptedModal.metadata.intensity;
        break;
        
      case 'modify_series':
        oldValue = adaptedModal.metadata.series || 3;
        // Adjust series based on percentage value
        adaptedModal.metadata.series = Math.max(1, Math.round(oldValue * (1 + (action.value as number) / 100)));
        newValue = adaptedModal.metadata.series;
        break;
        
      case 'change_duration':
        oldValue = adaptedModal.metadata.duration || 60;
        // Adjust duration based on minutes value
        adaptedModal.metadata.duration = Math.max(5, oldValue + (action.value as number));
        newValue = adaptedModal.metadata.duration;
        break;
        
      case 'reschedule_session':
        oldValue = adaptedModal.metadata.scheduledTime || new Date();
        // Reschedule to next available slot
        adaptedModal.metadata.scheduledTime = this.calculateNextAvailableSlot(oldValue);
        newValue = adaptedModal.metadata.scheduledTime;
        break;
        
      case 'suggest_alternative':
        oldValue = adaptedModal.id;
        // Suggest alternative modal
        adaptedModal.id = `${modalId}_alternative`;
        adaptedModal.name = `Alternative: ${adaptedModal.name}`;
        newValue = adaptedModal.id;
        break;
        
      default:
        console.warn(`Unknown adaptation action type: ${action.type}`);
        return null;
    }
    
    const adaptation: ModalAdaptation = {
      ruleId,
      action,
      oldValue,
      newValue,
      confidence: 0.9 // High confidence for rule-based adaptations
    };
    
    console.log(`🔧 Executing adaptation action: ${action.type} with value ${action.value} on modal ${modalId}`);
    
    // Notify Chat Maestro of the adaptation with explanation
    this.notifyChatMaestroOfAdaptation(adaptation, context);
    
    return adaptation;
  }
  
  /**
   * Adjust intensity level based on percentage change
   */
  private adjustIntensity(currentIntensity: string, percentageChange: number): string {
    const intensityLevels = ['very_low', 'low', 'medium', 'high', 'very_high'];
    const currentIndex = intensityLevels.indexOf(currentIntensity);
    
    if (currentIndex === -1) {
      // Default to medium if current intensity is not recognized
      return 'medium';
    }
    
    // Calculate new index based on percentage change
    // For simplicity, we'll map percentage to index changes
    const indexChange = Math.round(percentageChange / 20); // 20% per level
    const newIndex = Math.max(0, Math.min(intensityLevels.length - 1, currentIndex + indexChange));
    
    return intensityLevels[newIndex];
  }
  
  /**
   * Calculate next available slot for rescheduling
   */
  private calculateNextAvailableSlot(currentTime: Date): Date {
    // For now, we'll just add 1 day
    const nextSlot = new Date(currentTime);
    nextSlot.setDate(nextSlot.getDate() + 1);
    return nextSlot;
  }
  
  /**
   * Notify Chat Maestro of a modal adaptation
   */
  private notifyChatMaestroOfAdaptation(adaptation: ModalAdaptation, context: ModalAdaptationContext): void {
    // Generate explanation for the adaptation
    const explanation = this.generateAdaptationExplanation([adaptation]);
    
    if (explanation) {
      // In a real implementation, this would communicate with Chat Maestro
      console.log(`💬 Notifying Chat Maestro of adaptation: ${adaptation.action.type}`);
      console.log(`📝 Explanation: ${explanation}`);
      
      // Here we would actually call Chat Maestro to provide the explanation to the user
      // For example:
      // chatMaestroService.provideAdaptationExplanation(explanation, context.userId);
    }
  }
  
  /**
   * Calculate training delay in days
   */
  private calculateTrainingDelay(recentWorkouts: WorkoutSession[]): number {
    if (recentWorkouts.length === 0) return 0;
    
    // Sort workouts by date (most recent first)
    const sortedWorkouts = [...recentWorkouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const lastWorkoutDate = new Date(sortedWorkouts[0].date);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  /**
   * Detect performance plateau
   */
  private detectPerformancePlateau(recentWorkouts: WorkoutSession[]): boolean {
    if (recentWorkouts.length < 4) return false;
    
    // Sort workouts by date (oldest first)
    const sortedWorkouts = [...recentWorkouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Get last 4 workouts
    const lastWorkouts = sortedWorkouts.slice(-4);
    
    // Calculate average performance (simplified)
    const performances = lastWorkouts.map(workout => {
      // Simplified performance calculation based on duration and exercises
      return workout.duration || 0;
    });
    
    // Check if performance has plateaued (no significant change)
    const avgPerformance = performances.reduce((sum, p) => sum + p, 0) / performances.length;
    const performanceVariance = performances.reduce((sum, p) => sum + Math.pow(p - avgPerformance, 2), 0) / performances.length;
    
    // If variance is very low, we consider it a plateau
    return performanceVariance < 10;
  }
  
  /**
   * Generate explanation for adaptations
   */
  private generateAdaptationExplanation(adaptations: ModalAdaptation[]): string {
    if (adaptations.length === 0) return '';
    
    // Combine explanations from all adaptations
    const explanations = adaptations
      .map(adaptation => {
        // Use the explanation template from the action if available
        if (adaptation.action.explanationTemplate) {
          return adaptation.action.explanationTemplate;
        }
        
        // Generate a default explanation based on the adaptation
        switch (adaptation.action.type) {
          case 'adjust_intensity':
            return `He ajustado la intensidad del entrenamiento de ${adaptation.oldValue} a ${adaptation.newValue} basado en tu contexto actual.`;
          case 'modify_series':
            return `He modificado el número de series de ${adaptation.oldValue} a ${adaptation.newValue} para optimizar tu entrenamiento.`;
          case 'change_duration':
            return `He cambiado la duración del entrenamiento de ${adaptation.oldValue} a ${adaptation.newValue} minutos.`;
          case 'reschedule_session':
            return `He reprogramado la sesión para una mejor adaptación a tu disponibilidad.`;
          case 'suggest_alternative':
            return `Te sugiero una alternativa más adecuada para tu contexto actual.`;
          default:
            return `He realizado una adaptación en el modal para mejorarlo.`;
        }
      })
      .filter(explanation => explanation.length > 0);
    
    return explanations.join(' ');
  }
  
  /**
   * Store adaptation history for a user
   */
  private storeAdaptationHistory(userId: string, adaptedModal: AdaptedModal): void {
    if (!this.adaptationHistory.has(userId)) {
      this.adaptationHistory.set(userId, []);
    }
    
    const userHistory = this.adaptationHistory.get(userId) || [];
    userHistory.push(adaptedModal);
    
    // Limit history to last 50 adaptations
    if (userHistory.length > 50) {
      userHistory.splice(0, userHistory.length - 50);
    }
    
    this.adaptationHistory.set(userId, userHistory);
  }
  
  /**
   * Get adaptation history for a user
   */
  getAdaptationHistory(userId: string): AdaptedModal[] {
    return this.adaptationHistory.get(userId) || [];
  }
  
  /**
   * Add a new adaptation rule
   */
  addAdaptationRule(rule: ModalAdaptationRule): void {
    this.adaptationRules.push(rule);
  }
  
  /**
   * Update an existing adaptation rule
   */
  updateAdaptationRule(ruleId: string, updates: Partial<ModalAdaptationRule>): void {
    const ruleIndex = this.adaptationRules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex !== -1) {
      this.adaptationRules[ruleIndex] = { ...this.adaptationRules[ruleIndex], ...updates };
    }
  }
  
  /**
   * Remove an adaptation rule
   */
  removeAdaptationRule(ruleId: string): void {
    this.adaptationRules = this.adaptationRules.filter(rule => rule.id !== ruleId);
  }
  
  /**
   * Get all adaptation rules
   */
  getAdaptationRules(): ModalAdaptationRule[] {
    return [...this.adaptationRules];
  }
  
  /**
   * Enable or disable an adaptation rule
   */
  setRuleEnabled(ruleId: string, enabled: boolean): void {
    const rule = this.adaptationRules.find(rule => rule.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
    }
  }
}

export const dynamicModalAdaptationService = DynamicModalAdaptationService.getInstance();