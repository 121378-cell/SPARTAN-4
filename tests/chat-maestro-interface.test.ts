import { ChatMaestroInterfaceEngine } from '../lib/chat-maestro-interface-engine';
import { 
  ConversationContext, 
  ConversationMessage,
  SpartanView
} from '../lib/chat-maestro-interface-types';

describe('ChatMaestroInterfaceEngine', () => {
  let engine: ChatMaestroInterfaceEngine;
  let mockContext: ConversationContext;

  beforeEach(() => {
    engine = new ChatMaestroInterfaceEngine();
    
    const mockMessages: ConversationMessage[] = [
      {
        id: 'msg1',
        role: 'user',
        content: 'Show me my progress dashboard',
        timestamp: new Date()
      },
      {
        id: 'msg2',
        role: 'assistant',
        content: 'I can show you your progress metrics',
        timestamp: new Date()
      }
    ];

    mockContext = {
      currentTopic: 'progress',
      userIntent: 'view progress data',
      relevantDataPoints: ['strength_progress', 'workout_consistency', 'recovery_metrics'],
      conversationHistory: mockMessages
    };
  });

  describe('View Analysis', () => {
    it('should detect progress dashboard requests', () => {
      const request = engine.analyzeConversationContext(mockContext);
      
      expect(request).not.toBeNull();
      expect(request?.targetView.id).toBe('progress_dashboard');
    });

    it('should detect workout routine requests', () => {
      const workoutContext: ConversationContext = {
        ...mockContext,
        conversationHistory: [
          {
            id: 'msg1',
            role: 'user',
            content: "What's my workout routine for today?",
            timestamp: new Date()
          }
        ]
      };
      
      const request = engine.analyzeConversationContext(workoutContext);
      
      expect(request).not.toBeNull();
      expect(request?.targetView.id).toBe('workout_routine');
    });

    it('should detect recovery analytics requests', () => {
      const recoveryContext: ConversationContext = {
        ...mockContext,
        conversationHistory: [
          {
            id: 'msg1',
            role: 'user',
            content: 'How is my recovery looking this week?',
            timestamp: new Date()
          }
        ]
      };
      
      const request = engine.analyzeConversationContext(recoveryContext);
      
      expect(request).not.toBeNull();
      expect(request?.targetView.id).toBe('recovery_analytics');
    });
  });

  describe('Navigation', () => {
    it('should successfully navigate to a view', () => {
      const progressView = engine.getViewById('progress_dashboard');
      expect(progressView).toBeDefined();
      
      const request = {
        targetView: progressView!,
        contextData: { metrics: ['strength_progress'] },
        returnToConversation: true,
        overlayMode: true
      };
      
      const success = engine.navigateToView(request);
      expect(success).toBe(true);
      
      const state = engine.getCurrentState();
      expect(state.visualizationVisible).toBe(true);
      expect(state.currentView?.id).toBe('progress_dashboard');
    });

    it('should successfully return to conversation', () => {
      // First navigate to a view
      const progressView = engine.getViewById('progress_dashboard')!;
      const request = {
        targetView: progressView,
        contextData: { metrics: ['strength_progress'] },
        returnToConversation: true,
        overlayMode: true
      };
      
      engine.navigateToView(request);
      
      // Then return to conversation
      const success = engine.returnToConversation();
      expect(success).toBe(true);
      
      const state = engine.getCurrentState();
      expect(state.visualizationVisible).toBe(false);
      expect(state.conversationVisible).toBe(true);
      expect(state.currentView).toBeNull();
    });
  });

  describe('Settings Management', () => {
    it('should respect disabled visual redirection', () => {
      engine.updateSettings({
        enableVisualRedirection: false
      });
      
      const request = engine.analyzeConversationContext(mockContext);
      expect(request).toBeNull();
    });
  });
});