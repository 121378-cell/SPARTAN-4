/**
 * Spartan Nervous System - "Sistema Nervioso de Spartan"
 * Central nervous system for the SPARTAN 4 ecosystem that connects
 * Chat Maestro, modals, and data management for real-time communication
 * and coordination.
 * 
 * This service handles:
 * - Bidirectional communication between all modules
 * - Instant data integration and propagation
 * - Contextual processing and decision making
 * - Intelligent alerts and notifications
 * - Coordinated event flow
 * - Data redundancy and consistency
 * - Latency optimization
 * - Proactive system behavior
 * - Modular scalability
 * - Continuous learning
 */

import { logger } from './logger';
import { dataManagementService, DataInsights } from './data-management-service';
import { chatMaestroService, ChatContext, ChatResponse } from './chat-maestro-service';
import { realTimeDataIntegrationService, DataEvent, DataEventType } from './real-time-data-integration';
import { wearableIntegrationService, WearableInsights } from './wearable-integration-service';
import { neuralInterfaceService } from './neural-interface-service';
import { SpartanModalService } from './spartan-modal-service';
import { storageManager } from './storage';
import { 
  UserData, 
  WorkoutPlan, 
  WorkoutSession, 
  RecoveryAnalysis, 
  ProgressionPlan, 
  DailyNutrition, 
  UserHabit 
} from './types';

// Types for the nervous system
export type NervousSystemEventType = 
  | 'data_updated'
  | 'chat_interaction'
  | 'modal_activated'
  | 'modal_deactivated'
  | 'insight_generated'
  | 'alert_triggered'
  | 'recommendation_made'
  | 'user_action'
  | 'system_proactive'
  | 'learning_update'
  | 'neural_data_received'
  | 'mental_state_changed'
  | 'neural_feedback_received';

export interface NervousSystemEvent {
  type: NervousSystemEventType;
  timestamp: Date;
  userId: string;
  payload: any;
  sourceModule: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  correlationId?: string;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  actions: string[];
  dismissible: boolean;
  autoDismiss?: number; // seconds
}

export interface SystemRecommendation {
  id: string;
  type: 'training' | 'nutrition' | 'recovery' | 'progression' | 'habit' | 'neural_feedback';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  confidence: number; // 0-1
  actionable: boolean;
  autoExecute?: boolean;
}

export interface ProactiveAction {
  id: string;
  type: 'modal_activation' | 'chat_message' | 'data_update' | 'recommendation' | 'neural_feedback_session';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  executionTime: Date;
  executed: boolean;
  result?: any;
}

export class SpartanNervousSystem {
  private static instance: SpartanNervousSystem;
  private eventQueue: NervousSystemEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private subscribers: Map<NervousSystemEventType, ((event: NervousSystemEvent) => void)[]> = new Map();
  private alerts: SystemAlert[] = [];
  private recommendations: SystemRecommendation[] = [];
  private proactiveActions: ProactiveAction[] = [];
  private modalService: SpartanModalService;
  private learningMemory: Map<string, any> = new Map();
  
  static getInstance(): SpartanNervousSystem {
    if (!SpartanNervousSystem.instance) {
      SpartanNervousSystem.instance = new SpartanNervousSystem();
    }
    return SpartanNervousSystem.instance;
  }
  
  constructor() {
    this.modalService = new SpartanModalService();
    
    // Start processing events
    this.processingInterval = setInterval(() => {
      this.processEventQueue();
    }, 500); // Process events every 500ms for real-time responsiveness
    
    // Subscribe to real-time data integration events
    this.subscribeToDataEvents();
    
    // Start proactive system monitoring
    setInterval(() => {
      this.monitorAndActProactively();
    }, 10000); // Check for proactive actions every 10 seconds
  }
  
  /**
   * Subscribe to real-time data integration events
   */
  private subscribeToDataEvents(): void {
    // Subscribe to all data events from the real-time integration service
    realTimeDataIntegrationService.subscribe('user_data_updated', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('workout_started', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('workout_completed', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('biometric_data_received', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('nutrition_logged', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('recovery_metric_updated', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('progression_adjusted', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('habit_tracked', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('goal_achieved', (event) => {
      this.handleDataEvent(event);
    });
    
    realTimeDataIntegrationService.subscribe('chat_interaction', (event) => {
      this.handleDataEvent(event);
    });
  }
  
  /**
   * Handle data events from real-time integration service
   */
  private handleDataEvent(event: DataEvent): void {
    // Convert DataEvent to NervousSystemEvent
    const nervousEvent: NervousSystemEvent = {
      type: this.mapDataEventType(event.type),
      timestamp: event.timestamp,
      userId: event.userId,
      payload: event.payload,
      sourceModule: event.sourceModule,
      priority: event.priority,
      correlationId: this.generateCorrelationId()
    };
    
    // Add to queue for processing
    this.eventQueue.push(nervousEvent);
    
    // Notify subscribers immediately for critical events
    if (event.priority === 'critical') {
      this.notifySubscribers(nervousEvent);
    }
  }
  
  /**
   * Map DataEventType to NervousSystemEventType
   */
  private mapDataEventType(dataEventType: DataEventType): NervousSystemEventType {
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
   * Generate a correlation ID for event tracking
   */
  private generateCorrelationId(): string {
    return 'corr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Emit a nervous system event to notify all interested modules
   */
  emitEvent(event: NervousSystemEvent): void {
    logger.info(`SpartanNervousSystem: Emitting event ${event.type} from ${event.sourceModule}`);
    
    // Add to queue for processing
    this.eventQueue.push(event);
    
    // Notify immediate subscribers for high priority events
    if (event.priority === 'high' || event.priority === 'critical') {
      this.notifySubscribers(event);
    }
  }
  
  /**
   * Subscribe to specific nervous system events
   */
  subscribe(eventType: NervousSystemEventType, callback: (event: NervousSystemEvent) => void): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    this.subscribers.get(eventType)!.push(callback);
  }
  
  /**
   * Notify subscribers of an event
   */
  private notifySubscribers(event: NervousSystemEvent): void {
    const subscribers = this.subscribers.get(event.type) || [];
    subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        logger.error(`SpartanNervousSystem: Error in event callback for ${event.type}`, error);
      }
    });
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
  private async processEvent(event: NervousSystemEvent): Promise<void> {
    try {
      logger.info(`SpartanNervousSystem: Processing event ${event.type} from ${event.sourceModule}`);
      
      switch (event.type) {
        case 'data_updated':
          await this.handleDataUpdated(event);
          break;
          
        case 'chat_interaction':
          await this.handleChatInteraction(event);
          break;
          
        case 'modal_activated':
          await this.handleModalActivated(event);
          break;
          
        case 'modal_deactivated':
          await this.handleModalDeactivated(event);
          break;
          
        case 'insight_generated':
          await this.handleInsightGenerated(event);
          break;
          
        case 'alert_triggered':
          await this.handleAlertTriggered(event);
          break;
          
        case 'recommendation_made':
          await this.handleRecommendationMade(event);
          break;
          
        case 'user_action':
          await this.handleUserAction(event);
          break;
          
        case 'system_proactive':
          await this.handleSystemProactive(event);
          break;
          
        case 'learning_update':
          await this.handleLearningUpdate(event);
          break;
          
        case 'neural_data_received':
          await this.handleNeuralDataReceived(event);
          break;
          
        case 'mental_state_changed':
          await this.handleMentalStateChanged(event);
          break;
          
        case 'neural_feedback_received':
          await this.handleNeuralFeedbackReceived(event);
          break;
          
        default:
          logger.warn(`SpartanNervousSystem: Unknown event type ${event.type}`);
      }
    } catch (error) {
      logger.error(`SpartanNervousSystem: Error processing event ${event.type}`, error);
    }
  }
  
  /**
   * Handle data updated events
   */
  private async handleDataUpdated(event: NervousSystemEvent): Promise<void> {
    // Get updated data insights
    const insights = await dataManagementService.generateInsights();
    
    if (insights) {
      // Emit insight generated event
      this.emitEvent({
        type: 'insight_generated',
        timestamp: new Date(),
        userId: event.userId,
        payload: insights,
        sourceModule: 'SpartanNervousSystem',
        priority: 'medium',
        correlationId: event.correlationId
      });
      
      // Check for alerts based on insights
      this.checkForAlerts(insights, event.userId);
      
      // Generate recommendations based on insights
      this.generateRecommendationsFromInsights(insights, event.userId);
    }
    
    logger.info('SpartanNervousSystem: Data updated successfully');
  }
  
  /**
   * Handle chat interaction events
   */
  private async handleChatInteraction(event: NervousSystemEvent): Promise<void> {
    // Get chat context
    const context = await dataManagementService.getChatContext();
    
    if (context) {
      // Process chat interaction for insights
      // This would typically involve analyzing the conversation for patterns
      // For now, we'll just log the interaction
      logger.info('SpartanNervousSystem: Chat interaction processed');
    }
  }
  
  /**
   * Handle modal activated events
   */
  private async handleModalActivated(event: NervousSystemEvent): Promise<void> {
    // Log modal activation
    logger.info(`SpartanNervousSystem: Modal ${event.payload.modalId} activated`);
    
    // Update learning memory with modal usage patterns
    this.updateLearningMemory('modal_activation', {
      modalId: event.payload.modalId,
      timestamp: event.timestamp,
      userId: event.userId
    });
  }
  
  /**
   * Handle modal deactivated events
   */
  private async handleModalDeactivated(event: NervousSystemEvent): Promise<void> {
    // Log modal deactivation
    logger.info(`SpartanNervousSystem: Modal ${event.payload.modalId} deactivated`);
  }
  
  /**
   * Handle insight generated events
   */
  private async handleInsightGenerated(event: NervousSystemEvent): Promise<void> {
    const insights: DataInsights = event.payload;
    
    // Process insights for actionable items
    logger.info('SpartanNervousSystem: Insights generated and processed');
  }
  
  /**
   * Handle alert triggered events
   */
  private async handleAlertTriggered(event: NervousSystemEvent): Promise<void> {
    // Add alert to system alerts
    const alert: SystemAlert = event.payload;
    this.alerts.push(alert);
    
    // Notify relevant modules
    logger.info(`SpartanNervousSystem: Alert triggered - ${alert.title}`);
  }
  
  /**
   * Handle recommendation made events
   */
  private async handleRecommendationMade(event: NervousSystemEvent): Promise<void> {
    // Add recommendation to system recommendations
    const recommendation: SystemRecommendation = event.payload;
    this.recommendations.push(recommendation);
    
    // Notify relevant modules
    logger.info(`SpartanNervousSystem: Recommendation made - ${recommendation.title}`);
  }
  
  /**
   * Handle user action events
   */
  private async handleUserAction(event: NervousSystemEvent): Promise<void> {
    // Log user action for learning
    this.updateLearningMemory('user_action', {
      actionType: event.payload.actionType,
      timestamp: event.timestamp,
      userId: event.userId
    });
    
    logger.info(`SpartanNervousSystem: User action processed - ${event.payload.actionType}`);
  }
  
  /**
   * Handle system proactive events
   */
  private async handleSystemProactive(event: NervousSystemEvent): Promise<void> {
    // Process proactive system action
    logger.info(`SpartanNervousSystem: Proactive system action processed - ${event.payload.action}`);
  }
  
  /**
   * Handle learning update events
   */
  private async handleLearningUpdate(event: NervousSystemEvent): Promise<void> {
    // Update learning memory
    const learningData = event.payload;
    this.learningMemory.set(learningData.key, learningData.value);
    
    logger.info(`SpartanNervousSystem: Learning update processed - ${learningData.key}`);
  }
  
  /**
   * Handle neural data received events
   */
  private async handleNeuralDataReceived(event: NervousSystemEvent): Promise<void> {
    // Process neural data
    const neuralData = event.payload;
    
    // Generate insights from neural data
    // This would typically involve more complex analysis
    logger.info('SpartanNervousSystem: Neural data received and processed');
    
    // Check for alerts based on neural data
    this.checkForNeuralAlerts(neuralData, event.userId);
    
    // Generate recommendations based on neural data
    this.generateRecommendationsFromNeuralData(neuralData, event.userId);
  }
  
  /**
   * Handle mental state changed events
   */
  private async handleMentalStateChanged(event: NervousSystemEvent): Promise<void> {
    const mentalStateData = event.payload.data;
    
    // Log mental state change
    logger.info(`SpartanNervousSystem: Mental state changed to ${mentalStateData.state}`);
    
    // Generate recommendations based on mental state
    this.generateRecommendationsFromMentalState(mentalStateData, event.userId);
  }
  
  /**
   * Handle neural feedback received events
   */
  private async handleNeuralFeedbackReceived(event: NervousSystemEvent): Promise<void> {
    const feedbackData = event.payload.data;
    
    // Log neural feedback
    logger.info(`SpartanNervousSystem: Neural feedback received - ${feedbackData.type}: ${feedbackData.value}`);
    
    // Generate recommendations based on neural feedback
    this.generateRecommendationsFromNeuralData(event.payload, event.userId);
  }
  
  /**
   * Update learning memory with new data
   */
  private updateLearningMemory(key: string, value: any): void {
    this.learningMemory.set(key, {
      ...value,
      lastUpdated: new Date()
    });
  }
  
  /**
   * Check for alerts based on data insights
   */
  private checkForAlerts(insights: DataInsights, userId: string): void {
    const alerts: SystemAlert[] = [];
    
    // Check for recovery status alerts
    if (insights.currentStatus.recoveryStatus === 'critical') {
      alerts.push({
        id: `alert_${Date.now()}_recovery`,
        type: 'danger',
        title: 'Estado de Recuperación Crítico',
        message: 'Tu estado de recuperación es crítico. Se recomienda descansar y consultar con un profesional.',
        priority: 'critical',
        timestamp: new Date(),
        actions: ['Descansar', 'Ver recomendaciones'],
        dismissible: true,
        autoDismiss: 30
      });
    } else if (insights.currentStatus.recoveryStatus === 'poor') {
      alerts.push({
        id: `alert_${Date.now()}_recovery`,
        type: 'warning',
        title: 'Estado de Recuperación Bajo',
        message: 'Tu estado de recuperación es bajo. Considera reducir la intensidad del entrenamiento.',
        priority: 'high',
        timestamp: new Date(),
        actions: ['Reducir intensidad', 'Ver recomendaciones'],
        dismissible: true
      });
    }
    
    // Check for energy level alerts
    if (insights.currentStatus.energyLevel === 'veryLow') {
      alerts.push({
        id: `alert_${Date.now()}_energy`,
        type: 'danger',
        title: 'Nivel de Energía Muy Bajo',
        message: 'Tu nivel de energía es muy bajo. Prioriza el descanso y la nutrición adecuada.',
        priority: 'high',
        timestamp: new Date(),
        actions: ['Descansar', 'Ver recomendaciones nutricionales'],
        dismissible: true
      });
    }
    
    // Check for training readiness alerts
    if (insights.currentStatus.trainingReadiness === 'rest') {
      alerts.push({
        id: `alert_${Date.now()}_training`,
        type: 'warning',
        title: 'No Listo para Entrenar',
        message: 'Según los datos, no estás listo para entrenar en este momento. Considera un día de descanso.',
        priority: 'high',
        timestamp: new Date(),
        actions: ['Descansar', 'Ver alternativas'],
        dismissible: true
      });
    }
    
    // Emit alert events for each alert
    alerts.forEach(alert => {
      this.alerts.push(alert);
      
      this.emitEvent({
        type: 'alert_triggered',
        timestamp: new Date(),
        userId: userId,
        payload: alert,
        sourceModule: 'SpartanNervousSystem',
        priority: alert.priority
      });
    });
  }
  
  /**
   * Check for alerts based on neural data
   */
  private checkForNeuralAlerts(neuralData: any, userId: string): void {
    const alerts: SystemAlert[] = [];
    
    // Check for high stress levels from neural feedback
    if (neuralData.neuralFeedback && neuralData.neuralFeedback.type === 'stress_response' && neuralData.neuralFeedback.value < 30) {
      alerts.push({
        id: `alert_${Date.now()}_neural_stress`,
        type: 'warning',
        title: 'Estrés Elevado Detectado',
        message: 'Los sensores neuronales detectan niveles elevados de estrés. Considera técnicas de relajación.',
        priority: 'high',
        timestamp: new Date(),
        actions: ['Técnicas de relajación', 'Descansar'],
        dismissible: true
      });
    }
    
    // Check for fatigue from neural feedback
    if (neuralData.neuralFeedback && neuralData.neuralFeedback.type === 'fatigue_index' && neuralData.neuralFeedback.value > 70) {
      alerts.push({
        id: `alert_${Date.now()}_neural_fatigue`,
        type: 'warning',
        title: 'Fatiga Neuromuscular Detectada',
        message: 'Se detecta fatiga neuromuscular elevada. Considera reducir la intensidad del entrenamiento.',
        priority: 'high',
        timestamp: new Date(),
        actions: ['Reducir intensidad', 'Descansar'],
        dismissible: true
      });
    }
    
    // Emit alert events for each alert
    alerts.forEach(alert => {
      this.alerts.push(alert);
      
      this.emitEvent({
        type: 'alert_triggered',
        timestamp: new Date(),
        userId: userId,
        payload: alert,
        sourceModule: 'SpartanNervousSystem',
        priority: alert.priority
      });
    });
  }
  
  /**
   * Generate recommendations from data insights
   */
  private generateRecommendationsFromInsights(insights: DataInsights, userId: string): void {
    const recommendations: SystemRecommendation[] = [];
    
    // Add recommendations based on insights
    insights.recommendations.forEach((rec, index) => {
      recommendations.push({
        id: `rec_${Date.now()}_${index}`,
        type: 'training',
        title: 'Recomendación Personalizada',
        description: rec,
        priority: 'medium',
        timestamp: new Date(),
        confidence: 0.8,
        actionable: true
      });
    });
    
    // Add specific recommendations based on trends
    if (insights.trends.performance === 'declining') {
      recommendations.push({
        id: `rec_${Date.now()}_performance`,
        type: 'training',
        title: 'Rendimiento en Descenso',
        description: 'Tu rendimiento ha estado en descenso. Considera revisar tu plan de entrenamiento y recuperación.',
        priority: 'high',
        timestamp: new Date(),
        confidence: 0.9,
        actionable: true
      });
    }
    
    if (insights.trends.adherence === 'poor') {
      recommendations.push({
        id: `rec_${Date.now()}_adherence`,
        type: 'habit',
        title: 'Baja Adherencia',
        description: 'Tu adherencia al plan ha sido baja. Establece recordatorios y metas pequeñas para mejorar.',
        priority: 'high',
        timestamp: new Date(),
        confidence: 0.85,
        actionable: true
      });
    }
    
    // Emit recommendation events for each recommendation
    recommendations.forEach(rec => {
      this.recommendations.push(rec);
      
      this.emitEvent({
        type: 'recommendation_made',
        timestamp: new Date(),
        userId: userId,
        payload: rec,
        sourceModule: 'SpartanNervousSystem',
        priority: rec.priority
      });
    });
  }
  
  /**
   * Generate recommendations from neural data
   */
  private generateRecommendationsFromNeuralData(neuralData: any, userId: string): void {
    const recommendations: SystemRecommendation[] = [];
    
    // Add recommendations based on neural feedback
    if (neuralData.neuralFeedback && neuralData.neuralFeedback.recommendations) {
      neuralData.neuralFeedback.recommendations.forEach((rec: string, index: number) => {
        recommendations.push({
          id: `neural_rec_${Date.now()}_${index}`,
          type: 'neural_feedback',
          title: 'Recomendación Basada en Señales Neurales',
          description: rec,
          priority: 'medium',
          timestamp: new Date(),
          confidence: 0.85,
          actionable: true
        });
      });
    }
    
    // Emit recommendation events for each recommendation
    recommendations.forEach(rec => {
      this.recommendations.push(rec);
      
      this.emitEvent({
        type: 'recommendation_made',
        timestamp: new Date(),
        userId: userId,
        payload: rec,
        sourceModule: 'SpartanNervousSystem',
        priority: rec.priority
      });
    });
  }
  
  /**
   * Generate recommendations from mental state
   */
  private generateRecommendationsFromMentalState(mentalStateData: any, userId: string): void {
    const recommendations: SystemRecommendation[] = [];
    
    // Add recommendations based on mental state
    switch (mentalStateData.state) {
      case 'stressed':
        recommendations.push({
          id: `mental_rec_${Date.now()}_stress`,
          type: 'recovery',
          title: 'Manejo del Estrés',
          description: 'Se detecta estado de estrés elevado. Considera técnicas de relajación como respiración profunda o meditación.',
          priority: 'high',
          timestamp: new Date(),
          confidence: 0.9,
          actionable: true
        });
        break;
      case 'fatigued':
        recommendations.push({
          id: `mental_rec_${Date.now()}_fatigue`,
          type: 'recovery',
          title: 'Manejo de Fatiga',
          description: 'Se detecta fatiga mental. Considera tomar un descanso o realizar una actividad de baja intensidad.',
          priority: 'high',
          timestamp: new Date(),
          confidence: 0.85,
          actionable: true
        });
        break;
      case 'focused':
        recommendations.push({
          id: `mental_rec_${Date.now()}_focus`,
          type: 'training',
          title: 'Aprovecha tu Enfoque',
          description: 'Se detecta un estado de enfoque óptimo. Este es un buen momento para realizar tareas cognitivamente demandantes.',
          priority: 'medium',
          timestamp: new Date(),
          confidence: 0.9,
          actionable: true
        });
        break;
      case 'relaxed':
        recommendations.push({
          id: `mental_rec_${Date.now()}_relax`,
          type: 'recovery',
          title: 'Estado Relajado',
          description: 'Se detecta un estado relajado. Este es un buen momento para la recuperación activa o estiramientos.',
          priority: 'medium',
          timestamp: new Date(),
          confidence: 0.8,
          actionable: true
        });
        break;
    }
    
    // Emit recommendation events for each recommendation
    recommendations.forEach(rec => {
      this.recommendations.push(rec);
      
      this.emitEvent({
        type: 'recommendation_made',
        timestamp: new Date(),
        userId: userId,
        payload: rec,
        sourceModule: 'SpartanNervousSystem',
        priority: rec.priority
      });
    });
  }
  
  /**
   * Determine if a modal should be activated proactively
   */
  private shouldActivateModalProactively(insights: DataInsights): boolean {
    // Check if user needs recovery guidance
    if (insights.currentStatus.recoveryStatus === 'poor' || 
        insights.currentStatus.recoveryStatus === 'critical') {
      return true;
    }
    
    // Check if user has declining performance
    if (insights.trends.performance === 'declining') {
      return true;
    }
    
    // Check if user has low adherence
    if (insights.trends.adherence === 'poor') {
      return true;
    }
    
    return false;
  }
  
  /**
   * Monitor system and act proactively
   */
  private async monitorAndActProactively(): Promise<void> {
    try {
      // Get current data insights
      const insights = await dataManagementService.generateInsights();
      
      if (insights) {
        // Check if we should proactively activate a modal
        const shouldActivateModal = this.shouldActivateModalProactively(insights);
        
        if (shouldActivateModal) {
          const action: ProactiveAction = {
            id: `proactive_${Date.now()}_modal`,
            type: 'modal_activation',
            title: 'Activación Proactiva de Modal',
            description: 'El sistema ha detectado que sería beneficioso activar un modal específico.',
            priority: 'medium',
            timestamp: new Date(),
            executionTime: new Date(Date.now() + 5000), // Execute in 5 seconds
            executed: false
          };
          
          this.proactiveActions.push(action);
          
          // Emit proactive event
          this.emitEvent({
            type: 'system_proactive',
            timestamp: new Date(),
            userId: '', // Would be populated in real implementation
            payload: action,
            sourceModule: 'SpartanNervousSystem',
            priority: 'medium'
          });
        }
        
        // Check if we should send a proactive chat message
        const shouldSendChatMessage = this.shouldSendChatMessageProactively(insights);
        
        if (shouldSendChatMessage) {
          const action: ProactiveAction = {
            id: `proactive_${Date.now()}_chat`,
            type: 'chat_message',
            title: 'Mensaje Proactivo de Chat',
            description: 'El sistema ha detectado que sería beneficioso enviar un mensaje proactivo al usuario.',
            priority: 'medium',
            timestamp: new Date(),
            executionTime: new Date(Date.now() + 3000), // Execute in 3 seconds
            executed: false
          };
          
          this.proactiveActions.push(action);
          
          // Emit proactive event
          this.emitEvent({
            type: 'system_proactive',
            timestamp: new Date(),
            userId: '', // Would be populated in real implementation
            payload: action,
            sourceModule: 'SpartanNervousSystem',
            priority: 'medium'
          });
        }
      }
    } catch (error) {
      logger.error('SpartanNervousSystem: Error in proactive monitoring', error);
    }
  }
  
  /**
   * Determine if a chat message should be sent proactively
   */
  private shouldSendChatMessageProactively(insights: DataInsights): boolean {
    // Check if user has critical recovery status
    if (insights.currentStatus.recoveryStatus === 'critical') {
      return true;
    }
    
    // Check if user has very low energy
    if (insights.currentStatus.energyLevel === 'veryLow') {
      return true;
    }
    
    // Check if user needs rest
    if (insights.currentStatus.trainingReadiness === 'rest') {
      return true;
    }
    
    return false;
  }
  
  /**
   * Execute a proactive action
   */
  private async executeProactiveAction(action: ProactiveAction): Promise<void> {
    try {
      switch (action.type) {
        case 'modal_activation':
          // Activate a relevant modal based on the context
          // This would require more detailed implementation
          logger.info(`SpartanNervousSystem: Executing proactive modal activation - ${action.title}`);
          break;
          
        case 'chat_message':
          // Send a proactive message to Chat Maestro
          // This would require integration with the chat service
          logger.info(`SpartanNervousSystem: Executing proactive chat message - ${action.title}`);
          break;
          
        case 'data_update':
          // Update data based on proactive action
          logger.info(`SpartanNervousSystem: Executing proactive data update - ${action.title}`);
          break;
          
        case 'recommendation':
          // Generate and send a recommendation
          logger.info(`SpartanNervousSystem: Executing proactive recommendation - ${action.title}`);
          break;
          
        case 'neural_feedback_session':
          // Start a neurofeedback session
          logger.info(`SpartanNervousSystem: Executing neurofeedback session - ${action.title}`);
          break;
      }
      
      // Mark action as executed
      action.executed = true;
      action.result = { success: true, timestamp: new Date() };
    } catch (error) {
      logger.error(`SpartanNervousSystem: Error executing proactive action ${action.id}`, error);
      action.result = { success: false, error: error, timestamp: new Date() };
    }
  }
  
  /**
   * Get current system alerts
   */
  getAlerts(): SystemAlert[] {
    // Filter out expired alerts
    const now = new Date();
    this.alerts = this.alerts.filter(alert => {
      if (alert.autoDismiss) {
        const expiryTime = new Date(alert.timestamp.getTime() + alert.autoDismiss * 1000);
        return now < expiryTime;
      }
      return true;
    });
    
    return [...this.alerts];
  }
  
  /**
   * Get current system recommendations
   */
  getRecommendations(): SystemRecommendation[] {
    return [...this.recommendations];
  }
  
  /**
   * Get current proactive actions
   */
  getProactiveActions(): ProactiveAction[] {
    return [...this.proactiveActions];
  }
  
  /**
   * Dismiss an alert
   */
  dismissAlert(alertId: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }
  
  /**
   * Execute a recommendation
   */
  async executeRecommendation(recId: string): Promise<boolean> {
    const recommendation = this.recommendations.find(rec => rec.id === recId);
    
    if (recommendation && recommendation.actionable) {
      // In a real implementation, this would execute the recommendation
      logger.info(`SpartanNervousSystem: Executing recommendation ${recId}`);
      
      // Remove the recommendation after execution
      this.recommendations = this.recommendations.filter(rec => rec.id !== recId);
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Get learning memory
   */
  getLearningMemory(): Map<string, any> {
    return new Map(this.learningMemory);
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
export const spartanNervousSystem = SpartanNervousSystem.getInstance();