// Modal scalability engine for Spartan

import {
  SpartanModal,
  ModalRegistry,
  ModalConfiguration,
  ModalContext,
  ModalActivationRequest,
  ModalActivationResponse,
  ModalEvent,
  ModalAnalytics,
  ModalPerformanceMetrics,
  ModalConflict,
  CrossModalCommunication,
  ModalLifecycleEvent,
  ModalDiscoveryMetadata
} from './spartan-modal-types';

export class SpartanModalEngine {
  private registry: ModalRegistry = {};
  private configuration: ModalConfiguration;
  private analytics: ModalAnalytics;
  private activeModals: Set<string> = new Set();
  private eventHistory: ModalEvent[] = [];
  private performanceMetrics: Map<string, ModalPerformanceMetrics> = new Map();
  private conflicts: ModalConflict[] = [];
  private communicationLog: CrossModalCommunication[] = [];
  private lifecycleEvents: ModalLifecycleEvent[] = [];
  private discoveryMetadata: Map<string, ModalDiscoveryMetadata> = new Map();

  constructor(configuration?: ModalConfiguration) {
    this.configuration = configuration || this.getDefaultConfiguration();
    this.analytics = this.initializeAnalytics();
  }

  private getDefaultConfiguration(): ModalConfiguration {
    return {
      maxConcurrentModals: 10,
      resourceAllocationStrategy: 'balanced',
      autoScalingEnabled: true,
      memoryLimitPerModal: 512,
      cpuLimitPerModal: 25,
      networkLimitPerModal: 10,
      enableModalCaching: true,
      cacheTTL: 3600, // 1 hour
      lazyLoadingEnabled: true,
      preloadStrategies: {}
    };
  }

  private initializeAnalytics(): ModalAnalytics {
    return {
      totalModals: 0,
      activeModals: 0,
      systemPerformance: {
        averageResponseTime: 0,
        systemLoad: 0,
        resourceUtilization: {
          memory: 0,
          cpu: 0,
          network: 0
        }
      },
      modalMetrics: {},
      modalEvents: [],
      lastAnalysis: new Date()
    };
  }

  public registerModal(modal: SpartanModal): boolean {
    try {
      // Validate modal
      if (!this.validateModal(modal)) {
        this.logEvent({
          type: 'modal_error',
          modalId: modal.id,
          payload: { error: 'Invalid modal module' },
          timestamp: new Date(),
          severity: 'error'
        });
        return false;
      }

      // Register modal
      this.registry[modal.id] = modal;
      this.analytics.totalModals = Object.keys(this.registry).length;

      // Initialize performance metrics
      this.performanceMetrics.set(modal.id, {
        modalId: modal.id,
        activationCount: 0,
        averageExecutionTime: 0,
        errorRate: 0,
        resourceUsage: {
          averageMemory: 0,
          averageCpu: 0,
          averageNetwork: 0
        },
        userSatisfaction: 0,
        lastUpdated: new Date()
      });

      // Log registration event
      this.logEvent({
        type: 'modal_registered',
        modalId: modal.id,
        payload: { name: modal.name, version: modal.version },
        timestamp: new Date(),
        severity: 'info'
      });

      // Record lifecycle event
      this.recordLifecycleEvent(modal.id, 'initialized');

      return true;
    } catch (error) {
      this.logEvent({
        type: 'modal_error',
        modalId: modal.id,
        payload: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date(),
        severity: 'error'
      });
      return false;
    }
  }

  private validateModal(modal: SpartanModal): boolean {
    // Check required fields
    if (!modal.id || !modal.name || !modal.version) {
      return false;
    }

    // Check for duplicate IDs
    if (this.registry[modal.id]) {
      return false;
    }

    // Validate dependencies exist
    for (const dependency of modal.dependencies) {
      if (!this.registry[dependency]) {
        return false;
      }
    }

    return true;
  }

  public unregisterModal(modalId: string): boolean {
    if (!this.registry[modalId]) {
      return false;
    }

    // Deactivate if currently active
    if (this.activeModals.has(modalId)) {
      this.deactivateModal(modalId);
    }

    // Remove from registry
    delete this.registry[modalId];
    this.analytics.totalModals = Object.keys(this.registry).length;

    // Remove performance metrics
    this.performanceMetrics.delete(modalId);

    return true;
  }

  public activateModal(request: ModalActivationRequest): ModalActivationResponse {
    const modal = this.registry[request.modalId];
    
    if (!modal) {
      return {
        success: false,
        modalId: request.modalId,
        activated: false,
        errorMessage: 'Modal not found',
        resourceUsage: { memory: 0, cpu: 0, network: 0 },
        executionTime: 0
      };
    }

    // Check if already active
    if (this.activeModals.has(request.modalId)) {
      return {
        success: true,
        modalId: request.modalId,
        activated: true,
        resourceUsage: { memory: 0, cpu: 0, network: 0 },
        executionTime: 0
      };
    }

    // Check resource limits
    if (!this.checkResourceAvailability(request)) {
      this.logEvent({
        type: 'resource_limit_exceeded',
        modalId: request.modalId,
        payload: { requiredResources: request.requiredResources },
        timestamp: new Date(),
        severity: 'warning'
      });

      return {
        success: false,
        modalId: request.modalId,
        activated: false,
        errorMessage: 'Insufficient resources',
        resourceUsage: { memory: 0, cpu: 0, network: 0 },
        executionTime: 0
      };
    }

    // Check for conflicts
    const conflicts = this.detectConflicts(request);
    if (conflicts.length > 0) {
      this.conflicts.push(...conflicts);
      
      // Try to resolve conflicts
      if (!this.resolveConflicts(conflicts)) {
        return {
          success: false,
          modalId: request.modalId,
          activated: false,
          errorMessage: 'Unresolved conflicts',
          resourceUsage: { memory: 0, cpu: 0, network: 0 },
          executionTime: 0
        };
      }
    }

    // Activate modal
    this.activeModals.add(request.modalId);
    this.analytics.activeModals = this.activeModals.size;

    // Update performance metrics
    const metrics = this.performanceMetrics.get(request.modalId);
    if (metrics) {
      metrics.activationCount++;
      metrics.lastUpdated = new Date();
      this.performanceMetrics.set(request.modalId, metrics);
    }

    // Log activation event
    this.logEvent({
      type: 'modal_activated',
      modalId: request.modalId,
      payload: { reason: request.reason, priority: request.priority },
      timestamp: new Date(),
      severity: 'info'
    });

    // Record lifecycle event
    this.recordLifecycleEvent(request.modalId, 'activated');

    return {
      success: true,
      modalId: request.modalId,
      activated: true,
      resourceUsage: request.requiredResources,
      executionTime: Date.now() - request.context.systemLoad.cpuUsage // Simplified
    };
  }

  public deactivateModal(modalId: string): boolean {
    if (!this.activeModals.has(modalId)) {
      return false;
    }

    this.activeModals.delete(modalId);
    this.analytics.activeModals = this.activeModals.size;

    // Log deactivation event
    this.logEvent({
      type: 'modal_deactivated',
      modalId: modalId,
      payload: {},
      timestamp: new Date(),
      severity: 'info'
    });

    // Record lifecycle event
    this.recordLifecycleEvent(modalId, 'deactivated');

    return true;
  }

  private checkResourceAvailability(request: ModalActivationRequest): boolean {
    // Simplified resource check
    // In a real implementation, this would check actual system resources
    const totalMemory = Array.from(this.activeModals).reduce((sum, id) => {
      const modal = this.registry[id];
      // This is a placeholder - in reality we'd track actual resource usage
      return sum + (modal ? 100 : 0);
    }, 0);

    const totalCpu = this.activeModals.size * 5; // Placeholder
    const totalNetwork = this.activeModals.size * 2; // Placeholder

    return (
      totalMemory + request.requiredResources.memory <= 
        this.configuration.memoryLimitPerModal * this.configuration.maxConcurrentModals &&
      totalCpu + request.requiredResources.cpu <= 
        this.configuration.cpuLimitPerModal * this.configuration.maxConcurrentModals &&
      totalNetwork + request.requiredResources.network <= 
        this.configuration.networkLimitPerModal * this.configuration.maxConcurrentModals
    );
  }

  private detectConflicts(request: ModalActivationRequest): ModalConflict[] {
    const conflicts: ModalConflict[] = [];
    
    // Check for resource conflicts
    for (const activeId of this.activeModals) {
      const activeModal = this.registry[activeId];
      if (!activeModal) continue;
      
      // Check if both modals require the same resources
      if (activeModal.category === this.registry[request.modalId].category) {
        conflicts.push({
          modalIds: [request.modalId, activeId],
          conflictType: 'resource',
          description: `Resource conflict between ${request.modalId} and ${activeId}`,
          resolutionStrategy: 'priority',
          resolved: false,
          timestamp: new Date()
        });
      }
    }

    return conflicts;
  }

  private resolveConflicts(conflicts: ModalConflict[]): boolean {
    // Simplified conflict resolution based on priority
    for (const conflict of conflicts) {
      if (conflict.resolutionStrategy === 'priority') {
        // In a real implementation, we would implement more sophisticated resolution
        conflict.resolved = true;
        conflict.resolution = 'Priority-based resolution applied';
      }
    }
    
    return true;
  }

  public getCompatibleModals(context: ModalContext): string[] {
    const compatible: string[] = [];
    
    for (const [id, modal] of Object.entries(this.registry)) {
      if (!modal.enabled) continue;
      
      // Check if any activation triggers match the context
      for (const trigger of modal.activationTriggers) {
        if (
          trigger.test(context.conversationTopic) || 
          trigger.test(context.userIntent) ||
          context.relevantDataPoints.some(dp => trigger.test(dp))
        ) {
          compatible.push(id);
          break;
        }
      }
    }
    
    // Sort by priority
    return compatible.sort((a, b) => {
      const modA = this.registry[a];
      const modB = this.registry[b];
      return (modB?.priority || 0) - (modA?.priority || 0);
    });
  }

  public sendCrossModalMessage(
    sender: string,
    receiver: string,
    message: string,
    data: any,
    requiresResponse: boolean = false
  ): boolean {
    // Validate modals exist
    if (!this.registry[sender] || !this.registry[receiver]) {
      return false;
    }
    
    // Log communication
    this.communicationLog.push({
      sender,
      receiver,
      message,
      data,
      timestamp: new Date(),
      requiresResponse
    });
    
    // In a real implementation, this would actually send the message to the receiver modal
    console.log(`Cross-modal message from ${sender} to ${receiver}: ${message}`);
    
    return true;
  }

  public updateConfiguration(newConfig: Partial<ModalConfiguration>): void {
    this.configuration = { ...this.configuration, ...newConfig };
  }

  public getConfiguration(): ModalConfiguration {
    return { ...this.configuration };
  }

  public getRegistry(): ModalRegistry {
    return { ...this.registry };
  }

  public getActiveModals(): string[] {
    return Array.from(this.activeModals);
  }

  public getPerformanceMetrics(modalId?: string): ModalPerformanceMetrics | Map<string, ModalPerformanceMetrics> {
    if (modalId) {
      return this.performanceMetrics.get(modalId) || {
        modalId,
        activationCount: 0,
        averageExecutionTime: 0,
        errorRate: 0,
        resourceUsage: {
          averageMemory: 0,
          averageCpu: 0,
          averageNetwork: 0
        },
        userSatisfaction: 0,
        lastUpdated: new Date()
      };
    }
    
    return new Map(this.performanceMetrics);
  }

  private logEvent(event: ModalEvent): void {
    this.eventHistory.push(event);
    this.analytics.modalEvents.push(event);
    
    // Limit event history
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }
    
    if (this.analytics.modalEvents.length > 100) {
      this.analytics.modalEvents = this.analytics.modalEvents.slice(-100);
    }
  }

  public getEventHistory(): ModalEvent[] {
    return [...this.eventHistory];
  }

  public getAnalytics(): ModalAnalytics {
    // Update active modals count
    this.analytics.activeModals = this.activeModals.size;
    
    // Update system performance metrics (simplified)
    this.analytics.systemPerformance.averageResponseTime = 100; // Placeholder
    this.analytics.systemPerformance.systemLoad = 25; // Placeholder
    
    return { ...this.analytics };
  }

  public getConflicts(): ModalConflict[] {
    return [...this.conflicts];
  }

  public getCommunicationLog(): CrossModalCommunication[] {
    return [...this.communicationLog];
  }

  public recordLifecycleEvent(modalId: string, eventType: ModalLifecycleEvent['eventType'], details?: any): void {
    this.lifecycleEvents.push({
      modalId,
      eventType,
      timestamp: new Date(),
      details
    });
  }

  public getLifecycleEvents(modalId?: string): ModalLifecycleEvent[] {
    if (modalId) {
      return this.lifecycleEvents.filter(event => event.modalId === modalId);
    }
    return [...this.lifecycleEvents];
  }

  public registerDiscoveryMetadata(metadata: ModalDiscoveryMetadata): void {
    this.discoveryMetadata.set(metadata.id, metadata);
  }

  public getDiscoveryMetadata(modalId?: string): ModalDiscoveryMetadata | Map<string, ModalDiscoveryMetadata> {
    if (modalId) {
      return this.discoveryMetadata.get(modalId) || {
        id: modalId,
        name: '',
        version: '',
        description: '',
        category: '',
        capabilities: [],
        dependencies: [],
        supportedPlatforms: [],
        integrationType: 'embedded',
        registrationEndpoint: '',
        healthCheckEndpoint: '',
        dataExchangeFormat: ''
      };
    }
    
    return new Map(this.discoveryMetadata);
  }
}