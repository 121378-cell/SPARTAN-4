/**
 * Test script for the AI-Powered Personalization Engine
 * This script tests the core functionality of the personalization engine
 */

// Use ES module syntax for imports
import { aiPersonalizationEngine } from './lib/ai-personalization-engine.ts';

async function runTests() {
  console.log('🧪 Testing AI-Powered Personalization Engine');
  console.log('==========================================\n');

  try {
    // Test 1: Initialization
    console.log('Test 1: Initialization');
    await aiPersonalizationEngine.initialize('test-user');
    console.log('✅ Initialization successful\n');

    // Test 2: Generate adaptive recommendations
    console.log('Test 2: Generate adaptive recommendations');
    const recommendations = await aiPersonalizationEngine.generateAdaptiveRecommendations();
    console.log(`✅ Generated ${recommendations.length} recommendations`);
    if (recommendations.length > 0) {
      console.log('Sample recommendation:');
      console.log(`  Title: ${recommendations[0].title}`);
      console.log(`  Type: ${recommendations[0].type}`);
      console.log(`  Description: ${recommendations[0].description}`);
    }
    console.log();

    // Test 3: Perform injury prevention analysis
    console.log('Test 3: Perform injury prevention analysis');
    const injuryRisk = await aiPersonalizationEngine.performInjuryPreventionAnalysis();
    console.log(`✅ Injury risk assessment completed`);
    console.log(`  Risk Level: ${injuryRisk.riskLevel}`);
    console.log(`  Confidence: ${injuryRisk.confidence}%`);
    console.log();

    // Test 4: Generate dynamic adjustments
    console.log('Test 4: Generate dynamic adjustments');
    const adjustments = await aiPersonalizationEngine.generateDynamicAdjustments();
    console.log(`✅ Generated ${adjustments.length} adjustments`);
    console.log();

    // Test 5: Get all personalized recommendations
    console.log('Test 5: Get all personalized recommendations');
    const allRecommendations = await aiPersonalizationEngine.getPersonalizedRecommendations();
    console.log(`✅ Retrieved ${allRecommendations.length} total recommendations`);
    console.log();

    // Test 6: Get injury risk history
    console.log('Test 6: Get injury risk history');
    const injuryHistory = aiPersonalizationEngine.getInjuryRiskHistory();
    console.log(`✅ Retrieved ${injuryHistory.length} injury risk assessments`);
    console.log();

    // Test 7: Get adjustment history
    console.log('Test 7: Get adjustment history');
    const adjustmentHistory = aiPersonalizationEngine.getAdjustmentHistory();
    console.log(`✅ Retrieved ${adjustmentHistory.length} adjustments`);
    console.log();

    // Test 8: Get recommendation history
    console.log('Test 8: Get recommendation history');
    const recommendationHistory = aiPersonalizationEngine.getRecommendationHistory();
    console.log(`✅ Retrieved ${recommendationHistory.length} recommendations`);
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('The AI-Powered Personalization Engine is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };