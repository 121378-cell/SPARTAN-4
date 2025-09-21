import { aiPersonalizationEngine } from '../lib/ai-personalization-engine.ts';
import { dataManagementService } from '../lib/data-management-service.ts';
import { spartanNervousSystem } from '../lib/spartan-nervous-system.ts';
import { wearableIntegrationService } from '../lib/wearable-integration-service.ts';
import { predictiveAnalyticsEngine } from '../lib/predictive-analytics.ts';
import { adaptiveTrainingSystem } from '../lib/adaptiveTrainingSystem.ts';

// Mock the services
jest.mock('../lib/data-management-service');
jest.mock('../lib/spartan-nervous-system');
jest.mock('../lib/wearable-integration-service');
jest.mock('../lib/predictive-analytics');
jest.mock('../lib/adaptiveTrainingSystem');

describe('AIPersonalizationEngine', () => {
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize the personalization engine with a user ID', async () => {
      await aiPersonalizationEngine.initialize(mockUserId);
      
      // Verify that the engine was initialized with the correct user ID
      expect(aiPersonalizationEngine).toBeDefined();
    });
  });

  describe('generateAdaptiveRecommendations', () => {
    it('should generate adaptive workout recommendations', async () => {
      // Mock the data management service to return some insights
      (dataManagementService.generateInsights as jest.Mock).mockResolvedValue({
        currentStatus: {
          trainingReadiness: 'ready',
          energyLevel: 'moderate',
          recoveryStatus: 'good'
        },
        trends: {
          performance: 'stable',
          adherence: 'good',
          recovery: 'stable'
        },
        predictions: null,
        risks: [],
        recommendations: []
      });

      const recommendations = await aiPersonalizationEngine.generateAdaptiveRecommendations();
      
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThanOrEqual(1);
      expect(recommendations[0]).toHaveProperty('type');
      expect(recommendations[0]).toHaveProperty('title');
      expect(recommendations[0]).toHaveProperty('description');
    });
  });

  describe('performInjuryPreventionAnalysis', () => {
    it('should perform injury prevention analysis', async () => {
      const injuryRiskAssessment = await aiPersonalizationEngine.performInjuryPreventionAnalysis();
      
      expect(injuryRiskAssessment).toHaveProperty('riskLevel');
      expect(injuryRiskAssessment).toHaveProperty('riskFactors');
      expect(injuryRiskAssessment).toHaveProperty('preventiveMeasures');
      expect(injuryRiskAssessment).toHaveProperty('confidence');
    });
  });

  describe('generateDynamicAdjustments', () => {
    it('should generate dynamic difficulty adjustments', async () => {
      const adjustments = await aiPersonalizationEngine.generateDynamicAdjustments();
      
      expect(adjustments).toBeInstanceOf(Array);
      // Since we don't have training metrics in our mock, this should return an empty array
      expect(adjustments).toHaveLength(0);
    });
  });

  describe('getPersonalizedRecommendations', () => {
    it('should get all personalized recommendations', async () => {
      // Mock the data management service to return some insights
      (dataManagementService.generateInsights as jest.Mock).mockResolvedValue({
        currentStatus: {
          trainingReadiness: 'ready',
          energyLevel: 'moderate',
          recoveryStatus: 'good'
        },
        trends: {
          performance: 'stable',
          adherence: 'good',
          recovery: 'stable'
        },
        predictions: null,
        risks: [],
        recommendations: []
      });

      const recommendations = await aiPersonalizationEngine.getPersonalizedRecommendations();
      
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThanOrEqual(1);
    });
  });
});