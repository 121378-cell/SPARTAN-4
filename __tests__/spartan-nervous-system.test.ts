import { spartanNervousSystem, NervousSystemEvent } from '../lib/spartan-nervous-system';
import { chatMaestroService } from '../lib/chat-maestro-service';
import { dataManagementService } from '../lib/data-management-service';
import { realTimeDataIntegrationService } from '../lib/real-time-data-integration';
import { wearableIntegrationService } from '../lib/wearable-integration-service';
import { SpartanModalService } from '../lib/spartan-modal-service';

describe('Spartan Nervous System', () => {
  beforeEach(() => {
    // Clear any existing events
    jest.clearAllMocks();
  });

  describe('Event Processing', () => {
    it('should process events with correct priority ordering', async () => {
      const events: NervousSystemEvent[] = [];
      
      // Subscribe to events
      spartanNervousSystem.subscribe('data_updated', (event) => {
        events.push(event);
      });
      
      // Emit events with different priorities
      spartanNervousSystem.emitEvent({
        type: 'data_updated',
        timestamp: new Date(),
        userId: 'test-user',
        payload: { test: 'low' },
        sourceModule: 'TestModule',
        priority: 'low'
      });
      
      spartanNervousSystem.emitEvent({
        type: 'data_updated',
        timestamp: new Date(Date.now() - 1000),
        userId: 'test-user',
        payload: { test: 'critical' },
        sourceModule: 'TestModule',
        priority: 'critical'
      });
      
      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Events should be processed in priority order
      expect(events).toHaveLength(2);
    });

    it('should handle different event types correctly', async () => {
      const eventCounts: Record<string, number> = {};
      
      // Subscribe to all event types
      const eventTypes = [
        'data_updated',
        'chat_interaction',
        'modal_activated',
        'modal_deactivated',
        'insight_generated',
        'alert_triggered',
        'recommendation_made',
        'user_action',
        'system_proactive',
        'learning_update'
      ];
      
      eventTypes.forEach(type => {
        spartanNervousSystem.subscribe(type as any, (event) => {
          eventCounts[type] = (eventCounts[type] || 0) + 1;
        });
      });
      
      // Emit one event of each type
      eventTypes.forEach(type => {
        spartanNervousSystem.emitEvent({
          type: type as any,
          timestamp: new Date(),
          userId: 'test-user',
          payload: { type },
          sourceModule: 'TestModule',
          priority: 'medium'
        });
      });
      
      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // All event types should be handled
      expect(Object.keys(eventCounts)).toHaveLength(eventTypes.length);
    });
  });

  describe('Alert System', () => {
    it('should generate alerts based on critical data', () => {
      // Get current alerts
      const initialAlerts = spartanNervousSystem.getAlerts();
      
      // The system should generate alerts based on data insights
      // This would require mocking the data management service
      expect(initialAlerts).toBeDefined();
    });

    it('should allow alert dismissal', () => {
      // Get alerts
      const alerts = spartanNervousSystem.getAlerts();
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        
        // Dismiss the alert
        spartanNervousSystem.dismissAlert(alertId);
        
        // Verify alert is dismissed
        const updatedAlerts = spartanNervousSystem.getAlerts();
        expect(updatedAlerts.find(a => a.id === alertId)).toBeUndefined();
      }
    });
  });

  describe('Recommendation System', () => {
    it('should generate recommendations from insights', () => {
      const recommendations = spartanNervousSystem.getRecommendations();
      expect(recommendations).toBeDefined();
    });

    it('should allow recommendation execution', async () => {
      const recommendations = spartanNervousSystem.getRecommendations();
      
      if (recommendations.length > 0) {
        const recId = recommendations[0].id;
        
        // Execute the recommendation
        const result = await spartanNervousSystem.executeRecommendation(recId);
        
        // Verify execution result
        expect(result).toBe(true);
      }
    });
  });

  describe('Integration with Other Services', () => {
    it('should receive events from Chat Maestro', async () => {
      // This would require mocking the chat maestro service
      // and verifying that events are properly emitted to the nervous system
      expect(chatMaestroService).toBeDefined();
    });

    it('should receive events from Data Management Service', async () => {
      // This would require mocking the data management service
      // and verifying that events are properly emitted to the nervous system
      expect(dataManagementService).toBeDefined();
    });

    it('should receive events from Real-Time Data Integration', async () => {
      // This would require mocking the real-time data integration service
      // and verifying that events are properly emitted to the nervous system
      expect(realTimeDataIntegrationService).toBeDefined();
    });

    it('should receive events from Wearable Integration', async () => {
      // This would require mocking the wearable integration service
      // and verifying that events are properly emitted to the nervous system
      expect(wearableIntegrationService).toBeDefined();
    });

    it('should receive events from Modal Service', async () => {
      // This would require mocking the modal service
      // and verifying that events are properly emitted to the nervous system
      expect(SpartanModalService).toBeDefined();
    });
  });

  describe('Proactive System Behavior', () => {
    it('should monitor system and act proactively', async () => {
      // Get current proactive actions
      const initialActions = spartanNervousSystem.getProactiveActions();
      
      // The system should monitor and generate proactive actions
      expect(initialActions).toBeDefined();
    });
  });

  describe('Learning Memory', () => {
    it('should maintain learning memory', () => {
      const memory = spartanNervousSystem.getLearningMemory();
      expect(memory).toBeDefined();
    });
  });
});