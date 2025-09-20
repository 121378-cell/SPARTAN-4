// Advanced Plan Design Modal Service

import { AdvancedPlanDesignEngine } from './plan-design-engine';
import {
  PlanConfiguration,
  PlanGenerationResult,
  PlanUpdateRequest,
  PlanSyncEvent,
  PlanAnalytics,
  AdaptiveAdjustment
} from './plan-design-types';

export class AdvancedPlanDesignService {
  private engine: AdvancedPlanDesignEngine;
  private isModalEnabled: boolean;
  private chatMaestroSyncCallback?: (event: PlanSyncEvent) => Promise<void>;
  private wearableDataCallback?: (data: any) => Promise<void>;

  constructor() {
    this.engine = new AdvancedPlanDesignEngine();
    this.isModalEnabled = true;
  }

  /**
   * Enable or disable the plan design modal
   */
  public setModalEnabled(enabled: boolean): void {
    this.isModalEnabled = enabled;
  }

  /**
   * Register a callback for Chat Maestro synchronization
   */
  public registerChatMaestroSync(callback: (event: PlanSyncEvent) => Promise<void>): void {
    this.chatMaestroSyncCallback = callback;
  }

  /**
   * Register a callback for wearable data integration
   */
  public registerWearableDataCallback(callback: (data: any) => Promise<void>): void {
    this.wearableDataCallback = callback;
  }

  /**
   * Generate a personalized training plan
   */
  public generatePlan(configuration: PlanConfiguration): PlanGenerationResult {
    if (!this.isModalEnabled) {
      return {
        success: false,
        errorMessage: 'Plan design modal is not enabled'
      };
    }

    const result = this.engine.generatePlan(configuration);
    
    // If successful, sync with Chat Maestro
    if (result.success && this.chatMaestroSyncCallback) {
      const syncEvent: PlanSyncEvent = {
        type: 'plan_created',
        planId: result.plan?.id || '',
        payload: result,
        timestamp: new Date(),
        source: 'modal'
      };
      
      this.chatMaestroSyncCallback(syncEvent).catch(error => {
        console.error('Failed to sync with Chat Maestro:', error);
      });
    }
    
    return result;
  }

  /**
   * Update an existing plan
   */
  public updatePlan(request: PlanUpdateRequest): boolean {
    if (!this.isModalEnabled) {
      return false;
    }

    // In a real implementation, this would update the plan
    console.log(`Updating plan ${request.planId}:`, request.updates);
    
    // Sync with Chat Maestro
    if (this.chatMaestroSyncCallback) {
      const syncEvent: PlanSyncEvent = {
        type: 'plan_updated',
        planId: request.planId,
        payload: request,
        timestamp: new Date(),
        source: 'modal'
      };
      
      this.chatMaestroSyncCallback(syncEvent).catch(error => {
        console.error('Failed to sync with Chat Maestro:', error);
      });
    }
    
    return true;
  }

  /**
   * Process wearable data for adaptive adjustments
   */
  public async processWearableData(data: any): Promise<void> {
    if (!this.isModalEnabled || !this.wearableDataCallback) {
      return;
    }

    await this.wearableDataCallback(data);
    
    // Analyze data and potentially suggest adaptive adjustments
    // This is a simplified implementation
    console.log('Processing wearable data for adaptive adjustments:', data);
  }

  /**
   * Get synchronization events
   */
  public getSyncEvents(): PlanSyncEvent[] {
    return this.engine.getSyncEvents();
  }

  /**
   * Record user feedback for analytics
   */
  public recordUserFeedback(planId: string, satisfaction: number, comments?: string): void {
    console.log(`User feedback recorded for plan ${planId}: ${satisfaction}/5${comments ? ` - ${comments}` : ''}`);
    // In a real implementation, this would update analytics
  }

  /**
   * Get plan analytics
   */
  public getPlanAnalytics(planId: string): PlanAnalytics {
    // This is a simplified implementation
    return {
      planId,
      adherenceRate: 0.85,
      performanceTrend: 'improving',
      volumeLoad: 15000,
      intensityDistribution: {
        low: 10,
        moderate: 40,
        high: 50
      },
      sessionCompletion: {
        completed: 25,
        missed: 2,
        rescheduled: 3
      },
      userFeedback: {
        satisfaction: 4.2,
        comments: ['Great plan structure', 'Challenging but achievable']
      }
    };
  }

  /**
   * Generate adaptive adjustment suggestions
   */
  public generateAdaptiveAdjustments(planId: string): AdaptiveAdjustment[] {
    // This is a simplified implementation
    return [
      {
        id: `adjustment_${Date.now()}`,
        planId,
        trigger: 'performance_plateau',
        description: 'Performance has plateaued in upper body exercises',
        adjustment: {
          type: 'volume',
          value: 'Reduce volume by 10% for upper body exercises'
        },
        applied: false,
        timestamp: new Date()
      }
    ];
  }
}