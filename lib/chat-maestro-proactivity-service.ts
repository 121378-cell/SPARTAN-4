// Proactivity service for Chat Maestro

import { ChatMaestroProactivityEngine } from './chat-maestro-proactivity-engine';
import {
  UserDataSnapshot,
  ProactiveIntervention,
  ProactivitySettings
} from './chat-maestro-proactivity-types';

export class ChatMaestroProactivityService {
  private engine: ChatMaestroProactivityEngine;
  private isProactivityEnabled: boolean;

  constructor(settings?: ProactivitySettings) {
    this.engine = new ChatMaestroProactivityEngine(settings);
    this.isProactivityEnabled = true;
  }

  /**
   * Enable or disable proactivity
   */
  public setProactivityEnabled(enabled: boolean): void {
    this.isProactivityEnabled = enabled;
  }

  /**
   * Process user data and generate proactive interventions
   */
  public processUserData(data: UserDataSnapshot): ProactiveIntervention[] {
    if (!this.isProactivityEnabled) {
      return [];
    }

    return this.engine.evaluateTriggers(data);
  }

  /**
   * Update proactivity settings
   */
  public updateSettings(newSettings: Partial<ProactivitySettings>): void {
    this.engine.updateSettings(newSettings);
  }

  /**
   * Get proactivity analytics
   */
  public getAnalytics() {
    return this.engine.getAnalytics();
  }

  /**
   * Simulate user response to an intervention for analytics
   */
  public recordUserResponse(interventionId: string, responded: boolean, wasHelpful: boolean): void {
    // In a real implementation, this would update analytics
    console.log(`User ${responded ? 'responded to' : 'ignored'} intervention ${interventionId}`);
    if (responded && wasHelpful) {
      console.log(`User found intervention ${interventionId} helpful`);
    }
  }
}