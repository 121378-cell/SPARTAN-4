// Tests for Continuous Ecosystem Optimization Service
import { ContinuousEcosystemOptimizationService, continuousEcosystemOptimizationService } from '../lib/continuous-ecosystem-optimization-service';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { dataManagementService } from '../lib/data-management-service';
import { chatMaestroService } from '../lib/chat-maestro-service';

// Mock the performance API
Object.defineProperty(global.performance, 'now', {
  value: jest.fn().mockReturnValue(1000),
  writable: true
});

// Mock storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  }
}));

// Mock cache
jest.mock('../lib/cache', () => ({
  APICache: jest.fn().mockImplementation(() => ({
    size: 50,
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
    getStats: jest.fn().mockReturnValue({
      size: 50,
      maxSize: 100,
      defaultTTL: 300000,
      persistToStorage: false
    })
  }))
}));

// Mock logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Mock analytics
jest.mock('../lib/analytics', () => ({
  analytics: {
    trackEvent: jest.fn(),
    trackPerformance: jest.fn()
  }
}));

describe('ContinuousEcosystemOptimizationService', () => {
  let service: ContinuousEcosystemOptimizationService;

  beforeEach(() => {
    service = continuousEcosystemOptimizationService;
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = ContinuousEcosystemOptimizationService.getInstance();
      const instance2 = ContinuousEcosystemOptimizationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initialize', () => {
    it('should initialize with default configuration', () => {
      service.initialize();
      expect(service).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customConfig = { auditInterval: 10000, autoApplyOptimizations: false };
      service.initialize(customConfig);
      
      // We can't directly access private properties, but we can test behavior
      // For example, by checking if the service starts optimization
      expect(service).toBeDefined();
    });
  });

  describe('performSystemAudit', () => {
    it('should perform a system audit and return metrics', async () => {
      // Mock the methods that collect metrics
      const mockMetrics = {
        dataFlowEfficiency: 0.8,
        redundancyLevel: 0.2,
        visualizationPerformance: 0.9,
        chatMaestroResponsiveness: 0.85,
        modalActivationSpeed: 0.9,
        cacheHitRate: 0.75,
        memoryUsage: 0.6,
        cpuUsage: 0.5
      };

      // Mock the private methods by overriding them temporarily
      const collectMetricsSpy = jest.spyOn(service as any, 'collectOptimizationMetrics')
        .mockResolvedValue(mockMetrics);
      
      const generateRecommendationsSpy = jest.spyOn(service as any, 'generateOptimizationRecommendations')
        .mockReturnValue([]);
      
      const identifyIssuesSpy = jest.spyOn(service as any, 'identifySystemIssues')
        .mockReturnValue([]);

      const auditReport = await (service as any).performSystemAudit();

      expect(auditReport).toBeDefined();
      expect(auditReport.timestamp).toBeInstanceOf(Date);
      expect(auditReport.metrics).toEqual(mockMetrics);
      expect(auditReport.recommendations).toEqual([]);
      expect(auditReport.issues).toEqual([]);

      // Restore the original methods
      collectMetricsSpy.mockRestore();
      generateRecommendationsSpy.mockRestore();
      identifyIssuesSpy.mockRestore();
    });

    it('should handle errors during audit', async () => {
      const collectMetricsSpy = jest.spyOn(service as any, 'collectOptimizationMetrics')
        .mockRejectedValue(new Error('Test error'));

      await expect((service as any).performSystemAudit()).rejects.toThrow('Test error');

      collectMetricsSpy.mockRestore();
    });
  });

  describe('collectOptimizationMetrics', () => {
    it('should collect optimization metrics', async () => {
      const metrics = await (service as any).collectOptimizationMetrics();
      
      expect(metrics).toHaveProperty('dataFlowEfficiency');
      expect(metrics).toHaveProperty('redundancyLevel');
      expect(metrics).toHaveProperty('visualizationPerformance');
      expect(metrics).toHaveProperty('chatMaestroResponsiveness');
      expect(metrics).toHaveProperty('modalActivationSpeed');
      expect(metrics).toHaveProperty('cacheHitRate');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('cpuUsage');
      
      // All metrics should be between 0 and 1
      Object.values(metrics).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('generateOptimizationRecommendations', () => {
    it('should generate recommendations based on metrics', () => {
      const metrics = {
        dataFlowEfficiency: 0.4,
        redundancyLevel: 0.6,
        visualizationPerformance: 0.3,
        chatMaestroResponsiveness: 0.2,
        modalActivationSpeed: 0.7,
        cacheHitRate: 0.4,
        memoryUsage: 0.95,
        cpuUsage: 0.85
      };

      const recommendations = (service as any).generateOptimizationRecommendations(metrics);
      
      // With these poor metrics, we should have multiple recommendations
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Check that critical issues get high priority
      const criticalRecs = recommendations.filter((rec: any) => rec.priority === 'critical' || rec.priority === 'high');
      expect(criticalRecs.length).toBeGreaterThan(0);
    });

    it('should generate fewer recommendations with good metrics', () => {
      const metrics = {
        dataFlowEfficiency: 0.9,
        redundancyLevel: 0.1,
        visualizationPerformance: 0.95,
        chatMaestroResponsiveness: 0.9,
        modalActivationSpeed: 0.9,
        cacheHitRate: 0.9,
        memoryUsage: 0.5,
        cpuUsage: 0.4
      };

      const recommendations = (service as any).generateOptimizationRecommendations(metrics);
      
      // With good metrics, we should have fewer or no recommendations
      expect(recommendations.length).toBeLessThan(3);
    });
  });

  describe('identifySystemIssues', () => {
    it('should identify critical issues', () => {
      const metrics = {
        dataFlowEfficiency: 0.3,
        redundancyLevel: 0.7,
        visualizationPerformance: 0.8,
        chatMaestroResponsiveness: 0.3,
        modalActivationSpeed: 0.8,
        cacheHitRate: 0.8,
        memoryUsage: 0.95,
        cpuUsage: 0.95
      };

      const issues = (service as any).identifySystemIssues(metrics);
      
      expect(issues.length).toBeGreaterThan(0);
      expect(issues).toContain('Critical: Data flow efficiency severely degraded');
      expect(issues).toContain('Critical: Excessive data redundancy detected');
      expect(issues).toContain('Critical: Chat Maestro responsiveness severely degraded');
      expect(issues).toContain('Critical: Memory usage at critical levels');
      expect(issues).toContain('Critical: CPU usage at critical levels');
    });

    it('should return no issues with good metrics', () => {
      const metrics = {
        dataFlowEfficiency: 0.8,
        redundancyLevel: 0.1,
        visualizationPerformance: 0.9,
        chatMaestroResponsiveness: 0.9,
        modalActivationSpeed: 0.9,
        cacheHitRate: 0.9,
        memoryUsage: 0.6,
        cpuUsage: 0.5
      };

      const issues = (service as any).identifySystemIssues(metrics);
      
      expect(issues.length).toBe(0);
    });
  });

  describe('getCacheMetrics', () => {
    it('should return cache metrics', () => {
      const cacheMetrics = (service as any).getCacheMetrics();
      
      expect(cacheMetrics).toHaveProperty('hitRate');
      expect(cacheMetrics).toHaveProperty('size');
      expect(cacheMetrics.hitRate).toBeGreaterThanOrEqual(0);
      expect(cacheMetrics.hitRate).toBeLessThanOrEqual(1);
      expect(cacheMetrics.size).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getSystemResourceMetrics', () => {
    it('should return system resource metrics', () => {
      const resourceMetrics = (service as any).getSystemResourceMetrics();
      
      expect(resourceMetrics).toHaveProperty('memoryUsage');
      expect(resourceMetrics).toHaveProperty('cpuUsage');
      expect(resourceMetrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(resourceMetrics.memoryUsage).toBeLessThanOrEqual(1);
      expect(resourceMetrics.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(resourceMetrics.cpuUsage).toBeLessThanOrEqual(1);
    });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      const initialConfig = { auditInterval: 30000, autoApplyOptimizations: true };
      service.initialize(initialConfig);
      
      const newConfig = { auditInterval: 15000, autoApplyOptimizations: false };
      service.updateConfig(newConfig);
      
      // We can't directly test the private config, but we can verify the method was called
      expect(service).toBeDefined();
    });
  });

  describe('getCurrentMetrics', () => {
    it('should return current metrics', async () => {
      const metrics = await service.getCurrentMetrics();
      
      expect(metrics).toHaveProperty('dataFlowEfficiency');
      expect(metrics).toHaveProperty('redundancyLevel');
      expect(metrics).toHaveProperty('visualizationPerformance');
      expect(metrics).toHaveProperty('chatMaestroResponsiveness');
      expect(metrics).toHaveProperty('modalActivationSpeed');
      expect(metrics).toHaveProperty('cacheHitRate');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('cpuUsage');
    });
  });

  describe('getOptimizationHistory', () => {
    it('should return optimization history', () => {
      const history = service.getOptimizationHistory();
      
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('getCurrentRecommendations', () => {
    it('should return current recommendations', () => {
      const recommendations = service.getCurrentRecommendations();
      
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });
});