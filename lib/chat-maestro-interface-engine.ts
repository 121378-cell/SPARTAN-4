// Interface integration engine for Chat Maestro

import {
  SpartanView,
  ViewNavigationRequest,
  ConversationContext,
  RedirectionTrigger,
  HybridViewComponent,
  UserInterfaceState,
  InterfaceEvent,
  InterfaceIntegrationSettings
} from './chat-maestro-interface-types';

export class ChatMaestroInterfaceEngine {
  private views: SpartanView[] = [];
  private triggers: RedirectionTrigger[] = [];
  private settings: InterfaceIntegrationSettings;
  private currentState: UserInterfaceState;
  private eventHistory: InterfaceEvent[] = [];
  private hybridComponents: HybridViewComponent[] = [];

  constructor(settings?: InterfaceIntegrationSettings) {
    this.settings = settings || this.getDefaultSettings();
    this.currentState = this.initializeState();
    this.initializeViews();
    this.initializeTriggers();
  }

  private getDefaultSettings(): InterfaceIntegrationSettings {
    return {
      enableVisualRedirection: true,
      defaultViewMode: 'drawer',
      autoReturnToConversation: true,
      conversationOverlayOpacity: 0.9,
      quickActionButtons: true,
      voiceCommandIntegration: false
    };
  }

  private initializeState(): UserInterfaceState {
    return {
      currentView: null,
      conversationVisible: true,
      visualizationVisible: false,
      overlayActive: false,
      quickActionsVisible: true,
      lastInteractionTimestamp: new Date()
    };
  }

  private initializeViews(): void {
    this.views = [
      {
        id: 'progress_dashboard',
        name: 'Progress Dashboard',
        path: '/dashboard/progress',
        icon: 'chart-line',
        description: 'View your training progress and performance metrics'
      },
      {
        id: 'workout_routine',
        name: 'Workout Routine',
        path: '/workouts/today',
        icon: 'dumbbell',
        description: 'View your current workout routine and exercises'
      },
      {
        id: 'recovery_analytics',
        name: 'Recovery Analytics',
        path: '/recovery/analytics',
        icon: 'heart',
        description: 'Monitor your recovery metrics and sleep quality'
      },
      {
        id: 'nutrition_tracking',
        name: 'Nutrition Tracking',
        path: '/nutrition/tracking',
        icon: 'utensils',
        description: 'Track your nutrition and macronutrient intake'
      },
      {
        id: 'workout_history',
        name: 'Workout History',
        path: '/workouts/history',
        icon: 'history',
        description: 'Review your past workout sessions'
      },
      {
        id: 'goal_tracking',
        name: 'Goal Tracking',
        path: '/goals/tracking',
        icon: 'bullseye',
        description: 'Track progress toward your fitness goals'
      }
    ];
  }

  private initializeTriggers(): void {
    this.triggers = [
      // Progress Dashboard triggers
      {
        id: 'progress_request',
        pattern: /\b(show|display|view).*\b(progress|stats|metrics|performance)\b/i,
        view: this.views.find(v => v.id === 'progress_dashboard')!,
        confidenceThreshold: 80
      },
      {
        id: 'stats_request',
        pattern: /\b(how am i doing|my stats|performance report)\b/i,
        view: this.views.find(v => v.id === 'progress_dashboard')!,
        confidenceThreshold: 90
      },

      // Workout Routine triggers
      {
        id: 'routine_request',
        pattern: /\b(show|display|view).*\b(routine|workout|exercise|plan)\b/i,
        view: this.views.find(v => v.id === 'workout_routine')!,
        confidenceThreshold: 85
      },
      {
        id: 'workout_today',
        pattern: /\b(today'?s workout|what'?s next|current routine|workout routine for today)\b/i,
        view: this.views.find(v => v.id === 'workout_routine')!,
        confidenceThreshold: 95
      },

      // Recovery Analytics triggers
      {
        id: 'recovery_request',
        pattern: /\b(show|display|view).*\b(recovery|sleep|rest|fatigue)\b/i,
        view: this.views.find(v => v.id === 'recovery_analytics')!,
        confidenceThreshold: 80
      },
      {
        id: 'sleep_query',
        pattern: /\b(how'?s my sleep|sleep quality|rest days|how is my recovery)\b/i,
        view: this.views.find(v => v.id === 'recovery_analytics')!,
        confidenceThreshold: 90
      },

      // Nutrition Tracking triggers
      {
        id: 'nutrition_request',
        pattern: /\b(show|display|view).*\b(nutrition|macros|calories|diet)\b/i,
        view: this.views.find(v => v.id === 'nutrition_tracking')!,
        confidenceThreshold: 85
      },
      {
        id: 'food_query',
        pattern: /\b(what should i eat|my nutrition|daily intake)\b/i,
        view: this.views.find(v => v.id === 'nutrition_tracking')!,
        confidenceThreshold: 90
      }
    ];
  }

  public analyzeConversationContext(context: ConversationContext): ViewNavigationRequest | null {
    if (!this.settings.enableVisualRedirection) {
      return null;
    }

    // Get the last few messages to analyze
    const recentMessages = context.conversationHistory.slice(-3);
    const combinedText = recentMessages.map(m => m.content).join(' ');

    // Check each trigger
    for (const trigger of this.triggers) {
      if (trigger.pattern.test(combinedText)) {
        // Check confidence threshold
        const confidence = this.calculateConfidence(trigger, context);
        if (confidence >= trigger.confidenceThreshold) {
          return {
            targetView: trigger.view,
            contextData: this.extractContextData(context, trigger.view),
            returnToConversation: this.settings.autoReturnToConversation,
            overlayMode: this.settings.defaultViewMode === 'drawer' || this.settings.defaultViewMode === 'modal'
          };
        }
      }
    }

    return null;
  }

  private calculateConfidence(trigger: RedirectionTrigger, context: ConversationContext): number {
    // Base confidence from trigger
    let confidence = trigger.confidenceThreshold;
    
    // Adjust based on conversation context
    if (context.currentTopic === trigger.view.id) {
      confidence += 10;
    }
    
    // Adjust based on user intent
    if (context.userIntent.includes('view') || context.userIntent.includes('show')) {
      confidence += 15;
    }
    
    // Cap at 100
    return Math.min(confidence, 100);
  }

  private extractContextData(context: ConversationContext, view: SpartanView): any {
    // Extract relevant data based on the target view
    const data: any = {
      conversationTopic: context.currentTopic,
      userIntent: context.userIntent
    };

    // Add specific data based on view type
    switch (view.id) {
      case 'progress_dashboard':
        data.metrics = context.relevantDataPoints.filter(dp => 
          dp.includes('progress') || dp.includes('performance') || dp.includes('stats')
        );
        break;
      case 'workout_routine':
        data.exercises = context.relevantDataPoints.filter(dp => 
          dp.includes('exercise') || dp.includes('workout') || dp.includes('routine')
        );
        break;
      case 'recovery_analytics':
        data.metrics = context.relevantDataPoints.filter(dp => 
          dp.includes('sleep') || dp.includes('recovery') || dp.includes('rest')
        );
        break;
      case 'nutrition_tracking':
        data.nutrients = context.relevantDataPoints.filter(dp => 
          dp.includes('nutrition') || dp.includes('macros') || dp.includes('calories')
        );
        break;
    }

    return data;
  }

  public navigateToView(request: ViewNavigationRequest): boolean {
    try {
      // Log the navigation event
      this.logEvent({
        type: 'view_opened',
        payload: {
          viewId: request.targetView.id,
          contextData: request.contextData,
          overlayMode: request.overlayMode
        },
        timestamp: new Date(),
        source: 'chat_maestro'
      });

      // Update current state
      this.currentState.currentView = request.targetView;
      this.currentState.visualizationVisible = true;
      this.currentState.lastInteractionTimestamp = new Date();

      // In a real implementation, this would trigger the actual navigation
      console.log(`Navigating to view: ${request.targetView.name} (${request.targetView.path})`);
      
      if (request.contextData) {
        console.log(`Context data:`, request.contextData);
      }

      return true;
    } catch (error) {
      console.error('Failed to navigate to view:', error);
      return false;
    }
  }

  public returnToConversation(): boolean {
    try {
      // Log the return event
      this.logEvent({
        type: 'conversation_resumed',
        payload: {
          fromView: this.currentState.currentView?.id
        },
        timestamp: new Date(),
        source: 'chat_maestro'
      });

      // Update current state
      this.currentState.currentView = null;
      this.currentState.visualizationVisible = false;
      this.currentState.conversationVisible = true;
      this.currentState.lastInteractionTimestamp = new Date();

      console.log('Returning to conversation');
      return true;
    } catch (error) {
      console.error('Failed to return to conversation:', error);
      return false;
    }
  }

  public registerHybridComponent(component: HybridViewComponent): void {
    this.hybridComponents.push(component);
  }

  public getHybridComponentsForContext(context: ConversationContext): HybridViewComponent[] {
    return this.hybridComponents.filter(component => {
      // Filter based on conversation context
      return context.relevantDataPoints.some(dp => dp.includes(component.dataBinding));
    });
  }

  public updateSettings(newSettings: Partial<InterfaceIntegrationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getCurrentState(): UserInterfaceState {
    return { ...this.currentState };
  }

  public getViewById(viewId: string): SpartanView | undefined {
    return this.views.find(view => view.id === viewId);
  }

  public getAllViews(): SpartanView[] {
    return [...this.views];
  }

  private logEvent(event: InterfaceEvent): void {
    this.eventHistory.push(event);
    
    // Limit event history to last 100 events
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-100);
    }
  }

  public getEventHistory(): InterfaceEvent[] {
    return [...this.eventHistory];
  }
}