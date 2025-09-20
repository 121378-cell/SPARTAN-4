import { ChatMaestroScalabilityEngine } from '../lib/chat-maestro-scalability-engine';
import { 
  CompetencyModule,
  CompetencyContext
} from '../lib/chat-maestro-scalability-types';

describe('ChatMaestroScalabilityEngine', () => {
  let engine: ChatMaestroScalabilityEngine;
  let mockFisioterapiaModule: CompetencyModule;
  let mockPsicologiaModule: CompetencyModule;
  let mockMeditacionModule: CompetencyModule;

  beforeEach(() => {
    engine = new ChatMaestroScalabilityEngine();
    
    mockFisioterapiaModule = {
      id: 'fisioterapia_v1',
      name: 'Fisioterapia',
      version: '1.0.0',
      description: 'Injury prevention and rehabilitation protocols',
      domain: 'health',
      capabilities: ['injury_prevention', 'movement_analysis', 'pain_management'],
      dependencies: [],
      enabled: true,
      priority: 8,
      activationTriggers: [
        /\b(injury|pain|rehabilitat|movement)\b/i,
        /\b(fisio|physical therapy|recovery)\b/i
      ],
      requiredPermissions: ['health_data_access'],
      metadata: {
        author: 'Medical Team',
        createdAt: new Date(),
        lastUpdated: new Date(),
        compatibility: ['chat_maestro_4.x']
      }
    };

    mockPsicologiaModule = {
      id: 'psicologia_deportiva_v1',
      name: 'Psicología Deportiva',
      version: '1.0.0',
      description: 'Mental performance enhancement techniques',
      domain: 'psychology',
      capabilities: ['mental_performance', 'stress_management', 'goal_setting'],
      dependencies: [],
      enabled: true,
      priority: 7,
      activationTriggers: [
        /\b(mind|mental|focus|concentration|stress|anxiety)\b/i,
        /\b(psychology|mental coach|sport psychology)\b/i
      ],
      requiredPermissions: ['psychological_data_access'],
      metadata: {
        author: 'Psychology Team',
        createdAt: new Date(),
        lastUpdated: new Date(),
        compatibility: ['chat_maestro_4.x']
      }
    };

    mockMeditacionModule = {
      id: 'meditacion_v1',
      name: 'Meditación',
      version: '1.0.0',
      description: 'Mindfulness practices for athletes',
      domain: 'wellness',
      capabilities: ['mindfulness', 'breathing_techniques', 'relaxation'],
      dependencies: [],
      enabled: true,
      priority: 6,
      activationTriggers: [
        /\b(meditation|mindfulness|breath|relaxation)\b/i,
        /\b(calm|peace|zen|inner peace)\b/i
      ],
      requiredPermissions: ['wellness_data_access'],
      metadata: {
        author: 'Wellness Team',
        createdAt: new Date(),
        lastUpdated: new Date(),
        compatibility: ['chat_maestro_4.x']
      }
    };
  });

  describe('Competency Registration', () => {
    it('should register a new competency module', () => {
      const result = engine.registerCompetency(mockFisioterapiaModule);
      expect(result).toBe(true);
      
      const registry = engine.getRegistry();
      expect(registry[mockFisioterapiaModule.id]).toBeDefined();
      expect(registry[mockFisioterapiaModule.id].name).toBe('Fisioterapia');
    });

    it('should reject invalid competency modules', () => {
      const invalidModule = { ...mockFisioterapiaModule, id: '' };
      const result = engine.registerCompetency(invalidModule as any);
      expect(result).toBe(false);
    });

    it('should unregister a competency module', () => {
      engine.registerCompetency(mockFisioterapiaModule);
      const result = engine.unregisterCompetency(mockFisioterapiaModule.id);
      expect(result).toBe(true);
      
      const registry = engine.getRegistry();
      expect(registry[mockFisioterapiaModule.id]).toBeUndefined();
    });
  });

  describe('Competency Activation', () => {
    beforeEach(() => {
      engine.registerCompetency(mockFisioterapiaModule);
      engine.registerCompetency(mockPsicologiaModule);
      engine.registerCompetency(mockMeditacionModule);
    });

    it('should activate a competency based on context', () => {
      const context: CompetencyContext = {
        userId: 'user123',
        conversationTopic: 'knee pain during squats',
        userIntent: 'injury prevention',
        relevantDataPoints: ['knee_pain', 'squat_form'],
        currentCompetencies: [],
        activationHistory: [],
        systemLoad: {
          cpuUsage: 20,
          memoryUsage: 30,
          networkUsage: 10
        }
      };

      const compatible = engine.getCompatibleCompetencies(context);
      expect(compatible).toContain('fisioterapia_v1');
    });

    it('should activate a competency', () => {
      const request = {
        competencyId: 'fisioterapia_v1',
        context: {
          userId: 'user123',
          conversationTopic: 'injury prevention',
          userIntent: 'movement analysis',
          relevantDataPoints: [],
          currentCompetencies: [],
          activationHistory: [],
          systemLoad: {
            cpuUsage: 20,
            memoryUsage: 30,
            networkUsage: 10
          }
        },
        priority: 'high' as const,
        reason: 'User requested injury prevention advice',
        requiredResources: {
          memory: 100,
          cpu: 5,
          network: 2
        }
      };

      const response = engine.activateCompetency(request);
      expect(response.success).toBe(true);
      expect(response.activated).toBe(true);
      
      const active = engine.getActiveCompetencies();
      expect(active).toContain('fisioterapia_v1');
    });
  });

  describe('Cross-Competency Communication', () => {
    beforeEach(() => {
      engine.registerCompetency(mockFisioterapiaModule);
      engine.registerCompetency(mockPsicologiaModule);
    });

    it('should send messages between competencies', () => {
      const result = engine.sendCrossCompetencyMessage(
        'fisioterapia_v1',
        'psicologia_deportiva_v1',
        'injury_recovery_plan',
        { recoveryTime: '4 weeks', mental_preparation_needed: true },
        true
      );
      
      expect(result).toBe(true);
      
      const log = engine.getCommunicationLog();
      expect(log.length).toBe(1);
      expect(log[0].sender).toBe('fisioterapia_v1');
      expect(log[0].receiver).toBe('psicologia_deportiva_v1');
      expect(log[0].message).toBe('injury_recovery_plan');
    });
  });

  describe('Analytics and Performance', () => {
    it('should track performance metrics', () => {
      engine.registerCompetency(mockFisioterapiaModule);
      
      const metrics = engine.getPerformanceMetrics('fisioterapia_v1') as any;
      expect(metrics).toBeDefined();
      expect(metrics.competencyId).toBe('fisioterapia_v1');
    });

    it('should provide system analytics', () => {
      const analytics = engine.getAnalytics();
      expect(analytics).toBeDefined();
      expect(analytics.totalCompetencies).toBe(0);
      expect(analytics.activeCompetencies).toBe(0);
    });
  });
});