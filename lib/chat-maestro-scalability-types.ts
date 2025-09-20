// Cognitive scalability types for Chat Maestro

export interface CompetencyModule {
  id: string;
  name: string;
  version: string;
  description: string;
  domain: string;
  capabilities: string[];
  dependencies: string[];
  enabled: boolean;
  priority: number; // 1-10, higher means higher priority
  activationTriggers: RegExp[];
  requiredPermissions: string[];
  metadata: {
    author: string;
    createdAt: Date;
    lastUpdated: Date;
    compatibility: string[]; // List of compatible Chat Maestro versions
  };
}

export interface CompetencyRegistry {
  [competencyId: string]: CompetencyModule;
}

export interface ScalabilityConfiguration {
  maxConcurrentCompetencies: number;
  resourceAllocationStrategy: 'balanced' | 'priority' | 'performance';
  autoScalingEnabled: boolean;
  memoryLimitPerCompetency: number; // in MB
  cpuLimitPerCompetency: number; // in percentage
  networkLimitPerCompetency: number; // in Mbps
  enableCompetencyCaching: boolean;
  cacheTTL: number; // in seconds
}

export interface CompetencyContext {
  userId: string;
  conversationTopic: string;
  userIntent: string;
  relevantDataPoints: string[];
  currentCompetencies: string[];
  activationHistory: {
    competencyId: string;
    timestamp: Date;
    reason: string;
  }[];
  systemLoad: {
    cpuUsage: number;
    memoryUsage: number;
    networkUsage: number;
  };
}

export interface CompetencyActivationRequest {
  competencyId: string;
  context: CompetencyContext;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  requiredResources: {
    memory: number; // in MB
    cpu: number; // in percentage
    network: number; // in Mbps
  };
}

export interface CompetencyActivationResponse {
  success: boolean;
  competencyId: string;
  activated: boolean;
  errorMessage?: string;
  resourceUsage: {
    memory: number; // in MB
    cpu: number; // in percentage
    network: number; // in Mbps
  };
  executionTime: number; // in milliseconds
}

export interface ScalabilityEvent {
  type: 'competency_registered' | 'competency_activated' | 'competency_deactivated' | 
        'resource_limit_exceeded' | 'competency_error' | 'scaling_event';
  competencyId?: string;
  payload: any;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface CompetencyPerformanceMetrics {
  competencyId: string;
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

export interface ScalabilityAnalytics {
  totalCompetencies: number;
  activeCompetencies: number;
  systemPerformance: {
    averageResponseTime: number; // in milliseconds
    systemLoad: number; // 0-100
    resourceUtilization: {
      memory: number; // 0-100
      cpu: number; // 0-100
      network: number; // 0-100
    };
  };
  competencyMetrics: {
    [competencyId: string]: CompetencyPerformanceMetrics;
  };
  scalabilityEvents: ScalabilityEvent[];
  lastAnalysis: Date;
}

export interface CompetencyIntegrationInterface {
  initialize(): Promise<boolean>;
  processRequest(context: CompetencyContext): Promise<any>;
  cleanup(): Promise<boolean>;
  getCapabilities(): string[];
  getRequiredResources(): {
    memory: number;
    cpu: number;
    network: number;
  };
}

export interface ModuleInstallationRequest {
  moduleId: string;
  source: string; // URL or file path
  checksum: string;
  dependencies: string[];
  configuration: any;
}

export interface ModuleInstallationResponse {
  success: boolean;
  moduleId: string;
  installedVersion?: string;
  errorMessage?: string;
  installationTime: number; // in milliseconds
  dependenciesInstalled: string[];
}

export interface CrossCompetencyCommunication {
  sender: string;
  receiver: string;
  message: string;
  data: any;
  timestamp: Date;
  requiresResponse: boolean;
}

export interface CompetencyConflict {
  competencyIds: string[];
  conflictType: 'resource' | 'data' | 'recommendation' | 'activation';
  description: string;
  resolutionStrategy: 'priority' | 'consensus' | 'user_choice' | 'defer';
  resolved: boolean;
  resolution?: string;
  timestamp: Date;
}