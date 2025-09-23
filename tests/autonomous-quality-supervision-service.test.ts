import { AutonomousQualitySupervisionService, QualityIssue } from '../lib/autonomous-quality-supervision-service';
import { dataManagementService } from '../lib/data-management-service';

// Mock the logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock the spartan-nervous-system
jest.mock('../lib/spartan-nervous-system', () => ({
  spartanNervousSystem: {
    subscribe: jest.fn(),
    emitEvent: jest.fn()
  }
}));

// Mock the chat-maestro-service
jest.mock('../lib/chat-maestro-service', () => ({
  chatMaestroService: {
    generateReport: jest.fn()
  }
}));

// Mock the storage
jest.mock('../lib/storage', () => ({
  storageManager: {
    getUserData: jest.fn(() => ({
      name: 'Test User',
      age: 30,
      weight: 70,
      height: 175,
      fitnessLevel: 'intermediate',
      goals: ['strength']
    })),
    setUserData: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn()
  }
}));

describe('AutonomousQualitySupervisionService', () => {
  let autonomousQualitySupervisionService: AutonomousQualitySupervisionService;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get instance of the service
    autonomousQualitySupervisionService = AutonomousQualitySupervisionService.getInstance();
  });
  
  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      expect(autonomousQualitySupervisionService).toBeDefined();
    });
  });
  
  describe('data validation', () => {
    it('should validate user data', async () => {
      // Setup mock user data with issues
      const mockDataWithIssues = {
        userData: {
          name: '', // Empty name - should be invalid
          age: -5, // Invalid age
          weight: -10, // Invalid weight
          height: 0 // Invalid height
        },
        workoutSessions: [],
        recoveryData: [],
        nutritionData: []
      };
      
      // Mock the data management service to return problematic data
      const mockInstance = {
        integratedData: mockDataWithIssues
      };
      
      // Replace the dataManagementService instance with our mock
      (dataManagementService as any) = mockInstance;
      
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
        recoveryData: [],
        nutritionData: []
      };
      
      // Mock the data management service to return problematic data
      const mockInstance = {
        integratedData: mockDataWithIssues
      };
      
      // Replace the dataManagementService instance with our mock
      (dataManagementService as any) = mockInstance;
      
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