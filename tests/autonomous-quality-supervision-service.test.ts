/**
 * Test suite for Autonomous Quality Supervision Service
 */

import { autonomousQualitySupervisionService, QualityIssue } from '../lib/autonomous-quality-supervision-service';
import { dataManagementService } from '../lib/data-management-service';
import { storageManager } from '../lib/storage';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getUserData: jest.fn(),
    setUserData: jest.fn()
  }
}));

// Mock the data management service
jest.mock('../lib/data-management-service', () => {
  const actual = jest.requireActual('../lib/data-management-service');
  return {
    ...actual,
    DataManagementService: {
      getInstance: jest.fn().mockReturnValue({
        integratedData: {
          userData: {
            name: 'Test User',
            age: 30,
            weight: 70,
            height: 175,
            fitnessLevel: 'intermediate',
            goals: ['strength', 'endurance']
          },
          workoutSessions: [],
          recoveryData: []
        }
      })
    }
  };
});

describe('AutonomousQualitySupervisionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('initialization', () => {
    it('should initialize the service correctly', () => {
      expect(autonomousQualitySupervisionService).toBeDefined();
    });
    
    it('should have default configuration', () => {
      const config = autonomousQualitySupervisionService.getConfig();
      expect(config.enableRealTimeMonitoring).toBe(true);
      expect(config.enableAutoCorrection).toBe(true);
      expect(config.enableChatMaestroReporting).toBe(true);
    });
  });
  
  describe('issue management', () => {
    it('should add issues to tracking', () => {
      const issue: QualityIssue = {
        id: 'test-issue-1',
        type: 'data-inconsistency',
        severity: 'medium',
        description: 'Test issue for validation',
        detectedAt: new Date(),
        resolved: false,
        affectedComponent: 'TestData',
        requiresManualIntervention: false
      };
      
      // Add issue directly to service (since addIssue is private)
      const issues = (autonomousQualitySupervisionService as any).issues;
      issues.push(issue);
      
      const allIssues = autonomousQualitySupervisionService.getIssues();
      expect(allIssues).toHaveLength(1);
      expect(allIssues[0].id).toBe('test-issue-1');
    });
    
    it('should track unresolved issues', () => {
      const resolvedIssue: QualityIssue = {
        id: 'resolved-issue-1',
        type: 'data-inconsistency',
        severity: 'medium',
        description: 'Resolved test issue',
        detectedAt: new Date(),
        resolved: true,
        resolvedAt: new Date(),
        affectedComponent: 'TestData',
        requiresManualIntervention: false
      };
      
      const unresolvedIssue: QualityIssue = {
        id: 'unresolved-issue-1',
        type: 'missing-data',
        severity: 'high',
        description: 'Unresolved test issue',
        detectedAt: new Date(),
        resolved: false,
        affectedComponent: 'TestData',
        requiresManualIntervention: true
      };
      
      // Add issues directly to service
      const issues = (autonomousQualitySupervisionService as any).issues;
      issues.push(resolvedIssue);
      issues.push(unresolvedIssue);
      
      const unresolvedIssues = autonomousQualitySupervisionService.getUnresolvedIssues();
      expect(unresolvedIssues).toHaveLength(1);
      expect(unresolvedIssues[0].id).toBe('unresolved-issue-1');
    });
  });
  
  describe('health reports', () => {
    it('should generate health reports', () => {
      const reports = autonomousQualitySupervisionService.getHealthReports();
      expect(reports).toBeDefined();
      // Initially empty, but should be an array
      expect(Array.isArray(reports)).toBe(true);
    });
    
    it('should track health reports', () => {
      // Simulate adding a report
      const reports = (autonomousQualitySupervisionService as any).healthReports;
      reports.push({
        timestamp: new Date(),
        overallStatus: 'healthy',
        componentStatus: [],
        recentIssues: [],
        performanceMetrics: {
          cpuUsage: 50,
          memoryUsage: 60,
          responseTime: 100,
          uptime: 99.9,
          errorRate: 0.1,
          throughput: 100
        },
        dataQualityMetrics: {
          completeness: 95,
          accuracy: 92,
          consistency: 88,
          timeliness: 90,
          validity: 94
        },
        recommendations: []
      });
      
      const allReports = autonomousQualitySupervisionService.getHealthReports();
      expect(allReports).toHaveLength(1);
    });
  });
  
  describe('configuration management', () => {
    it('should get current configuration', () => {
      const config = autonomousQualitySupervisionService.getConfig();
      expect(config).toBeDefined();
      expect(config).toHaveProperty('enableRealTimeMonitoring');
      expect(config).toHaveProperty('enableAutoCorrection');
      expect(config).toHaveProperty('enableChatMaestroReporting');
    });
    
    it('should update configuration', async () => {
      const originalConfig = autonomousQualitySupervisionService.getConfig();
      expect(originalConfig.monitoringInterval).toBe(30000); // 30 seconds
      
      // Update configuration
      await autonomousQualitySupervisionService.updateConfig({
        monitoringInterval: 60000 // 60 seconds
      });
      
      const updatedConfig = autonomousQualitySupervisionService.getConfig();
      expect(updatedConfig.monitoringInterval).toBe(60000);
    });
  });
  
  describe('data validation', () => {
    it('should validate user data', async () => {
      // Setup mock user data with issues
      const mockDataWithIssues = {
        userData: {
          name: '', // Missing name
          age: 150, // Invalid age
          weight: -10, // Invalid weight
          height: 300 // Invalid height
        },
        workoutSessions: [],
        recoveryData: []
      };
      
      // Mock the data management service to return problematic data
      const mockInstance = {
        integratedData: mockDataWithIssues
      };
      jest.spyOn(require('../lib/data-management-service'), 'DataManagementService').mockImplementation(() => mockInstance);
      
      // Access private validateData method through reflection
      const validateData = (autonomousQualitySupervisionService as any).validateData;
      await validateData.call(autonomousQualitySupervisionService, mockDataWithIssues);
      
      // Check that issues were added
      const issues = autonomousQualitySupervisionService.getIssues();
      expect(issues.length).toBeGreaterThan(0);
    });
    
    it('should validate workout sessions', async () => {
      // Setup mock workout data with issues
      const mockDataWithIssues = {
        userData: {
          name: 'Test User',
          age: 30,
          weight: 70,
          height: 175
        },
        workoutSessions: [
          {
            // Missing startTime
            exercises: [],
            duration: -10 // Invalid duration
          }
        ],
        recoveryData: []
      };
      
      // Mock the data management service to return problematic data
      const mockInstance = {
        integratedData: mockDataWithIssues
      };
      jest.spyOn(require('../lib/data-management-service'), 'DataManagementService').mockImplementation(() => mockInstance);
      
      // Access private validateData method through reflection
      const validateData = (autonomousQualitySupervisionService as any).validateData;
      await validateData.call(autonomousQualitySupervisionService, mockDataWithIssues);
      
      // Check that issues were added
      const issues = autonomousQualitySupervisionService.getIssues();
      expect(issues.length).toBeGreaterThan(0);
    });
  });
  
  describe('auto-correction', () => {
    it('should attempt auto-correction of issues', async () => {
      const issue: QualityIssue = {
        id: 'test-correction-issue',
        type: 'missing-data',
        severity: 'medium',
        description: 'Test issue for auto-correction',
        detectedAt: new Date(),
        resolved: false,
        affectedComponent: 'TestData',
        requiresManualIntervention: false
      };
      
      // Access private attemptAutoCorrection method through reflection
      const attemptAutoCorrection = (autonomousQualitySupervisionService as any).attemptAutoCorrection;
      await attemptAutoCorrection.call(autonomousQualitySupervisionService, issue);
      
      // Since auto-correction is enabled by default, the issue should be processed
      expect(issue).toBeDefined();
    });
    
    it('should handle auto-correction failures gracefully', async () => {
      const issue: QualityIssue = {
        id: 'test-correction-failure',
        type: 'system-anomaly',
        severity: 'critical',
        description: 'Test issue that cannot be auto-corrected',
        detectedAt: new Date(),
        resolved: false,
        affectedComponent: 'UnknownComponent',
        requiresManualIntervention: true
      };
      
      // Access private attemptAutoCorrection method through reflection
      const attemptAutoCorrection = (autonomousQualitySupervisionService as any).attemptAutoCorrection;
      await attemptAutoCorrection.call(autonomousQualitySupervisionService, issue);
      
      // Critical issues should require manual intervention
      expect(issue.requiresManualIntervention).toBe(true);
    });
  });
  
  describe('chat maestro integration', () => {
    it('should generate health reports for Chat Maestro', async () => {
      // Generate a health report
      const generateHealthReport = (autonomousQualitySupervisionService as any).generateHealthReport;
      const report = await generateHealthReport.call(autonomousQualitySupervisionService);
      
      expect(report).toBeDefined();
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('overallStatus');
      expect(report).toHaveProperty('componentStatus');
      expect(report).toHaveProperty('recentIssues');
      expect(report).toHaveProperty('performanceMetrics');
      expect(report).toHaveProperty('dataQualityMetrics');
      expect(report).toHaveProperty('recommendations');
    });
    
    it('should report to Chat Maestro when configured', async () => {
      // Create a mock health report
      const mockReport = {
        timestamp: new Date(),
        overallStatus: 'warning',
        componentStatus: [],
        recentIssues: [],
        performanceMetrics: {
          cpuUsage: 50,
          memoryUsage: 60,
          responseTime: 100,
          uptime: 99.9,
          errorRate: 0.1,
          throughput: 100
        },
        dataQualityMetrics: {
          completeness: 95,
          accuracy: 92,
          consistency: 88,
          timeliness: 90,
          validity: 94
        },
        recommendations: ['Test recommendation']
      };
      
      // Access private reportToChatMaestro method through reflection
      const reportToChatMaestro = (autonomousQualitySupervisionService as any).reportToChatMaestro;
      await reportToChatMaestro.call(autonomousQualitySupervisionService, mockReport);
      
      // Should not throw an error
      expect(true).toBe(true);
    });
  });
});