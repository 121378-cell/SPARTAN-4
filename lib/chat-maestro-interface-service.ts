// Interface service for Chat Maestro

import { ChatMaestroInterfaceEngine } from './chat-maestro-interface-engine';
import {
  SpartanView,
  ViewNavigationRequest,
  ConversationContext,
  ConversationMessage,
  InterfaceIntegrationSettings,
  UserInterfaceState,
  HybridViewComponent
} from './chat-maestro-interface-types';

export class ChatMaestroInterfaceService {
  private engine: ChatMaestroInterfaceEngine;
  private isIntegrationEnabled: boolean;
  private navigationCallback?: (request: ViewNavigationRequest) => Promise<boolean>;
  private returnCallback?: () => Promise<boolean>;

  constructor(settings?: InterfaceIntegrationSettings) {
    this.engine = new ChatMaestroInterfaceEngine(settings);
    this.isIntegrationEnabled = true;
  }

  /**
   * Enable or disable interface integration
   */
  public setIntegrationEnabled(enabled: boolean): void {
    this.isIntegrationEnabled = enabled;
  }

  /**
   * Register callback for view navigation
   */
  public registerNavigationCallback(callback: (request: ViewNavigationRequest) => Promise<boolean>): void {
    this.navigationCallback = callback;
  }

  /**
   * Register callback for returning to conversation
   */
  public registerReturnCallback(callback: () => Promise<boolean>): void {
    this.returnCallback = callback;
  }

  /**
   * Process conversation context and potentially trigger view navigation
   */
  public async processConversationContext(context: ConversationContext): Promise<boolean> {
    if (!this.isIntegrationEnabled) {
      return false;
    }

    const navigationRequest = this.engine.analyzeConversationContext(context);
    
    if (navigationRequest && this.navigationCallback) {
      // Let the Spartan interface handle the actual navigation
      return await this.navigationCallback(navigationRequest);
    }
    
    return false;
  }

  /**
   * Navigate to a specific view
   */
  public async navigateToView(request: ViewNavigationRequest): Promise<boolean> {
    if (!this.isIntegrationEnabled || !this.navigationCallback) {
      return false;
    }

    // Let the engine handle the logic and then call the callback
    const success = this.engine.navigateToView(request);
    
    if (success) {
      return await this.navigationCallback(request);
    }
    
    return false;
  }

  /**
   * Return to conversation view
   */
  public async returnToConversation(): Promise<boolean> {
    if (!this.isIntegrationEnabled || !this.returnCallback) {
      return false;
    }

    // Let the engine handle the logic and then call the callback
    const success = this.engine.returnToConversation();
    
    if (success) {
      return await this.returnCallback();
    }
    
    return false;
  }

  /**
   * Process a user message and potentially trigger actions
   */
  public async processUserMessage(message: string, context: ConversationContext): Promise<boolean> {
    if (!this.isIntegrationEnabled) {
      return false;
    }

    // Add the new message to context
    const updatedContext = {
      ...context,
      conversationHistory: [
        ...context.conversationHistory,
        {
          id: `msg_${Date.now()}`,
          role: 'user' as const,
          content: message,
          timestamp: new Date()
        }
      ]
    };

    return await this.processConversationContext(updatedContext);
  }

  /**
   * Register a hybrid view component
   */
  public registerHybridComponent(component: HybridViewComponent): void {
    this.engine.registerHybridComponent(component);
  }

  /**
   * Get hybrid components relevant to current context
   */
  public getHybridComponents(context: ConversationContext): HybridViewComponent[] {
    return this.engine.getHybridComponentsForContext(context);
  }

  /**
   * Update interface settings
   */
  public updateSettings(newSettings: Partial<InterfaceIntegrationSettings>): void {
    this.engine.updateSettings(newSettings);
  }

  /**
   * Get current interface state
   */
  public getCurrentState(): UserInterfaceState {
    return this.engine.getCurrentState();
  }

  /**
   * Get a view by ID
   */
  public getView(viewId: string): SpartanView | undefined {
    return this.engine.getViewById(viewId);
  }

  /**
   * Get all available views
   */
  public getAllViews(): SpartanView[] {
    return this.engine.getAllViews();
  }

  /**
   * Simulate user interaction with interface for analytics
   */
  public recordUserInteraction(interactionType: string, details: any): void {
    console.log(`User interaction recorded: ${interactionType}`, details);
    // In a real implementation, this would update analytics
  }
}