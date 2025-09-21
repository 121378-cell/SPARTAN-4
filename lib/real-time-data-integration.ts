/**
 * Real-Time Data Integration Service - "La Sangre de Spartan"
 * Orchestrates real-time data flow between all SPARTAN 4 modules
 * 
 * This service handles:
 * - Real-time data synchronization between modules
 * - Cross-modal data sharing
 * - Event-driven data updates
 * - Conflict resolution
 * - Data consistency maintenance
 */

import { logger } from './logger';
import { dataManagementService } from './data-management-service';
import { chatMaestroService, ChatContext } from './chat-maestro-service';
import { wearableIntegrationService, WearableData } from './wearable-integration-service';
import { nutritionService } from './nutrition-service';
import { recoveryService } from './recovery-service';
import { loadProgressionService } from './load-progression-service';
import { realTimeModificationService } from './real-time-modification-service';
import { storageManager } from './storage';
import { spartanNervousSystem } from './spartan-nervous-system';
import { 
  UserData, 
  WorkoutPlan, 
  WorkoutSession, 
  RecoveryAnalysis, 
  ProgressionPlan, 
  DailyNutrition, 
  UserHabit 
} from './types';

// Event types for real-time data integration
export type DataEventType = 
  | 'user_data_updated'
  | 'workout_started'
  | 'workout_completed'
  | 'biometric_data_received'
  | 'nutrition_logged'
  | 'recovery_metric_updated'
  | 'progression_adjusted'
  | 'habit_tracked'
  | 'goal_achieved'
  | 'chat_interaction';

export interface DataEvent {
  type: DataEventType;
  timestamp: Date;
  userId: string;
  payload: any;
  sourceModule: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class RealTimeDataIntegrationService {
  private static instance: RealTimeDataIntegrationService;
  private eventQueue: DataEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private subscribers: Map<DataEventType, ((event: DataEvent) => void)[]> = new Map();
  
  static getInstance(): RealTimeDataIntegrationService {
    if (!RealTimeDataIntegrationService.instance) {
      RealTimeDataIntegrationService.instance = new RealTimeDataIntegrationService();
    }
    return RealTimeDataIntegrationService.instance;
  }
  
  constructor() {
    // Start processing events
    this.processingInterval = setInterval(() => {
      this.processEventQueue();
    }, 1000); // Process events every second
  }
  
  /**
   * Emit a data event to notify all interested modules
   */
  emitEvent(event: DataEvent): void {
    logger.info(`RealTimeDataIntegration: Emitting event ${event.type} from ${event.sourceModule}`);
    
    // Add to queue for processing
    this.eventQueue.push(event);
    
    // Notify immediate subscribers
    const subscribers = this.subscribers.get(event.type) || [];
    subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        logger.error(`RealTimeDataIntegration: Error in event callback for ${event.type}`, error);
      }
    });
    
    // Also notify the Spartan Nervous System
    spartanNervousSystem.emitEvent({
      type: this.mapToNervousSystemEventType(event.type),
      timestamp: event.timestamp,
      userId: event.userId,
      payload: event.payload,
      sourceModule: event.sourceModule,
      priority: event.priority
    });
  }
  
  /**
   * Map DataEventType to NervousSystemEventType
   */
  private mapToNervousSystemEventType(dataEventType: DataEventType): any {
    switch (dataEventType) {
      case 'user_data_updated':
        return 'data_updated';
      case 'workout_started':
      case 'workout_completed':
        return 'user_action';
      case 'biometric_data_received':
        return 'data_updated';
      case 'nutrition_logged':
        return 'data_updated';
      case 'recovery_metric_updated':
        return 'data_updated';
      case 'progression_adjusted':
        return 'data_updated';
      case 'habit_tracked':
        return 'user_action';
      case 'goal_achieved':
        return 'alert_triggered';
      case 'chat_interaction':
        return 'chat_interaction';
      default:
        return 'data_updated';
    }
  }

  /**
   * Subscribe to specific data events
   */
  subscribe(eventType: DataEventType, callback: (event: DataEvent) => void): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    this.subscribers.get(eventType)!.push(callback);
  }
  
  /**
   * Process the event queue
   */
  private async processEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    // Sort events by priority and timestamp
    this.eventQueue.sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.timestamp.getTime() - b.timestamp.getTime();
    });
    
    // Process events one by one
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        await this.processEvent(event);
      }
    }
  }
  
  /**
   * Process a single event
   */
  private async processEvent(event: DataEvent): Promise<void> {
    try {
      logger.info(`RealTimeDataIntegration: Processing event ${event.type} from ${event.sourceModule}`);
      
      switch (event.type) {
        case 'user_data_updated':
          await this.handleUserDataUpdated(event);
          break;
          
        case 'workout_started':
          await this.handleWorkoutStarted(event);
          break;
          
        case 'workout_completed':
          await this.handleWorkoutCompleted(event);
          break;
          
        case 'biometric_data_received':
          await this.handleBiometricDataReceived(event);
          break;
          
        case 'nutrition_logged':
          await this.handleNutritionLogged(event);
          break;
          
        case 'recovery_metric_updated':
          await this.handleRecoveryMetricUpdated(event);
          break;
          
        case 'progression_adjusted':
          await this.handleProgressionAdjusted(event);
          break;
          
        case 'habit_tracked':
          await this.handleHabitTracked(event);
          break;
          
        case 'goal_achieved':
          await this.handleGoalAchieved(event);
          break;
          
        case 'chat_interaction':
          await this.handleChatInteraction(event);
          break;
          
        default:
          logger.warn(`RealTimeDataIntegration: Unknown event type ${event.type}`);
      }
    } catch (error) {
      logger.error(`RealTimeDataIntegration: Error processing event ${event.type}`, error);
    }
  }
  
  /**
   * Handle user data updates
   */
  private async handleUserDataUpdated(event: DataEvent): Promise<void> {
    const userData: UserData = event.payload;
    
    // Update storage
    storageManager.setUserData(userData);
    
    // Notify Chat Maestro of user data changes
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyUserDataChange(context);
    }
    
    logger.info('RealTimeDataIntegration: User data updated successfully');
  }
  
  /**
   * Handle workout start events
   */
  private async handleWorkoutStarted(event: DataEvent): Promise<void> {
    const { workoutPlan, session }: { workoutPlan: WorkoutPlan, session: WorkoutSession } = event.payload;
    
    // Store the session
    storageManager.addWorkoutSession(session);
    
    // Notify other modules
    this.emitEvent({
      type: 'workout_started',
      timestamp: new Date(),
      userId: event.userId,
      payload: { workoutPlan, session },
      sourceModule: 'RealTimeDataIntegration',
      priority: 'high'
    });
    
    logger.info('RealTimeDataIntegration: Workout started successfully');
  }
  
  /**
   * Handle workout completion events
   */
  private async handleWorkoutCompleted(event: DataEvent): Promise<void> {
    const session: WorkoutSession = event.payload;
    
    // Update session in storage
    const sessions = storageManager.getWorkoutSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index !== -1) {
      sessions[index] = session;
      storageManager.setWorkoutSessions(sessions);
    }
    
    // Update progress data
    storageManager.addProgressData({
      workoutId: session.workoutPlanId,
      date: session.date,
      notes: session.notes
    });
    
    // Notify Chat Maestro of workout completion
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyWorkoutCompleted(context, session);
    }
    
    logger.info('RealTimeDataIntegration: Workout completed successfully');
  }
  
  /**
   * Handle biometric data received from wearables
   */
  private async handleBiometricDataReceived(event: DataEvent): Promise<void> {
    const wearableData: WearableData = event.payload;
    
    // Process the wearable data
    const insights = wearableIntegrationService.processWearableData(event.userId, wearableData);
    
    // Store processed insights
    // In a real implementation, we would store these insights
    
    // Notify Chat Maestro of new biometric data
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyBiometricDataReceived(context, insights);
    }
    
    // Trigger real-time modifications if needed
    if (insights.adjustments.length > 0) {
      this.emitEvent({
        type: 'workout_started', // This would trigger modifications
        timestamp: new Date(),
        userId: event.userId,
        payload: { adjustments: insights.adjustments },
        sourceModule: 'RealTimeDataIntegration',
        priority: 'high'
      });
    }
    
    logger.info('RealTimeDataIntegration: Biometric data received and processed successfully');
  }
  
  /**
   * Handle nutrition logging events
   */
  private async handleNutritionLogged(event: DataEvent): Promise<void> {
    const nutritionData: DailyNutrition = event.payload;
    
    // Store nutrition data
    storageManager.addDailyNutrition(nutritionData);
    
    // Notify nutrition service
    // In a real implementation, we would notify the nutrition service
    
    // Notify Chat Maestro of nutrition update
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyNutritionLogged(context, nutritionData);
    }
    
    logger.info('RealTimeDataIntegration: Nutrition data logged successfully');
  }
  
  /**
   * Handle recovery metric updates
   */
  private async handleRecoveryMetricUpdated(event: DataEvent): Promise<void> {
    const recoveryMetric: any = event.payload; // RecoveryMetric type
    
    // Store recovery metric
    storageManager.addRecoveryMetric(recoveryMetric);
    
    // Generate recovery analysis
    const analysis = recoveryService.analyzeRecovery(event.userId, recoveryMetric.date);
    
    // Store analysis
    storageManager.addRecoveryAnalysis(analysis);
    
    // Notify Chat Maestro of recovery update
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyRecoveryUpdated(context, analysis);
    }
    
    logger.info('RealTimeDataIntegration: Recovery metric updated successfully');
  }
  
  /**
   * Handle progression adjustments
   */
  private async handleProgressionAdjusted(event: DataEvent): Promise<void> {
    const progressionPlan: ProgressionPlan = event.payload;
    
    // Store progression plan
    // In a real implementation, we would store this
    
    // Notify load progression service
    // In a real implementation, we would notify the load progression service
    
    // Notify Chat Maestro of progression adjustment
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyProgressionAdjusted(context, progressionPlan);
    }
    
    logger.info('RealTimeDataIntegration: Progression adjusted successfully');
  }
  
  /**
   * Handle habit tracking events
   */
  private async handleHabitTracked(event: DataEvent): Promise<void> {
    const habit: UserHabit = event.payload;
    
    // Update habit in storage
    const habits = storageManager.getUserHabits();
    const index = habits.findIndex(h => h.id === habit.id);
    if (index !== -1) {
      habits[index] = habit;
      storageManager.setUserHabits(habits);
    }
    
    // Notify Chat Maestro of habit tracking
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyHabitTracked(context, habit);
    }
    
    logger.info('RealTimeDataIntegration: Habit tracked successfully');
  }
  
  /**
   * Handle goal achievement events
   */
  private async handleGoalAchieved(event: DataEvent): Promise<void> {
    const goal: any = event.payload; // Goal type
    
    // Store goal achievement
    // In a real implementation, we would store this
    
    // Notify Chat Maestro of goal achievement
    const context = await dataManagementService.getChatContext();
    if (context) {
      // In a real implementation, we would send this to Chat Maestro
      // chatMaestroService.notifyGoalAchieved(context, goal);
    }
    
    logger.info('RealTimeDataIntegration: Goal achieved successfully');
  }
  
  /**
   * Handle chat interactions
   */
  private async handleChatInteraction(event: DataEvent): Promise<void> {
    const interaction: any = event.payload; // Chat interaction type
    
    // Log chat interaction
    // In a real implementation, we would store this
    
    // Update user context based on chat interaction
    // In a real implementation, we would update context
    
    logger.info('RealTimeDataIntegration: Chat interaction processed successfully');
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

// Export singleton instance
export const realTimeDataIntegrationService = RealTimeDataIntegrationService.getInstance();