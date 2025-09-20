// Modal service for Spartan

import { SpartanModalEngine } from './spartan-modal-engine';
import {
  SpartanModal,
  ModalConfiguration,
  ModalContext,
  ModalActivationRequest,
  ModalActivationResponse,
  ModalInstallationRequest,
  ModalInstallationResponse,
  ModalAnalytics,
  ModalPerformanceMetrics,
  ModalDataExchange
} from './spartan-modal-types';

export class SpartanModalService {
  private engine: SpartanModalEngine;
  private isModalSystemEnabled: boolean;
  private modalLoader?: (modalId: string) => Promise<SpartanModal | null>;
  private modalExecutor?: (modalId: string, context: ModalContext, inputData?: any) => Promise<any>;
  private dataExchangeHandler?: (exchange: ModalDataExchange) => Promise<boolean>;

  constructor(configuration?: ModalConfiguration) {
    this.engine = new SpartanModalEngine(configuration);
    this.isModalSystemEnabled = true;
  }

  /**
   * Enable or disable modal system
   */
  public setModalSystemEnabled(enabled: boolean): void {
    this.isModalSystemEnabled = enabled;
  }

  /**
   * Register a modal loader function
   */
  public registerModalLoader(loader: (modalId: string) => Promise<SpartanModal | null>): void {
    this.modalLoader = loader;
  }

  /**
   * Register a modal executor function
   */
  public registerModalExecutor(executor: (modalId: string, context: ModalContext, inputData?: any) => Promise<any>): void {
    this.modalExecutor = executor;
  }

  /**
   * Register a data exchange handler
   */
  public registerDataExchangeHandler(handler: (exchange: ModalDataExchange) => Promise<boolean>): void {
    this.dataExchangeHandler = handler;
  }

  /**
   * Install a new modal
   */
  public async installModal(request: ModalInstallationRequest): Promise<ModalInstallationResponse> {
    if (!this.isModalSystemEnabled || !this.modalLoader) {
      return {
        success: false,
        modalId: request.modalId,
        errorMessage: 'Modal system not enabled or modal loader not registered',
        installationTime: 0,
        dependenciesInstalled: []
      };
    }

    try {
      const startTime = Date.now();
      
      // Load the modal
      const modal = await this.modalLoader(request.modalId);
      
      if (!modal) {
        return {
          success: false,
          modalId: request.modalId,
          errorMessage: 'Failed to load modal',
          installationTime: Date.now() - startTime,
          dependenciesInstalled: []
        };
      }

      // Install dependencies first
      const dependenciesInstalled: string[] = [];
      for (const dependencyId of modal.dependencies) {
        // Check if dependency is already installed
        if (!this.engine.getRegistry()[dependencyId]) {
          const dependencyRequest: ModalInstallationRequest = {
            modalId: dependencyId,
            source: '', // Would be populated in real implementation
            checksum: '',
            dependencies: [],
            configuration: {}
          };
          
          const dependencyResult = await this.installModal(dependencyRequest);
          if (dependencyResult.success) {
            dependenciesInstalled.push(dependencyId);
          } else {
            return {
              success: false,
              modalId: request.modalId,
              errorMessage: `Failed to install dependency: ${dependencyId}`,
              installationTime: Date.now() - startTime,
              dependenciesInstalled
            };
          }
        }
      }

      // Register the modal
      const registered = this.engine.registerModal(modal);
      
      if (!registered) {
        return {
          success: false,
          modalId: request.modalId,
          errorMessage: 'Failed to register modal',
          installationTime: Date.now() - startTime,
          dependenciesInstalled
        };
      }

      return {
        success: true,
        modalId: request.modalId,
        installedVersion: modal.version,
        installationTime: Date.now() - startTime,
        dependenciesInstalled
      };
    } catch (error) {
      return {
        success: false,
        modalId: request.modalId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error during installation',
        installationTime: 0,
        dependenciesInstalled: []
      };
    }
  }

  /**
   * Uninstall a modal
   */
  public uninstallModal(modalId: string): boolean {
    if (!this.isModalSystemEnabled) {
      return false;
    }

    return this.engine.unregisterModal(modalId);
  }

  /**
   * Activate a modal based on context
   */
  public activateModalWithContext(context: ModalContext): ModalActivationResponse[] {
    if (!this.isModalSystemEnabled) {
      return [];
    }

    // Get compatible modals
    const compatibleIds = this.engine.getCompatibleModals(context);
    
    // Activate each compatible modal
    const responses: ModalActivationResponse[] = [];
    
    for (const modalId of compatibleIds) {
      const modal = this.engine.getRegistry()[modalId];
      if (!modal) continue;
      
      const request: ModalActivationRequest = {
        modalId,
        context,
        priority: 'medium',
        reason: 'Context-based activation',
        requiredResources: {
          memory: 100, // Placeholder values
          cpu: 5,
          network: 2
        }
      };
      
      const response = this.engine.activateModal(request);
      responses.push(response);
    }
    
    return responses;
  }

  /**
   * Execute a modal
   */
  public async executeModal(modalId: string, context: ModalContext, inputData?: any): Promise<any> {
    if (!this.isModalSystemEnabled || !this.modalExecutor) {
      throw new Error('Modal system not enabled or modal executor not registered');
    }

    // Check if modal is active
    if (!this.engine.getActiveModals().includes(modalId)) {
      // Try to activate it
      const activationRequest: ModalActivationRequest = {
        modalId,
        context,
        priority: 'medium',
        reason: 'Execution request',
        requiredResources: {
          memory: 100,
          cpu: 5,
          network: 2
        },
        inputData
      };
      
      const activationResponse = this.engine.activateModal(activationRequest);
      if (!activationResponse.success) {
        throw new Error(`Failed to activate modal: ${activationResponse.errorMessage}`);
      }
    }

    // Execute the modal
    return await this.modalExecutor(modalId, context, inputData);
  }

  /**
   * Get compatible modals for a context
   */
  public getCompatibleModals(context: ModalContext): string[] {
    if (!this.isModalSystemEnabled) {
      return [];
    }

    return this.engine.getCompatibleModals(context);
  }

  /**
   * Exchange data between modals
   */
  public async exchangeData(exchange: ModalDataExchange): Promise<boolean> {
    if (!this.isModalSystemEnabled || !this.dataExchangeHandler) {
      return false;
    }

    return await this.dataExchangeHandler(exchange);
  }

  /**
   * Update modal configuration
   */
  public updateConfiguration(newConfig: Partial<ModalConfiguration>): void {
    this.engine.updateConfiguration(newConfig);
  }

  /**
   * Get current configuration
   */
  public getConfiguration(): ModalConfiguration {
    return this.engine.getConfiguration();
  }

  /**
   * Get registry of installed modals
   */
  public getRegistry() {
    return this.engine.getRegistry();
  }

  /**
   * Get active modals
   */
  public getActiveModals(): string[] {
    return this.engine.getActiveModals();
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(modalId?: string): ModalPerformanceMetrics | Map<string, ModalPerformanceMetrics> {
    return this.engine.getPerformanceMetrics(modalId);
  }

  /**
   * Get system analytics
   */
  public getAnalytics(): ModalAnalytics {
    return this.engine.getAnalytics();
  }

  /**
   * Simulate user feedback for analytics
   */
  public recordUserFeedback(modalId: string, satisfaction: number, comments?: string): void {
    console.log(`User feedback recorded for ${modalId}: ${satisfaction}/5${comments ? ` - ${comments}` : ''}`);
    // In a real implementation, this would update analytics
  }
}