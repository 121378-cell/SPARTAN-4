import { SpartanModalEngine } from '../lib/spartan-modal-engine';
import { 
  SpartanModal,
  ModalContext
} from '../lib/spartan-modal-types';

describe('SpartanModalEngine', () => {
  let engine: SpartanModalEngine;
  let mockTrainingModal: SpartanModal;
  let mockNutritionModal: SpartanModal;
  let mockRecoveryModal: SpartanModal;

  beforeEach(() => {
    engine = new SpartanModalEngine();
    
    mockTrainingModal = {
      id: 'training_v1',
      name: 'Training Modal',
      version: '1.0.0',
      description: 'Workout planning and execution modal',
      category: 'training',
      capabilities: ['workout_planning', 'exercise_demonstration', 'form_correction'],
      dependencies: [],
      enabled: true,
      priority: 9,
      activationTriggers: [
        /\b(workout|exercise|training|routine|plan)\b/i,
        /\b(lift|squats|deadlifts|bench press)\b/i
      ],
      requiredPermissions: ['workout_data_access'],
      supportedPlatforms: ['web', 'mobile'],
      metadata: {
        author: 'Training Team',
        createdAt: new Date(),
        lastUpdated: new Date(),
        compatibility: ['spartan_4.x'],
        integrationType: 'embedded'
      }
    };

    mockNutritionModal = {
      id: 'nutrition_v1',
      name: 'Nutrition Modal',
      version: '1.0.0',
      description: 'Nutrition planning and tracking modal',
      category: 'nutrition',
      capabilities: ['meal_planning', 'macro_tracking', 'supplement_advice'],
      dependencies: [],
      enabled: true,
      priority: 8,
      activationTriggers: [
        /\b(nutrition|diet|macros|calories|protein)\b/i,
        /\b(meal|food|eating|supplements)\b/i
      ],
      requiredPermissions: ['nutrition_data_access'],
      supportedPlatforms: ['web', 'mobile'],
      metadata: {
        author: 'Nutrition Team',
        createdAt: new Date(),
        lastUpdated: new Date(),
        compatibility: ['spartan_4.x'],
        integrationType: 'embedded'
      }
    };

    mockRecoveryModal = {
      id: 'recovery_v1',
      name: 'Recovery Modal',
      version: '1.0.0',
      description: 'Recovery and sleep optimization modal',
      category: 'recovery',
      capabilities: ['sleep_tracking', 'recovery_planning', 'stress_management'],
      dependencies: [],
      enabled: true,
      priority: 7,
      activationTriggers: [
        /\b(recovery|sleep|rest|fatigue|stress)\b/i,
        /\b(rest days|recovery plan|sleep quality)\b/i
      ],
      requiredPermissions: ['recovery_data_access'],
      supportedPlatforms: ['web', 'mobile', 'wearable'],
      metadata: {
        author: 'Recovery Team',
        createdAt: new Date(),
        lastUpdated: new Date(),
        compatibility: ['spartan_4.x'],
        integrationType: 'embedded'
      }
    };
  });

  describe('Modal Registration', () => {
    it('should register a new modal', () => {
      const result = engine.registerModal(mockTrainingModal);
      expect(result).toBe(true);
      
      const registry = engine.getRegistry();
      expect(registry[mockTrainingModal.id]).toBeDefined();
      expect(registry[mockTrainingModal.id].name).toBe('Training Modal');
    });

    it('should reject invalid modal modules', () => {
      const invalidModal = { ...mockTrainingModal, id: '' };
      const result = engine.registerModal(invalidModal as any);
      expect(result).toBe(false);
    });

    it('should unregister a modal', () => {
      engine.registerModal(mockTrainingModal);
      const result = engine.unregisterModal(mockTrainingModal.id);
      expect(result).toBe(true);
      
      const registry = engine.getRegistry();
      expect(registry[mockTrainingModal.id]).toBeUndefined();
    });
  });

  describe('Modal Activation', () => {
    beforeEach(() => {
      engine.registerModal(mockTrainingModal);
      engine.registerModal(mockNutritionModal);
      engine.registerModal(mockRecoveryModal);
    });

    it('should activate a modal based on context', () => {
      const context: ModalContext = {
        userId: 'user123',
        conversationTopic: 'workout planning for next week',
        userIntent: 'create training routine',
        relevantDataPoints: ['strength_goals', 'available_equipment'],
        activeModals: [],
        activationHistory: [],
        systemLoad: {
          cpuUsage: 20,
          memoryUsage: 30,
          networkUsage: 10
        },
        platform: 'web'
      };

      const compatible = engine.getCompatibleModals(context);
      expect(compatible).toContain('training_v1');
    });

    it('should activate a modal', () => {
      const request: any = {
        modalId: 'training_v1',
        context: {
          userId: 'user123',
          conversationTopic: 'workout planning',
          userIntent: 'exercise routine',
          relevantDataPoints: [],
          activeModals: [],
          activationHistory: [],
          systemLoad: {
            cpuUsage: 20,
            memoryUsage: 30,
            networkUsage: 10
          },
          platform: 'web' as const
        },
        priority: 'high' as const,
        reason: 'User requested workout planning',
        requiredResources: {
          memory: 100,
          cpu: 5,
          network: 2
        }
      };

      const response = engine.activateModal(request as any);
      expect(response.success).toBe(true);
      expect(response.activated).toBe(true);
      
      const active = engine.getActiveModals();
      expect(active).toContain('training_v1');
    });
  });

  describe('Cross-Modal Communication', () => {
    beforeEach(() => {
      engine.registerModal(mockTrainingModal);
      engine.registerModal(mockNutritionModal);
    });

    it('should send messages between modals', () => {
      const result = engine.sendCrossModalMessage(
        'training_v1',
        'nutrition_v1',
        'post_workout_nutrition',
        { protein_needed: 30, timing: 'within 30 minutes' },
        true
      );
      
      expect(result).toBe(true);
      
      const log = engine.getCommunicationLog();
      expect(log.length).toBe(1);
      expect(log[0].sender).toBe('training_v1');
      expect(log[0].receiver).toBe('nutrition_v1');
      expect(log[0].message).toBe('post_workout_nutrition');
    });
  });

  describe('Analytics and Performance', () => {
    it('should track performance metrics', () => {
      engine.registerModal(mockTrainingModal);
      
      const metrics = engine.getPerformanceMetrics('training_v1') as any;
      expect(metrics).toBeDefined();
      expect(metrics.modalId).toBe('training_v1');
    });

    it('should provide system analytics', () => {
      const analytics = engine.getAnalytics();
      expect(analytics).toBeDefined();
      expect(analytics.totalModals).toBe(0);
      expect(analytics.activeModals).toBe(0);
    });
  });
});