// Feedback service for Chat Maestro

import { ChatMaestroFeedbackEngine } from './chat-maestro-feedback-engine';
import {
  WorkoutData,
  ProgressData,
  UserData,
  FeedbackContext,
  FeedbackItem,
  FeedbackSettings
} from './chat-maestro-feedback-types';

export class ChatMaestroFeedbackService {
  private engine: ChatMaestroFeedbackEngine;
  private feedbackHistory: FeedbackItem[] = [];
  private isFeedbackEnabled: boolean;

  constructor(settings?: FeedbackSettings) {
    this.engine = new ChatMaestroFeedbackEngine(settings);
    this.isFeedbackEnabled = true;
  }

  /**
   * Enable or disable feedback
   */
  public setFeedbackEnabled(enabled: boolean): void {
    this.isFeedbackEnabled = enabled;
  }

  /**
   * Process user data and generate feedback
   */
  public generateFeedback(
    userData: UserData,
    recentWorkouts: WorkoutData[],
    progressData: ProgressData[]
  ): FeedbackItem[] {
    if (!this.isFeedbackEnabled) {
      return [];
    }

    const context: FeedbackContext = {
      userData,
      recentWorkouts,
      progressData,
      currentProgramPhase: 'initiation', // This would be determined dynamically
      recentFeedbackHistory: this.feedbackHistory.slice(-10) // Last 10 feedback items
    };

    const feedbackItems = this.engine.generateFeedback(context);
    
    // Add to history
    this.feedbackHistory.push(...feedbackItems);
    
    // Limit history to last 50 items
    if (this.feedbackHistory.length > 50) {
      this.feedbackHistory = this.feedbackHistory.slice(-50);
    }
    
    return feedbackItems;
  }

  /**
   * Update feedback settings
   */
  public updateSettings(newSettings: Partial<FeedbackSettings>): void {
    this.engine.updateSettings(newSettings);
  }

  /**
   * Get current settings
   */
  public getSettings(): FeedbackSettings {
    return this.engine.getSettings();
  }

  /**
   * Get feedback history
   */
  public getFeedbackHistory(): FeedbackItem[] {
    return [...this.feedbackHistory];
  }

  /**
   * Simulate user response to feedback for analytics
   */
  public recordUserResponse(feedbackId: string, viewed: boolean, actedUpon: boolean, rating: number): void {
    // In a real implementation, this would update analytics
    console.log(`User ${viewed ? 'viewed' : 'ignored'} feedback ${feedbackId}`);
    if (actedUpon) {
      console.log(`User acted upon feedback ${feedbackId}`);
    }
    console.log(`User rated feedback ${feedbackId} with ${rating}/5 stars`);
  }
}