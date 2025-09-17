// Simple test to verify that components can be imported without errors

describe('Component Imports', () => {
  it('should import PredictiveAnalyticsDashboard without errors', () => {
    expect(() => {
      require('../components/PredictiveAnalyticsDashboard');
    }).not.toThrow();
  });

  it('should import predictive analytics engine without errors', () => {
    expect(() => {
      require('../lib/predictive-analytics');
    }).not.toThrow();
  });
});