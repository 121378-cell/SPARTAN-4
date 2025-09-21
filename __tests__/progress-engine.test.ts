import { ProgressTrackingEngine } from '../modals/progress-engine';

// Mock user preferences and context
const mockUserPreferences = {
  equipmentAvailable: ['barbell', 'dumbbells', 'bench'],
  preferredGripTypes: ['pronated', 'supinated'],
  injuryPrecautions: [],
  motivationTriggers: ['progress', 'competition'],
  feedbackPreferences: {
    formCorrection: 'direct' as const,
    motivation: 'competitive' as const,
    safety: 'balanced' as const
  }
};

const mockUserContext = {
  currentEnergyLevel: 8,
  stressLevel: 3,
  sleepQuality: 7,
  nutritionStatus: 'good' as const,
  timeAvailable: 60,
  environment: 'gym' as const
};

describe('ProgressTrackingEngine', () => {
  let engine: ProgressTrackingEngine;

  beforeEach(() => {
    engine = new ProgressTrackingEngine(mockUserPreferences, mockUserContext);
  });

  describe('getProgressMetrics', () => {
    it('should return progress metrics', () => {
      const metrics = engine.getProgressMetrics();
      
      expect(metrics).toBeDefined();
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);
      
      // Check that we have metrics from different categories
      const categories = metrics.map(m => m.category);
      expect(categories).toContain('strength');
      expect(categories).toContain('endurance');
      expect(categories).toContain('body-composition');
      expect(categories).toContain('adherence');
    });

    it('should calculate progress percentages correctly', () => {
      const metrics = engine.getProgressMetrics();
      
      metrics.forEach(metric => {
        if (metric.targetValue && metric.currentValue !== undefined) {
          // For metrics with targets, check that progress percentage is calculated
          expect(metric.progressPercentage).toBeDefined();
        }
      });
    });
  });

  describe('generateProgressVisualization', () => {
    it('should generate a progress visualization', () => {
      const config = {
        metricId: 'strength-total-volume',
        chartType: 'line' as const,
        timeRange: 'month' as const,
        showTrendLine: true,
        showTargetLine: true,
        showComparison: true
      };
      
      const visualization = engine.generateProgressVisualization(config);
      
      expect(visualization).toBeDefined();
      expect(visualization.id).toContain('viz-');
      expect(visualization.title).toBe('Volumen de Entrenamiento');
      expect(visualization.type).toBe('chart');
      expect(visualization.chartSubType).toBe('line');
      expect(visualization.config).toEqual(config);
      expect(Array.isArray(visualization.data)).toBe(true);
    });
  });

  describe('getBodyCompositionHistory', () => {
    it('should return body composition history', () => {
      const history = engine.getBodyCompositionHistory();
      
      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      
      if (history.length > 0) {
        const firstEntry = history[0];
        expect(firstEntry).toHaveProperty('date');
        expect(firstEntry).toHaveProperty('weight');
        expect(firstEntry).toHaveProperty('bodyFatPercentage');
        expect(firstEntry).toHaveProperty('muscleMass');
      }
    });
  });

  describe('getStrengthMetrics', () => {
    it('should return strength metrics', () => {
      const metrics = engine.getStrengthMetrics();
      
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
      
      // Check that we have at least one exercise
      const exerciseIds = Object.keys(metrics);
      expect(exerciseIds.length).toBeGreaterThanOrEqual(1);
      
      if (exerciseIds.length > 0) {
        const firstExercise = metrics[exerciseIds[0]];
        expect(firstExercise).toHaveProperty('exerciseId');
        expect(firstExercise).toHaveProperty('exerciseName');
        expect(firstExercise).toHaveProperty('oneRepMax');
        expect(firstExercise).toHaveProperty('volumeLoad');
      }
    });
  });

  describe('generateProjections', () => {
    it('should generate progress projections', () => {
      const projections = engine.generateProjections();
      
      expect(projections).toBeDefined();
      expect(Array.isArray(projections)).toBe(true);
      expect(projections.length).toBeGreaterThan(0);
      
      projections.forEach(projection => {
        expect(projection).toHaveProperty('metricId');
        expect(projection).toHaveProperty('currentValue');
        expect(projection).toHaveProperty('projectedValue');
        expect(projection).toHaveProperty('confidence');
        expect(projection).toHaveProperty('timeframe');
        expect(projection).toHaveProperty('scenario');
        expect(projection).toHaveProperty('factors');
        expect(Array.isArray(projection.factors)).toBe(true);
      });
    });
  });

  describe('generateComparativeAnalysis', () => {
    it('should generate comparative analysis', () => {
      const analysis = engine.generateComparativeAnalysis();
      
      expect(analysis).toBeDefined();
      expect(Array.isArray(analysis)).toBe(true);
      
      analysis.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('metricId');
        expect(item).toHaveProperty('userValue');
        expect(item).toHaveProperty('comparisonValue');
        expect(item).toHaveProperty('difference');
        expect(item).toHaveProperty('significance');
      });
    });
  });

  describe('generateChatMaestroExplanation', () => {
    it('should generate Chat Maestro explanation for strength metrics', () => {
      const explanation = engine.generateChatMaestroExplanation('strength-total-volume');
      
      expect(explanation).toBeDefined();
      expect(explanation.id).toContain('exp-');
      expect(explanation.metricId).toBe('strength-total-volume');
      expect(explanation.explanation).toBeDefined();
      expect(Array.isArray(explanation.keyInsights)).toBe(true);
      expect(Array.isArray(explanation.recommendations)).toBe(true);
      expect(explanation.confidence).toBeDefined();
      expect(explanation.timestamp).toBeDefined();
    });

    it('should generate Chat Maestro explanation for endurance metrics', () => {
      const explanation = engine.generateChatMaestroExplanation('endurance-vo2max');
      
      expect(explanation).toBeDefined();
      expect(explanation.metricId).toBe('endurance-vo2max');
      expect(explanation.explanation).toBeDefined();
    });

    it('should generate default explanation for unknown metrics', () => {
      const explanation = engine.generateChatMaestroExplanation('unknown-metric');
      
      expect(explanation).toBeDefined();
      expect(explanation.metricId).toBe('unknown-metric');
      expect(explanation.explanation).toContain('Análisis en progreso');
    });
  });

  describe('checkForAlerts', () => {
    it('should check for progress alerts', () => {
      const alerts = engine.checkForAlerts();
      
      expect(alerts).toBeDefined();
      expect(Array.isArray(alerts)).toBe(true);
      
      // Check alert structure
      alerts.forEach(alert => {
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('type');
        expect(alert).toHaveProperty('metricId');
        expect(alert).toHaveProperty('severity');
        expect(alert).toHaveProperty('message');
        expect(alert).toHaveProperty('triggeredAt');
        expect(alert).toHaveProperty('resolved');
      });
    });
  });

  describe('resolveAlert', () => {
    it('should resolve an alert', () => {
      // First, generate some alerts
      const alerts = engine.checkForAlerts();
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        const notes = 'Issue resolved after adjusting training volume';
        
        // Resolve the alert
        engine.resolveAlert(alertId, notes);
        
        // Check that the alert was resolved
        const updatedAlerts = engine.checkForAlerts();
        const resolvedAlert = updatedAlerts.find(a => a.id === alertId);
        
        expect(resolvedAlert).toBeDefined();
        if (resolvedAlert) {
          expect(resolvedAlert.resolved).toBe(true);
          expect(resolvedAlert.resolutionNotes).toBe(notes);
        }
      }
    });
  });
});