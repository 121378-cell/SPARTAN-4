/**
 * Verification test for SPARTAN 4 Marketplace
 * This test verifies that the marketplace components work correctly
 */

const { MarketplaceAIEngine } = require('../lib/marketplace-ai-engine');

describe('Marketplace Verification', () => {
  test('should import and instantiate MarketplaceAIEngine', () => {
    const engine = new MarketplaceAIEngine();
    expect(engine).toBeDefined();
    expect(typeof engine.generateRecommendations).toBe('function');
  });

  test('should filter products by category', () => {
    const engine = new MarketplaceAIEngine();
    const equipmentProducts = engine.filterByCategory('equipment');
    expect(Array.isArray(equipmentProducts)).toBe(true);
  });

  test('should search products', () => {
    const engine = new MarketplaceAIEngine();
    const results = engine.searchProducts('barbell');
    expect(Array.isArray(results)).toBe(true);
  });

  test('should generate recommendations', () => {
    const engine = new MarketplaceAIEngine();
    
    // Sample user data
    const userData = {
      name: 'Test User',
      age: 25,
      weight: 70,
      height: 175,
      fitnessLevel: 'beginner',
      goals: ['muscle gain']
    };

    // Sample user preferences
    const userPreferences = {
      fitnessLevel: 'beginner',
      goals: ['muscle gain'],
      trainingLocation: 'home',
      equipment: {
        dumbbells: false,
        barbell: false,
        kettlebells: false,
        resistanceBands: false,
        pullUpBar: false,
        bench: false,
        machine: false
      },
      budgetRange: { min: 0, max: 500 }
    };

    const recommendations = engine.generateRecommendations(userPreferences, userData);
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
  });
});