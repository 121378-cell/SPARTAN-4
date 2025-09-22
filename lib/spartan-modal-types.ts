// Modal scalability types for Spartan

export interface SpartanModal {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  capabilities: string[];
  dependencies: string[];
  enabled: boolean;
  priority: number; // 1-10, higher means higher priority
  activationTriggers: RegExp[];
  requiredPermissions: string[];
  supportedPlatforms: ('web' | 'mobile' | 'desktop' | 'wearable')[];
  metadata: {
    author: string;
    createdAt: Date;
    lastUpdated: Date;
    compatibility: string[]; // List of compatible Spartan versions
    integrationType: 'embedded' | 'standalone' | 'hybrid';
    // Additional metadata for dynamic adaptation
    intensity?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    series?: number;
    duration?: number; // in minutes
    scheduledTime?: Date;
  };
}

export interface ModalRegistry {
  [modalId: string]: SpartanModal;
}

export interface ModalConfiguration {
  maxConcurrentModals: number;
  resourceAllocationStrategy: 'balanced' | 'priority' | 'performance';
  autoScalingEnabled: boolean;
  memoryLimitPerModal: number; // in MB
  cpuLimitPerModal: number; // in percentage
  networkLimitPerModal: number; // in Mbps
  enableModalCaching: boolean;
  cacheTTL: number; // in seconds
  lazyLoadingEnabled: boolean;
  preloadStrategies: {
    [modalId: string]: 'eager' | 'lazy' | 'smart';
  };
}

export interface ModalContext {
  userId: string;
  conversationTopic: string;
  userIntent: string;
  relevantDataPoints: string[];
  activeModals: string[];
  activationHistory: {
    modalId: string;
    timestamp: Date;
    reason: string;
  }[];
  systemLoad: {
    cpuUsage: number;
    memoryUsage: number;
    networkUsage: number;
  };
  platform: 'web' | 'mobile' | 'desktop' | 'wearable';
}

export interface ModalActivationRequest {
  modalId: string;
  context: ModalContext;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  requiredResources: {
    memory: number; // in MB
    cpu: number; // in percentage
    network: number; // in Mbps
  };
  inputData?: any;
}

export interface ModalActivationResponse {
  success: boolean;
  modalId: string;
  activated: boolean;
  errorMessage?: string;
  resourceUsage: {
    memory: number; // in MB
    cpu: number; // in percentage
    network: number; // in Mbps
  };
  executionTime: number; // in milliseconds
  outputData?: any;
}

export interface ModalEvent {
  type: 'modal_registered' | 'modal_activated' | 'modal_deactivated' | 
        'resource_limit_exceeded' | 'modal_error' | 'scaling_event' | 'data_exchange';
  modalId?: string;
  payload: any;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface ModalPerformanceMetrics {
  modalId: string;
  activationCount: number;
  averageExecutionTime: number; // in milliseconds
  errorRate: number; // 0-1
  resourceUsage: {
    averageMemory: number; // in MB
    averageCpu: number; // in percentage
    averageNetwork: number; // in Mbps
  };
  userSatisfaction: number; // 1-5
  lastUpdated: Date;
}

export interface ModalAnalytics {
  totalModals: number;
  activeModals: number;
  systemPerformance: {
    averageResponseTime: number; // in milliseconds
    systemLoad: number; // 0-100
    resourceUtilization: {
      memory: number; // 0-100
      cpu: number; // 0-100
      network: number; // 0-100
    };
  };
  modalMetrics: {
    [modalId: string]: ModalPerformanceMetrics;
  };
  modalEvents: ModalEvent[];
  lastAnalysis: Date;
}

export interface ModalIntegrationInterface {
  initialize(config: any): Promise<boolean>;
  processRequest(context: ModalContext, inputData?: any): Promise<any>;
  cleanup(): Promise<boolean>;
  getCapabilities(): string[];
  getRequiredResources(): {
    memory: number;
    cpu: number;
    network: number;
  };
  getVersion(): string;
}

export interface ModalInstallationRequest {
  modalId: string;
  source: string; // URL or file path
  checksum: string;
  dependencies: string[];
  configuration: any;
}

export interface ModalInstallationResponse {
  success: boolean;
  modalId: string;
  installedVersion?: string;
  errorMessage?: string;
  installationTime: number; // in milliseconds
  dependenciesInstalled: string[];
}

export interface CrossModalCommunication {
  sender: string;
  receiver: string;
  message: string;
  data: any;
  timestamp: Date;
  requiresResponse: boolean;
}

export interface ModalConflict {
  modalIds: string[];
  conflictType: 'resource' | 'data' | 'recommendation' | 'activation';
  description: string;
  resolutionStrategy: 'priority' | 'consensus' | 'user_choice' | 'defer';
  resolved: boolean;
  resolution?: string;
  timestamp: Date;
}

export interface ModalDataExchange {
  sourceModal: string;
  targetModal: string;
  dataType: string;
  data: any;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface ModalLifecycleEvent {
  modalId: string;
  eventType: 'initialized' | 'activated' | 'processing' | 'completed' | 'deactivated' | 'error';
  timestamp: Date;
  details?: any;
}

export interface ModalDiscoveryMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  capabilities: string[];
  dependencies: string[];
  supportedPlatforms: ('web' | 'mobile' | 'desktop' | 'wearable')[];
  integrationType: 'embedded' | 'standalone' | 'hybrid';
  registrationEndpoint: string;
  healthCheckEndpoint: string;
  dataExchangeFormat: string;
}